import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { CarritoService } from 'src/carrito/carrito.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private carritoService: CarritoService,
  ) { }

  // Método de login
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.prismaService.usuarios.findUnique({
      where: { Correo: createAuthDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    console.log('Usuario encontrado:', user); // Verificar usuario encontrado

    let passwordMatches = false; // Inicializar la comparación como falsa

    // Limpia las contraseñas para evitar errores de formato (elimina espacios)
    const inputPassword = createAuthDto.password.trim();
    const storedPassword = user.Contrasena.trim();

    console.log('Contraseña de entrada:', inputPassword);
    console.log('Contraseña almacenada:', storedPassword);

    // Verificar si la contraseña está cifrada con bcrypt
    if (this.isPasswordHashed(storedPassword)) {
      console.log('Comparando contraseña cifrada...');
      // Contraseña cifrada, usar bcrypt para comparar
      passwordMatches = await bcrypt.compare(inputPassword, storedPassword);
    } else {
      // Contraseña en texto plano, comparar directamente
      console.log('Comparando contraseña en texto plano...');
      passwordMatches = inputPassword === storedPassword;
    }

    console.log('Resultado de comparación:', passwordMatches);

    if (!passwordMatches) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Crear el carrito si no existe uno activo
    await this.carritoService.createCart(user.Id_Usuario);

    // Generar el JWT con los datos del usuario
    const payload = { sub: user.Id_Usuario, email: user.Correo, role: user.Id_Rol };

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
      throw new UnauthorizedException('El correo ya está registrado');
    }

    // Cifrado de la contraseña
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const newUser = await this.prismaService.usuarios.create({
      data: {
        Nombre: createAuthDto.name,
        Correo: createAuthDto.email,
        Apellido: createAuthDto.apellido,
        Contrasena: hashedPassword,
        Id_Rol: 2, // Asignamos rol por defecto (Cliente)
      },
    });

    return {
      message: 'Usuario registrado correctamente',
      user: newUser,
    };
  }

  // Función para verificar si la contraseña está cifrada
  private isPasswordHashed(password: string): boolean {
    return password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$');
  }
}