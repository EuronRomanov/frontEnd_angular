import { Injectable } from '@angular/core';
import { Leader } from "../shared/leader";
import {  LEADERS} from "../shared/leaders";
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { map, catchError } from "rxjs/operators";
import {  ProcessHTTPMsgService} from "./process-httpmsg.service";

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

   
  constructor(private http: HttpClient,
    private processHTTPMsg: ProcessHTTPMsgService) { }


  public getLeaders():Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsg.handError));
  
  }

  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
    .pipe(catchError(this.processHTTPMsg.handError));
   
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsg.handError));
   
  }
  
}
