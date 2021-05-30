import { Injectable } from '@angular/core';
import { Leader } from "../shared/leader";
import {  LEADERS} from "../shared/leaders";

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

   
  constructor() { }


  public getLeaders():Promise<Leader[]>{
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(LEADERS),200);
    });
  }

  getLeader(id: string): Promise<Leader> {
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(LEADERS.filter((leader) => (leader.id === id))[0]),200);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(LEADERS.filter((leader) => leader.featured)[0]),200);
    });
  }
  
}
