import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarritoService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerCarrito(userId: number) {
    return this.prisma.carrito.findUnique({
      where: { Id_Usuario: userId },
      include: {
        detalles_carrito: {
          include: { productos: true },
        },
      },
    });
  }

  async agregarProducto(userId: number, productoId: number, cantidad: number) {
    let carrito = await this.prisma.carrito.findFirst({
      where: { Id_Usuario: userId, Estado: 'activo' },
    });

    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: { Id_Usuario: userId },
      });
    }

    const producto = await this.prisma.productos.findUnique({
      where: { Id_Producto: productoId },
    });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return this.prisma.detalles_carrito.upsert({
      where: {
        Id_Carrito_Id_Producto: { Id_Carrito: carrito.Id_Carrito, Id_Producto: productoId },
      },
      create: {
        Id_Carrito: carrito.Id_Carrito,
        Id_Producto: productoId,
        Cantidad: cantidad,
        Precio: producto.Precio,
      },
      update: {
        Cantidad: { increment: cantidad },
      },
    });
  }

  async eliminarProducto(userId: number, productoId: number) {
    const carrito = await this.prisma.carrito.findFirst({
      where: { Id_Usuario: userId, Estado: 'activo' },
    });

    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    return this.prisma.detalles_carrito.deleteMany({
      where: { Id_Carrito: carrito.Id_Carrito, Id_Producto: productoId },
    });
  }

  async vaciarCarrito(userId: number) {
    const carrito = await this.prisma.carrito.findFirst({
      where: { Id_Usuario: userId, Estado: 'activo' },
    });

    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    return this.prisma.detalles_carrito.deleteMany({
      where: { Id_Carrito: carrito.Id_Carrito },
    });
  }
}
