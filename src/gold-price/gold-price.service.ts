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

}
