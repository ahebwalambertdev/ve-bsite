import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        snow: {
          DEFAULT: '#FFFAF6',
          light: '#FFFFFF',
        },
        'dusty-olive': {
          DEFAULT: '#7C8B74',
          dark: '#62705B',
          light: '#93A38B',
        },
        'carbon-black': {
          DEFAULT: '#252525',
          dark: '#171717',
          light: '#383838',
        },
        'soft-linen': {
          DEFAULT: '#DDE3D8',
          dark: '#CAD1C5',
          light: '#EAF0E5',
        },
        canvas: '#FFFAF6',
        surface: {
          DEFAULT: '#FFFAF6',
          subtle: '#DDE3D8',
          dark: '#252525',
        },
        accent: '#7C8B74',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Newsreader', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(#FFFAF6, #7C8B74, #252525, #DDE3D8)',
        'brand-gradient-r': 'linear-gradient(90deg, #FFFAF6, #7C8B74, #252525, #DDE3D8)',
        'brand-gradient-b': 'linear-gradient(180deg, #FFFAF6, #7C8B74, #252525, #DDE3D8)',
        'brand-horizontal': 'linear-gradient(90deg, #FFFAF6, #DDE3D8)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(37, 37, 37, 0.04), 0 4px 12px rgba(37, 37, 37, 0.03)',
        elevated: '0 8px 24px rgba(37, 37, 37, 0.06), 0 2px 6px rgba(37, 37, 37, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;
