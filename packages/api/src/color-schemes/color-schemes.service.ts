import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColorSchemeDto } from './dto/create-color-scheme.dto';

// TIA-598-C 12-color standard
const TIA_598_C = {
  colors: [
    { index: 0, name: 'Blue', hex: '#0000FF' },
    { index: 1, name: 'Orange', hex: '#FFA500' },
    { index: 2, name: 'Green', hex: '#008000' },
    { index: 3, name: 'Brown', hex: '#A52A2A' },
    { index: 4, name: 'Slate', hex: '#708090' },
    { index: 5, name: 'White', hex: '#FFFFFF' },
    { index: 6, name: 'Red', hex: '#FF0000' },
    { index: 7, name: 'Black', hex: '#000000' },
    { index: 8, name: 'Yellow', hex: '#FFFF00' },
    { index: 9, name: 'Violet', hex: '#8B00FF' },
    { index: 10, name: 'Rose', hex: '#FF007F' },
    { index: 11, name: 'Aqua', hex: '#00FFFF' },
  ],
};

@Injectable()
export class ColorSchemesService {
  constructor(private prisma: PrismaService) {}

  async getForProject(projectId: string) {
    const [standards, custom] = await Promise.all([
      this.prisma.colorScheme.findMany({ where: { scope: 'standard' } }),
      this.prisma.colorScheme.findMany({ where: { ownerProjectId: projectId, scope: 'custom' } }),
    ]);
    return [...standards, ...custom];
  }

  async createCustom(projectId: string, dto: CreateColorSchemeDto) {
    return this.prisma.colorScheme.create({
      data: {
        scope: 'custom',
        ownerProjectId: projectId,
        name: dto.name,
        spec: dto.spec,
      },
    });
  }

  async ensureSeedData() {
    const count = await this.prisma.colorScheme.count({ where: { scope: 'standard' } });
    if (count === 0) {
      await this.prisma.colorScheme.create({
        data: { scope: 'standard', name: 'TIA-598-C', spec: TIA_598_C },
      });
    }
  }
}
