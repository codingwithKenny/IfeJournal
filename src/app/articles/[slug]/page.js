
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getCleanDoi(doi) {
  if (!doi) return null;

  return doi
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .trim();
}

function getDoiUrl(doi) {
  const cleanDoi = getCleanDoi(doi);
  return cleanDoi ? `https://doi.org/${cleanDoi}` : null;
}

function DocumentIcon({ className = "h-5 w-5" }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8" />
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

function getCitation(article) {
  const authors = article.authors.map(({ author }) => author.fullName);

  let authorText = "";

  if (authors.length === 1) {
    authorText = `${authors[0]}.`;
  } else if (authors.length === 2) {
    authorText = `${authors[0]} & ${authors[1]}.`;
  } else if (authors.length > 2) {
    authorText = `${authors.slice(0, -1).join(", ")}, & ${authors[authors.length - 1]}.`;
  }

  const year = article.publicationDate
    ? new Date(article.publicationDate).getUTCFullYear()
    : article.volume?.year || "n.d.";

  const volumeDetails = article.volume
    ? `Ife Journal of Politics, ${article.volume.number}`
    : "Ife Journal of Politics";

  const issueDetails = article.issueNumber
    ? `(${article.issueNumber})`
    : "";

  const pageDetails =
    article.pageStart != null
      ? `, ${article.pageStart}${article.pageEnd != null ? `–${article.pageEnd}` : ""}`
      : "";

  const doiDetails = getDoiUrl(article.doi);

  return [
    authorText,
    ` (${year}). `,
    `${article.title}. `,
    `${volumeDetails}${issueDetails}${pageDetails}.`,
    doiDetails ? ` ${doiDetails}` : "",
  ].join("");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      abstract: true,
    },
  });

  if (!article) {
    return {
      title: "Article Not Found | Ife Journal of Politics",
    };
  }

  return {
    title: `${article.title} | Ife Journal of Politics`,
    description: article.abstract.slice(0, 160),
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          author: true,
        },
      },
      subfields: {
        include: {
          subfield: true,
        },
      },
      volume: true,
    },
  });

  if (!article) {
    notFound();
  }

  const doiUrl = getDoiUrl(article.doi);
  const citation = getCitation(article);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Journal header */}
      <section className="border-b border-slate-200 bg-[#0B1F3A]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-slate-300"
          >
            <Link href="/" className="hover:text-[#D5B36A]">
              Home
            </Link>

            <span className="text-[#D5B36A]">/</span>

            <Link href="/articles" className="hover:text-[#D5B36A]">
              Articles
            </Link>

            <span className="text-[#D5B36A]">/</span>

            <span className="text-[#D5B36A]">
              Article Details
            </span>
          </nav>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#D5B36A]">
            Ife Journal of Politics
          </p>

          <h1 className="mt-4 max-w-5xl font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {article.title}
          </h1>

          {article.authors.length > 0 && (
            <div className="mt-6 space-y-4">
              {article.authors.map(({ author, authorId }) => (
                <div key={authorId}>
                  <p className="text-sm font-semibold text-white">
                    {author.fullName}
                  </p>

                  {author.affiliation && (
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {author.affiliation}
                    </p>
                  )}

                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="mt-1 inline-block text-sm text-[#D5B36A] hover:underline"
                    >
                      {author.email}
                    </a>
                  )}

                  {author.orcid && (
                    <p className="mt-1 text-xs text-slate-300">
                      ORCID: {author.orcid}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article page layout */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-12">
        {/* Main article */}
        <div className="min-w-0">
          {/* Article navigation */}
          <nav
            aria-label="Article sections"
            className="flex flex-wrap gap-x-6 gap-y-3 border-b border-slate-200 pb-4 text-sm"
          >
            <a
              href="#abstract"
              className="font-semibold text-[#8B6B2E] hover:text-[#0B1F3A]"
            >
              Abstract
            </a>

            <a
              href="#authors"
              className="text-slate-600 hover:text-[#8B6B2E]"
            >
              Authors
            </a>

            <a
              href="#citation"
              className="text-slate-600 hover:text-[#8B6B2E]"
            >
              How to Cite
            </a>

            {article.pdfUrl && (
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-[#8B6B2E]"
              >
                PDF
              </a>
            )}
          </nav>

          {/* Abstract */}
          <article id="abstract" className="scroll-mt-8 py-8">
            <h2 className="border-l-4 border-[#D5B36A] pl-4 font-serif text-2xl font-semibold text-[#0B1F3A]">
              Abstract
            </h2>

            <div className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-700 sm:text-base">
              {article.abstract}
            </div>

            {article.keywords.length > 0 && (
              <div className="mt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                  Keywords
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Authors */}
          <section
            id="authors"
            className="scroll-mt-8 border-t border-slate-200 py-8"
          >
            <h2 className="border-l-4 border-[#D5B36A] pl-4 font-serif text-2xl font-semibold text-[#0B1F3A]">
              Authors
            </h2>

            {article.authors.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {article.authors.map(({ author, authorId }) => (
                  <div
                    key={authorId}
                    className="border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-[#0B1F3A]">
                      {author.fullName}
                    </p>

                    {author.affiliation && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {author.affiliation}
                      </p>
                    )}

                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="mt-2 block break-all text-sm text-[#8B6B2E] hover:underline"
                      >
                        {author.email}
                      </a>
                    )}

                    {author.orcid && (
                      <p className="mt-2 break-all text-xs text-slate-500">
                        ORCID: {author.orcid}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                Author information is not available.
              </p>
            )}
          </section>

          {/* Citation */}
          <section
            id="citation"
            className="scroll-mt-8 border-t border-slate-200 py-8"
          >
            <h2 className="border-l-4 border-[#D5B36A] pl-4 font-serif text-2xl font-semibold text-[#0B1F3A]">
              How to Cite
            </h2>

            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              APA 7th Edition
            </p>

            <p className="mt-4 break-words border border-slate-200 bg-[#FAFAF8] p-5 text-sm leading-7 text-slate-700">
              {citation}
            </p>

            {doiUrl && (
              <p className="mt-4 text-sm">
                <span className="font-semibold text-[#0B1F3A]">
                  DOI:{" "}
                </span>

                <a
                  href={doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[#8B6B2E] hover:underline"
                >
                  {article.doi}
                </a>
              </p>
            )}
          </section>

          {/* Back to articles */}
          <div className="border-t border-slate-200 pt-6">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#8B6B2E]"
            >
              <span aria-hidden="true">←</span>
              Back to all articles
            </Link>
          </div>
        </div>

        {/* Publication sidebar */}
        <aside className="space-y-6">
          <div className="border border-slate-200">
            <h2 className="border-b border-slate-200 bg-[#FAFAF8] px-5 py-4 font-serif text-lg font-semibold text-[#0B1F3A]">
              Article Information
            </h2>

            <dl className="divide-y divide-slate-100 px-5">
              {article.publicationDate && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Published
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {formatDate(article.publicationDate)}
                  </dd>
                </div>
              )}

              {article.submittedDate && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Received
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {formatDate(article.submittedDate)}
                  </dd>
                </div>
              )}

              {article.acceptedDate && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Accepted
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {formatDate(article.acceptedDate)}
                  </dd>
                </div>
              )}

              {article.volume && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Volume
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {article.volume.number}, {article.volume.year}
                  </dd>
                </div>
              )}

              {article.issueNumber != null && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {article.issueNumber}
                  </dd>
                </div>
              )}

              {(article.pageStart != null || article.pageEnd != null) && (
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Pages
                  </dt>

                  <dd className="mt-1 text-sm text-slate-800">
                    {article.pageStart ?? "—"}–{article.pageEnd ?? "—"}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* PDF */}
          {article.pdfUrl && (
            <div className="border border-[#E8D8B4] bg-[#FAFAF8] p-5">
              <h2 className="font-serif text-lg font-semibold text-[#0B1F3A]">
                Full-Text PDF
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Read or download the complete article.
              </p>

              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-11 items-center justify-center gap-2 bg-[#0B1F3A] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#16375D]"
              >
                <DocumentIcon />
                Download PDF
              </a>
            </div>
          )}

          {/* Subfields */}
          {article.subfields.length > 0 && (
            <div className="border border-slate-200 p-5">
              <h2 className="font-serif text-lg font-semibold text-[#0B1F3A]">
                Research Areas
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {article.subfields.map(({ subfield }) => (
                  <span
                    key={subfield.id}
                    className="border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs text-slate-600"
                  >
                    {subfield.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
