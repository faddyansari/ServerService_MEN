export interface TicketEnumOptions {
    value: any;
    time_stamp?: any;
    by: string;
    extraPara?: string;
    ByextraOptions ? :string;
}
export enum TicketLogMessages {

    STATE_CHANGED = 'Ticket Marked As ',
    GROUP_ASSIGNED = 'Group set as ',
    UPDATE_VIEW_STATE = 'Ticket Set As ',
    AGENT_ASSIGNED = 'Ticket Assigned to ',
    AGENT_ASSIGNED_ICONN = 'Ticket Assigned by ICONN Registration to ',
    PRIORITY_CHANGED = 'Priority set as ',
    WATCHERS_ADDED = 'Ticket Watchers added ',
    TASK_ADDED = 'Task added ',
    TAG_ADDED = 'Tag Entered ',
    NOTE_ADDED = 'Note Added ',
    PRIMARY_TICKETLOG_DEMERGE = 'De Merged Ticket ',
    SECONDARY_TICKETLOG_DEMERGE = 'DeMerged from ',
    PRIMARY_TICKETLOG_MERGE = 'Merged Tickets ',
    SECONDARY_TICKETLOG_MERGE = 'Merged into ',
    SNOOZE_ADDED = 'Ticket snoozed for ',
    EXECUTE_SCENARIO = 'Scenario Executed ',
    REVERT_SCENARIO = 'Scenario Reverted ',
    DELETE_NOTE = 'Note deleted ',
    DELETE_TASK = 'Task deleted ',
    UPDATE_TASK = 'Task updated to ',
    DELETE_TAG = 'Tag deleted ',
    UPDATE_DYNAMIC_FIELD_ICONN = 'Dynamic field Updated by ICONN Registration to ',
    UPDATE_DYNAMIC_FIELD = 'Dynamic field Updated ',
    TASK_STATUS_CHANGED = 'Task ',
    CUSTOMER_REGISTERED = 'Icon Customer Registered with Customer ID: ',
    UNBIND_ICON_CUSTOMER = 'Customer unbinded from Customer ID: ',
    UPDATE_STATUS = 'Status Updated ',

}





export function ComposedTicketENUM(enumName: string, options: TicketEnumOptions) {
    return {
        title: options.extraPara ? enumName + ' named: ' + options.extraPara : enumName,
        status: options.value,
        time_stamp: new Date().toISOString(),
        updated_by: options.ByextraOptions ? options.by + ' (by ICONN Platform) ' : options.by,
        user_type: 'Agent'
    }
}