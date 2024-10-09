/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginProvider } from './login.provider';

@Injectable()
export class AuthService {

    
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        private readonly loginProvider: LoginProvider
    ) {}

    public async login(loginDto : LoginDto) {
    
        return await this.loginProvider.login(loginDto);
    }

    public isAuth(){
        return true;
    }
}
