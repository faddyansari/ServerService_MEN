export interface VisitorSchema {

    username: string;
    email: string;
    phone?: number;
    createdDate: string
    location: string;
    nsp?: string;
    count?: number;
    ipAddress: string;
    deviceID: string;
    referrer?: any;
    deviceInfo?: any;
    sessions: Array<string>;
    banned?: boolean;
    banSpan?: number;
    bannedOn?: string,

}