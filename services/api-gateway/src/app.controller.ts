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
} from "@nestjs/common";

import { AppService } from "./app.service";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) {}

  @Get("auth/*")
  async getUsers(@Req() req: Request, @Query() query: any, @Headers() headers: any) {
    const path = req.path.replace("/auth", "");
    return this.appService.forwardRequest("auth", path, "GET", query, headers);
  }

  @Post("auth/*")
  async postUsers(@Req() req: Request, @Body() body: any, @Headers() headers: any) {
    const path = req.path.replace("/auth", "");
    console.log(`Original path: ${req.path}`);
    console.log(`Modified path: ${path}`);
    console.log(`Request body: ${JSON.stringify(body)}`);
    return this.appService.forwardRequest("auth", path, "POST", body, headers);
  }

  @Get("games")
  async getGames(@Query("query") query?: string) {
    const url = query
      ? `http://game-service:3000/games/search?query=${query}`
      : "http://game-service:3000/games";

    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  @Get("games/:id")
  async getGameById(@Param("id") id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://game-service:3000/games/${id}`)
    );
    return response.data;
  }

  @Post("games")
  @Post("games/*")
  @Get("games/*")
  async gameRequests(@Req() req: Request, @Body() body?: any) {
    const path = req.path;
    return this.appService.forwardRequest("game", path, req.method, body);
  }

  @Get("assets/*")
  async getStaticFiles(@Req() req: Request, @Res() res: Response) {
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
    res.send(response.data);
  }

  @Get("categories")
  async getCategories() {
    const response = await firstValueFrom(
      this.httpService.get("http://game-service:3000/categories")
    );
    return response.data;
  }

  @Get("categories/:id")
  async getGamesByCategory(@Param("id") id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://game-service:3000/categories/${id}`)
    );
    return response.data;
  }

  @Get("categories/*")
  async getCategoryPath(@Req() req: Request) {
    const path = req.path;
    return this.appService.forwardRequest("game", path, "GET");
  }

  @Get("basket")
  async getBasket(@Query("session_id") sessionId: string) {
    console.log('GET /basket request received with session_id:', sessionId);
    const url = `http://basket-service:3000/cart?session_id=${encodeURIComponent(sessionId)}`;
    console.log('Forwarding request to:', url);
    const response = await firstValueFrom(this.httpService.get(url));
    console.log('Response from basket-service:', response.data);
    return response.data;
  }

  @Post("basket")
  async addToBasket(
    @Body() body: { session_id: string; game_id: number; quantity?: number }
  ) {
    console.log('POST /basket request received with body:', body);
    const url = `http://basket-service:3000/cart`;
    console.log('Forwarding request to:', url);
    const response = await firstValueFrom(this.httpService.post(url, body));
    console.log('Response from basket-service:', response.data);
    return response.data;
  }

  @Delete("basket/:id")
  async removeFromBasket(@Param("id") id: string) {
    console.log('DELETE /basket request received for id:', id);
    const url = `http://basket-service:3000/cart/${id}`;
    console.log('Forwarding request to:', url);
    const response = await firstValueFrom(this.httpService.delete(url));
    console.log('Response from basket-service:', response.data);
    return response.data;
  }

  @Post('orders')
  async createOrder(
    @Body('sessionId') sessionId: string,
    @Body('email') email: string,
  ) {
    console.log('POST /orders request received with sessionId:', sessionId, 'email:', email);
    const url = `http://basket-service:3000/orders`;
    console.log('Forwarding request to:', url);
    const response = await firstValueFrom(
      this.httpService.post(url, { sessionId, email })
    );
    console.log('Response from basket-service:', response.data);
    return response.data;
  }

  @Post('orders/:orderId/confirm')
  async confirmOrder(@Param('orderId') orderId: number) {
    console.log('POST /orders/confirm request received for orderId:', orderId);
    const url = `http://basket-service:3000/orders/${orderId}/confirm`;
    console.log('Forwarding request to:', url);
    const response = await firstValueFrom(this.httpService.post(url));
    console.log('Response from basket-service:', response.data);
    return response.data;
  }
}
