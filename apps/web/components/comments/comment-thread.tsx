'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, ThumbsUp, LogIn, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { authStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

interface CommentUser {
  profile?: { displayName?: string; username?: string; avatarUrl?: string };
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
}

export interface Comment {
  id: string;
  content: string;
  upvotes: number;
  createdAt: string;
  user: CommentUser;
  replies: Reply[];
}

export function CommentThread({ assetType, assetSymbol }: { assetType: 'STOCK' | 'CRYPTO'; assetSymbol: string }) {
  const queryClient = useQueryClient();
  const user = authStore((state) => state.user);
  const isAuthenticated = Boolean(user);

  const [draft, setDraft] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  const queryKey = ['comments', assetType, assetSymbol];

  const { data: comments = [], isLoading: isFetchingComments } = useQuery<Comment[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get('/comments', { params: { assetType, assetSymbol } });
      return data;
    },
  });

  const createComment = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/comments/create', { assetType, assetSymbol, content: draft });
      return data;
    },
    onSuccess: () => {
      setDraft('');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const createReply = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data } = await api.post(`/comments/reply/${commentId}`, { content });
      return data;
    },
    onSuccess: () => {
      setReplyDraft('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const upvote = useMutation({
    mutationFn: async (commentId: string) => {
      const { data } = await api.patch(`/comments/upvote/${commentId}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const handlePostComment = () => {
    if (!draft.trim() || createComment.isPending) return;
    createComment.mutate();
  };

  const handlePostReply = (commentId: string) => {
    if (!replyDraft.trim() || createReply.isPending) return;
    createReply.mutate({ commentId, content: replyDraft });
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Community discussion</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {isFetchingComments ? '...' : `${comments.length} comments`}
        </span>
      </div>

      {isAuthenticated ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={createComment.isPending}
            className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Share a market take or portfolio idea..."
          />
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-xs text-slate-400 sm:block">
              Be respectful and keep discussions relevant to {assetSymbol}.
            </p>
            <button
              onClick={handlePostComment}
              disabled={!draft.trim() || createComment.isPending}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
              type="button"
            >
              {createComment.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Post comment
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Sign in
            </Link>{' '}
            to join the community discussion.
          </p>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <LogIn className="size-4" />
            Login
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {isFetchingComments && comments.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">
                    {comment.user?.profile?.displayName ?? comment.user?.profile?.username ?? 'Investor'}
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap break-words text-slate-600">{comment.content}</p>
                </div>
                <button
                  type="button"
                  onClick={() => isAuthenticated && upvote.mutate(comment.id)}
                  disabled={!isAuthenticated || upvote.isPending}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 border border-slate-200 transition",
                    isAuthenticated && "hover:bg-brand hover:text-white hover:border-brand",
                    "disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                  aria-label={`Upvote comment by ${comment.user?.profile?.displayName ?? 'Investor'}`}
                >
                  <ThumbsUp className="size-3.5" />
                  {comment.upvotes}
                </button>
              </div>

              {comment.replies?.length > 0 && (
                <div className="mt-2 space-y-2 border-l-2 border-slate-200 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <span className="font-semibold text-slate-900">
                        {reply.user?.profile?.displayName ?? reply.user?.profile?.username ?? 'Investor'}
                      </span>
                      <span className="text-slate-600">: {reply.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Composer */}
              {isAuthenticated && (
                <div className="pt-1">
                  {replyingTo === comment.id ? (
                    <div className="flex gap-2">
                      <input
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                        autoFocus
                      />
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        disabled={!replyDraft.trim() || createReply.isPending}
                        className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white disabled:opacity-60 transition"
                      >
                        {createReply.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Reply'}
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyDraft(''); }}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-brand transition"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
            <MessageCircle className="mx-auto mb-3 size-8 text-slate-300" />
            No comments yet. Be the first to start the discussion.
          </div>
        )}
      </div>
    </Card>
  );
}
