import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {JwtGuard} from "../auth/guard";
import {UserService} from "./user.service";

describe('ServiceController', () => {
  let controller: UserController;

  const mockUserService = {

  }

  const mockJwtGuard = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideGuard(JwtGuard)
        .useValue(mockJwtGuard)
        .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
