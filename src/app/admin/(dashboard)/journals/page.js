
import Link from "next/link";
import prisma from "@/lib/prisma";

import {
  createJournal,
  updateJournal,
  toggleJournalStatus,
  deleteJournal,
} from "../articles/action";

export const dynamic = "force-dynamic";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Notice({ type = "success", children }) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#0B1F3A]">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default async function JournalsPage({ searchParams }) {
  const params = await searchParams;
  const editId = params?.edit ? String(params.edit) : null;

  const [journals, subjects, editingJournal] = await Promise.all([
    prisma.journal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: {
            articles: true,
            volumes: true,
          },
        },
      },
    }),

    prisma.subject.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    }),

    editId
      ? prisma.journal.findUnique({
          where: { id: editId },
          include: {
            subjects: {
              select: { subjectId: true },
            },
          },
        })
      : Promise.resolve(null),
  ]);

  const activeCount = journals.filter((journal) => journal.isActive).length;
  const inactiveCount = journals.length - activeCount;
  const totalArticles = journals.reduce(
    (total, journal) => total + journal._count.articles,
    0
  );

  const selectedSubjectIds =
    editingJournal?.subjects.map((item) => item.subjectId) || [];

  const isEditing = Boolean(editingJournal);

  const errorMessages = {
    name: "Please enter a journal name.",
    invalid: "The requested journal could not be found.",
    notfound: "This journal no longer exists.",
    inuse: "This journal cannot be deleted because it has articles or volumes. Deactivate it instead.",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#8B6B2E]">
            ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#0B1F3A]">
            Journal Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create and manage the academic journals published on this platform.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Feedback messages */}
      {params?.saved && (
        <Notice>Journal saved successfully.</Notice>
      )}

      {params?.updated && (
        <Notice>Journal status updated successfully.</Notice>
      )}

      {params?.deleted && (
        <Notice>Journal deleted successfully.</Notice>
      )}

      {params?.error && (
        <Notice type="error">
          {errorMessages[String(params.error)] ||
            "Something went wrong. Please try again."}
        </Notice>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Journals"
          value={journals.length}
          description="All journals in the system"
        />
        <StatCard
          label="Active Journals"
          value={activeCount}
          description="Currently active"
        />
        <StatCard
          label="Inactive Journals"
          value={inactiveCount}
          description="Currently disabled"
        />
        <StatCard
          label="Total Articles"
          value={totalArticles}
          description="Across all journals"
        />
      </div>

      {/* Create / Edit form */}
      <section
        id="journal-form"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
          <h2 className="text-lg font-semibold text-[#0B1F3A]">
            {isEditing ? "Edit Journal" : "Add New Journal"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Update the journal information and its subjects."
              : "Enter the details of the new academic journal."}
          </p>
        </div>

        <form
          action={isEditing ? updateJournal : createJournal}
          className="space-y-6 p-6"
        >
          {isEditing && (
            <input
              type="hidden"
              name="id"
              value={editingJournal.id}
            />
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Journal Name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={editingJournal?.name || ""}
                placeholder="e.g. Ife Journal of Politics"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
              />
            </div>

            {/* <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Journal Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={editingJournal?.slug || ""}
                placeholder="ife-journal-of-politics"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
              />

              <p className="mt-1 text-xs text-gray-400">
                Used in the journal URL. Leave blank to generate it from the name.
              </p>
            </div> */}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Journal Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={editingJournal?.description || ""}
              placeholder="Write a short description of this journal..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
            />
          </div>

          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Journal Subjects
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Select the subjects that this journal covers. You can manage
                subjects from the Subjects page.
              </p>
            </div>

            {subjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
                No active subjects available yet.{" "}
                <Link
                  href="/admin/subjects"
                  className="font-medium text-[#8B6B2E] underline"
                >
                  Manage subjects
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <label
                    key={subject.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="subjectIds"
                      value={subject.id}
                      defaultChecked={selectedSubjectIds.includes(subject.id)}
                      className="h-4 w-4 rounded border-gray-300 accent-[#0B1F3A]"
                    />
                    <span>{subject.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              className="rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17365D]"
            >
              {isEditing ? "Save Changes" : "Create Journal"}
            </button>

            {isEditing && (
              <Link
                href="/admin/journals"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>
            )}
          </div>
        </form>
      </section>

      {/* Journal list */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              All Journals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {journals.length} journal{journals.length === 1 ? "" : "s"} registered
            </p>
          </div>
        </div>

        {journals.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📚
            </div>
            <h3 className="mt-4 font-semibold text-[#0B1F3A]">
              No journals yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first journal using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="p-6 transition hover:bg-gray-50/70"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-[#0B1F3A]">
                        {journal.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          journal.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {journal.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* <p className="mt-1 text-sm text-gray-400">
                      /{journal.slug}
                    </p> */}

                    {journal.description && (
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                        {journal.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>
                        <strong className="text-gray-800">
                          {journal._count.articles}
                        </strong>{" "}
                        Articles
                      </span>
                      <span>
                        <strong className="text-gray-800">
                          {journal._count.volumes}
                        </strong>{" "}
                        Volumes
                      </span>
                    </div>

                    {journal.subjects.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {journal.subjects.map(({ subject }) => (
                          <span
                            key={subject.id}
                            className="rounded-md bg-[#F5F2EA] px-2.5 py-1 text-xs text-[#725A2A]"
                          >
                            {subject.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link
                      href={`/admin/journals?edit=${journal.id}#journal-form`}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Edit
                    </Link>

                    <form action={toggleJournalStatus}>
                      <input
                        type="hidden"
                        name="id"
                        value={journal.id}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        {journal.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>

                    {journal._count.articles === 0 &&
                      journal._count.volumes === 0 && (
                        <form action={deleteJournal}>
                          <input
                            type="hidden"
                            name="id"
                            value={journal.id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
