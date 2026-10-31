
import Link from "next/link";

export const metadata = {
  title: "Author Guidelines | Ife Journal of Politics",
  description:
    "Submission guidelines, manuscript preparation requirements, peer review, publication ethics and policies for authors submitting to the Ife Journal of Politics.",
};

const articleTypes = [
  {
    title: "Original Research Articles",
    words: "6,000–8,000 words",
    description: "Original theoretical, empirical, comparative or methodological research.",
  },
  {
    title: "Review Articles",
    words: "6,000–8,000 words",
    description: "Critical and scholarly reviews of research, debates and developments.",
  },
  {
    title: "Theoretical / Conceptual Articles",
    words: "5,000–8,000 words",
    description: "Contributions advancing political theory, concepts or analytical frameworks.",
  },
  {
    title: "Research / Policy Notes",
    words: "2,000–3,000 words",
    description: "Focused research findings, policy analysis or concise scholarly contributions.",
  },
  {
    title: "Book Reviews",
    words: "1,000 words or less",
    description: "Critical assessments of relevant scholarly publications.",
  },
  {
    title: "Editorials / Special-Issue Introductions",
    words: "1,500–3,000 words",
    description: "Editorial contributions introducing themes, debates or special issues.",
  },
];

const requirements = [
  "Submit manuscripts in Microsoft Word (.docx) format.",
  "Use APA 7th edition for citations and references.",
  "Provide an abstract of approximately 150–200 words.",
  "Provide 5–7 keywords.",
  "Use clear heading levels and include page numbers.",
  "Number and title all tables and figures.",
  "Ensure every in-text citation appears in the reference list, and vice versa.",
  "Include DOI information for references where available.",
  "Include funding, conflict-of-interest, ethics and data-availability statements where applicable.",
  "Remove author-identifying information from the manuscript file for double-anonymized review.",
  "Disclose substantive use of generative AI in accordance with the journal's AI policy.",
];

const manuscriptStructure = [
  "Title",
  "Abstract",
  "Keywords",
  "Introduction",
  "Literature Review and/or Theoretical/Conceptual Framework",
  "Research Questions and/or Hypotheses, where applicable",
  "Methodology / Research Design",
  "Results / Findings",
  "Discussion",
  "Conclusion and Implications",
  "References",
  "Tables, Figures and Supplementary Materials, where applicable",
];

const reviewDecisions = [
  "Accept",
  "Minor revisions",
  "Major revisions / revise and resubmit",
  "Reject and resubmit as a substantially new manuscript",
  "Reject",
];

const ethicsItems = [
  {
    title: "Authorship and contributor responsibilities",
    text: "Authorship must reflect substantial intellectual contribution to the conception, design, conduct, analysis or interpretation of the research. All authors must approve the submitted manuscript and accept responsibility for its integrity. Authorship changes after submission require a documented request and appropriate agreement from affected authors.",
  },
  {
    title: "Conflicts of interest",
    text: "Authors must disclose financial or non-financial relationships that could reasonably be perceived as influencing their research. Editors with a conflict must not make the final decision on the affected manuscript.",
  },
  {
    title: "Research ethics and informed consent",
    text: "Research involving human participants must comply with applicable institutional, national and international ethical requirements. Where approval is required, authors should identify the approving body and approval information. Participant privacy, confidentiality and dignity must be protected, and informed consent obtained where required.",
  },
  {
    title: "Plagiarism and similarity screening",
    text: "The journal's stated similarity-screening threshold is less than 20% using an appropriate system such as Turnitin. Similarity scores are indicators for editorial assessment and are not, by themselves, proof of plagiarism. Substantial unattributed copying, fabricated references or other evidence of misconduct may lead to rejection or investigation.",
  },
  {
    title: "Generative artificial intelligence",
    text: "The journal states that AI use must not exceed 10%. AI systems cannot be listed as authors. Substantive use of generative AI must be disclosed, and authors remain responsible for verifying claims, references, quotations, data interpretations and other outputs. AI must not be used to fabricate evidence, sources, data or research results. Confidential manuscripts, reviewer reports and personal data must not be entered into public AI systems.",
  },
  {
    title: "Data availability",
    text: "Authors are encouraged to share research data, materials, instruments and code where ethically, legally and practically possible. Include a data-availability statement where applicable, identify publicly available datasets using stable links or identifiers, and explain restrictions where data cannot be shared.",
  },
];

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
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

