// src/carrito/carrito.controller.ts
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get(':userId')
  async obtenerCarrito(@Param('userId') userId: number) {
    return this.carritoService.obtenerCarrito(userId);
  }

  @Post('agregar')
  async agregarProducto(@Body() data: { userId: number; productoId: number; cantidad: number }) {
    return this.carritoService.agregarProducto(data.userId, data.productoId, data.cantidad);
  }

  @Post('vaciar/:userId')
  async vaciarCarrito(@Param('userId') userId: number) {
    return this.carritoService.vaciarCarrito(userId);
  }

  @Delete(':userId/producto/:productoId')
  async eliminarProducto(@Param('userId') userId: number, @Param('productoId') productoId: number) {
    return this.carritoService.eliminarProducto(userId, productoId);
  }
}
