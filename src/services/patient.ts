
import {Patient} from "../models/patient";
import {Http,Response} from "@angular/http";
import {AuthService} from "./auth";
import 'rxjs/Rx';
import {AlertController, LoadingController} from "ionic-angular";
import {Injectable} from "@angular/core";
@Injectable()
export class PatientService{
  private patients: Patient[] =[];
  constructor(private http: Http, private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }
  addItem(patientID: number,
          patientFirstName: string,
          patientLastName: string,
          gender: string,
          patientAddress: string,
          patientPhone: number,
          patientMail: string,
          patientDOB: Date){
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.patients.push(new Patient(patientID,patientFirstName,patientLastName,gender,patientAddress,patientPhone,patientMail,patientDOB));
    this.auth.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.storeList(token)
            .subscribe(
              () => loading.dismiss(),
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
        }
      );
    console.log(this.patients);

  }

  storeList(token: string) {
    const userId = this.auth.getActiveUser().uid;
    return this.http
      .put('https://onebody-356cf.firebaseio.com/' + userId + '/patient.json?auth=' + token, this.patients)
      .map((response: Response) => {
        return response.json();
      });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}

