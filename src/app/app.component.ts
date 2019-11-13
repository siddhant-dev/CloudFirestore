import { Component } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './fire.service';
import { User } from 'src/user.model';
import { from } from 'rxjs';
import { ModalService } from './ui/FeatureModule/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Firestore';
  popup = true;
  user: string;
  cred: any;
  provider: string;
  li = [];
  constructor(public auth: AuthService, private modalService: ModalService) {

    this.auth.user$.subscribe((payload: User) => {
      if (payload) {
        this.user = payload.uid;
        this.li = payload.locations;
      }

      // console.log(payload);
    }, (err => console.log(err)) );
  }
  async twiter() {
    this.provider = 'Twitter';
    this.cred = await this.auth.twitterSignin();
    if(this.cred !== true){
      this.popup = !this.popup;
    }


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

  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
    this.modalService.close(id);
}
}

