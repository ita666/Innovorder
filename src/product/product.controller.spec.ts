import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import {ProductService} from "./product.service";
import {CacheInterceptor} from "@nestjs/common";
import {JwtGuard} from "../auth/guard";
import {firstValueFrom} from "rxjs";
import {
  ProductNotFoundException
} from "../exceptions/custom-exceptions/ProductNotFound.exception";

describe('ProductController', () => {
  let controller: ProductController;

  const mockProduct = {
    code: "0737628064502",
    product: {
      _id: "0737628064502",
      _keywords: [
        "include",
        "asia",
        "simply"
      ]
    }
  };


  const mockProductService = {
    getProductData: jest.fn().mockResolvedValue(mockProduct)
  }

  const mockCacheInterceptor = {

  }

  const mockJwtGuard = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService]
    })
        .overrideProvider(ProductService)
        .useValue(mockProductService)
        .overrideGuard(JwtGuard)
        .useValue(mockJwtGuard)
        .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetProductById method', () => {
    it('should return product data when provided a correct id', async () => {
      const response = await controller.getProductById(1);

      expect(mockProductService.getProductData).toHaveBeenCalled();
      expect(response).toEqual(mockProduct);

    });
  });
});
