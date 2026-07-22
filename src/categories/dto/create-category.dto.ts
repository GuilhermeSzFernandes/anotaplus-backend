import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  // Limite mensal de gasto (feature de orçamento, PRO-only) — opcional,
  // omitido/null quando o usuário não define um.
  @IsOptional()
  @IsNumber()
  limite?: number;
}
