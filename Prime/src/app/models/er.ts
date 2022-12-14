export class ER {
    ID :number;
	REPO_NO: any = '';
	LOAD_DEPOT : any = '';
	DISCHARGE_DEPOT : any = '';
    LOAD_PORT : string;
	DISCHARGE_PORT : string;
    VESSEL_NAME:string;
    VOYAGE_NO:string;
	MOVEMENT_DATE :string;
	LIFT_ON_CHARGE :string;
	LIFT_OFF_CHARGE :string;
	CURRENCY : any = '';
	NO_OF_CONTAINER : any = '';
    MODE_OF_TRANSPORT:any='';
	REASON :string;
    STATUS:string;
	AGENT_CODE : any = 0;
	AGENT_NAME :string;
    DEPO_CODE : any = 0;
	CREATED_BY :string;

  }

  export class ER_CONTAINER{
	ID :number;
	REPO_NO: any = '';
	CONTAINER_NO:any = '';
    CONTAINER_TYPE:string;
    CONTAINER_SIZE:string;
    SEAL_NO:string;
    MARKS_NOS:string;
    DESC_OF_GOODS:string;
    GROSS_WEIGHT:string;
    MEASUREMENT:string;
    AGENT_CODE:string;
    AGENT_NAME:string;
    DEPO_CODE:string;
    CREATED_BY:string;
  }