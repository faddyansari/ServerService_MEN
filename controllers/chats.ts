import * as express from "express";
import { Conversations } from "../models/conversationModel";
import { SessionManager } from "../globals/server/sessionsManager";
import { Company } from "../models/companyModel";
import { MakeActive } from "../actions/GlobalActions/CheckActive";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
import { ObjectID } from "mongodb";
import { Agents } from "../models/agentModel";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { EventLogMessages, ComposedENUM, DynamicEventLogs } from "../globals/config/enums";
import { Visitor } from "../models/visitorModel";
import { Utils } from "../actions/agentActions/Utils";
import { CreateLogMessage, GetChatBotReplyMessage } from "../actions/GlobalActions/CreateMessage";
import { AgentSessionSchema } from "../schemas/agentSessionSchema";
import { __BIZZ_REST_REDIS_PUB, __BIZZC_REDIS } from "../globals/__biZZCMiddleWare";
import { WidgetMarketingModel } from "../models/widgetMarketingModel";
import { WorkFlowsModel } from "../models/ChatBot/workflowModel";
import { Tickets } from "../models/ticketsModel";
import { TicketSchema } from "../schemas/ticketSchema";
import { rand, ticketEmail, ARCHIVINGQUEUE } from "../globals/config/constants";
import { RuleSetDescriptor } from "../actions/TicketAbstractions/RuleSetExecutor";
import { TicketMessageSchema } from "../schemas/ticketMessageSchema";
import { AutoAssignFromQueueAuto, AssignChatToVisitorAuto } from "../actions/ChatActions/AssignChat";
import { FormDesignerModel } from "../models/FormDesignerModel";
import { visitorSessions } from "../models/visitorSessionmodel";
import { ChatToTicket } from "../actions/TicketAbstractions/missedChatToTicket";
import { ApplyRuleSets } from "../actions/ChatActions/AssignmentRuleSetDispatcher";
import { SQSPacket } from "../schemas/sqsPacketSchema";
import { CustomDispatcherForPanel, IconnDispatcher } from "../actions/TicketAbstractions/TicketDispatcher";
import { EmailService } from "../services/emailService";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import * as request from 'request-promise';
import { Stock } from "../models/stockModel";
import { performance } from "perf_hooks";


let router = express.Router();

/* #region  Chats */
router.use(async (req, res, next) => {
  // if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
  //console.log('referer', req.headers.referer);
  //console.log('req URL', req.url);

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
  //   console.log('refferer', req.headers.referer);
  //   console.log('req URL', req.url);

  //   res.status(401).send({ err: 'unauthorized' });
  // }
})
router.post('/getConversations', async (req, res) => {

  try {
    let data = req.body;
    if (!data.email || !data.nsp) res.status(401).send("Invalid Request!");
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    // if (session) console.log(session.permissions.agents.canAccessBotChats);

    let conversations = await Conversations.getConversations(data.email, 'self', data.nsp, (session) ? session.permissions.agents.canAccessBotChats : false);
    let SuperVisedConversations;

    SuperVisedConversations = (session && session.permissions.agents.chatSuperVision) ? (await Conversations.getSupervisedConversation(data.email, data.nsp, session._id)) : '';
    if (conversations && conversations.length) {
      if (SuperVisedConversations && SuperVisedConversations.length) {
        conversations = conversations.concat(SuperVisedConversations)
      }
      for (let conversation of conversations) {
        let temp = await Conversations.getMessages(conversation._id);
        conversation.messages = (temp.length) ? temp : [];
      }
    }
    // if (conversations) console.log('conversations', conversations.length)
    res.send({ conversations: conversations, ended: (conversations && conversations.length < 20) ? true : false });

  } catch (err) {
    console.log(err);
    console.log('Error in get conversations');
    res.status(401).send('Invalid request');
  }

});
router.post('/getArchives', async (req, res) => {
  try {
    let data = req.body
    if (!data.email || !data.nsp) res.status(401).send("Invalid Request!");
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let chatPermissions = session.permissions.chats;
      let archives = await Conversations.getArchives(session.email, chatPermissions.canView, data.filters, session.nsp, undefined, data.query);
      if (data.query && data.query.length) {
        res.send({ status: 'ok', archives: archives, ended: true });
      } else {
        res.send({ status: 'ok', archives: archives, ended: (archives && archives.length < 20) ? true : false })
      }
    } else {
      res.send({ status: 'error' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get archives');
    res.status(401).send("Invalid Request!");
  }

});
router.post('/getMoreArchives', async (req, res) => {
  try {
    let data = req.body;

    if (!data.email || !data.nsp) res.status(401).send("Invalid Request!");
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let chatPermissions = session.permissions.chats;
      let archives = await Conversations.getArchives(session.email, chatPermissions.canView, data.filters, session.nsp, data.chunk);
      res.send({ status: 'ok', archives: archives, ended: (archives && archives.length < 20) ? true : false })
    } else {
      res.send({ status: 'error' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get more archives');
    res.status(401).send("Invalid Request!");
  }

});
router.post('/getMoreinboxChats', async (req, res) => {
  try {
    let data = req.body;


    if (!data.email || !data.nsp) res.status(401).send("Invalid Request!");
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    let conversations = await Conversations.getConversations(data.email, 'self', data.nsp, (session) ? session.permissions.agents.canAccessBotChats : false, data.chunk);
    for (let conversation of conversations) {
      let temp = await Conversations.getMessages(conversation._id);
      conversation.messages = (temp.length) ? temp : [];
    }
    res.send({ status: 'ok', conversations: conversations, ended: (conversations && conversations.length < 20) ? true : false });
  } catch (err) {
    console.log(err);
    console.log('Error in get more inbox chats');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/getArchiveMessages', async (req, res) => {
  try {
    let data = req.body;

    if (!data.cid) res.status(401).send("Invalid Request!");

    let messages = await Conversations.getArchiveMessages(data.cid);
    res.send({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
  } catch (err) {
    console.log(err);
    console.log('Error in get archive messages');
    res.status(401).send("Invalid Request!");
  }


});
router.post('/getMoreArchiveMessages', async (req, res) => {
  try {
    let data = req.body;
    if (!data.cid) res.status(401).send("Invalid Request!");

    let messages = await Conversations.getArchiveMessages(data.cid, data.lastMessage);
    res.send({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
  } catch (err) {
    console.log(err);
    console.log('Error in get more archive messages');
    res.status(401).send("Invalid Request!");
  }

});
router.post('/chatTagsList', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send("Invalid Request!");
    let tags = await Company.GetTags(data.nsp);
    if (tags && tags.length) res.send({ status: 'ok', tags: (tags.length && tags[0].settings.chatSettings.tagList && tags[0].settings.chatSettings.tagList.length) ? tags[0].settings.chatSettings.tagList : [] });
    else res.send({ status: 'notag', tags: [] });
  } catch (err) {
    console.log(err);
    console.log('Error in chat tags list');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/selectedConversationDetails', async (req, res) => {
  try {
    let data = req.body;
    if (!data.cid || !data.sessionId) res.status(401).send("Invalid Request!");

    let session;
    if (req.body.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {

      let msgs = await Conversations.getMessagesByCid(data.cid);
      res.send({ status: 'ok', msgList: msgs });
    }
    else res.status(401).send("Invalid Request!");
  } catch (err) {
    console.log(err);
    console.log('Error in selected conversation details');

  }
})
/* #endregion */


/* #region  Agents */
router.post('/getLiveAgents', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send("Invalid Request!");
    else {
      let liveAgents = await SessionManager.getAllLiveAgents(data.nsp, (data.csid && data.csid.length) ? data.csid : []);
      if (liveAgents && liveAgents.length) {
        res.send((liveAgents && liveAgents.length) ? liveAgents : []);
      } else res.send([]);
    }
  } catch (error) {
    console.log(error);
    console.log('Error in get live agents');
    res.status(401).send("Invalid Request!");
  }
});

/* #endregion */


/* #region  CRM */
router.post('/customerConversationsList', async (req, res) => {
  try {
    // console.log(req.body);

    // console.log(req.body.sessionId);


    let data = req.body;
    if (!data.deviceID || !data.sessionId) res.status(401).send("Invalid Request!");
    else {
      let session;
      if (req.body.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);
      // console.log(session);

      if (session) {
        let conversations: any;
        conversations = await Conversations.getCustomerConversations(data.deviceID, data.nsp)
        res.send({ status: 'ok', conversations: (conversations && conversations.length) ? conversations : [] });
      }
      else res.status(401).send("Unauthorized!");
    }
  } catch (err) {
    res.status(401).send("Invalid Request!");
    console.log(err);
    console.log('Error in getting customer conversations list');
  }
});

//only agent side call
router.post('/moreCustomerConversationsList', async (req, res) => {
  try {
    let data = req.body;

    if (!data.deviceID || !data.sessionId) res.status(401).send("Invalid Request!");
    let session;
    if (req.body.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session) {

      let conversations = await Conversations.getMoreConversationsByDeviceID(data.deviceID, data.id, session.nsp)

      let chatsCheck;
      if (conversations && conversations.length > 0) chatsCheck = await Conversations.getMoreConversationsByDeviceID(data.deviceID, conversations[conversations.length - 1]._id, session.nsp);

      let noMoreChats;
      if (chatsCheck && chatsCheck.length) noMoreChats = false
      else noMoreChats = true
      res.send({ status: 'ok', conversations: conversations, noMoreChats: noMoreChats });
    }
    else res.status(401).send("Unauthorized!");
  } catch (err) {
    res.status(401).send("Invalid Request!");
    console.log(err);
    console.log('Error in getting more customer conversations list');
  }
});


router.post('/changeState', async (req, res) => {
  try {
    if (!req.body._id) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }

      let id = req.body._id


      let session = await MakeActive({ _id: req.body._id, id: id } as VisitorSessionSchema);
      //TODO RE-ACTIVE
      if (session) {
        let prevState = session.state;

        if (req.body.state == 3 && session) {
          switch (session.state) {
            case 3:
              session = await MakeActive({ _id: session._id, id: session._id } as VisitorSessionSchema, { inviteAccepted: true });
              break;
            case 4:
              session = await MakeActive({ _id: session._id, id: session._id } as VisitorSessionSchema, { inviteAccepted: true });
              break;
            case 5:
              session = await MakeActive({ _id: session._id, id: session._id } as VisitorSessionSchema, { inviteAccepted: true, inactive: false });
              break;
            default:
              session = await MakeActive({ _id: session._id, id: session._id } as VisitorSessionSchema);
              break;
          }
        }
        if (session && (session.state == 3 || session.state == 4 || session.state == 5)) {


          let UpdatedSessions;
          let allocatedAgent;
          let cid: ObjectID = new ObjectID();

          let companySettings = await Company.GetChatSettings(session.nsp)
          let greetingMessage = companySettings['settings']['chatSettings']['greetingMessage'];
          switch (session.state) {
            case 5:
              if (!session.conversationID) {

                if (companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim())
                  UpdatedSessions = await SessionManager.AllocateAgentPriority(session, companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid);
                else
                  UpdatedSessions = await SessionManager.AllocateAgent(session, cid);

                if (UpdatedSessions) {
                  allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                  session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;

                  if (session) {
                    let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', (session.username as string), (allocatedAgent) ? 2 : 1, session.deviceID);

                    if (allocatedAgent && allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
                    let lastMessage;
                    if (greetingMessage) {

                      lastMessage = {
                        from: session.nsp.substr(1),
                        to: session.username,
                        body: greetingMessage,
                        cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                        date: (new Date()).toISOString(),
                        type: 'Agents',
                        attachment: false
                      }
                      if (conversation && conversation.insertedCount) {
                        if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)
                        let messageinsertedID = await Conversations.insertMessage(lastMessage);
                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                        await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                      }
                    }
                    if (allocatedAgent && conversation) {
                      // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: conversation.ops[0] })

                    }

                    let payload = { id: session._id, session: session }


                    // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });
                    let newSession: any = {
                      clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                      agent: (allocatedAgent) ? session.agent : undefined,
                      cid: session.conversationID,
                      state: session.state,
                      username: session.username,
                      email: session.email,
                      phone: (session.phone ? session.phone : ''),
                      message: (session.message) ? session.message : ''
                    }
                    res.send({
                      status: 'ok',
                      session: newSession
                    });
                    delete newSession.greetingMessage

                    // console.log("greeting message")
                    // if (conversation) origin.to(Visitor.NotifyOne(session)).emit('gotAgent', newSession);
                    if (conversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: newSession });

                    let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                    //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                  }
                }
              }
              return;
            case 4:
              session = await SessionManager.UpdateState(session._id || session.id, parseInt(req.body.state), true);
              if (session) {
                res.send({ status: 'ok', session: session });
                if (!session.inactive) {
                  let payload = { id: session._id, session: session }
                  let event = ComposedENUM(DynamicEventLogs.VISITOR_STATE_CHANGED, { newEmail: '', oldEmail: '', oldstate: Utils.GetStateKey(prevState), newstate: Utils.GetStateKey(req.body.state) })
                  await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: payload }),
                    await __biZZC_SQS.SendEventLog(event, (session._id) ? session._id : session.id)
                  ]);
                }
                return;
              } else res.status(200).send({ status: 'ok', session: session, msg: 're-activating when action made' });
              return;
            case 3:
              res.send({ status: 'ok', session: session })
              return
          }
        } else res.status(401).send({ status: 'error' });

      } else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Change State');
    res.status(401).send({ status: 'error' });
  }
});

router.post('/disconnectEventFromClient', async (req, res) => {
  try {


    if (!req.body._id) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }


      let id = req.body._id
      let visitor = (await SessionManager.GetVisitorByID(id));

      if (visitor) {
        // let socketServer = SocketListener.getSocketServer();
        // let origin = socketServer.of(visitor.nsp);

        if (visitor && req.body) {
          let insertedMessage = await CreateLogMessage({
            from: visitor.agent.name,
            to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
            body: req.body.msg,
            type: 'Events',
            cid: (visitor.conversationID) ? visitor.conversationID : '',
            attachment: false,
            date: new Date().toISOString(),
            delivered: true,
            sent: true
          })
          if (insertedMessage) {
            setTimeout(async () => {
              if (visitor) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessage', nsp: visitor.nsp, roomName: [Agents.NotifyOne(visitor)], data: insertedMessage });
              // origin.to(Agents.NotifyOne(visitor)).emit('privateMessage', insertedMessage);
            }, 0);
            res.send({ status: 'ok', msg: insertedMessage })
          }
          else res.status(401).send({ status: 'error' });
        }
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log('Error in Inserting Disconnecting Message');
    console.log(error);
  }
});

router.post('/privateMessageRecieved', async (req, res) => {
  try {
    // console.log('privateMEssageRec');
    // console.log(req.body);

    if (!req.body.cid || !req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body;
      if (data && data.cid && data.sessionid) {

        //socket.to(data.sessionId).emit('privateMessageSent', data);
        let session = await SessionManager.GetVisitorByID(data.sessionid)

        if (session) {
          // let socketServer = SocketListener.getSocketServer();
          // let origin = socketServer.of(session.nsp);

          await Conversations.updateMessageReadCount(data.cid, true);
          let conversation = await Conversations.getMessagesByCid(data.cid);
          if (conversation && conversation.length) {

            let updatedList = conversation.map(async (msg, index) => {
              let updatedMessage;
              if (msg.type == data.type && !msg.sent) updatedMessage = await Conversations.updateSentStatus(msg._id);

            })
            await Promise.all(updatedList);
          }
          if (session && data.type == 'Visitors') {
            // origin.to(Visitor.NotifyOne(session)).emit('privateMessageSent', data);
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessageSent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: data });

          }
          else if (session && session.agent) {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessageSent', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: data });
            // origin.to(Agents.NotifyOne(session)).emit('privateMessageSent', data);
          }
          res.send({ status: 'ok' });
        }
        else res.status(401).send({ error: 'error' });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log('Error in Sending Message Sent Status');
    console.log(error);
  }
});


router.post('/initiateChatForBot', async (req, res) => {
  try {
    // console.log(req.body);

    if (!req.body.state || !req.body._id) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }

      let id = req.body._id
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;
      if (session) {
        if (req.body && (req.body.state == 1) || (req.body.state == 8)) {
          let message;
          let companySettings = await Company.GetChatSettings(session.nsp)
          let cid: ObjectID = new ObjectID();
          let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, 'chatBot', (session.username as string), 5, session.deviceID);


          if (conversation && conversation.insertedCount) {

            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: ['Admins'], data: conversation.ops[0] });

            session.conversationID = (conversation && conversation.insertedCount) ? conversation.ops[0]._id : ''
            await SessionManager.UpdateSession(session.id || session._id, session, 8, session.state);



            if (companySettings['settings'].chatSettings.botGreetingMessage) {

              message = await GetChatBotReplyMessage(companySettings['settings'].chatSettings.botGreetingMessage, session, false)

              let botMessage = await Conversations.insertMessage(message)
              if (botMessage && botMessage.insertedCount) {
                await Conversations.UpdateLastMessage(session.conversationID, botMessage.ops[0]);
                if (req.body.socketID) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [id], data: botMessage.ops[0], excludeSender: (req.body.socketID) ? true : false, sockID: (req.body.socketID) ? req.body.socketID : '' })
                res.send({ botGreetingMessage: (botMessage && botMessage.insertedCount) ? botMessage.ops[0] : '', session: { clientID: conversation.ops[0].clientID, cid: conversation.ops[0]._id } });
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: ['Admins'], data: botMessage.ops[0] })
              }
            }
            else res.send({ botGreetingMessage: '', session: { clientID: conversation.ops[0].clientID, cid: conversation.ops[0]._id } });

            // session.state = 8;
          }
          else res.status(401).send({ error: 'error' });
        }
        else {
          res.send({ botGreetingMessage: [], session: session });
        }
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getting bot Greeting Message');
    res.status(401).send({ error: 'error' });
  }
});


