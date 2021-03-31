import { ObjectID } from "mongodb";
import { tpEntitiesSchema } from "./tpEntities";

export interface tPhraseSchema {
    nsp : string;
    intent_id : ObjectID;
    text : string;
    entities : Array<tpEntitiesSchema> ;
    del : boolean;
}