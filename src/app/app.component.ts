import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup  } from '@angular/forms';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  get email(){
    return this.registrationForm.controls['email'];
  }
  
ngOnInit(): void {
  this.registrationForm =this.formBuilder.group(
    {
        userName: ['', 
                      [
                        Validators.required, 
                        Validators.minLength(3),
                        forbiddenNameValidator(/admin/)
                      ]
                  ],
        email: [''],
        subscribe: [false],
        password: [''],
        confirmPassword:[''],
        address: this.formBuilder.group(
          {
          city: [''],
          state: [''],
          postalCode: ['']
          }
        )
    },
    {
      validator: PasswordValidator
    }
  
  );

  this.f['subscribe'].valueChanges
    .subscribe(checkedValue =>{
       const email = this.f['email'];
       if(checkedValue){
         email.setValidators(Validators.required);
       }
       else{
         email.clearValidators();
       }
       email.updateValueAndValidity();
    });

}


  
  

  
  // registrationForm = new FormGroup({
  //   userName: new FormControl('Sujan'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city:new FormControl(''),
  //     state:new FormControl(''),
  //     postalCode:new FormControl('')
  //   })
  // });


  loadApiData(){
    this.registrationForm.setValue({
       userName: 'nick',
       password: 'test',
       confirmPassword: 'test',
       address:{
         city: 'City',
         state: 'State',
         postalCode: '123456'
       }
    });
  }
}

