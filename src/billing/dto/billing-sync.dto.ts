import { IsBoolean, IsString } from 'class-validator';

export class BillingSyncDto {
  @IsString()
  productId: string;

  // Vazio quando active=false (não tem compra ativa pra referenciar).
  @IsString()
  purchaseToken: string;

  @IsBoolean()
  active: boolean;
}
