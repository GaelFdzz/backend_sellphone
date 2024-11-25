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
CREATE TABLE `categorias` (
    `Id_Categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Id_Categoria`)
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
CREATE TABLE `pagos` (
    `Id_Pago` INTEGER NOT NULL AUTO_INCREMENT,
    `Monto` DECIMAL(10, 2) NOT NULL,
    `Fecha_Pago` DATE NOT NULL,
    `Id_Usuario` INTEGER NULL,

    INDEX `Id_Usuario`(`Id_Usuario`),
    PRIMARY KEY (`Id_Pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `Id_Pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `Fecha_Pedido` DATE NOT NULL,
    `Estado` VARCHAR(255) NOT NULL,
    `Id_Usuario` INTEGER NULL,
    `Id_Pago` INTEGER NULL,
    `Total_Precio` DECIMAL(10, 2) NULL,

    INDEX `Id_Pago`(`Id_Pago`),
    INDEX `Id_Usuario`(`Id_Usuario`),
    PRIMARY KEY (`Id_Pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `Id_Producto` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Descripcion` TEXT NULL,
    `Precio` DECIMAL(10, 2) NULL,
    `Stock` INTEGER NULL,
    `Id_Categoria` INTEGER NULL,
    `Imagen` VARCHAR(255) NULL,

    INDEX `Id_Categoria`(`Id_Categoria`),
    INDEX `idx_productos_nombre`(`Nombre`),
    PRIMARY KEY (`Id_Producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicaciones` (
    `Id_Publicacion` INTEGER NOT NULL AUTO_INCREMENT,
    `Titulo` VARCHAR(255) NOT NULL,
    `Descripcion` TEXT NULL,
    `Fecha_Publicacion` DATE NOT NULL,
    `Id_Producto` INTEGER NULL,

    INDEX `Id_Producto`(`Id_Producto`),
    PRIMARY KEY (`Id_Publicacion`)
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

-- CreateTable
CREATE TABLE `roles` (
    `Id_Rol` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Id_Rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `Id_Usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Apellido` VARCHAR(255) NOT NULL,
    `Correo` VARCHAR(320) NOT NULL,
    `Contrasena` VARCHAR(255) NOT NULL,
    `Id_Rol` INTEGER NULL,

    UNIQUE INDEX `Correo`(`Correo`),
    INDEX `Id_Rol`(`Id_Rol`),
    INDEX `idx_usuario_apellido`(`Apellido`),
    INDEX `idx_usuario_nombre`(`Nombre`),
    PRIMARY KEY (`Id_Usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
