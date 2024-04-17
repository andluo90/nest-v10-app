import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  
  

  
  @Entity() // sql table === 'coffee'
  export class GoldPrice {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    current: string;
  
    @Column({ nullable: true })
    todayStart: string;
  
    @Column({ nullable: true })
    yestodayEnd: string;    
 
    @Column({ nullable: true })
    todayHigh: string;     

    @Column({ nullable: true })
    todayLow: string;
    
    @Column()
    date: string;    
  
    @Column({ nullable: true })
    remark: string;
  
  
  }
  