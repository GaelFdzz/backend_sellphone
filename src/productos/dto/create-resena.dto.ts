import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateResenaDto {
    @IsNumber()
    Calificacion: number;

    @IsString()
    @IsNotEmpty()
    Comentario: string;

    @IsString()
    @IsNotEmpty()
    Usuario: string;
}
