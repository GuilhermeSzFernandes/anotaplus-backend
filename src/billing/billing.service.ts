import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BillingSyncDto } from './dto/billing-sync.dto';

/**
 * Registra o que o app relata sobre a assinatura (Google Play Billing) do
 * usuário. Não verifica o purchaseToken contra a API do Google Play
 * Developer (precisaria de uma service account com acesso à Android
 * Publisher API, que ainda não existe) — por enquanto confia no que o
 * cliente relata, o que já é assinado/validado localmente pelo Play
 * Billing Library, mas não é à prova de um app adulterado. Gap conhecido,
 * documentado no PROJETO.md.
 */
@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async sincronizar(userId: string, dto: BillingSyncDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        proAtivo: dto.active,
        proProductId: dto.productId,
        proPurchaseToken: dto.active ? dto.purchaseToken : null,
        proAtualizadoEm: new Date(),
      },
      select: { proAtivo: true },
    });
    return user;
  }
}
