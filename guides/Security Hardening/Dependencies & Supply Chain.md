# Dependencies and Supply Chain: What That AI-Added Package Quietly Pulled In

**The mistake in one sentence:** an AI assistant adds a package to solve a problem, you approve the import, and neither of you audits the 47 transitive dependencies it dragged in — one of which runs a post-install script that phones home.

You ask an assistant to "add Markdown rendering." It picks a library, runs `npm install`, and the feature works. What you didn't see: the library depends on a syntax highlighter that depends on a WASM loader that depends on a package last updated in 2019 with a known prototype-pollution vulnerability. That's three levels deep, invisible in your import statement, and now it ships to every user's browser.

---

## What it looks like

### The invisible dependency tree

```bash
# You asked for one package
npm install fancy-markdown-renderer

# You got this (npm ls --all | wc -l)
├── fancy-markdown-renderer@3.1.0
│   ├── highlight-engine@5.2.1
│   │   ├── old-wasm-loader@1.0.4        # last published 2019, 2 known CVEs
│   │   └── unsafe-regex-parser@0.8.0    # prototype pollution
│   ├── mdast-util-something@2.1.0
│   │   └── unist-util-visit@4.0.0
│   └── remark-parse@11.0.0
│       └── ... (18 more packages)
```

You see `import { render } from 'fancy-markdown-renderer'` in your code. You don't see `old-wasm-loader` or `unsafe-regex-parser`. Neither does your code reviewer. But they ship in your bundle and run on your server.

### The typosquatted package

```typescript
// The AI assistant wrote this — looks reasonable
import { validateEmail } from 'email-validatorr'  // note: two r's

// The real package is 'email-validator' (one r)
// 'email-validatorr' is a typosquat that exfiltrates .env to a remote server
```

AI assistants generate package names from training data. If the training data included a misspelled import or a blog post that referenced the wrong package, the assistant will confidently suggest it. Typosquatted packages are designed to look almost identical to the real thing.

### The post-install script

```json
// package.json of a dependency (three levels deep)
{
  "scripts": {
    "postinstall": "node setup.js"
  }
}
```

`setup.js` runs automatically when `npm install` completes. It has full access to the filesystem and network. Most post-install scripts are legitimate (compiling native modules, downloading binaries), but malicious ones can read `.env` files, steal SSH keys, or inject code into your build output.

## Why AI tools generate this

**Assistants optimize for "does this solve the problem," not "is this package trustworthy."** An assistant picks a library based on whether it matches the task description and appears in training data. It does not check download counts, maintainer reputation, last publish date, or dependency depth.

**Package names are text, and text can be wrong.** The assistant generates a string. Whether that string is the real package or a typosquat is not something it can verify at generation time. It's confident either way.

**Transitive dependencies are invisible in the code.** The assistant sees the one import it wrote. It has no way to see what that import pulls in at install time.

**AI-generated projects accumulate dependencies faster.** In a rapid prototyping session, an assistant might install 10 packages in 20 minutes. Without friction (code review, approval gates), the dependency tree grows faster than anyone can audit.

---

## What it costs

| Risk | Impact |
|---|---|
| **Known CVEs in transitive deps** | Vulnerabilities that attackers can exploit. Disclosed CVEs are actively scanned for. |
| **Typosquatted packages** | Malicious code execution: credential theft, data exfiltration, backdoors. |
| **Post-install scripts** | Arbitrary code execution at install time, before you run a single line of your own code. |
| **Abandoned packages** | No security patches. A vulnerability discovered tomorrow stays unpatched forever. |
| **Bloated bundle** | Every transitive dependency adds to your client-side JS. A "simple" library can add 200KB. |
| **License contamination** | A GPL transitive dependency can legally require you to open-source your entire project. |

---

## The fix: audit before you install

### Step 1: Check the package before adding it

Before running `npm install <anything>`, check these signals:

```bash
# 1. How popular is it? (downloads, dependents, stars)
npm info <package-name>

# 2. When was it last published? (>1 year ago = risk)
npm info <package-name> time

# 3. How many dependencies does it pull in?
npm pack <package-name> --dry-run 2>&1 | head -5

# 4. Check for known vulnerabilities
npx npm-audit-resolver <package-name>
```

