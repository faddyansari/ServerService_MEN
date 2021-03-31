import { ObjectID } from "bson";

export interface ActionSchema {
    nsp : string;
    action_name : string;
    endpoint_url: string;
    template: string;
    del : boolean;
}