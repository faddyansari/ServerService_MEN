import { ObjectID } from "mongodb";

export interface synonymsSchema {
    nsp: string;
    entity_value : string;
    synonyms : Array<any>;
    del: boolean;
}