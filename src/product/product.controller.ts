import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/guard";
import {ProductService} from "./product.service";
import {Observable} from "rxjs";

@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Get(':id')
    GetUserById(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.productService.getProductData(id);
    }
}
