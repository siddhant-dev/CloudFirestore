import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../src/user.model' ; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({ providedIn: 'root' })
export class AuthService {
    errMessage: string;
    user$: Observable<User>;
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      );
    }
    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential: any = await this.afAuth.auth.signInWithPopup(provider).
      catch(error => this.errorHandle(error));
      // console.log(credential.additionalUserInfo);
      if (credential) {
        return this.updateUserData(credential.user);
      } else {
        return;
      }
    }

    async facebookSignin() {
      const provider = new auth.FacebookAuthProvider();
      try {
        const credential = await this.afAuth.auth.signInWithPopup(provider);
        return this.updateUserData(credential.user);
      } catch (err) {
        if (err.code === 'auth/account-exists-with-different-credential') {
          const method = await this.afAuth.auth.fetchSignInMethodsForEmail(err.email);
          console.log(method[0]);
          return method;
        }

      }
    }


    async twitterSignin() {
      const provider = new auth.TwitterAuthProvider();
      try {
        const credential = await this.afAuth.auth.signInWithPopup(provider);
        return this.updateUserData(credential.user);
      } catch (err) {
        if (err.code === 'auth/account-exists-with-different-credential') {
          const method = await this.afAuth.auth.fetchSignInMethodsForEmail(err.email);
          console.log(method[0]);
          return method;
        }
      }
    }

    async errorHandle(err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
       const method = await this.afAuth.auth.fetchSignInMethodsForEmail(err.email);
       console.log(method[0]);
       let credential;
       let provider;
       if (method[0] === 'google.com') {
        provider = new auth.GoogleAuthProvider();
        credential = await this.afAuth.auth.signInWithPopup(provider).then(function(result) {
        return result.user.linkWithCredential(err.credential);
      });
    } else if (method[0] == 'twitter.com') {
        provider = new auth.TwitterAuthProvider();
        credential = await this.afAuth.auth.signInWithPopup(provider).
        then(function(result) {
          return result.user.linkWithCredential(err.credential);
      });
      } else if (method[0] == 'facebook.com') {
        provider = new auth.FacebookAuthProvider();
        credential = await this.afAuth.auth.signInWithPopup(provider).
        then(function(result) {
          return result.user.linkWithCredential(err.credential);
      });
      }

      }
    }

    private updateUserData(user) {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      userRef.set(data, { merge: true });
      return true;

    }

  public addCity(city , user) {

    const cityRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user}`);
    const data = {
      locations: city
    };
    return cityRef.set(data, { merge: true });
  }

    async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
    }

    public getCities(user) {
      const cityRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user}`);
      return cityRef.valueChanges();
    }
}
