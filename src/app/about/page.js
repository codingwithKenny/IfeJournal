
import Link from "next/link";

const topics = [
  "Political Theory",
  "Comparative Politics",
  "Democracy and Elections",
  "Governance and Public Policy",
  "International Relations",
  "Political Economy",
  "Security and Conflict Studies",
  "Human Rights and Citizenship",
  "African Politics",
  "Gender and Politics",
  "Digital Politics and Technology",
  "Environmental Politics",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Page heading */}
      <section className="bg-[#0B1F3A] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-[#D5B36A]">
            About the Journal
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            Advancing Knowledge.
            <span className="block text-[#D5B36A]">
              Inspiring Political Thought.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            The Ife Journal of Politics provides a platform for rigorous
            scholarship and meaningful conversations on politics,
            governance and public affairs.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-20">
        <div>
          <h2 className="mb-5 text-2xl font-semibold text-[#0B1F3A]">
            Who We Are
          </h2>

          <div className="space-y-4 text-[15px] leading-8 text-gray-600">
            <p>
              The Ife Journal of Politics (IJP) is a peer-reviewed
              academic journal published by the Department of Political
              Science, Obafemi Awolowo University, Ile-Ife, Nigeria.
            </p>

            <p>
              The journal publishes original theoretical, conceptual,
              empirical, comparative and policy-oriented research in
              Political Science and related fields. It welcomes
              contributions examining political issues in Nigeria,
              Africa and the wider international community.
            </p>

            <p>
              IJP seeks to encourage critical inquiry, enrich academic
              debate and contribute to a deeper understanding of
              political institutions, processes and developments.
            </p>
          </div>
        </div>

        <aside className="h-fit border-l-2 border-[#C2A15C] bg-white px-6 py-7 shadow-sm md:mt-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7A3E]">
            Published by
          </p>

          <h3 className="mt-3 text-lg font-semibold leading-7 text-[#0B1F3A]">
            Department of Political Science
          </h3>

          <p className="mt-2 text-sm leading-7 text-gray-500">
            Obafemi Awolowo University
            <br />
            Ile-Ife, Nigeria
          </p>
        </aside>
      </section>

      {/* Scope */}
      <section className="border-y border-gray-200 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7A3E]">
              What We Publish
            </p>

            <h2 className="text-2xl font-semibold text-[#0B1F3A] md:text-3xl">
              Areas of Interest
            </h2>

            <p className="mt-4 text-[15px] leading-8 text-gray-600">
              The journal welcomes scholarly contributions across
              diverse areas of Political Science, including:
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-[#0B1F3A]/10 bg-[#FAF8F5] px-4 py-2 text-sm text-[#0B1F3A]"
              >
                {topic}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-gray-500">
            Interdisciplinary research making a substantial contribution
            to Political Science is also welcome.
          </p>
        </div>
      </section>

      {/* Commitment */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-[#0B1F3A]">
            Our Commitment
          </h2>

          <p className="mt-5 text-[15px] leading-8 text-gray-600">
            We are committed to rigorous peer review, research integrity,
            methodological diversity and editorial independence.
            Through these principles, IJP aims to support high-quality
            scholarship and strengthen political research from Nigeria,
            Africa and beyond.
          </p>

          <Link
            href="/articles"
            className="mt-8 inline-flex items-center gap-2 border-b border-[#C2A15C] pb-2 text-sm font-semibold text-[#0B1F3A] transition hover:text-[#9A7A3E]"
          >
            Explore Published Articles
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
