import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import fileConfig from 'src/iam/config/file.config';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports:[
    ConfigModule.forFeature(fileConfig)
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
