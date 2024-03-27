import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO, SingUpDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2"
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService,
        private jwt: JwtService, private config: ConfigService) { }

    // singUp m
    async signUp(dto: SingUpDTO) {
        const { name, email, password, avatarUrl } = dto;

        try {

            const hash = await argon.hash(password);
            const newUser = await this.prismaService.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                    avatarUrl
                }
            })

            if (!newUser) {
                throw new ForbiddenException('Failed to create new user');
            }

            return { msg: "User created successfully" };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('User already exists');
                }

                throw error;
            }
        }
    }

    // sign in
    async signin(dto: SignInDTO) {
        const { email, password } = dto;
        try {
            const isExistUser = await this.prismaService.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!isExistUser) {
                throw new ForbiddenException('Invalid email or password');
            }

            console.log('user', isExistUser);


            const isMatch = await argon.verify(isExistUser.password, password);

            if (!isMatch) {
                throw new ForbiddenException('Invalid email or password');
            }

            const payload = { sub: isExistUser.id, email: isExistUser.email }

            const token = await this.jwt.signAsync(payload, { secret: this.config.get('JWT_SECRET_KEY'), expiresIn: '1hr' })


            return { access_token: token }



        } catch (error) {
            throw new ForbiddenException(error)
        }
    }
}
