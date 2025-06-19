import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleHistory } from './entities/sale-history.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(SaleHistory)
    private saleHistoryRepo: Repository<SaleHistory>,
  ) {}

// sale.service.ts
async saveSaleData(payload: any) {
  const { url, sku, saleHistory } = payload;

  // 查找或创建 Sale 主记录
  let sale = await this.saleRepo.findOne({
    where: { url, sku },
    relations: ['saleHistory'],
  });

  if (!sale) {
    sale = this.saleRepo.create({ url, sku, saleHistory: [] });
    await this.saleRepo.save(sale);
  }

  // 遍历 saleHistory 并插入未存在的
  for (const h of saleHistory) {
    const exists = await this.saleHistoryRepo.findOne({
      where: {
        url,
        sku,
        date: h.date,
      },
    });

    if (!exists) {
      const history = this.saleHistoryRepo.create({
        date: h.date,
        saleQuantity: parseFloat(h.saleQuantity),
        sku,
        url,
        sale,
      });
      await this.saleHistoryRepo.save(history);
    }
  }
}

}