/*
  Warnings:

  - You are about to drop the column `issueId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `journalId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Volume` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Volume` table. All the data in the column will be lost.
  - You are about to drop the column `journalId` on the `Volume` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Volume` table. All the data in the column will be lost.
  - You are about to drop the `ArticleSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[volumeId,issueNumber]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Volume` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year]` on the table `Volume` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_journalId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSubject" DROP CONSTRAINT "ArticleSubject_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSubject" DROP CONSTRAINT "ArticleSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_volumeId_fkey";

-- DropForeignKey
ALTER TABLE "JournalSubject" DROP CONSTRAINT "JournalSubject_journalId_fkey";

-- DropForeignKey
ALTER TABLE "JournalSubject" DROP CONSTRAINT "JournalSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Volume" DROP CONSTRAINT "Volume_journalId_fkey";

-- DropIndex
DROP INDEX "Article_issueId_idx";

-- DropIndex
DROP INDEX "Article_journalId_status_idx";

-- DropIndex
DROP INDEX "Volume_journalId_idx";

-- DropIndex
DROP INDEX "Volume_journalId_number_year_key";

-- DropIndex
DROP INDEX "Volume_year_isPublished_idx";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "issueId",
DROP COLUMN "journalId",
ADD COLUMN     "issueNumber" INTEGER,
ADD COLUMN     "volumeId" TEXT;

-- AlterTable
ALTER TABLE "Volume" DROP COLUMN "description",
DROP COLUMN "isPublished",
DROP COLUMN "journalId",
DROP COLUMN "title";

-- DropTable
DROP TABLE "ArticleSubject";

-- DropTable
DROP TABLE "Issue";

-- DropTable
DROP TABLE "Journal";

-- DropTable
DROP TABLE "JournalSubject";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "Subfield" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subfield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleSubfield" (
    "articleId" TEXT NOT NULL,
    "subfieldId" TEXT NOT NULL,

    CONSTRAINT "ArticleSubfield_pkey" PRIMARY KEY ("articleId","subfieldId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subfield_name_key" ON "Subfield"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subfield_slug_key" ON "Subfield"("slug");

-- CreateIndex
CREATE INDEX "Subfield_isActive_sortOrder_idx" ON "Subfield"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ArticleSubfield_subfieldId_idx" ON "ArticleSubfield"("subfieldId");

-- CreateIndex
CREATE INDEX "Article_volumeId_issueNumber_idx" ON "Article"("volumeId", "issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Article_volumeId_issueNumber_key" ON "Article"("volumeId", "issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Volume_number_key" ON "Volume"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Volume_year_key" ON "Volume"("year");

-- CreateIndex
CREATE INDEX "Volume_year_idx" ON "Volume"("year");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSubfield" ADD CONSTRAINT "ArticleSubfield_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSubfield" ADD CONSTRAINT "ArticleSubfield_subfieldId_fkey" FOREIGN KEY ("subfieldId") REFERENCES "Subfield"("id") ON DELETE CASCADE ON UPDATE CASCADE;
