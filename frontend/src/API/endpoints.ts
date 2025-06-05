export const API_ENDPOINTS = {
  GAMES: "/games",
  GAME_BY_ID: (id: string | number) => `/games/${id}`,
  GAMES_BY_CATEGORY: (categoryId: string | number) =>
    `/categories/${categoryId}`,

  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string | number) => `/categories/${id}`,

 /* Авторизация */
  AUTH: "",
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_PROFILE: "/auth/me",

  USER_PROFILE: "/users/profile",
  USER_FAVOURITES: "/users/favourites",
  USER_BASKET: "/users/basket",
  
  /* Корзина */
  BASKET: "/cart",
  
  /* Заказы */
  ORDERS: "/orders",
  CONFIRM_ORDER: (orderId: number) => `/orders/${orderId}/confirm`,
  
  GAME_DETAILS: (id: string) => `/games/${id}`,
  FEATURED_GAMES: "/games/featured",
  POPULAR_GAMES: "/games/popular",
  SALES_GAMES: "/games/sales",

  NEWS: "/news",
  NEWS_DETAILS: (id: string) => `/news/${id}`,
} as const;
