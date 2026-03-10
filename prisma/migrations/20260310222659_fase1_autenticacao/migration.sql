/*
  Warnings:

  - You are about to drop the `SessaoEstudo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `descricao` on the `Materia` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Materia` table. All the data in the column will be lost.
  - Added the required column `dataExame` to the `Materia` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SessaoEstudo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Revisao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataProgramada" DATETIME NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "questoesTotal" INTEGER NOT NULL DEFAULT 0,
    "questoesAcerto" INTEGER NOT NULL DEFAULT 0,
    "materiaId" TEXT NOT NULL,
    CONSTRAINT "Revisao_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rotina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "prioridade" INTEGER NOT NULL DEFAULT 1,
    "dataExame" DATETIME NOT NULL,
    "cor" TEXT NOT NULL DEFAULT 'pink-600',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Materia" ("cor", "createdAt", "id", "nome") SELECT "cor", "createdAt", "id", "nome" FROM "Materia";
DROP TABLE "Materia";
ALTER TABLE "new_Materia" RENAME TO "Materia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
