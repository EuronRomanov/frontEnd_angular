import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import { flyInOut } from "../animations/app.animations";
import { FeedbackService } from '../services/feedback.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display: block;'
  },
  
  animations:[
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback | null;
  submittedFeedback: Feedback | null = null;
  contactType = ContactType;
  submitting: boolean = false;
  errMess!: string;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm =  this.fb.group({
      firstname:[ '', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: [ '',  [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [ 0, [Validators.required,Validators.pattern]],
      email: [ '', Validators.required],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
   
    if (this.feedback) {

      this.submitting = true;

      this.feedbackService.postFeedback(this.feedback).subscribe(

        (feedback) => {
          this.submitting = false;
          this.submittedFeedback = feedback;
          setTimeout(() => (this.feedback = null, this.submittedFeedback=null), 5000);
        },
        (errmess) => {
          this.feedback = null;
          this.submittedFeedback = null;
          this.submitting = false;
          this.errMess = <any>errmess;
        }
      );
    }


    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:0,
      email:'',
      agree: false,
      contacttype:'None',
      message:''
    });

    this.feedbackFormDirective.valueChanges
    .resetForm();

   
  }


  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
