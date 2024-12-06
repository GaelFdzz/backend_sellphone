/*
  Warnings:

  - You are about to alter the column `Estado` on the `carrito` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `carrito` MODIFY `Estado` ENUM('activo', 'finalizado') NULL DEFAULT 'activo';
