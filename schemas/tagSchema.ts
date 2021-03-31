import { ObjectId } from "bson";

export interface TagSchema{
    nsp : string;
    tags: Array<TagInfoSchema>;
}

export interface TagInfoSchema{
    tag: string,
    agent_list?: Array<AgentListInfo>,
    tag_keywords?: Array<string>
}

export interface AgentListInfo{
    email: string,
    count: number,
    isAdmin: boolean,
    excluded: boolean
}