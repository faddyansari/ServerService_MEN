import { ObjectID } from "mongodb";

export interface AssignmentRuleSchema {
    _id: ObjectID,
    nsp: string,
    ruleName: string,
    key: any,
    value: any,
    type : any,
    operator : string,
    createdBy: boolean,
    createdOn : string,
    priority?: boolean,
    ruleSetsReferenced?: Array<string>,
    
}