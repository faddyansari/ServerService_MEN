import { CaseSchema } from "./case"
import { ObjectID } from "mongodb";

export interface Handler {
    caseId: ObjectID | string;
    action: string;
    transition? : string;
    expression ? : RegExp;
    responseText : string;
}