router.post('/typing', async (req, res) => {
  try {
    // console.log('typing');
    // console.log(req.body);

    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let id = req.body.sessionid
      let data = req.body
      let session = await SessionManager.GetVisitorByID(id)
      if (session) {

        switch (data.type) {
          case 'Visitors':
            session.typingState = req.body.state;
            (await SessionManager.UpdateSession(id, session) as VisitorSessionSchema);
            // origin.to(Agents.NotifyOne(session)).emit('typingState', { state: req.body.state, sid: session.id })
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'typingState', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { state: req.body.state, sid: session.id } });
            break;

          default:
            // socket.to(Visitor.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: visitorSession.id })
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'typingState', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: { state: data.state, sid: session.id } });
            break;
        }
        res.send({})
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error in SneakPeak Typing Event');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/updateAdditionalDataInfo', async (req, res) => {
  try {

    if (!req.body.sessionID || !req.body.data) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let id = req.body.sessionID
      let data = req.body.data
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;

      if (data) {
        await SessionManager.SetAdditionalData(data, session.id || session._id);
        res.send({ status: 'AdditionalDataUpdated', state: session.state });
        let payload = { id: session.id, session: session };


        // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });
        let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.GOT_ADDITIONAL_DATA, (session._id) ? session._id : session.id);
      }
      else {
        res.status(401).send({ status: 'error' });
      }
    }
  } catch (error) {
    console.log(error);
    console.log('error is Updating Additional Data Info');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/updateRequestedCarInfo', async (req, res) => {
  try {

    if (!req.body.sessionID || !req.body.data) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let id = req.body.sessionID
      let data = req.body.data
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;

      if (data) {
        await SessionManager.SetRequestedCarData(data, session.id || session._id);
        res.send({ status: 'CarRequestedDataUpdated', state: session.state });


        let payload = { id: session.id, session: session };

        // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });


        let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.GOT_REQUEST_CAR_DATA, (session._id) ? session._id : session.id);
        //if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
      }
      else {
        res.status(401).send({ status: 'error' });
      }
    }
  } catch (error) {
    console.log(error);
    console.log('error is Updating  Requested Car Data Info');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/visitorSneakPeak', async (req, res) => {
  try {

    if (!req.body._id) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let id = req.body._id
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;

      if (session) {
        // origin.to(Agents.NotifyOne(session)).emit('visitorSneakPeak', { msg: req.body.msg, sid: session.id })
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'visitorSneakPeak', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { msg: req.body.msg, sid: session.id } });
      }
      res.send({})
    }
  } catch (error) {
    console.log(error);
    console.log('error in SneakPeak Typing Event');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getConversationClientID', async (req, res) => {
  try {


    if (!req.body.cid || !req.body._id) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let id = req.body._id
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;
      if (session) {
        let conversation = await Conversations.GetClientIDByConversationID(data.cid, session.nsp);
        if (conversation && conversation.length) res.send({ clientID: conversation[0].clientID });
        else res.send({})
      }
      else res.status(401).send({ error: 'error' });

    }
  } catch (error) {
    console.log(error);
    console.log('error is getting client ID of conversation');
    res.status(401).send({ error: 'error' });
  }
});


