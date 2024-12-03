// prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Exporta PrismaService para que se pueda usar en otros módulos
})
export class PrismaModule {}