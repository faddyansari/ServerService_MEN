//Created By Saad Ismail Shaikh
//Date : 19-1-2018


//Express Module Reference
import * as express from 'express';

// Path Object to Define "Default/Static/Generic" Routes
import * as path from "path";
import { Encryption } from './../helpers/Utils';
import { Tickets } from '../models/ticketsModel';
import { TicketMessageSchema } from '../schemas/ticketMessageSchema';
import { EmailService } from './../services/emailService'
import { FeedBackSurveyModel } from '../models/FeedBackSurveyModel';
import { __BIZZ_REST_REDIS_PUB } from '../globals/__biZZCMiddleWare';


// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.

//Router Object Which Will be used to validate requests in Request Handler.
var router: express.Router = express.Router();

const publicPath = path.resolve(__dirname + '/../../');

router.post('/getFeedbackSurveyData', async (req, res) => {

    try {
        console.log("request data", req.body);

        if (req.headers.origin) {
            res.header("Access-Control-Allow-Origin", await EmailService.getEmailServiceAddress());
            res.header("Access-Control-Allow-Headers", "content-type");
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Connection', 'keep-alive');
            res.header('Content-Length', '0');
            res.header('Vary', 'Origin, Access-Control-Request-Headers');

            let encryptionClass = new Encryption()
            let ticketInfo = await encryptionClass.decrypt(req.body.ticketInfo);


            ticketInfo = ticketInfo.split('-');

            let ticket = {
                from: ticketInfo[0],
                to: ticketInfo[1],
                ticketID: ticketInfo[2]
            }


            let survey;
            let submittedSurvey = await FeedBackSurveyModel.getActivatedSurvey()
            if (submittedSurvey && submittedSurvey.length) {


                submittedSurvey[0].formFields.forEach(inputs => {
                    inputs.submittedData = req.body[inputs.id]
                })


                survey = {
                    id: submittedSurvey[0]._id,
                    type: submittedSurvey[0].type,
                }
            }


            let message: TicketMessageSchema = {
                datetime: new Date().toISOString(),
                senderType: 'Visitor',
                message: '',
                from: ticket.from,
                to: ticket.to,
                replytoAddress: ticket.from,
                tid: [ticket.ticketID],
                attachment: [],
                viewColor: '',
                survey: survey,
                submittedSurvey: submittedSurvey,
                nsp: (submittedSurvey && submittedSurvey.length) ? submittedSurvey[0].nsp : '',
            }

            let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)), message.senderType);
            if (insertedMessage) {

                res.status(200).send({ ticket: insertedMessage, status: 'success' });
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: req.body.nsp, roomName: ['Admins'], data: insertedMessage.ops[0] });
            }
            else
                res.status(401).send({ status: 'failed' });

        }
        else res.status(401).send()
    } catch (error) {

        res.status(401).send()
        console.log(error)
    }


});

export const cannedFormRoutes: express.Router = router;