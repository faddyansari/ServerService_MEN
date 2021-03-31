import { ObjectID } from "mongodb";

export interface tpEntitiesSchema {
    id: ObjectID;
    start : Number;
    end : Number;
    value : string;
    entity:string;
    entity_del : boolean;
}