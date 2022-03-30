import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import {JwtGuard} from "../auth/guard";
import {ProductService} from "./product.service";

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
