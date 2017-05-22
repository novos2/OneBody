import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Employee} from "../../models/employee";


@IonicPage()
@Component({
  selector: 'page-employees',
  templateUrl: 'employees.html',
})
export class Employees implements OnInit {
  employee: Employee;
  index: number;
  constructor(public navParams: NavParams) {
  }
  ngOnInit() {
    this.employee = this.navParams.get('employee');
    this.index = this.navParams.get('index');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Employees');
  }

}
