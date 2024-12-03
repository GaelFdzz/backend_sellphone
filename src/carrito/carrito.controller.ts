import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) { }

  // Endpoint para obtener el carrito de un usuario
  @Get(':Id_Usuario')
  async obtenerCarrito(@Param('Id_Usuario') Id_Usuario: number) {
    try {
      return await this.carritoService.obtenerCarrito(Id_Usuario);
    } catch (error) {
      console.error('Error en el controlador al obtener el carrito:', error);
      throw error; // Lanzamos el error para que NestJS lo maneje adecuadamente
    }
  }

  @Post(':Id_Usuario')
  async agregarProductosAlCarrito(
    @Param('Id_Usuario') Id_Usuario: number,
    @Body() productos: any[]
  ) {
    try {
      return await this.carritoService.agregarProductoAlCarrito(Id_Usuario, productos);
    } catch (error) {
      console.error('Error en el controlador al agregar productos al carrito:', error);
      throw error;
    }
  }


  // Endpoint para eliminar un producto del carrito
  @Delete(':Id_Usuario/:Id_Producto')
  async eliminarProducto(
    @Param('Id_Usuario') Id_Usuario: number,
    @Param('Id_Producto') Id_Producto: number,
  ) {
    try {
      return await this.carritoService.eliminarProducto(Id_Usuario, Id_Producto);
    } catch (error) {
      console.error('Error en el controlador al eliminar el producto:', error);
      throw error; // Lanzamos el error para que NestJS lo maneje adecuadamente
    }
  }


}
