import { ObjectId } from "bson";
import { ObjectID } from "mongodb";

export interface MessageSchema {
    _id?: ObjectID;
    from: string;
    to: any;
    body: string | Array<MessageBodyAtachment>;
    cid: ObjectId;
    date: string;
    type: string;
    viewColor?: string;
    attachment: boolean;
    filename?: string;
    onlyEmoji?: boolean;
    form?: any;
    sent?: boolean;
    delivered?: boolean;
    visibleTo?: Array<any>;
    chatFormData?: any
}


export interface MessageBodyAtachment {
    path: string,
    filename: string
}