| Signal | Green flag | Red flag |
|---|---|---|
| Weekly downloads | >10,000 | <100 |
| Last publish | Within 12 months | >2 years ago |
| Maintainers | Known org or multiple maintainers | Single anonymous account |
| Direct dependencies | 0–5 | 20+ |
| GitHub stars/issues | Active, responsive | Archived or no response to issues |
| Types | Has `@types/` or built-in TypeScript | No type definitions |

### Step 2: Audit after installing

```bash
# Run the built-in vulnerability scanner
npm audit

# See the full dependency tree
npm ls --all

# Find packages with post-install scripts (potential risk)
npx can-i-ignore-scripts  # or manually:
grep -r "postinstall\|preinstall" node_modules/*/package.json | head -20

# Check for known malicious packages
npx socket-security audit  # if using Socket.dev
```

### Step 3: Lock your dependencies

**Always commit your lockfile.** `package-lock.json` (npm) or `yarn.lock` (Yarn) pins every dependency to an exact version and registry URL. Without it, `npm install` can resolve to a different (potentially compromised) version.

```bash
# In CI/CD, always use ci (not install)
npm ci  # installs exactly what's in the lockfile, fails if lockfile is out of date
```

**Audit your lockfile for suspicious URLs:**

```bash
# All resolved URLs should point to registry.npmjs.org (or your private registry)
grep '"resolved":' package-lock.json | grep -v 'registry.npmjs.org' | head -10
# Any non-npmjs result is a red flag
```

### Step 4: Disable scripts by default

The nuclear option for post-install scripts:

```bash
# Globally disable lifecycle scripts
npm config set ignore-scripts true

# When you need to install a package that requires scripts (e.g., sharp, esbuild):
npm install --ignore-scripts=false sharp
```

Or use an `.npmrc` file at the project root:

```ini
# .npmrc
ignore-scripts=true
```

This prevents any `postinstall`, `preinstall`, or `install` script from running automatically. You'll need to explicitly run build scripts for packages that need them (like `sharp` or `@prisma/client`).

---

## The fix: ongoing monitoring

### npm audit in CI

Add to your CI pipeline so every PR is checked:

```yaml
# .github/workflows/audit.yml
name: Dependency Audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm audit --audit-level=high
```

### Dependabot or Renovate

Enable automated dependency update PRs. Both services create PRs when a dependency has a known vulnerability or a new version:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
```

### Socket.dev (deeper analysis)

Socket.dev analyses packages for suspicious behavior (network calls, filesystem access, obfuscated code) rather than just known CVEs. Install the GitHub app or use the CLI:

```bash
npx socket optimize  # analyses current dependencies for risks
```

---

## What to do when an AI assistant suggests a package

Before approving:

1. **Check the name character by character.** Typosquats differ by one character. `lodash` vs `Iodash`. `axios` vs `axois`.
2. **Check npmjs.com directly.** Verify downloads, maintainers, last publish date, and repository link.
3. **Ask: do I need this?** Many packages an assistant suggests can be replaced with a few lines of code. A 200-line utility function is often better than a 200KB dependency.
4. **Check the dependency count.** `npm info <package> dependencies` shows direct deps. If a "simple" utility pulls in 15 packages, look for a leaner alternative.

---

## Checklist

- [ ] `package-lock.json` is committed to version control.
- [ ] CI uses `npm ci`, not `npm install`.
- [ ] `npm audit` runs in CI and blocks on high/critical vulnerabilities.
- [ ] Dependabot or Renovate is enabled for automated security update PRs.
- [ ] Every new dependency is checked on npmjs.com before installation (downloads, maintainers, last publish, dep count).
- [ ] Package names suggested by AI are verified character by character against the canonical package.
- [ ] `.npmrc` has `ignore-scripts=true` (or scripts are reviewed before enabling).
- [ ] `package-lock.json` resolved URLs all point to `registry.npmjs.org` or your private registry.
- [ ] No dependency in the tree has a known critical CVE (`npm audit` passes).

---

## Prompt for your AI assistant

```text
Audit the dependency tree of this project for supply chain risks:

1. Run npm audit and list every high or critical vulnerability, including
   the path to the vulnerable package (direct vs transitive).
2. List every package with a postinstall or preinstall script.
3. List every package that was last published more than 18 months ago.
4. Check for any package name that looks like a typosquat of a well-known
   package (off-by-one character, different casing, extra suffix).
5. List the top 5 largest dependencies by installed size.

For each finding, give me: the package name, the risk, and a recommendation
(update, replace, or remove). Do not make changes yet — just report.
```
