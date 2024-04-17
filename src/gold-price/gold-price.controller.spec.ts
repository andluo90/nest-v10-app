import { Test, TestingModule } from '@nestjs/testing';
import { GoldPriceController } from './gold-price.controller';

describe('GoldPriceController', () => {
  let controller: GoldPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoldPriceController],
    }).compile();

    controller = module.get<GoldPriceController>(GoldPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
