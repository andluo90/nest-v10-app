import { Controller, Get, Post, Res } from '@nestjs/common';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { GoldPriceService } from './gold-price.service';
import type { Response } from 'express';

@Controller('gold-price')
export class GoldPriceController {
    constructor(private readonly goldPriceService: GoldPriceService) {}


    @IsPublic(true)
    @Get('today-price')
    async todayPrice(@Res({ passthrough: true }) res: Response) {
      const price = await this.goldPriceService.getTodayPrice();
      res.setHeader('Content-Type', 'text/html')
      res.send(
        `<html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>金价</title>
          </head>
          <body>
            <h2>当前价格: ${price.current}</h2>
            <h2>今日最高: ${price.todayHigh}</h2>
            <h2>今日最低: ${price.todayLow}</h2>
            <h2>今日开盘: ${price.todayStart}</h2>
            <h2>昨天收盘: ${price.yestodayEnd}</h2>
            <h2>日期: ${price.date}</h2>
          </body>
        </html>`
      );
    }

    @IsPublic(true)
    @Get('lastest-price')
    async lastestPrice(@Res({ passthrough: true }) res: Response) {
      const price = await this.goldPriceService.getLastestPrice();
      res.setHeader('Content-Type', 'text/html')
      res.send(
        `<html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>金价</title>
          </head>
          <body>
            <h2>最新价格: ${price.current}</h2>
            <h2>今日最高: ${price.todayHigh}</h2>
            <h2>今日最低: ${price.todayLow}</h2>
            <h2>今日开盘: ${price.todayStart}</h2>
            <h2>昨天收盘: ${price.yestodayEnd}</h2>
            <h2>日期: ${price.date}</h2>
          </body>
        </html>`
      );

    }    
    

    @IsPublic(true)
    @Post('startService')
    startService() {
      return this.goldPriceService.startService();
    }

    @IsPublic(true)
    @Post('stopService')
    stopService() {
      return this.goldPriceService.stopService();
    }    

}
