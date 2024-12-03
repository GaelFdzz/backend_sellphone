import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductosService } from './productos/productos.service';
import { ProductosController } from './productos/productos.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';  // Importa JwtModule
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Asegúrate de tener esta variable de entorno en tu archivo .env
      signOptions: { expiresIn: '1h' },  // Puedes ajustar la expiración del token según sea necesario
    }),
    PrismaModule,
  ],
  controllers: [AppController, ProductosController, AuthController],
  providers: [AppService, PrismaService, ProductosService, AuthService],
  exports: [PrismaService],
})
export class AppModule {}
