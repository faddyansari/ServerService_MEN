//Created By Saad Ismail Shaikh
//Date : 19-1-2018


//Express Module Reference
import * as express from 'express';

// Path Object to Define "Default/Static/Generic" Routes
import * as path from "path";
import { Encryption } from './../helpers/Utils';
import { Tickets } from '../models/ticketsModel';
import { FormDesignerModel } from '../models/FormDesignerModel';
import { TicketMessageSchema } from '../schemas/ticketMessageSchema';
import { EmailService } from '../services/emailService';
import { __biZZC_SQS } from '../actions/aws/aws-sqs';
import { REST_SOCKET_QUEUE } from '../globals/config/constants';
import { SessionManager } from '../globals/server/sessionsManager';
import { VisitorSessionSchema } from '../schemas/VisitorSessionSchema';


// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.

//Router Object Which Will be used to validate requests in Request Handler.
var router: express.Router = express.Router();

const publicPath = path.resolve(__dirname + '/../../');

router.use(async (req, res, next) => {
  // if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
  // console.log('refferer', req.headers.referer);
  // console.log('req URL', req.url);

  let type = ''
  let id = ''
  if (req.headers.authorization) {
    type = req.headers.authorization.split('-')[0]
    id = req.headers.authorization.split('-')[1]
    let session: any = ''
    if (type == 'Agent') session = await SessionManager.GetAgentByID(id)
    else session = (await SessionManager.GetVisitorByID(id) as VisitorSessionSchema)
    if (session) {
      if (req.body.nsp && req.body.nsp != session.nsp) res.status(401).send({ err: 'unauthorized' });
      next();
    }
    else res.status(401).send({ err: 'unauthorized' });
  }
  else res.status(401).send({ err: 'unauthorized' });
  // next();
  // } else {
  //     // console.log('refferer', req.headers.referer);
  //     // console.log('req URL', req.url);

  //     res.status(401).send({ err: 'unauthorized' });
  // }
})

router.post('/getSubmittedFormData', async (req, res) => {

  try {

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


      let form;
      let submittedForm = await FormDesignerModel.GetFormsByID(req.body.formID)
      if (submittedForm && submittedForm.length) {


        submittedForm[0].formFields.forEach(inputs => {
          inputs.submittedData = req.body[inputs.id]
        })


        form = {
          id: submittedForm[0]._id,
          type: submittedForm[0].type,
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
        form: form,
        submittedForm: submittedForm,
        nsp: (submittedForm && submittedForm.length) ? submittedForm[0].nsp : '',
      }



      let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)), message.senderType);
      if (insertedMessage) {

        res.status(200).send({ ticket: insertedMessage, status: 'success' });
        /**
         * @Note : Pub / Sub
         */
        //Push to Pub/Sub
        __biZZC_SQS.SendMessage({ action: 'NewTicketMessage', ticket: insertedMessage.ops[0] }, REST_SOCKET_QUEUE);
        // let socketServer = SocketListener.getSocketServer();
        // let origin = socketServer.of(req.body.nsp);
        // origin.to('Admins').emit('gotNewTicketMessage', { ticket: insertedMessage.ops[0] });
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