router.post('/getCustomFeedback', async (req, res) => {
  try {


    if (!req.body.cid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let id = req.body._id
      let session = await SessionManager.GetVisitorByID(id) as VisitorSessionSchema;
      if (session) {
        let conversation = await Conversations.GetCustomFeedbackByConversationID(data.cid, session.nsp);
        if (conversation && conversation.length) res.send({ customfeedback: (conversation[0].visitorCustomFields) ? conversation[0].visitorCustomFields : {} });
        else res.send({})
      }
      else res.status(401).send({ error: 'error' });

    }
  } catch (error) {
    console.log(error);
    console.log('error is getting client ID of conversation');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getMessages', async (req, res) => {
  try {
    if (!req.body.sessionID) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionID
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        if (session.isMobile) {
          if (!data.cid) {
            res.send({});
            return;
          }
          let msgs = await Conversations.getMessagesByCid(data.cid);
          res.send(msgs);
        } else {
          if (!data.lasttouchedTime || !data.cid) {
            res.send([]);
            return;
          }
          let msgs = await Conversations.getMessagesByTime(data.cid, data.lasttouchedTime, (data._id) ? data._id : '');
          if (msgs) res.send((msgs && msgs.length) ? msgs : []);
        }
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getting conversation Messages');
    res.status(401).send({ error: 'error' });
  }
});

//for visitor
router.post('/getMoreRecentChats', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {

      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      data.deviceID = (session && session.deviceID) ? session.deviceID : ''
      if (session && data && data.deviceID) {
        // let chats = await Conversations.F(data.deviceID, (data._id) ? data._id : '');
        let chats = (data._id) ? await Conversations.getMoreConversationsByDeviceID(data.deviceID, (data._id) ? data._id : '', session.nsp) : await Conversations.getCustomerConversations(session.deviceID, session.nsp);
        let chatsCheck;
        if (chats && chats.length > 0) chatsCheck = await Conversations.getMoreConversationsByDeviceID(data.deviceID, chats[chats.length - 1]._id, session.nsp);
        let noMoreChats;
        if (chatsCheck && chatsCheck.length) noMoreChats = false
        else noMoreChats = true
        res.send({ status: 'ok', chats: chats, noMoreChats: noMoreChats });
      }
      else res.status(401).send({ error: 'error' });
      // res.set('Cache-Control', 'public, max-age=84600');
      // res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getting recent conversation');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getSelectedChat', async (req, res) => {
  try {
    if (!req.body.sessionid || !req.body.cid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      if (session) {
        if (data.deviceID) {
          let msgs = await Conversations.getMessagesByCid(data.cid);
          res.send({ status: 'ok', msgList: (msgs && msgs.length) ? msgs : [] });
        }
        else {
          res.status(401).send({ error: 'error' });
        }
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getting getSelectedChat');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getFAQS', async (req, res) => {
  try {
    // console.log("getFAQS");
    // console.log(req.body);
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      //  console.log(data.nsp)
      //   let sessionID = req.body.sessionid
      //   let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      //   let expiredSession: any;
      //     if (!session) {
      //         expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //         // console.log('expiredSession');
      //         // console.log(expiredSession);

      //         if (expiredSession && expiredSession.length) {
      //             session = expiredSession[0]
      //         }
      //     }
      //    if (session) {
      let faqs
      let faqsCheck;
      let noMoreFaqs = false;
      if (data._id) {
        faqs = await WidgetMarketingModel.getMoreFaqs(data._id, data.nsp)
        if (faqs && faqs.length > 0) {
          if (faqs.length < 5) {
            noMoreFaqs = true
          }
          else {
            faqsCheck = await WidgetMarketingModel.getMoreFaqs(faqs[faqs.length - 1]._id, data.nsp);
            if (faqsCheck && faqsCheck.length) noMoreFaqs = false
            else noMoreFaqs = true
          }
        }
      }
      else faqs = (data.text) ? await WidgetMarketingModel.getFaqsByQuestion(data.text, data.nsp) : await WidgetMarketingModel.getFaqsForVisitor(data.nsp);
      res.send({ status: 'ok', FAQS: faqs, noMoreFaqs: noMoreFaqs });
    }
    //  else res.status(401).send({ error: 'error' });
    //  }
  } catch (error) {
    console.log(error);
    console.log('error is getFAQS');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getPromotions', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        let promotions = await WidgetMarketingModel.getActivePromotions(session.nsp);


        res.send({ status: 'ok', promotions: (promotions) ? promotions : [] });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getting promotions');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/likeOnPost', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {

      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // //  console.log(data);
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {
      data.likes.createdOn = new Date().toISOString();
      // data.likes.visitorName = (data.likes.visitorName) ? data.likes.visitorName : '';
      // data.likes.visitorEmail = (data.likes.visitorEmail) ? data.likes.visitorEmail : '';
      let promotion = await WidgetMarketingModel.LikeOnPost(data.nsp, data._id, data.likes, data.alreadyLiked);
      if (promotion && promotion.value) {

        res.send({ status: 'ok', promotion: promotion.value });
      }
      else {
        res.status(401).send({ error: 'error' });
      }
      //  }
      //     else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is likeOnPost');
    res.status(401).send({ error: 'error' });
  }
});
router.post('/viewsOnProduct', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {

      //  data.reviews.createdOn = new Date().toISOString();
      //   data.reviews.visitorName = (data.reviews.visitorName) ? data.reviews.visitorName : '';
      //   data.reviews.vistorEmail = (data.reviews.visitorEmail) ? data.reviews.visitorEmail : '';
      let promotion = await WidgetMarketingModel.ViewOnProduct(data._id, data.views);
      if (promotion && promotion.value) {

        res.send({ status: 'ok', promotion: promotion.value });
      }
      else {
        res.status(401).send({ error: 'error' });
      }
    }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is viewsOnProduct');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/reviewOnPost', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {

      data.reviews.createdOn = new Date().toISOString();
      data.reviews.visitorName = (data.reviews.visitorName) ? data.reviews.visitorName : '';
      data.reviews.vistorEmail = (data.reviews.visitorEmail) ? data.reviews.visitorEmail : '';
      let promotion = await WidgetMarketingModel.ReviewOnPost(data.nsp, data._id, data.reviews);
      if (promotion && promotion.value) {

        res.send({ status: 'ok', promotion: promotion.value });
      }
      else {
        res.status(401).send({ error: 'error' });
      }
    }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is reviewOnPost');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/deleteReviewOnPost', async (req, res) => {
  try {

    //  console.log(req.body);

    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {
      // (data.review as any).createdOn = new Date().toISOString();

      let promotion = await WidgetMarketingModel.DeleteReviewOnPost(data.reviews, data.promotionID);
      //   console.log(promotion);

      if (promotion && promotion.value) {
        res.send({ status: 'ok', promotion: promotion.value });
      }
      else res.status(401).send({ error: 'error' });
    }
    // else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is deleteReviewOnPost');
    res.status(401).send({ error: 'error' });
  }
});


router.post('/getMoreReviews', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {
      //  data.deviceID = (session.deviceID) ? session.deviceID : ''
      if (data.deviceID) {
        let reviewsCheck;
        let noMoreReviews = false;

        let reviews = await WidgetMarketingModel.getMoreReviews(data.promoid, data.date)

        if (reviews && reviews.length > 0) {
          if (reviews.length < 5) {
            noMoreReviews = true
            res.send({ status: 'ok', reviews: reviews, noMoreReviews: noMoreReviews });
          }
          else {
            reviewsCheck = await WidgetMarketingModel.getMoreReviews(data.promoid, reviews[reviews.length - 1].date);
            if (reviewsCheck) {
              if (reviewsCheck && reviewsCheck.length) noMoreReviews = false
              else noMoreReviews = true
              res.send({ status: 'ok', reviews: reviews, noMoreReviews: noMoreReviews });
            }
          }

        }

      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getMoreReviews');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getNews', async (req, res) => {
  try {
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        let news = await WidgetMarketingModel.getActiveNews(session.nsp);
        res.send({ status: 'ok', news: (news && news.length) ? news : [] });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getNews');
    res.status(401).send({ error: 'error' });
  }
});


router.post('/getMoreActiveNews', async (req, res) => {
  try {
    // console.log("getMoreActiveNews");
    // console.log(req.body);
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     // console.log('expiredSession');
      //     // console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // console.log(session);

      // if (session) {
      let news = await WidgetMarketingModel.getMoreActiveNews(data._id, data.nsp);
      let newsCheck;
      let noMoreNews = false;
      if (news && news.length > 0) {
        if (news.length < 5) {
          noMoreNews = true
          res.send({ status: 'ok', News: news, noMoreNews: noMoreNews });
        }
        else {
          newsCheck = await WidgetMarketingModel.getMoreActiveNews(news[news.length - 1]._id, data.nsp);
          if (newsCheck) {
            if (newsCheck && newsCheck.length) noMoreNews = false
            else noMoreNews = true
            res.send({ status: 'ok', News: news, noMoreNews: noMoreNews });
          }
        }

      }
      else res.send({ status: 'ok', News: [], noMoreNews: true });

      //  }
      //  else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getMoreActiveNews');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getActiveNewsByDate', async (req, res) => {
  try {
    //   console.log("getActiveNewsByDate");
    //  console.log(req.body);
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      // let sessionID = req.body.sessionid
      // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      // let expiredSession: any;
      // if (!session) {
      //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
      //     //console.log('expiredSession');
      //     //console.log(expiredSession);

      //     if (expiredSession && expiredSession.length) {
      //         session = expiredSession[0]
      //     }
      // }
      // if (session) {
      let news = await WidgetMarketingModel.getActiveNewsByDate(data.filters.from, data.filters.to, data.nsp);
      res.send({ status: 'ok', news: (news && news.length) ? news : [] });
      //}
      //   else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getActiveNewsByDate');
    res.status(401).send({ error: 'error' });
  }
});
router.post('/submitTicket', async (req, res) => {
  try {
    // console.log("submitTicket");
    // console.log(req.body);
    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body.ticket


      let sess = await SessionManager.GetVisitorByID(req.body.sessionid) as VisitorSessionSchema;
      if (sess) {
        let agentSearch = {}
        agentSearch = await ApplyRuleSets(sess, data)

        let session = await MakeActive(sess);

        if (session) {
          let allAgents = await SessionManager.GetAllActiveAgentsChatting(session);
          let settings = await Company.getSettings(session.nsp)
          let origin;
          if (settings && settings.length) origin = settings[0];
          let greetingMessage: string = '';
          if (origin) {
            greetingMessage = origin['settings']['chatSettings']['greetingMessage'];
          }

          if (!allAgents || session.state != 1) {
            let primaryEmail = await Tickets.GetPrimaryEmail(session.nsp);
            let primaryTicket: any = undefined;
            if (primaryEmail) {
              let randomColor = rand[Math.floor(Math.random() * rand.length)];
              let ticket: TicketSchema = {
                type: 'email',
                subject: data.subject,
                nsp: session.nsp,
                state: 'OPEN',
                datetime: new Date().toISOString(),
                priority: data.priority,
                // from: primaryEmail[0].domainEmail,
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
                source: 'livechat',
                slaPolicy: {
                  reminderResolution: false,
                  reminderResponse: false,
                  violationResponse: false,
                  violationResolution: false
                },
                assignmentList: []
              };

              // if (data.phone && data.email) {

              //     let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });
              // }

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
              //console.log(insertedTicket);

              let ticketId: ObjectID | undefined;
              (insertedTicket) ?
                (insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId as ObjectID
                  : res.status(401).send({ status: 'error' }) : undefined;

              if (ticketId) {
                let message: TicketMessageSchema = {
                  datetime: new Date().toISOString(),
                  nsp: session.nsp,
                  senderType: 'Visitor',
                  message: data.message,
                  from: data.email,
                  to: ticketEmail,
                  replytoAddress: data.email,
                  tid: [ticketId],
                  attachment: [],
                  viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : ''
                };
                let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
                if (insertedMessage && insertedMessage.insertedCount &&
                  insertedTicket && insertedTicket.insertedCount) {

                  // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                  // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
                  //console.log(insertedTicket);

                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } });
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: [ticket.group], data: { ticket: insertedTicket.ops[0] } });

                  res.send({ status: 'ok' });
                  let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.TICKET_SUBMITTED, (session._id) ? session._id : session.id);

                } else {
                  res.status(401).send({ status: 'error' });
                }
              } else {
                res.status(401).send({ status: 'error' });
              }
            } else res.status(401).send({ status: 'error' });

          } else {
            let allocatedAgent: AgentSessionSchema | undefined;
            let cid: ObjectID = new ObjectID();

            // console.log(origin['settings']['chatSettings']['assignments']);
            if (origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) {



              let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid) : undefined;

              if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid);
              if (UpdatedSessions && UpdatedSessions.agent) {
                session = UpdatedSessions.visitor;
                allocatedAgent = UpdatedSessions.agent;
                if (allocatedAgent && session) {

                  //Creating Conversation in Database
                  //Conversation States:
                  // 1. Conversation Created But No Agent Assignend
                  // 2. Conversation Created and Got agent
                  // 3. Conversation Ended
                  let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID);

                  //if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
                  //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
                  //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero.
                  if (conversation && conversation.insertedCount > 0) {
                    if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)


                    //Visitor State Data to Update
                    let payload = { id: session.id, session: session };


                    if (conversation) {
                      let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                      let tempData = JSON.parse(JSON.stringify(data));
                      delete tempData.ticket

                      Object.keys(tempData).map(key => {
                        temp += key + ' : ' + tempData[key] + '<br>';
                      })
                      temp += 'country : ' + session.fullCountryName.toString() + '<br>';

                      let lastMessage = {
                        from: session.nsp,
                        to: session.username,
                        body: temp,
                        cid: conversation.insertedId.toHexString(),
                        date: (new Date()).toISOString(),
                        type: 'Visitors',
                        attachment: false,
                        chatFormData: 'Credentials Updated'

                      }
                      let messageinsertedID = await Conversations.insertMessage(lastMessage);
                      if (messageinsertedID) {
                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                        let credentials;
                        if (!allocatedAgent.greetingMessage) credentials = await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                        else {
                          greetingMessage = allocatedAgent.greetingMessage;
                          if (greetingMessage) {

                            let greeting = {
                              from: session.nsp,
                              to: session.username,
                              body: greetingMessage,
                              cid: conversation.insertedId.toHexString(),
                              date: (new Date()).toISOString(),
                              type: 'Agents',
                              attachment: false
                            }
                            let messageinserted = await Conversations.insertMessage(greeting);
                            if (messageinserted && messageinserted.insertedCount) {
                              conversation.ops[0].messages.push(messageinserted.ops[0]);
                              await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting);
                            }

                          }

                        }
                      }

                    }
                    // console.log(allocatedAgent.greetingMessage);
                    //Notify Allocated Agent That A New Conversation has been autoAssigned.
                    //Check if Allocated Agent is Still Active. Just a precautionary Case.
                    if (allocatedAgent) {
                      // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id as string], data: conversation.ops[0] });

                    }
                    //Broadcast To All Agents That User Information and State Has Been Updated.
                    // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),


                      //Update User Status Back to Visitor Window
                      res.send({
                        status: 'chat',
                        session: {

                          clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                          agent: session.agent,
                          cid: session.conversationID,
                          state: session.state,
                          credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                          greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                          username: session.username,
                          email: session.email,
                          phone: (session.phone ? session.phone : ''),
                          message: (session.message) ? session.message : ''
                        }

                      });

                    // socket.to(Visitor.NotifyOne(session)).emit('gotAgent',
                    //     {
                    //         clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    //         agent: (allocatedAgent) ? session.agent : undefined,
                    //         cid: session.conversationID,
                    //         state: session.state,
                    //         username: session.username,
                    //         email: session.email,
                    //         credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    //         greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                    //         phone: (session.phone ? session.phone : ''),
                    //         message: (session.message) ? session.message : ''
                    //     });
                    await __BIZZ_REST_REDIS_PUB.SendMessage({
                      action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
                        clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        agent: (allocatedAgent) ? session.agent : undefined,
                        cid: session.conversationID,
                        state: session.state,
                        username: session.username,
                        email: session.email,
                        credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                        greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                        phone: (session.phone ? session.phone : ''),
                        message: (session.message) ? session.message : ''
                      }, excludeSender: true, sockID: req.body.socketID
                    });

                    let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                    //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                  }


                } else {
                  console.log('No Agent')
                  res.send(401).send({ status: 'error' });
                }

              } else {
                //console.log('No Agent')
                res.send(401).send({ status: 'error' });
              }
              return;
            } else {

              console.log('not priority');
              let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '') : undefined;
              if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgent(session, cid, undefined, (agentSearch) ? agentSearch : '');

              if (UpdatedSessions) {
                allocatedAgent = UpdatedSessions.agent;
                session = UpdatedSessions.visitor as VisitorSessionSchema;
                //Creating Conversation in Database
                //Conversation States:
                // 1. Conversation Created But No Agent Assignend
                // 2. Conversation Created and Got agent
                // 3. Conversation Ended

                if (session) {
                  let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), (session.nsp as string), session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', (session.username as string), (allocatedAgent) ? 2 : 1, session.deviceID);

                  // if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
                  //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
                  //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero.


                  //Visitor State Data to Update
                  let payload = { id: session.id, session: session }


                  if (allocatedAgent && allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;


                  if (conversation) {

                    if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)

                    let temp = '<h5 class="clearfix m-b-10">Credentials Updated</h5>';

                    Object.keys(data).map(key => {
                      temp += key + ' : ' + data[key] + '<br>';
                    })
                    temp += 'country : ' + session.fullCountryName.toString() + '<br>';
                    //temp += 'URI : ' + socket.handshake.session.url[0] + '<br>';
                    //temp += 'IP : ' + socket.handshake.session.ip + '<br>';

                    let lastMessage = {
                      from: session.nsp,
                      to: session.username,
                      body: temp,
                      cid: conversation.insertedId.toHexString(),
                      date: (new Date()).toISOString(),
                      type: 'Visitors',
                      attachment: false,
                      chatFormData: 'Credentials Updated'
                    }
                    let messageinsertedID = await Conversations.insertMessage(lastMessage);
                    if (messageinsertedID) {
                      conversation.ops[0].messages.push(messageinsertedID.ops[0]);

                      let credentials;
                      if (!greetingMessage) credentials = await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                      else {
                        let greeting = {
                          from: session.nsp,
                          to: session.username,
                          body: greetingMessage,
                          cid: conversation.insertedId.toHexString(),
                          date: (new Date()).toISOString(),
                          type: 'Agents',
                          attachment: false
                        }
                        let messageinserted = await Conversations.insertMessage(greeting);
                        if (messageinserted && messageinserted.insertedCount) {
                          conversation.ops[0].messages.push(messageinserted.ops[0]);
                          await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting);
                        }

                      }

                    }
                  }

                  //Update User Status Back to Visitor Window
                  //Check if Allocated Agent is Still Active. Just a precautionary Case.
                  if (allocatedAgent && conversation) {
                    // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id as string], data: conversation.ops[0] });
                  }

                  //Broadcast To All Agents That User Information and State Has Been Updated.
                  // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });

                  if (allocatedAgent) res.send({
                    status: 'chat',
                    session: {
                      clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                      agent: session.agent,
                      cid: session.conversationID,
                      state: session.state,
                      credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                      greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                      username: session.username,
                      email: session.email,
                      phone: (session.phone ? session.phone : ''),
                      message: (session.message) ? session.message : ''
                    }

                  });
                  else res.send({
                    status: 'chat',
                    session: {

                      clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                      agent: session.agent,
                      cid: session.conversationID,
                      state: session.state,
                      credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                      greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                      username: session.username,
                      email: session.email,
                      phone: (session.phone ? session.phone : ''),
                      message: (session.message) ? session.message : ''
                    }
                  });

                  // console.log("greeting message")
                  if (conversation) {

                    // socket.to(Visitor.NotifyOne(session)).emit('gotAgent', {
                    //     clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    //     agent: (allocatedAgent) ? session.agent : undefined,
                    //     cid: session.conversationID,
                    //     state: session.state,
                    //     username: session.username,
                    //     email: session.email,
                    //     credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    //     greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                    //     phone: (session.phone ? session.phone : ''),
                    //     message: (session.message) ? session.message : ''
                    // });
                    await __BIZZ_REST_REDIS_PUB.SendMessage({
                      action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
                        clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        agent: (allocatedAgent) ? session.agent : undefined,
                        cid: session.conversationID,
                        state: session.state,
                        username: session.username,
                        email: session.email,
                        credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                        greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                        phone: (session.phone ? session.phone : ''),
                        message: (session.message) ? session.message : ''
                      }, excludeSender: true, sockID: req.body.socketID
                    });


                    let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                    //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                  }
                } else res.status(401).send({ status: 'error' });


              } else {
                //console.log(UpdatedSessions);
                //console.log("Can't Assign Agent");
                res.status(401).send({ status: 'error' });

              }

            }
          }
          if (data.email && ((data.email as string).toLowerCase().indexOf('unregistered') === -1)) {

            let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });

            // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)

            // if (customer && customer.length) {

            //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && ((customer[0].email as string).toLowerCase() != (data.email as string).toLowerCase()) && (customer[0].deviceID == session.deviceID)) {

            //         await __biZZC_SQS.SendMessage({
            //             action: 'NewVisitors',
            //             deviceinfo: session.deviceInfo,
            //             token: session.deviceID,
            //             params: req.params,
            //             nsp: session.nsp,
            //             sid: (session._id) ? session._id : session.id
            //         }, ARCHIVINGQUEUE)

            //     }
            //     else await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });

            // }
          }
        }
        else res.status(401).send({ status: 'error', msg: 'No Session Found' });
      } else res.status(401).send({ status: 'error', msg: 'No Session Found' });


    }
  } catch (error) {
    console.log(error);
    console.log('error in Submitting Ticket');
    res.status(401).send({ status: 'error' });
  }
});

