import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from './logging.service';
import {ConfigService} from "@nestjs/config";
import * as winston from "winston";

describe('LoggingService', () => {
  let service: LoggingService;

  const mockConfigService = {
    get: jest.fn().mockImplementation(() => { return 'error'})
  };

  const mockLogger = {
    error: jest.fn().mockImplementation((message) => { return message})
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // jest.spyOn(winston,'error').mockImplementation((message) => {
    //   return 'error message'
    // });

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingService, ConfigService],
    })
        .overrideProvider(ConfigService)
        .useValue(mockConfigService)
        .compile();

    service = module.get<LoggingService>(LoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log error messages', () => {
    // expect(service.error).toHaveBeenCalled();
  });
});
