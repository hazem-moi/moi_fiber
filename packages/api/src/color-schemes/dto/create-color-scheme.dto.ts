import { IsString, IsObject } from 'class-validator';

export class CreateColorSchemeDto {
  @IsString()
  name: string;

  @IsObject()
  spec: Record<string, any>;
}
