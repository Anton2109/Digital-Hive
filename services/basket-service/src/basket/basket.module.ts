import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { BasketItem } from './entites/basket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasketItem])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
