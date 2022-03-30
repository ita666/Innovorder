import {Test, TestingModule} from "@nestjs/testing";
import {LoggingService} from "../../utils/logging/logging.service";
import {
    OpenFoodFactsBenchmarkInterceptor
} from "./openfoodfacts-benchmark.interceptor";

describe('Forbidden exception filter service', () => {
    let service: OpenFoodFactsBenchmarkInterceptor;

    const mockLoggerService = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OpenFoodFactsBenchmarkInterceptor,
                {
                    provide: LoggingService,
                    useValue: mockLoggerService
                },
            ]
        }).compile();
        service = module.get<OpenFoodFactsBenchmarkInterceptor>(OpenFoodFactsBenchmarkInterceptor);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Intercept method', () => {
        it('should log execution time', () => {

        });
    })


});
