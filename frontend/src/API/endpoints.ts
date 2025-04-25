export const API_ENDPOINTS = {

  GAMES: '/games',
  GAME_BY_ID: (id: string | number) => `/game-details/${id}`,
  GAMES_BY_CATEGORY: (categoryId: string | number) => `/categories/${categoryId}/games`,
  GAME_DETAILS: (id: string) => `/games/${id}`,
  FEATURED_GAMES: '/games/featured',
  POPULAR_GAMES: '/games/popular',
  SALES_GAMES: '/games/sales',

  CATEGORIES: '/categories',
  CATEGORY_GAMES: (categoryId: string) => `/categories/${categoryId}/games`,

  NEWS: '/news',
  NEWS_DETAILS: (id: string) => `/news/${id}`,

  USER_PROFILE: '/user/profile',
  USER_FAVOURITES: '/user/favourites',
  USER_BASKET: '/user/basket',

  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
} as const; 