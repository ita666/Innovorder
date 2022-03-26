import {CacheModule, Module} from '@nestjs/common';
import { ProductService } from './product.service';
import {ProductController} from "./product.controller";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule, CacheModule.register({
    max: 100
  })],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
