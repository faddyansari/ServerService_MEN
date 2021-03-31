import { ObjectID } from "mongodb";

export interface regexSchema {
    nsp: string;
    regex_value : string;
    regex : Array<any>;
    del: boolean;
}