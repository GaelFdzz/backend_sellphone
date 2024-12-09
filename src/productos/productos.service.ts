import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResenaDto } from './dto/create-resena.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) { }

  async obtenerProductos() {
    const productos = await this.prisma.productos.findMany({
      include: {
        categorias: true,
      },
    });

    return productos.map((producto) => ({
      ...producto,
      Descripcion: producto.Descripcion || 'Sin descripción disponible',
      Imagen: producto.Imagen || '/imagenes/iphone.png',
      Precio: producto.Precio || 0,
      Stock: producto.Stock || 0,
    }));
  }




  async verificarCompraUsuario(idProducto: number, idUsuario: number) {
    const pedido = await this.prisma.pedidos.findFirst({
      where: {
        Id_Usuario: idUsuario, // Filtrar por el usuario que realizó el pedido
        detalle_pedidos: {
          some: { Id_Producto: idProducto }, // Verifica si el producto está en los detalles del pedido
        },
      },
    });

    return !!pedido; // Devuelve `true` si se encontró un pedido, `false` en caso contrario
  }


  async crearResena(data: { Id_Producto: number; Comentario: string; Calificacion: number; Usuario: string; EsSimulacion?: boolean }) {
    console.log(data); // Esto debería mostrar el objeto recibido en el backend.

    const usuario = await this.prisma.usuarios.findFirst({
      where: { Nombre: data.Usuario },
    });

    if (!usuario) {
      throw new BadRequestException("No se encontró el usuario asociado a la reseña.");
    }

    // Verificar si es una simulación
    if (!data.EsSimulacion) {
      const haComprado = await this.verificarCompraUsuario(data.Id_Producto, usuario.Id_Usuario);
      if (!haComprado) {
        throw new BadRequestException(
          "Solo puedes dejar reseñas si compraste el producto. Verifica que has realizado la compra correctamente."
        );
      }
    }

    // Si llegó aquí, crea la reseña sin importar si es simulación o no
    try {
      const nuevaResena = await this.prisma.resenas.create({
        data: {
          Id_Producto: data.Id_Producto,
          Comentario: data.Comentario,
          Calificacion: data.Calificacion,
          Usuario: data.Usuario,
        },
      });

      return nuevaResena;
    } catch (error) {
      throw new InternalServerErrorException("Error al crear la reseña.");
    }
  }

  async obtenerProductoPorId(id: number) {
    const producto = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
      include: { categorias: true, resenas: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return {
      ...producto,
      Descripcion: producto.Descripcion || 'Sin descripción disponible',
      Imagen: producto.Imagen || '/imagenes/iphone.png',
      Precio: producto.Precio || 0,
      Stock: producto.Stock || 0,
    };
  }

  async obtenerResenasPorProducto(id: number) {
    return this.prisma.resenas.findMany({
      where: { Id_Producto: id },
      orderBy: { Fecha: 'desc' },
    });
  }


  async crearProducto(data: any) {
    return this.prisma.productos.create({
      data: {
        Nombre: data.Nombre || 'Producto sin nombre',
        Descripcion: data.Descripcion || 'Sin descripción disponible',
        Precio: parseFloat(data.Precio) || 0,
        Stock: parseInt(data.Stock, 10) || 0,
        Id_Categoria: parseInt(data.Categoria, 10) || null,
        Imagen: data.Imagen || null,
      },
    });
  }

  async actualizarProducto(id: number, data: any) {
    const productoExistente = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
    });

    if (!productoExistente) {
      throw new NotFoundException("Producto no encontrado");
    }

    const updatedData: any = {
      Nombre: data.Nombre,
      Descripcion: data.Descripcion || productoExistente.Descripcion,
      Precio: parseFloat(data.Precio) || productoExistente.Precio,
      Stock: parseInt(data.Stock, 10) || productoExistente.Stock,
      Id_Categoria: parseInt(data.Categoria, 10) || productoExistente.Id_Categoria,
    };

    if (data.Imagen) {
      updatedData.Imagen = data.Imagen;
    }

    return this.prisma.productos.update({
      where: { Id_Producto: id },
      data: updatedData,
    });
  }


  async eliminarProducto(id: number, confirm: boolean = false) {
    const productoExistente = await this.prisma.productos.findUnique({
      where: { Id_Producto: id },
    });

    if (!productoExistente) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Comprueba dependencias
    const dependencias = {
      resenas: await this.prisma.resenas.count({ where: { Id_Producto: id } }),
      detallePedidos: await this.prisma.detalle_pedidos.count({
        where: { Id_Producto: id },
      }),
      detallesCarrito: await this.prisma.detalles_carrito.count({
        where: { Id_Producto: id },
      }),
      calificaciones: await this.prisma.calificacion_productos.count({
        where: { Id_Producto: id },
      }),
    };

    const dependenciasActivas = Object.entries(dependencias).filter(
      ([, count]) => count > 0,
    );

    if (dependenciasActivas.length > 0) {
      if (!confirm) {
        const detalles = dependenciasActivas
          .map(([tabla, count]) => `${tabla}: ${count}`)
          .join(', ');
        throw new BadRequestException(
          `No se puede eliminar el producto porque tiene dependencias activas (${detalles}). Confirma antes de proceder.`,
        );
      }

      // Si se confirma, elimina las dependencias
      await Promise.all(
        dependenciasActivas.map(([tabla]) => {
          switch (tabla) {
            case 'resenas':
              return this.prisma.resenas.deleteMany({ where: { Id_Producto: id } });
            case 'detallePedidos':
              return this.prisma.detalle_pedidos.deleteMany({
                where: { Id_Producto: id },
              });
            case 'detallesCarrito':
              return this.prisma.detalles_carrito.deleteMany({
                where: { Id_Producto: id },
              });
            case 'calificaciones':
              return this.prisma.calificacion_productos.deleteMany({
                where: { Id_Producto: id },
              });
          }
        }),
      );
    }

    // Elimina el producto
    return this.prisma.productos.delete({
      where: { Id_Producto: id },
    });
  }



}
