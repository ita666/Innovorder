import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import {HttpService} from "@nestjs/axios";
import {lastValueFrom, of} from "rxjs";

describe('ProductService', () => {
  let service: ProductService;
  let httpService: HttpService;

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

  const mockHttpService = {
    get: jest.fn().mockImplementation((url: string) => {
      return of({data : mockProduct});
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, HttpService],
    })
        .overrideProvider(HttpService)
        .useValue(mockHttpService)
        .compile();

    service = module.get<ProductService>(ProductService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetProductByData method', () => {
    it("should return a product if given a proper id", () => {
      let response = '';
      service.getProductData(1).subscribe(value => {
        response = value;
      });

      expect(lastValueFrom(service.getProductData(1))).resolves.toEqual(mockProduct);
      expect(mockHttpService.get).toHaveBeenCalled();
    });
  });
});
