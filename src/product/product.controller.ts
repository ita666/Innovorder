import {
    CACHE_MANAGER,
    CacheTTL,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import {JwtGuard} from "../auth/guard";
import {ProductService} from "./product.service";
import {Cache} from "cache-manager";
import {
    ProductNotFoundException
} from "../exceptions/custom-exceptions/ProductNotFound.exception";

@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.productService.getProductData(id);
    }
}
