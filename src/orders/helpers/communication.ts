import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { IProduct } from '../interfaces/product';

@Injectable()
export class CommunicationHelper {
  private readonly logger = new Logger(CommunicationHelper.name);
  private readonly gatewayUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gatewayUrl = configService.get<string>('API_GATEWAY_URL') || 'http://localhost:8080';
  }

  async get(productId: string): Promise<IProduct> {
    try {
      this.logger.log(`Calling API Gateway to fetch product ${productId}...`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.gatewayUrl}/products/${productId}`),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch product ${productId} in Gateway`, error.message);
      throw new BadRequestException(`Product with ID ${productId} is invalid or does not exist`);
    }
  }

  async patch(productId: string, data: Partial<IProduct>, authHeader?: string): Promise<IProduct> {
    try {
      this.logger.log(`Calling API Gateway to update product ${productId}...`);

      const config = authHeader
        ? {
            headers: { Authorization: authHeader },
          }
        : {};

      const response = await firstValueFrom(
        this.httpService.patch(`${this.gatewayUrl}/products/${productId}`, data, config),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update product ${productId} in Gateway: ${error.message}`);
      throw new BadRequestException(`No se pudo actualizar el stock del producto ${productId}`);
    }
  }
}
