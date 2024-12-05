import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(); // Esto inicializa la clase base PrismaClient
  }

  async onModuleInit() {
    await this.$connect(); // Conecta al inicio del módulo
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta al finalizar el módulo
  }
}