router.post('/convertChatToTicket', async (req, res) => {
  try {
    // console.log('Convert Chat to ticket Performance');
    // let t0 = performance.now();

    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      if (!data.thread || !data.cid) throw new Error('Invalid Request');
      let session = await SessionManager.GetAgentByID(data.sessionid);

      if (session) {

        let company = await Company.getCompany(session.nsp)
        if (company && company.length) {
          // let origin = company[0]
          // let randomColor = rand[Math.floor(Math.random() * rand.length)];
          // let primaryTicket: any = undefined;
          let primaryEmail = await Tickets.GetPrimaryEmail(session.nsp);
          let convos = await Conversations.getMessagesByCid(data.cid);
          if (!convos || !convos.length) {
            res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket - No Message Found' });
          } else {
            if (primaryEmail.length) {
              let response = await __biZZC_SQS.SendMessage({ action: 'convertChatToTicket', session: session, data: data });
              if (response && response.MessageId) {
                res.send({ status: 'ok' });
              } else {
                res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
              }
            }
            else res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
          }
        }
      }
      else res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
    }

  } catch (error) {
    console.log(error);
    console.log('error in CONVERTING cHAT TO New Ticket');
    //res.status(401).send({ status: 'error', msg: error })
  }
});

router.post('/getAvailableAgents', async (req, res) => {
  try {

    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        let liveAgents = await SessionManager.GetLiveAvailableAgentForVisitors(session.nsp);
        res.send({ status: 'ok', agentsList: (liveAgents && liveAgents.length) ? liveAgents : [] });
      }
      else res.status(401).send({ error: 'error' });

      // res.status(401).send({ error: 'error' });
      // res.set('Cache-Control', 'public, max-age=84600');
      // res.send({ status: 'ok', agentsList: [] });

    }
  } catch (error) {
    console.log(error);
    console.log('error is getAvailableAgents');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/getWorkFlows', async (req, res) => {
  try {

    if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        let workflows = await WorkFlowsModel.GetWorkFlows(session.nsp, (data.id) ? data.id : '');
        res.send({ status: 'ok', workFlows: workflows });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is getWorkFlows');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/workFlowInput', async (req, res) => {
  try {

    if (!req.body.sessionid || !req.body.value) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid
      let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
      if (session) {
        let companySettings = await Company.GetChatSettings(session.nsp)


        for (let index = 0; index < companySettings['workflow'].form.length; index++) {
          if ((companySettings['workflow'].form[index].value as string).toLowerCase() == (data.value as string).toLowerCase()) {
            //console.log('Here');
            //console.log(origin['workflow']);
            session.stateMachine = companySettings['workflow'].form[index].stateMachine.stateMachine;
            // console.log('Here 1');
            let stateMachineStates = Object.keys(companySettings['workflow'].form[index].stateMachine.stateMachine);
            session.currentState = stateMachineStates[0];
            // session.state = 7;
            session.newUser = false;
            await SessionManager.UpdateSession(session.id || session._id, session, 7, session.state);
            //console.log(session);
            setTimeout(async () => {

              // origin.emit("syncsession", session)
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'syncsession', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: session });

            }, 0);
            break;
          }

        }

        await SessionManager.UpdateSession(session._id, session);

        //EMIT TO ALL SESSIONS THAT ABOUT WORKFLOW INPUT
        //FOR CROSS TAB COMMUNICATION
        res.send({ status: 'ok', state: 7 });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is workFlowInput');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/updateCredentials', async (req, res) => {
  try {

    if (!req.body.sessionid || !req.body.data) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body.data
      let temp = { id: req.body.sessionid };
      let session: VisitorSessionSchema | undefined;
      session = await MakeActive({ id: req.body.sessionid, _id: req.body.sessionid } as VisitorSessionSchema, (data && Object.keys(data).length) ? data : undefined);

      if (session) {
        // session = await SessionManager.UpdateUserInformation(temp, data) as VisitorSessionSchema;

        let payload = { id: session.id, session: session };
        let promises = Promise.all([
          await __BIZZ_REST_REDIS_PUB.SendMessage({
            action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
              status: 'credentialsUpdated',
              username: data.username,
              email: data.email,
              phone: data.phone,
              accountType: (data.accountType) ? data.accountType : '',
              message: data.message
            }
          }),
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } }),
          await Conversations.UpdateVisitorInfo(session.conversationID, (data.username as string), (data.email as string)),
          await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: (data.phone) ? data.phone : '' }),
          await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)
        ]);
        await promises
        res.send({
          status: 'ok',
          username: data.username,
          email: data.email,
          phone: (data.phone) ? data.phone : '',
          message: (data.message) ? data.message : '',
          accountType: (data.accountType) ? data.accountType : ''
        });

        // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)

        // if (customer && customer.length) {

        //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && ((customer[0].email as string).toLowerCase() != (data.email as string).toLowerCase()) && (customer[0].deviceID == session.deviceID)) {

        //         await __biZZC_SQS.SendMessage({
        //             action: 'NewVisitors',
        //             deviceinfo: session.deviceInfo,
        //             token: session.deviceID,
        //             params: req.params,
        //             nsp: session.nsp,
        //             sid: (session._id) ? session._id : session.id
        //         }, ARCHIVINGQUEUE)

        //     }
        //     else await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });

        // }
      } else { res.status(401).send({ status: 'error' }); }

      // if (session && session.inactive) {
      //     if (session) {
      //         let payload = { id: session.id, session: session };
      //         let promises = Promise.all([
      //             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),
      //             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } })
      //         ])
      //         await promises;
      //     }
      // }
    }


  } catch (error) {
    console.log(error);
    console.log('error is updateCredentials');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/updateUserInfo', async (req, res) => {
  try {

    if (!req.body.sessionid || !req.body.data) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body.data
      let sessionID = req.body.sessionid
      let session = await MakeActive({ id: sessionID, _id: sessionID } as VisitorSessionSchema);
      if (session) {

        if (session && (session.state == 4 || session.state == 3 || session.state == 2)) {
          if (data.username && data.email) {
            data.previousState = ((session.inactive) ? '-' : '') + session.state.toString();
            if (session.state == 4) data.state = 3;
            else data.state = session.state;
            session = await SessionManager.UpdateUserInformation(session, data) as VisitorSessionSchema;
            await Promise.all([
              await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (session.username as string), email: (session.email as string), phone: (data.phone) ? data.phone : '' }),
              await Conversations.UpdateVisitorInfo(session.conversationID, (session.username as string), (session.email as string)),
            ]);
            res.send({ status: 'userUpdated', state: data.state, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });

            // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)

            // if (customer && customer.length) {

            //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && ((customer[0].email as string).toLowerCase() != (data.email as string).toLowerCase()) && (customer[0].deviceID == session.deviceID)) {

            //         await __biZZC_SQS.SendMessage({
            //             action: 'NewVisitors',
            //             deviceinfo: session.deviceInfo,
            //             token: session.deviceID,
            //             params: req.params,
            //             nsp: session.nsp,
            //             sid: (session._id) ? session._id : session.id
            //         }, ARCHIVINGQUEUE)

            //     }
            //     else await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });

            // }
            let payload = { id: session.id, session: session };
            await Promise.all([
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: { state: 3, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } }),
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } }),
              await __biZZC_SQS.SendEventLog(EventLogMessages.USER_UPDATED_INFORMATION, (session._id) ? session._id : session.id)
            ])
          }
        } else res.status(401).send({ status: 'error' });

      } else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is updateUserInfo');
    res.status(401).send({ error: 'error' });
  }
});


