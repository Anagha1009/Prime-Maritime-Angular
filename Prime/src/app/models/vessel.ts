export class VESSEL {
  ID: any;
  VESSEL_NAME: string = '';
  IMO_NO: string = '';
  STATUS: string = '';
  FROM_DATE: string = '';
  TO_DATE: string = '';
}

export class SCHEDULE {
  ID: any;
  VESSEL_NAME: string = '';
  PORT_CODE: string = '';
  ETA: string = '';
  ETD: string = '';
  STATUS: string = '';
}

export class VOYAGE {
  STATUS: string = '';
  FROM_DATE: string = '';
  TO_DATE: string = '';
}
