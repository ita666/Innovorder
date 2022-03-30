import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import {HttpService} from "@nestjs/axios";
import {of} from "rxjs";
import {CacheModule} from "@nestjs/common";
import {
  ProductNotFoundException
} from "../exceptions/custom-exceptions/ProductNotFound.exception";

describe('ProductService', () => {
  let service: ProductService;

  let productId = 1;

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

  const mockNotFoundProduct = {
    data: {
      code: '7376280645021',
      status: 0,
      status_verbose: 'product not found'
    }
  }

  const mockHttpService = {
    get: jest.fn().mockImplementation((url: string) => {
      return of({data: mockProduct});
    })
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [ProductService, HttpService],
    })
        .overrideProvider(HttpService)
        .useValue(mockHttpService)
        .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetProductByData method', () => {
    it("should return a product if given a proper id", async () => {
      let response = await service.getProductData(productId);
      expect(mockHttpService.get).toHaveBeenCalled();
      expect(response).toEqual(mockProduct);
    });

    it("should throw a product not found exception if the product does not exist",
        async () => {
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {
        return of(mockNotFoundProduct);
      })
      try {
        let response = await service.getProductData(productId);
        expect(mockHttpService.get).toHaveBeenCalled();
        expect(response).toThrow(ProductNotFoundException);
      } catch (e) {
        expect(e).toEqual(new ProductNotFoundException(productId));
      }
    });
  });
});
