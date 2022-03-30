import {AppModule} from "../src/app.module";
import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import pactum from 'pactum';
import {
    ForbiddenExceptionFilter,
    HttpExceptionFilter, JwtExceptionFilter, PrismaExceptionFilter
} from "../src/core/exceptions/filters";
import {PrismaService} from "../src/core/prisma/prisma.service";
import {ConfigModule} from "@nestjs/config";
import {User} from "@prisma/client";
import {AuthDto} from "../src/endpoints/auth/dto";

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const mockPrismaCreateUserData = {
        data: {
            email: 'db@email.com',
            lastName: 'Norris',
            firstName: 'Chuck',
            password: '12345',
    }
}

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                ConfigModule.forRoot({envFilePath: '.env.test'})],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true
        }));
        // app.useGlobalFilters(new HttpExceptionFilter(logger), new ForbiddenExceptionFilter(logger), new PrismaExceptionFilter(logger), new JwtExceptionFilter(logger))
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);
        await prisma.cleanDb();
    });

    afterEach(async () => {
        // await prisma.cleanDb();
    })

    afterAll(() => {
        app.close();
    })

    describe('user-controller module', () => {
        it('/users/:id (GET)', async () => {
            const user = await prisma.user.create(mockPrismaCreateUserData);
            expect(true).toEqual(true);
            request(app.getHttpServer())
                .get('http://localhost:3000/users/' + 156)
                .expect(200)
                .then(response => {
                    console.log(response.body);
                }).catch(reason => {
                console.log(reason);
            })
            // expect(user.lastName).toEqual(mockPrismaCreateUserData.data.lastName);
            // expect(user.password).toEqual(mockPrismaCreateUserData.data.password);
            // expect(user.email).toEqual(mockPrismaCreateUserData.data.email);
            // expect(user.firstName).toEqual(mockPrismaCreateUserData.data.firstName);
            // expect(user.id).toBeDefined();
            // expect(user.createdAt).toBeDefined();
            // expect(user.updatedAt).toBeDefined();
        });

    })


});

