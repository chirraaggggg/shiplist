"use server";

import { getSessionUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CommentNode = {
  id: string;
  body: string;
  author: string;
  avatar: string;
  userId: string;
  createdAt: string;
  deleted: boolean;
  replies?: CommentNode[];
};

/**
 * Posts a new comment or reply (nested 1 level deep).
 */
export async function postComment(
  productId: string,
  body: string,
  parentId?: string
) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be signed in to comment." };
  }

  if (!body.trim()) {
    return { success: false, error: "Comment text cannot be empty." };
  }

  const isAllowed = await checkRateLimit(user.id, "comment");
  if (!isAllowed) {
    return { success: false, error: "Posting too quickly. Please wait a second." };
  }

  try {
    // Ensure User record exists
    await db.user.upsert({
      where: { clerkId: user.clerkId },
      update: { name: user.name, email: user.email },
      create: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    // If parentId provided, enforce nested 1 level deep (ensure parent itself is top-level)
    let validParentId = parentId || null;
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
      });

      if (parentComment?.parentId) {
        // If the targeted parent is already a reply, attach to top-level parent instead
        validParentId = parentComment.parentId;
      }
    }

    const newComment = await db.comment.create({
      data: {
        body: body.trim(),
        productId,
        userId: user.id,
        parentId: validParentId,
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      comment: {
        id: newComment.id,
        body: newComment.body,
        author: newComment.user.name || "User",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          newComment.user.name || "User"
        )}&background=0F766E&color=fff`,
        userId: newComment.userId,
        createdAt: newComment.createdAt.toISOString(),
        deleted: false,
        replies: [],
      },
    };
  } catch (error: any) {
    console.error("Post comment error:", error);
    return { success: false, error: error.message || "Failed to post comment." };
  }
}

/**
 * Deletes a comment. Users can delete their own comments, Admins can delete any comment.
 */
export async function deleteComment(commentId: string) {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "You must be signed in to delete comments." };
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    const isAuthor = comment.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return { success: false, error: "You do not have permission to delete this comment." };
    }

    // Soft delete so thread structure remains intact if there are replies
    await db.comment.update({
      where: { id: commentId },
      data: {
        deleted: true,
        body: "[Comment deleted by user]",
      },
    });

    revalidatePath(`/product/${comment.productId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Delete comment error:", error);
    return { success: false, error: error.message || "Failed to delete comment." };
  }
}

/**
 * Gets all threaded comments for a product (nested 1 level deep).
 */
export async function getComments(productId: string): Promise<CommentNode[]> {
  try {
    const comments = await db.comment.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const topLevel: CommentNode[] = [];
    const replyMap = new Map<string, CommentNode[]>();

    for (const c of comments) {
      const node: CommentNode = {
        id: c.id,
        body: c.deleted ? "[Comment deleted]" : c.body,
        author: c.user.name || "User",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          c.user.name || "User"
        )}&background=0F766E&color=fff`,
        userId: c.userId,
        createdAt: c.createdAt.toISOString(),
        deleted: c.deleted,
        replies: [],
      };

      if (c.parentId) {
        const existing = replyMap.get(c.parentId) || [];
        existing.push(node);
        replyMap.set(c.parentId, existing);
      } else {
        topLevel.push(node);
      }
    }

    // Attach replies
    for (const top of topLevel) {
      top.replies = replyMap.get(top.id) || [];
    }

    return topLevel;
  } catch (error) {
    console.error("Get comments error:", error);
    return [];
  }
}
