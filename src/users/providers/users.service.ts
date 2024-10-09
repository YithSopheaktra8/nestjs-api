/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ConflictException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserMany } from './create-user-many';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneByEmailProvider } from './find-one-by-email.provider';

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
    private userRepository : Repository<User>,

    private readonly configService : ConfigService,

    private readonly createUserMany : CreateUserMany,

    private readonly createUserProvider : CreateUserProvider,

    private readonly findOneByEmailProvider : FindOneByEmailProvider

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
    const config = this.configService.get<string>("S3_BUCKET");
    console.log(config);
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
  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({id});
    return user;
  }

  public async createUser(createUserDto : CreateUserDto){
      return this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createUserDto: CreateManyUsersDto){
    this.createUserMany.createManyUsers(createUserDto);
  }

  public async findOneByEmail(email: string){
    return this.findOneByEmailProvider.findOneByEmail(email);
  }

}
