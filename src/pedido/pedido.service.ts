import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de la ruta correcta

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) { }

  async getPedidosByUsuario(userId: number) {
    return this.prisma.pedidos.findMany({
      where: { Id_Usuario: userId },
      include: {
        detalle_pedidos: true, // Incluye detalles del pedido
      },
    });
  }
}
