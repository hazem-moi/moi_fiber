import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { PagesModule } from './pages/pages.module';
import { ColorSchemesModule } from './color-schemes/color-schemes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    PagesModule,
    ColorSchemesModule,
  ],
})
export class AppModule {}
