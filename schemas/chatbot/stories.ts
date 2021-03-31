import { ObjectID } from "bson";

export interface StorySchema {
    nsp : string;
    story_name : string;
    intents: Array<intent_respFunc>;
    del : boolean;
}

export interface intent_respFunc{
    intent_id: ObjectID,
    respFuncs : Array<any>
    actions : Array<any>
}