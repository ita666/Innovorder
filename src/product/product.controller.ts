import {
    CacheInterceptor,
    CacheKey, CacheTTL,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {JwtGuard} from "../auth/guard";
import {ProductService} from "./product.service";
import {Observable} from "rxjs";

@UseGuards(JwtGuard)
@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Get(':id')
    @CacheKey('offApiCalls')
    @CacheTTL(300)
    GetProductById(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.productService.getProductData(id);
    }
}
