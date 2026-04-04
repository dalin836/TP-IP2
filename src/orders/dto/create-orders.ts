import { IsNumber, IsString } from 'class-validator';
// import { generatePrime } from 'crypto';

export class CreateOrderDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;

  @IsString()
  item: string;
}
