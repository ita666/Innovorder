import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {
  ForbiddenExceptionFilter,
  HttpExceptionFilter
} from "./exceptions/filters";
import {
  PrismaExceptionFilter
} from "./exceptions/filters/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error']
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalFilters(new HttpExceptionFilter(), new ForbiddenExceptionFilter(), new PrismaExceptionFilter())
  await app.listen(3000);
}
bootstrap();


/*TODO:
Add Error Logging
Add Product Controller
Add constants
Perfect DTOs etc.
Type Everything
Docker if time
Helmet
Cors
Data Validation Joi
Custom Passports?

Secure Product Route
*/