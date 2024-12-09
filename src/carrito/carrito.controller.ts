import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('cart')
export class CarritoController {
  constructor(private readonly cartService: CarritoService) { }

  @Post('create')
  createCart(@Body() body: { userId: number }) {
    return this.cartService.createCart(body.userId);
  }

  @Get(':userId')
  getCartItems(@Param('userId') userId: number) {
    if (isNaN(userId)) {
      throw new Error('El ID del usuario no es válido');
    }
    return this.cartService.getCartItems(userId);
  }

  @Post('add')
  addProductToCart(
    @Body() body: { userId: number; productId: number; quantity: number }
  ) {
    return this.cartService.addProductToCart(
      body.userId,
      body.productId,
      body.quantity
    );
  }

  @Delete(':userId/:productId')
  async removeProductFromCart(
    @Param('userId') userId: number,
    @Param('productId') productId: string
  ) {
    console.log('userId:', userId, 'productId:', productId); // Depuración

    // Si el productId es la palabra 'vaciar', se entiende como vaciar el carrito
    if (productId === 'vaciar') {
      // No se valida productId aquí, porque solo estamos vaciando el carrito
      return this.emptyCart(userId);
    }

    // Validación explícita de que ambos parámetros sean números válidos
    if (isNaN(userId) || isNaN(Number(productId))) {
      throw new Error('El ID del usuario o del producto no es válido');
    }

    const result = await this.cartService.removeProductFromCart(userId, Number(productId));
    if (!result) {
      throw new Error('Producto no encontrado');
    }
    return { message: 'Producto eliminado del carrito' };
  }

  @Delete(':userId/vaciar')
  async emptyCart(@Param('userId') userId: number) {
    if (isNaN(userId)) {
      throw new Error('El ID del usuario no es válido');
    }

    try {
      await this.cartService.emptyCart(userId);
      return { message: 'Carrito vacío' };
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw new Error('Error al vaciar el carrito');
    }
  }
}
