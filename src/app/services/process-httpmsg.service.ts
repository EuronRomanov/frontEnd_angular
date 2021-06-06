import { Injectable } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() {
    
   }


   public handError(error: HttpErrorResponse | any){
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {
      errMsg=error.error.error.message;
    } else {
      errMsg=`${error.status} -${error.statusText || ''} ${error.error}`;
    }

    return throwError(errMsg);
   }
}
