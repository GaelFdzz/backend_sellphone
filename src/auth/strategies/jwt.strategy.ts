import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';  // Asegúrate de importar PrismaService
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,  // Inyecta PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, email } = payload;  // Aquí usas el payload que contiene 'sub' y 'email'
    const user = await this.prismaService.usuarios.findUnique({
      where: { Correo: email },  // 'Correo' con mayúscula
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    return user;  // Retorna el usuario si es válido
  }
}