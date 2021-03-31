import { ObjectId } from "bson";

export interface EventLogSchema {
    event: any
    sessionid: ObjectId;
    time_stamp: string;
}