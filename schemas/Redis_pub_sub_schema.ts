export interface Redis_Pub_Sub_Body {

    action: string;
    data: any;
}

export interface Redis_Pub_Sub_Body_EMIT extends Redis_Pub_Sub_Body {
    to: string;
    broadcast: boolean;
    eventName: PUB_SUB_ACTION_NAME;
    nsp: string;
    roomName: Array<string>;
    excludeSender ?: boolean;
    sockID ?: string;
}


export enum PUB_SUB_EVENT_NAMES {
    EMIT = 'emit',
    DISCONNECT = 'disconnect'
}


export enum PUB_SUB_ACTION_NAME {
    GOT_AGENT = 'gotAgent',
    UPDATE_USER = 'updateUser',
    NEW_CONVERSATION = 'newConversation',
    REMOVE_CONVERSATION = 'removeConversation',
    MAKE_CONVERSATION_ACTIVE = 'makeConversationActive',
    TRANSFER_CHAT = 'transferChat',
    NO_AGENT = 'noAgent',
    UPDATE_COMPANY_INFO = 'updateCompanyInfor',
    CHAT_BOT_TO_AGENT = 'chatBotToAgent',
    NEW_FB_TICKET = 'newFBTicket',
    GOT__NEW_TICKET_MESSAGE = 'gotNewTicketMessage',
    CLOST_ACTION_FORM = 'closeActionForm',
    UPDATE_USER_INFO = 'updateUserInfo',
    NEW_TICKET = 'newTicket',
    ALL_POPUP_WINDOW_CLOSE = 'allPopUpWindowsClose',
    ALL_HELP_SUPPORT_WINDOW_CLOSE = 'allHelpSupportWindowsClose',
    STOP_CONVERSATION = 'stopConversation',
    REMOVE_USER = 'removeUser',
    PRIVATE_MESSAGE = 'privateMessage'

}