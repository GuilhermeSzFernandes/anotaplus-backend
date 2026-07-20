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

  remove(userId: string, id: string) {
    return this.prisma.entry.deleteMany({ where: { id, userId } });
  }
}
