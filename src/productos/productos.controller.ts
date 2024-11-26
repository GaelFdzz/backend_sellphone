import { Controller, Get, Param, NotFoundException, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) { }

  @Get()
  async obtenerProductos() {
    return this.productosService.obtenerProductos();
  }

  @Get(':id')
  async obtenerProductoPorId(@Param('id') id: string) {
    console.log('ID recibido en el backend:', id);
    // Asegúrate de convertir el id a número
    const idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) {
      throw new BadRequestException('El ID debe ser un número válido');
    }

    const producto = await this.productosService.obtenerProductoPorId(idNumerico);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/imagenes',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async subirImagen(@UploadedFile() file: any) {
    return { ruta: `/imagenes/${file.filename}` }; // Retorna la ruta pública de la imagen
  }

  // productos.controller.ts
  @Get(':id/resenas')
  async obtenerReseñas(@Param('id') id: string) {
    const idNumerico = parseInt(id, 10); // Convierte el parámetro string a número
    if (isNaN(idNumerico)) {
      throw new Error("ID de producto inválido");
    }
    return this.productosService.obtenerResenasPorProducto(idNumerico);
  }

}