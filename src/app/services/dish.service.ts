import { Injectable } from '@angular/core';
import { Dish } from "../shared/dish";
import { DISHES } from "../shared/dishes";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  
  public getDishes() : Promise<Dish[]> {
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(DISHES), 2000);
    });
    
   
  }

  getDish(id: string): Promise<Dish> {
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(DISHES.filter((dish) => (dish.id === id))[0]),200);
    });
  }

  getFeaturedDish(): Promise<Dish> {
    return new Promise(resolve=>{
      //simulación de latencia del servidor con   2 segundos de retraso
      setTimeout(()=>resolve(DISHES.filter((dish) => dish.featured)[0]),200);
    });
  }
  
}
