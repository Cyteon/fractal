/*
  Warnings:

  - Added the required column `type` to the `AuditLogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLogEntry" ADD COLUMN     "type" TEXT NOT NULL;
