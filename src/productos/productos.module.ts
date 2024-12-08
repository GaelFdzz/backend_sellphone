import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';

@Module({
    imports: [
        MulterModule.register({
            dest: join(__dirname, '..', '..', 'public', 'imagenes'),
        }),
    ],
    controllers: [ProductosController],
    providers: [ProductosService, PrismaService],
})
export class ProductosModule { }
