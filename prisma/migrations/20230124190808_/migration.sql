/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RoleRight` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('read', 'manage', 'update', 'delete', 'create');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles";

-- DropTable
DROP TABLE "RoleRight";

-- CreateTable
CREATE TABLE "AppRoles" (
    "id" SERIAL NOT NULL,
    "appName" TEXT NOT NULL,
    "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AppRoles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppRoles" ADD CONSTRAINT "AppRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
