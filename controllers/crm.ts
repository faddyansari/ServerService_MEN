
import { Visitor } from "../models/visitorModel";
import { Conversations } from "..//models/conversationModel";
import { visitorSessions } from "..//models/visitorSessionmodel";
import { Tickets } from "..//models/ticketsModel";
import { SessionManager } from "../globals/server/sessionsManager";
import * as express from "express";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";

let router = express.Router();

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
});


router.post('/customerList', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");

    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {

      let list = await Visitor.getAllVisitorsByToken(session.nsp, data.token, data.id ? data.id : '');

      if (list && list.length) {
        ////console.log(list.length);

        let filter;
        let filterToken = (data.token && (data.token == 'email')) ? 'visitorEmail' : 'deviceID'

        let updatedList = list.map(async customer => {

          filter = (data.token && (data.token == 'email') && customer.email) ? (customer.email) : customer.deviceID ? customer.deviceID : '';
          // ////console.log(filter);
          let convo: any = await Conversations.GetCustomerConversationCount(filter, session.nsp, filterToken);
          // let convo = await Conversations.getCustomerConversations(customer.deviceID, socket.handshake.session.nsp, data.token);

          // if (convo) ////console.log(convo);
          if (convo && convo.length) customer.convoLength = convo[0].count;
          else customer.convoLength = 0

          return customer
        });
        await Promise.all(updatedList);
        res.send({ status: 'ok', list: list });
      }
      else res.send({ status: 'ok', list: [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });

  } catch (err) {
    console.log(err);
    console.log('Error in getting customerList');
    res.status(401).send('Invalid request');
  }
});


router.post('/customerFilteredList', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let list = await Visitor.getAllVisitorsByToken(session.nsp, data.token, data.id ? data.id : '', data.filters);

      if (list) ////console.log(list.length);

        if (list && list.length) {

          res.send({ status: 'ok', list: list });
        }
        else res.send({ status: 'ok', list: [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });

  } catch (err) {
    console.log(err);
    console.log('Error in getting filtered customerList');
    res.status(401).send('Invalid request');
  }
});


router.post('/CustomerConversationsList', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';

      let filterToken = (data.token && (data.token == 'email')) ? 'visitorEmail' : 'deviceID'
      let conversations: any;

      if (data && data.deviceID) conversations = await Conversations.getCustomerConversations(filter, session.nsp, filterToken, (data._id) ? data._id : '')
      let chatsCheck;
      if (conversations && conversations.length > 0) chatsCheck = await Conversations.GetCustomerConversationCount(filter, session.nsp, filterToken, conversations[conversations.length - 1]._id);
      let noMoreChats;
      if (chatsCheck && chatsCheck.length && chatsCheck[0].count) noMoreChats = false
      else noMoreChats = true;
      res.send({ status: 'ok', conversations: (conversations && conversations.length) ? conversations : [], noMoreChats: noMoreChats });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in getting Customer Conversations');
    res.status(401).send('Invalid request');
  }
});

router.post('/CustomerTicketsList', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let tickets: any;
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
      let filterToken = (data.token && (data.token == 'email')) ? 'visitor.email' : 'deviceID'

      if (data && data.email) tickets = await Tickets.getTicketsByVisitorData(filter, session.nsp, filterToken)

      res.send({ status: 'ok', tickets: (tickets && tickets.length) ? tickets : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });

  } catch (err) {
    console.log(err);
    console.log('Error in CustomerTicketsList');
    res.status(401).send('Invalid request');
  }
});

router.post('/MoreCustomerConversationsList', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let conversations = await Conversations.getMoreConversationsByDeviceID(data.deviceID, data.id, session.nsp)

      let chatsCheck;
      if (conversations && conversations.length > 0) chatsCheck = await Conversations.getMoreConversationsByDeviceID(data.deviceID, conversations[conversations.length - 1]._id, session.nsp);

      let noMoreChats;
      if (chatsCheck && chatsCheck.length) noMoreChats = false
      else noMoreChats = true
      res.send({ status: 'ok', conversations: conversations, noMoreChats: noMoreChats });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in MoreCustomerConversationsList');
    res.status(401).send('Invalid request');
  }
});


router.post('/SelectedConversationDetails', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let msgs = await Conversations.getMessagesByCid(data.cid);
      res.send({ status: 'ok', msgList: msgs });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in SelectedConversationDetails');
    res.status(401).send('Invalid request');
  }
});



