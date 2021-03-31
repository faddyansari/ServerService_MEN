import { ObjectID } from "mongodb";

export interface TicketMessageSchema {

    datetime: string;
    nsp: string;
    senderType: string;
    message: string;
    from: string;
    to: string;
    tid: Array<ObjectID>;
    replytoAddress: string;
    attachment?: Array<any>;
    filename?: Array<any>;
    messageId?: Array<string>;
    viewColor: string;
    form?: any;
    survey?:any;
    submittedSurvey?:any;
    submittedForm?: Array<any>;
}
