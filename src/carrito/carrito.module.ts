// src/carrito/carrito.module.ts
import { Module } from '@nestjs/common';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { PrismaModule } from '../prisma/prisma.module';  // Importa PrismaModule

@Module({
  imports: [PrismaModule],  // Asegúrate de tener PrismaModule importado
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule { }
