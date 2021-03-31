import { ObjectID } from "mongodb";

export interface CaseSchema {

    nsp: string;
    tagName: string;
    matchingCriteria : string;
    criteria : string;
    expression: string;
    responseText : string;
    assignedTo: Array<ObjectID>;
}