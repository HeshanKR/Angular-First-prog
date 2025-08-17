// angFrontend/src/app/interceptors/auth.interceptor.ts
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Try refresh token once
        return authService.refreshToken().pipe(
          switchMap(() => next(req.clone())),
          catchError((err) => throwError(() => err))
        );
      }
      return throwError(() => error);
    })
  );
};

// import {
//   HttpRequest,
//   HttpHandlerFn,
//   HttpEvent,
//   HttpInterceptorFn,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError, switchMap, catchError } from 'rxjs';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';

// export const authInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthService);

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         // Attempt refresh token once
//         return authService.refreshToken().pipe(
//           switchMap(() => {
//             const clonedReq = req.clone();
//             return next(clonedReq);
//           }),
//           catchError((err) => throwError(() => err))
//         );
//       }
//       return throwError(() => error);
//     })
//   );
// };
