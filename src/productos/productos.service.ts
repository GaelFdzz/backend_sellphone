import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) { }

  async obtenerProductos() {
    return this.prisma.productos.findMany({
      include: {
        categorias: true,
      },
    });
  }

  async obtenerProductoPorId(id: number) {
    const producto = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
      include: { categorias: true, resenas: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async obtenerResenasPorProducto(id: number) {
    const resenas = await this.prisma.resenas.findMany({
      where: { Id_Producto: id },
      orderBy: { Fecha: 'desc' },
    });
    return resenas;
  }

  async crearProducto(data: any) {
    return this.prisma.productos.create({
      data: {
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        Precio: parseFloat(data.Precio),
        Stock: parseInt(data.Stock, 10),
        Id_Categoria: parseInt(data.Categoria, 10) || null,
        Imagen: data.Imagen ? data.Imagen : null, // Verifica si hay imagen
      },
    });
  }

  async actualizarProducto(id: number, data: any) {
    const productoExistente = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
    });

    if (!productoExistente) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.productos.update({
      where: { Id_Producto: id },
      data: {
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        Precio: parseFloat(data.Precio),
        Stock: parseInt(data.Stock, 10),
        Id_Categoria: parseInt(data.Categoria, 10) || null,
        Imagen: data.Imagen || null, // Verifica si hay imagen
      },
    });
  }

  async eliminarProducto(id: number) {
    // Verificar si el producto existe antes de eliminarlo
    const productoExistente = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
    });

    if (!productoExistente) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.productos.delete({
      where: { Id_Producto: id },
    });
  }
}