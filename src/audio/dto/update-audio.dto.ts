import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';

// 创建 coffee 的数据模型
export class UpdateAudioDto {
 
  @IsNumber()
  readonly songid: number;  

  @IsBoolean()
  readonly isDownloaded: boolean;  
  

}
