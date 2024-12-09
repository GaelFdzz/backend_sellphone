import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoService } from './pedido.service';


@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @Get('usuario/:id')
  async getPedidosByUsuario(@Param('id') id: string) {
    return this.pedidoService.getPedidosByUsuario(Number(id));
  }

}
