import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { RenamePageDto } from './dto/rename-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  listByProject(projectId: string) {
    return this.prisma.page.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  createForProject(projectId: string, dto: CreatePageDto) {
    return this.prisma.page.create({ data: { projectId, name: dto.name } });
  }

  rename(pageId: string, dto: RenamePageDto) {
    return this.prisma.page.update({ where: { id: pageId }, data: { name: dto.name } });
  }
}
