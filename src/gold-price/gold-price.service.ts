import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'src/cron/cron.service';
import { LoggerService } from 'src/logger/logger.service';
import { Repository } from 'typeorm';
import { GoldPrice } from './entities/gold-price.entity';

@Injectable()
export class GoldPriceService {
    constructor(
        @InjectRepository(GoldPrice)
        private readonly goldPriceRepository: Repository<GoldPrice>,
        private readonly cronService: CronService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly loggerService:LoggerService
    ) {}


    async getTodayPrice(){
        this.loggerService.log('Executing getTodayPrice()')
        const goldPrice = await this.goldPriceRepository.createQueryBuilder('entity').orderBy('entity.id', 'DESC').getOne()
        if (!goldPrice) {
            this.loggerService.logError(`goldPrice not found`)
            throw new NotFoundException(`goldPrice not found`);
        }
        return goldPrice

    }

    /**
     * 获取最新价格
     * @returns 
     */
    async getLastestPrice(){
        this.loggerService.log('Executing getLastestPrice()')
        
        await this.cronService.executeCronJob()
        const goldPrice = await this.goldPriceRepository.createQueryBuilder('entity').orderBy('entity.id', 'DESC').getOne()
        if (!goldPrice) {
            this.loggerService.logError(`goldPrice not found`)
            throw new NotFoundException(`goldPrice not found`);
        }
        return goldPrice

    }    

    /**
     * 启动服务
     * @returns 
     */
    async startService(){
        this.loggerService.log('Executing startService()')
        let cronJob = this.schedulerRegistry.getCronJob('fetchGoldPrice')

        if(cronJob){
            if(cronJob.running){
                this.loggerService.log('已启动')
                return '已启动'
            }else{
                this.loggerService.log('启动成功')
                cronJob.start()
                return '启动成功'
            }
        }else{
            this.loggerService.log('找不到服务')
            return '找不到服务'
        }

    }

    /**
     * 停止服务
     * @returns 
     */
    async stopService(){
        this.loggerService.log('Executing stopService()')
        let cronJob = this.schedulerRegistry.getCronJob('fetchGoldPrice')
        if(cronJob){
            if(cronJob.running){
                this.loggerService.log('停止成功')
                cronJob.stop()
                return '停止成功'
            }else{
                this.loggerService.log('已停止')
                return '已停止'
            }
        }else{
            this.loggerService.log('找不到服务')
            return '找不到服务'
        }
    }

    private getSpan(price1:number,price2:number,pricePercent:string|null=null){
        return `<span style="color: ${price1 - price2 > 0 ? 'red':'green'};">${pricePercent?pricePercent:price1}</span>`
    }

    getHtmlTemplate(price:GoldPrice,type:string = 'today'){
        const title = type === 'today' ? '今日':'最新'
        const current = Number(price.current)
        const todayStart = Number(price.todayStart)
        const yestodayEnd = Number(price.yestodayEnd)
        const todayHigh = Number(price.todayHigh)
        const todayLow = Number(price.todayLow)
        const pricePercent = (((current - todayStart)/todayStart) * 100).toFixed(2) + '%'

        return `<html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${title}金价</title>
          </head>
          <body>
            <div style="text-align: center;">
              <h2>${this.getSpan(current,todayStart)}</h2>
              <h3>涨幅: ${this.getSpan(current,todayStart,(current - todayStart)+'')} ${this.getSpan(current,todayStart,pricePercent)}</h3>
              <h3>今日最高: ${this.getSpan(todayHigh,todayStart)}</h3>
              <h3>今日最低: ${this.getSpan(todayLow,todayStart)}</h3>
              <h3>今日开盘: ${this.getSpan(todayStart,yestodayEnd)}</h3>
              <h3>昨天收盘: ${yestodayEnd}</h3>
              <h3>日期: ${price.date}</h3>            
            </div>

          </body>
        </html>`
    }

}
