export class QUOTATION {
  SRR_NO: string = '';
  CUSTOMER_NAME: string = '';
  STATUS: string = '';
  AGENT_CODE: number = 0;
  OPERATION: string = '';
}

export class CONTAINER {
  ID!: number;
  SRR_ID!: number;
  SRR_NO!: string;
  NO_OF_CONTAINERS!: number;
  CREATED_BY!: string;
}

export class BOOKING {
  SRR_NO: string;
  STATUS: string;
  AGENT_CODE: string;
}
