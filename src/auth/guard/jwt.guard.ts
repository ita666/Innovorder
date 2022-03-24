import {AuthGuard} from "@nestjs/passport";
import {UnauthorizedException} from "@nestjs/common";
import {JsonWebTokenError} from 'jsonwebtoken';
import {INVALID_TOKEN_ERROR_MESSAGE} from "../../exceptions/error-messages";

export class JwtGuard extends AuthGuard('jwt'){

    handleRequest(err, user, info) {
        if (err) {
            throw err;
        } else if (info instanceof JsonWebTokenError) {
            throw new UnauthorizedException(INVALID_TOKEN_ERROR_MESSAGE);
        } else if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
