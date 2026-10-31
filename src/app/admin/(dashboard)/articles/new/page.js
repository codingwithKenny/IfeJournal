import prisma from "@/lib/prisma";
import ArticleForm from "./ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const subfields = await prisma.subfield.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6B2E]">
          Journal Administration
        </p>

        <h1 className="font-serif text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
          Add New Article
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add an article, assign its research subfields and manage its
          publication details.
        </p>
      </div>

      <ArticleForm subfields={subfields} />
    </div>
  );
}