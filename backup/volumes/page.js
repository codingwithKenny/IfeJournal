
import prisma from "@/lib/prisma";

import {
  createVolume,
  updateVolume,
  deleteVolume,
} from "../../src/app/admin/(dashboard)/articles/action";

import VolumeModal from "./VolumeModal";

export const dynamic = "force-dynamic";

export default async function VolumesPage() {
  const volumes = await prisma.volume.findMany({
    orderBy: [{ year: "desc" }, { number: "desc" }],
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });

  return (
    <main className="space-y-7 p-4 sm:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
            Volumes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage publication volumes and their corresponding publication
            years. Articles receive sequential issue numbers automatically
            when published.
          </p>
        </div>

        <VolumeModal
          mode="create"
          action={createVolume}
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total volumes" value={volumes.length} />
        <StatCard
          label="Articles assigned"
          value={volumes.reduce(
            (total, volume) => total + volume._count.articles,
            0
          )}
        />
      </div>

      {volumes.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF5E9]">
            <span className="font-serif text-2xl text-[#8B6B2E]">V</span>
          </div>

          <h2 className="mt-4 font-serif text-xl font-bold text-[#0B1F3A]">
            No volumes yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first volume to start organizing published articles.
          </p>

          <div className="mt-5 flex justify-center">
            <VolumeModal
              mode="create"
              action={createVolume}
            />
          </div>
        </section>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-serif text-lg font-bold text-[#0B1F3A]">
              Publication Volumes
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {volumes.map((volume) => (
              <div
                key={volume.id}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#0B1F3A]">
                      Volume {volume.number}
                    </h3>

                    <span className="rounded-full bg-[#FAF5E9] px-3 py-1 text-xs font-semibold text-[#8B6B2E]">
                      {volume.year}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {volume._count.articles}{" "}
                    {volume._count.articles === 1 ? "article" : "articles"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <VolumeModal
                    mode="edit"
                    volume={{
                      id: volume.id,
                      number: volume.number,
                      year: volume.year,
                    }}
                    action={updateVolume}
                  />

                  <form action={deleteVolume}>
                    <input
                      type="hidden"
                      name="id"
                      value={volume.id}
                    />

                    <button
                      type="submit"
                      disabled={volume._count.articles > 0}
                      title={
                        volume._count.articles > 0
                          ? "This volume contains articles."
                          : "Delete volume"
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
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
