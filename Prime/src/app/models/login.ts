export class LOGIN {
  ID: number;
  USERNAME: string;
  USERTYPE: string;
  PASSWORD: string;
  EMAIL: string;
  ROLE_ID: number;
  STATUS: string;
  role: Role;
}

export enum Role {
  User = 'User',
  Admin = 'Admin',
  Agent = 'Agent',
  Principal = 'Principal',
  Depot = 'Depot',
}
