import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Aplicado (além do JwtAuthGuard) nos endpoints de entries/categories, que
// só existem pro backup na nuvem — sem assinatura PRO ativa, o backend
// recusa mesmo que o app tente sincronizar (defesa em profundidade, não só
// esconder o botão na UI).
@Injectable()
export class ProActiveGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string = request.user?.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { proAtivo: true },
    });

    if (!user?.proAtivo) {
      throw new ForbiddenException('Backup na nuvem é exclusivo do plano PRO');
    }
    return true;
  }
}
