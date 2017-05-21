
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
  ionViewWillEnter() {
    /*this.patients = this.getPatients();*/
    console.log("didLoad from PatientService")

  }
  addItem(patientID: number,
          patientFirstName: string,
          patientLastName: string,
          patientGender:string,
          patientAddress: string,
          patientPhone: number,
          patientMail: string,
          patientDOB: Date){
    /*const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });*/
    //loading.present();
    //Puts list of patients from server to local
    //this.loadPatientsFromServer();
    this.auth.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.fetchList(token)
            .subscribe(
              (list: Patient[]) => {
                //loading.dismiss();
                if (list) {
                  this.patients = list;
                } else {
                  this.patients = [];
                }
              },
              error => {
                //loading.dismiss();
                this.handleError(error.json().error);
              }
            );
        }
      );
    //Check if there's already patient with same id
    if(!this.checkIfExists(this.patients,patientID)){
      this.patients.push(new Patient(patientID,patientFirstName,patientLastName,patientGender,patientAddress,patientPhone,patientMail,patientDOB));
      //saving to server
      this.auth.getActiveUser().getToken()
        .then(
          (token: string) => {
            this.storeList(token)
              .subscribe(
                () => {
                 // loading.dismiss();
                console.log(this.patients);
                  this.successWindow("!מטופל נוסף בהצלחה");
                },
                error => {
                  //console.log("error in storeList");
                 // loading.dismiss();
                  console.log(this.patients);
                  this.handleError(error.json().error);
                }
              );
          }
        );
      //console.log(this.patients);
    }
    else {
      //loading.dismiss();
      console.log(this.patients);
      this.handleError("קיים מטופל בעל ת.ז זהה");
      //console.log("LetscheckSomething");
    }
  }

  private storeList(token: string) {
    const userId = this.auth.getActiveUser().uid;
    return this.http
      .put('https://onebody-356cf.firebaseio.com/' + userId + '/patient.json?auth=' + token, this.patients)
      .map((response: Response) => {
        return response.json();
      });
  }
  private fetchList(token: string) {
    const userId = this.auth.getActiveUser().uid;
    return this.http.get('https://onebody-356cf.firebaseio.com/' + userId + '/patient.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      })
      .do((patients: Patient[]) => {
        if (patients) {
          this.patients = patients;
        } else {
          this.patients = [];
        }
      });
  }
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();

  }
   /*loadPatientsFromServer(){
    this.auth.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.fetchList(token)
            .subscribe(
              (list: Patient[]) => {
                //loading.dismiss();
                if (list) {
                  this.patients = list;
                } else {
                  this.patients = [];
                }
              },
              error => {
                //loading.dismiss();
                this.handleError(error.json().error);
              }
            );
        }
      );
    console.log(this.patients);
  }*/
  private successWindow(success:string){
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private checkIfExists(list:Patient[],x:number){
    for(let n of list){
      if(x==n.patientID)
        return true;
    }
    return false;
  }
  getPatients() {
    return this.patients.slice();
  }

}

