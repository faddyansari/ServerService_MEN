
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import * as express from "express";

import { Visitor } from "../models/visitorModel";
import { Conversations } from "../models/conversationModel";
import { EmailTest, ARCHIVINGQUEUE } from "../globals/config/constants";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { __BizzC_S3 } from "../actions/aws/aws-s3";
import uuid = require("uuid");
import { SessionManager } from "../globals/server/sessionsManager";
import { AutoAssignFromQueueAuto } from "../actions/ChatActions/AssignChat";
import { Agents } from "../models/agentModel";
import { CreateLogMessage } from "../actions/GlobalActions/CreateMessage";
import { visitorSessions } from "../models/visitorSessionmodel";
import { Company } from "../models/companyModel";
import { EventLogMessages } from "../globals/config/enums";
import { __BIZZ_REST_REDIS_PUB, __BIZZC_REDIS } from "../globals/__biZZCMiddleWare";
import { SQSPacket } from "../schemas/sqsPacketSchema";
import { RedisClient } from "redis";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
import { Tickets } from "../models/ticketsModel";


//Load The Model For The First Time
// if (!Visitor.initialized) {
//     Visitor.Initialize();
// }

let router = express.Router();

// router.use(async (req, res, next) => {
//     if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
//         // console.log('refferer', req.headers.referer);
//         // console.log('req URL', req.url);
//         if (req.headers.origin) {
//             res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
//             res.header("Access-Control-Allow-Headers", "content-type");
//             res.header('Access-Control-Allow-Methods', 'GET');
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.header('Connection', 'keep-alive');
//             res.header('Content-Length', '0');
//             res.header('Vary', 'Origin, Access-Control-Request-Headers');
//         }
//         next();

//     } else {
//         console.log('refferer', req.headers.referer);
//         console.log('req URL', req.url);

//         res.status(401).send({ err: 'unauthorized' });
//     }
// })
router.use(async (req, res, next) => {

  // if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
  // console.log('refferer', req.headers.referer);

  // console.log('req URL', req.url);
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Connection', 'keep-alive');
    res.header('Content-Length', '0');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
  }

  let type = ''
  let id = ''

  if (req.headers.authorization) {

    type = req.headers.authorization.split('-')[0];
    id = req.headers.authorization.split('-')[1];
    let session: any = ''
    if (type == 'Agent') session = await SessionManager.GetAgentByID(id)
    else if (type == 'Visitor') session = true

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


//let visitor = new Visitor();

router.get('/', (req, res) => {
  // var visitor = new Visitor();
  // visitor.insertVisitors();
  // res.send("Record Inserted");
});

//visitor routes irrespective of session

router.post('/checkSID/', async (req, res) => {
  try {
    // console.log('Check SID: ' + req.body.sid);


    res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.body.sid) { res.status(401).send(); return; }
    let result = await __BIZZC_REDIS.Exists(req.body.sid);
    if (result) res.status(200).send({ status: 'ok' });
    else res.status(401).send();

  } catch (error) {
    res.status(401).send();
    console.log(error);
    console.log('error in checkingSID')
  }
});

router.post('/emailtranscript/', async (req, res) => {

  try {
    if (req.headers.origin && req.headers.origin.indexOf('localhost') != -1) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');

      //console.log('emailtranscript');
      //console.log(req.body);

      if (EmailTest) {
        let conversation = await Conversations.getConversationBySid(req.body.cid);
        if (conversation && conversation.length) {
          let company = await Company.GetLogoTranscript(conversation[0].nsp)
          // console.log(company[0].chatSettings)
          await __BizzC_S3.PutObject(uuid.v4().toString(), {
            action: 'sendTranscript',
            messages: conversation[0].messages,
            subject: 'Transcript ' + conversation[0].clientID || conversation[0]._id,
            email: req.body.email,
            id: conversation[0].clientID || conversation[0]._id,
            logo: (company && company.length) ? company[0].settings.chatSettings.transcriptLogo : ''
          })
        }
      }
      res.send({ status: 'ok' });
      return;
    }
    if (!req.body.email || !req.body.cid) {
      res.status(401).send({ status: 'error' });
    } else {
      let conversation = await Conversations.getConversationBySid(req.body.cid);
      let company: any = undefined;
      if (conversation && conversation.length) {
        company = await Company.GetLogoTranscript(conversation[0].nsp)
        // console.log(company[0].chatSettings)
      }
      await __BizzC_S3.PutObject(uuid.v4().toString(), {
        action: 'sendTranscript',
        messages: conversation[0].messages,
        subject: 'Transcript ' + conversation[0].clientID || conversation[0]._id,
        email: req.body.email,
        id: conversation[0].clientID || conversation[0]._id,
        logo: (company && company.length) ? company[0].settings.chatSettings.transcriptLogo : ''

      })
      res.status(200).send({ status: 'ok' });

    }

  } catch (error) {
    console.log(error);
    console.log('Error in Sending Emial Transcript');
  }

});

