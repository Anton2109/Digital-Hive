import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  Query,
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
  @Post("auth/*")
  async handleAuthRequest(@Req() req: Request, @Body() body?: any) {
    const path = req.path.replace("/auth", "");
    return this.appService.forwardRequest("auth", path, req.method, body);
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
  async handleGameRequest(@Req() req: Request, @Body() body?: any) {
    const path = req.path;
    return this.appService.forwardRequest("game", path, req.method, body);
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
}
