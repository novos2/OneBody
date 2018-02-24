import { Component } from '@angular/core';



import {RegistrationEmployee} from "../registration-employee/registration-employee";
import {Homescreen} from "../homescreen/homescreen";
import {Repadmin} from "../repadmin/repadmin";
import {AuthService} from "../../services/auth";




@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class Tabs {
  adminFlag:boolean;
  user:string;
  repadminPage=Repadmin;
  homePage = Homescreen;
  employeesPage = RegistrationEmployee;
  constructor(private authService: AuthService){
    this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.adminFlag=true;
    }
    else {
      this.adminFlag=false;
    }
  }

}
