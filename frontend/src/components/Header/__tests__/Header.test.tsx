import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../Header';

// Мокаем хук useGameSearch
jest.mock('@/hooks/useGameSearch', () => ({
  useGameSearch: () => ({
    searchValue: '',
    results: [],
    isLoading: false,
    handleSearchChange: jest.fn(),
    clearSearch: jest.fn()
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('рендерит логотип', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('DigitalHive')).toBeInTheDocument();
  });

  it('рендерит навигационные элементы', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Все игры')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
    expect(screen.getByText('Корзина')).toBeInTheDocument();
    expect(screen.getByText('Профиль')).toBeInTheDocument();
  });

  it('открывает мобильное меню при клике на бургер', () => {
    renderWithRouter(<Header />);
    const burgerButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(burgerButton);
    expect(screen.getByRole('navigation')).toHaveClass('mobileMenuOpen');
  });

  it('открывает поиск при клике на кнопку поиска', () => {
    renderWithRouter(<Header />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(screen.getByRole('search')).toHaveClass('searchOpen');
  });
}); 