export interface TicketScenarioSchema {
    scenarioName: string;
    scenarioDesc: string;
    actions: Array<any>;
    nsp: string;
    availableFor: string;
    groupName?: Array<any>;
    created: { date: string, by: string };
    lastModified: { date: string, by: string };
}