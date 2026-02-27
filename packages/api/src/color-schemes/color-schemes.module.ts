import { Module } from '@nestjs/common';
import { ColorSchemesService } from './color-schemes.service';
import { ColorSchemesController } from './color-schemes.controller';

@Module({
  providers: [ColorSchemesService],
  controllers: [ColorSchemesController],
  exports: [ColorSchemesService],
})
export class ColorSchemesModule {}
