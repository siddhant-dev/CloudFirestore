import { Component } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './fire.service';
import { User } from 'src/user.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Firestore';

  user: string;
  li = [];
  constructor(public auth: AuthService) {

    this.auth.user$.subscribe((payload: User) => {
      if (payload) {
        this.user = payload.uid;
        this.li = payload.locations;
      }

      // console.log(payload);
    }, (err => console.log(err)) );
  }
  async twiter() {
    const cred = await this.auth.twitterSignin();
    console.log(cred);


  }

  async fb() {
    const cred = await this.auth.facebookSignin();
    console.log(cred);
  }

  addDB(city) {
    if (this.li.indexOf(city) === -1 && city) {
      // this.user= user;
      this.li.push(city);
      this.auth.addCity(this.li, this.user);
    }

  }

  getCities() {
    console.log(this.li);
  }
}

