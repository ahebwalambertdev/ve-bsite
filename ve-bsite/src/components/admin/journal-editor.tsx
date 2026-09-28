'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JournalPost } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Edit3, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface JournalEditorProps {
  initialPost?: Partial<JournalPost>;
  postId?: string;
}

export function JournalEditor({ initialPost, postId }: JournalEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(postId);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [category, setCategory] = useState(initialPost?.category || 'Vendor Spotlight');
  const [author, setAuthor] = useState(initialPost?.author || 'Ve Editorial Team');
  const [readTimeMinutes, setReadTimeMinutes] = useState(initialPost?.read_time_minutes || 4);
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url || '/images/hero-fashion.jpg');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [body, setBody] = useState(initialPost?.body || '');
  const [isPublished, setIsPublished] = useState(initialPost?.is_published ?? true);

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage('Please provide both an article title and content body.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      author,
      read_time_minutes: readTimeMinutes,
      cover_image_url: coverImageUrl,
      excerpt,
      body,
      is_published: isPublished,
    };

    try {
      const url = isEditing ? `/api/admin/journal/${postId}` : '/api/admin/journal';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save journal article');
      }

      setStatusMessage('Article saved successfully.');
      setTimeout(() => {
        router.push('/admin/journal');
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving article';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/journal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-carbon-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal Publications
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {isSaving ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Metadata Form */}
      <Card className="p-6 bg-white border-soft-linen shadow-xs space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Article Headline Title
          </label>
          <input
            type="text"
            placeholder="e.g. How long do fashion deliveries take in Kampala?"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3.5 py-2 text-base font-serif bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive text-carbon-black"
          />
        </div>

        {/* Slug & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              URL Slug
            </label>
            <div className="flex items-center">
              <span className="text-xs text-neutral-400 bg-soft-linen/50 px-2 py-2 border border-r-0 border-soft-linen rounded-l-lg font-mono">
                /journal/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-name"
                className="w-full px-3 py-2 text-xs font-mono bg-snow border border-soft-linen rounded-r-lg focus:outline-none focus:border-dusty-olive"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
            >
              <option value="Vendor Spotlight">Vendor Spotlight</option>
              <option value="Kampala Style & Culture">Kampala Style &amp; Culture</option>
              <option value="Consumer Guide">Consumer Guide</option>
              <option value="Ecosystem">Ecosystem</option>
              <option value="Engineering & Trust">Engineering &amp; Trust</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ve Editorial Team"
              className="w-full px-3 py-2 text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
            />
          </div>
        </div>

        {/* Read Time & Cover Image Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Read Time (Minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(parseInt(e.target.value, 10) || 4)}
              className="w-full px-3 py-2 text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Cover Image URL or Cloudinary Path
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="/images/hero-fashion.jpg"
                className="w-full px-3 py-2 text-xs font-mono bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
              />
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Excerpt / Meta Description (1-2 sentences for preview &amp; search engines)
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A concise synopsis of the article..."
            className="w-full px-3.5 py-2 text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dusty-olive"></div>
            <span className="ml-3 text-xs font-semibold text-carbon-black">
              {isPublished ? 'Publicly Published on Website' : 'Save as Private Draft'}
            </span>
          </label>
        </div>
      </Card>

      {/* Content Editor with Tabs */}
      <Card className="border-soft-linen overflow-hidden bg-white shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-soft-linen/30 border-b border-soft-linen">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('write')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'write'
                  ? 'bg-carbon-black text-snow'
                  : 'text-neutral-600 hover:text-carbon-black'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Markdown Content
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-carbon-black text-snow'
                  : 'text-neutral-600 hover:text-carbon-black'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <span className="text-[11px] text-neutral-400 font-mono">
            {body.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        {activeTab === 'write' ? (
          <div className="p-4">
            <textarea
              rows={18}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article in Markdown... Use ## for section headings, standard bullet lists, tables, etc."
              className="w-full p-4 font-mono text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive leading-relaxed text-carbon-black resize-y"
            />
          </div>
        ) : (
          <div className="p-8 prose prose-neutral max-w-none">
            <h1 className="font-serif text-3xl text-carbon-black">{title || 'Untitled Article'}</h1>
            <div className="text-xs text-neutral-500 mb-6 flex items-center gap-3">
              <span>By {author}</span>
              <span>•</span>
              <span>{category}</span>
              <span>•</span>
              <span>{readTimeMinutes} min read</span>
            </div>

            {/* Markdown rendered text blocks */}
            <div className="space-y-4 text-sm leading-relaxed text-carbon-black/80 whitespace-pre-line font-sans">
              {body || 'No content written yet.'}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
