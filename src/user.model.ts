export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    locations?: Array<string>;
  }