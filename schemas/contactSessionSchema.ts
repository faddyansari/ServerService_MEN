import { ObjectId, ObjectID } from "bson";

export interface ContactSessionSchema {

    _id?: string | ObjectID;
    socketID: Array<string>;
    location: string;
    fullCountryName: string;
    country: string;
    ip: string;
    nsp: string;
    creationDate: string | Date;
    url: Array<string>;
    username?: string;
    email?: string;
    type: string;
    expireDate?: Date;
    isMobile: boolean;
    id?: string | ObjectID;
    callingState: any;
    deviceID?: string;
    referrer?: string;
    deviceInfo?: {
        name: string,
        os: string,
        version: string,
        product?: string,
        manufacturer?: string
    }
}