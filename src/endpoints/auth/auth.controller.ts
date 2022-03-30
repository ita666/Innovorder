import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto, LogInDto} from "./dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    signUp(@Body() dto: AuthDto): Promise<{ access_token: string }> {
        return this.authService.signUp(dto);
    }

    @Post('login')
    logIn(@Body() dto: LogInDto): Promise<{ access_token: string }> {
        return this.authService.logIn(dto)
    }
}
