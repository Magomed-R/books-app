-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifid" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CheckMail" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "CheckMail_pkey" PRIMARY KEY ("id")
);
