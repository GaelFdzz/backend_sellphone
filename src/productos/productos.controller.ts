import { Controller, Get, Param, NotFoundException, Post, UploadedFile, UseInterceptors, BadRequestException, Body, Put, Delete, ParseIntPipe, Query, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Multer } from 'multer'; // Importar Multer directamente

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) { }

  @Get()
  async obtenerProductos() {
    return this.productosService.obtenerProductos();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('Imagen', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'public'),
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async crearProducto(
    @UploadedFile() file: Multer.File,
    @Body() body: any,
  ) {
    const imagePath = `/imagenes/${file.filename}`;
    const producto = await this.productosService.crearProducto({
      ...body,
      Imagen: imagePath,
    });
    return producto;
  }

  @Get(':id')
  async obtenerProductoPorId(@Param('id') id: string) {
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

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/imagenes',
        filename: (req, file, callback) => {
          const fileExtension = path.extname(file.originalname);
          if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            return callback(new BadRequestException('El archivo debe ser una imagen'), null);
          }
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
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
  async eliminarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Query('confirm') confirm: string,
  ) {
    const confirmValue = confirm === 'true';
    return this.productosService.eliminarProducto(id, confirmValue);
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