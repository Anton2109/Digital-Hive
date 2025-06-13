import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Basket from '../Basket';
import axios from 'axios';
import GameService from '@/API/GameService';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Мокаем GameService
jest.mock('@/API/GameService', () => ({
  __esModule: true,
  default: {
    getGameById: jest.fn()
  }
}));

// Мокаем localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const mockBasketItems = [
  {
    id: 1,
    game_id: 1,
    quantity: 2,
    session_id: 'test-session'
  }
];

const mockGame = {
  id: 1,
  name: 'Test Game',
  price: 1000,
  img_path: 'test.jpg',
  gameInfo: {
    id: 1,
    game_id: 1,
    description: 'Test description',
    release_date: '2024-01-01',
    developer: 'Test Developer',
    publisher: 'Test Publisher',
    img: 'test.jpg',
    rating: 5,
    systemReqMin: {
      os: 'Windows 10',
      processor: 'Intel Core i5',
      memory: '8GB',
      graphics: 'NVIDIA GTX 1060',
      storage: '50GB'
    },
    systemReqMax: {
      os: 'Windows 10',
      processor: 'Intel Core i7',
      memory: '16GB',
      graphics: 'NVIDIA RTX 2060',
      storage: '50GB'
    }
  }
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Basket Component', () => {
  beforeEach(() => {
    // Сбрасываем все моки перед каждым тестом
    jest.clearAllMocks();
    
    // Настраиваем моки
    mockLocalStorage.getItem.mockReturnValue('test-session');
    mockedAxios.get.mockResolvedValue({ data: mockBasketItems });
    (GameService.getGameById as jest.Mock).mockResolvedValue(mockGame);
  });

  it('отображает заголовок корзины', async () => {
    renderWithRouter(<Basket />);
    expect(screen.getByText('Ваша корзина')).toBeInTheDocument();
  });

  it('отображает товары в корзине', async () => {
    renderWithRouter(<Basket />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('1000 ₽')).toBeInTheDocument();
    });
  });

  it('позволяет изменить количество товара', async () => {
    renderWithRouter(<Basket />);
    
    await waitFor(() => {
      const minusButton = screen.getByText('-');
      const plusButton = screen.getByText('+');
      
      fireEvent.click(plusButton);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      fireEvent.click(minusButton);
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('отображает общую сумму заказа', async () => {
    renderWithRouter(<Basket />);
    
    await waitFor(() => {
      expect(screen.getByText('Итого:')).toBeInTheDocument();
      expect(screen.getByText('2000 ₽')).toBeInTheDocument();
    });
  });

  it('перенаправляет на страницу входа при попытке оформить заказ без авторизации', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { container } = renderWithRouter(<Basket />);
    
    await waitFor(() => {
      const checkoutButton = screen.getByText('Оформить заказ');
      fireEvent.click(checkoutButton);
    });
    
    expect(window.location.pathname).toBe('/auth/login');
  });
}); 