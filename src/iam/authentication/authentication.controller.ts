import { Body, Controller,HttpCode,HttpStatus,Post, Res, SetMetadata } from '@nestjs/common';
import { Response } from 'express';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authService:AuthenticationService
    ){}
    
    @IsPublic(true)
    @Post('sign-up')
    signUp(@Body() signUpDto:SignUpDto){
        return this.authService.signUp(signUpDto)
    }

    @HttpCode(HttpStatus.OK)
    @IsPublic(true)
    @Post('sign-in')
    async signIn(
        @Res({passthrough:true}) response:Response,
        @Body() signInDto:SignInDto
    ){
        console.log(`signInDto`,signInDto);
        
        const {accessToken} = await this.authService.signIn(signInDto)
        
        response.cookie('accessToken',accessToken,{
            secure:true,
            httpOnly:true,
            sameSite:true
        })
    }

}
