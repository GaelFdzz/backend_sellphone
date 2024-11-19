-- CreateTable
CREATE TABLE `Roles` (
    `Id_Rol` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id_Rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `Id_Usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Apellido` VARCHAR(191) NOT NULL,
    `Correo` VARCHAR(191) NOT NULL,
    `Contrasena_Hash` VARCHAR(191) NOT NULL,
    `Id_Rol` INTEGER NULL,

    UNIQUE INDEX `Usuarios_Correo_key`(`Correo`),
    PRIMARY KEY (`Id_Usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorias` (
    `Id_Categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id_Categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Productos` (
    `Id_Producto` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NULL,
    `Precio` DECIMAL(10, 2) NOT NULL,
    `Stock` INTEGER NOT NULL,
    `Id_Usuario` INTEGER NULL,
    `Id_Categoria` INTEGER NULL,

    PRIMARY KEY (`Id_Producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publicaciones` (
    `Id_Publicacion` INTEGER NOT NULL AUTO_INCREMENT,
    `Titulo` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NULL,
    `Fecha_Publicacion` DATETIME(3) NOT NULL,
    `Id_Producto` INTEGER NULL,

    PRIMARY KEY (`Id_Publicacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalificacionProductos` (
    `Id_Calificacion` INTEGER NOT NULL AUTO_INCREMENT,
    `Puntuacion` INTEGER NOT NULL,
    `Comentario` VARCHAR(191) NULL,
    `Fecha_Calificacion` DATETIME(3) NOT NULL,
    `Id_Producto` INTEGER NULL,

    PRIMARY KEY (`Id_Calificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagos` (
    `Id_Pago` INTEGER NOT NULL AUTO_INCREMENT,
    `Fecha_Pago` DATETIME(3) NOT NULL,
    `Monto` DECIMAL(10, 2) NOT NULL,
    `Metodo_Pago` VARCHAR(191) NOT NULL,
    `Id_Usuario` INTEGER NOT NULL,

    PRIMARY KEY (`Id_Pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedidos` (
    `Id_Pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `Fecha_Pedido` DATETIME(3) NOT NULL,
    `Estado` VARCHAR(191) NOT NULL,
    `Id_Usuario` INTEGER NOT NULL,
    `Id_Pago` INTEGER NULL,

    PRIMARY KEY (`Id_Pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetallePedidos` (
    `Id_Detalle` INTEGER NOT NULL AUTO_INCREMENT,
    `Cantidad` INTEGER NOT NULL,
    `Precio` DECIMAL(10, 2) NOT NULL,
    `Id_Pedido` INTEGER NOT NULL,
    `Id_Producto` INTEGER NOT NULL,

    PRIMARY KEY (`Id_Detalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosAuditoria` (
    `Id_Auditoria` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_Usuario` INTEGER NOT NULL,
    `Cambio` VARCHAR(191) NOT NULL,
    `Fecha_Cambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Id_Auditoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_Id_Rol_fkey` FOREIGN KEY (`Id_Rol`) REFERENCES `Roles`(`Id_Rol`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `Usuarios`(`Id_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_Id_Categoria_fkey` FOREIGN KEY (`Id_Categoria`) REFERENCES `Categorias`(`Id_Categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Publicaciones` ADD CONSTRAINT `Publicaciones_Id_Producto_fkey` FOREIGN KEY (`Id_Producto`) REFERENCES `Productos`(`Id_Producto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalificacionProductos` ADD CONSTRAINT `CalificacionProductos_Id_Producto_fkey` FOREIGN KEY (`Id_Producto`) REFERENCES `Productos`(`Id_Producto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `Usuarios`(`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `Usuarios`(`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_Id_Pago_fkey` FOREIGN KEY (`Id_Pago`) REFERENCES `Pagos`(`Id_Pago`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetallePedidos` ADD CONSTRAINT `DetallePedidos_Id_Pedido_fkey` FOREIGN KEY (`Id_Pedido`) REFERENCES `Pedidos`(`Id_Pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetallePedidos` ADD CONSTRAINT `DetallePedidos_Id_Producto_fkey` FOREIGN KEY (`Id_Producto`) REFERENCES `Productos`(`Id_Producto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosAuditoria` ADD CONSTRAINT `UsuariosAuditoria_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `Usuarios`(`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
