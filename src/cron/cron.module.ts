import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoldPrice } from 'src/gold-price/entities/gold-price.entity';
import { EmailModule } from 'src/email/email.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([GoldPrice]),
    HttpModule,
    EmailModule,
    LoggerModule
  ],
  providers: [CronService],
  exports:[CronService]

})
export class CronModule {}
