export class BOOKING {
  // BOOKING_NO: any = '';
  // STATUS: string = '';
  // AGENT_CODE: any = 0;
  ID:number;
  BOOKING_NO: any = '';
  SRR_ID:number;
  SRR_NO:string;
  VESSEL_NAME:string;
  VOYAGE_NO:string;
  MOTHER_VESSEL_NAME :string;
  MOTHER_VOYAGE_NO :string;
  AGENT_CODE: any = 0;
  AGENT_NAME:string;
  STATUS:string;
  CREATED_BY:string;
  CONTAINER_LIST:SRRCONTAINER[];

}

export class SRRCONTAINER{
  SRR_ID:number;
  SRR_NO:string;
}
export class SLOTS {
  // SRR_NO: string;
  // NO_OF_SLOTS: number;
  ID:number;
  SRR_NO: string;
  BOOKING_ID:number;
  BOOKING_NO:string;
  SLOT_OPERATOR:string;
  NO_OF_SLOTS:number;
  CREATED_BY:string;
}
