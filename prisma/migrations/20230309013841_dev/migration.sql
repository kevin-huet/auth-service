-- CreateTable
CREATE TABLE "Right" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "application" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "possession" TEXT NOT NULL,

    CONSTRAINT "Right_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_rights" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_roleInheritance" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Right_name_key" ON "Right"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Right_application_name_key" ON "Right"("application", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Right_application_resource_action_possession_key" ON "Right"("application", "resource", "action", "possession");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_rights_AB_unique" ON "_rights"("A", "B");

-- CreateIndex
CREATE INDEX "_rights_B_index" ON "_rights"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_roleInheritance_AB_unique" ON "_roleInheritance"("A", "B");

-- CreateIndex
CREATE INDEX "_roleInheritance_B_index" ON "_roleInheritance"("B");

-- AddForeignKey
ALTER TABLE "_rights" ADD CONSTRAINT "_rights_A_fkey" FOREIGN KEY ("A") REFERENCES "Right"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rights" ADD CONSTRAINT "_rights_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roleInheritance" ADD CONSTRAINT "_roleInheritance_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roleInheritance" ADD CONSTRAINT "_roleInheritance_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