router.post('/submitCustomSurvey', async (req, res) => {
  try {
    // console.log('submitCustomSurvey');

    // console.log(req.body);
    if (!req.body.sessionid || !req.body.customFeedback) res.status(401).send('Invalid Request!');
    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let sessionID = req.body.sessionid

      let session = await MakeActive({ id: sessionID, _id: sessionID } as VisitorSessionSchema);
      if (session) {

        if (session && (session.state == 4 || session.state == 3 || session.state == 2)) {
          let log = data.log;
          log.createdDate = new Date().toISOString();
          let result = await Conversations.UpdateDynamicPropertyByVisitor(data.cid, data.customFeedback, log);
          if (result && result.value) {
            // console.log(session);

            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateConversation', nsp: session.nsp, roomName: [session.agent.id], data: { cid: result.value._id, conversation: result.value } })

            res.send({ status: 'ok', result: result.value })
          }
          else res.send({ status: 'error' });
          // res.send({ status: 'ok' })

        } else res.status(401).send({ status: 'error' });

      } else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is submitCustomSurvey');
    res.status(401).send({ error: 'error' });
  }
});

router.post('/userinformation', async (req, res) => {
  try {




    if (!req.body.sessionid || !req.body.data) res.status(401).send('Invalid Request!');
    else {

      // console.log('userinfo');
      // console.log(req.body);
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body.data || {};
      let sessionID = req.body.sessionid
      /**
       * @Note :
       * Sepecial Case To Avoid Inacitivity Check When Submitting Registration. Because This User has been made active during this process
       * data['inactive] = false
       */
      let tempCopy = JSON.parse(JSON.stringify(data));
      data['inactive'] = false;

      let session = await MakeActive({ _id: sessionID, id: sessionID } as VisitorSessionSchema, (data && Object.keys(data).length) ? JSON.parse(JSON.stringify(data)) : undefined);

      if (session) {
        let agentSearch;
        agentSearch = await ApplyRuleSets(session, data)
        //console.log(agentSearch);

        let state = session.state
        let settings = await Company.getSettings(session.nsp)
        let companySettings;
        if (settings && settings.length) companySettings = settings[0];
        let greetingMessage: string = '';
        if (companySettings) {
          greetingMessage = companySettings['settings']['chatSettings']['greetingMessage'];
        }
        //For Debuggin UnComment Following Lines.
        let allAgents = await SessionManager.GetChattingAgents(session);
        if (!allAgents) {
          res.send({ status: 'noAgent' });
          return;
        } else {
          let locked = await __BIZZC_REDIS.GenerateSID(session.nsp, session._id);

          if (!locked) {
            let temp = await SessionManager.GetVisitorByID(session._id);
            if (temp && temp.state == 4) {
              data.state = 3;
              let promises: Array<any> = await Promise.all([
                SessionManager.UpdateUserInformation(temp, data),
                __BIZZC_REDIS.Increment(temp.nsp, temp._id)
              ]);
              if (promises[0]) {
                if ((data as Object).hasOwnProperty('inactive')) delete data.inactive
                let body = '';
                Object.keys(tempCopy).map(key => {
                  body += key + ' : ' + tempCopy[key] + '<br>';
                })
                body += 'country : ' + session.fullCountryName.toString() + '<br>';
                let credentials = {
                  from: temp.nsp,
                  to: temp.username,
                  body: body,
                  cid: '',
                  date: (new Date()).toISOString(),
                  type: 'Visitors',
                  attachment: false,
                  chatFormData: 'Credentials Updated',
                  delivered: true

                }

                res.send({
                  agent: promises[0].agent,
                  cid: promises[0].conversationID,
                  state: promises[0].state,
                  username: promises[0].username,
                  email: promises[0].email,
                  credentials: credentials,
                  greetingMessage: '',
                  phone: (promises[0].phone ? promises[0].phone : ''),
                  message: (promises[0].message) ? promises[0].message : ''
                });
              }

            } else { res.send({ status: 'invalidRequest' }) }
            return;
          } else {
            switch (session.state) {
              case 2:
              case 3:

                let updatedsession = await SessionManager.UpdateUserInformation(session, data);
                if (updatedsession) {
                  let conversation = await Conversations.GetConversationById((session.conversationID as any).toString());
                  if (conversation && conversation.length) {

                    let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                    Object.keys(tempCopy).map(key => {
                      temp += key + ' : ' + tempCopy[key] + '<br>';
                    })
                    temp += 'country : ' + session.fullCountryName.toString() + '<br>';
                    let credentials = {
                      from: session.nsp,
                      to: session.username,
                      body: temp,
                      cid: conversation[0]._id.toHexString(),
                      date: (new Date()).toISOString(),
                      type: 'Visitors',
                      attachment: false,
                      chatFormData: 'Credentials Updated',
                      delivered: true
                    }

                    res.send({
                      clientID: (conversation && conversation[0].clientID) ? conversation[0].clientID : '',
                      agent: updatedsession.agent,
                      cid: updatedsession.conversationID,
                      state: updatedsession.state,
                      username: updatedsession.username,
                      email: updatedsession.email,
                      credentials: credentials,
                      greetingMessage: '',
                      phone: (updatedsession.phone ? updatedsession.phone : ''),
                      message: (updatedsession.message) ? updatedsession.message : ''
                    });
                  } else res.send({ status: 'invalidRequest' })
                }
                return;
              case 4:
                session.state = 3;
                // console.log('Session Userinformation State 4 : ', session);
                let payload = { id: session.id, session: session };

                let temp = await SessionManager.UpdateUserInformation(session, data);
                if (temp) {

                  let promises = Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({
                      action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
                        status: 'credentialsUpdated',
                        username: data.username,
                        email: data.email,
                        phone: data.phone,
                        message: data.message
                      }
                    }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } }),
                    await Conversations.UpdateVisitorInfo(session.conversationID, (data.username as string), (data.email as string)),
                    await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)
                  ]);
                  await promises

                  // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)

                  // if (customer && customer.length) {

                  //     console.log(customer);
                  //     console.log(tempCopy);
                  //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && (customer[0].email as string).toLowerCase() == (tempCopy.email as string).toLowerCase()) console.log('same');
                  //     else console.log('different');


                  //     // if (tempCopy.email && ((tempCopy.email as string).toLowerCase().indexOf('unregistered') === -1)) await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: (data.phone) ? data.phone : '' });

                  // }


                  let conversation = await Conversations.GetConversationById((session.conversationID as any).toString());
                  if (conversation && conversation.length) {
                    let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                    Object.keys(tempCopy).map(key => {
                      temp += key + ' : ' + tempCopy[key] + '<br>';
                    })
                    temp += 'country : ' + session.fullCountryName.toString() + '<br>';
                    let credentials = {
                      from: session.nsp,
                      to: session.username,
                      body: temp,
                      cid: conversation[0]._id.toHexString(),
                      date: (new Date()).toISOString(),
                      type: 'Visitors',
                      attachment: false,
                      chatFormData: 'Credentials Updated',
                      delivered: true
                    }

                    res.send({
                      clientID: '',
                      agent: session.agent,
                      cid: session.conversationID,
                      state: session.state,
                      username: session.username,
                      email: session.email,
                      credentials: credentials,
                      greetingMessage: '',
                      phone: (session.phone ? session.phone : ''),
                      message: (session.message) ? session.message : ''
                    });
                  }
                } else res.status(403).send({ error: 'bad request' });
                return;
            }
          }


          let allocatedAgent: AgentSessionSchema | undefined;
          let cid: ObjectID = new ObjectID();

          if (companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim()) {


            let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '') : undefined;

            if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgentPriority(session, companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid, undefined, (agentSearch) ? agentSearch : '');
            if (UpdatedSessions && UpdatedSessions.agent) {
              session = UpdatedSessions.visitor as VisitorSessionSchema;
              allocatedAgent = UpdatedSessions.agent;
              if (allocatedAgent) {

                //Creating Conversation in Database
                //Conversation States:
                // 1. Conversation Created But No Agent Assignend
                // 2. Conversation Created and Got agent
                // 3. Conversation Ended
                let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID);

                //if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
                //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
                //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero.
                if (conversation) {
                  if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)

                  //Visitor State Data to Update
                  let payload = { id: session.id, session: session };

                  let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';

                  Object.keys(tempCopy).map(key => {
                    temp += key + ' : ' + tempCopy[key] + '<br>';
                  })
                  temp += 'country : ' + session.fullCountryName.toString() + '<br>';

                  let credentials = {
                    from: session.nsp,
                    to: session.username,
                    body: temp,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Visitors',
                    attachment: false,
                    chatFormData: 'Credentials Updated',
                    delivered: true

                  }
                  let messageinserted = await Conversations.insertMessage(credentials);
                  if (messageinserted) {
                    conversation.ops[0].messages.push(messageinserted.ops[0]);
                    if (!allocatedAgent.greetingMessage || (state == 5)) await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials);
                    else {
                      greetingMessage = allocatedAgent.greetingMessage;

                      if (conversation && greetingMessage) {
                        if (greetingMessage) {

                          let lastMessage = {
                            from: session.nsp,
                            to: session.username,
                            body: greetingMessage,
                            cid: conversation.insertedId.toHexString(),
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false,
                            delivered: true
                          }
                          let messageinsertedID = await Conversations.insertMessage(lastMessage);
                          conversation.ops[0].messages.push(messageinsertedID.ops[1]);
                          await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);

                        }
                      }
                    }
                  }
                  //Notify Allocated Agent That A New Conversation has been autoAssigned.
                  //Check if Allocated Agent is Still Active. Just a precautionary Case.
                  if (allocatedAgent) {


                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [(allocatedAgent.id as string)], data: conversation.ops[0] });

                  }
                  //Broadcast To All Agents That User Information and State Has Been Updated.
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });



                  res.send({
                    clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    agent: (allocatedAgent) ? session.agent : {},
                    cid: session.conversationID,
                    state: session.state,
                    username: session.username,
                    email: session.email,
                    credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                    phone: (session.phone ? session.phone : ''),
                    message: (session.message) ? session.message : ''
                  });

                  await __BIZZ_REST_REDIS_PUB.SendMessage({
                    action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
                      clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                      agent: (allocatedAgent) ? session.agent : {},
                      cid: session.conversationID,
                      state: session.state,
                      username: session.username,
                      email: session.email,
                      credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                      greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                      phone: (session.phone ? session.phone : ''),
                      message: (session.message) ? session.message : ''
                    }, excludeSender: true, sockID: req.body.socketID
                  });

                  let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                }


              } else {
                console.log('No Agent')
                res.send({ status: 'noAgent' });
              }

            } else {
              //console.log('No Agent')
              res.send({ status: 'noAgent' });
            }
            return;
          } else {
            let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '') : undefined;
            if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgent(session, cid, [], undefined, (agentSearch) ? agentSearch : '');

            if (UpdatedSessions) {

              // console.log('UpdatedSessions');

              allocatedAgent = UpdatedSessions.agent;
              session = UpdatedSessions.visitor as VisitorSessionSchema;
              //Creating Conversation in Database
              //Conversation States:
              // 1. Conversation Created But No Agent Assignend
              // 2. Conversation Created and Got agent
              // 3. Conversation Ended

              let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), (session.nsp as string), session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', (session.username as string), (allocatedAgent) ? 2 : 1, session.deviceID);

              //if(conversation)console.log('conversation');

              //Visitor State Data to Update
              let payload = { id: session.id, session: session }

              let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
              Object.keys(tempCopy).map(key => {
                temp += key + ' : ' + tempCopy[key] + '<br>';
              })
              temp += 'country : ' + session.fullCountryName.toString() + '<br>';
              let credentials = {
                from: session.nsp,
                to: session.username,
                body: temp,
                cid: conversation.insertedId.toHexString(),
                date: (new Date()).toISOString(),
                type: 'Visitors',
                attachment: false,
                chatFormData: 'Credentials Updated',
                delivered: true
              }
              let messageinserted = await Conversations.insertMessage(credentials);
              if (messageinserted) {

                //if(conversation)console.log('messageinserted');
                conversation.ops[0].messages.push(messageinserted.ops[0]);
                if ((allocatedAgent && !allocatedAgent.greetingMessage)) await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials);
                else if (allocatedAgent && allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
                if (conversation && greetingMessage) {

                  if (greetingMessage) {
                    let lastMessage = {
                      from: session.nsp,
                      to: session.username,
                      body: greetingMessage,
                      cid: conversation.insertedId.toHexString(),
                      date: (new Date()).toISOString(),
                      type: 'Agents',
                      attachment: false,
                      delivered: true
                    }
                    let messageinsertedID = await Conversations.insertMessage(lastMessage);
                    conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                    await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                  }

                }
              }



              //Update User Status Back to Visitor Window
              //Check if Allocated Agent is Still Active. Just a precautionary Case.
              if (allocatedAgent && conversation) {

                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [((allocatedAgent.id || allocatedAgent._id) as string)], data: conversation.ops[0] });
              }

              //Broadcast To All Agents That User Information and State Has Been Updated.
              // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload });
              // console.log('sending response');

              res.send({
                clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                agent: (allocatedAgent) ? session.agent : {},
                cid: session.conversationID,
                state: session.state,
                username: session.username,
                email: session.email,
                credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                phone: (session.phone ? session.phone : ''),
                message: (session.message) ? session.message : ''
              });

              if (conversation) {
                if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)
                await __BIZZ_REST_REDIS_PUB.SendMessage({
                  action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: {
                    clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    agent: (allocatedAgent) ? session.agent : {},
                    cid: session.conversationID,
                    state: session.state,
                    username: session.username,
                    email: session.email,
                    credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                    phone: (session.phone ? session.phone : ''),
                    message: (session.message) ? session.message : ''
                  }, excludeSender: true, sockID: req.body.socketID
                });
                let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
              }

              // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)

              // if (customer && customer.length) {

              //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && ((customer[0].email as string).toLowerCase() != (tempCopy.email as string).toLowerCase()) && (customer[0].deviceID == session.deviceID)) {
              //         console.log('new Visitor same device');

              //         session.email = tempCopy.email;
              //         session.username = tempCopy.username;
              //         session.phone = tempCopy.phone;
              //         await __biZZC_SQS.SendMessage({
              //             action: 'NewVisitors',
              //             deviceinfo: session.deviceInfo,
              //             token: session.deviceID,
              //             params: session,
              //             nsp: session.nsp,
              //             sid: (session._id) ? session._id : session.id
              //         }, ARCHIVINGQUEUE)

              //     }
              //     else await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: (data.phone) ? data.phone : '' });

              // }

            } else res.status(500).send({ error: 'internal server error' });
          }
        }
        if (tempCopy.email && ((tempCopy.email as string).toLowerCase().indexOf('unregistered') === -1)) await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: (data.phone) ? data.phone : '' });
      }
      else res.status(401).send({ error: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error is user information');
    res.status(401).send({ error: 'error' });
  }
});

