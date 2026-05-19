import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiMessages = Array.isArray(error.error?.messages)
        ? error.error.messages
        : null;

      const message =
        apiMessages?.join('\n') ||
        error.error?.message ||
        'No fue posible procesar la solicitud.';

      return throwError(() => new Error(message));
    })
  );
};
