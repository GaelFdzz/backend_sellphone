import { PartialType } from '@nestjs/mapped-types';
import { CrearCarritoDto } from './create-carrito.dto';

export class UpdateCarritoDto extends PartialType(CrearCarritoDto) { }