"use strict";
//Created By Saad Ismail Shaikh 
// 07-08-2018
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotification = void 0;
// import { SessionManager } from "../../globals/server/sessionsManager";
// import { Conversations } from "../../models/conversationModel";
// import { ObjectID } from "bson";
var GCM = require("node-gcm");
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
exports.SendNotification = function (serverKey, recieptants, title, body, data, topic, showNotification) {
    if (topic === void 0) { topic = false; }
    if (showNotification === void 0) { showNotification = true; }
    try {
        // console.log(serverKey);
        var sender = new GCM.Sender(serverKey);
        var message_1 = new GCM.Message({
            priority: 'high',
            timeToLive: (showNotification) ? 2419200 : 5
        });
        var notification = {
            title: title,
            body: body,
            icon: 'ic_launcher',
            tag: recieptants
        };
        if (showNotification) {
            message_1.addNotification(notification);
        }
        Object.keys(data).map(function (key) {
            message_1.addData(key, data[key]);
        });
        //console.log('FCM Message: ');
        //console.log(message);
        var recieptant = (!topic)
            ? (Array.isArray(recieptants)) ? { registrationTokens: recieptants } : { to: encodeURIComponent(recieptants) }
            : { topic: '/topics/' + encodeURIComponent(recieptants) };
        // console.log('Sending Notification');
        // console.log(recieptant);
        // console.log(message);
        sender.sendNoRetry(message_1, recieptant, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
                console.log(err);
                Promise.resolve(undefined);
            }
            else {
                //console.log("Successfully sent with response: ", response)
                Promise.resolve(true);
            }
        });
    }
    catch (error) {
        console.log(error);
        console.log('Error in Senging Push Notification');
        return Promise.resolve(undefined);
    }
};
//# sourceMappingURL=PushNotificationFirebase.js.map