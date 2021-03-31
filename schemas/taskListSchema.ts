import { ObjectID } from "bson";


export interface TaskList {
    id:ObjectID;
    todo:Object;
    agent:string;
    completed:boolean;
    datetime:string;
    // important?:boolean
}