import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getServiceUrl(service: string): string {
    return this.configService.get(`${service.toUpperCase()}_SERVICE_URL`);
  }

  async forwardRequest(service: string, path: string, method: string, data?: any) {
    const url = `${this.getServiceUrl(service)}${path}`;
    const response = await firstValueFrom(
      this.httpService.request({
        method,
        url,
        data,
      }),
    );
    return response.data;
  }
}
