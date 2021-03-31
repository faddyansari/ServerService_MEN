export interface AgentSchema {

    username : string;
    email    : string;
    date     : number;
    time     : any;
    location : string;
    count?    : number;
    ipAddress : string;
    agent_ticketcount?: Array<any>;
}