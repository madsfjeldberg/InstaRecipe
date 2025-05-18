-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alertNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
