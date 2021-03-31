import { ObjectID } from "mongodb";

export interface MergedSchema {
    nsp: string;
    visitor: any;
    MergedIds:ObjectID;
}