router.post('/searchCustomersTokenBased', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let customerList = await Visitor.searchCustomersTokenBased(session.nsp, data.keyword, data.token, data.chunk);
      if (customerList && customerList.length) {
        let filter;
        let filterToken = (data.token && (data.token == 'email')) ? 'visitorEmail' : 'deviceID'
        let updatedList = customerList.map(async customer => {

          filter = (data.token && (data.token == 'email') && customer.email) ? (customer.email) : customer.deviceID ? customer.deviceID : '';
          let convo: any = await Conversations.GetCustomerConversationCount(filter, session.nsp, filterToken);
          if (convo && convo.length) customer.convoLength = convo[0].count;
          else customer.convoLength = 0

          return customer
        });
        await Promise.all(updatedList);
        res.send({ status: 'ok', customerList: customerList });
      }

      //if (customerList.length) callback({ status: 'ok', customerList: customerList });
      else res.send({ customerList: [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in searchCustomersTokenBased');
    res.status(401).send('Invalid request');
  }
});



// router.post('/searchCustomers', async (req, res) => {
//   try {
//     let data = req.body
//     if (!data) res.status(401).send("Invalid Request!");
//     let session;
//     if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
//     if (session && session.permissions.crm && session.permissions.crm.enabled) {
//       let customerList = await Visitor.searchCustomers(session.nsp, data.keyword, data.chunk);
//       // ////console.log(customerList);
//       if (customerList && customerList.length) {
//         let updatedList = customerList.map(async customer => {
//           let convo = await Conversations.getCustomerConversations(customer.deviceID, session.nsp);

//           if (convo && convo.length) customer.convoLength = convo.length;
//           else customer.convoLength = 0

//           return customer
//         });
//         await Promise.all(updatedList);
//         res.send({ status: 'ok', customerList: customerList });
//       }

//       //if (customerList.length) callback({ status: 'ok', customerList: customerList });
//       else res.send({ customerList: [] });
//     }
//     else res.status(401).send({ status: 'Unauthorized' });
//   } catch (err) {
//     console.log(err);
//     console.log('Error in searchCustomers');
//     res.status(401).send('Invalid request');
//   }
// });



router.post('/getCrmSessionDetails', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let sessionDetails = await visitorSessions.getVisitorSession(data.session._id)

      res.send({ status: 'ok', sessionDetails: (sessionDetails && sessionDetails.length) ? sessionDetails : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in getCrmSessionDetails');
    res.status(401).send('Invalid request');
  }
});



router.post('/customerSessions', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let search = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';

      let sessionDetails = await visitorSessions.getVisitorSessionByIDs(data.sessions, search, data.token, session.nsp, data.filters);
      ////console.log(sessionDetails);

      res.send({ status: 'ok', sessionDetails: (sessionDetails && sessionDetails.length) ? sessionDetails : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in customerSessions');
    res.status(401).send('Invalid request');
  }
});


router.post('/CustomerSources', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';

      let sources = await visitorSessions.GetSourcesForCustomer(filter, data.token, session.nsp);

      res.send({ status: 'ok', sources: (sources && sources.length) ? sources : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in CustomerSources');
    res.status(401).send('Invalid request');
  }
});



router.post('/CustomerAgents', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';

      let agents = await visitorSessions.GetAgentsForCustomer(filter, data.token, session.nsp);
      ////console.log(agents);

      res.send({ status: 'ok', agents: (agents && agents.length) ? agents : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in CustomerAgents');
    res.status(401).send('Invalid request');
  }
});



router.post('/getPeriodicSessionCounts', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
      let visits = await visitorSessions.GetSessionCountsPeriodically(session.nsp, filter, data.sessionIDs, data.token, data.filters);
      // if (visits) ////console.log(visits);

      res.send({ status: 'ok', visits: (visits && visits.length) ? visits : [] });
    }
    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in getPeriodicSessionCounts');
    res.status(401).send('Invalid request');
  }
});



router.post('/getReferrerCounts', async (req, res) => {
  try {
    let data = req.body
    if (!data) res.status(401).send("Invalid Request!");
    let session;
    if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
    if (session && session.permissions.crm && session.permissions.crm.enabled) {
      let filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
      let referrers = await visitorSessions.GetReferrerCountsPeriodically(session.nsp, filter, data.sessionIDs, data.token, data.filters);
      // if (visits) ////console.log(visits);

      res.send({ status: 'ok', referrers: (referrers && referrers.length) ? referrers : [] });
    }

    else res.status(401).send({ status: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    console.log('Error in getReferrerCounts');
    res.status(401).send('Invalid request');
  }
});

export const crmRoutes: express.Router = router;