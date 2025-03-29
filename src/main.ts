import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { static as expressStatic } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(
          errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        );
      },
    }),
  );

  const uploadDir = join(process.cwd(), 'pdfs');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  app.use('/pdfs', expressStatic(join(process.cwd(), 'pdfs')));

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
