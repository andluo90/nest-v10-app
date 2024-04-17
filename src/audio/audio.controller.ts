import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res, StreamableFile } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import audioConfig from 'src/iam/config/audio.config';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import type { Response } from 'express';

@Controller('audio')
export class AudioController {
    constructor(
      private readonly audioService: AudioService,
      @Inject(audioConfig.KEY)
      private readonly audioConfiguration:ConfigType<typeof audioConfig>
      
    ) {}



    @Post()
    create(@Body() createAudioDto: CreateAudioDto) {
      return this.audioService.create(createAudioDto,);
    }

    @Post('update')
    update(@Body() updateAudioDto: UpdateAudioDto) {
      return this.audioService.update(updateAudioDto);
    }

    @IsPublic(true)
    @Get('getall')
    findAll(){
      return this.audioService.findAll()
    }

    @IsPublic(true)
    @Get('static/getAudio')
    getAudio(@Query('id') id:number,@Res({ passthrough: true }) res: Response){
      console.log(`id:`,id);
      
      const filePath = `${this.audioConfiguration.audioDirectory}/${id}.mp3`

      

      const {fileStream,stats} = this.audioService.getAudio(filePath)
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'attachment; filename=testMusic.mp3',
      });

      return new StreamableFile(fileStream);
    }    
    
    


}
