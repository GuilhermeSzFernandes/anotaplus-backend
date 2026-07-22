import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarteiraDto } from './dto/create-carteira.dto';

@Injectable()
export class CarteirasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.carteira.findMany({
      where: { userId },
      orderBy: { nome: 'asc' },
    });
  }

  // upsert pelo mesmo motivo de CategoriesService.create: o app reenvia a
  // mesma carteira toda sincronização, precisa ser idempotente.
  create(userId: string, dto: CreateCarteiraDto) {
    return this.prisma.carteira.upsert({
      where: { userId_nome: { userId, nome: dto.nome } },
      update: {},
      create: { nome: dto.nome, userId },
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.carteira.deleteMany({ where: { id, userId } });
  }
}
