import {AuthGuard} from "@nestjs/passport";
import {UnauthorizedException} from "@nestjs/common";
import {JsonWebTokenError} from 'jsonwebtoken';

export class JwtGuard extends AuthGuard('jwt'){

    handleRequest(err, user, info) {
        if (err) {
            throw err;
        } else if (info instanceof JsonWebTokenError) {
            throw info;
        } else if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
