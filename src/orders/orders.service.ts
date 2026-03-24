import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CommunicationHelper } from './helpers/communication';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly communicationHelper: CommunicationHelper,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string, authHeader: string): Promise<Order> {
    const { totalAmount, orderItems, productsToUpdate } = await this.validateAndPrepareItems(
      createOrderDto.items,
    );

    const order = this.orderRepository.create({
      userId,
      customerName: createOrderDto.customerName,
      totalAmount,
      items: orderItems,
    });
    const savedOrder = await this.orderRepository.save(order);

    await this.updateExternalInventory(productsToUpdate, authHeader);

    return savedOrder;
  }

  private async validateAndPrepareItems(itemsDto: CreateOrderItemDto[]) {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];
    const productsToUpdate: { id: string; newStock: number }[] = [];

    for (const itemDto of itemsDto) {
      const product = await this.communicationHelper.get(itemDto.productId);

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `No hay stock suficiente para '${product.name}'. Solicitado: ${itemDto.quantity}, Disponible: ${product.stock}`,
        );
      }

      totalAmount += itemDto.quantity * product.price;

      const orderItem = new OrderItem();
      orderItem.productId = itemDto.productId;
      orderItem.quantity = itemDto.quantity;
      orderItem.unitPrice = product.price;
      orderItems.push(orderItem);

      productsToUpdate.push({
        id: product.id,
        newStock: product.stock - itemDto.quantity,
      });
    }

    return { totalAmount, orderItems, productsToUpdate };
  }

  private async updateExternalInventory(
    productsToUpdate: { id: string; newStock: number }[],
    authHeader: string,
  ) {
    for (const update of productsToUpdate) {
      await this.communicationHelper.patch(update.id, { stock: update.newStock }, authHeader);
    }
  }

  async findAll(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
    });
  }

  async findOne(id: string): Promise<Order> {
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
