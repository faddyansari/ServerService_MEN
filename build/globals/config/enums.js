"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedENUM = exports.DynamicEventLogs = exports.EventLogMessages = void 0;
var EventLogMessages;
(function (EventLogMessages) {
    EventLogMessages["ENDCHAT"] = "Chat Ended";
    EventLogMessages["CHAT_INITIATED"] = "Chat Initiated";
    EventLogMessages["VISITOR_INVITED"] = "Visitor Invited To Chat";
    EventLogMessages["REQUEST_FROM_QUEUE"] = "Visitor Requested from Queued state";
    EventLogMessages["VISITOR_CREDENTIALS_UPDATED"] = "Visitor Credentials Updated";
    EventLogMessages["TICKET_SUBMITTED"] = "Ticket Submitted";
    EventLogMessages["CHAT_TRANSFERED"] = "Chat Transferred";
    EventLogMessages["USER_UPDATED_INFORMATION"] = "User Information Updated";
    EventLogMessages["GOT_ADDITIONAL_DATA"] = "Got Additional Data";
    EventLogMessages["GOT_REQUEST_CAR_DATA"] = "Got Requested Car Data";
    EventLogMessages["CHAT_CONVERTED_TO_TICKET"] = "Chat Converted To Ticket";
    EventLogMessages["VISITOR_CONNECTED"] = "Visitor Connected";
    EventLogMessages["VISITOR_MARKED_INACTIVE_FROM_BROWSING"] = "Visitor Marked Inactive from Browsing state";
    EventLogMessages["VISITOR_INACTIVE_FROM_QUEUE"] = "Visitor Went Inactive from Unassigned chat.";
})(EventLogMessages = exports.EventLogMessages || (exports.EventLogMessages = {}));
var DynamicEventLogs;
(function (DynamicEventLogs) {
    DynamicEventLogs[DynamicEventLogs["CHAT_AUTO_ASSIGNED_TO"] = 1] = "CHAT_AUTO_ASSIGNED_TO";
    DynamicEventLogs[DynamicEventLogs["CHAT_AUTO_TRANSFERED"] = 2] = "CHAT_AUTO_TRANSFERED";
    DynamicEventLogs[DynamicEventLogs["VISITOR_UNASSIGNED"] = 3] = "VISITOR_UNASSIGNED";
    DynamicEventLogs[DynamicEventLogs["CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT"] = 4] = "CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT";
    DynamicEventLogs[DynamicEventLogs["CHAT_RE_ASSIGNED"] = 5] = "CHAT_RE_ASSIGNED";
    DynamicEventLogs[DynamicEventLogs["AGENT_TRANSFERED"] = 6] = "AGENT_TRANSFERED";
    DynamicEventLogs[DynamicEventLogs["VISITOR_STATE_CHANGED"] = 7] = "VISITOR_STATE_CHANGED";
    DynamicEventLogs[DynamicEventLogs["VISITOR_INVITED_INACTIVE"] = 8] = "VISITOR_INVITED_INACTIVE";
    DynamicEventLogs[DynamicEventLogs["VISITOR_AUTO_ASSIGNED_FROM_QUEUE"] = 9] = "VISITOR_AUTO_ASSIGNED_FROM_QUEUE";
    DynamicEventLogs[DynamicEventLogs["VISITOR_CHATTING_INACTIVE"] = 10] = "VISITOR_CHATTING_INACTIVE";
    DynamicEventLogs[DynamicEventLogs["VISITOR_ASSIGNED_UNASSIGNED_NO_RESPONSE"] = 11] = "VISITOR_ASSIGNED_UNASSIGNED_NO_RESPONSE";
    DynamicEventLogs[DynamicEventLogs["VISITOR_TRANSFERED_NO_RESPONSE"] = 12] = "VISITOR_TRANSFERED_NO_RESPONSE";
})(DynamicEventLogs = exports.DynamicEventLogs || (exports.DynamicEventLogs = {}));
function ComposedENUM(enumName, options) {
    var oldEmail = (options.oldEmail) ? 'from ' + options.oldEmail : '';
    switch (enumName) {
        case DynamicEventLogs.CHAT_AUTO_ASSIGNED_TO:
            return "Chat auto Assigned to " + options.newEmail;
        case DynamicEventLogs.CHAT_AUTO_TRANSFERED:
            return "Chat auto transferred to " + options.newEmail + " " + oldEmail;
        case DynamicEventLogs.VISITOR_UNASSIGNED:
            return "Visitor Assigned to " + options.oldEmail + " is now Unassigned";
        case DynamicEventLogs.CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT:
            return "Chat auto Assigned to " + options.newEmail + " " + oldEmail;
        case DynamicEventLogs.CHAT_RE_ASSIGNED:
            return "Chat Re-assigned to " + options.newEmail;
        case DynamicEventLogs.AGENT_TRANSFERED:
            return options.oldEmail + " Transfered Chat to " + options.newEmail;
        case DynamicEventLogs.VISITOR_STATE_CHANGED:
            return "Visitor State Changed from " + options.oldstate + " to " + options.newstate;
        case DynamicEventLogs.VISITOR_INVITED_INACTIVE:
            return "Visitor Invited By " + options.name + " Marked Inactive";
        case DynamicEventLogs.VISITOR_AUTO_ASSIGNED_FROM_QUEUE:
            return "Visitor Auto Assigned from Queued state to " + options.newEmail;
        case DynamicEventLogs.VISITOR_CHATTING_INACTIVE:
            return "Visitor chatting to " + options.name + " went Inactive";
        case DynamicEventLogs.VISITOR_ASSIGNED_UNASSIGNED_NO_RESPONSE:
            return "Visitor Assigned to " + options.name + " is now Unassigned due to no response in " + options.mins + " minutes.";
        case DynamicEventLogs.VISITOR_TRANSFERED_NO_RESPONSE:
            return "Chat auto transferred to " + options.newEmail + " " + options.oldEmail + " due to no reply in ' " + options.mins + " minutes.";
    }
}
exports.ComposedENUM = ComposedENUM;
//# sourceMappingURL=enums.js.map