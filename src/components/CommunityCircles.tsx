import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Plus,
  ShieldCheck,
  Baby,
  HeartCrack,
  Flame,
  Feather,
  Compass,
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';
import { COMMUNITY_CIRCLES } from '../data/circlesData';

interface CommunityCirclesProps {
  userProfile: UserProfile;
  selectedCircleId: string;
  setSelectedCircleId: (id: string) => void;
  onOpenVerification: () => void;
}

export const CommunityCircles: React.FC<CommunityCirclesProps> = ({
  userProfile,
  selectedCircleId,
  setSelectedCircleId,
  onOpenVerification,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [huggingPostId, setHuggingPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const url =
        selectedCircleId === 'all'
          ? '/api/community/posts'
          : `/api/community/posts?circleId=${selectedCircleId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCircleId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isPosting) return;

    const currentCircle =
      COMMUNITY_CIRCLES.find((c) => c.id === selectedCircleId) || COMMUNITY_CIRCLES[0];

    setIsPosting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circleId: currentCircle.id,
          circleTitle: currentCircle.title,
          pseudonym: userProfile.pseudonym,
          isVerified: userProfile.isVerified,
          content: newPostContent.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        setPosts([data.post, ...posts]);
        setNewPostContent('');
      }
    } catch (err) {
      console.error('Failed to post:', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSendHug = async (postId: string) => {
    setHuggingPostId(postId);
    setTimeout(() => setHuggingPostId(null), 1000);

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hugsCount: (p.hugsCount || 0) + 1 } : p))
    );

    try {
      await fetch(`/api/community/posts/${postId}/hug`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to hug:', err);
    }
  };

  const handleAddReply = async (postId: string) => {
    const text = replyInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudonym: userProfile.pseudonym,
          isVerified: userProfile.isVerified,
          content: text,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                replies: [...(p.replies || []), data.reply],
              };
            }
            return p;
          })
        );
        setReplyInputs({ ...replyInputs, [postId]: '' });
        setExpandedReplies({ ...expandedReplies, [postId]: true });
      }
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  const activeCircleObj = COMMUNITY_CIRCLES.find((c) => c.id === selectedCircleId);

  const getCircleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-4 h-4 text-purple-500" />;
      case 'HeartCrack':
        return <HeartCrack className="w-4 h-4 text-violet-500" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Feather':
        return <Feather className="w-4 h-4 text-indigo-500" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-emerald-500" />;
      default:
        return <Users className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Ethos */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-3 shadow-xs">
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>Vetted Safe Sisterhood Circles</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Walk with Women Who Understand Your Exact Situation
        </h2>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Share reflections anonymously, leave virtual hugs, and know you are never solitary in your sorrow.
        </p>
      </div>

      {/* Circle Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <button
          onClick={() => setSelectedCircleId('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition border ${
            selectedCircleId === 'all'
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-purple-50'
          }`}
        >
          All Circles
        </button>
        {COMMUNITY_CIRCLES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCircleId(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-2 border ${
              selectedCircleId === c.id
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-purple-50'
            }`}
          >
            {getCircleIcon(c.iconName)}
            <span>{c.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Circle Banner in Purple */}
      {activeCircleObj && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-purple-100/80 via-violet-50 to-indigo-50 border border-purple-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                {getCircleIcon(activeCircleObj.iconName)}
                <span>{activeCircleObj.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                {activeCircleObj.detailedDesc}
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 border border-purple-200 text-purple-900 shadow-2xs">
              {activeCircleObj.memberCount} Sisters in Circle
            </div>
          </div>
        </div>
      )}

      {/* Composer Card: Share Anonymously */}
      <form
        onSubmit={handleCreatePost}
        className="mb-8 bg-white rounded-3xl p-5 sm:p-6 border border-purple-200/90 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
            <span>Sharing as:</span>
            <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
              🌸 {userProfile.pseudonym}
            </span>
            {userProfile.isVerified ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Sister</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenVerification}
                className="text-[11px] text-amber-700 hover:underline"
              >
                (Unverified - click to do 10s video check)
              </button>
            )}
          </div>
          <span className="text-xs text-stone-400">Anonymous & Encrypted</span>
        </div>

        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder={`Share what you're walking through right now in ${
            activeCircleObj ? activeCircleObj.title : 'the community'
          }...`}
          rows={3}
          className="w-full p-3.5 rounded-2xl bg-purple-50/40 border border-purple-200 focus:bg-white focus:border-purple-400 focus:outline-hidden text-sm text-stone-800 placeholder:text-stone-400 resize-none leading-relaxed"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Be kind and respectful. No hate, self-promotion, or unsolicited advice.
          </p>
          <button
            type="submit"
            disabled={isPosting || !newPostContent.trim()}
            className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Post Anonymously</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            Connecting you with sister reflections...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
            <Heart className="w-10 h-10 text-purple-300 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-stone-800">No posts in this circle yet</h4>
            <p className="text-xs text-stone-500 mt-1">
              Be the first courageous sister to share what is on your heart.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs hover:border-purple-300 transition"
            >
              {/* Post Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-xs font-bold">
                    {post.pseudonym.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">{post.pseudonym}</span>
                      {post.isVerified && (
                        <span
                          className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200"
                          title="Verified via 5-10s video call check"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {new Date(post.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800">
                  {post.circleTitle}
                </span>
              </div>

              {/* Content */}
              <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4 font-sans">
                {post.content}
              </p>

              {/* Post Action Bar */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 relative">
                {/* Send Hug Button */}
                <div className="relative">
                  <button
                    onClick={() => handleSendHug(post.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold transition border border-purple-200 cursor-pointer group"
                  >
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-500 group-hover:scale-125 transition-transform" />
                    <span>Send Virtual Hug</span>
                    <span className="bg-white px-1.5 py-0.2 rounded-full text-[11px] font-bold text-purple-900 shadow-2xs">
                      {post.hugsCount || 0}
                    </span>
                  </button>
                  {huggingPostId === post.id && (
                    <span className="absolute -top-6 left-6 text-purple-600 font-bold text-xs animate-float-heart pointer-events-none">
                      💜 +1 Hug!
                    </span>
                  )}
                </div>

                {/* Reply Toggle */}
                <button
                  onClick={() =>
                    setExpandedReplies({
                      ...expandedReplies,
                      [post.id]: !expandedReplies[post.id],
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-purple-700 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>
                    {post.replies?.length ? `${post.replies.length} Sister Replies` : 'Reply softly'}
                  </span>
                </button>
              </div>

              {/* Replies Thread */}
              {(expandedReplies[post.id] || (post.replies && post.replies.length > 0)) && (
                <div className="mt-4 pt-4 border-t border-purple-100 space-y-3 bg-purple-50/50 p-4 rounded-2xl">
                  {post.replies && post.replies.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-white p-3 rounded-xl border border-purple-100 text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-purple-950">🌸 {reply.pseudonym}</span>
                            {reply.isVerified && (
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            )}
                            <span className="text-[10px] text-stone-400">
                              {new Date(reply.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyInputs[post.id] || ''}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddReply(post.id);
                        }
                      }}
                      placeholder={`Send warm words as ${userProfile.pseudonym}...`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-xs sm:text-sm focus:border-purple-400 focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      disabled={!replyInputs[post.id]?.trim()}
                      className="p-2 rounded-xl bg-purple-600 text-white disabled:opacity-40 hover:bg-purple-700 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};
