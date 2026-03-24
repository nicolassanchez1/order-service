import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 'b8b1e9c-c5a7-48b0-8b9d-a7241acc0518',
    description: 'Product ID',
    uniqueItems: true,
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 10,
    description: 'Product quantity',
    default: 0,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'Nico',
    description: 'Order customer name',
    default: '',
  })
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty({
    example: '800481e6-9920-47e7-b5b4-de7b787233dd',
    description: 'User ID',
    default: '',
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
