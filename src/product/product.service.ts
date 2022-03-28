import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {map, Observable} from "rxjs";

@Injectable()
export class ProductService {

    private API_PRODUCT_URL = 'https://world.openfoodfacts.org/api/v0/product/';
    private JSON_EXTENSION = '.json';

    constructor(
        private http: HttpService
    ) {}

    getProductData(id: number): Observable<any> {
        return this.http.get(this.API_PRODUCT_URL + id + this.JSON_EXTENSION)
            .pipe(
            map(value => value.data)
        );
    }
}
