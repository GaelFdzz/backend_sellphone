/*
  Warnings:

  - A unique constraint covering the columns `[Id_Usuario]` on the table `carrito` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `carrito_Id_Usuario_key` ON `carrito`(`Id_Usuario`);
