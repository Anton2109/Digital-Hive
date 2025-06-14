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
    let url;
    switch (service.toLowerCase()) {
      case "game":
        url = "http://game-service:3000";
        break;
      case "auth":
        url = "http://auth-service:3000";
        break;
      case "basket":
        url = "http://basket-service:3000";
        break;
      default:
        url = this.configService.get(`${service.toUpperCase()}_SERVICE_URL`);
    }
    this.logger.log(`Получен URL для сервиса ${service}: ${url}`);
    return url;
  }

  async forwardRequest(
    service: string,
    path: string,
    method: string,
    data?: any,
    headers?: any
  ) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.getServiceUrl(service)}${normalizedPath}`;
    this.logger.log(`Переадресация ${method} запроса к ${service}: ${url}`);
    this.logger.log(`Заголовки запроса: ${JSON.stringify(headers)}`);
    this.logger.log(`Метод запроса: ${method}`);
    this.logger.log(`Полный URL: ${url}`);
    if (data && method !== "DELETE") {
      this.logger.log(`Тело запроса: ${JSON.stringify(data)}`);
    }

    try {
      this.logger.debug(`Отправка запроса к ${service}...`);
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data: method === "DELETE" ? undefined : data,
          headers: {
            "Content-Type": "application/json",
            ...headers,
            Authorization: headers?.authorization || headers?.Authorization,
          },
          responseType: normalizedPath.startsWith("/assets")
            ? "arraybuffer"
            : "json",
          validateStatus: (status) => status < 500,
        })
      );

      this.logger.debug(
        `Получен ответ от ${service}. Статус: ${response.status}`
      );
      this.logger.debug(`Тип ответа: ${typeof response.data}`);
      this.logger.debug(`Содержимое ответа: ${JSON.stringify(response.data)}`);

      if (response.status >= 400) {
        this.logger.error(
          `Ошибка от сервиса ${service}: ${JSON.stringify(response.data)}`
        );
        throw new HttpException(
          response.data,
          response.status
        );
      }

      if (
        response.data === null ||
        response.data === undefined ||
        response.data === "null" ||
        response.data === "null"
      ) {
        this.logger.log(`Получен пустой ответ от ${service}`);
        return [];
      }

      this.logger.log(
        `Успешный ответ от ${service}: ${JSON.stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorResponse = error.response?.data;
      const statusCode = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(
        `Ошибка при переадресации: ${JSON.stringify(errorResponse || error.message)}`
      );

      throw new HttpException(
        errorResponse || {
          message: `Ошибка при переадресации запроса к ${service}`,
          statusCode
        },
        statusCode
      );
    }
  }

  // catch (error) {
  //   this.logger.error(`Ошибка при переадресации запроса к ${service}: ${error.message}`);
  //   this.logger.error(`Детали ошибки: ${JSON.stringify(error.response?.data)}`);
  //   this.logger.error(`Статус ошибки: ${error.response?.status}`);
  //   this.logger.error(`Полный стек ошибки: ${error.stack}`);
  //   throw error.response?.data || error;
  // }

  async createOrder(sessionId: string, email: string) {
    this.logger.log(
      `Создание заказа для сессии: ${sessionId}, email: ${email}`
    );
    try {
      const response = await firstValueFrom(
        this.httpService.post(`http://basket-service:3000/orders`, {
          sessionId,
          email,
        })
      );
      this.logger.log(`Заказ успешно создан: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при создании заказа: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Ошибка при создании заказа",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmOrder(orderId: number) {
    this.logger.log(`Подтверждение заказа: ${orderId}`);
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `http://basket-service:3000/orders/${orderId}/confirm`
        )
      );
      this.logger.log(
        `Заказ успешно подтвержден: ${JSON.stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при подтверждении заказа: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Ошибка при подтверждении заказа",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserGames(email: string) {
    this.logger.log(`Получение игр пользователя: ${email}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://game-service:3000/user-games/${email}`)
      );
      this.logger.log(
        `Успешно получены игры пользователя: ${JSON.stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении игр пользователя: ${error.message}`
      );
      throw new HttpException(
        error.response?.data || "Ошибка при получении игр пользователя",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  getAuthServiceUrl(): string {
    return 'http://auth-service:3000';
  }
}