router.post('/submitSurvey/', async (req, res) => {
  console.log('submitSurvey');
  // console.log(req.body);

  try {

    if (!req.body.feedbackForm || !req.body.survey) {
      res.status(401).send();
    }
    else {
      // && req.headers.origin.indexOf('localhost') != -1
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

      let session = (await SessionManager.GetVisitorByID(req.body.sid));
      if (session) {
        let origin = await Company.getSettings(session.nsp);
        let data = await SessionManager.GetSessionForChat((session._id || session.id) as string)
        res.status(200).send({ status: 'ok' });
        let promises = await Promise.all([
          await SessionManager.RemoveSession(session, true),
          await Conversations.EndChat(session.conversationID, true, (data) ? data : '', req.body.survey),
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id || session._id, }),
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allPopUpWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} }),
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allHelpSupportWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} }),
        ]);
        //socket.to(Visitor.NotifyOne(session)).emit('endChat');
        let updatedConversation = promises[1];
        if (updatedConversation && updatedConversation.value) {
          // if (origin && origin[0]['settings']['chatSettings']['assignments'].aEng && session.agent && session.agent.id) {
          //     let result = await AutoAssignFromQueueAuto(session);
          //     // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'autoQueueAssign', data: session })
          // }
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedConversation.value }, });


          if (updatedConversation && updatedConversation.value && updatedConversation.value.superviserAgents && updatedConversation.value.superviserAgents.length) {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: updatedConversation.value.superviserAgents, data: { conversation: updatedConversation.value }, });
          }

          let packet: SQSPacket = { action: 'endConversation', cid: session.conversationID }
          await __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: updatedConversation.value }, ARCHIVINGQUEUE);
          await __biZZC_SQS.SendMessage(packet, ARCHIVINGQUEUE);
        }
        let endChatMsg;
        //else {
        endChatMsg = {
          from: session.username ? session.username : "",
          to: session.agent ? session.agent : undefined,
          body: '',
          type: "Events",
          cid: session.conversationID ? session.conversationID : "",
          attachment: false,
          date: new Date().toISOString(),
          chatFormData: ''
        };


        if (!req.body.forceEnded) endChatMsg.body = 'Chat ended by ' + session.username

        let endChatMessage = await CreateLogMessage(endChatMsg)
        if (endChatMessage) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: endChatMessage })

          if (req.body.feedbackForm && Object.keys(req.body.feedbackForm).length) {
            setTimeout(async () => {
              let insertedMessage = await CreateLogMessage(req.body.feedbackForm)
              if (session && insertedMessage) {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: insertedMessage });
              }
            }, 0);
          }
        }
        //}
        if (updatedConversation && updatedConversation.value) {

          let event = 'Chat Ended';
          let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (session._id) ? session._id : session.id);

        }
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })

      } else {

        /**
         * @Case_2_3_4
         */

        let session = await visitorSessions.getVisitorSession(req.body.sid);
        if (session && session.length) {
          if (!req.body || !req.body.survey) {
            res.status(200).send({ status: 'ok' });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
          }
          else {
            if (req.body.feedbackForm) {
              let insertedMessage = await CreateLogMessage(req.body.feedbackForm)
            }
            res.status(200).send({ status: 'ok' });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
            let updatedConversation = await Conversations.SubmitSurvey(session[0].conversationID, req.body.survey);
            if (updatedConversation && updatedConversation.value) {


              let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (session[0]._id) ? session[0]._id : session[0].id);
            }
          }
        } else res.status(200).send({ status: 'ok' });
      }



    }
  }
  catch (error) {
    res.status(401).send();
    console.log(error)
  }
});
router.post('/submitSurveyAfterEndChat/', async (req, res) => {
  console.log('submitSurvey');

  try {
    if (!req.body.feedbackForm || !req.body.survey) {
      res.status(401).send();
    }
    else {
      // && req.headers.origin.indexOf('localhost') != -1
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
      // let session = await visitorSessions.getVisitorSession(req.body.sid);
      // if (session && session.length) {

      if (!req.body || !req.body.survey) {
        res.status(200).send({ status: 'error' });
        // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
      }
      else {
        //if (req.body.feedbackForm || req.body.su) {
        let insertedMessage: any;
        if (req.body.feedbackForm) insertedMessage = await CreateLogMessage(req.body.feedbackForm)
        //if (insertedMessage) {
        res.status(200).send({ status: 'ok' });
        // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
        let updatedConversation = await Conversations.SubmitSurvey(req.body.cid, (req.body.survey) ? req.body.survey : {});
        if (updatedConversation && updatedConversation.value) {
          let loggedEvent: any;
          if (req.body.sid) loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (req.body.sid) ? req.body.sid : '');
        }
        //}
        //}
      }
      //} else res.status(200).send({ status: 'ok' });
    }
  }
  catch (error) {
    res.status(401).send();
    console.log(error)
  }
});
// visitor routes end

