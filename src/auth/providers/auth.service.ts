/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {

    
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {}

    public login(email : string, password: string, userId : number) {
        const user = this.userService.findOneById(userId);
        console.log(user);
        return "Logged in";
    }

    public isAuth(){
        return true;
    }
}
