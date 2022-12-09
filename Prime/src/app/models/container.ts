export class CONTAINER {
    ID:any=0;
    CONTAINER_NO: string = '';
    CONTAINER_TYPE: string = '';
    CONTAINER_SIZE: string = '';
    IS_OWNED:boolean;
    ON_HIRE_DATE: Date;
    OFF_HIRE_DATE: Date;
    MANUFACTURING_DATE:string='';
    SHIPPER_OWNED :boolean;
    OWNER_NAME:string='';
    LESSOR_NAME:string='';
    PICKUP_LOCATION:string='';
    DROP_LOCATION:string='';
    CREATED_BY :any;
    CREATED_DATE :Date;
    UPDATED_BY:string='';
    UPDATED_DATE:Date;  
    OPERATION: string = '';
    STATUS:boolean;
    AGENT_CODE: any = 0;
}
