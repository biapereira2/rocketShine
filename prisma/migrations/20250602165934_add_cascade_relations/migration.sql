-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemCarrinho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "carrinhoId" INTEGER NOT NULL,
    CONSTRAINT "ItemCarrinho_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemCarrinho_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "Carrinho" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemCarrinho" ("carrinhoId", "id", "produtoId", "quantidade") SELECT "carrinhoId", "id", "produtoId", "quantidade" FROM "ItemCarrinho";
DROP TABLE "ItemCarrinho";
ALTER TABLE "new_ItemCarrinho" RENAME TO "ItemCarrinho";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
