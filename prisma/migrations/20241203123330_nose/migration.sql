/*
  Warnings:

  - Made the column `Precio` on table `productos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Stock` on table `productos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `carrito_Id_Usuario_key` ON `carrito`;

-- AlterTable
ALTER TABLE `productos` MODIFY `Precio` DECIMAL(10, 2) NOT NULL,
    MODIFY `Stock` INTEGER NOT NULL;
