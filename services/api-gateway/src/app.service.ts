import { Injectable, Logger } from "@nestjs/common";
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
    this.logger.debug(`Service URL for ${service}: ${url}`);
    return url;
  }

  async forwardRequest(
    service: string,
    path: string,
    method: string,
    data?: any
  ) {
    const url = `${this.getServiceUrl(service)}${path}`;
    this.logger.debug(`Forwarding ${method} request to: ${url}`);
    this.logger.debug(`Request data: ${JSON.stringify(data)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          headers: {
            "Content-Type": "application/json",
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
  }
}
