
// import Link from "next/link";
// import Image from "next/image";
// import prisma from "@/lib/prisma";

// export const metadata = {
//   title: "Journals | Ife Journal of Politics",
//   description:
//     "Browse academic journals, subject areas and publications from the Ife Journal of Politics.",
// };

// export const dynamic = "force-dynamic";

// export default async function JournalPage({ searchParams }) {
//   const params = await searchParams;

//   const query =
//     typeof params?.q === "string" ? params.q.trim() : "";

//   const selectedSubject =
//     typeof params?.subject === "string" ? params.subject.trim() : "";

//   // Get all active journals and their assigned subjects.
//   const journals = await prisma.journal.findMany({
//     where: {
//       isActive: true,
//     },
//     orderBy: {
//       name: "asc",
//     },
//     include: {
//       subjects: {
//         where: {
//           subject: {
//             isActive: true,
//           },
//         },
//         include: {
//           subject: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//             },
//           },
//         },
//       },
//       _count: {
//         select: {
//           articles: true,
//           volumes: true,
//         },
//       },
//     },
//   });

//   // Build the subject sidebar from subjects assigned to active journals.
//   const subjectMap = new Map();

//   journals.forEach((journal) => {
//     journal.subjects.forEach(({ subject }) => {
//       if (subject) {
//         subjectMap.set(subject.id, subject);
//       }
//     });
//   });

//   const subjects = [...subjectMap.values()].sort((a, b) =>
//     a.name.localeCompare(b.name)
//   );

//   // Filter journals by search query and selected subject.
//   const filteredJournals = journals.filter((journal) => {
//     const journalSubjects = journal.subjects.map(
//       (item) => item.subject.name
//     );

//     const searchableText = [
//       journal.name,
//       journal.description || "",
//       ...journalSubjects,
//     ]
//       .join(" ")
//       .toLowerCase();

//     const matchesSearch =
//       !query || searchableText.includes(query.toLowerCase());

//     const matchesSubject =
//       !selectedSubject ||
//       journalSubjects.some(
//         (subject) =>
//           subject.toLowerCase() === selectedSubject.toLowerCase()
//       );

//     return matchesSearch && matchesSubject;
//   });

//   return (
//     <main className="min-h-screen bg-white text-slate-800">
//       {/* PAGE TITLE */}
//       <header className="border-b border-slate-200 bg-[#0B1F3A] text-white">
//         <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
//           <nav
//             aria-label="Breadcrumb"
//             className="mb-4 text-sm text-slate-300"
//           >
//             <Link href="/" className="hover:text-[#D5B36A]">
//               Home
//             </Link>
//             <span className="mx-2 text-[#D5B36A]">/</span>
//             <span>Journals</span>
//           </nav>

//           <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
//             All Journals
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
//             Browse academic journals by subject or search by title
//             and keyword.
//           </p>
//         </div>
//       </header>

//       {/* JOURNAL DIRECTORY */}
//       <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">

//           {/* SUBJECTS */}
//           <aside>
//             <h2 className="border-b-2 border-[#D5B36A] pb-3 font-serif text-xl font-semibold text-[#0B1F3A]">
//               Subjects
//             </h2>

//             <nav
//               aria-label="Filter journals by subject"
//               className="mt-3"
//             >
//               <Link
//                 href="/journal"
//                 className={`block border-b border-slate-100 px-3 py-3 text-sm ${
//                   !selectedSubject
//                     ? "border-l-2 border-l-[#D5B36A] bg-[#FAFAF8] font-semibold text-[#0B1F3A]"
//                     : "text-slate-600 hover:text-[#9C762D]"
//                 }`}
//               >
//                 All Subjects
//               </Link>

//               {subjects.map((subject) => (
//                 <Link
//                   key={subject.id}
//                   href={`/journal?subject=${encodeURIComponent(subject.name)}`}
//                   className={`block border-b border-slate-100 px-3 py-3 text-sm ${
//                     selectedSubject.toLowerCase() ===
//                     subject.name.toLowerCase()
//                       ? "border-l-2 border-l-[#D5B36A] bg-[#FAFAF8] font-semibold text-[#0B1F3A]"
//                       : "text-slate-600 hover:text-[#9C762D]"
//                   }`}
//                 >
//                   {subject.name}
//                 </Link>
//               ))}

//               {subjects.length === 0 && (
//                 <p className="py-3 text-sm text-slate-500">
//                   No subjects available yet.
//                 </p>
//               )}
//             </nav>
//           </aside>

