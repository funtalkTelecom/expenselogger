export interface User {
  id: number;
  userName: string;
  passWord: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  roles: [];
  birth: Date;
  photoUrl: string;
  type: string;
  createdTime: Date;
}


export interface Role {
  id: number;
  roleName: string;
}
