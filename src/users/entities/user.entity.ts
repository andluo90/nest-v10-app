import { Coffee } from "src/coffees/entities/coffee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string

    @Column()
    password:string

    
    @OneToMany(()=>Coffee,(coffee)=>coffee.user)
    coffees:Coffee[]
}