function PolicyCard({ title, text }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="font-serif text-lg font-bold text-[#0B1F3A]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </article>
  );
}

export default function AuthorGuidelinesPage() {
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
            <span className="text-[#D5B36A]">Author Guidelines</span>
          </nav>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D5B36A]">
            Information for Contributors
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Author Guidelines
          </h1>

          <div className="mt-6 h-1 w-20 rounded-full bg-[#D5B36A]" />

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            Guidelines for preparing and submitting original scholarly
            manuscripts to the Ife Journal of Politics. Please review the
            requirements and publication policies before submitting your work.
          </p>

          <p className="mt-5 text-sm leading-6 text-slate-300">
            Department of Political Science
            <span className="mx-2 text-[#D5B36A]">|</span>
            Obafemi Awolowo University, Ile-Ife, Nigeria
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#submission"
              className="rounded-lg bg-[#D5B36A] px-6 py-3 font-semibold text-[#0B1F3A] transition hover:bg-white"
            >
              Submission Requirements
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Contact Editorial Office
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        {/* Introduction */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Before you submit"
            title="About the Journal"
            description="Ife Journal of Politics (IJP) is a peer-reviewed scholarly journal published by the Department of Political Science, Obafemi Awolowo University, Ile-Ife, Nigeria. It publishes original theoretical, conceptual, empirical, comparative, methodological and policy-oriented scholarship across Political Science."
          />

          <div className="grid gap-5 md:grid-cols-3">
            <PolicyCard
              title="Scholarly scope"
              text="IJP welcomes research on political institutions, political behaviour, governance, public policy, international affairs, conflict and peace, political economy, development and related fields."
            />
            <PolicyCard
              title="Geographical reach"
              text="The journal welcomes scholarship addressing Nigeria, Africa and the wider international community, including comparative and cross-national studies."
            />
            <PolicyCard
              title="Originality"
              text="Submissions must make a clear scholarly contribution. Submission confirms that the manuscript is not simultaneously under consideration elsewhere."
            />
          </div>
        </section>

        {/* Article types */}
        <section className="mb-16" id="article-types">
          <SectionHeading
            eyebrow="Choose your manuscript category"
            title="Article Types and Word Limits"
            description="Select the appropriate manuscript category before preparing your submission. The word limits below include the abstract and references."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articleTypes.map((article) => (
              <article
                key={article.title}
                className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 h-1 w-12 rounded-full bg-[#D5B36A]" />
                <h3 className="font-serif text-xl font-bold text-[#0B1F3A]">
                  {article.title}
                </h3>
                <p className="mt-3 inline-flex rounded-full bg-[#F5F0E5] px-3 py-1 text-sm font-semibold text-[#8B6B2E]">
                  {article.words}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {article.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-500">
            Note: Word limits are inclusive of the abstract and references.
          </p>
        </section>

        {/* Submission requirements */}
        <section className="mb-16" id="submission">
          <SectionHeading
            eyebrow="Prepare your manuscript"
            title="Submission Requirements"
            description="Check each applicable requirement before submitting your manuscript to the editorial office."
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9">
            <ul className="space-y-4">
              {requirements.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5F0E5] text-sm font-bold text-[#8B6B2E]">
                    ✓
                  </span>
                  <span className="text-sm leading-7 text-slate-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Manuscript structure */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Organise your paper"
            title="Manuscript Structure"
            description="Research manuscripts should generally follow the structure below. Qualitative, theoretical, historical and interpretive manuscripts may use a different structure appropriate to their research design."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {manuscriptStructure.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-sm font-bold text-[#D5B36A]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-medium leading-6 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* APA */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Citations and references"
            title="APA 7th Edition"
            description="IJP uses the Publication Manual of the American Psychological Association, 7th edition, for author–date citations, references and general scholarly presentation."
          />

          <div className="rounded-xl border-l-4 border-[#D5B36A] bg-white p-6 shadow-sm sm:p-8">
            <p className="leading-7 text-slate-600">
              Authors are responsible for checking the accuracy of all
              citations and references. Include DOI information wherever
              available and consult current APA Style guidance when a
              manuscript-specific question is not addressed by the journal's
              instructions.
            </p>
          </div>
        </section>

        {/* Peer review */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="What happens after submission"
            title="Peer Review Process"
            description="IJP uses double-anonymized peer review for research articles. Authors and reviewers are not identified to one another during the review process."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <PolicyCard
              title="Independent assessment"
              text="Each research manuscript normally receives at least two independent external reviews. Reviewers should have relevant subject expertise, declare conflicts of interest and maintain the confidentiality of review materials."
            />
            <PolicyCard
              title="Editorial decision"
              text="Editors assess the reviews and make the final publication decision. Review reports are confidential. Acceptance is not guaranteed, and the journal does not promise a fixed review time."
            />
          </div>

          <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-[#0B1F3A]">
            Possible Editorial Decisions
          </h3>

          <div className="flex flex-wrap gap-3">
            {reviewDecisions.map((decision) => (
              <span
                key={decision}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
              >
                {decision}
              </span>
            ))}
          </div>
        </section>

        {/* Ethics */}
        <section className="mb-16" id="ethics">
          <SectionHeading
            eyebrow="Research integrity"
            title="Publication Ethics and Author Responsibilities"
            description="Authors are responsible for ensuring that submitted research is original, ethically conducted, properly documented and compliant with the journal's publication policies."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {ethicsItems.map((item) => (
              <PolicyCard
                key={item.title}
                title={item.title}
                text={item.text}
              />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-[#F5F0E5]/60 p-6">
            <h3 className="font-serif text-xl font-bold text-[#0B1F3A]">
              Author Declaration
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              At submission, the corresponding author confirms that the
              manuscript is original and not under simultaneous consideration
              elsewhere; all authors have approved it; sources have been
              appropriately acknowledged; relevant ethics, funding and
              conflicts have been disclosed; and the manuscript complies with
              IJP policies.
            </p>
          </div>
        </section>

        {/* Publication information */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="After acceptance"
            title="Publication, Access and Fees"
            description="Please consider the journal's publication arrangements before submitting your manuscript."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <PolicyCard
              title="Open access and licensing"
              text="The journal describes itself as an open scholarly publication and identifies Creative Commons Attribution 4.0 (CC BY 4.0) for articles, with authors retaining copyright. Please confirm the applicable licence terms with the editorial office where clarification is needed."
            />
            <PolicyCard
              title="Article processing charges"
              text="The journal's documentation states that article processing charges apply to manuscripts accepted for publication. The document does not specify the amount, so authors should contact the editorial office for current fee details before proceeding."
            />
            <PolicyCard
              title="Publication schedule"
              text="IJP plans to publish two issues per calendar year, with one calendar year constituting one volume."
            />
            <PolicyCard
              title="Corrections and the scholarly record"
              text="The journal may issue corrections, retractions or expressions of concern where appropriate. Material changes affecting the scholarly record should not be made silently."
            />
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="rounded-2xl bg-[#0B1F3A] p-7 text-white sm:p-10"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D5B36A]">
            Submission enquiries
          </p>

          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Ready to Submit Your Manuscript?
          </h2>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#D5B36A]" />

          <p className="mt-5 max-w-2xl leading-8 text-slate-200">
            For manuscript submission instructions, article processing charges
            or questions about the journal's policies, contact the editorial
            office.
          </p>

          <div className="mt-7 space-y-2 text-sm leading-7 text-slate-200">
            <p className="font-semibold text-white">Editorial Office</p>
            <p>Department of Political Science</p>
            <p>Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria</p>
            <p>
              Email:{" "}
              <a
                href="mailto:journalofpolitics@oauife.edu.ng"
                className="font-semibold text-[#D5B36A] underline underline-offset-4 hover:text-white"
              >
                journalofpolitics@oauife.edu.ng
              </a>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:journalofpolitics@oauife.edu.ng?subject=Manuscript%20Submission%20Enquiry"
              className="rounded-lg bg-[#D5B36A] px-6 py-3 font-semibold text-[#0B1F3A] transition hover:bg-white"
            >
              Contact the Editorial Office
            </a>

            <Link
              href="/articles"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Browse Articles
            </Link>

            <Link
              href="/editorial-board"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Editorial Board
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
