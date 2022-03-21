import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error']
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  // app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000);
}
bootstrap();


/*TODO:
Add Error Handling + Logging
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