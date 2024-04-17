import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Flavor } from './flavor.entity';
import { User } from 'src/users/entities/user.entity';


@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @Column({ nullable: true })
  remark: string;

  @JoinTable() // 关系所有者端才需要加这个修饰符，即主表要加，外表不加
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true, // boolean | ("insert" | "update" | "remove" | "soft-remove" | "recover")[];
  })
  flavors: Flavor[];

  @ManyToOne(()=>User,(user)=>user.coffees)
  user:User
}
