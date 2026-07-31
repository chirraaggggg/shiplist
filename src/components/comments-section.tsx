"use client";

import { useState, useOptimistic, useTransition } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Trash2, Send, CornerDownRight, ShieldAlert } from "lucide-react";
import { postComment, deleteComment, CommentNode } from "@/app/actions/comments";

interface CommentsProps {
  initialComments: CommentNode[];
  productId: string;
  productName: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

type ActionState = {
  type: "add" | "delete";
  comment?: CommentNode;
  commentId?: string;
  parentId?: string;
};

export function CommentsSection({
  initialComments,
  productId,
  productName,
  currentUserId = "user_mock_123", // Default for dev mode
  isAdmin = true,
}: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic state management for instant UI updates
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    initialComments,
    (state, action: ActionState) => {
      if (action.type === "add" && action.comment) {
        if (!action.parentId) {
          return [action.comment, ...state];
        }
        return state.map((parent) => {
          if (parent.id === action.parentId) {
            return {
              ...parent,
              replies: [...(parent.replies || []), action.comment!],
            };
          }
          return parent;
        });
      }

      if (action.type === "delete" && action.commentId) {
        return state
          .map((parent) => {
            if (parent.id === action.commentId) {
              return { ...parent, deleted: true, body: "[Comment deleted]" };
            }
            if (parent.replies) {
              return {
                ...parent,
                replies: parent.replies.map((reply) =>
                  reply.id === action.commentId
                    ? { ...reply, deleted: true, body: "[Comment deleted]" }
                    : reply
                ),
              };
            }
            return parent;
          });
      }

      return state;
    }
  );

  const handlePostComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const text = parentId ? replyTextMap[parentId] || "" : commentText;
    if (!text.trim()) return;

    setErrorMsg(null);

    const tempId = "temp_" + Date.now();
    const tempComment: CommentNode = {
      id: tempId,
      body: text.trim(),
      author: "You",
      avatar: "https://ui-avatars.com/api/?name=You&background=0F766E&color=fff",
      userId: currentUserId,
      createdAt: new Date().toISOString(),
      deleted: false,
      replies: [],
    };

    if (parentId) {
      setReplyTextMap((prev) => ({ ...prev, [parentId]: "" }));
      setActiveReplyId(null);
    } else {
      setCommentText("");
    }

    startTransition(async () => {
      setOptimisticComments({ type: "add", comment: tempComment, parentId });
      const result = await postComment(productId, text, parentId);
      if (!result.success) {
        setErrorMsg(result.error || "Failed to post comment");
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setErrorMsg(null);

    startTransition(async () => {
      setOptimisticComments({ type: "delete", commentId });
      const result = await deleteComment(commentId);
      if (!result.success) {
        setErrorMsg(result.error || "Failed to delete comment");
      }
    });
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        Discussion ({optimisticComments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
      </h2>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          {errorMsg}
        </div>
      )}

      {/* Main Comment Input */}
      <form onSubmit={(e) => handlePostComment(e)} className="mb-8 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`What do you think about ${productName}?`}
          className="w-full resize-none h-24 p-3 rounded-lg border border-border/50 bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">Markdown supported</span>
          <button
            type="submit"
            disabled={isPending || !commentText.trim()}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" />
            Comment
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {optimisticComments.map((comment) => (
          <div key={comment.id} className="bg-card border border-border/40 rounded-xl p-4 shadow-sm">
            {/* Top Level Comment */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden border border-border/50">
                  <Image src={comment.avatar} alt={comment.author} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed ${comment.deleted ? "text-muted-foreground italic" : "text-foreground"}`}>
                    {comment.body}
                  </p>

                  {!comment.deleted && (
                    <button
                      onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                      className="text-xs text-muted-foreground hover:text-primary font-medium mt-2 flex items-center gap-1"
                    >
                      <CornerDownRight className="h-3 w-3" />
                      Reply
                    </button>
                  )}
                </div>
              </div>

              {/* Moderation: Delete button if own comment or admin */}
              {!comment.deleted && (comment.userId === currentUserId || isAdmin) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  title={isAdmin && comment.userId !== currentUserId ? "Admin Delete" : "Delete your comment"}
                  className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Reply Input Box */}
            {activeReplyId === comment.id && (
              <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-3 ml-12 p-3 rounded-lg bg-muted/40 border border-border/50">
                <textarea
                  value={replyTextMap[comment.id] || ""}
                  onChange={(e) => setReplyTextMap({ ...replyTextMap, [comment.id]: e.target.value })}
                  placeholder={`Reply to ${comment.author}...`}
                  className="w-full h-16 p-2 text-xs rounded border border-border/50 bg-background outline-none focus:border-primary"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1 text-xs rounded border hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground font-semibold"
                  >
                    Reply
                  </button>
                </div>
              </form>
            )}

            {/* Nested Replies (1 level deep) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-10 space-y-3 border-l-2 border-border/30 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start justify-between gap-3 pt-2">
                    <div className="flex gap-2.5">
                      <div className="relative h-7 w-7 flex-shrink-0 rounded-full overflow-hidden border border-border/50">
                        <Image src={reply.avatar} alt={reply.author} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-xs">{reply.author}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 leading-relaxed ${reply.deleted ? "text-muted-foreground italic" : "text-foreground"}`}>
                          {reply.body}
                        </p>
                      </div>
                    </div>

                    {!reply.deleted && (reply.userId === currentUserId || isAdmin) && (
                      <button
                        onClick={() => handleDeleteComment(reply.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
