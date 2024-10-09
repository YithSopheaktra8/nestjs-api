/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ConflictException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @Inject(forwardRef(()=> HashingProvider)) // because of circular dependency
        private readonly hashingProvider: HashingProvider
    ){}
    
    public async createUser(createUserDto: CreateUserDto){
        let existingUser = undefined;

        try{
            // Check is user exists with same email
            existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email },
            });
        }catch(err){
            throw new RequestTimeoutException('The request to the database timed out',{
                description: 'The request to the database timed out',
            });
        }

        if(existingUser){
            throw new ConflictException('The user already exists',{
                description: 'The user already exists'
            });
        }

        const newUser = this.userRepository.create({
            ...createUserDto, // spread the user data
            password: await this.hashingProvider.hashPassword(createUserDto.password) // overide the password
        });

        return this.userRepository.save(newUser);
    }
}
