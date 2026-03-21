import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const MOCK_UNIT_PRICE = 150.0;

    let totalAmount = 0;

    const items = createOrderDto.items.map((itemDto) => {
      const itemTotal = itemDto.quantity * MOCK_UNIT_PRICE;
      totalAmount += itemTotal;

      const orderItem = new OrderItem();
      orderItem.productId = itemDto.productId;
      orderItem.quantity = itemDto.quantity;
      orderItem.unitPrice = MOCK_UNIT_PRICE;

      return orderItem;
    });

    const order = this.orderRepository.create({
      customerName: createOrderDto.customerName,
      totalAmount,
      items,
    });

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
