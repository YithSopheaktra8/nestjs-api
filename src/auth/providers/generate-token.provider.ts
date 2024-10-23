/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Injectable()
export class GenerateTokenProvider {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}

    public async generateToken(user: User){
        const [accessToken, refreshToken] = await Promise.all([
            
            // generate access token
            this.signToken<Partial<User>>(
                user.id,
                this.jwtConfiguration.accessTokenTtl,
                { 
                    email: user.email 
                }
            ),

            // generate refresh token
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl)
            
        ]); 
        return {
            accessToken,
            refreshToken
        }
    }

    public async signToken<T>(userId: number, expiresIn: number, payload?: T){
        return await this.jwtService.signAsync(
            {
                // payload
                sub : userId,
                ...payload
            },
            {
                // options
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: expiresIn
            }
        )
    }
}
