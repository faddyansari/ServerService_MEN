//Created By Saad Ismail Shaikh 
// 07-08-2018

// import { SessionManager } from "../../globals/server/sessionsManager";
// import { Conversations } from "../../models/conversationModel";
// import { ObjectID } from "bson";

import * as GCM from "node-gcm";


//See Schemas For Reference
//Visitor = VisitorSession
//Agents = AgentSession

/** 
 * @DATA
 * Recieptant could be 
 * Topic or 
 * SingleDevice or 
 * GroupOFDevices
 * **/

export const SendNotification = (serverKey: string, recieptants: string | Array<string>, title: string, body: string, data: any, topic = false, showNotification = true) => {
    try {
        // console.log(serverKey);
        
        let sender = new GCM.Sender(serverKey);
        let message = new GCM.Message({
            priority: 'high',
            timeToLive: (showNotification) ? 2419200 : 5
        });


        let notification: GCM.INotificationOptions = {
            title: title,
            body: body,
            icon: 'ic_launcher',
            tag: recieptants as string
        }
        if (showNotification) {
            message.addNotification(notification); 
        }

        Object.keys(data).map(key => {
            message.addData(key, data[key]);
        });

        //console.log('FCM Message: ');
        //console.log(message);

        let recieptant: GCM.IRecipient | Array<string> =
            (!topic)
                ? (Array.isArray(recieptants)) ? { registrationTokens: recieptants } : { to: encodeURIComponent(recieptants) as string }
                : { topic: '/topics/' + encodeURIComponent(recieptants as string) }

        // console.log('Sending Notification');
        // console.log(recieptant);
        // console.log(message);

        sender.sendNoRetry(message, recieptant, (err, response) => {
            if (err) {
                console.log("Something has gone wrong!")
                console.log(err);
                Promise.resolve(undefined);
            } else {
                //console.log("Successfully sent with response: ", response)
                Promise.resolve(true);
            }
        });

    } catch (error) {
        console.log(error);
        console.log('Error in Senging Push Notification');
        return Promise.resolve(undefined);
    }
}
