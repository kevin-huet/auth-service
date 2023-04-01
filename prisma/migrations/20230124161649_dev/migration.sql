-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[];

-- CreateTable
CREATE TABLE "RoleRight" (
    "id" SERIAL NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "RoleRight_pkey" PRIMARY KEY ("id")
);
