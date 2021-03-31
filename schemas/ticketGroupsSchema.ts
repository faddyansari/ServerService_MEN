import { ObjectId } from "bson";

export interface TicketGroupSchema {
    nsp: string;
    groups: Array<TicketGroupsinfo>;
}

export interface TicketGroupsinfo {
    group_name: string;
    group_desc: string;
    group_admins: Array<string>
    agent_list?: Array<AgentListInfo>,
}

export interface AgentListInfo{
    email: string,
    count: number,
    isAdmin: boolean,
    excluded: boolean
}

export interface RuleSetSchema {
    nsp: string;
    name: string,
    isActive: boolean;
    operator: string;
    actions: [{ name: string, value: string }];
    conditions: [{ key: string, matchingCriterea: string, regex: string, keywords: string[] }];
    lastmodified: { date: string, by: string }
}

