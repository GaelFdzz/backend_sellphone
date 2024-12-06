import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
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

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/imagenes',
        filename: (req, file, callback) => {
          const fileExtension = path.extname(file.originalname);
          if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            throw new BadRequestException('El archivo debe ser una imagen');
          }
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + fileExtension;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async crearProducto(@Body() body: any, @UploadedFile() file: any) {
    if (file) {
      body.Imagen = `/imagenes/${file.filename}`;
    }
    return this.productosService.crearProducto(body);
  }

  @Get(':id')
  async obtenerProductoPorId(@Param('id') id: string) {
    const idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) {
      throw new BadRequestException('El ID debe ser un número válido');
    }

    const producto = await this.productosService.obtenerProductoPorId(
      idNumerico,
    );

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  @Put(':id')
  async actualizarProducto(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: any,
  ) {
    const idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) {
      throw new BadRequestException('El ID debe ser un número válido');
    }

    if (file) {
      body.Imagen = `/imagenes/${file.filename}`;
    }

    return this.productosService.actualizarProducto(idNumerico, body);
  }

  @Delete(':id')
  async eliminarProducto(@Param('id') id: string) {
    const idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) {
      throw new BadRequestException('El ID debe ser un número válido');
    }

    const productoExistente = await this.productosService.obtenerProductoPorId(
      idNumerico,
    );
    if (!productoExistente) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.productosService.eliminarProducto(idNumerico);
  }

  @Get(':id/resenas')
  async obtenerReseñas(@Param('id') id: string) {
    const idNumerico = parseInt(id, 10);
    if (isNaN(idNumerico)) {
      throw new BadRequestException('ID de producto inválido');
    }
    return this.productosService.obtenerResenasPorProducto(idNumerico);
  }
}
