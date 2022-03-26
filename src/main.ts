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
import {LoggingService} from "./utils/logging/logging.service";
import helmet from "helmet";
import {JwtExceptionFilter} from "./exceptions/filters/jwt-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalFilters(new HttpExceptionFilter(logger), new ForbiddenExceptionFilter(logger), new PrismaExceptionFilter(logger), new JwtExceptionFilter(logger))
  await app.listen(3000);
}
bootstrap();


/*TODO:
Tests
Perfect DTOs etc.
Type Everything
Docker if time
Data Validation Joi ----> ValidationPipe already for DTOs ---> JOI for database
Custom Passports?

Secure Product Route
*/