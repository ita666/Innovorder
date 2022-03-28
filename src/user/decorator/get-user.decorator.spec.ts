import {GetUser} from "./get-user.decorator";
import {ExecutionContext} from "@nestjs/common";
import {User} from "@prisma/client";

describe('GetUser decorator', ()=> {

    const mockSwitchToHttp = jest.fn().mockImplementation(() => ({
        getRequest: mockGetRequest
    }))

    const mockExecutionContext: ExecutionContext = {
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        switchToHttp: mockSwitchToHttp,
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn()
    }

    const mockPrismaUser: User = {
        id: 15487465,
        email: 'db@email.com',
        lastName: 'Norris',
        firstName: 'Chuck',
        password: '12345',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    }

    const mockGetRequest = jest.fn().mockImplementation(() => ({
        user: mockPrismaUser
    }))

    beforeEach(() => {

    });

    it('should retrieve the user if exists and no param is given', () => {
        const response = GetUser();
    });
})