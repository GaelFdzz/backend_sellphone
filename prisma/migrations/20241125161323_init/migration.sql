/*
  Warnings:

  - You are about to drop the column `Metodo_Pago` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `Id_Usuario` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `Contrasena_Hash` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `calificacionproductos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detallepedidos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuariosauditoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Contrasena` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `calificacionproductos` DROP FOREIGN KEY `CalificacionProductos_Id_Producto_fkey`;

-- DropForeignKey
ALTER TABLE `detallepedidos` DROP FOREIGN KEY `DetallePedidos_Id_Pedido_fkey`;

-- DropForeignKey
ALTER TABLE `detallepedidos` DROP FOREIGN KEY `DetallePedidos_Id_Producto_fkey`;

-- DropForeignKey
ALTER TABLE `pagos` DROP FOREIGN KEY `Pagos_Id_Usuario_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `Pedidos_Id_Pago_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `Pedidos_Id_Usuario_fkey`;

-- DropForeignKey
ALTER TABLE `productos` DROP FOREIGN KEY `Productos_Id_Categoria_fkey`;

-- DropForeignKey
ALTER TABLE `productos` DROP FOREIGN KEY `Productos_Id_Usuario_fkey`;

-- DropForeignKey
ALTER TABLE `publicaciones` DROP FOREIGN KEY `Publicaciones_Id_Producto_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `Usuarios_Id_Rol_fkey`;

-- DropForeignKey
ALTER TABLE `usuariosauditoria` DROP FOREIGN KEY `UsuariosAuditoria_Id_Usuario_fkey`;

-- AlterTable
ALTER TABLE `categorias` MODIFY `Nombre` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `pagos` DROP COLUMN `Metodo_Pago`,
    MODIFY `Fecha_Pago` DATE NOT NULL,
    MODIFY `Id_Usuario` INTEGER NULL;

-- AlterTable
ALTER TABLE `pedidos` ADD COLUMN `Total_Precio` DECIMAL(10, 2) NULL,
    MODIFY `Fecha_Pedido` DATE NOT NULL,
    MODIFY `Estado` VARCHAR(255) NOT NULL,
    MODIFY `Id_Usuario` INTEGER NULL;

-- AlterTable
ALTER TABLE `productos` DROP COLUMN `Id_Usuario`,
    MODIFY `Nombre` VARCHAR(255) NOT NULL,
    MODIFY `Descripcion` TEXT NULL,
    MODIFY `Precio` DECIMAL(10, 2) NULL,
    MODIFY `Stock` INTEGER NULL,
    MODIFY `Imagen` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `publicaciones` MODIFY `Titulo` VARCHAR(255) NOT NULL,
    MODIFY `Descripcion` TEXT NULL,
    MODIFY `Fecha_Publicacion` DATE NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `Nombre` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `Contrasena_Hash`,
    ADD COLUMN `Contrasena` VARCHAR(255) NOT NULL,
    MODIFY `Nombre` VARCHAR(255) NOT NULL,
    MODIFY `Apellido` VARCHAR(255) NOT NULL,
    MODIFY `Correo` VARCHAR(320) NOT NULL;

-- DropTable
DROP TABLE `calificacionproductos`;

-- DropTable
DROP TABLE `detallepedidos`;

-- DropTable
DROP TABLE `usuariosauditoria`;

-- CreateTable
CREATE TABLE `calificacion_productos` (
    `Id_Calificacion` INTEGER NOT NULL AUTO_INCREMENT,
    `Puntuacion` INTEGER NULL,
    `Comentario` TEXT NULL,
    `Id_Producto` INTEGER NULL,
    `Id_Usuario` INTEGER NULL,

    INDEX `Id_Producto`(`Id_Producto`),
    INDEX `Id_Usuario`(`Id_Usuario`),
    PRIMARY KEY (`Id_Calificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrito` (
    `Id_Carrito` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_Usuario` INTEGER NOT NULL,
    `Fecha_Creacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Estado` ENUM('activo', 'finalizado') NULL DEFAULT 'activo',

    INDEX `Id_Usuario`(`Id_Usuario`),
    PRIMARY KEY (`Id_Carrito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_pedidos` (
    `Id_Detalle` INTEGER NOT NULL AUTO_INCREMENT,
    `Cantidad` INTEGER NULL,
    `Precio` DECIMAL(10, 2) NULL,
    `Id_Pedido` INTEGER NULL,
    `Id_Producto` INTEGER NULL,

    INDEX `Id_Pedido`(`Id_Pedido`),
    INDEX `Id_Producto`(`Id_Producto`),
    PRIMARY KEY (`Id_Detalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalles_carrito` (
    `Id_Detalle_Carrito` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_Carrito` INTEGER NOT NULL,
    `Id_Producto` INTEGER NOT NULL,
    `Cantidad` INTEGER NOT NULL,
    `Precio` DECIMAL(10, 2) NOT NULL,

    INDEX `Id_Carrito`(`Id_Carrito`),
    INDEX `Id_Producto`(`Id_Producto`),
    PRIMARY KEY (`Id_Detalle_Carrito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensajes` (
    `Id_Mensaje` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Correo_Electronico` VARCHAR(320) NOT NULL,
    `Asunto` VARCHAR(255) NOT NULL,
    `Mensaje` TEXT NOT NULL,
    `Fecha_Recibido` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`Id_Mensaje`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `Id_Resena` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_Producto` INTEGER NOT NULL,
    `Usuario` VARCHAR(255) NOT NULL,
    `Comentario` TEXT NOT NULL,
    `Calificacion` INTEGER NOT NULL,
    `Fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_resenas_producto`(`Id_Producto`),
    PRIMARY KEY (`Id_Resena`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_productos_nombre` ON `productos`(`Nombre`);

-- CreateIndex
CREATE INDEX `idx_usuario_apellido` ON `usuarios`(`Apellido`);

-- CreateIndex
CREATE INDEX `idx_usuario_nombre` ON `usuarios`(`Nombre`);

-- AddForeignKey
ALTER TABLE `calificacion_productos` ADD CONSTRAINT `calificacion_productos_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos`(`Id_Producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `calificacion_productos` ADD CONSTRAINT `calificacion_productos_ibfk_2` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios`(`Id_Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `carrito` ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios`(`Id_Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_pedidos` ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`Id_Pedido`) REFERENCES `pedidos`(`Id_Pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_pedidos` ADD CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`Id_Producto`) REFERENCES `productos`(`Id_Producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalles_carrito` ADD CONSTRAINT `detalles_carrito_ibfk_1` FOREIGN KEY (`Id_Carrito`) REFERENCES `carrito`(`Id_Carrito`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalles_carrito` ADD CONSTRAINT `detalles_carrito_ibfk_2` FOREIGN KEY (`Id_Producto`) REFERENCES `productos`(`Id_Producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios`(`Id_Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios`(`Id_Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`Id_Pago`) REFERENCES `pagos`(`Id_Pago`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_Categoria`) REFERENCES `categorias`(`Id_Categoria`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicaciones` ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos`(`Id_Producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos`(`Id_Producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`Id_Rol`) REFERENCES `roles`(`Id_Rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `pagos` RENAME INDEX `Pagos_Id_Usuario_fkey` TO `Id_Usuario`;

-- RenameIndex
ALTER TABLE `pedidos` RENAME INDEX `Pedidos_Id_Pago_fkey` TO `Id_Pago`;

-- RenameIndex
ALTER TABLE `pedidos` RENAME INDEX `Pedidos_Id_Usuario_fkey` TO `Id_Usuario`;

-- RenameIndex
ALTER TABLE `productos` RENAME INDEX `Productos_Id_Categoria_fkey` TO `Id_Categoria`;

-- RenameIndex
ALTER TABLE `publicaciones` RENAME INDEX `Publicaciones_Id_Producto_fkey` TO `Id_Producto`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `Usuarios_Correo_key` TO `Correo`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `Usuarios_Id_Rol_fkey` TO `Id_Rol`;
