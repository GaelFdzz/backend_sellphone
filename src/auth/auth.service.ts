import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  // Método de login
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.prismaService.usuarios.findUnique({
      where: { Correo: createAuthDto.email },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si la contraseña es correcta
    const passwordMatches = await bcrypt.compare(createAuthDto.password, user.Contrasena);
    if (!passwordMatches) {
      throw new Error('Contraseña incorrecta');
    }

    // Crear payload con información relevante para el token
    const payload = { sub: user.Id_Usuario, email: user.Correo };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Método de registro
  async register(createAuthDto: CreateAuthDto) {
    const userExists = await this.prismaService.usuarios.findUnique({
      where: { Correo: createAuthDto.email },
    });

    if (userExists) {
      throw new Error('El correo ya está registrado');
    }

    // Hash de la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const newUser = await this.prismaService.usuarios.create({
      data: {
        Nombre: createAuthDto.name,  // Asegúrate de pasar 'name' desde el DTO
        Correo: createAuthDto.email,  // Asegúrate de pasar 'email' desde el DTO
        Apellido: createAuthDto.apellido,  // Pasar 'apellido' desde el DTO
        Contrasena: hashedPassword,  // Asegúrate de pasar la contraseña hasheada
      },
    });

    return {
      message: 'Usuario registrado correctamente',
      user: newUser,
    };
  }
}