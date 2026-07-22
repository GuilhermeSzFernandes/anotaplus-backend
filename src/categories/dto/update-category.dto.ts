import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  // Único campo editável hoje: o limite mensal de orçamento (PRO-only).
  // null limpa o limite.
  @IsOptional()
  @IsNumber()
  limite?: number | null;
}
