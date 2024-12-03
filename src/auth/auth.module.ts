import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';  // Asegúrate de importar PrismaService

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Define tu clave secreta en .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, PrismaService],
})
export class AuthModule {}