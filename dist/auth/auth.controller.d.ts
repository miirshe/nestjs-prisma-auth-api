import { AuthService } from './auth.service';
import { SignInDTO, SingUpDTO } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(dto: SingUpDTO): Promise<{
        msg: string;
    }>;
    signin(dto: SignInDTO): Promise<{
        access_token: string;
    }>;
}
