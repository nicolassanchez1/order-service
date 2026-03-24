import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ApiStandardResponse } from './common/decorators/api-standard-responses.decorator';
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiStandardResponse(Order)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const user = req.user;
    const orderData = {
      ...createOrderDto,
      customerName: user.name,
    };
    return this.ordersService.create(orderData);
  }

  @Get()
  @ApiStandardResponse()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiStandardResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
