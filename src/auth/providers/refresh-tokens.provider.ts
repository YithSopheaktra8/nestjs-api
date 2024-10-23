/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UserService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        private readonly generateTokenProvider: GenerateTokenProvider,

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    public async refreshTokens(refreshToken: RefreshTokenDto){
        try {
            // verify the refresh token
            const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData,"sub">>(
                refreshToken.refreshToken, 
                {
                    secret: this.jwtConfiguration.secret,
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer
                });

            // find user by id
            let user = await this.userService.findOneById(sub);

            // generate new tokens
            return await this.generateTokenProvider.generateToken(user);
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
