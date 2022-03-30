import {CacheModule, Module} from '@nestjs/common';
import { ProductService } from './product.service';
import {ProductController} from "./product.controller";
import {HttpModule} from "@nestjs/axios";
import {LoggingModule} from "../../utils/logging/logging.module";

@Module({
  imports: [HttpModule, LoggingModule, CacheModule.register({
    max: 100
  })],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
