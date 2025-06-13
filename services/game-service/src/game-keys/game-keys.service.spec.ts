import { Test, TestingModule } from '@nestjs/testing';
import { GameKeysService } from './game-keys.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameKey } from './entities/game-key.entity';
import { Game } from '../games/entities/game.entity';
import { HttpService } from '@nestjs/axios';
import { UserGamesService } from '../user-games/user-games.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('GameKeysService', () => {
  let service: GameKeysService;
  let gameKeysRepository: Repository<GameKey>;
  let gamesRepository: Repository<Game>;
  let userGamesService: UserGamesService;

  const mockGameKey = {
    id: 1,
    key: 'TEST-KEY-123',
    game_id: 1,
    status: 'available',
    order_id: null,
    game: {
      id: 1,
      name: 'Test Game',
      price: 1000,
    },
  };

  const mockGame = {
    id: 1,
    name: 'Test Game',
    price: 1000,
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockGameKey]),
    save: jest.fn().mockResolvedValue([mockGameKey]),
    create: jest.fn().mockReturnValue(mockGameKey),
  };

  const mockManager = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    save: jest.fn().mockResolvedValue([mockGameKey]),
    create: jest.fn().mockReturnValue(mockGameKey),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameKeysService,
        {
          provide: getRepositoryToken(GameKey),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            manager: {
              ...mockManager,
              transaction: jest.fn((callback) => callback(mockManager)),
            },
          },
        },
        {
          provide: getRepositoryToken(Game),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            manager: {
              ...mockManager,
              transaction: jest.fn((callback) => callback(mockManager)),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: UserGamesService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameKeysService>(GameKeysService);
    gameKeysRepository = module.get<Repository<GameKey>>(getRepositoryToken(GameKey));
    gamesRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    userGamesService = module.get<UserGamesService>(UserGamesService);
  });

  describe('reserveKeys', () => {
    it('должен успешно зарезервировать ключи', async () => {
      const result = await service.reserveKeys(1, 1, 1);
      expect(result).toEqual([mockGameKey]);
    });

    it('должен выбросить ошибку при недостаточном количестве ключей', async () => {
      const emptyQueryBuilder = {
        ...mockQueryBuilder,
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockManager.createQueryBuilder.mockReturnValueOnce(emptyQueryBuilder);

      await expect(service.reserveKeys(1, 2, 1)).rejects.toThrow('Not enough keys available for game 1');
    });
  });

  describe('confirmKeys', () => {
    it('должен успешно подтвердить ключи', async () => {
      await expect(service.confirmKeys(1, 'test@example.com')).resolves.not.toThrow();
    });

    it('должен выбросить NotFoundException при отсутствии зарезервированных ключей', async () => {
      const emptyQueryBuilder = {
        ...mockQueryBuilder,
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockManager.createQueryBuilder.mockReturnValueOnce(emptyQueryBuilder);

      await expect(service.confirmKeys(1, 'test@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelReservation', () => {
    it('должен успешно отменить резервирование ключей', async () => {
      await expect(service.cancelReservation(1)).resolves.not.toThrow();
    });
  });

  describe('getOrderKeys', () => {
    it('должен успешно получить ключи заказа', async () => {
      const result = await service.getOrderKeys(1);
      expect(result).toEqual([{ gameName: 'Test Game', key: 'TEST-KEY-123' }]);
    });

    it('должен выбросить NotFoundException при отсутствии ключей заказа', async () => {
      const emptyQueryBuilder = {
        ...mockQueryBuilder,
        getMany: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(gameKeysRepository, 'createQueryBuilder')
        .mockReturnValueOnce(emptyQueryBuilder as any);

      await expect(service.getOrderKeys(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 