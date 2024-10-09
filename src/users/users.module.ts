/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserMany } from './providers/create-user-many';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';

@Module({
  controllers: [UsersController],
  providers: [UserService, CreateUserMany, CreateUserProvider, FindOneByEmailProvider],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule), 
    TypeOrmModule.forFeature([
      User
    ])
],
})
export class UsersModule {}
