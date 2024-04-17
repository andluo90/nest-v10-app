import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector,
    private readonly jwtService:JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration:ConfigType<typeof jwtConfig>
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{

    const isPublic = this.reflector.get('isPublic',context.getHandler())
    console.log(`isPublic`,isPublic);
    if(isPublic){
      return true
    }
    

    const request = context.switchToHttp().getRequest()
    // const token = this.extractTokenFromHeader(request)
    const token = this.extractTokenFromRequest(request)

    if(!token){
      console.log(`没有token.`);
      
      throw new UnauthorizedException();
    }
    try {

      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      )
      request[REQUEST_USER_KEY] = payload
      
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request:Request):string|undefined{
    console.log(`Request`,request);
    
    const [_,token] = request.headers.authorization?.split(' ') ?? []
    return token
  }

  private extractTokenFromRequest(request:Request):string|undefined{
    const cookiesStr = request.headers.cookie
    if(!cookiesStr){
      return ''
    }
    const cookiesArray = cookiesStr.split('; ');


    let accessTokenValue: string | undefined;

    // 遍历数组，找到名为 'accessToken' 的键值对，提取出其值
    cookiesArray.forEach((cookie) => {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === 'accessToken') {
        accessTokenValue = cookieValue;
      }
    });
    console.log(`extractTokenFromRequest`,accessTokenValue);
    
    return accessTokenValue;
  }  

}
