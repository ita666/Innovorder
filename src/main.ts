import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {
  ForbiddenExceptionFilter,
  HttpExceptionFilter
} from "./exceptions/filters";
import {
  PrismaExceptionFilter,
  JwtExceptionFilter
} from "./exceptions/filters";
import {LoggingService} from "./utils/logging/logging.service";
import helmet from "helmet";

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
Check imports
Bien faire le readme (variables)
*/