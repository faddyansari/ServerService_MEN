import { ObjectId, ObjectID } from "bson";

export interface VisitorSessionSchema {

    _id?: string | ObjectID;
    socketID: Array<string>;
    location: string;
    fullCountryName: string;
    country: string;
    ip: string;
    nsp: string;
    creationDate: string | Date;
    url: Array<string>;
    state: number;
    agent: { id: string, image: string, name: string };
    username?: string;
    email?: string;
    type: string;
    expireDate?: string;
    newUser?: boolean;
    conversationID: any;
    typingState: boolean,
    greetingMessageSent?: boolean;
    currentState?: any;
    stateMachine?: any;
    isMobile: boolean;
    id?: string | ObjectID;
    expiry?: Date | undefined;
    callingState: any;
    additionalData?: any;
    carRequestData?: any;
    deviceID?: string;
    referrer?: string;
    selectedAgent?: string;
    returningVisitor?: boolean;
    makeActive: boolean;
    deviceInfo?: {
        name: string,
        os: string,
        version: string,
        product?: string,
        manufacturer?: string
    };
    inactive: boolean;
    lastTouchedTime: string;
    cordinates?: any
    viewColor: any;
    msg?: Array<any>,
    inviteAccepted?: boolean
    phone?: any
    message?: string,
    chatFromUrl?: string,
    previousState?: string;
    stateHistory?: Array<string>;
    secondaryIP? : string;
}