// router.post('/checkSID/', async (req, res) => {
//     try {
//         // console.log('Check SID: ' + req.body.sid);


//         res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
//         res.header("Access-Control-Allow-Headers", "content-type");
//         res.header('Access-Control-Allow-Methods', 'POST');
//         res.header('Access-Control-Allow-Credentials', 'true');
//         res.header('Vary', 'Origin, Access-Control-Request-Headers');
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.header('Expires', '-1');
//         res.header('Pragma', 'no-cache');
//         if (!req.body.sid) { res.status(401).send(); return; }
//         let result = await __BIZZC_REDIS.Exists(req.body.sid);
//         if (result) res.status(200).send({ status: 'ok' });
//         else res.status(401).send();

//     } catch (error) {
//         res.status(401).send();
//         console.log(error);
//         console.log('error in checkingSID')
//     }
// });
router.post('/requestQueue', async (req, res) => {
  try {

    if (!req.body.sid || !req.body.sessionid) { res.status(401).send(); return; }

    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body


      let session = await SessionManager.getAgentByEmail(data.nsp, data.sessionid);

      if (!session) {
        res.status(401).send({ status: 'error' });
        return;
      }
      //Assigning Best Fit
      let UpdatedSessions;
      if (session) {
        if (!session.permissions.chats.canChat) res.status(401).send({ status: 'notAllowed' });
        else {
          UpdatedSessions = (session.permissions.chats.canChat) ? await SessionManager.AssignQueuedVisitor(session, data.sid) : undefined;

          if (UpdatedSessions && UpdatedSessions.agent) {
            session = UpdatedSessions.agent;
            let QueuedSession = UpdatedSessions.visitor;
            //Updating COnversation to Database.
            let conversation = (session.email) ? await Conversations.TransferChatUnmodified(QueuedSession.conversationID, session.email) : undefined;
            if (conversation && conversation.value) {
              //if ((conversation.value as any).hasOwnProperty("lastPickedTime")) {

              let queuedEvent: any = {
                nsp: session.nsp,
                agentSessionID: session._id,
                agentEmail: session.email,
                queuedOn: new Date().toISOString(),
              }
              //let updatedConversation = await Conversations.UpdateLastPickedTime(conversation.value._id, session.nsp)
              //if (updatedConversation) await Conversations.UpdateQueuedCount(conversation.value._id, session.nsp, queuedEvent)
              // }

              //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
              await SessionManager.UpdateChatQueHistory(QueuedSession, 'Agent');
              conversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);
              //console.log(conversation.value.messages);
              //Sending Notificiation to All Agent.
              // origin.to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
              // //UPDATE QUEUED SESSION VIA PUSH MESSAGE
              // origin.to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', { agent: QueuedSession.agent, state: 3 });
              // //UPDATE ASSIGNED AGENT CONVERSATIIONS
              // origin.to(Agents.NotifyOne(QueuedSession)).emit('newConversation', conversation.value);
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: QueuedSession.nsp, roomName: [Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } });
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: QueuedSession.nsp, roomName: [Visitor.NotifyOne(QueuedSession)], data: { agent: QueuedSession.agent, state: 3 } });
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: QueuedSession.nsp, roomName: [Agents.NotifyOne(QueuedSession)], data: conversation.value })


              res.send({ status: 'ok' });
              let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
            }
          } else res.status(401).send({ status: 'error' });
        }
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Request Queue');
    res.status(401).send({ status: 'error' });
  }
});
router.post('/transferChat', async (req, res) => {
  try {

    if (!req.body.visitor || !req.body.sessionid) { res.status(401).send(); return; }

    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body


      let agent = await SessionManager.GetAgentByID(data.sessionid);

      if (!agent) {
        res.status(401).send({ status: 'error' });
        return;
      }
      if (agent) {

        let visitor = await SessionManager.GetVisitorByID(data.visitor.toString());

        if (visitor && visitor.inactive) {
          res.send({ transfer: 'error-inactive', msg: "Can't Transfer Inactive Visitor" });
          return;
        }

        let TransferredAgent = await SessionManager.GetAgentByID(data.to.id)
        if (visitor) {
          console.log('visitor');
          // console.log(visitor);

          let unset = SessionManager.UnsetChatFromAgent(visitor);

          let UpdatedSessions = await SessionManager.AssignAgent(visitor, (TransferredAgent._id || TransferredAgent.id as string), visitor.conversationID);

          TransferredAgent = UpdatedSessions.agent;
          visitor = UpdatedSessions.visitor;
          agent = await unset;

          let conversation = (TransferredAgent.email) ? await Conversations.TransferChatUnmodified((visitor as VisitorSessionSchema).conversationID, TransferredAgent.email) : undefined;
          if (conversation && conversation.value) {

            let endSupervisedChat;

            if (conversation.value.superviserAgents && conversation.value.superviserAgents.length) endSupervisedChat = await Conversations.EndSuperVisedChat(conversation.value._id, (visitor as VisitorSessionSchema).nsp, (visitor as VisitorSessionSchema).agent.id)
            if (endSupervisedChat) {
              conversation.value.superviserAgents = endSupervisedChat.value.superviserAgents

            }

            (conversation.value.messageReadCount)
              ? conversation.value.messages = await Conversations.getMessages1((visitor as VisitorSessionSchema).conversationID)
              : [];

            let chatEvent = 'Chat Transferred from ' + agent.value.nickname + ' to ' + TransferredAgent.nickname
            // origin.to(Agents.NotifyAll()).emit('updateUser', { id: (visitor as VisitorSessionSchema).id, session: visitor });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: (visitor as VisitorSessionSchema).nsp, roomName: [Agents.NotifyAll()], data: { id: (visitor as VisitorSessionSchema).id, session: visitor } });
            let insertedMessage
            if (visitor) {

              insertedMessage = await CreateLogMessage({
                from: visitor.agent.name,
                to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
                body: chatEvent,
                type: 'Events',
                cid: (visitor.conversationID) ? visitor.conversationID : '',
                attachment: false,
                date: new Date().toISOString(),
                delivered: true,
                sent: true
              })
              // origin.to(Visitor.NotifyOne(visitor as VisitorSessionSchema)).emit('transferChat', { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent });
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'transferChat', nsp: (visitor as VisitorSessionSchema).nsp, roomName: [Visitor.NotifyOne(visitor as VisitorSessionSchema)], data: { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent } });
            }

            if (TransferredAgent) {

              if (insertedMessage) conversation.value.messages.push(insertedMessage)
              // origin.to(Agents.NotifyOne(visitor)).emit('newConversation', conversation.value);
              // socket.to(Agents.NotifyOne(agent.value)).emit('removeConversation', { conversation: conversation.value })


              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: (visitor as VisitorSessionSchema).nsp, roomName: [Agents.NotifyOne(visitor)], data: conversation.value })
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: (visitor as VisitorSessionSchema).nsp, roomName: [Agents.NotifyOne(agent.value)], data: { conversation: conversation.value } })
            }
            res.send({ transfer: 'ok' });
            let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_TRANSFERED, ((visitor as VisitorSessionSchema)._id) ? (visitor as VisitorSessionSchema)._id : (visitor as VisitorSessionSchema).id);
            //if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);

          } else res.status(401).send({ transfer: 'error' });

        } else {
          console.log('no visitor');
          res.status(401).send({ transfer: 'error' });
        }
      }

      else {
        console.log('no agent');
        res.status(401).send({ status: 'error' });
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in TransferChat');
    res.status(401).send({ transfer: 'error' });

  }
});
router.post('/getFormsByNSP', async (req, res) => {
  try {

    if (!req.body.sessionid) { res.status(401).send(); return; }

    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body

      let session = await SessionManager.getAgentByEmail(data.nsp, data.sessionid);

      if (!session) {
        res.status(401).send({ status: 'error' });
        return;
      }
      //Assigning Best Fit
      let UpdatedSessions;
      if (session) {
        let formFromDB = await FormDesignerModel.GetForms(data.nsp);

        res.send({ status: 'ok', form_data: (formFromDB && formFromDB.length) ? formFromDB : [] });

      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in gettings Canned forms');
    res.status(401).send({ status: 'error' });
  }
});

router.post('/requestQueAuto', async (req, res) => {
  try {

    if (!req.body.sessionid) { res.status(401).send(); return; }

    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body
      let session = await SessionManager.getAgentByEmail(data.nsp, data.sessionid);
      if (!session) {
        res.status(401).send({ status: 'error' });
        return;
      }
      //Assigning Best Fit
      let UpdatedSessions;
      if (session) {
        let origin = await Company.GetChatSettings(session.nsp)
        if (origin['settings']['chatSettings']['assignments'].aEng) {
          let result = await AutoAssignFromQueueAuto(session, true);
          if (result) res.send({ status: 'ok', more: true });
          else res.send({ status: 'ok', more: false });
        } else res.status(401).send({ status: 'not enabled' });
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Request Queue auto');
    res.status(401).send({ status: 'error' });
  }
});

router.post('/endSupervisedChat', async (req, res) => {
  try {


    if (!req.body.sessionid) { res.status(401).send(); return; }

    else {
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
      let data = req.body.data
      let session = await SessionManager.GetAgentByID(data.sessionid);
      if (!session) {
        res.status(401).send({ status: 'error' });
        return;
      }
      //Assigning Best Fit
      let UpdatedSessions;
      if (session) {

        let updatedConversation = await Conversations.GetConversationById(data.cid);
        if (updatedConversation && updatedConversation.length) {
          if (updatedConversation[0].superviserAgents && updatedConversation[0].superviserAgents.length) {

            let endSupervisedChat = await Conversations.EndSuperVisedChat(data.cid, session.nsp, session._id.toHexString())
            if (endSupervisedChat) {

              // if (data.removeChat) origin.to(Agents.NotifyOne(session)).emit('removeConversation', { conversation: updatedConversation[0] })
              if (data.removeChat) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedConversation[0] } })
              res.send({ status: 'ok' });
            }
            else res.status(401).send({ status: 'error' });
          }
        }
        else res.status(401).send({ status: 'error' });
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('error in ending supervising Chat');
    res.status(401).send({ status: 'error' });
  }
});

router.post('/stopVisitorChat', async (req, res) => {
  //  console.log('endChat');
  try {

    if (!req.body.sessionid) {
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

      let data = req.body
      let session = ((await SessionManager.GetAgentByID(data.sessionid)) as any);
      if (session) {
        if (data.conversation) {

          // let visitor = await SessionManager.GetVisitorByID(data.conversation.sessionid)
          // console.log(data.conversation.missed);
          let updatedConversation = (data.conversation.missed) ? await Conversations.StopChat(data.conversation._id, 1) : await Conversations.StopChat(data.conversation._id);

          // if (!updatedConversation || !updatedConversation.ok) updatedConversation = await Conversations.StopChat(data.conversation._id, 1);
          //console.log(updatedConversation);

          if (updatedConversation && updatedConversation.ok) {
            let conversation = await Conversations.GetConversationById(data.conversation._id);
            // origin.to(Agents.NotifyAll()).emit('stopChat', updatedConversation.value);
            if (conversation && conversation.length) {
              res.send({ status: 'ok', conversation: conversation[0] })
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'stopChat', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: conversation[0] });
            }
            else res.status(401).send({ status: 'error' });
          } else {
            res.status(401).send({ status: 'error' });
          }
        } else {
          res.status(401).send({ status: 'error' });
        }
      }
      else res.status(401).send({ status: 'error' });
    }
  }
  catch (error) {
    res.status(401).send();
    console.log(error)
  }
});

