import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarteiraDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}
