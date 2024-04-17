import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'src/cron/cron.module';
import { LoggerModule } from 'src/logger/logger.module';
import { GoldPrice } from './entities/gold-price.entity';
import { GoldPriceController } from './gold-price.controller';
import { GoldPriceService } from './gold-price.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([GoldPrice]),
    CronModule,
    LoggerModule
  ],
  controllers: [GoldPriceController],
  providers: [GoldPriceService]
})
export class GoldPriceModule {}