router.post('/registerUser/:username?/:email?/:location?/:ipAddress?', async (req, res) => {
  //console.log(req.body.username + " " + req.body.email || req.body.location);
  if (!req.body.username || !req.body.email) {
    res.send(new Error('505'));
  }
  else {
    try {
      let exists = await Visitor.visitorExists(req.body.nsp, req.body.email)
      //console.log('Visitor Exists : ' + exists);
      if (!exists) {
        Visitor.insertVisitor(req.body);
        res.send({ message: "Inserted" });
      }
      else { res.send({ message: "Welcome Back " + req.body.username }); }
    } catch (error) { res.send(error); }
  }




});



router.post('/visitorList', async (req, res) => {
  try {

    //

    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let visitors = await SessionManager.sendVisitorList(session)
      res.send(visitors);
    } else {
      res.send([]);
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting visitor list');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getLeftVisitors', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send('Invalid Request!');
    let visitorList = await Visitor.GetLeftVisitors(data.nsp);
    if (visitorList.length) res.send({ status: 'ok', leftVisitors: visitorList });
    else res.send({ status: 'ok', leftVisitors: [] });
  } catch (err) {
    console.log(err);
    console.log('Error in getting left visitors');
    res.status(401).send('Invalid Request!');
  }
})
router.post('/getBannedVisitors', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send('Invalid Request!');
    let bannedVisitorList = await Visitor.GetBannedVisitors(data.nsp);
    if (bannedVisitorList && bannedVisitorList.length) res.send({ status: 'ok', bannedVisitorList: bannedVisitorList });
    else res.send({ status: 'ok', bannedVisitorList: [] });
  } catch (err) {
    console.log(err);
    console.log('Error in getting Banned visitors');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/addCustomer', async (req, res) => {
  try {
    if (!req.body.username || !req.body.email) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let exists = await Visitor.visitorExists(req.body.nsp, req.body.email)
        if (!exists) {
          let visitor = await Visitor.insertVisitor(req.body, req.body.nsp);
          res.send({ message: "Inserted", insertedVisitor: visitor.ops[0] });
        }
        else { res.send({ message: "Exists" }); }
      } catch (error) { res.send(error); }
    }

  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/updateCustomer', async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let exists = await Visitor.visitorExists(req.body.nsp, req.body.email)
        //console.log('Visitor Exists : ' + exists);
        if (exists) {
          let update = await Visitor.UpdateVisitorInfoById(req.body.id, req.body);
          //console.log(update);

          res.send({ message: "Updated", data: update });
        }
        else { res.send({ message: "Customer doesnot exists" }); }
      } catch (error) { res.send(error); }
    }

  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/deleteCustomer', async (req, res) => {
  try {
    if (!req.body.id) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        //let exists = await Visitor.visitorExists(req.body.email)
        //console.log('Visitor Exists : ' + exists);
        //if (exists) {
        let d = await Visitor.DeleteVisitor(req.body.id);
        //console.log(d);
        res.send({ message: "Deleted", data: d });
        //}
        //else { res.send({ message: "Customer doesnot exists" }); }
      } catch (error) { res.send(error); }
    }

  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getVisitorsByFilters', async (req, res) => {
  //console.log(req.body);

  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        //console.log(req.body);

        let visitors = await Visitor.getFilteredVisitors(req.body.nsp, req.body.dateFrom,
          req.body.dateTo, req.body.location, req.body.source, req.body.group, req.body.chunk);
        res.send({ visitorsList: visitors });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getUrlsVisitedCount', async (req, res) => {
  try {
    let sessions = await visitorSessions.getVisitorSessions(req.body.sessions);
    let count = 0;
    let arr: any[] = [];
    sessions.map(session => {
      count = count + session.url.length;
      arr.push({ 'date': session.creationDate.split("T")[0], 'urlCount': session.url.length, 'conversationID': session.conversationID });
    });
    res.send({ count: count, periodicCount: arr });
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/searchCustomers', async (req, res) => {

  try {

    if (!req.body.sessionId) res.status(401).send({ error: 'Unauthorized' });
    let session;
    if (req.body.sessionId) session = await SessionManager.GetAgentByID(req.body.sessionId);;
    if (session) {
      let customers = await Visitor.searchCustomers(req.body.nsp, req.body.keyword, req.body.chunk);

      if (customers && customers.length) res.status(200).send({ customerList: customers });
      else res.status(200).send({ customerList: [] });
    }
    else res.status(401).send({ error: 'Unauthorized' });
  } catch (error) {
    console.log('Error in Search Customers');
    console.log(error);
    res.status(401).send();
  }
})

