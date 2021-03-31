//Created By Saad Ismail Shaikh
//Date : 19-1-2018


//Express Module Reference
import * as express from 'express';

// Path Object to Define "Default/Static/Generic" Routes
import * as path from "path";
import { SessionManager } from '../globals/server/sessionsManager';
import { Encryption } from '../helpers/Utils';
import { VisitorSessionSchema } from '../schemas/VisitorSessionSchema';
import { Agents } from '../models/agentModel';
import { Visitor } from '../models/visitorModel';
import { Conversations } from '../models/conversationModel'
import { ObjectID } from 'bson';
import { MakeActive } from '../actions/GlobalActions/CheckActive';
import { rand, ARCHIVINGQUEUE } from "../globals/config/constants";
import { Tickets } from '../models/ticketsModel';
import { TicketSchema } from '../schemas/ticketSchema';
import { FormDesignerModel } from '../models/FormDesignerModel';
import { TicketMessageSchema } from '../schemas/ticketMessageSchema';
const requestIp = require('request-ip');
import { RuleSetDescriptor } from '../actions/TicketAbstractions/RuleSetExecutor';
import { ticketEmail } from "../globals/config/constants";
import { __biZZC_SQS } from '../actions/aws/aws-sqs';
import { EventLogMessages } from '../globals/config/enums';
import { Company } from '../models/companyModel';
import { __BIZZ_REST_REDIS_PUB } from '../globals/__biZZCMiddleWare';
import { SQSPacket } from '../schemas/sqsPacketSchema';

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
      next()
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

router.post('/convertCannedFormToTicket', async (req, res) => {

  try {

    console.log("convertCannedFormToTicket");

    if (req.headers.origin) {
      // res.header("Access-Control-Allow-Origin", await EmailService.getEmailServiceAddress());
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
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
        tid: [ticket.ticketID],
        attachment: [],
        viewColor: '',
        form: form,
        submittedForm: submittedForm,
        nsp: (submittedForm && submittedForm.length) ? submittedForm[0].nsp : '',
        replytoAddress: ''
      }



      let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)), message.senderType);
      if (insertedMessage) {

        res.status(200).send({ ticket: insertedMessage, status: 'success' });
        (submittedForm && submittedForm.length)
          ? await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: submittedForm[0].nsp, roomName: ['Admins'], data: insertedMessage.ops[0], }) : undefined;
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

//for external forms (other than chat bot)
router.get('/chatForms/:formName?/:csid?', async (req, res) => {
  console.log('chatForms');
  try {

    let clientIp = requestIp.getClientIp(req);
    //if (req.headers.origin != 'http://192.168.20.76:5000' ||  req.headers.origin != 'http://125.209.124.215:5000'|| && req.headers.origin != 'http://192.168.20.58:5000') res.status(401).send();
    //if (clientIp != 'http://192.168.20.76:5000' || clientIp != 'http://125.209.124.215:5000' || clientIp != 'http://192.168.20.58:5000' || clientIp != 'http://localhost') res.status(401).send();
    if (!req.params.formName || !req.params.csid) {
      // res.status(401).send();
      console.log("UNauthorized");

    }
    else {


      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');


      let session: any = await SessionManager.GetVisitorByID((req.params.csid) ? req.params.csid : '');
      let socket;



      let submittedForm = await FormDesignerModel.GetFormsByName(req.params.formName)
      if (submittedForm && submittedForm.length) {
        submittedForm[0].formFields.map(inputs => {
          inputs.submittedData = req.body[inputs.id]

        })
      }


      res.status(200).send({ status: 'success' });


    }
  }
  catch (error) {
    console.log(error)
  }
});

