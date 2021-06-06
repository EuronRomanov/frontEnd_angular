import { Injectable } from '@angular/core';
import { Dish } from "../shared/dish";
import { DISHES } from "../shared/dishes";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { map, catchError } from "rxjs/operators";
import {  ProcessHTTPMsgService} from "./process-httpmsg.service";

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  
  public getDishes() : Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL+'dishes')
    .pipe(catchError(this.processHTTPMsgService.handError));
    
    
   
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(baseURL+'dishes/'+id)
    .pipe(catchError(this.processHTTPMsgService.handError));
  
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish>(baseURL+'dishes?feature=true')
    .pipe(map(dishes=>dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handError));
   
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes=>dishes.map(dish=>dish.id)))
    .pipe(catchError(this.processHTTPMsgService.handError));
  }

  putDish(dish:Dish):Observable<Dish>{
    const httpOptions={
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.put<Dish>(baseURL+'dishes/'+dish.id,dish,httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handError));
  }
  
}
