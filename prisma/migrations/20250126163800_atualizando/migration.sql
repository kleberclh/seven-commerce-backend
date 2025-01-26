/*
  Warnings:

  - You are about to drop the `produtonopedido` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `produtonopedido` DROP FOREIGN KEY `ProdutoNoPedido_pedidoId_fkey`;

-- DropForeignKey
ALTER TABLE `produtonopedido` DROP FOREIGN KEY `ProdutoNoPedido_produtoId_fkey`;

-- DropTable
DROP TABLE `produtonopedido`;

-- CreateTable
CREATE TABLE `ProdutosItens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProdutosItens` ADD CONSTRAINT `ProdutosItens_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutosItens` ADD CONSTRAINT `ProdutosItens_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
