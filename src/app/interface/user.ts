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
  image: Image;
  birth: Date;
  photoUrl: string;
  type: string;
  createdTime: Date;
}


export interface Role {
  id: number;
  roleName: string;
}

export interface Image {
  id: number;
  fileName: string;
  path: string;
  uploadTime: Date;
  comment: string;
  photographer: string;
}
