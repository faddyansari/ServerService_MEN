import { MessageSchema } from "../../schemas/messageSchema";
import { InsertOneWriteOpResult } from "mongodb";
import { Conversations } from "../../models/conversationModel";

export async function CreateLogMessage(message: MessageSchema) {

    try {


        // console.log('Create Message Log : ', message);


        let sender: any = undefined;
        let date = new Date();
        let insertedMessage: InsertOneWriteOpResult<any>;
        date = new Date();
        message.date = date.toISOString();
        //data.type = socket.handshake.session.type;
        // data.delivered = true
        // data.sent = false
        insertedMessage = await Conversations.insertMessage(message);

        // let allconvo = await Conversations.UpdateAllLastMessagenByCID(data.cid);
        //console.log("messageinsertedID");
        //console.log(messageinsertedID);
        // allconvo = await Conversations.getConversationBySid(data.cid);
        // console.log(allconvo);

        //await Conversations.abc();
        await Conversations.updateMessageReadCount(message.cid, true);

        if (insertedMessage.insertedCount > 0) {
            return insertedMessage.ops[0];
        } else {
            console.log('Error in Sending Message Message Not Inserted');
        }
        return undefined;

    } catch (error) {
        console.log(error);
        console.log('Error in Creating Message');
        // console.log(session.state);
        return undefined;
    }


}

export async function GetChatBotReplyMessage(body, session, fromVisitor: boolean, form?) {

    return ({
        from: (fromVisitor) ? session.agent.name : "Assistant",
        to: (fromVisitor) ? session.agent : session.username,
        body: body,
        type: (fromVisitor) ? 'Visitors' : "ChatBot",
        cid: session.conversationID ? session.conversationID : "",
        attachment: false,
        date: new Date().toISOString(),
        form: (form) ? form : []
    })
}