import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class Order {
  @ApiProperty({
    example: 'b8b1e9c-c5a7-48b0-8b9d-a7241acc0518',
    description: 'Order ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({
    example: 'Nico',
    description: 'Order customer name',
    uniqueItems: false,
  })
  @Column()
  customerName: string;

  @ApiProperty({
    example: 0,
    description: 'Order total amount',
    uniqueItems: false,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
