import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import {ConfigService} from "@nestjs/config";

describe('PrismaService', () => {
  let service: PrismaService;

  const mockConfig = {
    get: jest.fn().mockImplementation((jwtKey) => {
      return 'database_url';
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService,
      {
        provide: ConfigService,
        useValue: mockConfig
      }],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
