/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { LoginProvider } from './providers/login.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, {
    provide: HashingProvider, // because HashingProvider is an abstract class
    useClass: BcryptProvider, // because BcryptProvider is the implementation of HashingProvider
  }, LoginProvider],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig), // because jwtConfig is a configuration object
    JwtModule.registerAsync(jwtConfig.asProvider()) // because jwtConfig is a configuration object
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
