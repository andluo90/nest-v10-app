import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression,SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { GoldPrice } from 'src/gold-price/entities/gold-price.entity';
import { LoggerService } from 'src/logger/logger.service';
import { Repository } from 'typeorm';



@Injectable()
export class CronService {
    
    constructor(
      @InjectRepository(GoldPrice)
      private readonly goldPriceRepository: Repository<GoldPrice>,
      private readonly httpService: HttpService,
      private readonly emailService:EmailService,
      private readonly loggerService:LoggerService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_1PM,{name:'fetchGoldPrice',timeZone:'Asia/Shanghai'})
    async handleCron() {
        this.loggerService.log(`start fetchGoldPrice...`)
        const {current,error} = await this.handleData()
        if(error){
          this.loggerService.log(`fetchGoldPrice error:`)
          this.loggerService.logError(error)
          this.emailService.sendEmail('[定时任务-异常]-[fetchGoldPrice]',error.toString())
        }else{
          this.loggerService.log(`fetchGoldPrice done`)
          this.emailService.sendEmail(`[定时任务-成功]-[fetchGoldPrice]:价格${current}`,`[定时任务-成功]-[fetchGoldPrice]'`)
        }

    }

    /**
     * 执行定时任务（手动执行用）
     */
    async executeCronJob(){
      this.loggerService.log(`executeCronJob()`)
      const {current,error} = await this.handleData()
      if(error){
        this.emailService.sendEmail('[手动任务-异常]-[fetchGoldPrice]',error.toString())
      }else{
        this.emailService.sendEmail(`[手动任务-成功]-[fetchGoldPrice]:价格${current}`,`[手动任务-成功]-[fetchGoldPrice]'`)
      }
      return
    }

    /**
     * 处理数据
     */
    private async handleData(){
      this.loggerService.log(`handleData()`)
      try {
        const response = await this.httpService.get("https://www.5huangjin.com/data/jin.js", {
          headers: {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors", // Likely won't work due to CORS restrictions
            "sec-fetch-site": "same-origin",
            "cookie": "__vtins__1zDTZ9sDDRQwNnWh=%7B%22sid%22%3A%20%22a45cceb0-de16-54d1-a4ea-1cf9263e217a%22%2C%20%22vd%22%3A%201%2C%20%22stt%22%3A%200%2C%20%22dr%22%3A%200%2C%20%22expires%22%3A%201712897223817%2C%20%22ct%22%3A%201712895423817%7D; __51uvsct__1zDTZ9sDDRQwNnWh=1; __51vcke__1zDTZ9sDDRQwNnWh=89d88960-da16-568c-80b7-037db920c86a; __51vuft__1zDTZ9sDDRQwNnWh=1712895423826; __gads=ID=336c10d8f86552d6:T=1712894744:RT=1712895424:S=ALNI_MbI7iQxwumfTAuZeE3FKyVKgAWXSA; __gpi=UID=00000de9d7e39975:T=1712894744:RT=1712895424:S=ALNI_MaChKsBoB4Nc_bkzU426W0DPWqyPA; __eoi=ID=ac8137872145d5d1:T=1712894744:RT=1712895424:S=AA-AfjaYQxZFZGk-b4nHQC8hx_1X",
            "Referer": "https://www.5huangjin.com/cn/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
        }).toPromise();
    
        const text:any = response.data;
        
        const lines = text.split('\n');
    
        // Process lines as before
        let current = ''
        lines.forEach(line => {
          if (line.startsWith('var hq_str_gds_AUTD')) {
            let prices:string[] = line.split('=')[1].replace('"','').split(',');
            
            let goldPrice = new GoldPrice()
            current = prices[0]
            goldPrice.current = prices[0],
            goldPrice.todayHigh = prices[4],
            goldPrice.todayLow = prices[5],
            goldPrice.yestodayEnd = prices[7],
            goldPrice.todayStart = prices[8],
            goldPrice.date = prices[12],
            this.goldPriceRepository.save(goldPrice)

          }
        });
        return {current:current,error:null}
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log(`save price error.`);
        this.loggerService.logError(error)
        
        return {current:null,error:error}
      }
    }

}
