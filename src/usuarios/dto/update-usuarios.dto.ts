import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    Nombre?: string;

    @IsOptional()
    @IsString()
    Apellido?: string;

    @IsOptional()
    @IsEmail()
    Correo?: string;

    @IsOptional()
    @IsString()
    Contrasena?: string;
}