import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException
} from '@nestjs/common';
import {User} from "@prisma/client";
import {NON_EXISTING_USER_ERROR_MESSAGE} from "../../exceptions/error-messages";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        if(!request.user){
            throw new ForbiddenException(NON_EXISTING_USER_ERROR_MESSAGE);
        }
        const user = request.user;
        return data ? user[data] : user;
    },
);
