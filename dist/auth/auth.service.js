"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prismaService, jwt, config) {
        this.prismaService = prismaService;
        this.jwt = jwt;
        this.config = config;
    }
    async signUp(dto) {
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
            });
            if (!newUser) {
                throw new common_1.ForbiddenException('Failed to create new user');
            }
            return { msg: "User created successfully" };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('User already exists');
                }
                throw error;
            }
        }
    }
    async signin(dto) {
        const { email, password } = dto;
        try {
            const isExistUser = await this.prismaService.user.findUnique({
                where: {
                    email: email
                }
            });
            if (!isExistUser) {
                throw new common_1.ForbiddenException('Invalid email or password');
            }
            console.log('user', isExistUser);
            const isMatch = await argon.verify(isExistUser.password, password);
            if (!isMatch) {
                throw new common_1.ForbiddenException('Invalid email or password');
            }
            const payload = { sub: isExistUser.id, email: isExistUser.email };
            const token = await this.jwt.signAsync(payload, { secret: this.config.get('JWT_SECRET_KEY'), expiresIn: '1hr' });
            return { access_token: token };
        }
        catch (error) {
            throw new common_1.ForbiddenException(error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map