/*
  Warnings:

  - You are about to drop the column `pedidoId` on the `produto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Produto_pedidoId_fkey` ON `produto`;

-- AlterTable
ALTER TABLE `produto` DROP COLUMN `pedidoId`;
