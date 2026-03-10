/*
  Warnings:

  - Added the required column `userId` to the `Materia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Meta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rotina` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Materia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Materia" ("cor", "createdAt", "dataExame", "id", "nome", "prioridade") SELECT "cor", "createdAt", "dataExame", "id", "nome", "prioridade" FROM "Materia";
DROP TABLE "Materia";
ALTER TABLE "new_Materia" RENAME TO "Materia";
CREATE TABLE "new_Meta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objetivoMinutos" INTEGER NOT NULL,
    "dataInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Meta" ("ativa", "createdAt", "dataInicio", "id", "objetivoMinutos", "updatedAt") SELECT "ativa", "createdAt", "dataInicio", "id", "objetivoMinutos", "updatedAt" FROM "Meta";
DROP TABLE "Meta";
ALTER TABLE "new_Meta" RENAME TO "Meta";
CREATE TABLE "new_Rotina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Rotina_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rotina" ("diaSemana", "horaFim", "horaInicio", "id") SELECT "diaSemana", "horaFim", "horaInicio", "id" FROM "Rotina";
DROP TABLE "Rotina";
ALTER TABLE "new_Rotina" RENAME TO "Rotina";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
