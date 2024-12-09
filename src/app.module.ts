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
import { CarritoService } from './carrito/carrito.service';
import { CarritoController } from './carrito/carrito.controller';
import { PedidoController } from './pedido/pedido.controller';
import { PedidoService } from './pedido/pedido.service';
import { CarritoModule } from './carrito/carrito.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosController } from './usuarios/usuarios.controller';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Asegúrate de tener esta variable de entorno en tu archivo .env
      signOptions: { expiresIn: '1h' },  // Puedes ajustar la expiración del token según sea necesario
    }),
    PrismaModule,
    CarritoModule,
    PedidoModule,
    ProductosModule,
  ],
  controllers: [AppController, ProductosController, AuthController, CarritoController, PedidoController, UsuariosController],
  providers: [AppService, PrismaService, ProductosService, AuthService, CarritoService, PedidoService, UsuariosService],
  exports: [PrismaService],
})
export class AppModule {}
