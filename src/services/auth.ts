import firebase from 'firebase';

export class AuthService {
  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }
  forgotPass(email:any){
    return firebase.auth().sendPasswordResetEmail(email);
  }

  isAdmin(){
    const user = firebase.auth().currentUser.email;
    if(user=='test@test.com'){
      return true;
    }
    else return false;
  }
}
