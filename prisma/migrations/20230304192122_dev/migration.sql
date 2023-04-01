/*
  Warnings:

  - You are about to drop the `AppRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AppRoles" DROP CONSTRAINT "AppRoles_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[];

-- DropTable
DROP TABLE "AppRoles";
