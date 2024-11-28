/*
  Warnings:

  - You are about to drop the `pedidoproduto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pedidoproduto` DROP FOREIGN KEY `PedidoProduto_pedidoId_fkey`;

-- DropForeignKey
ALTER TABLE `pedidoproduto` DROP FOREIGN KEY `PedidoProduto_produtoId_fkey`;

-- DropTable
DROP TABLE `pedidoproduto`;

-- CreateTable
CREATE TABLE `ProdutoNoPedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProdutoNoPedido` ADD CONSTRAINT `ProdutoNoPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutoNoPedido` ADD CONSTRAINT `ProdutoNoPedido_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
