import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ColorSchemesService } from './color-schemes.service';
import { CreateColorSchemeDto } from './dto/create-color-scheme.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/color-schemes')
export class ColorSchemesController {
  constructor(private cs: ColorSchemesService) {}

  @Get()
  list(@Param('projectId') projectId: string) {
    return this.cs.getForProject(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateColorSchemeDto) {
    return this.cs.createCustom(projectId, dto);
  }
}
