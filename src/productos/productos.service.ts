import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async obtenerProductos() {
    return this.prisma.productos.findMany({
      include: {
        Categoria: true,
      },
    });
  }
}
