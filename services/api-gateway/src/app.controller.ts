import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  Delete,
  Headers,
  Res,
  Logger,
  HttpException,
  Put,
  Patch,
} from "@nestjs/common";

import { AppService } from "./app.service";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) {}

  @Get("auth/*")
  async getUsers(@Req() req: Request, @Query() query: any, @Headers() headers: any) {
    this.logger.log(`Получен GET запрос к auth: ${req.path}`);
    const path = req.path.replace("/auth", "");
    return this.appService.forwardRequest("auth", path, "GET", query, headers);
  }

  @Post("auth/*")
  async postUsers(@Req() req: Request, @Body() body: any, @Headers() headers: any) {
    this.logger.log(`Получен POST запрос к auth: ${req.path}`);
    const path = req.path.replace("/auth", "");
    return this.appService.forwardRequest("auth", path, "POST", body, headers);
  }

  @Get("games")
  async getGames(@Query("query") query?: string, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на получение списка игр${query ? ` с поиском: ${query}` : ''}`);
    const url = query
      ? `http://game-service:3000/games/search?query=${query}`
      : "http://game-service:3000/games";

    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        headers: {
          Authorization: headers?.authorization || headers?.Authorization
        }
      }));
      this.logger.log('Успешно получен список игр');
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении списка игр: ${error.message}`);
      throw error;
    }
  }

  @Get("games/user")
  async getUserGames(@Headers() headers?: any) {
    this.logger.log('Получен запрос на получение игр авторизованного пользователя');
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://game-service:3000/games/user', {
          headers: {
            Authorization: headers?.authorization || headers?.Authorization
          }
        })
      );
      this.logger.log('Успешно получены игры пользователя');
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении игр пользователя: ${error.message}`);
      throw error;
    }
  }

  @Get("games/:id")
  async getGameById(@Param("id") id: string, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на получение игры с ID: ${id}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://game-service:3000/games/${id}`, {
          headers: {
            Authorization: headers?.authorization || headers?.Authorization
          }
        })
      );
      this.logger.log(`Успешно получена игра с ID: ${id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении игры с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete("games/:id")
  async deleteGame(@Param("id") id: string, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на удаление игры с ID: ${id}`);
    try {
      const result = await this.appService.forwardRequest("game", `/games/${id}`, "DELETE", null, headers);
      this.logger.log(`Успешно удалена игра с ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при удалении игры с ID ${id}: ${error.message}`);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  @Post("games")
  async createGame(@Body() body: any, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на создание игры`);
    this.logger.log(`Заголовки запроса: ${JSON.stringify(headers)}`);
    this.logger.log(`Тело запроса: ${JSON.stringify(body)}`);
    try {
      const result = await this.appService.forwardRequest("game", "/games", "POST", body, headers);
      this.logger.log(`Успешно создана игра`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при создании игры: ${error.message}`);
      this.logger.error(`Детали ошибки: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  @Post("games/*")
  @Get("games/*")
  async gameRequests(@Req() req: Request, @Body() body?: any, @Headers() headers?: any) {
    this.logger.log(`Получен ${req.method} запрос к game-service: ${req.path}`);
    this.logger.log(`Заголовки запроса: ${JSON.stringify(headers)}`);
    this.logger.log(`Тело запроса: ${JSON.stringify(body)}`);
    this.logger.log(`Метод запроса: ${req.method}`);
    this.logger.log(`Полный URL: ${req.url}`);
    try {
      const path = req.path.replace('/games', '');
      this.logger.log(`Преобразованный путь: ${path}`);
      const result = await this.appService.forwardRequest("game", path, req.method, body, headers);
      this.logger.log(`Успешно обработан запрос к game-service: ${req.path}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обработке запроса к game-service ${req.path}: ${error.message}`);
      this.logger.error(`Детали ошибки: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  @Get("assets/*")
  async getStaticFiles(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`Получен запрос на получение статического файла: ${req.path}`);
    try {
      const path = req.path;
      const response = await firstValueFrom(
        this.httpService.get(`http://game-service:3000${path}`, {
          responseType: 'arraybuffer'
        })
      );
      
      const ext = path.split('.').pop()?.toLowerCase();
      const contentType = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'avif': 'image/avif'
      }[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      this.logger.log(`Успешно отправлен статический файл: ${req.path}`);
      res.send(response.data);
    } catch (error) {
      this.logger.error(`Ошибка при получении статического файла ${req.path}: ${error.message}`);
      throw error;
    }
  }

  @Get("categories")
  async getCategories() {
    this.logger.log('Получен запрос на получение списка категорий');
    try {
      const response = await firstValueFrom(
        this.httpService.get("http://game-service:3000/categories")
      );
      this.logger.log('Успешно получен список категорий');
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении списка категорий: ${error.message}`);
      throw error;
    }
  }

  @Get("categories/:id")
  async getGamesByCategory(@Param("id") id: string) {
    this.logger.log(`Получен запрос на получение игр категории с ID: ${id}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://game-service:3000/categories/${id}`)
      );
      this.logger.log(`Успешно получены игры категории с ID: ${id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении игр категории с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get("categories/*")
  async getCategoryPath(@Req() req: Request) {
    this.logger.log(`Получен запрос к категориям: ${req.path}`);
    try {
      const result = await this.appService.forwardRequest("game", req.path, "GET");
      this.logger.log(`Успешно обработан запрос к категориям: ${req.path}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обработке запроса к категориям ${req.path}: ${error.message}`);
      throw error;
    }
  }

  @Get("basket")
  async getBasket(@Query("session_id") sessionId: string) {
    this.logger.log(`Получен запрос на получение корзины для сессии: ${sessionId}`);
    try {
      const url = `http://basket-service:3000/cart?session_id=${encodeURIComponent(sessionId)}`;
      const response = await firstValueFrom(this.httpService.get(url));
      this.logger.log(`Успешно получена корзина для сессии: ${sessionId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении корзины для сессии ${sessionId}: ${error.message}`);
      throw error;
    }
  }

  @Post("basket")
  async addToBasket(
    @Body() body: { session_id: string; game_id: number; quantity?: number }
  ) {
    this.logger.log(`Получен запрос на добавление в корзину: ${JSON.stringify(body)}`);
    try {
      const url = `http://basket-service:3000/cart`;
      const response = await firstValueFrom(this.httpService.post(url, body));
      this.logger.log(`Успешно добавлено в корзину: ${JSON.stringify(body)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при добавлении в корзину: ${error.message}`);
      throw error;
    }
  }

  @Delete("basket/:id")
  async removeFromBasket(@Param("id") id: string) {
    this.logger.log(`Получен запрос на удаление из корзины: ${id}`);
    try {
      const url = `http://basket-service:3000/cart/${id}`;
      const response = await firstValueFrom(this.httpService.delete(url));
      this.logger.log(`Успешно удалено из корзины: ${id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при удалении из корзины ${id}: ${error.message}`);
      throw error;
    }
  }

  @Post('orders')
  async createOrder(
    @Body('sessionId') sessionId: string,
    @Body('email') email: string,
  ) {
    this.logger.log(`Получен запрос на создание заказа для сессии: ${sessionId}, email: ${email}`);
    try {
      const url = `http://basket-service:3000/orders`;
      const response = await firstValueFrom(
        this.httpService.post(url, { sessionId, email })
      );
      this.logger.log(`Успешно создан заказ для сессии: ${sessionId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при создании заказа: ${error.message}`);
      throw error;
    }
  }

  @Post('orders/:orderId/confirm')
  async confirmOrder(@Param('orderId') orderId: number) {
    this.logger.log(`Получен запрос на подтверждение заказа: ${orderId}`);
    try {
      const url = `http://basket-service:3000/orders/${orderId}/confirm`;
      const response = await firstValueFrom(this.httpService.post(url));
      this.logger.log(`Успешно подтвержден заказ: ${orderId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при подтверждении заказа ${orderId}: ${error.message}`);
      throw error;
    }
  }

  @Get("user-games/:email")
  async getUserGamesByEmail(@Param("email") email: string) {
    this.logger.log(`Получен запрос на получение игр пользователя: ${email}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://game-service:3000/user-games/${email}`)
      );
      this.logger.log(`Успешно получены игры пользователя: ${email}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при получении игр пользователя ${email}: ${error.message}`);
      throw error;
    }
  }

  @Post("user-games")
  async addUserGame(@Body() body: { email: string; gameId: number; keyId: number }) {
    this.logger.log(`Получен запрос на добавление игры для пользователя: ${body.email}`);
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://game-service:3000/user-games', body)
      );
      this.logger.log(`Успешно добавлена игра для пользователя: ${body.email}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Ошибка при добавлении игры для пользователя ${body.email}: ${error.message}`);
      throw error;
    }
  }

  @Put("games/:id")
  async updateGame(@Param("id") id: string, @Body() body: any, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на обновление игры с ID: ${id}`);
    this.logger.log(`Заголовки запроса: ${JSON.stringify(headers)}`);
    this.logger.log(`Тело запроса: ${JSON.stringify(body)}`);
    try {
      const result = await this.appService.forwardRequest("game", `/games/${id}`, "PUT", body, headers);
      this.logger.log(`Успешно обновлена игра с ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении игры с ID ${id}: ${error.message}`);
      this.logger.error(`Детали ошибки: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  @Get("discounts")
  async getDiscounts(@Headers() headers?: any) {
    this.logger.log('Получен запрос на получение списка скидок');
    try {
      const result = await this.appService.forwardRequest("game", "/discounts", "GET", null, headers);
      this.logger.log('Успешно получен список скидок');
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при получении списка скидок: ${error.message}`);
      throw error;
    }
  }

  @Post("discounts")
  async createDiscount(@Body() body: any, @Headers() headers?: any) {
    this.logger.log('Получен запрос на создание скидки');
    try {
      const result = await this.appService.forwardRequest("game", "/discounts", "POST", body, headers);
      this.logger.log('Успешно создана скидка');
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при создании скидки: ${error.message}`);
      throw error;
    }
  }

  @Patch("discounts/:id")
  async updateDiscount(@Param("id") id: string, @Body() body: any, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на обновление скидки с ID: ${id}`);
    try {
      const result = await this.appService.forwardRequest("game", `/discounts/${id}`, "PATCH", body, headers);
      this.logger.log(`Успешно обновлена скидка с ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении скидки с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete("discounts/:id")
  async deleteDiscount(@Param("id") id: string, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на удаление скидки с ID: ${id}`);
    try {
      const result = await this.appService.forwardRequest("game", `/discounts/${id}`, "DELETE", null, headers);
      this.logger.log(`Успешно удалена скидка с ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при удалении скидки с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get("discounts/active")
  async getActiveDiscounts(@Headers() headers?: any) {
    this.logger.log('Получен запрос на получение списка активных скидок');
    try {
      const result = await this.appService.forwardRequest("game", "/discounts/active", "GET", null, headers);
      this.logger.log('Успешно получен список активных скидок');
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при получении списка активных скидок: ${error.message}`);
      throw error;
    }
  }

  @Get("discounts/:id")
  async getDiscountById(@Param("id") id: string, @Headers() headers?: any) {
    this.logger.log(`Получен запрос на получение скидки с ID: ${id}`);
    try {
      const result = await this.appService.forwardRequest("game", `/discounts/${id}`, "GET", null, headers);
      this.logger.log(`Успешно получена скидка с ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при получении скидки с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get("discounts/*")
  @Post("discounts/*")
  @Put("discounts/*")
  @Delete("discounts/*")
  async discountRequests(@Req() req: Request, @Body() body?: any, @Headers() headers?: any) {
    this.logger.log(`Получен ${req.method} запрос к discounts: ${req.path}`);
    try {
      const path = req.path.replace('/discounts', '');
      const result = await this.appService.forwardRequest("game", path, req.method, body, headers);
      this.logger.log(`Успешно обработан запрос к discounts: ${req.path}`);
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обработке запроса к discounts ${req.path}: ${error.message}`);
      throw error;
    }
  }
}