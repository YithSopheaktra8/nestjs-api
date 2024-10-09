/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    public async findOneByEmail(email: string){
        let user = undefined;
        try {
            user = await this.userRepository.findOne({
                where :{
                    email: email
                }
            });
        } catch (error) {
            throw new RequestTimeoutException("can not process the request at the moment",{
                description: error.message
            })
        }

        if(!user){
            throw new NotFoundException("user not found");
        }

        return user;
    }
}
