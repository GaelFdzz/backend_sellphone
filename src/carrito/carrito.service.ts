import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()

export class CarritoService {
  constructor(private readonly prisma: PrismaService) { }



  // Método para obtener el carrito de un usuario
  // Método para obtener el carrito de un usuario
  async obtenerCarrito(Id_Usuario: number) {
    try {
      let carrito = await this.prisma.carrito.findFirst({
        where: {
          Id_Usuario: Number(Id_Usuario),
        },
        include: {
          detalles_carrito: {
            include: {
              productos: true,
            },
          },
        },
      });

      if (!carrito) {
        carrito = await this.prisma.carrito.create({
          data: {
            Id_Usuario: Number(Id_Usuario),
            detalles_carrito: {
              create: [], // Crea el carrito vacío inicialmente
            },
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

      return carrito;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw new HttpException('Error al obtener el carrito', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async agregarProductoAlCarrito(Id_Usuario: number, productos: any[]) {
    if (!Array.isArray(productos)) {
      throw new HttpException('Los productos deben ser un arreglo', HttpStatus.BAD_REQUEST);
    }

    const productosValidos = productos.filter(
      (producto) =>
        typeof producto.Id_Producto === 'number' &&
        typeof producto.Cantidad === 'number' &&
        typeof producto.Precio === 'number'
    );

    if (productosValidos.length === 0) {
      throw new HttpException('No hay productos válidos para agregar al carrito', HttpStatus.BAD_REQUEST);
    }

    const carrito = await this.prisma.carrito.findFirst({
      where: { Id_Usuario },
      include: { detalles_carrito: true },
    });

    if (!carrito) {
      throw new HttpException('Carrito no encontrado', HttpStatus.NOT_FOUND);
    }

    const detallesCarrito = productosValidos.map((producto) => ({
      Id_Carrito: carrito.Id_Carrito,
      Id_Producto: producto.Id_Producto,
      Cantidad: producto.Cantidad,
      Precio: producto.Precio,
    }));

    try {
      await this.prisma.detalles_carrito.createMany({
        data: detallesCarrito,
      });

      return { message: 'Productos agregados al carrito correctamente' };
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      throw new HttpException(
        `Error al agregar productos al carrito: ${error.message || 'Desconocido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }





  // Método para eliminar un producto del carrito
  async eliminarProducto(Id_Usuario: number, Id_Producto: number) {
    try {
      // Buscar el carrito del usuario
      const carrito = await this.prisma.carrito.findFirst({
        where: { Id_Usuario },
        include: {
          detalles_carrito: true, // Incluir los detalles del carrito
        },
      });

      // Verificar si el carrito existe
      if (!carrito) {
        throw new HttpException('Carrito no encontrado', HttpStatus.NOT_FOUND);
      }

      // Buscar el detalle del producto a eliminar
      const detalleCarrito = carrito.detalles_carrito.find(
        (detalle) => detalle.Id_Producto === Id_Producto,
      );

      // Verificar si el producto existe en el carrito
      if (!detalleCarrito) {
        throw new HttpException('Producto no encontrado en el carrito', HttpStatus.NOT_FOUND);
      }

      // Eliminar el producto del carrito
      await this.prisma.detalles_carrito.delete({
        where: { Id_Detalle_Carrito: detalleCarrito.Id_Detalle_Carrito },
      });

      return { message: 'Producto eliminado exitosamente del carrito' };
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      if (error instanceof HttpException) {
        throw error; // Re-throw if it's a known exception
      }
      throw new HttpException(
        `Error al eliminar el producto: ${error.message || 'Desconocido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
