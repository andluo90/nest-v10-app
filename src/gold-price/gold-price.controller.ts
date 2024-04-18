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
      const template = this.goldPriceService.getHtmlTemplate(price,'today')
      res.send(template);
    }

    @IsPublic(true)
    @Get('lastest-price')
    async lastestPrice(@Res({ passthrough: true }) res: Response) {
      const price = await this.goldPriceService.getLastestPrice();
      const template = this.goldPriceService.getHtmlTemplate(price,'lastest')
      res.setHeader('Content-Type', 'text/html')
      res.send(template);

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