//           {/* SEARCH AND JOURNAL LIST */}
//           <div className="min-w-0">
//             <h2 className="font-serif text-2xl font-semibold text-[#0B1F3A]">
//               Search Journals
//             </h2>

//             <form
//               action="/journal"
//               method="get"
//               role="search"
//               className="mt-4"
//             >
//               {selectedSubject && (
//                 <input
//                   type="hidden"
//                   name="subject"
//                   value={selectedSubject}
//                 />
//               )}

//               <label
//                 htmlFor="journal-search"
//                 className="sr-only"
//               >
//                 Search journals by title, subject, or keyword
//               </label>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <input
//                   id="journal-search"
//                   type="search"
//                   name="q"
//                   defaultValue={query}
//                   placeholder="Search journals by title, subject, or keyword..."
//                   className="h-12 min-w-0 flex-1 border border-slate-300 px-4 text-sm outline-none focus:border-[#9C762D] focus:ring-1 focus:ring-[#D5B36A]"
//                 />

//                 <button
//                   type="submit"
//                   className="h-12 bg-[#0B1F3A] px-7 text-sm font-semibold text-white hover:bg-[#16375D]"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             {/* RESULTS HEADER */}
//             <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
//               <div>
//                 <h2 className="font-serif text-xl font-semibold text-[#0B1F3A]">
//                   Journal Directory
//                 </h2>

//                 {selectedSubject && (
//                   <p className="mt-1 text-sm text-slate-500">
//                     Subject: {selectedSubject}
//                   </p>
//                 )}
//               </div>

//               <p className="text-sm text-slate-500">
//                 Showing {filteredJournals.length}{" "}
//                 {filteredJournals.length === 1 ? "journal" : "journals"}
//               </p>
//             </div>

//             {/* JOURNAL LISTING */}
//             {filteredJournals.length > 0 ? (
//               <div>
//                 {filteredJournals.map((journal) => {
//                   const journalSubjects = journal.subjects.map(
//                     (item) => item.subject
//                   );

//                   return (
//                     <article
//                       key={journal.id}
//                       className="flex flex-col gap-5 border-b border-slate-200 py-6 sm:flex-row sm:items-start"
//                     >
//                       {/* JOURNAL LOGO */}
//                       <Link
//                         href={`/journal/${journal.slug}`}
//                         aria-label={`Open ${journal.name}`}
//                         className="flex h-24 w-24 shrink-0 items-center justify-center border border-slate-200 p-2"
//                       >
//                         <Image
//                           src="/ijp.jpg"
//                           alt={`${journal.name} logo`}
//                           width={100}
//                           height={100}
//                           className="h-full w-full object-contain"
//                         />
//                       </Link>

//                       {/* JOURNAL INFORMATION */}
//                       <div className="min-w-0 flex-1">
//                         <h3 className="font-serif text-xl font-semibold leading-7 text-[#0B1F3A]">
//                           <Link
//                             href={`/journal/${journal.slug}`}
//                             className="hover:text-[#9C762D]"
//                           >
//                             {journal.name}
//                           </Link>
//                         </h3>

//                         {journal.description && (
//                           <p className="mt-2 text-sm leading-7 text-slate-600">
//                             {journal.description}
//                           </p>
//                         )}

//                         {/* SUBJECT TAGS */}
//                         {journalSubjects.length > 0 && (
//                           <div className="mt-4 flex flex-wrap gap-2">
//                             {journalSubjects.map((subject) => (
//                               <Link
//                                 key={subject.id}
//                                 href={`/journal?subject=${encodeURIComponent(subject.name)}`}
//                                 className="border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-[#D5B36A] hover:text-[#0B1F3A]"
//                               >
//                                 {subject.name}
//                               </Link>
//                             ))}
//                           </div>
//                         )}

//                         {/* JOURNAL STATISTICS */}
//                         <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
//                           <span>
//                             <strong className="text-slate-800">
//                               {journal._count.volumes}
//                             </strong>{" "}
//                             Volumes
//                           </span>

//                           <span>
//                             <strong className="text-slate-800">
//                               {journal._count.articles}
//                             </strong>{" "}
//                             Articles
//                           </span>
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="py-10 text-center">
//                 <h3 className="font-serif text-lg font-semibold text-[#0B1F3A]">
//                   No journals found
//                 </h3>

//                 <p className="mt-2 text-sm text-slate-500">
//                   Try another search term or select a different subject.
//                 </p>

//                 <Link
//                   href="/journal"
//                   className="mt-4 inline-block text-sm font-semibold text-[#0B1F3A] hover:text-[#9C762D]"
//                 >
//                   Clear filters
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
