import { Controller, Get, Inject, Param, Query, Res, StreamableFile } from '@nestjs/common';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { FileService } from './file.service';
import fileConfig from 'src/iam/config/file.config';
import { ConfigType } from '@nestjs/config';

@Controller('file')
export class FileController {

  constructor(
        private readonly fileService:FileService,
        @Inject(fileConfig.KEY)
        private readonly fileConfiguration:ConfigType<typeof fileConfig>
    ){}

  @IsPublic(true)
  @Get()
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    
    const filePath = join(process.cwd(), 'musicFiles/testMusic2.mp3');

    // 检查文件是否存在
    try {
      const stats = statSync(filePath);
      const file = createReadStream(filePath);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'attachment; filename=testMusic.mp3',
      });

      return new StreamableFile(file);
    } catch (error) {
      // 处理文件不存在的情况
      console.error(`Error: The file ${filePath} does not exist.`, error);
      res.status(404).send('File not found');
      return null;
    }
  }


  @IsPublic(true)
  @Get('musicList')
  getListOfFiles(): string[] {
    return this.fileService.getFilesInDirectory(this.fileConfiguration.musciDirectory);
  }   

  @IsPublic(true)
  @Get(':name')
  getMusicByName(@Param('name') name:string,@Res({ passthrough: true }) res: Response): StreamableFile {
    
    const filePath = `${this.fileConfiguration.musciDirectory}/${name}`

    // 检查文件是否存在
      const {fileStream,stats} = this.fileService.getFileStream(filePath)
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'attachment; filename=testMusic.mp3',
      });

      return new StreamableFile(fileStream);
  }



}
