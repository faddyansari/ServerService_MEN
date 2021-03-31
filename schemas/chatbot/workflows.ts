import { ObjectID } from "mongodb";

export interface WorkFlow {

  name: string;
  form: Array<any>;
  greetingMessage: string;
  nsp: string;
  formHTML: string;
}