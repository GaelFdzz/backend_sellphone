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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Multer } from 'multer';
import { CreateResenaDto } from './dto/create-resena.dto';
import * as fs from 'fs';

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
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }

    const imagePath = `/imagenes/${file.filename}`;
    const producto = await this.productosService.crearProducto({
      ...body,
      Imagen: imagePath,
    });
    return producto;
  }

  @Get(':id')
  async obtenerProductoPorId(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productosService.obtenerProductoPorId(id);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('Imagen', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'public'),
        filename: (req, file, callback) => {
          const fileExtension = path.extname(file.originalname);
          if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            return callback(
              new BadRequestException('El archivo debe ser una imagen válida'),
              null,
            );
          }
          const uniqueName = `${Date.now()}-${uuidv4()}${fileExtension}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async actualizarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Multer.File,
  ) {
    const productoExistente = await this.productosService.obtenerProductoPorId(id);
    if (!productoExistente) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (file) {
      // Eliminar imagen antigua
      const oldImagePath = join(
        __dirname,
        '..',
        '..',
        'public',
        productoExistente.Imagen,
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Error eliminando la imagen antigua:', err);
        }
      });

      body.Imagen = `/imagenes/${file.filename}`;
    }

    return this.productosService.actualizarProducto(id, body);
  }

  @Delete(':id')
  async eliminarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Query('confirm') confirm: string,
  ) {
    const confirmValue = confirm === 'true';
    const producto = await this.productosService.obtenerProductoPorId(id);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (confirmValue && producto.Imagen) {
      const imagePath = join(
        __dirname,
        '..',
        '..',
        'public',
        producto.Imagen,
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error eliminando la imagen:', err);
        }
      });
    }

    return this.productosService.eliminarProducto(id, confirmValue);
  }

  @Post(':id/resenas')
  async crearResena(
    @Param('id', ParseIntPipe) id: number,
    @Body() createResenaDto: CreateResenaDto,
  ) {
    return this.productosService.crearResena({
      Id_Producto: id,
      ...createResenaDto,
    });
  }

  @Get(':id/resenas')
  async obtenerReseñas(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.obtenerResenasPorProducto(id);
  }
}