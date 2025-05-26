<<<<<<< HEAD
import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
=======
import { Injectable, Logger } from "@nestjs/common";
>>>>>>> 62fe03f665779e0b10bed12214d10c77982b9400
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
<<<<<<< HEAD
=======
    this.logger.debug(`Service URL for ${service}: ${url}`);
>>>>>>> 62fe03f665779e0b10bed12214d10c77982b9400
    return url;
  }

  async forwardRequest(
    service: string,
    path: string,
    method: string,
<<<<<<< HEAD
    data?: any,
    headers?: any
  ) {
    const url = `${this.getServiceUrl(service)}${path}`;
    
=======
    data?: any
  ) {
    const url = `${this.getServiceUrl(service)}${path}`;
    this.logger.debug(`Forwarding ${method} request to: ${url}`);
    this.logger.debug(`Request data: ${JSON.stringify(data)}`);

>>>>>>> 62fe03f665779e0b10bed12214d10c77982b9400
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          headers: {
            "Content-Type": "application/json",
<<<<<<< HEAD
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
=======
          },
        })
      );
      this.logger.debug(`Response from ${service}: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error forwarding request to ${service}: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data)}`);
      throw error.response?.data || error;
    }
>>>>>>> 62fe03f665779e0b10bed12214d10c77982b9400
  }
}
