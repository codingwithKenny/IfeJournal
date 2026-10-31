
import prisma from "@/lib/prisma";
import {
  createSubfield,
  updateSubfield,
  deleteSubfield,
} from "../articles/action";
import SubfieldModal from "./SubfieldModal";

export const dynamic = "force-dynamic";

export default async function SubfieldsPage() {
  const subfields = await prisma.subfield.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });

  const totalSubfields = subfields.length;
  const activeSubfields = subfields.filter(
    (subfield) => subfield.isActive
  ).length;

  const articlesCategorized = subfields.reduce(
    (total, subfield) => total + subfield._count.articles,
    0
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6B2E]">
            Journal Administration
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
            Research Subfields
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the research areas used to categorize journal articles.
          </p>
        </div>

        <SubfieldModal mode="create" action={createSubfield} />
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Subfields"
          value={totalSubfields}
        />

        <StatCard
          label="Active Subfields"
          value={activeSubfields}
        />

        <StatCard
          label="Articles Categorized"
          value={articlesCategorized}
        />
      </div>

      {/* Subfields List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-[#0B1F3A]">
            All Subfields
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Subfields are arranged alphabetically.
          </p>
        </div>

        {subfields.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-[#0B1F3A]">
              No subfields yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first research subfield to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1.6fr)_100px_110px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Subfield</span>
              <span>Articles</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {subfields.map((subfield) => (
                <div
                  key={subfield.id}
                  className="grid gap-4 px-6 py-5 md:grid-cols-[minmax(0,1.6fr)_100px_110px_120px] md:items-center"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#0B1F3A]">
                      {subfield.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {subfield.slug}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      {subfield._count.articles}
                    </span>
                    <span className="ml-1 text-xs text-slate-400 md:hidden">
                      articles
                    </span>
                  </div>

                  <div>
                    {subfield.isActive ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 md:justify-end">
                    <SubfieldModal
                      mode="edit"
                      subfield={{
                        id: subfield.id,
                        name: subfield.name,
                        isActive: subfield.isActive,
                      }}
                      action={updateSubfield}
                    />

                    <form action={deleteSubfield}>
                      <input
                        type="hidden"
                        name="id"
                        value={subfield.id}
                      />

                      <button
                        type="submit"
                        disabled={subfield._count.articles > 0}
                        title={
                          subfield._count.articles > 0
                            ? "Remove this subfield from its articles before deleting"
                            : "Delete subfield"
                        }
                        className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
        {value}
      </p>
    </div>
  );
}