router.post('/registrationForm', async (req, res) => {
  console.log('registrationForm');
  try {

    let clientIp = requestIp.getClientIp(req);
    //if (req.headers.origin != 'http://192.168.20.76:5000' ||  req.headers.origin != 'http://125.209.124.215:5000'|| && req.headers.origin != 'http://192.168.20.58:5000') res.status(401).send();
    //if (clientIp != 'http://192.168.20.76:5000' || clientIp != 'http://125.209.124.215:5000' || clientIp != 'http://192.168.20.58:5000' || clientIp != 'http://localhost') res.status(401).send();
    if (!req.body.form || !req.body.csid) {
      res.status(401).send();


    }
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }



      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');


      let session: any = await SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '');



      let submittedForm: any = await FormDesignerModel.GetFormsByName(req.body.form.formName)

      // if (submittedForm && submittedForm.length) console.log(submittedForm[0].formFields);

      let data: any = {};

      if (submittedForm && submittedForm.length) {
        submittedForm[0].formFields.map(inputs => {
          inputs.submittedData = req.body[inputs.id]
          data[(inputs.fieldName as string).toLowerCase()] = req.body[inputs.id]
        })
      }

      if (data.username && data.email) {
        session = await SessionManager.UpdateUserInformation(session, data) as VisitorSessionSchema;
        await Conversations.UpdateVisitorInfo(session.conversationID, (data.username as string), (data.email as string));
        await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string) });

        //evet for closing form in all windows if submitted from one
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'closeActionForm', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: { status: 'ok' } });


        let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id);
        /**
         * @Note
         * Check If VisitorEventLog is required
         */
        // if (loggedEvent) socket.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);


        let payload = { id: session.id, session: session };
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: payload });
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email } });


        res.status(200).send({ status: 'success', message: 'Credentials Updated' });
      }
      else res.status(200).send({ status: 'failed' });
    }
  }
  catch (error) {
    console.log(error)
    res.status(401).send();
  }
});

router.post('/passwordReset', async (req, res) => {
  console.log('passwordReset');
  try {

    let clientIp = requestIp.getClientIp(req);

    //if (req.headers.origin != 'http://192.168.20.76:5000' ||  req.headers.origin != 'http://125.209.124.215:5000'|| && req.headers.origin != 'http://192.168.20.58:5000') res.status(401).send();
    //if (clientIp != 'http://192.168.20.76:5000' || clientIp != 'http://125.209.124.215:5000' || clientIp != 'http://192.168.20.58:5000' || clientIp != 'http://localhost') res.status(401).send();
    if (!req.body.form || !req.body.csid) {
      res.status(401).send();
      console.log("UNauthorized");

    }
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }



      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let session: any = await SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '');


      let submittedForm: any = await FormDesignerModel.GetFormsByName(req.body.form.formName)
      let data: any = {};
      // if (submittedForm) console.log(submittedForm[0].formFields);
      if (submittedForm && submittedForm.length) {
        submittedForm[0].formFields.map(inputs => {
          inputs.submittedData = req.body[inputs.id]
          data[(inputs.fieldName as string).toLowerCase()] = req.body[inputs.id]
        })
      }

      if (data) res.status(200).send({ status: 'success', message: 'Credentials Updated' });
      else res.status(200).send({ status: 'failed' });


    }
  }
  catch (error) {
    console.log(error)
    res.status(401).send({ status: 'failed' });
  }
});

router.post('/feedBackForm', async (req, res) => {
  console.log('feedBack');
  try {

    let clientIp = requestIp.getClientIp(req);

    //if (req.headers.origin != 'http://192.168.20.76:5000' ||  req.headers.origin != 'http://125.209.124.215:5000'|| && req.headers.origin != 'http://192.168.20.58:5000') res.status(401).send();
    //if (clientIp != 'http://192.168.20.76:5000' || clientIp != 'http://125.209.124.215:5000' || clientIp != 'http://192.168.20.58:5000' || clientIp != 'http://localhost') res.status(401).send();
    if (!req.body.form || !req.body.csid) {
      res.status(401).send();


    }
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }


      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');


      let session: any = await SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '');


      let submittedForm: any = await FormDesignerModel.GetFormsByName(req.body.form.formName)
      let data: any = {};
      // if (submittedForm && submittedForm.length) console.log(submittedForm[0].formFields);
      if (submittedForm && submittedForm.length) {
        submittedForm[0].formFields.map(inputs => {
          inputs.submittedData = req.body[inputs.id]
          data[(inputs.fieldName as string).toLowerCase()] = req.body[inputs.id]
        })
      }

      let email = data.email;
      delete data.email;

      // res.status(200).send({ message: submittedForm, status: 'success' });

      if (session.conversationID) {
        let sessionData = await SessionManager.GetSessionForChat((session._id || session.id) as string)
        let feedBack = await Conversations.EndChat(session.conversationID, true, (sessionData) ? sessionData : '', data);

        if (feedBack && feedBack.value) {
          await __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: feedBack.value }, ARCHIVINGQUEUE);
          let packet: SQSPacket = {
            action: 'endConversation',
            cid: session.conversationID
          }
          await __biZZC_SQS.SendMessage(packet, ARCHIVINGQUEUE);
          res.status(200).send({ status: 'success' });

        }
      }
      else res.status(200).send({ status: 'failed' });



    }
  }
  catch (error) {
    res.status(401).send();
    console.log(error)
  }
});

