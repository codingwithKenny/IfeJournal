
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    articleCount,
    publishedArticles,
    draftArticles,
    authorCount,
    subfieldCount,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.author.count(),
    prisma.subfield.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        authors: {
          orderBy: { authorOrder: "asc" },
          select: {
            author: {
              select: { fullName: true },
            },
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8 text-slate-900">
      {/* Dashboard Header */}
      <header className="relative overflow-hidden bg-[#0B1F3A] px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#D5B36A]/25"
        />
        <div
          aria-hidden="true"
          className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-[#D5B36A]/20"
        />

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-9 bg-[#D5B36A]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5CA8E]">
              Ife Journal of Politics
            </p>
          </div>

          <h1 className="font-serif text-3xl font-medium sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage articles, authors, research subfields, and publications
            from one place.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-[#D5B36A]" />
            Editorial Administration
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
            Journal Overview
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0B1F3A]">
            At a Glance
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Articles"
            value={articleCount}
            numberColor="text-[#0B1F3A]"
          />
          <StatCard
            label="Published Articles"
            value={publishedArticles}
            numberColor="text-emerald-700"
          />
          <StatCard
            label="Draft Articles"
            value={draftArticles}
            numberColor="text-[#8B6B2E]"
          />
          <StatCard
            label="Authors"
            value={authorCount}
            numberColor="text-slate-700"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
            Manage Your Journal
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0B1F3A]">
            Quick Actions
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            href="/admin/articles/new"
            number="01"
            title="Add New Article"
            description="Add an article, abstract, authors, keywords, and publication details."
            primary
          />

          <ActionCard
            href="/admin/articles"
            number="02"
            title="Manage Articles"
            description="View your articles, edit drafts, and manage published research."
          />

          <ActionCard
            href="/admin/subfields"
            number="03"
            title="Manage Subfields"
            description="Organize articles under relevant political science research areas."
          />

          <ActionCard
            href="/admin/authors"
            number="04"
            title="Manage Authors"
            description="View and manage author profiles and their published contributions."
          />
        </div>
      </section>

      {/* Research Subfields */}
      <section className="flex flex-col gap-4 border border-slate-200 bg-[#FAFAF8] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B6B2E]">
            Research Organization
          </p>
          <h2 className="mt-2 font-serif text-xl font-semibold text-[#0B1F3A]">
            Research Subfields
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Subfields available for categorizing journal articles.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-serif text-4xl font-semibold text-[#0B1F3A]">
            {subfieldCount}
          </span>
          <Link
            href="/admin/subfields"
            className="border border-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"
          >
            View Subfields →
          </Link>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B6B2E]">
              Latest Updates
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0B1F3A]">
              Recent Articles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The latest articles added to the journal.
            </p>
          </div>

          <Link
            href="/admin/articles"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#0B1F3A] transition hover:text-[#8B6B2E]"
          >
            View All Articles <span aria-hidden="true">→</span>
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="px-5 py-14 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#D5B36A] font-serif text-xl text-[#8B6B2E]">
              IJP
            </div>

            <h3 className="mt-5 font-serif text-xl font-semibold text-[#0B1F3A]">
              No Articles Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your recently added journal articles will appear here.
              Start by adding your first article.
            </p>

            <Link
              href="/admin/articles/new"
              className="mt-6 inline-flex items-center gap-2 bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16375D]"
            >
              Add Your First Article <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentArticles.map((article) => {
              const authorNames = article.authors
                .map((item) => item.author.fullName)
                .join(", ");

              const isPublished = article.status === "PUBLISHED";

              return (
                <div
                  key={article.id}
                  className="flex flex-col gap-3 px-5 py-5 transition hover:bg-[#FAFAF8] sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-6 text-[#0B1F3A]">
                      {article.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {authorNames || "No authors assigned"}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Added{" "}
                      {new Date(article.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 border px-3 py-1.5 text-xs font-semibold ${
                      isPublished
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-[#D5B36A]/60 bg-[#FAFAF8] text-[#8B6B2E]"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, numberColor }) {
  return (
    <div className="group border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D5B36A] hover:shadow-md sm:p-6">
      <div className="mb-5 h-1 w-10 bg-[#D5B36A] transition-all group-hover:w-16" />
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 font-serif text-4xl font-semibold ${numberColor}`}>
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  number,
  title,
  description,
  primary = false,
}) {
  return (
    <Link
      href={href}
      className={`group block border p-6 transition hover:-translate-y-0.5 hover:shadow-md sm:p-7 ${
        primary
          ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
          : "border-slate-200 bg-white text-[#0B1F3A] hover:border-[#D5B36A]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`font-serif text-3xl ${
            primary ? "text-[#D5B36A]" : "text-[#C2A15C]"
          }`}
        >
          {number}
        </span>

        <span
          className={`text-xl transition group-hover:translate-x-1 ${
            primary ? "text-[#D5B36A]" : "text-[#8B6B2E]"
          }`}
          aria-hidden="true"
        >
          →
        </span>
      </div>

      <div className="my-5 h-px w-12 bg-[#D5B36A]" />

      <h3 className="font-serif text-xl font-semibold">{title}</h3>

      <p
        className={`mt-3 text-sm leading-7 ${
          primary ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </Link>
  );
}