router.post('/addConversationTags', async (req, res) => {
  //  console.log('addConversationTags');
  try {

    if (!req.body.sessionid) {
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

      let data = req.body
      let session = ((await SessionManager.GetAgentByID(data.sessionid)) as any);
      if (session) {
        let result = await Conversations.addConversationTags(data._id, session.nsp, data.tag, data.conversationLog);

        if (result && result.value) {

          res.send({ status: 'ok' });
        } else {
          res.status(401).send({ status: 'error' });
        }
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log(error);
    console.log('Error in Adding Tags');
  }
});
router.post('/deleteConversationTag', async (req, res) => {
  //  console.log('deleteConversationTag');
  try {

    if (!req.body.sessionid) {
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

      let data = req.body
      let session = ((await SessionManager.GetAgentByID(data.sessionid)) as any);
      if (session) {
        let result = await Conversations.deleteConversationTag(data._id, session.nsp, data.tag, data.index);

        if (result && result.value) {


          res.send({ status: 'ok', deletedresult: result.value.tags });

        } else {
          res.status(401).send({ status: 'error', msg: 'could not delete tag' });
        }
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log(error);
    console.log('Error in deleting Tags');
  }
});


router.post('/botTransferToAgent', async (req, res) => {
  try {

    if (!req.body.sessionid) {
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

      let data = req.body
      let session = ((await SessionManager.GetAgentByID(data.sessionid)) as any);
      if (session) {
        await AssignChatToVisitorAuto(session)

        res.send({ status: 'ok' });
      }
      else res.status(401).send({ status: 'error' });
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log(error);
    console.log('Error in transferring chat from bot to agent');
  }
});

router.post('/endChat', async (req, res) => {

  try {

    if (!req.body.sid) {
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

      let data = req.body
      let alreadyEnded = false
      let session = ((await SessionManager.GetVisitorByID(req.body.sid)) as any);
      if (!session) {
        alreadyEnded = true
        session = await visitorSessions.getVisitorSession(data.sid);
      }
      if ((session && !alreadyEnded) || (alreadyEnded && session && session.length)) {
        if (session.inactive && data.chatEndedByAgent) {
          res.send({ status: 'error-inactive', msg: "Can't End Chat of Inactive Visitor" });
          return;
        }
        let origin = await Company.getSettings(session.nsp);
        if (session.conversationID) {
          let sessionData = await SessionManager.GetSessionForChat((session._id || session.id) as string)
          let updatedConversation = (session.state == 2) ? await Conversations.EndChatMissed(session.conversationID, (data) ? data : '') : await Conversations.EndChat(session.conversationID, true, (data) ? data : '');
          // let updatedConversation = await Conversations.EndChat(session.conversationID, true, sessionData, (data.survey) ? data.survey : '');

          //if (updatedConversation && updatedConversation.value && !updatedConversation.value.agentEmail) (updatedConversation.value.missed) ? await Conversations.StopChat(updatedConversation.value._id, 1) : await Conversations.StopChat(updatedConversation.value._id);;

          if (updatedConversation && updatedConversation.value) {
            if (data.chatEndedByAgent) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'endChatByAgent', nsp: session.nsp, roomName: [session.id || session._id], data: {} });

            await SessionManager.RemoveSession(session, (session.state == 8) ? false : true);
            __BIZZC_REDIS.SetID(session._id || session.id, 5);
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
            // console.log('Chat End')
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id || session._id });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allPopUpWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allHelpSupportWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} });
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedConversation.value }, });

            if (session.state == 8) {
              let agents = await SessionManager.GetIDsOfBotAuthorizedAgents(session.nsp);
              if (agents && agents.length) {


                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [agents], data: { conversation: updatedConversation.value }, });
              }
            }
            res.status(200).send({ status: 'ok', conversation: (updatedConversation && updatedConversation.value) ? updatedConversation.value : '' })
            // if (origin && origin[0]['settings']['chatSettings']['assignments'].aEng && session.agent && session.agent.id) {
            //     let result = await AutoAssignFromQueueAuto(session);
            //     // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'autoQueueAssign', data: session })
            // }
            // if (updatedConversation && updatedConversation.value && updatedConversation.value.superviserAgents && updatedConversation.value.superviserAgents.length) {
            //     let rooms = [];
            //     updatedConversation.value.superviserAgents.forEach(agentID => { return agentID.toHexString(); });
            //     if (rooms.length) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: rooms, data: { conversation: updatedConversation.value }, });
            // }
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
            type: "Events",
            cid: session.conversationID ? session.conversationID : "",
            attachment: false,
            date: new Date().toISOString(),
            chatFormData: ''
          };

          endChatMsg.from = (data.chatEndedByAgent) ? session.agent.name : (session.username) ? session.username : "";
          endChatMsg.to = (data.chatEndedByAgent) ? session.username : session.agent ? session.agent : undefined;
          endChatMsg.body = 'Chat ended by ' + ((data.chatEndedByAgent) ? session.agent.name : session.username);

          let endChatMessage = await CreateLogMessage(endChatMsg)
          if (endChatMessage) {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: endChatMessage })
          }
          //}
          if (updatedConversation && updatedConversation.value) {
            let unAssignedTicket;

            if ((!session.agent.id && (session.state == 2)) && (session.email && (session.email as string).toLowerCase() != 'unregistered')) {

              unAssignedTicket = await ChatToTicket(updatedConversation.value, data.timeZone)
            }

            let event = 'Chat Ended';
            let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (session._id) ? session._id : session.id);
          }
        }
        // else if (session.state == 8) {

        //     let deleted = await SessionManager.RemoveSession(session, true);

        //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id });
        //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
        //     if (deleted) res.status(200).send({ status: 'ok' });
        // }

      }
      else {
        res.status(401).send();
      }
    }
  }
  catch (error) {
    console.log('error in ending Chat by ' + ((req.body.chatEndedByAgent) ? 'Agent side' : 'Visitor side'));

    res.status(401).send();
    console.log(error)
  }
});
router.post('/InsertSimilarCustomers', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let sessionID = req.body.sessionid

    let conversation = await Conversations.InsertSimilar(data.allCustomers, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is inserting similar customers');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/InsertCustomerInfo', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let sessionID = req.body.sessionid

    let conversation = await Conversations.InsertCustomerInfo(data.customerInfo, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is insert customer info');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/SaveFormDetails', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let sessionID = req.body.sessionid

    let conversation = await Conversations.InsertFormDetails(data.stockFormData, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is  save Form Details');
    res.status(401).send({ error: 'error' });
  }

})
router.post('/InsertStock', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let sessionID = req.body.sessionid

    let conversation = await Conversations.InsertStockList(data.stockList, data.stockURL, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is insert stock');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/RemoveStock', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    // let sessionID = req.body.sessionid

    let conversation = await Conversations.RemoveStockList(data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is remove stock');
    res.status(401).send({ error: 'error' });
  }

});

router.post('/InsertStockData', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body

    let stock = await Stock.InsertStockData(data.cid, data.nsp, data.email, data.make, data.car, data.model, data.type, data.dealerStock, data.country, data.location);

    if (stock) {

      res.send({ status: 'ok', stock: stock });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is insert stock data');
    res.status(401).send({ error: 'error' });
  }

});



