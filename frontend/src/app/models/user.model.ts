export interface UserSignup {
  name: string;
  email: string;
  password: string;
}

export interface UserSignin {
  username: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  id: number;
}

export interface UserUpdate {
  name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  id: number;
  password: string;
}
