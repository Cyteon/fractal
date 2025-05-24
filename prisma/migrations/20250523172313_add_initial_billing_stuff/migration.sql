-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "polarCustomerId" TEXT,
ADD COLUMN     "subscribed" BOOLEAN NOT NULL DEFAULT false;
