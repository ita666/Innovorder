import {HttpException} from "@nestjs/common";
import {PRODUCT_NOT_FOUND_ERROR_MESSAGE} from "../error-messages";

export class ProductNotFoundException extends HttpException {
   constructor(productId: number, description?: string) {
       const errorMessage = PRODUCT_NOT_FOUND_ERROR_MESSAGE + productId;
        super(errorMessage, 404);
    }
}