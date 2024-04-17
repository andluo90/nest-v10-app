import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){

  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(paginationQuery:PaginationQueryDto) {
    // `This action returns all users`;
    console.log(`findAll users`);
    const { limit, offset } = paginationQuery;
    const userList = await this.userRepository.find({
      skip: offset,
      take: limit,
    });
    userList.map(i=>delete i.password)
    return userList
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
