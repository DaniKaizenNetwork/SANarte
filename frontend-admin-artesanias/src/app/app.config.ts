import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient
} from '@angular/common/http';

import * as appRoutes from './app.routes';

// Support different export styles from app.routes (named 'routes' or default export)
const routes = (appRoutes as any).routes ?? (appRoutes as any).default ?? appRoutes as any;

export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideHttpClient()
  ]
};