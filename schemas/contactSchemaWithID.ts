import { ObjectID } from "mongodb";

export interface ContactSchemaWithID {
    _id: ObjectID,
    name: string;
    email: string;
    phone_no: string;
    created_date: string;
    nsp: string;
    status: boolean
}