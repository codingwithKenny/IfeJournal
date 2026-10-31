
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "./action";

export default function DeleteArticleButton({
  articleId,
  articleTitle,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${articleTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      const result = await deleteArticle(articleId);

      if (!result.success) {
        setError(result.error || "Unable to delete this article.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={15} />
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="mt-2 max-w-48 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
