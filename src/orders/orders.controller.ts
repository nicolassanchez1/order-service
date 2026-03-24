import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ApiStandardResponse } from './common/decorators/api-standard-responses.decorator';

interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

interface AuthenticatedRequest extends ExpressRequest {
  user: AuthenticatedUser;
}
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiStandardResponse(Order)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: AuthenticatedRequest,
    @Headers('authorization') authHeader: string,
  ) {
    const user = req.user;
    const orderData = {
      ...createOrderDto,
      customerName: user.name,
    };
    return this.ordersService.create(orderData, user.userId, authHeader);
  }

  @Get()
  @ApiStandardResponse()
  findAll(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    return this.ordersService.findAll(user.userId);
  }

  @Get(':id')
  @ApiStandardResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }
}
