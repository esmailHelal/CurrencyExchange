import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConvertResponce,
  HistroicResponce,
  RateResponce,
  SymbolsResponce,
} from '../../../home/models/symbols';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api: string;
  constructor(private readonly http: HttpClient) {
    this.api = 'http://data.fixer.io/api';
  }

  getSymbolsList(): Observable<SymbolsResponce> {
    return this.http.get<SymbolsResponce>(
      `${this.api}/symbols?access_key=86e744ebdf50a7df91727b512c4b09f1`
    );
  }
  getRate(from: string, to: string): Observable<RateResponce> {
    return this.http.get<RateResponce>(
      `${this.api}/latest?access_key=86e744ebdf50a7df91727b512c4b09f1&base=${from}&symbols=${to}`
    );
  }

  getConvertResult(
    from: string,
    to: string,
    amount: number
  ): Observable<ConvertResponce> {
    return this.http.get<ConvertResponce>(
      `${this.api}/convert?access_key=86e744ebdf50a7df91727b512c4b09f1&from=${from}&to=${to}&amount=${amount}`
    );
  }

  getHistroic(
    from: string,
    to: string,
    date: string
  ): Observable<HistroicResponce> {
    return this.http.get<HistroicResponce>(
      `${this.api}/${date}?access_key=86e744ebdf50a7df91727b512c4b09f1&base=${from}&symbols=${to}`
    );
  }
  
  getMostPopular(
    symbols: string
  ): Observable<RateResponce> {
    return this.http.get<RateResponce>(
      `${this.api}/latest?access_key=86e744ebdf50a7df91727b512c4b09f1&base=EUR&symbols=${symbols}`
    );
  }

}
