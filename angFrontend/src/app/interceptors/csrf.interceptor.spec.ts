import { csrfInterceptor } from './csrf.interceptor';

describe('Csrf', () => {
  it('should be defined', () => {
    expect(csrfInterceptor).toBeTruthy();
  });
});
