import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductosService } from './productos/productos.service';
import { ProductosController } from './productos/productos.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductosController],
  providers: [AppService, PrismaService, ProductosService],
  exports: [PrismaService]
})
export class AppModule {}
