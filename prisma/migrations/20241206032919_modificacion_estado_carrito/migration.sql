-- DropIndex
DROP INDEX `carrito_Id_Usuario_key` ON `carrito`;

-- AlterTable
ALTER TABLE `carrito` MODIFY `Estado` ENUM('activo', 'finalizado', 'vacio') NULL DEFAULT 'vacio';
