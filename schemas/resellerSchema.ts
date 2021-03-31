import { ObjectID } from "bson";

export interface ResellerSchema {

    _id?: string | ObjectID;
    companiesRegistered: Array<string>;//(in reseller app)
    peronalInfo: { //in website(extreme Ip lookup)
        ip: string;
        location: string;
        fullCountryName: string;
        username: string;
        email: string;
        phone: string,
        password : string
    }
    DisprovedOrApprovedBy: { //in admin app
        date: string,
        by: string,
    }
    createdDate: string | Date;
    type: string;
    bank?: {
        bankName: string,
        bankSwiftCode: string,
        bankAccount: string,
        bankIban: string
    }
    verified: boolean
    expireDate?: Date;
    referrer?: string;
}