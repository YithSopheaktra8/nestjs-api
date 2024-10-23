/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/user.entity';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class LoginProvider {

    constructor(

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        private readonly hashingProvider: HashingProvider,

        private readonly generateTokenProvider: GenerateTokenProvider
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

        // generate token
        return await this.generateTokenProvider.generateToken(user);
    }
}
