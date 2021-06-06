import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { map, catchError, delay} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) { }


  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>( baseURL + 'dishes')
    .pipe(catchError(this.processHTTPMsgService.handError));
    
  }

  getPromotion(id: string): Observable<Promotion> {
    return of(PROMOTIONS.filter((promo)=>promo.id===id)[0]).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
    .pipe(map(promo => promo[0] ))
    .pipe(catchError(this.processHTTPMsgService.handError))
  }
}
