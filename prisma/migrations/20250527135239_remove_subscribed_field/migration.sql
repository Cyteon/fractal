/*
  Warnings:

  - You are about to drop the column `billingModel` on the `Org` table. All the data in the column will be lost.
  - You are about to drop the column `subscribed` on the `Org` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('SUBSCRIPTION', 'CREDITS', 'NONE');

-- AlterTable
ALTER TABLE "Org" DROP COLUMN "billingModel",
DROP COLUMN "subscribed",
ADD COLUMN     "billingType" "BillingType" NOT NULL DEFAULT 'NONE';

-- DropEnum
DROP TYPE "BillingModel";
