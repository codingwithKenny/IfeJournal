
import Link from "next/link";
import prisma from "@/lib/prisma";

import {
  createVolume,
  updateVolume,
  deleteVolume,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../articles/action";

import VolumeModal from "./VolumeModal";
import IssueModal from "./IssueModal";

export const dynamic = "force-dynamic";

export default async function VolumesPage() {
  const [volumes, journals] = await Promise.all([
    prisma.volume.findMany({
      orderBy: [{ year: "desc" }, { number: "desc" }],
      include: {
        journal: {
          select: {
            id: true,
            name: true,
          },
        },
        issues: {
          orderBy: { number: "asc" },
          include: {
            _count: {
              select: { articles: true },
            },
          },
        },
        _count: {
          select: { issues: true },
        },
      },
    }),

    prisma.journal.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalIssues = volumes.reduce(
    (total, volume) => total + volume.issues.length,
    0
  );

  const publishedVolumes = volumes.filter(
    (volume) => volume.isPublished
  ).length;

  const publishedIssues = volumes.reduce(
    (total, volume) =>
      total + volume.issues.filter((issue) => issue.isPublished).length,
    0
  );

  return (
    <main className="space-y-7 p-4 sm:p-8">
      {/* HEADER */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin/articles"
            className="text-sm text-[#8B6B2E] hover:underline"
          >
            ← Back to Articles
          </Link>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#0B1F3A]">
            Volumes & Issues
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Organize the journal archive by journal, volume, publication year
            and issue. Manage publication status and the current issue from
            one place.
          </p>
        </div>

        <VolumeModal
          mode="create"
          action={createVolume}
          journals={journals}
        />
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total volumes" value={volumes.length} />
        <StatCard label="Published volumes" value={publishedVolumes} />
        <StatCard label="Total issues" value={totalIssues} />
        <StatCard label="Published issues" value={publishedIssues} />
      </div>

      {/* VOLUMES */}
      {volumes.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF5E9]">
            <span className="font-serif text-2xl text-[#8B6B2E]">V</span>
          </div>

          <h2 className="mt-4 font-serif text-xl font-bold text-[#0B1F3A]">
            No volumes yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first volume, then add its issues to start organizing
            the journal archive.
          </p>

          <div className="mt-5 flex justify-center">
            <VolumeModal
              mode="create"
              action={createVolume}
              journals={journals}
            />
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          {volumes.map((volume) => (
            <section
              key={volume.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* VOLUME HEADER */}
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:p-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-[#0B1F3A]">
                      Volume {volume.number}
                    </h2>

                    <span className="rounded-full bg-[#FAF5E9] px-3 py-1 text-xs font-semibold text-[#8B6B2E]">
                      {volume.year}
                    </span>

                    <StatusBadge active={volume.isPublished} />
                  </div>

                  <p className="mt-2 text-sm font-medium text-[#8B6B2E]">
                    {volume.journal?.name || "Journal not assigned"}
                  </p>

                  {volume.title && (
                    <p className="mt-2 font-medium text-slate-700">
                      {volume.title}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-500">
                    {volume._count.issues}{" "}
                    {volume._count.issues === 1 ? "issue" : "issues"}
                  </p>

                  {volume.description && (
                    <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-500">
                      {volume.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <VolumeModal
                    mode="edit"
                    volume={{
                      id: volume.id,
                      journalId: volume.journalId,
                      number: volume.number,
                      year: volume.year,
                      title: volume.title || "",
                      description: volume.description || "",
                      isPublished: volume.isPublished,
                    }}
                    action={updateVolume}
                    journals={journals}
                  />

                  <form action={deleteVolume}>
                    <input type="hidden" name="id" value={volume.id} />
                    <button
                      type="submit"
                      disabled={volume._count.issues > 0}
                      title={
                        volume._count.issues > 0
                          ? "Remove this volume's issues before deleting it."
                          : "Delete volume"
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              {/* ISSUE SECTION */}
              <div className="bg-[#FAFAF8] p-4 sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold text-[#0B1F3A]">
                      Issues in Volume {volume.number}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage individual issues and their publication status.
                    </p>
                  </div>

                  <IssueModal
                    mode="create"
                    volumeId={volume.id}
                    volumeLabel={`Volume ${volume.number} (${volume.year})`}
                    action={createIssue}
                  />
                </div>

                {volume.issues.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">
                      No issues have been added to this volume yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {volume.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-[#0B1F3A]">
                              Issue {issue.number}
                            </h4>

                            {issue.isCurrent && (
                              <span className="rounded-full bg-[#FAF5E9] px-2.5 py-1 text-xs font-semibold text-[#8B6B2E]">
                                Current issue
                              </span>
                            )}

                            <StatusBadge active={issue.isPublished} />
                          </div>

                          {issue.title && (
                            <p className="mt-1 text-sm text-slate-600">
                              {issue.title}
                            </p>
                          )}

                          <p className="mt-2 text-xs text-slate-400">
                            {issue.publicationDate
                              ? `Publication date: ${new Date(
                                  issue.publicationDate
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })}`
                              : "No publication date set"}
                            {" · "}
                            {issue._count.articles}{" "}
                            {issue._count.articles === 1
                              ? "article"
                              : "articles"}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <IssueModal
                            mode="edit"
                            volumeId={volume.id}
                            volumeLabel={`Volume ${volume.number} (${volume.year})`}
                            issue={{
                              id: issue.id,
                              number: issue.number,
                              title: issue.title || "",
                              description: issue.description || "",
                              publicationDate: issue.publicationDate
                                ? new Date(issue.publicationDate)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              isPublished: issue.isPublished,
                              isCurrent: issue.isCurrent,
                            }}
                            action={updateIssue}
                          />

                          <form action={deleteIssue}>
                            <input
                              type="hidden"
                              name="id"
                              value={issue.id}
                            />
                            <button
                              type="submit"
                              disabled={issue._count.articles > 0}
                              title={
                                issue._count.articles > 0
                                  ? "This issue contains articles."
                                  : "Delete issue"
                              }
                              className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:no-underline"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-[#0B1F3A]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Published" : "Draft"}
    </span>
  );
}
