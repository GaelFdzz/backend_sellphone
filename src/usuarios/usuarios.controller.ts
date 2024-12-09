import { Controller, Get, Put, Body, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import * as bcrypt from 'bcrypt';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get(':id')
    async getUsuario(@Param('id', ParseIntPipe) id: number) {
        return await this.usuariosService.getUsuarioById(id);
    }

    @Put(':id')
    async updateUsuario(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: { Nombre?: string; Apellido?: string; Correo?: string },
    ) {
        const sanitizedData = {
            Nombre: updateData.Nombre || undefined,
            Apellido: updateData.Apellido || undefined,
            Correo: updateData.Correo || undefined,
        };

        return this.usuariosService.updateUsuario(id, sanitizedData);
    }

    @Put(':id/cambiar-contrasena')
    async cambiarContrasena(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { actualContrasena: string; nuevaContrasena: string },
    ) {
        const usuario = await this.usuariosService.getUsuarioById(id);

        // Validar contraseña actual
        const passwordValida = await bcrypt.compare(body.actualContrasena, usuario.Contrasena);
        if (!passwordValida) {
            throw new BadRequestException('La contraseña actual no es correcta.');
        }

        // Actualizar contraseña
        await this.usuariosService.cambiarContrasena(id, body.nuevaContrasena);
        return { message: 'Contraseña actualizada con éxito. Debes iniciar sesión nuevamente.' };
    }
}
