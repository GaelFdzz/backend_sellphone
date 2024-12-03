export class CrearCarritoDto {
    usuarioId: number;
    productos: {
        productoId: number;
        cantidad: number;
    }[];
}  