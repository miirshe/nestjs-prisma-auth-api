import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO, SingUpDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prismaService;
    private jwt;
    private config;
    constructor(prismaService: PrismaService, jwt: JwtService, config: ConfigService);
    signUp(dto: SingUpDTO): Promise<{
        msg: string;
    }>;
    signin(dto: SignInDTO): Promise<{
        access_token: string;
    }>;
}
