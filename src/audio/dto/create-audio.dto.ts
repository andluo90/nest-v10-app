import { IsInt, IsNumber, IsString } from 'class-validator';

// 创建 coffee 的数据模型
export class CreateAudioDto {


  @IsNumber()
  readonly id: number;
 
  @IsNumber()
  readonly songid: number;  

  @IsString()
  readonly title: string;  
  

  @IsString()
  readonly author: string;  

  @IsString()
  readonly link: string;

  @IsString()
  readonly lrc: string;  

  @IsString()
  readonly pic: string; 
 
  @IsString()
  readonly url: string;  
  
  @IsString()
  readonly url_128: string; 
  
  @IsString()
  readonly url_320: string; 


}
