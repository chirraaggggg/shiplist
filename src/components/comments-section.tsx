"use client";

import { useState } from "react";
import Image from "next/image";
import { Comment } from "@/data/mock-products";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";

interface CommentsProps {
  comments: Comment[];
  productName: string;
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className={depth > 0 ? "ml-10 border-l-2 border-border/30 pl-4" : ""}>
      <div className="flex gap-3 mb-3">
        <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden border border-border/50">
          <Image src={comment.avatar} alt={comment.author} fill className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{comment.body}</p>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-xs text-muted-foreground hover:text-primary mt-1.5 font-medium transition-colors"
          >
            Reply
          </button>
          {showReplyBox && (
            <div className="mt-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
              <p className="text-sm text-muted-foreground">Sign in to reply.</p>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentsSection({ comments, productName }: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const sorted = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        Discussion ({comments.length})
      </h2>

      {/* Post a comment box */}
      <div className="mb-8 rounded-xl border border-border/50 bg-card p-4">
        <p className="text-sm text-muted-foreground mb-3 font-medium">
          Sign in to join the discussion about{" "}
          <span className="text-foreground">{productName}</span>.
        </p>
        <textarea
          disabled
          placeholder="What do you think about this product?"
          className="w-full resize-none h-20 p-3 rounded-lg border border-border/50 bg-muted text-sm text-muted-foreground cursor-not-allowed"
        />
        <div className="flex justify-end mt-3">
          <button
            disabled
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            Sign in to comment
          </button>
        </div>
      </div>

      {/* Comment list */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No comments yet.</p>
          <p className="text-sm mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sorted.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
