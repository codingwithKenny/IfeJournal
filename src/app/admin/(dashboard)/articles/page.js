
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  CalendarDays,
  Tags,
} from "lucide-react";
import DeleteArticleButton from "./DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const status = params?.status || "ALL";

  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            {
              authors: {
                some: {
                  author: {
                    fullName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        }
      : {}),
    ...(status !== "ALL" ? { status } : {}),
  };

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      authors: {
        orderBy: { authorOrder: "asc" },
        include: {
          author: {
            select: { fullName: true },
          },
        },
      },
      volume: true,
      subfields: {
        include: {
          subfield: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const [publishedCount, draftCount] = await Promise.all([
    prisma.article.count({
      where: { status: "PUBLISHED" },
    }),
    prisma.article.count({
      where: { status: "DRAFT" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6B2E]">
            Journal Administration
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
            Articles
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage journal articles, authors, subfields, and publication status.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15345B]"
        >
          <Plus size={18} />
          Add New Article
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Articles"
          value={articles.length}
          icon={<FileText size={20} />}
        />

        <StatCard
          label="Published"
          value={publishedCount}
          icon={<Eye size={20} />}
        />

        <StatCard
          label="Drafts"
          value={draftCount}
          icon={<Pencil size={20} />}
        />
      </div>

      {/* Article list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-[#0B1F3A]">
            All Articles
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search and manage articles in your journal.
          </p>

          <form
            action="/admin/articles"
            method="GET"
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search title or author..."
                className="w-full rounded-lg border border-slate-200 bg-[#FAFAF8] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#C2A15C] focus:ring-2 focus:ring-[#D5B36A]/20"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C2A15C]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
            </select>

            <button
              type="submit"
              className="rounded-lg border border-[#D5B36A] px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#FAF5E9]"
            >
              Search
            </button>
          </form>
        </div>

        {articles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF5E9] text-[#8B6B2E]">
              <FileText size={25} />
            </div>

            <h3 className="mt-4 font-serif text-lg font-bold text-[#0B1F3A]">
              No articles found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              {search || status !== "ALL"
                ? "Try changing your search or status filter."
                : "Start building your journal archive by adding your first article."}
            </p>

            {!search && status === "ALL" && (
              <Link
                href="/admin/articles/new"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-[#8B6B2E] hover:underline"
              >
                <Plus size={17} />
                Add your first article
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-[#FAFAF8]/70 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        article.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {article.status === "PUBLISHED"
                        ? "Published"
                        : "Draft"}
                    </span>

                    {article.status === "PUBLISHED" && article.volume && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        Volume {article.volume.number}, Issue{" "}
                        {article.issueNumber ?? "Pending"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold leading-snug text-[#0B1F3A]">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {article.authors.length
                      ? article.authors
                          .map((item) => item.author.fullName)
                          .join(", ")
                      : "No authors added"}
                  </p>

                  {article.subfields.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {article.subfields.map(({ subfield }) => (
                        <span
                          key={subfield.id}
                          className="inline-flex items-center gap-1 rounded-md bg-[#FAF5E9] px-2.5 py-1 text-xs text-[#8B6B2E]"
                        >
                          <Tags size={12} />
                          {subfield.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {new Date(article.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:border-[#D5B36A] hover:bg-[#FAF5E9]"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  <DeleteArticleButton
                    articleId={article.id}
                    articleTitle={article.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {articles.length}{" "}
        {articles.length === 1 ? "article" : "articles"} matching your filters.
      </p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF5E9] text-[#8B6B2E]">
          {icon}
        </span>
      </div>

      <p className="mt-4 font-serif text-3xl font-bold text-[#0B1F3A]">
        {value}
      </p>
    </div>
  );
}
