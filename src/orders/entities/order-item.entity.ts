import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({
    example: 'b8b1e9c-c5a7-48b0-8b9d-a7241acc0518',
    description: 'Order item ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({
    example: 'c8t1e9c-c5a7-48b0-8b9d-a7241acc0511',
    description: 'Product ID',
    uniqueItems: true,
  })
  @Column()
  productId: number;

  @ApiProperty({
    example: 5,
    description: 'Product quantity',
    default: 0
  })
  @Column()
  quantity: number;

  @ApiProperty({
    example: 200,
    description: 'Product unit orice',
    default: 0
  })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
}
