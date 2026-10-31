
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Articles | Ife Journal of Politics",
  description:
    "Search and explore research articles published by the Ife Journal of Politics, Department of Political Science, Obafemi Awolowo University.",
};

export const dynamic = "force-dynamic";

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function DocumentIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8" />
    </svg>
  );
}

function formatDate(date) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function ArticlesPage({ searchParams }) {
  const params = await searchParams;

  const search =
    typeof params?.q === "string" ? params.q.trim() : "";

  const selectedSubfield =
    typeof params?.subfield === "string"
      ? params.subfield.trim()
      : "";

  // Get active subfields assigned to published articles.
  const subfields = await prisma.subfield.findMany({
    where: {
      isActive: true,
      articles: {
        some: {
          article: {
            status: "PUBLISHED",
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  // Filter published articles by search and subfield.
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",

      ...(selectedSubfield
        ? {
            subfields: {
              some: {
                subfield: {
                  slug: selectedSubfield,
                  isActive: true,
                },
              },
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                abstract: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                keywords: {
                  has: search,
                },
              },
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
              {
                subfields: {
                  some: {
                    subfield: {
                      name: {
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
    },

    orderBy: [
      { publicationDate: { sort: "desc", nulls: "last" } },
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

      volume: true,

      subfields: {
        include: {
          subfield: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const activeSubfield = subfields.find(
    (subfield) => subfield.slug === selectedSubfield
  );

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* PAGE TITLE */}
      <header className="border-b border-slate-200 bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 text-sm text-slate-300"
          >
            <Link href="/" className="hover:text-[#D5B36A]">
              Home
            </Link>

            <span className="mx-2 text-[#D5B36A]">/</span>

            <span>Articles</span>
          </nav>

          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            Published Articles
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Browse and explore research published by the Ife Journal of Politics.
          </p>
        </div>
      </header>

      {/* ARTICLE DIRECTORY */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">

          {/* SUBFIELDS SIDEBAR */}
      <aside>
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    {/* Heading */}
    <div className="border-b border-slate-200 bg-[#0B1F3A] px-5 py-5">
      <div className="mb-2 h-1 w-10 rounded-full bg-[#D5B36A]" />

      <p className="mt-1 text-xs leading-relaxed text-slate-300">
        Explore articles by area of study
      </p>
    </div>

    {/* Subfield links */}
    <nav
      aria-label="Filter articles by subfield"
      className="space-y-2 p-3"
    >
      <Link
        href={search ? `/articles?q=${encodeURIComponent(search)}` : "/articles"}
        className={`flex items-center justify-between rounded-lg border px-3.5 py-3 text-sm transition-all ${
          !selectedSubfield
            ? "border-[#D5B36A] bg-[#FAFAF8] font-semibold text-[#0B1F3A]"
            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-[#FAFAF8] hover:text-[#0B1F3A]"
        }`}
      >
        <span>Subfields</span>
        {!selectedSubfield && (
          <span className="h-2 w-2 rounded-full bg-[#C2A15C]" />
        )}
      </Link>

      {subfields.map((subfield) => {
        const isActive = selectedSubfield === subfield.slug;

        return (
          <Link
            key={subfield.id}
            href={`/articles?subfield=${encodeURIComponent(subfield.slug)}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center justify-between rounded-lg border px-3.5 py-3 text-sm transition-all ${
              isActive
                ? "border-[#D5B36A] bg-[#FAFAF8] font-semibold text-[#0B1F3A]"
                : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-[#FAFAF8] hover:text-[#0B1F3A]"
            }`}
          >
            <span>{subfield.name}</span>

            {isActive && (
              <span className="h-2 w-2 rounded-full bg-[#C2A15C]" />
            )}
          </Link>
        );
      })}
    </nav>
  </div>
</aside>

          {/* SEARCH AND ARTICLE LIST */}
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold text-[#0B1F3A]">
              Search Articles
            </h2>

            <form
              action="/articles"
              method="get"
              role="search"
              className="mt-4"
            >
              {selectedSubfield && (
                <input
                  type="hidden"
                  name="subfield"
                  value={selectedSubfield}
                />
              )}

              <label
                htmlFor="article-search"
                className="sr-only"
              >
                Search articles by title, author, or keyword
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 min-w-0 flex-1 items-center gap-3 border border-slate-300 px-4 focus-within:border-[#9C762D] focus-within:ring-1 focus-within:ring-[#D5B36A]">
                  <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />

                  <input
                    id="article-search"
                    type="search"
                    name="q"
                    defaultValue={search}
                    placeholder="Search articles by title, author, or keyword..."
                    className="h-full w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 bg-[#0B1F3A] px-7 text-sm font-semibold text-white hover:bg-[#16375D]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* RESULTS HEADER */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#0B1F3A]">
                  Article Directory
                </h2>

                {activeSubfield && (
                  <p className="mt-1 text-sm text-slate-500">
                    Subfield: {activeSubfield.name}
                  </p>
                )}

                {search && (
                  <p className="mt-1 text-sm text-slate-500">
                    Search: {search}
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-500">
                Showing {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
              </p>
            </div>

            {/* ARTICLE LISTING */}
            {articles.length > 0 ? (
              <div>
                {articles.map((article) => {
                  const authors = article.authors
                    .map((item) => item.author.fullName)
                    .join(", ");

                  const volume = article.volume;
                  const issue = article.issueNumber;

                  return (
                    <article
                      key={article.id}
                      className="flex flex-col gap-5 border-b border-slate-200 py-6"
                    >
                      <div className="min-w-0 flex-1">
                        {/* PUBLICATION DETAILS */}
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          {article.publicationDate && (
                            <span>
                              {formatDate(article.publicationDate)}
                            </span>
                          )}

                          {volume && (
                            <>
                              {article.publicationDate && (
                                <span aria-hidden="true">·</span>
                              )}

                              <span>
                                Volume {volume.number}
                                {issue != null && `, Issue ${issue}`}
                                {volume.year && ` (${volume.year})`}
                              </span>
                            </>
                          )}
                        </div>

                        {/* ARTICLE TITLE */}
                        <h3 className="font-serif text-xl font-semibold leading-7 text-[#0B1F3A] sm:text-2xl">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="hover:text-[#9C762D]"
                          >
                            {article.title}
                          </Link>
                        </h3>

                        {/* AUTHORS */}
                        {authors && (
                          <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                            {authors}
                          </p>
                        )}

                        {/* ABSTRACT */}
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                          {article.abstract.length > 420
                            ? `${article.abstract.slice(0, 420).trim()}…`
                            : article.abstract}
                        </p>

                        {/* KEYWORDS */}
                        {article.keywords.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {article.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs text-slate-600"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* SUBFIELD TAGS */}
                        {article.subfields.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {article.subfields.map(({ subfield }) => (
                              <Link
                                key={subfield.id}
                                href={`/articles?subfield=${encodeURIComponent(subfield.slug)}`}
                                className="border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-[#D5B36A] hover:text-[#0B1F3A]"
                              >
                                {subfield.name}
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* ARTICLE LINKS */}
                        <div className="mt-5 flex flex-wrap items-center gap-5">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#9C762D]"
                          >
                            Read article
                            <ArrowIcon />
                          </Link>

                          {article.pdfUrl && (
                            <a
                              href={article.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-[#8B6B2E] underline decoration-[#D5B36A] underline-offset-4 hover:text-[#0B1F3A]"
                            >
                              Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#D5B36A] bg-[#FAFAF8] text-[#0B1F3A]">
                  <DocumentIcon />
                </div>

                <h3 className="mt-5 font-serif text-lg font-semibold text-[#0B1F3A]">
                  No articles found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or select a different subfield.
                </p>

                <Link
                  href="/articles"
                  className="mt-4 inline-block text-sm font-semibold text-[#0B1F3A] hover:text-[#9C762D]"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
