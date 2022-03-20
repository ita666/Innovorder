import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto, LoginDto} from "./dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    signUp(@Body() dto: AuthDto): Promise<{ access_token: string }> {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() dto: LoginDto): Promise<{ access_token: string }> {
        return this.authService.login(dto)
    }
}
