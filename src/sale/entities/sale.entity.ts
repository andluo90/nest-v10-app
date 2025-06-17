import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { SaleHistory } from './sale-history.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  sku: string;

  @OneToMany(() => SaleHistory, (history) => history.sale, { cascade: true })
  saleHistory: SaleHistory[];
}