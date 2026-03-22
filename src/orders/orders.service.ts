import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CommunicationHelper } from './helpers/communication';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly communicationHelper: CommunicationHelper,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const product = await this.communicationHelper.fetchProductFromGateway(itemDto.productId);

      const itemTotal = itemDto.quantity * product.price;
      totalAmount += itemTotal;

      const orderItem = new OrderItem();
      orderItem.productId = itemDto.productId;
      orderItem.quantity = itemDto.quantity;
      orderItem.unitPrice = product.price;

      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      customerName: createOrderDto.customerName,
      totalAmount,
      items: orderItems,
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
