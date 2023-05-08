export class BOOKING {
  ID: number;
  BOOKING_ID: number;
  BOOKING_NO: any = '';
  SRR_ID: number;
  SRR_NO: string;
  POL: string;
  POD: string;
  VESSEL_NAME: string;
  VOYAGE_NO: string;
  MOTHER_VESSEL_NAME: string;
  MOTHER_VOYAGE_NO: string;
  CUSTOMER_NAME: string;
  AGENT_CODE: any = 0;
  AGENT_NAME: string;
  STATUS: string;
  CREATED_BY: string;
  IS_ROLLOVER: boolean = false;
  CONTAINER_LIST: SRRCONTAINER[];
  FROM_DATE: string = '';
  TO_DATE: string = '';
  ORG_CODE: string = '';
  PORT: string = '';
}

export class SRRCONTAINER {
  SRR_ID: number;
  SRR_NO: string;
}
export class SLOTS {
  // SRR_NO: string;
  // NO_OF_SLOTS: number;
  ID: number;
  SRR_NO: string;
  BOOKING_ID: number;
  BOOKING_NO: string;
  SLOT_OPERATOR: string;
  NO_OF_SLOTS: number;
  CREATED_BY: string;
}
