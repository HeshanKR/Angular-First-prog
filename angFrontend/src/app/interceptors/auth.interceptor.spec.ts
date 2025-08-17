// file: angFrontend/src/app/interceptors/auth.interceptor.spec.ts
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';

describe('AuthInterceptor', () => {
  it('should execute without error', (done) => {
    const req = new HttpRequest<any>('GET', '/test');

    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      const event: HttpEvent<any> = { type: 0 }; // dummy event
      return of(event);
    };

    const result$ = authInterceptor(req, next);

    result$.subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
        done();
      },
      error: done.fail,
    });
  });
});
