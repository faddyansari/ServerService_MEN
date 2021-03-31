export interface ResellerSessionSchema {

socketID: Array<string>;
createdDate: string;
personalInfo: { //in website(extreme Ip lookup)
    ip: string;
    location: string;
    fullCountryName: string;
    username: string;
    email: string;
    phone: string,
    password : string
}
type: string;
bank?: {
    bankName: string,
    bankSwiftCode: string,
    bankAccount: string,
    bankIban: string
}
date: string | Date;
id?: string;
_id?: string;
isReseller?: boolean;
}