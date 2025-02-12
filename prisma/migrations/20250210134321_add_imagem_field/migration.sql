/*
  Warnings:

  - You are about to drop the column `imagemUrl` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "imagemUrl",
ADD COLUMN     "imagem" BYTEA;
