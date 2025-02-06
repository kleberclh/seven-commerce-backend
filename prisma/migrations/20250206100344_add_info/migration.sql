/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `bairro` VARCHAR(191) NULL,
    ADD COLUMN `cep` VARCHAR(191) NULL,
    ADD COLUMN `cidade` VARCHAR(191) NULL,
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `cpf` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `estado` VARCHAR(191) NULL,
    ADD COLUMN `imagem` VARCHAR(191) NULL,
    ADD COLUMN `numero` VARCHAR(191) NULL,
    ADD COLUMN `rua` VARCHAR(191) NULL,
    ADD COLUMN `telefone` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cpf_key` ON `User`(`cpf`);
