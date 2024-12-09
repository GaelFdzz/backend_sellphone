import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) { }

    async getUsuarioById(id: number) {
        const usuario = await this.prisma.usuarios.findUnique({ where: { Id_Usuario: id } });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        return usuario;
    }

    async updateUsuario(
        id: number,
        updateData: { Nombre?: string; Apellido?: string; Correo?: string },
    ) {
        return await this.prisma.usuarios.update({
            where: { Id_Usuario: id },
            data: updateData,
        });
    }

    async cambiarContrasena(id: number, nuevaContrasena: string) {
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
        return await this.prisma.usuarios.update({
            where: { Id_Usuario: id },
            data: { Contrasena: hashedPassword },
        });
    }
}
