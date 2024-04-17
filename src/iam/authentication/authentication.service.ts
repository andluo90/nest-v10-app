import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/exceptions/custom-exceptions';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User) private readonly usersRepository:Repository<User>,
        private readonly hashingService:HashingService,
        private readonly jwtService:JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>
    ){}

    /**
     * 注册
     * @param signUpDto 
     */
    async signUp(signUpDto:SignUpDto){
        try {
            const user = new User()
            user.email = signUpDto.email
            user.password = await this.hashingService.hash(signUpDto.password)
            await this.usersRepository.save(user)            
        } catch (error) {
            console.error(`signUp error`,error);
            
            // const pgUniqueViolationErrorCode = '23505'
            // if(error.code === pgUniqueViolationErrorCode){
            //     throw new ConflictException();
            // }
            // throw error

            const pgUniqueViolationErrorCode = 'SQLITE_CONSTRAINT'
            if(error.code === pgUniqueViolationErrorCode){
                // throw new ConflictException('该邮箱已被注册,请更换邮箱.');
                throw new CustomException('该邮箱已被注册,请更换邮箱.')
            }
            throw error
        }

    }
    
    /**
     * 登录
     * @param signInDto 
     */
    async signIn(signInDto:SignInDto){
        
        const user = await this.usersRepository.findOneBy({
            email:signInDto.email
        })
        if(!user){
            throw new UnauthorizedException('该用户不存在.')
        }
        const isEqual = await this.hashingService.compare(
            signInDto.password,
            user.password
        )
        if(!isEqual){
            throw new UnauthorizedException('密码不正确.')
        }


        const accessToken = await this.jwtService.signAsync(
            {
                sub:user.id,
                email:user.email
            },
            {
                audience:this.jwtConfiguration.audience,
                issuer:this.jwtConfiguration.issuer,
                secret:this.jwtConfiguration.secret,
                expiresIn: parseInt(this.jwtConfiguration.accessTokenTtl)
            }
        )
        console.log(`accessToken`,accessToken);
        
        return {
            accessToken
        }

    }

}
