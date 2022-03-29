import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    HttpStatus,
    ArgumentsHost, ForbiddenException
} from '@nestjs/common';
import {ForbiddenExceptionFilter} from "./forbidden-exception.filter";
import {LoggingService} from "../../utils/logging/logging.service";


const mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
    url: 'mockUrl'
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest
}));


const mockArgumentsHost: ArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn()
};

describe('Forbidden exception filter service', () => {
    let service: ForbiddenExceptionFilter;

    beforeEach(async (): Promise<void> => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForbiddenExceptionFilter,
                {
                    provide: LoggingService,
                    useValue: mockLoggerService
                },
            ]
        }).compile();
        service = module.get<ForbiddenExceptionFilter>(ForbiddenExceptionFilter);
    });

    describe('Http exception filter', () => {

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Catch method', () => {
            it('should catch and log forbidden exception', () => {
                service.catch(
                    new ForbiddenException('forbidden exception'),
                    mockArgumentsHost
                );
                expect(mockLoggerService.error).toHaveBeenCalled();
                expect(mockLoggerService.error).toHaveBeenCalledWith('forbidden exception');
                expect(mockHttpArgumentsHost).toBeCalledTimes(1);
                expect(mockHttpArgumentsHost).toBeCalledWith();
                expect(mockGetResponse).toBeCalledTimes(1);
                expect(mockGetResponse).toBeCalledWith();
                expect(mockStatus).toBeCalledTimes(1);
                expect(mockStatus).toBeCalledWith(HttpStatus.FORBIDDEN);
                expect(mockJson).toBeCalledTimes(1);
            });
        });
    });
});