router.post('/ticket', async (req, res) => {
  console.log('ticketForm');
  try {

    let clientIp = requestIp.getClientIp(req);

    if (!req.body.form || !req.body.csid) {
      res.status(401).send();
    }
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }


      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');


      let session: any = await MakeActive({ id: req.body.csid, _id: req.body.csid } as VisitorSessionSchema);
      if (session) {

        let submittedForm: any = await FormDesignerModel.GetFormsByName(req.body.form.formName)

        // if (submittedForm) console.log(submittedForm[0].formFields);

        let data: any = {};

        if (submittedForm && submittedForm.length) {
          submittedForm[0].formFields.map(inputs => {
            inputs.submittedData = req.body[inputs.id]
            data[(inputs.fieldName as string).toLowerCase()] = req.body[inputs.id]
          })
        }

        let primaryEmail = await Tickets.GetPrimaryEmail(session.nsp);

        if (primaryEmail) {
          let randomColor = rand[Math.floor(Math.random() * rand.length)];
          let ticket: TicketSchema = {
            type: 'email',
            subject: data.subject,
            nsp: session.nsp,
            state: 'OPEN',
            datetime: new Date().toISOString(),
            priority: data.priority,
            from: ticketEmail,
            visitor: {
              name: data.name,
              email: data.email,
              phone: data.phone,
              location: session.country,
              ip: session.ip,
              fullCountryName: session.fullCountryName.toString(),
              url: session.url,
              country: session.country
            },
            lasttouchedTime: new Date().toISOString(),
            viewState: 'UNREAD',
            ticketlog: [],
            mergedTicketIds: [],
            viewColor: randomColor,
            group: "",
            assigned_to: "",
            slaPolicy: {
              reminderResolution: false,
              reminderResponse: false,
              violationResponse: false,
              violationResolution: false
            },
            assignmentList: []
            // slaPolicyEnabled: true
          };

          if (data.phone && data.email) {
            let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });
          }

          ticket = await RuleSetDescriptor(ticket);

          if (ticket.assigned_to) {
            ticket.assignmentList = [
              {
                assigned_to: ticket.assigned_to,
                assigned_time: ticket.first_assigned_time,
                read_date: ''
              }
            ]
          }
          let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
          // console.log(insertedTicket);

          let ticketId: ObjectID | undefined;
          (insertedTicket && insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId as ObjectID : undefined;

          if (ticketId) {
            let message: TicketMessageSchema = {
              datetime: new Date().toISOString(),
              nsp: session.nsp,
              senderType: 'Visitor',
              message: data.message,
              from: data.email,
              to: session.nsp,
              tid: [ticketId],
              attachment: [],
              viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : '',
              replytoAddress: data.email
            };
            let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
            if (insertedMessage && insertedMessage.insertedCount &&
              insertedTicket && insertedTicket.insertedCount) {

              let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.TICKET_SUBMITTED, (session._id) ? session._id : session.id);
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: ['ticketAdmin'], data: insertedTicket.ops[0] });
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: session.nsp, roomName: [ticket.group], data: insertedTicket.ops[0] });

              res.status(200).send({ status: 'success' });

            } else res.status(200).send({ status: 'failed' });
          } else res.status(200).send({ status: 'failed' });
        } else res.status(200).send({ status: 'failed' });
      } else res.status(401).send({ status: 'failed' });



    }
  }
  catch (error) {
    res.status(401).send();
    console.log(error)
  }
});

export const formActionRoutes: express.Router = router;