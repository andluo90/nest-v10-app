import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // @IsPublic(true)
  @Get()
  findAll(@Req() request:Request,@Query() paginationQuery: PaginationQueryDto) {
    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(request[REQUEST_USER_KEY].sub,paginationQuery);
  }

  @IsPublic(false)
  @Get(':id')
  findOne(@Param('id') id: number) {
    // console.log(typeof id);
    return this.coffeesService.findOne(id);
  }

  // @IsPublic(true)
  @Post()
  create(@Req() request:Request , @Body() createCoffeeDto: CreateCoffeeDto) {
    // console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeesService.create(request[REQUEST_USER_KEY].sub,createCoffeeDto,);
  }

  @Patch(':id')
  update(@Req() request:Request ,@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(request[REQUEST_USER_KEY].sub,id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}
