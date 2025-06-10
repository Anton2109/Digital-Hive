import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { GameKeysModule } from './game-keys/game-keys.module';
import { UserGamesModule } from './user-games/user-games.module';
import { AuthModule } from './auth/auth.module';
import { DefaultNamingStrategy } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // driver: require('mysql2'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        namingStrategy: new DefaultNamingStrategy(),
        extra: {
          decimalNumbers: true,
        }
      }),
      inject: [ConfigService],
    }),
    GamesModule,
    GameKeysModule,
    UserGamesModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
