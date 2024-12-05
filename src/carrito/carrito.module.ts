import { Module } from '@nestjs/common';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CarritoController],
  providers: [CarritoService, PrismaService],
})
export class CarritoModule {}
