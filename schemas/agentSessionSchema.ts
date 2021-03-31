import { print } from "util";
import { ObjectID } from "mongodb";

export interface AgentSessionSchema {

  socketID: Array<string>;
  agent_id: string;
  nsp: string;
  createdDate: string;
  nickname: string;
  email: string;
  rooms: Object;
  chatCount: number;
  type: string;
  location: Array<string>;
  visitorCount: number;
  role: string;
  acceptingChats: boolean;
  state: string;
  idlePeriod: Array<any>;
  image: string;
  locationCount: any;
  id?: string;
  _id?: string;
  greetingMessage?: string;
  callingState: any;
  expiry?: any;
  isAdmin?: boolean;
  permissions: any;
  groups: any;
  teams: any;
  isOwner : any;
  updated: boolean;
  concurrentChatLimit : number
}