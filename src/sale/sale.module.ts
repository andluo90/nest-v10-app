import { Module } from '@nestjs/common';
import { SaleGateway } from './sale.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleHistory } from './entities/sale-history.entity';
import { SaleService } from './sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleHistory])],
  providers: [SaleGateway, SaleService],
})
export class SaleModule {}
