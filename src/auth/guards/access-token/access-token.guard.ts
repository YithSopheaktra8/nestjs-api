/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations : ConfigType<typeof jwtConfig>
  ) {}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    // extract request object from context
    const request = context.switchToHttp().getRequest();

    // extract access token from header
    const token = this.extractRequestFromHeader(request);


    if(!token){
      throw new UnauthorizedException();
    }

    // verify the token
    try {
      const payload = await this.jwtService.verifyAsync(token,this.jwtConfigurations);
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractRequestFromHeader(request : Request){
    const [_, token] = request.headers.authorization?.split(' ') ?? []; // split the token from the header the _ is the bearer and token is the token itself (destructuring)
    return token;
  }
}
