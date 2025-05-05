import { Controller, Get, Post, Body, Param, Req, Res, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Post('auth/*')
  async handleAuthRequest(@Req() req: Request, @Body() body: any) {
    const path = req.path.replace('/auth', '');
    return this.appService.forwardRequest('auth', path, req.method, body);
  }

  @Get('auth/*')
  async handleAuthGetRequest(@Req() req: Request) {
    const path = req.path.replace('/auth', '');
    return this.appService.forwardRequest('auth', path, req.method);
  }

  @Get('games')
  async getGames() {
    const response = await firstValueFrom(
      this.httpService.get('http://game-service:3000/games'),
    );
    return response.data;
  }

  @Get('games/search')
  async searchGames(@Query('query') query: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://game-service:3000/games/search?query=${query}`),
    );
    return response.data;
  }

  @Get('games/:id')
  async getGameById(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://game-service:3000/games/${id}`),
    );
    return response.data;
  }

  @Post('games')
  async handleGamesRootPostRequest(@Body() body: any) {
    return this.appService.forwardRequest('game', '/games', 'POST', body);
  }

  @Post('games/*')
  async handleGameRequest(@Req() req: Request, @Body() body: any) {
    const path = req.path;
    return this.appService.forwardRequest('game', path, req.method, body);
  }

  @Get('games/*')
  async handleGameGetRequest(@Req() req: Request) {
    const path = req.path;
    return this.appService.forwardRequest('game', path, req.method);
  }

  @Get('categories')
  async getCategories() {
    const response = await firstValueFrom(
      this.httpService.get('http://game-service:3000/categories'),
    );
    return response.data;
  }

  @Get('categories/*')
  async handleCategoriesGetRequestWithPath(@Req() req: Request) {
    const path = req.path;
    return this.appService.forwardRequest('game', path, 'GET');
  }

  @Get('categories/:id')
  async getGamesByCategory(@Param('id') id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://game-service:3000/categories/${id}`),
    );
    return response.data;
  }
}
