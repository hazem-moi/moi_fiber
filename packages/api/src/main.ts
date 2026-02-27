import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ColorSchemesService } from './color-schemes/color-schemes.service';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Seed standard color schemes
  const cs = app.get(ColorSchemesService);
  await cs.ensureSeedData();

  // Seed default admin user
  const auth = app.get(AuthService);
  await auth.ensureAdminUser();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on port ${port}`);
}
bootstrap();
