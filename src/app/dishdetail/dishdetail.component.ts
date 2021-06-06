import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { Dish } from '../shared/dish';
import { DishService } from "../services/dish.service";
import {  switchMap } from "rxjs/operators";
import { Comment } from "../shared/comment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { visibility , flyInOut, expand} from "../animations/app.animations";



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display: block;'
  },
  animations: [
   visibility(),
   flyInOut(),
   expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish:Dish ;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  visibility = 'shown';

  dishcopy: Dish;
  //formComment
  commentForm: FormGroup;
  comment: Comment;
  todayDate : Date = new Date();

  //comment
  @ViewChild('commentForm') commentFormDirective;


  formErrorsComment={
    'author':'',
    'rating':'',
    'comment':''
  }

  validationMessagesComment={
    'author':{
      'required':'Author is required',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength': 'FirstName cannot be more than 25 characters long.'
    },
    'rating':{
      'required':'Rating is required',
      'min': 'Rating must be at least 1',
      
    },
    'comment':{
      'required':'Comment is required',
      'minlength': 'Comment must be at least 2 characters long.',
      'maxlength': 'Comment cannot be more than 25 characters long.'
    }
  };
  
  constructor(private dishService: DishService,
    private route:ActivatedRoute,
    private location: Location,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) {

      this.createFormComment();
     }

  ngOnInit(): void {
    this.dishService.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.dishcopy=dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
    errMess=> this.errMess=<any>errMess);


   
  }


  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack():void{
      this.location.back();
    }


  createFormComment(){
      this.commentForm=this.fb.group({
        author:['', [Validators.minLength(2), Validators.maxLength(25)]],
        rating:[5, [Validators.min(1)]],
        comment:['', [Validators.minLength(2), Validators.maxLength(25)]]
      });


    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }


  onSubmit() {
    this.dishcopy.comments.push({
      rating:this.commentForm.get('rating').value,
      comment: this.commentForm.get('comment').value,
      author: this.commentForm.get('author').value,
     date: this.todayDate.toISOString()
    });
    
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish=>{
      this.dish=dish; this.dishcopy=dish;
    },
    errmess=>{this.dish=null,this.dishcopy=null; this.errMess=<any> errmess;});
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:''
      
    });

    this.commentFormDirective.resetForm();
   

  }




  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrorsComment) {
      if (this.formErrorsComment.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrorsComment[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessagesComment[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrorsComment[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
