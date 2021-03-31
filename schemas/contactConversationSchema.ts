export interface ContactConversationSchema {

    to: string,
    to_name?: string,
    from: string,
    from_name? : string,
    createdOn : any,
    LastUpdated: any,
    messages : Array<any>,
    LastSeen: Array<any>,
    nsp: any;
}