import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormArray  } from '@angular/forms';
import { RegistrationService } from '../registration.service';
import { PasswordValidator } from '../shared/password.validator';
import { forbiddenNameValidator } from '../shared/user-name.validator';
import { UserModel } from './user-dashboard.model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  registrationForm!: FormGroup;

  submitted = false;

  userModelObj : UserModel = new UserModel();
  userData !: any;

  showAdd !: boolean;
  showUpdate !:boolean;

  constructor(private formBuilder: FormBuilder, 
              private _registrationService: RegistrationService,
              private api: ApiService) {}

  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  get email(){
    return this.registrationForm.controls['email'];
  }

  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.formBuilder.control(''));
  }

  // removeAlternateEmail(i: number){
  //   this.alternateEmails.removeAt(i);

  // }
  
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
        ),
        alternateEmails : this.formBuilder.array([])
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

  this.getAllUser();

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

  onSubmit(){
    console.log(this.registrationForm.value);
    this.submitted = true;
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
         response => console.log('Success!' , response)
         
      );
  }

  onReset(): void {
    this.submitted = false;
    this.registrationForm.reset();
  }

  clickAddUser(){
    this.registrationForm.reset();
    this.showAdd=true;
    this.showUpdate = false;
  }

  postUserDetails(){
    this.userModelObj.userName =this.registrationForm.value.userName;
    this.userModelObj.email =this.registrationForm.value.email;
    this.userModelObj.city =this.registrationForm.value.address.city;
    this.userModelObj.state =this.registrationForm.value.address.state;
    this.userModelObj.postalCode =this.registrationForm.value.address.postalCode;

    this.api.postUser(this.userModelObj)
     .subscribe(res =>{
       console.log(res);
       alert("User Added Successfully");
       let ref =  document.getElementById('cancel')
       ref?.click();
       this.registrationForm.reset();
       this.getAllUser();
     },
     err =>{
        alert("Something Went Wrong");
     })

  }

  getAllUser(){
    this.api.getUser()
    .subscribe(res =>{
      this.userData =res;
    })
  }

  deleteUser(row: any){
    this.api.deleteUser(row.id)
    .subscribe(res => {
      alert("User Deleted");
      this.getAllUser();
    })
  }

  onEdit(row: any){
    this.showAdd=false;
    this.showUpdate = true;
    this.userModelObj.id =row.id;
    this.registrationForm.controls['userName'].setValue(row.userName);
    this.registrationForm.controls['email'].setValue(row.email);
    this.registrationForm.controls['city'].setValue(row.city);
    this.registrationForm.controls['state'].setValue(row.state);
    this.registrationForm.controls['postalCode'].setValue(row.postalCode);
  }

  updateUserDetails(){
    this.userModelObj.userName =this.registrationForm.value.userName;
    this.userModelObj.email =this.registrationForm.value.email;
    this.userModelObj.city =this.registrationForm.value.address.city;
    this.userModelObj.state =this.registrationForm.value.address.state;
    this.userModelObj.postalCode =this.registrationForm.value.address.postalCode;

    this.api.updateUser(this.userModelObj,this.userModelObj.id)
    .subscribe(res =>{
      alert("Updated Succesfully");
      let ref =  document.getElementById('cancel')
       ref?.click();
       this.registrationForm.reset();
       this.getAllUser();
    })
  }


}


