import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  private data: Record<string, any> = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData(key: string) {
    return this.data[key];
  }
}
