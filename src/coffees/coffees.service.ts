import { Inject, Injectable, NotFoundException, Req, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig,{Coffees} from './config/coffees.config';
import { User } from 'src/users/entities/user.entity';

@Injectable() // == @Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: Coffees,
    
  ) {
    console.log('CoffeesService instantiated');

    const databaseHost = this.configService.get('database.host', 'localhost');
    const coffeesConfig = this.configService.get('coffees.foo');

    console.log(
      databaseHost,
      coffeesConfig,
      coffeesConfiguration,
      coffeesConfiguration.foo,
    );
  }

  async findAll(userId:number,paginationQuery: PaginationQueryDto) {
    // const user = await this.preloadUserByUserId(userId)
    // const { limit, offset } = paginationQuery;
    // return this.coffeeRepository.find({
    //   where:{},
    //   relations: ['flavors','user'],
    //   skip: offset,
    //   take: limit,
    // });
    console.log(`userId:`,userId);
    
    const users = await this.UserRepository.findOne({
      where:{id:userId},
      relations:['coffees','coffees.flavors','coffees.user']
    })

    if(users){
      return users.coffees
    }else{
      return []
    }


  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(userId:number , createCoffeeDto: CreateCoffeeDto) {
    
    const user = await this.preloadUserByUserId(userId)

    // 确保在创建 Coffee 之前，所有的 Flavor 都已存在数据库中，并配合 Promise.all 等待所有的 Flavor 都创建完毕
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
      user
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(userId:number,id: number, updateCoffeeDto: UpdateCoffeeDto) {
    // 确保在修改 Coffee 之前，所有的 Flavor 都已存在数据库中，并配合 Promise.all 等待所有的 Flavor 都创建完毕
    const user = await this.preloadUserByUserId(userId)
    
    
    const flavors = await Promise.all(
      updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    /**
     * preload:
     *  从给定的普通JavaScript对象中创建一个新的实体。如果实体在数据库中已经存在，那么它会加载它（以及与之相关的一切），
     *  用给定对象中的新值替换所有值，并返回这个新实体。这个新实体实际上是从数据库中加载的实体，所有的属性都是从新对象中替换的。
     *
     *  注意：给定的类实体对象必须有一个实体ID/主键来查找实体。如果没有找到给定ID的实体，则返回未定义。
     */
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
      user,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    // 创建 queryRunner
    const queryRunner = this.connection.createQueryRunner();

    // 使用此 queryRunner 建立到数据库的新连接
    await queryRunner.connect();
    // 一旦我们建立了连接，就可以开始事务了
    await queryRunner.startTransaction();

    // 我们需要将整个事务代码包装在 try/catch/finally 中，以确保如果出现任何错误，我们的 catch 语句可以回滚整个事务
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = JSON.stringify({ coffeeId: coffee.id });

      // 使用 query runner 实体管理器来保存 Coffee 和 Event 实体
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      // 出现任何错误，就回滚，防止数据库中的不一致
      await queryRunner.rollbackTransaction();
    } finally {
      // 确保释放或关闭连接 queryRunner
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOneBy({ name });
    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }

  private async preloadUserByUserId(id:number): Promise<User> {
    const existingUser = await this.UserRepository.findOneBy({id})
    if(existingUser){
      console.log(`id:${id} 用户存在`);
      return existingUser
    }
    
  }
}
