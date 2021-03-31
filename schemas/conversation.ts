import { ObjectID } from "bson";

//Conversation States:
// 1. Conversation Created But No Agent Assignend
// 2. Conversation Created and Got agent
// 3. Conversation Ended
// 4. Archived
export interface ConversationSchema {

    _id: ObjectID,
    deviceID?: string;
    visitorEmail: string;
    visitorName?: string;
    agentEmail?: string;
    sessionid: string;
    createdOn: string;
    nsp: string;
    viewColor: string;
    state: any;
    messages: Array<any>;
    tickets?: Array<any>; //{ id , subject , createdby , createdDate , clientID  }
    status: string;
    lastMessage: any;
    messageReadCount: number;
    entertained: boolean;
    assigned_to?: [{ email: string, assignedDate: Date, firstResponseTime: Date, avgResponseTime: Date }] | [],
    inactive?: boolean;
    missed?: boolean;
    clientID?: string
}