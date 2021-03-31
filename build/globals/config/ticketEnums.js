"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedTicketENUM = exports.TicketLogMessages = void 0;
var TicketLogMessages;
(function (TicketLogMessages) {
    TicketLogMessages["STATE_CHANGED"] = "Ticket Marked As ";
    TicketLogMessages["GROUP_ASSIGNED"] = "Group set as ";
    TicketLogMessages["UPDATE_VIEW_STATE"] = "Ticket Set As ";
    TicketLogMessages["AGENT_ASSIGNED"] = "Ticket Assigned to ";
    TicketLogMessages["AGENT_ASSIGNED_ICONN"] = "Ticket Assigned by ICONN Registration to ";
    TicketLogMessages["PRIORITY_CHANGED"] = "Priority set as ";
    TicketLogMessages["WATCHERS_ADDED"] = "Ticket Watchers added ";
    TicketLogMessages["TASK_ADDED"] = "Task added ";
    TicketLogMessages["TAG_ADDED"] = "Tag Entered ";
    TicketLogMessages["NOTE_ADDED"] = "Note Added ";
    TicketLogMessages["PRIMARY_TICKETLOG_DEMERGE"] = "De Merged Ticket ";
    TicketLogMessages["SECONDARY_TICKETLOG_DEMERGE"] = "DeMerged from ";
    TicketLogMessages["PRIMARY_TICKETLOG_MERGE"] = "Merged Tickets ";
    TicketLogMessages["SECONDARY_TICKETLOG_MERGE"] = "Merged into ";
    TicketLogMessages["SNOOZE_ADDED"] = "Ticket snoozed for ";
    TicketLogMessages["EXECUTE_SCENARIO"] = "Scenario Executed ";
    TicketLogMessages["REVERT_SCENARIO"] = "Scenario Reverted ";
    TicketLogMessages["DELETE_NOTE"] = "Note deleted ";
    TicketLogMessages["DELETE_TASK"] = "Task deleted ";
    TicketLogMessages["UPDATE_TASK"] = "Task updated to ";
    TicketLogMessages["DELETE_TAG"] = "Tag deleted ";
    TicketLogMessages["UPDATE_DYNAMIC_FIELD_ICONN"] = "Dynamic field Updated by ICONN Registration to ";
    TicketLogMessages["UPDATE_DYNAMIC_FIELD"] = "Dynamic field Updated ";
    TicketLogMessages["TASK_STATUS_CHANGED"] = "Task ";
    TicketLogMessages["CUSTOMER_REGISTERED"] = "Icon Customer Registered with Customer ID: ";
    TicketLogMessages["UNBIND_ICON_CUSTOMER"] = "Customer unbinded from Customer ID: ";
    TicketLogMessages["UPDATE_STATUS"] = "Status Updated ";
})(TicketLogMessages = exports.TicketLogMessages || (exports.TicketLogMessages = {}));
function ComposedTicketENUM(enumName, options) {
    return {
        title: options.extraPara ? enumName + ' named: ' + options.extraPara : enumName,
        status: options.value,
        time_stamp: new Date().toISOString(),
        updated_by: options.ByextraOptions ? options.by + ' (by ICONN Platform) ' : options.by,
        user_type: 'Agent'
    };
}
exports.ComposedTicketENUM = ComposedTicketENUM;
//# sourceMappingURL=ticketEnums.js.map