/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/providers/users.service";

@Injectable()
export class PostService {

    constructor(private readonly userService: UserService) {}

    public findAll(userId : string){

        if(userId === undefined){
            return {
                error: 'User ID is required'
            }
        }
        const user = this.userService.findOneById(userId);

        return [
            {
                user : user,
                title: 'Post 1',
                content: 'Content 1'
            },
            {
                user : user,
                title: 'Post 2',
                content: 'Content 2'
            }
        ]
    }
}