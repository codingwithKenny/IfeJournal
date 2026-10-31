
import Link from "next/link";
import prisma from "@/lib/prisma";

export const revalidate = 300;

const features = [
  {
    number: "01",
    title: "Original Research",
    description:
      "Discover research and original academic contributions that deepen understanding of political and public affairs.",
  },
  {
    number: "02",
    title: "Political Analysis",
    description:
      "Engage with research, ideas, and perspectives on political institutions, governance, and public policy.",
  },
  {
    number: "03",
    title: "Academic Publications",
    description:
      "Explore scholarly publications and discover research across different areas of political science.",
  },
];

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

function DocumentIcon() {
  return (
    <svg
      className="h-7 w-7"
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
  }).format(new Date(date));
}

export default async function Home() {
  const latestArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { publicationDate: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          author: {
            select: {
              fullName: true,
            },
          },
        },
      },
      volume: {
        select: {
          number: true,
          year: true,
        },
      },
      subfields: {
        include: {
          subfield: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0B1F3A] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 0%, transparent 56%, #D5B36A 56.1%, transparent 56.3%), linear-gradient(25deg, transparent 0%, transparent 74%, #D5B36A 74.1%, transparent 74.3%)",
          }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16 lg:py-28">
          {/* Hero content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-3">
              <span className="h-px w-9 bg-[#D5B36A]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5CA8E]">
                Ife Journal of Politics
              </p>
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Advancing Knowledge.{" "}
              <span className="text-[#D5B36A]">
                Deepening Political Understanding.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Ife Journal of Politics provides a platform for research,
              critical analysis, and academic debate in political science
              and related fields. Explore published articles and discover
              research across the journal&apos;s collection.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/articles"
                className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#D5B36A] px-6 py-3.5 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#E7CC91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F3A]"
              >
                Discover Articles
                <ArrowIcon />
              </Link>

              <Link
                href="/editorial-board"
                className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#D5B36A] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A]"
              >
                Meet the Editorial Board
                <ArrowIcon />
              </Link>
            </div>

            <div className="mt-10 flex items-start gap-3 border-t border-white/15 pt-6">
              <span className="mt-1 h-5 w-1 shrink-0 bg-[#D5B36A]" />

              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Department of Political Science
                <span className="mx-2 text-[#D5B36A]">·</span>
                Obafemi Awolowo University, Ile-Ife, Nigeria
              </p>
            </div>
          </div>

          {/* Information panel */}
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="absolute -right-3 -top-3 h-full w-full border border-[#D5B36A]/60" />

            <div className="relative border border-slate-200 bg-white p-7 text-[#0B1F3A] shadow-2xl sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6B2E]">
                About IJP
              </p>

              <div className="mt-5 h-px bg-slate-200" />

              <h2 className="mt-7 font-serif text-3xl leading-snug text-[#0B1F3A]">
                Ideas. Evidence. Political Research.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Explore academic research and political analysis
                through the journal&apos;s published articles and
                editorial resources.
              </p>

              <div className="mt-8">
                <Link
                  href="/articles"
                  className="group flex items-center justify-between border-t border-slate-200 py-4"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#0B1F3A]">
                      Research Articles
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Explore published research
                    </span>
                  </span>

                  <ArrowIcon className="h-5 w-5 text-[#8B6B2E] transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/author-guidelines"
                  className="group flex items-center justify-between border-t border-slate-200 py-4"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#0B1F3A]">
                      Author Guidelines
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Manuscript preparation and requirements
                    </span>
                  </span>

                  <ArrowIcon className="h-5 w-5 text-[#8B6B2E] transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/editorial-board"
                  className="group flex items-center justify-between border-y border-slate-200 py-4"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#0B1F3A]">
                      Editorial Board
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Meet the editorial team
                    </span>
                  </span>

                  <ArrowIcon className="h-5 w-5 text-[#8B6B2E] transition group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-[#D5B36A] font-serif text-lg text-[#8B6B2E]">
                  IJP
                </span>

                <p className="text-xs leading-5 text-slate-500">
                  Department of Political Science, OAU
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-[#0B1F3A] via-[#D5B36A] to-[#0B1F3A]" />
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
              Latest Publications
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0B1F3A] sm:text-4xl">
              Latest Research Articles
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore published articles and research from the journal.
            </p>
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#0B1F3A] transition hover:text-[#8B6B2E] sm:self-auto"
          >
            View all articles
            <ArrowIcon />
          </Link>
        </div>

        {latestArticles.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => {
              const authors = article.authors
                .map((item) => item.author.fullName)
                .join(", ");

              const subfields = article.subfields.map(
                (item) => item.subfield
              );

              return (
                <article
                  key={article.id}
                  className="flex flex-col border border-slate-200 bg-white p-6 transition hover:border-[#D5B36A] hover:shadow-md sm:p-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B2E]">
                      Research Article
                    </span>

                    {article.publicationDate && (
                      <span className="text-xs text-slate-500">
                        {formatDate(article.publicationDate)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-semibold leading-snug text-[#0B1F3A]">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="transition hover:text-[#8B6B2E]"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {authors && (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {authors}
                    </p>
                  )}

                  {article.volume && (
                    <p className="mt-3 text-xs font-medium text-slate-500">
                      Volume {article.volume.number}
                      {article.issueNumber
                        ? `, Issue ${article.issueNumber}`
                        : ""}
                      {" · "}
                      {article.volume.year}
                    </p>
                  )}

                  {subfields.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {subfields.map((subfield) => (
                        <Link
                          key={subfield.slug}
                          href={`/articles?subfield=${encodeURIComponent(
                            subfield.slug
                          )}`}
                          className="border border-slate-200 bg-[#FAFAF8] px-2.5 py-1 text-xs text-slate-600 transition hover:border-[#D5B36A] hover:text-[#8B6B2E]"
                        >
                          {subfield.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto border-t border-slate-200 pt-5">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1F3A] transition hover:text-[#8B6B2E]"
                    >
                      Read Article
                      <ArrowIcon />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-slate-200 bg-[#FAFAF8] px-5 py-14 text-center sm:px-10 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#D5B36A] bg-white text-[#0B1F3A]">
              <DocumentIcon />
            </div>

            <h3 className="mt-6 font-serif text-2xl text-[#0B1F3A]">
              No Published Articles Yet
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
              Published research will appear here. Visit the articles
              section to browse available publications.
            </p>

            <Link
              href="/articles"
              className="mt-7 inline-flex items-center justify-center gap-2 bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16375D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B36A] focus-visible:ring-offset-2"
            >
              Browse Articles
              <ArrowIcon />
            </Link>
          </div>
        )}
      </section>

      {/* Journal features */}
      <section className="border-y border-slate-200 bg-[#FAFAF8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
              Our Focus
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#0B1F3A] sm:text-4xl">
              Research, Ideas and Political Analysis.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Access research, explore political perspectives, and
              discover academic contributions in political science.
            </p>
          </div>

          <div className="mt-10 grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="bg-white p-7 transition hover:bg-[#FFFEFB] sm:p-8"
              >
                <p className="font-serif text-3xl text-[#C2A15C]">
                  {feature.number}
                </p>

                <div className="my-6 h-px w-12 bg-[#D5B36A]" />

                <h3 className="font-serif text-xl font-semibold text-[#0B1F3A]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Published research call to action */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
        <div className="relative overflow-hidden bg-[#0B1F3A] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#D5B36A]/30"
          />

          <div
            aria-hidden="true"
            className="absolute -right-5 -top-9 h-44 w-44 rounded-full border border-[#D5B36A]/20"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D5B36A]">
                Published Research
              </p>

              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                Explore Political Research and Academic Contributions.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Discover published research and academic contributions
                in political science and related fields.
              </p>
            </div>

            <Link
              href="/articles"
              className="inline-flex w-fit shrink-0 items-center justify-center gap-3 bg-[#D5B36A] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#E7CC91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F3A]"
            >
              Browse Articles
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Author and editorial information */}
      <section className="border-t border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 md:gap-16 md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
              For Contributors
            </p>

            <h2 className="mt-3 font-serif text-2xl text-[#0B1F3A]">
              Preparing a Manuscript?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Consult the journal&apos;s author guidelines for information
              about manuscript preparation and submission requirements.
            </p>

            <Link
              href="/author-guidelines"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0B1F3A] transition hover:text-[#8B6B2E]"
            >
              Read Author Guidelines
              <ArrowIcon />
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B6B2E]">
              Editorial Information
            </p>

            <h2 className="mt-3 font-serif text-2xl text-[#0B1F3A]">
              Meet the Editorial Team.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Meet the editorial team responsible for the academic
              direction and publication of the Ife Journal of Politics.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/editorial-board"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1F3A] transition hover:text-[#8B6B2E]"
              >
                Editorial Board
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
