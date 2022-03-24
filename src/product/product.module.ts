import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import {ProductController} from "./product.controller";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
