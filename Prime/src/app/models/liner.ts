export class LINER {
  ID: any = 0;
  CODE: string = '';
  NAME: string = '';
  DESCRIPTION: string = '';
  CREATED_BY: any;
  CREATED_DATE: Date;
  UPDATED_BY: string = '';
  STATUS: string = '';
  FROM_DATE: string = '';
  TO_DATE: string = '';
  UPDATED_DATE: Date;
}

export class LINERSERVICE {
  ID: any = 0;
  LINER_CODE: string = '';
  SERVICE_NAME: string = '';
  PORT_CODE: string = '';
  STATUS: boolean;
  CREATED_BY: any;
  CREATED_DATE: Date;
  UPDATED_BY: string = '';
  UPDATED_DATE: Date;
}
