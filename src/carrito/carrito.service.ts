import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate de tener el PrismaService configurado
import { Prisma } from '@prisma/client';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) { }

  // Crear carrito solo si no existe uno activo
  async createCart(userId: number) {
    const existingCart = await this.prisma.carrito.findFirst({
      where: {
        Id_Usuario: userId,
        Estado: 'activo',
      },
    });

    if (existingCart) {
      return existingCart;
    }

    return this.prisma.carrito.create({
      data: {
        Id_Usuario: userId,
        Estado: 'activo',
      },
    });
  }

  async getCartItems(userId: number) {
    const userIdNumber = Number(userId); // Asegúrate de que el userId es un número

    if (isNaN(userIdNumber)) {
      throw new Error('El ID del usuario no es válido');
    }

    return this.prisma.carrito.findFirst({
      where: {
        Id_Usuario: userIdNumber,  // Aquí pasa el valor directamente sin ningún objeto adicional
        Estado: 'activo',
      },
      include: {
        detalles_carrito: {
          include: {
            productos: true,
          },
        },
      },
    });
  }



  async addProductToCart(userId: number, productId: number, quantity: number) {
    const userIdNumber = Number(userId);
    const cart = await this.prisma.carrito.findFirst({
      where: {
        Id_Usuario: userIdNumber,
        Estado: 'activo',
      },
    });

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const existingProduct = await this.prisma.detalles_carrito.findFirst({
      where: {
        Id_Carrito: cart.Id_Carrito,
        Id_Producto: productId,
      },
    });

    if (existingProduct) {
      return this.prisma.detalles_carrito.update({
        where: { Id_Detalle_Carrito: existingProduct.Id_Detalle_Carrito },
        data: {
          Cantidad: existingProduct.Cantidad + quantity,
        },
      });
    } else {
      return this.prisma.detalles_carrito.create({
        data: {
          Id_Carrito: cart.Id_Carrito,
          Id_Producto: productId,
          Cantidad: quantity,
          Precio: (await this.prisma.productos.findUnique({ where: { Id_Producto: productId } })).Precio,
        },
      });
    }
  }

  // Método para eliminar un producto del carrito
  async removeProductFromCart(userId: number, productId: number): Promise<boolean> {
    const userIdNumber = Number(userId);
    const productIdNumber = Number(productId);

    if (isNaN(userIdNumber) || isNaN(productIdNumber)) {
      throw new Error('El ID del usuario o del producto no es válido');
    }

    const cart = await this.prisma.carrito.findFirst({
      where: {
        Id_Usuario: userIdNumber,
        Estado: 'activo',
      },
    });

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const result = await this.prisma.detalles_carrito.deleteMany({
      where: {
        Id_Carrito: cart.Id_Carrito,
        Id_Producto: productIdNumber,
      },
    });

    return result.count > 0;
  }



  // Método para vaciar el carrito
  async emptyCart(userId: number) {
    // Asegúrate de que el userId sea un número
    const validUserId = parseInt(userId.toString(), 10);
  
    const cart = await this.prisma.carrito.findFirst({
      where: {
        Id_Usuario: validUserId,  // Usamos el userId validado como número
        Estado: "activo",
      },
    });
  
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
  
    // Vaciar el carrito
    await this.prisma.carrito.updateMany({
      where: {
        Id_Usuario: validUserId,
        Estado: "activo",
      },
      data: {
        Estado: "activo",  // O el estado que corresponda
      },
    });
  
    return { message: 'Carrito vacío' };
  }
  
  
}
