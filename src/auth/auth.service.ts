import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    login() {
        return {msg: 'Logged In'};
    }

    signup() {
        return {msg: 'Signed up'};
    }
}