router.post('/getTotalVisitorsByNsp', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let visitors = await Visitor.getVisitorsCountByNsp(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        res.send({ visitorsList: visitors });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getTrafficByCountry', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let list = await Visitor.getTraffic(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        res.send({ List: list });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getMaxUrls', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let list = await visitorSessions.getMaxUrlsByDate(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        res.send({ List: list });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getAvgTimeSpent', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let list = await visitorSessions.getAvgTimeSpent(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        res.send({ List: list });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getTopRefferers', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let list = await visitorSessions.getRefferers(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        res.send({ List: list });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getTicketsVsChatsRatio', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let ticketsList = await Tickets.getAllTickets(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);
        let chatsList = await Conversations.getAllChats(req.body.nsp, req.body.dateFrom,
          req.body.dateTo);

        res.send({ ticketsList: ticketsList, chatsList: chatsList });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getDeviceIdsByNsp', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let data = await Visitor.getDeviceIDs(req.body.nsp, req.body.chunk);
        res.send({ List: data });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getTrafficByDevice', async (req, res) => {
  try {
    if (!req.body.nsp) {
      res.status(401).send('Invalid Request!');
    }
    else {
      try {
        let traffic = await Visitor.trafficFilterByDeviceId(req.body.nsp, req.body.dateFrom,
          req.body.dateTo, req.body.deviceID);
        res.send({ List: traffic });
      } catch (error) { res.send(error); }
    }
  } catch (err) {
    console.log(err);
    console.log('Error');
    res.status(401).send('Invalid Request!');
  }
});

export const visitorRoutes: express.Router = router;
