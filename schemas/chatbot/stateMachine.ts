import { ObjectID } from "mongodb";
import { StateSchema } from "./state"

export interface StateMachineSchema {

    name: string;
    states: Array<StateSchema>;
    assignedTo: Array<ObjectID>;
    nsp: string;
}