router.post('/InsertID', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body

    let conversation = await Conversations.InsertCustomerID(data.customerID, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error is insertID');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/IsCustomer', async (req, res) => {
  try {
    //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    //else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body

    let conversation = await Conversations.InsertCustomerRegistration(data.registered, data.cid, data.nsp);
    if (conversation && conversation.value) {

      res.send({ status: 'ok', conversation: conversation.value });
    }
    else {
      res.status(401).send({ error: 'error' });
    }
    //  }
    //else res.status(401).send({ error: 'error' });
    // }
  } catch (error) {
    console.log(error);
    console.log('error in ISCustomer');
    res.status(401).send({ error: 'error' });
  }

});

router.post('/MasterData', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let masterDataDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=2oemNvWziDt2XxZXfL6jSJBFj8NbH8SoycTgyDKYaJ9/iALDs1ap7Q==";
    let masterDataStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=o9mhVZ8tAmTagZHYXFLTx6BzyqtUtCHahZqnp7S7ovZJqQ2kPRjBMQ==";
    let masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
    //console.log(data)
    let masterData = {
      "MasterDataTypeId": data.ID
    }
    // console.log(customerData)
    let response = await request.post({
      uri: masterDataProductionURL,
      body: masterData,
      json: true,
      timeout: 10000
    });
    //  console.log(JSON.parse(JSON.stringify(response)),masterDataProductionURL)

    if (response) {
      //console.log(JSON.parse(JSON.stringify(response)))
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/CarNameMasterData', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let carNameDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetCarNameMasterData?code=l1mciaC5LY2fiTnoiZvOt4JbRxmC5UFqLeziJlKrMuss4NcdBrJFSA==";
    let carNameStagingURL = "";
    let carNameProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net//api/GetCarNameMasterData?code=GoXj3gRhXvdaSmy/Uxx2dunpamAUx7somiibev46CGYB51q1/4kCEg==";
    //console.log(data)
    let carName = {
      "CarMakerId": data.ID
    }
    // console.log(customerData)
    let response = await request.post({
      uri: carNameProductionURL,
      body: carName,
      json: true,
      timeout: 10000
    });
    if (response) {
      //console.log(JSON.parse(JSON.stringify(response)))
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/CarModelMasterData', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let carModelDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=WV3zhkC31HFA3ujdfFUuu8lsXILXK6gjoMhdDuHFq3X/Zg1HQDfPXg==";
    let carModelStagingURL = "";
    let carModelProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=/UT70VoszwZEHV70Fwfco2UTdLXvq/yG4Um9X/kUNS/0QNcEuo7HDA==";
    //console.log(data)
    let carModel = {
      "CarMakerId": data.makerID,
      "CarName": data.nameID
    }
    // console.log(customerData)
    let response = await request.post({
      uri: carModelProductionURL,
      body: carModel,
      json: true,
      timeout: 10000
    });
    if (response) {
      //console.log(JSON.parse(JSON.stringify(response)))
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/SalesAgent', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body
    let SalesAgentDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=XJRNKdOqz0wVZ70OS1PnyKENagzTTBDqPUKraprB/2DAgEJY431lEw==";
    let SalesAgentStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=8y95oYD4MKeY2lNa0N5wzufLfv1ZJKOklBG47x1FHaBemCJTFbooHQ==";
    let SalesAgentProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=jdTaSwW7fA63CXiPdKcKFwS/5x9cPhscWlaW9TsmepX/idjPZpXu6g==";
    //console.log(data)
    let agentsList = {
      "CountryId": data.ID,
      "IncOrganizerFlg": "1",
      "IncDivisionManagerFlg": "1",
      "IncGeneralManagerFlg": "1",
      "IncLocalManagerFlg": "1",
      "IncRegularEmplyeeFlg": "1",
      "IncMarketingFlg": "1"
    }
    // console.log(customerData)
    let response = await request.post({
      uri: SalesAgentProductionURL,
      body: agentsList,
      json: true,
      timeout: 10000
    });
    if (response) {
      //  console.log(response)
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    console.log(error);
    console.log('error in Master Data');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/CheckRegistration', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let checkRegistrationDevelopment = "https://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=5LvO9KTTXAkEnka14rDoSKR0T8mSytIEl/fA7zBE5Os4wc3rZArOTw==";
    let checkRegistrationStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==";
    let checkRegistrationProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==";
    let data = req.body
    let customerData = {
      "MailAddress": (data.custData) ? data.custData.trim().toLowerCase() : '',
      "PhoneNumber": (data.phone) ? data.phone : '',
      "StockId": '',
      "CustomerId": (data.customerID) ? data.customerID : '',
    }
    let response = await request.post({
      uri: checkRegistrationProduction,
      body: customerData,
      json: true,
      timeout: 80000
    });
    if (response) {
      //  console.log(response)
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in getting registered customer');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/RegisterCustomer', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let registerCustomerDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=VG8ShVbAq5QVfb8K0mkanDeoq63qz9aN0KIcppb1CCYGNRNSGO3fTA==";
    let registerCustomerStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=PdSaRLUU48BkwakllFMnYcaHIEZ7qpvJbaOm11i88rGvoEAmLPYOcQ==";
    let registerCustomerProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=EJpXGBballVmi1R9prsk6P5/wpqFMsA3p233Iib41rmBS75wTf6cog==";
    let data = req.body
    // console.log(data)
    let customerData = {
      "CustomerName": data.details.customerName,
      "FirstName": (data.details.firstName) ? data.details.firstName : '',
      "LastName": (data.details.lastName) ? data.details.lastName : '',
      "DestinationCountryCode": data.details.destCountryCode,
      "ArrivalPortId": data.details.arrivalPortId,
      "CustomerTypeId": data.details.customerTypeId,
      "SalePersonUserCode": data.details.salePersonUserCode,
      "ContactPhoneTypeId": data.details.contactPhoneTypeId,
      "ContactPhonePerson": data.details.ContactPhonePerson,
      "ContactPhoneNumber": data.details.contactPhoneNumber,
      "ContactMailPerson": data.details.ContactMailPerson,
      "ContactMailEmailAddress": data.details.contactMailEmailAddress,
      "HomePageOnFlg": data.details.homePageOnFlg,
      "MyPageOnFlg": data.details.myPageOnFlg,
      "BulkEmailFlg": data.details.bulkEmailFlg,
      "WhyNotBuyReasonCode": "1",
      "BulkEmailStocklistFlg": data.details.bulkEmailStockListFlg,
      "IntroducerCode": data.details.introducerCode,
      "CreateUserCode": data.details.createUserCode
    }
    // console.log(customerData)
    let response = await request.post({
      uri: registerCustomerProduction,
      body: customerData,
      json: true,
      timeout: 30000
    });
    if (response) {
      //  console.log(response)
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in registered customer');
    res.status(401).send({ error: 'error' });
  }

});
router.post('/StockList', async (req, res) => {
  try {
    // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
    // else {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let stockListDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=cz/pawVzhNIbPWMy7k8FKH9zwLp06plOPptpJod94xSNak30QGBL1A=="
    let stockListStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=BjZWOSwbrxaPeGzlt7niyAVXkjIEOQFB/yOmKoASruoTkVKOc5Qy8g=="
    let stockListProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=xRBzDwCHhxUL4asObsBT94bXnR0X5wLwE9TZsIQNmej61nfUllooWw=="
    let data = req.body
    // console.log(data)
    let stockList = {
      "CustomerCountryId": data.details.customerCountryId,
      "CurrencyId": data.details.currencyId,
      "DestinationCountryId": data.details.destinationCountryId,
      "DestinationPortId": data.details.destinationPortId,
      "ShipmentId": data.details.shipmentId,
      "FreightPaymentId": data.details.freightPaymentId,
      "Insurance": data.details.insurance,
      "SortingTypeId": data.details.sortingTypeId,
      "MakerId": (data.details.makerId) ? data.details.makerId : '',
      "CarName": (data.details.carName) ? data.details.carName : '',
      "ModelCode": (data.details.modelCode) ? data.details.modelCode : '',
      "SteeringId": (data.details.steeringId) ? data.details.steeringId : '',
      "BodyTypeId": (data.details.bodyTypeId) ? data.details.bodyTypeId : '',
      "SubBodyTypeId": (data.details.subBodyTypeId) ? data.details.subBodyTypeId : '',
      "DriveId": (data.details.driveId) ? data.details.driveId : '',
      "RegYearFrom": (data.details.regYearFrom) ? data.details.regYearFrom : '',
      "RegYearTo": (data.details.regYearTo) ? data.details.regYearTo : '',
      "RegMonthFrom": (data.details.regMonthFrom) ? data.details.regMonthFrom : '',
      "RegMonthTo": (data.details.regMonthTo) ? data.details.regMonthTo : '',
      "VehiclePriceFrom": (data.details.vehiclePriceFrom) ? data.details.vehiclePriceFrom : '',
      "VehiclePriceTo": (data.details.vehiclePriceTo) ? data.details.vehiclePriceTo : '',
      "CcFrom": (data.details.ccFrom) ? data.details.ccFrom : '',
      "CcTo": (data.details.ccTo) ? data.details.ccTo : '',
      "MileageFrom": (data.details.mileageFrom) ? data.details.mileageFrom : '',
      "MileageTo": (data.details.mileageTo) ? data.details.mileageTo : '',
      "Transmission": (data.details.transmission) ? data.details.transmission : '',
      "FuelId": (data.details.fuelId) ? data.details.fuelId : '',
      "ColorId": (data.details.colorId) ? data.details.colorId : '',
      "ProdYearFrom": (data.details.prodYearFrom) ? data.details.prodYearFrom : '',
      "ProdYearTo": (data.details.prodYearTo) ? data.details.prodYearTo : '',
      "EngineTypeName": (data.details.engineTypeName) ? data.details.engineTypeName : '',
      "BodyLengthId": (data.details.bodyLengthId) ? data.details.bodyLengthId : '',
      "LoadingCapacityId": (data.details.loadingCapacityId) ? data.details.loadingCapacityId : '',
      "TruckSize": (data.details.truckSize) ? data.details.truckSize : '',
      "EmissionCode3": (data.details.emissionCode3) ? data.details.emissionCode3 : '0',
      "PurchaseCountryId": (data.details.purchaseCountryId) ? data.details.purchaseCountryId : '',
      "LocationPortId": (data.details.locationPortId) ? data.details.locationPortId : '',
      "AccessoryAB": (data.details.accessoryAB) ? data.details.accessoryAB : '0',
      "AccessoryABS": (data.details.accessoryABS) ? data.details.accessoryABS : '0',
      "AccessoryAC": (data.details.accessoryAC) ? data.details.accessoryAC : '0',
      "AccessoryAW": (data.details.accessoryAW) ? data.details.accessoryAW : '0',
      "AccessoryBT": (data.details.accessoryBT) ? data.details.accessoryBT : '0',
      "AccessoryFOG": (data.details.accessoryFOG) ? data.details.accessoryFOG : '0',
      "AccessoryGG": (data.details.accessoryGG) ? data.details.accessoryGG : '0',
      "AccessoryLS": (data.details.accessoryLS) ? data.details.accessoryLS : '0',
      "AccessoryNV": (data.details.accessoryNV) ? data.details.accessoryNV : '0',
      "AccessoryPS": (data.details.accessoryPS) ? data.details.accessoryPS : '0',
      "AccessoryPW": (data.details.accessoryPW) ? data.details.accessoryPW : '0',
      "AccessoryRR": (data.details.accessoryRR) ? data.details.accessoryRR : '0',
      "AccessoryRS": (data.details.accessoryRS) ? data.details.accessoryRS : '0',
      "AccessorySR": (data.details.accessorySR) ? data.details.accessorySR : '0',
      "AccessoryTV": (data.details.accessoryTV) ? data.details.accessoryTV : '0',
      "AccessoryWAB": (data.details.accessoryWAB) ? data.details.accessoryWAB : '0',
    }

    // console.log(stockList)
    let response = await request.post({
      uri: stockListDevelopment,
      body: stockList,
      json: true,
      timeout: 40000
    });
    if (response) {
      //  console.log(response)
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ error: 'error' });

  } catch (error) {
    console.log(error);
    console.log('error in Stock  Search');
    res.status(401).send({ error: 'error' });
  }

});

router.post('/submitSurveyAfterEndChat/', async (req, res) => {
  // console.log('submitSurvey');

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

router.post('/updateChatDynamicProperty', async (req, res) => {
  try {

    if (!req.body.sessionid) res.status(401).send('Unauthorized!');
    else {

      let data = req.body;
      let agent = await SessionManager.GetAgentByID(data.sessionid)
      if (agent) {
        let log = data.log;
        log.createdDate = new Date().toISOString();
        let result = await Conversations.UpdateDynamicProperty(data.cid, data.name, data.value, log);
        if (result && result.value) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateConversation', nsp: data.nsp, roomName: [agent._id], data: { cid: result.value._id, conversation: result.value } })
          res.send({ status: 'ok', result: result.value })
        }
        else res.send({ status: 'error' });
      }
      else res.status(401).send('Invalid Request!');
    }
  } catch (err) {
    console.log(err);
    console.log('Error in changing dynamic property');
    res.status(401).send('Invalid Request!');
  }
});




export const chatRoutes: express.Router = router;