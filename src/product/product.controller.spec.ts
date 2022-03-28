import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import {ProductService} from "./product.service";
import {CacheInterceptor} from "@nestjs/common";
import {JwtGuard} from "../auth/guard";

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
    getProductData: jest.fn().mockImplementation(args => {
      return mockProduct;
    })
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
        .overrideInterceptor(CacheInterceptor)
        .useValue(mockCacheInterceptor)
        .overrideGuard(JwtGuard)
        .useValue(mockJwtGuard)
        .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return product data when provided a correct id', async () => {
    const response = await controller.getProductById(1);

    expect(mockProductService.getProductData).toHaveBeenCalled();
    expect(response).toEqual(mockProduct);

  });
});
