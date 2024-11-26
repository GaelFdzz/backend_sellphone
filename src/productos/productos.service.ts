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
    console.log('Buscando producto con ID:', id);

    if (isNaN(id)) {
      throw new Error('El ID debe ser un número válido');
    }

    const producto = await this.prisma.productos.findUnique({
      where: {
        Id_Producto: id,
      },
      include: { categorias: true, resenas: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    console.log('Producto encontrado:', producto);
    return producto;
  }

  // productos.service.ts
  async obtenerResenasPorProducto(id: number) {
    console.log('ID recibido:', id);
    console.log('Tipo de ID:', typeof id);

    const resenas = await this.prisma.resenas.findMany({
      where: {
        Id_Producto: id,
      },
      orderBy: {
        Fecha: 'desc',
      },
    });

    return resenas;
  }



}
