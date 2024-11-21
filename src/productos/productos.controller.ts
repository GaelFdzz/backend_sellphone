import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductosService } from './productos.service';
import * as path from 'path';

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Get()
  async obtenerProductos() {
    return this.productosService.obtenerProductos();
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
}
