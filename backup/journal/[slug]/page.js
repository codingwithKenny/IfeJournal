
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const journal = await prisma.journal.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: {
      name: true,
      description: true,
    },
  });

  return {
    title: journal
      ? `${journal.name} | Ife Journal of Politics`
      : "Journal | Ife Journal of Politics",
    description: journal?.description || "Browse published academic articles.",
  };
}

function formatDate(date) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalDetailsPage({ params }) {
  const { slug } = await params;

  const journal = await prisma.journal.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      subjects: {
        where: {
          subject: {
            isActive: true,
          },
        },
        include: {
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!journal) {
    notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      journalId: journal.id,
      status: "PUBLISHED",
    },
    orderBy: [
      { publicationDate: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          author: {
            select: {
              fullName: true,
              affiliation: true,
            },
          },
        },
      },
      issue: {
        include: {
          volume: true,
        },
      },
    },
  });

  const subjects = journal.subjects
    .map((item) => item.subject)
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <Link
            href="/journal"
            className="mb-8 inline-flex items-center gap-2 text-sm text-blue-200 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            All Journals
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-white p-3">
              <img
                src="/ijp.jpg"
                alt={`${journal.name} logo`}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D5B36A]">
                Academic Journal
              </p>

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                {journal.name}
              </h1>

              {journal.description && (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  {journal.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1fr_280px] md:px-8">
        {/* Published articles */}
        <section>
          <div className="mb-8 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#8B6B2E]">
                Publications
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                Published Articles
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {articles.length}{" "}
              {articles.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="space-y-5">
              {articles.map((article) => {
                const authorNames = article.authors
                  .map((item) => item.author?.fullName)
                  .filter(Boolean);

                const volume = article.issue?.volume;
                const issue = article.issue;

                return (
                  <article
                    key={article.id}
                    className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-[#D5B36A] hover:shadow-md md:p-7"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {article.publicationDate && (
                        <span>
                          Published {formatDate(article.publicationDate)}
                        </span>
                      )}

                      {volume && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span>
                            Volume {volume.number}, {volume.year}
                          </span>
                        </>
                      )}

                      {issue && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span>Issue {issue.number}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-[#0B1F3A] transition hover:text-[#8B6B2E]">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {authorNames.length > 0 && (
                      <p className="mt-3 text-sm font-medium text-slate-600">
                        {authorNames.join(", ")}
                      </p>
                    )}

                    {article.abstract && (
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {article.abstract.length > 420
                          ? `${article.abstract.slice(0, 420).trim()}...`
                          : article.abstract}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                      <span className="text-xs text-slate-500">
                        {article.doi ? `DOI: ${article.doi}` : "Research Article"}
                      </span>

                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B6B2E] transition hover:text-[#0B1F3A]"
                      >
                        Read Article
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-[#0B1F3A]">
                No published articles yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Articles published under this journal will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="border-b border-slate-200 pb-4 text-lg font-bold text-[#0B1F3A]">
              Journal Information
            </h3>

            <div className="space-y-4 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Journal
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {journal.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Published Articles
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {articles.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="border-b border-slate-200 pb-4 text-lg font-bold text-[#0B1F3A]">
              Subject Areas
            </h3>

            {subjects.length > 0 ? (
              <ul className="space-y-3 pt-5">
                {subjects.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-0.5 text-[#D5B36A]">●</span>
                    {subject.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pt-5 text-sm text-slate-500">
                No subject areas have been added yet.
              </p>
            )}
          </div>

          <Link
            href="/journal"
            className="block rounded-lg bg-[#0B1F3A] px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#16365F]"
          >
            Browse All Journals
          </Link>
        </aside>
      </div>
    </main>
  );
}
