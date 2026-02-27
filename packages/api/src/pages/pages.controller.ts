import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { RenamePageDto } from './dto/rename-page.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class PagesController {
  constructor(private pages: PagesService) {}

  @Get('projects/:projectId/pages')
  list(@Param('projectId') projectId: string) {
    return this.pages.listByProject(projectId);
  }

  @Post('projects/:projectId/pages')
  create(@Param('projectId') projectId: string, @Body() dto: CreatePageDto) {
    return this.pages.createForProject(projectId, dto);
  }

  @Patch('pages/:id')
  rename(@Param('id') id: string, @Body() dto: RenamePageDto) {
    return this.pages.rename(id, dto);
  }
}
