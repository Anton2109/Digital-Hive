import { Controller, Get, Post, Body, Param, Req, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request } from "express";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) {}

  @Get("auth/*")
  async getUsers(@Req() req: Request, @Query() query: any) {
    const path = req.path.replace("/auth", "");
    return this.appService.forwardRequest("auth", path, "GET", query);
  }

  @Post("auth/*")
  async postUsers(@Req() req: Request, @Body() body: any) {
    const path = req.path.replace("/auth", "");
    console.log(`Original path: ${req.path}`);
    console.log(`Modified path: ${path}`);
    console.log(`Request body: ${JSON.stringify(body)}`);
    return this.appService.forwardRequest("auth", path, "POST", body);
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
