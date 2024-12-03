import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) { }

  async obtenerProductos() {
    const productos = await this.prisma.productos.findMany({
      include: {
        categorias: true,
      },
    });

    // Validar y limpiar datos antes de enviarlos
    return productos.map(producto => ({
      ...producto,
      Descripcion: producto.Descripcion || 'Sin descripción disponible',
      Imagen: producto.Imagen || '/imagenes/iphone.png',
      Precio: producto.Precio || 0,
      Stock: producto.Stock || 0,
    }));
  }

  async obtenerProductoPorId(id: number) {
    const producto = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
      include: { categorias: true, resenas: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar y limpiar datos
    return {
      ...producto,
      Descripcion: producto.Descripcion || 'Sin descripción disponible',
      Imagen: producto.Imagen || '/imagenes/iphone.png',
      Precio: producto.Precio || 0,
      Stock: producto.Stock || 0,
    };
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
        Nombre: data.Nombre || 'Producto sin nombre',
        Descripcion: data.Descripcion || 'Sin descripción disponible',
        Precio: data.Precio ? parseFloat(data.Precio) : 0,
        Stock: data.Stock ? parseInt(data.Stock, 10) : 0,
        Id_Categoria: data.Categoria ? parseInt(data.Categoria, 10) : null,
        Imagen: data.Imagen || null,
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
        Descripcion: data.Descripcion || 'Sin descripción disponible',
        Precio: parseFloat(data.Precio) || 0,
        Stock: parseInt(data.Stock, 10) || 0,
        Id_Categoria: parseInt(data.Categoria, 10) || null,
        Imagen: data.Imagen || null,
      },
    });
  }

  async eliminarProducto(id: number) {
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
