import * as express from "express";

import { TicketSchema } from "../schemas/ticketSchema"
import { Tickets } from "../models/ticketsModel"
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";

//Load The Model For The First Time
// if (!Visitor.initialized) {
//     Visitor.Initialize();
// }

let router = express.Router();

router.use((req, res, next) => {
    if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Connection', 'keep-alive');
        res.header('Content-Length', '0');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    next();
})

router.post('/notification', (req, res) => {

    console.log("POST /ticketFB/notification");

    // console.log('req')
    // console.log(req.body)

    let company = req.body.company;
    let events = req.body.changes;
    // create object to sent events to frontend

    events.forEach(async event => {

        console.log('event')
        console.log(event)

        // GOTO: store the user facebook information: email and name, picture

        // FIND OUT THE TYPE OF EVENT and ACT accordingly
        // page post -> create ticket
        // if (event.field == "feed" && event.value.item == "post") {

        if (event.field == "feed") {
            // let ticket = {
            //     "_id": '1231237152361253712',
            //     "datetime": new Date().toISOString(),
            //     "lasttouchedTime": new Date().toISOString(),
            //     "nsp": "/localhost.com",
            //     "mergedTicketIds": [],
            //     "agentName": "",
            //     "from": "abc@gmail.com",
            //     "state": "OPEN",
            //     "source": "email",
            //     "ticketlog": [{ "title": "Assigned To Group", "status": "OPEN", "updated_by": "Rule Dispatcher", "user_type": "Agent", "time_stamp": "2019-11-08T10:11:20.216Z" }],
            //     "createdBy": "Visitor",
            //     "viewState": "UNREAD",
            //     "type": "email",
            //     "group": "Congo",
            //     "viewColor": "#F58758",
            //     "visitor": { "name": "no reply", "email": "no-reply@sbtjapan.com" },
            //     "subject": "[From Mobile] Cotation pour LAND ROVER RANGE ROVER SPORT 2007 DR CONGO - LHD French"
            // }
            // // let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
            // // if (insertedTicket) {
            var randomColor = "#00000070".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
            // let ticket: TicketSchema = {
            //     type: 'facebook_post',
            //     subject: 'Inquiry From Facebook Page',
            //     nsp: company.name,
            //     state: 'FACEBOOK',
            //     datetime: new Date().toISOString(),
            //     visitor: {
            //         name: event.value.from.name,
            //         fbID: event.value.from.id
            //     },
            //     lasttouchedTime: new Date().toISOString(),
            //     viewState: 'UNREAD',
            //     ticketlog: [],
            //     mergedTicketIds : [],
            //     viewColor: randomColor
            // };
            let ticket: TicketSchema = {
                "datetime": new Date().toISOString(),
                "lasttouchedTime": new Date().toISOString(),
                "nsp": company.name,
                "mergedTicketIds": [],
                "agentName": "",
                "from": event.value.from.id,
                "state": "OPEN",
                "source": "facebook",
                "ticketlog": [],
                "createdBy": "Visitor",
                "viewState": "UNREAD",
                "type": "facebook",
                "group": "",
                "assigned_to": "",
                "viewColor": randomColor,
                "visitor": { name: event.value.from.name, "email": event.value.from.id },
                "subject": "Inquiry from facebook",
                "slaPolicy": {
                    reminderResolution: false,
                    reminderResponse: false,
                    violationResponse: false,
                    violationResolution: false
                },
                assignmentList: []
            };

            let createTicketOp = await Tickets.CreateTicket(ticket);

            console.log('createTicketOp')
            console.log(createTicketOp)

            // success
            if (createTicketOp && createTicketOp.result && createTicketOp.result.n == 1) {
                // link to ticket object
                let tid = createTicketOp.ops[0]._id;
                // let tmessage: TicketMessageSchema = {
                //     datetime: new Date().toISOString(),
                //     senderType: 'Facebook Visitor',
                //     message: event.value.message,
                //     from: event.value.from.id,
                //     to: company.name,
                //     tid: [tid],
                //     attachment:[]
                // };
                let ticketMessage = {
                    "datetime": new Date().toISOString(),
                    "from": event.value.from.id,
                    "message": event.value.message,
                    "messageId": [],
                    "senderType": "Visitor",
                    "tid": tid,
                    "to": "beedesk@sbtjapan.bizzchats.com",
                    "attachment": [],
                    "replytoAddress": "",
                    "viewColor": randomColor,
                    "nsp": company.name
                }

                let createMessageOp = await Tickets.InsertMessage(ticketMessage);
                // success
                if (createMessageOp && createMessageOp.result && createMessageOp.result.n == 1) {
                    // update view
                    await __BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'A',
                        broadcast: false,
                        eventName: 'newFBTicket',
                        nsp: company.name,
                        roomName: [ticket.group],
                        data: { ticket: createTicketOp.ops[0], company: company }
                    });


                    return;
                }
                else {
                    console.log("Error in creating ticket message")
                }
            }
            else {
                console.log("Error in creating ticket");
                return;
            }
        }
        // In case a conversation notification is sent
        // else if (event.field == "conversations") {
        //     console.log('conversations')
        //     console.log(event)
        //     var randomColor = "#00000070".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        //     let ticket: TicketSchema = {
        //         type: 'facebook_message',
        //         subject: 'Message From Facebook Page',
        //         nsp: company.name,
        //         state: 'FACEBOOK',
        //         datetime: new Date().toISOString(),
        //         visitor: {},
        //         lasttouchedTime: new Date().toISOString(),
        //         viewState: 'UNREAD',
        //         ticketlog: [],
        //         mergedTicketIds : [],
        //         viewColor: randomColor
        //     };

        //     let createTicketOp = await Tickets.CreateTicket(ticket);

        //     console.log('createTicketOp')
        //     console.log(createTicketOp)

        //     // success
        //     if (createTicketOp && createTicketOp.result && createTicketOp.result.n == 1) {
        //         // link to ticket object
        //         let tid = createTicketOp.ops[0]._id;
        //         let tmessage: TicketMessageSchema = {
        //             datetime: new Date().toISOString(),
        //             senderType: 'Facebook Visitor',
        //             message: '',
        //             from: '',
        //             to: company.name,
        //             tid: [tid],
        //             attachment:[]
        //         };

        //         let createMessageOp = await Tickets.InsertMessage(tmessage);
        //         // success
        //         if (createMessageOp && createMessageOp.result && createMessageOp.result.n == 1) {
        //             // update view
        //             origin.to('Admins').emit('newFBTicket', {
        //                 ticket: createTicketOp.ops[0],
        //                 company: company
        //             });
        //             return;
        //         }
        //         else {
        //             console.log("Error in creating ticket message")
        //         }
        //     }
        //     else {
        //         console.log("Error in creating ticket");
        //         return;
        //     }

        // }
        else {
            console.log("Unable to recognise event. Abort handling.")
        }

    });




});


export const FBRoutes: express.Router = router;