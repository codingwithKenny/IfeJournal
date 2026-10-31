import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleForm from "../new/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      authors: {
        orderBy: { authorOrder: "asc" },
        include: {
          author: true,
        },
      },
      subfields: {
        include: {
          subfield: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      volume: true,
    },
  });

  if (!article) {
    notFound();
  }

  const subfields = await prisma.subfield.findMany({
    where: {
      OR: [
        { isActive: true },
        {
          articles: {
            some: { articleId: id },
          },
        },
      ],
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });

  const initialData = {
    id: article.id,
    title: article.title,
    abstract: article.abstract,
    keywords: article.keywords,
    doi: article.doi || "",
    pdfUrl: article.pdfUrl || "",
    pageStart: article.pageStart ?? "",
    pageEnd: article.pageEnd ?? "",
    submittedDate: article.submittedDate,
    acceptedDate: article.acceptedDate,
    publicationDate: article.publicationDate,
    status: article.status,

    authors: article.authors.map((item) => ({
      fullName: item.author.fullName,
      email: item.author.email || "",
      affiliation: item.author.affiliation || "",
      orcid: item.author.orcid || "",
    })),

    subfieldIds: article.subfields.map(
      (item) => item.subfield.id
    ),
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B6B2E]">
          Journal Administration
        </p>

        <h1 className="font-serif text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
          Edit Article
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update the article information, authors, research subfields and
          publication details.
        </p>

        <p className="mt-3 text-sm font-medium text-[#0B1F3A]">
          {article.title}
        </p>

        {article.volume && (
          <p className="mt-1 text-xs text-slate-500">
            Currently Volume {article.volume.number}, Issue{" "}
            {article.issueNumber}
          </p>
        )}
      </div>

      <ArticleForm
        subfields={subfields}
        initialData={initialData}
        articleId={article.id}
      />
    </div>
  );
}