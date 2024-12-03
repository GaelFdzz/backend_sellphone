import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors(); // Habilita CORS para el frontend
  app.useStaticAssets(join(__dirname, '..', 'public')); // Archivos estáticos
  
  const port = process.env.PORT ?? 3000; // Lee el puerto desde el .env o usa 3000 como predeterminado
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();