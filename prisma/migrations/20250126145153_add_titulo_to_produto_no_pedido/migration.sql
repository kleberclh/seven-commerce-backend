/*
  Warnings:

  - Added the required column `titulo` to the `ProdutoNoPedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtonopedido` ADD COLUMN `titulo` VARCHAR(191) NOT NULL;
