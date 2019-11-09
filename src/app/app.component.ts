import { Component } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './fire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Firestore';

  user:string;
  li = [];
  constructor(public auth: AuthService) {
    this.auth.user$.subscribe((payload: any) =>{
      this.user = payload.uid;
      this.li = payload.locations;
    } )
  }

  addDB(city){
    if(this.li.indexOf(city) === -1 && city){
      // this.user= user;
      this.li.push(city);
      this.auth.addCity(this.li, this.user);
    }

  }

  getCities(){
    console.log(this.li);
  }
}

