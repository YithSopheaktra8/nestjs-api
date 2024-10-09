/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';

@Injectable()
export class LoginProvider {

    constructor(

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        private readonly hashingProvider: HashingProvider,

        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}

    public async login(loginDta : LoginDto){
        // find user by email
        let user : User = await this.userService.findOneByEmail(loginDta.email);

        // compare password with hashed password
        let isEqual: boolean = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(loginDta.password, user.password);
        } catch (error) {
            throw new RequestTimeoutException("can not process the request at the moment",{
                description: error.message
            })
        }

        if(!isEqual){
            throw new UnauthorizedException("Invalid credentials");
        }

        /// generate access token
        const accessToken = await this.jwtService.signAsync(
            {
                // payload
                sub : user.id,
                email: user.email
            },
            {
                // options
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl
            }
        )

        return {
            accessToken
        }
    }
}
