export class CONTAINER_MOVEMENT {
    ID: number;
    BOOKING_NO: any='';
    CRO_NO: any='';
    CONTAINER_NO: any='';
    ACTIVITY: string;
    PREV_ACTIVITY: any='';
    ACTIVITY_DATE: string;
    LOCATION: string;
    CURRENT_LOCATION: string;
    STATUS: string;
    AGENT_CODE: any='';
    DEPO_CODE: any='';
    CREATED_BY: any='';
    NEXT_ACTIVITY_LIST:any;
    fromXL:boolean;
}

export class CONTAINER_TRACKING {
    ID: number;
    BOOKING_NO: any='';
    CRO_NO: any='';
    CONTAINER_NO: any='';
    ACTIVITY: string;
    PREV_ACTIVITY: any='';
    ACTIVITY_DATE: string;
    LOCATION: string;
    STATUS: string;
    AGENT_CODE: any='';
    DEPO_CODE: any='';
    CREATED_BY: any='';
    CONTAINER_MOVEMENT_LIST:any;
}


