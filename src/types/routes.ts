import type { RouteObject } from 'react-router-dom';

export type AppRoute = RouteObject & {
  title?: string;
  children?: AppRoute[];
}; 