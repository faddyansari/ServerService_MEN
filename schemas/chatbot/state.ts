import { CaseSchema } from "./case"
import { ObjectID } from "mongodb";
import { Handler } from "./handlers";

export interface StateSchema {

    name : string;
    handlers : Array<Handler>;
}