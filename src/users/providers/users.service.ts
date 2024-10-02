/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Service responsible for handling user data
 */
@Injectable()
export class UserService {

  /**
   * Constructor
   * @param authService - The auth service
   */
  constructor(

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository : Repository<User>

  ) {}

  /**
   * Find all users
   * @param getUserParamDto - DTO containing query parameters
   * @param limit - The number of users to return
   * @param page - The page number
   * @returns An array of users
   */
  public findAll(getUserParamDto: GetUserParamDto, limit: number, page: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@mail.com'
        },{
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'doe@mail.com'
        }
    ]
  }

  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns A user object
   */
  public findOneById(id: string) {
    return {
        id: 1234,
        firstName: 'John',
        lastName: 'Doe',
        email: 'doe@mail.com'
    }
  }

  public createUser(createUserDto : CreateUserDto){
    const existingUser = this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    });

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }
}