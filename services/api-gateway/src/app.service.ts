import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private getServiceUrl(service: string): string {
    const url = this.configService.get(`${service.toUpperCase()}_SERVICE_URL`);
    return url;
  }

  async forwardRequest(
    service: string,
    path: string,
    method: string,
    data?: any,
    headers?: any
  ) {
    const url = `${this.getServiceUrl(service)}${path}`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          headers: {
            "Content-Type": "application/json",
            ...headers,
            Authorization: headers?.authorization || headers?.Authorization
          },
          responseType: path.startsWith('/assets') ? 'arraybuffer' : 'json',
          validateStatus: (status) => status < 500
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error forwarding request to ${service}: ${error.message}`);
      if (!path.startsWith('/assets')) {
        this.logger.error(`Error details: ${JSON.stringify(error.response?.data)}`);
      }
      throw error.response?.data || error;
    }
  }

  async createOrder(sessionId: string, email: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `http://basket-service:3000/orders`,
          { sessionId, email },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create order',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmOrder(orderId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `http://basket-service:3000/orders/${orderId}/confirm`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to confirm order',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
