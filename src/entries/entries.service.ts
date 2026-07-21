import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.entry.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }

  create(userId: string, dto: CreateEntryDto) {
    return this.prisma.entry.create({
      data: { ...dto, timestamp: new Date(dto.timestamp), userId },
    });
  }

  // updateMany (não update) pra embutir o filtro de userId na própria
  // query, igual o remove() abaixo — evita editar um registro de outro
  // usuário só adivinhando o id.
  update(userId: string, id: string, dto: CreateEntryDto) {
    return this.prisma.entry.updateMany({
      where: { id, userId },
      data: { ...dto, timestamp: new Date(dto.timestamp) },
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.entry.deleteMany({ where: { id, userId } });
  }
}
