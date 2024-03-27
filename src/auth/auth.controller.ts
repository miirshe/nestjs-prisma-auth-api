import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {   SignInDTO, SingUpDTO } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() dto: SingUpDTO) {
        return this.authService.signUp(dto);
    }

    @Post('signin')
    signin(@Body() dto:SignInDTO){
        return this.authService.signin(dto);
    }
}
