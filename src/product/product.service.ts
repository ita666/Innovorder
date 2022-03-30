import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {Cache} from "cache-manager";
import {ProductNotFoundException} from "../exceptions/custom-exceptions/ProductNotFound.exception";

@Injectable()
export class ProductService {

    private API_PRODUCT_URL = 'https://world.openfoodfacts.org/api/v0/product/';
    private JSON_EXTENSION = '.json';

    constructor(
        private http: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async getProductData(id: number): Promise<any> {
        const cacheProductData = await this.cacheManager.get(`offApiCall-${id}`);
        if(cacheProductData) {
            return cacheProductData;
        } else {
            const {data} = await firstValueFrom(this.http.get(this.API_PRODUCT_URL + id + this.JSON_EXTENSION));
            if(data && data.status === 0){
                throw new ProductNotFoundException(id);
            }
            return await this.cacheManager.set(`offApiCall-${id}`, data, {ttl: 300});
        }
    };
}
