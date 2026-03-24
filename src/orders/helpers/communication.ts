import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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

  async fetchProductFromGateway(productId: string): Promise<any> {
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
}
