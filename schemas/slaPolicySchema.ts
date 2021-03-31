export interface SLAPolicySchema {
    policyName: string;
    policyDesc: string;
    nsp: string;
    policyTarget: Array<any>;
    policyApplyTo: Array<any>;
    reminderResolution: Array<any>;
    reminderResponse: Array<any>;
    violationResponse: Array<any>;
    violationResolution: Array<any>;
    activated: boolean;
    created: { date: string, by: string };
    lastModified: { date: string, by: string };
}