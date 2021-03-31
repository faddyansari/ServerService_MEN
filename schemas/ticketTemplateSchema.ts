export interface TicketTemplateSchema {
    templateName: string;
    templateDesc: string;
    nsp: string;
    availableFor: string;
    groupName?:Array<any>
    priority: string;
    group: string;
    subject: string;
    status: string;
    cannedForm: any;
    message: boolean;
    tags:Array<string>;
    agent:Object;
    created: { date: string, by: string };
    lastModified: { date: string, by: string };
}