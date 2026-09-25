'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JournalPost } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2, 
  FileText, 
  RefreshCw 
} from 'lucide-react';

export function JournalList() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/journal');
      if (!res.ok) throw new Error('Failed to load journal articles');
      const json = await res.json();
      if (json.success && json.data) {
        setPosts(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch articles');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching posts';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTogglePublish = async (post: JournalPost) => {
    try {
      const updatedStatus = !post.is_published;
      const res = await fetch(`/api/admin/journal/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          is_published: updatedStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle publish status');

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_published: updatedStatus } : p
        )
      );
    } catch (err) {
      console.error('[Toggle publish failed]', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/journal/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[Delete post failed]', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-snow p-4 rounded-xl border border-soft-linen shadow-xs">
        <div>
          <h2 className="font-serif text-lg font-bold text-carbon-black flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-dusty-olive" />
            Ve Journal Publications
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Editorial articles, buyer guides, and merchant stories published to `/journal`.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            disabled={isLoading}
            className="p-2 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/50 rounded-lg transition-colors border border-soft-linen"
            title="Refresh articles"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link href="/admin/journal/new">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Write New Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <Card className="border-soft-linen overflow-hidden bg-white shadow-xs">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs border-b border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchPosts} className="underline font-semibold ml-2">
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-soft-linen/40 text-neutral-600 border-b border-soft-linen select-none font-medium">
              <tr>
                <th className="py-3 px-4">Title &amp; Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-linen/60">
              {isLoading && posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-dusty-olive" />
                    Loading journal articles...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No articles found. Click "Write New Article" to start your first story.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-soft-linen/20 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-carbon-black truncate">
                        {post.title}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-400 truncate">
                        /journal/{post.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-soft-linen text-neutral-700 text-[11px]">
                        {post.category || 'Ecosystem'}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4 text-neutral-600">
                      {post.author || 'Ve Editorial'}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                          post.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {post.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 text-neutral-400" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Published Date */}
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-UG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/journal/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-carbon-black rounded transition-colors"
                          title="View live article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/journal/${post.id}/edit`}
                          className="p-1.5 text-neutral-600 hover:text-dusty-olive rounded transition-colors"
                          title="Edit article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-snow border-t border-soft-linen text-xs text-neutral-500">
          Total published and draft articles: <span className="font-semibold text-carbon-black">{posts.length}</span>
        </div>
      </Card>
    </div>
  );
}
