// file: angFrontend/src/app/interceptors/csrf.interceptor.ts
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const csrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (unsafeMethods.includes(req.method.toUpperCase())) {
    const token = getCookie('csrfToken');
    if (token) {
      const cloned = req.clone({
        setHeaders: { 'x-csrf-token': token },
      });
      return next(cloned);
    }
  }

  return next(req);
};

// Helper to read cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
