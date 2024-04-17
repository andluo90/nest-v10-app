import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { Audio } from './entities/audio.entity';
import { ConfigModule } from '@nestjs/config';
import audioConfig from 'src/iam/config/audio.config';

@Module({
  imports:[
    TypeOrmModule.forFeature([Audio]),
    ConfigModule.forFeature(audioConfig)

  ],
  controllers: [AudioController],
  providers: [AudioService]
})
export class AudioModule {}
