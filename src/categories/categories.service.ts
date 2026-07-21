import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { nome: 'asc' },
    });
  }

  // upsert em vez de create: o app manda a mesma categoria de novo toda
  // vez que sincroniza (ex: categorias padrão já existentes), então isso
  // precisa ser idempotente em vez de estourar a constraint única de
  // userId+nome numa segunda tentativa.
  create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.upsert({
      where: { userId_nome: { userId, nome: dto.nome } },
      update: {},
      create: { nome: dto.nome, userId },
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.category.deleteMany({ where: { id, userId } });
  }
}
