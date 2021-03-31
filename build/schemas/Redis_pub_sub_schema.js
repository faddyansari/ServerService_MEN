"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUB_SUB_ACTION_NAME = exports.PUB_SUB_EVENT_NAMES = void 0;
var PUB_SUB_EVENT_NAMES;
(function (PUB_SUB_EVENT_NAMES) {
    PUB_SUB_EVENT_NAMES["EMIT"] = "emit";
    PUB_SUB_EVENT_NAMES["DISCONNECT"] = "disconnect";
})(PUB_SUB_EVENT_NAMES = exports.PUB_SUB_EVENT_NAMES || (exports.PUB_SUB_EVENT_NAMES = {}));
var PUB_SUB_ACTION_NAME;
(function (PUB_SUB_ACTION_NAME) {
    PUB_SUB_ACTION_NAME["GOT_AGENT"] = "gotAgent";
    PUB_SUB_ACTION_NAME["UPDATE_USER"] = "updateUser";
    PUB_SUB_ACTION_NAME["NEW_CONVERSATION"] = "newConversation";
    PUB_SUB_ACTION_NAME["REMOVE_CONVERSATION"] = "removeConversation";
    PUB_SUB_ACTION_NAME["MAKE_CONVERSATION_ACTIVE"] = "makeConversationActive";
    PUB_SUB_ACTION_NAME["TRANSFER_CHAT"] = "transferChat";
    PUB_SUB_ACTION_NAME["NO_AGENT"] = "noAgent";
    PUB_SUB_ACTION_NAME["UPDATE_COMPANY_INFO"] = "updateCompanyInfor";
    PUB_SUB_ACTION_NAME["CHAT_BOT_TO_AGENT"] = "chatBotToAgent";
    PUB_SUB_ACTION_NAME["NEW_FB_TICKET"] = "newFBTicket";
    PUB_SUB_ACTION_NAME["GOT__NEW_TICKET_MESSAGE"] = "gotNewTicketMessage";
    PUB_SUB_ACTION_NAME["CLOST_ACTION_FORM"] = "closeActionForm";
    PUB_SUB_ACTION_NAME["UPDATE_USER_INFO"] = "updateUserInfo";
    PUB_SUB_ACTION_NAME["NEW_TICKET"] = "newTicket";
    PUB_SUB_ACTION_NAME["ALL_POPUP_WINDOW_CLOSE"] = "allPopUpWindowsClose";
    PUB_SUB_ACTION_NAME["ALL_HELP_SUPPORT_WINDOW_CLOSE"] = "allHelpSupportWindowsClose";
    PUB_SUB_ACTION_NAME["STOP_CONVERSATION"] = "stopConversation";
    PUB_SUB_ACTION_NAME["REMOVE_USER"] = "removeUser";
    PUB_SUB_ACTION_NAME["PRIVATE_MESSAGE"] = "privateMessage";
})(PUB_SUB_ACTION_NAME = exports.PUB_SUB_ACTION_NAME || (exports.PUB_SUB_ACTION_NAME = {}));
//# sourceMappingURL=Redis_pub_sub_schema.js.map