import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import { FileModule } from './file/file.module';
import { AudioModule } from './audio/audio.module';
import { GoldPriceModule } from './gold-price/gold-price.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import * as os from 'os';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ConfigModule.forRoot({
      envFilePath: path.resolve(os.homedir(), '.env'),
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // database: './test.db', // 指定 SQLite 数据库文件路径
      database: path.resolve(os.homedir(), '.sqlite', 'nestjs_app.db'), // 指定 SQLite 数据库文件路径

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CoffeesModule,
    CoffeeRatingModule,
    DatabaseModule,
    IamModule,
    UsersModule,
    FileModule,
    AudioModule,
    GoldPriceModule,
    ScheduleModule.forRoot(),
    CronModule,
    EmailModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService,    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
],
})
export class AppModule {
  constructor(){
    console.log('AppModule env:',process.env.NODE_ENV);

    
  }
}
