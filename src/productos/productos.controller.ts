import { Controller, Get } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
    constructor(private productosService: ProductosService) { }

    @Get()
    async obtenerProductos() {
        return this.productosService.obtenerProductos();
    }
}