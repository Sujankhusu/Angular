import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl  } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private formBuilder: FormBuilder) {}

  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }


  registrationForm =this.formBuilder.group({
     userName: ['', 
                  [
                    Validators.required, 
                    Validators.minLength(3),
                    forbiddenNameValidator(/admin/)
                  ]
               ],
     password: [''],
     confirmPassword:[''],
     address: this.formBuilder.group({
       city: [''],
       state: [''],
       postalCode: ['']
     })
  });
  

  
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

