import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';

@Entity()
@Unique(['sku', 'url', 'date']) // ✅ 联合唯一约束
export class SaleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column('float')
  saleQuantity: number;

  @Column()
  sku: string;

  @Column()
  url: string;

  @ManyToOne(() => Sale, (sale) => sale.saleHistory, { onDelete: 'CASCADE' })
  @JoinColumn()
  sale: Sale;
}