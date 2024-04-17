import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  
  @Entity() // sql table === 'Audio'
  export class Audio {
    @PrimaryGeneratedColumn()
    aid: number;

    @Column({unique:true})
    id: number;    
    
    @Column({ unique:true })
    songid: number;
  
    @Column()
    title: string;

    @Column({ nullable: true })
    author: string;
    
    @Column()
    link: string;    

    @Column()
    lrc: string; 

    @Column()
    pic: string;

    @Column()
    url: string;

    @Column()
    url_128: string;

    @Column()
    url_320: string;    

    @Column({default:false})
    isDownloaded: boolean;

    @Column({default:false})
    isDeleted: boolean;

  }
  