-- CreateEnum
CREATE TYPE "BillingModel" AS ENUM ('SUBSCRIPTION', 'CREDITS');

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "billingModel" "BillingModel" NOT NULL DEFAULT 'CREDITS',
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "customerMeterId" TEXT,
ADD COLUMN     "legalEntityName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "EnterpriseContact" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT,

    CONSTRAINT "EnterpriseContact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnterpriseContact" ADD CONSTRAINT "EnterpriseContact_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
