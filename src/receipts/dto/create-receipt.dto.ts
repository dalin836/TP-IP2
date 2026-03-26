import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
// import { isNumber } from 'util';

export class CreateReceiptDto {
  @IsDateString()
  issuedAt: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
