/*
  Warnings:

  - You are about to drop the column `estoque` on the `Produto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" REAL NOT NULL
);
INSERT INTO "new_Produto" ("descricao", "id", "nome", "preco") SELECT "descricao", "id", "nome", "preco" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
