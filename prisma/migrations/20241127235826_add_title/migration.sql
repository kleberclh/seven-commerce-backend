/*
  Warnings:

  - Added the required column `titulo` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `titulo` VARCHAR(191) NOT NULL;
