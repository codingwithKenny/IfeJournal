import Link from "next/link";

export const metadata = {
  title: "Editorial Board | Ife Journal of Politics",
  description:
    "Meet the editorial and editorial advisory boards of the Ife Journal of Politics, Department of Political Science, Obafemi Awolowo University.",
};

const editorialMembers = [
  {
    name: "Professor D. T. Agbalajobi",
    role: "Editorial Board Member",
  },
  {
    name: "Professor M. K. Aliyu",
    role: "Editorial Board Member",
  },
  {
    name: "O. G. Durodola",
    role: "Editorial Assistant",
  },
  {
    name: "M. A. Eniola",
    role: "Editorial Assistant",
  },
];

const advisoryMembers = [
  {
    name: "Professor Yomi Durotoye",
    affiliation:
      "Department of Political Science, Wake Forest University, North Carolina, United States of America",
  },
  {
    name: "Professor N. O. Mimiko",
    affiliation:
      "Department of Political Science, Obafemi Awolowo University, Ile-Ife, Nigeria",
  },
  {
    name: "Professor A. Sat Obiyan",
    affiliation:
      "Department of Political Science, Obafemi Awolowo University, Ile-Ife, Nigeria",
  },
  {
    name: "Professor Adigun Agbaje",
    affiliation:
      "Department of Political Science, University of Ibadan, Oyo State, Nigeria",
  },
  {
    name: "Professor Dipo Kolawole",
    affiliation: "University of Ado Ekiti, Ekiti State, Nigeria",
  },
  {
    name: "Professor Remi Aiyede",
    affiliation:
      "Department of Political Science, University of Ibadan, Oyo State, Nigeria",
  },
  {
    name: "Professor M. A. Quadri",
    affiliation:
      "Department of Political Science, University of Lagos, Lagos State, Nigeria",
  },
  {
    name: "Professor O. A. Bamisaye",
    affiliation:
      "Department of Political Science, Oduduwa University, Ile-Ife, Osun State, Nigeria",
  },
];

function getInitials(name) {
  return name
    .replace(/^Professor\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.replace(/[^A-Za-z]/g, "").charAt(0))
    .join("");
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9C762D]">
        {eyebrow}
      </p>

      <h2 className="font-serif text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
        {title}
      </h2>

      <div className="mt-4 h-1 w-16 rounded-full bg-[#D5B36A]" />

      {description && (
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

function MemberCard({
  name,
  role,
  affiliation,
  featured = false,
}) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md ${
        featured ? "border-t-4 border-t-[#D5B36A] sm:p-8" : ""
      }`}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1F3A] font-serif text-lg font-bold text-[#D5B36A]">
        {getInitials(name)}
      </div>

      <h3
        className={`font-serif font-bold leading-snug text-[#0B1F3A] ${
          featured ? "text-2xl sm:text-3xl" : "text-xl"
        }`}
      >
        {name}
      </h3>

      {role && (
        <p className="mt-2 text-sm font-semibold text-[#9C762D]">
          {role}
        </p>
      )}

      {affiliation && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {affiliation}
        </p>
      )}
    </article>
  );
}

export default function EditorialBoardPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Page banner */}
      <section className="bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <nav className="mb-6 text-sm text-slate-300">
            <Link href="/" className="transition hover:text-[#D5B36A]">
              Home
            </Link>

            <span className="mx-2">/</span>

            <span className="text-[#D5B36A]">Editorial Board</span>
          </nav>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D5B36A]">
            Ife Journal of Politics
          </p>

          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Editorial Board
          </h1>

          <div className="mt-6 h-1 w-20 rounded-full bg-[#D5B36A]" />

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Meet the scholars and editorial professionals who provide
            scholarly leadership and support the journal&apos;s commitment
            to rigorous peer review, research integrity, and responsible
            scholarly communication.
          </p>

          <p className="mt-5 text-sm leading-6 text-slate-300">
            Department of Political Science
            <span className="mx-2 text-[#D5B36A]">|</span>
            Obafemi Awolowo University, Ile-Ife, Nigeria
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">

        {/* Editor-in-Chief */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Editorial leadership"
            title="Editor-in-Chief"
            description="The Editor-in-Chief has final editorial responsibility for the journal, subject to institutional governance, and exercises independent scholarly judgment."
          />

          <MemberCard
            name="Professor O. S. Afolabi"
            role="Editor-in-Chief"
            featured
          />
        </section>

        {/* Editorial Board */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Editorial team"
            title="Editorial Board"
            description="The Editorial Board provides scholarly leadership and advice on the journal's direction, peer-review network, special issues, and disciplinary development."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {editorialMembers.map((member) => (
              <MemberCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* Editorial Advisory Board */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Academic guidance"
            title="Editorial Advisory Board"
            description="The Editorial Advisory Board brings together scholars from universities and institutions who contribute academic expertise to the journal."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advisoryMembers.map((member) => (
              <MemberCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9C762D]">
            Our commitment
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#0B1F3A] sm:text-3xl">
            Editorial Independence
          </h2>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#D5B36A]" />

          <p className="mt-5 max-w-4xl leading-8 text-slate-600">
            Editorial decisions are based on scholarly merit, originality,
            methodological and conceptual quality, relevance to the
            journal&apos;s scope, research integrity, and contribution to
            knowledge. Editors must disclose and manage conflicts of
            interest and recuse themselves from decisions where a conflict
            exists.
          </p>
        </section>

        {/* Bottom navigation */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/articles"
            className="inline-flex items-center rounded-lg bg-[#0B1F3A] px-6 py-3 font-semibold text-white transition hover:bg-[#16365D]"
          >
            Browse Articles
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-[#0B1F3A] px-6 py-3 font-semibold text-[#0B1F3A] transition hover:bg-slate-100"
          >
            About the Journal
          </Link>
        </div>
      </div>
    </main>
  );
}