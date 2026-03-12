-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "prioridade" INTEGER NOT NULL DEFAULT 1,
    "pesoNoExame" REAL NOT NULL DEFAULT 50,
    "prioridadeAdaptativa" REAL NOT NULL DEFAULT 1,
    "dataExame" DATETIME NOT NULL,
    "cor" TEXT NOT NULL DEFAULT 'pink-600',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Materia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Materia" ("cor", "createdAt", "dataExame", "id", "nome", "prioridade", "userId") SELECT "cor", "createdAt", "dataExame", "id", "nome", "prioridade", "userId" FROM "Materia";
DROP TABLE "Materia";
ALTER TABLE "new_Materia" RENAME TO "Materia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
