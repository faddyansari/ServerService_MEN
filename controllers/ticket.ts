import * as express from "express";
import { Tickets } from "../models/ticketsModel";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import { SessionManager } from "../globals/server/sessionsManager";
import { Company } from "../models/companyModel";
import { performance } from "perf_hooks";
import { TeamsModel } from "../models/teamsModel";
import { Agents } from "../models/agentModel";
import * as XLSX from 'xlsx';
import { ObjectID } from "mongodb";
import { ComposedTicketENUM, TicketLogMessages } from "../globals/config/ticketEnums";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import { EmailService } from "../services/emailService";
import { FeedBackSurveyModel } from "../models/FeedBackSurveyModel";
import { TokenSchema } from "../schemas/tokenSchema";
import { Tokens } from "../models/tokensModel";
import { EmailActivations } from "../models/emailActivations";
import { S3, AWSError, SQS } from "aws-sdk";
import { SLAPolicyModel } from "../models/SLAPolicyModel";
import { ticketEmail, rand } from "../globals/config/constants";
import { TicketSchema } from "../schemas/ticketSchema";
import { TicketMessageSchema } from "../schemas/ticketMessageSchema";
import { RuleSetDescriptor } from "../actions/TicketAbstractions/RuleSetExecutor";
import { TicketLogSchema } from "../schemas/ticketLogSchema";
import { AgentListInfo, RuleSetSchema } from "../schemas/ticketGroupsSchema";
import * as request from 'request-promise';
import { TicketTemplateModel } from "../models/ticketTemplateModel";
import { FormDesignerModel } from "../models/FormDesignerModel";
import { TicketScenariosModel } from "../models/ticketScenariosModel";
import * as cheerio from 'cheerio';
import { TicketsDB } from "../globals/config/databses/TicketsDB";
import { Utils } from "../actions/agentActions/Utils";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";

let router = express.Router();

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

      res.locals.sessionObj = session;
      next();
    }
    else res.status(401).send({ err: 'unauthorized' });
  }
  else res.status(401).send({ err: 'unauthorized' });
  // next();
  // } else {
  //   // console.log('headers', req.headers);
  //   // console.log('refferer', req.headers.referer);
  //   // console.log('req URL', req.url);

  //   res.status(401).send({ err: 'unauthorized' });
  // }
})
/* #region  Tickets Getter Methods*/
router.post('/getTickets', async (req, res) => {
  try {
    // console.log(res.locals.sessionObj);
    let data = req.body;
    let sessionObj = res.locals.sessionObj;
    if (!data.email || !data.nsp) res.status(401).send('Invalid Request!');
    let session = await SessionManager.GetSessionByEmailFromDatabase(sessionObj.email, sessionObj.nsp);
    if (session) {
      let ticketPermissions = session.permissions.tickets;
      let company = await Company.getCompany(session.nsp);
      if (company && company.length) {
        // var t0 = performance.now();
        let tickets = await Tickets.getTickets(session.nsp, session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, data.limit, company[0].settings.solrSearch);
        // var t1 = performance.now();
        // console.log(session.email + " call to Get Tickets took " + (t1 - t0) + " milliseconds.");
        res.send({ status: 'ok', tickets: (tickets && tickets[0].length) ? tickets[0] : [], ended: (tickets && tickets[0].length >= 50) ? false : true, count: (tickets && tickets[1].length) ? tickets[1] : [{ state: 'OPEN', count: 0 }, { state: 'PENDING', count: 0 }, { state: 'CLOSED', count: 0 }] });
      } else {
        res.send({ status: 'error' });
      }
    } else {
      res.send({ status: 'error' });
    }
    // if(company.settings.solrSearch){
    //     socket.to(socket.handshake.session._id).emit('updateTicketsCount', {count: (tickets) ? [{state: '', count: tickets[1].length}] : []});
    // }
  } catch (error) {
    console.log(error);
    console.log('error in Getting Tickets');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getMoreTickets', async (req, res) => {
  try {
    let data = req.body;
    let sessionObj = res.locals.sessionObj;
    if (!data.email || !data.nsp) res.status(401).send('Invalid Request!');
    let session = await SessionManager.GetSessionByEmailFromDatabase(sessionObj.email, sessionObj.nsp);
    if (session) {
      let ticketPermissions = session.permissions.tickets;
      let company = await Company.getCompany(session.nsp);
      if (company && company.length) {
        let tick = await Tickets.getTicketsForLazyLoading(session.nsp, session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.chunk, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, company[0].settings.solrSearch);
        res.send({ status: 'ok', tick: tick, ended: (tick && tick.length < 50) ? true : false });
      }
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting more tickets');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getTicketHistory', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email || !data.nsp) res.status(401).send('Invalid Request!');
    let tickets = await Tickets.getTicketHistory(data.nsp, data.email, data.field);
    if (tickets && tickets.length) {
      res.send({ status: 'ok', tickets: tickets });
    } else {
      res.send({ status: 'error', tickets: [] });
    }
  } catch (error) {
    console.log('Error in getting ticket history');
  }
});
router.post('/getTicketHistoryEmail', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email || !data.nsp) res.status(401).send('Invalid Request!');
    let tickets = await Tickets.getTicketHistoryEmail(data.nsp, data.email);
    if (tickets && tickets.length) {
      res.send({ status: 'ok', tickets: tickets });
    } else {
      res.send({ status: 'error', tickets: [] });
    }
  } catch (error) {
    console.log('Error in getting ticket history');
  }
});

router.post('/getTicketByID', async (req, res) => {
  try {

    let data = req.body;

    if (!data.tid || !data.email || !data.nsp) res.status(401).send('Invalid Request!');
    if (!Array.isArray(data.tid)) data.tid = [data.tid];

    // console.log('Get Ticket By ID: ' + data.tid[0]);
    let ticket = await Tickets.getTicketByID(data.nsp, data.tid);

    if (ticket && ticket.length) {
      let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
      if (session) {
        switch (session.permissions.tickets.canView) {
          case 'all':
            res.send({ status: 'ok', thread: ticket[0] });
            break;
          case 'group':
            if ((ticket[0].group && session.groups.includes(ticket[0].group))) {
              res.send({ status: 'ok', thread: ticket[0] });
            } else {
              res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
            }
            break;
          case 'assignedOnly':
            if (ticket[0].assigned_to && (ticket[0].assigned_to == session.email)) {
              res.send({ status: 'ok', thread: ticket[0] });
            } else {
              res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
            }
            break;
          case 'team':
            let agents = await TeamsModel.getTeamMembersAgainstAgent(session.nsp, session.email);
            if (ticket[0].assigned_to && agents.includes(ticket[0].assigned_to)) {
              res.send({ status: 'ok', thread: ticket[0] });
            } else {
              res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
            }
            break;

        }
      } else {
        res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
      }
    } else {
      res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting tickets by ID');
    res.status(401).send('Invalid Request!');
  }
})
router.post('/ticketmessages', async (req, res) => {
  try {
    let data = req.body;
    if (!data.tid) res.status(401).send('Invalid Request!');

    let messages = await Tickets.getMesages(data.tid);
    // console.log(messages);
    res.send(messages);
  } catch (err) {
    console.log(err);
    console.log('Error in getting ticket Messages');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/mergedmessages', async (req, res) => {
  try {
    let data = req.body;
    if (!data.tid) res.status(401).send('Invalid Request!');
    let MergedMessages = await Tickets.getMessages(data.tid);
    // console.log(data);
    //console.log(MergedMessages);
    res.send(MergedMessages);
  } catch (err) {
    console.log(err);
    console.log('Error in getting merged messages');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket Task */
router.post('/addTask', async (req, res) => {
  try {
    let data = req.body;
    data.task.id = new ObjectID();
    data.task.datetime = new Date();
    if (!data.tid) res.status(401).send('Invalid Request!');
    let ticketlog = ComposedTicketENUM(TicketLogMessages.TASK_ADDED, { value: data.task.todo, by: data.email })
    let results = await Tickets.addTask(data.tid, data.nsp, data.task, ticketlog);
    if (results && results.length) {
      res.send({ status: 'ok', result: results[0], ticketlog: ticketlog });
      results.map(async result => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }
      })
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in adding ticket task');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/deleteTask', async (req, res) => {
  try {
    let data = req.body;
    if (!data.tid) res.status(401).send('Invalid Request!');
    let ticketlog = ComposedTicketENUM(TicketLogMessages.DELETE_TASK, { value: data.task, by: data.email })
    let result = await Tickets.deleteTask(data.tid, data.id, ticketlog);
    if (result && result.value) {
      res.send({ status: 'ok', deletedresult: result.value, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.tid, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.tid, ticket: result.value } })
      if (result.value.assigned_to) {
        let assignedTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assignedTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: data.tid, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.tid, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in deleting ticket task');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/updateTask', async (req, res) => {
  try {
    let data = req.body;
    if (!data.tid) res.status(401).send('Invalid Request!');
    let ticketlog = ComposedTicketENUM(TicketLogMessages.UPDATE_TASK, { value: data.properties, by: data.email })
    let result = await Tickets.updateTask(data.tid, data.id, data.properties, ticketlog);
    if (result && result.value) {
      res.send({ status: 'ok', tasks: result.value, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.tid, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.tid, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: data.tid, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.tid, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in updating ticket task');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/checkedTask', async (req, res) => {
  try {
    let data = req.body;
    if (!data.tid) res.status(401).send('Invalid Request!');
    let ticketlog = ComposedTicketENUM(TicketLogMessages.TASK_STATUS_CHANGED, { value: data.status ? 'Marked as Completed' : 'Marked as Incomplete', by: data.email, extraPara: data.name });
    let result = await Tickets.checkedTask(data.tid, data.id, data.status, ticketlog);

    if (result && result.value) {
      res.send({ status: 'ok', tasks: result.value, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.tid, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.tid, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: data.tid, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.tid, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in checking ticket task');
    res.status(401).send('Invalid Request!');
  }
})
/* #endregion */


router.post('/addTags', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.TAG_ADDED, { value: data.tag, by: data.email })
    let result = await Tickets.addTag(data.tids, data.nsp, data.tag, ticketlog);

    if (result && result.length) {
      res.send({ status: 'ok', ticketlog: ticketlog });
      result.map(async ticket => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })
        if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })
        if (ticket.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, ticket.assigned_to);
          if (assignedTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: ticket._id, ticket: ticket } })
        }
        if (ticket.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, ticket.watchers);
          if (watchers && watchers.length) {
            if (ticket.assigned_to) watchers = watchers.filter(x => { return x != ticket.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })
            })
          }
        }
      });
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in adding ticket tag');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/deleteTagTicket', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.DELETE_TAG, { value: data.tag, by: data.email });
    let result = await Tickets.deleteTag(data.tid, data.nsp, data.tag, ticketlog);
    if (result && result.value) {
      res.send({ status: 'ok', deletedresult: result.value, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.tid, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.tid, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: data.tid, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.tid, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in deleting ticket tags');
    res.status(401).send('Invalid Request!');
  }
});




router.post('/snooze', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.SNOOZE_ADDED, { value: data.time, by: data.email })
    let result = await Tickets.Snooze(data.time, data.email, data.selectedThread, data.nsp, ticketlog);
    if (result && result.value) {
      res.send({ status: 'ok', snooze: result.value, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.selectedThread, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.selectedThread, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: data.selectedThread, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.selectedThread, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in snoozing ticket');
    res.status(401).send('Invalid Request!');
  }
})



router.post('/exportdays', async (req, res) => {
  try {
    let data = req.body;
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let ticketPermissions = session.permissions.tickets;

      let dataToSend = {
        from: data.datafrom,
        to: data.datato,
        nsp: data.nsp,
        email: data.email,
        receivers: data.emails,
        canView: ticketPermissions.canView,
        filters: data.filters,
        keys: data.keys
      }
      //Send to Email Service
      EmailService.SendEmail({
        action: 'ExportTickets',
        data: dataToSend,
      }, 5, true);
      res.send({ status: 'ok', details: [] });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in exporting tickets');
    res.status(401).send('Invalid Request!');
  }
});



router.post('/exportSlaReport', async (req, res) => {
  try {
    let data = req.body;

    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let ticketPermissions = session.permissions.tickets;

      let dataToSend = {
        from: data.datafrom ? data.datafrom : '',
        to: data.datato ? data.datato : '',
        nsp: data.nsp,
        receivers: data.emails,
        keys: data.wise ? data.wise : undefined,
        ids: data.ids && data.ids.length ? data.ids : []
      }
      // console.log(dataToSend)
      EmailService.SendEmail({
        action: 'ExportSLAReport',
        data: dataToSend,
      }, 5, true);
      res.send({ status: 'ok', details: [] });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in exporting sla tickets');
    res.status(401).send('Invalid Request!');
  }
});




router.post('/mergeTicket', async (req, res) => {
  try {
    let data = req.body;
    let ticketlogPrimMerge = ComposedTicketENUM(TicketLogMessages.PRIMARY_TICKETLOG_MERGE, { value: data.mergeGroup.join('<br>'), by: data.email })
    let ticketlogSecMerge = ComposedTicketENUM(TicketLogMessages.SECONDARY_TICKETLOG_MERGE, { value: data.primaryTicketID, by: data.email })
    let ticketlog = { primaryTicketLog: ticketlogPrimMerge, secondaryTicketLog: ticketlogSecMerge }

    /**
     * @return Object<{ { primaryTicket: Object<TicketSchema>, secondaryTicket: Array<TicketSchema> } }>
     */
    let mergedTickets = await Tickets.MergeTickets(data.nsp, data.mergeGroup, ticketlog, data.secondaryTicketDetails, data.primaryTicketID);

    if (mergedTickets && mergedTickets.primaryTicket && mergedTickets.secondaryTicket && mergedTickets.secondaryTicket.length) {
      res.send({ status: 'ok', primayTicket: mergedTickets.primaryTicket, secondaryTicket: mergedTickets.secondaryTicket });

      if (mergedTickets.primaryTicket.assigned_to) {
        let assignedTo = await SessionManager.getAgentByEmail(data.nsp, mergedTickets.primaryTicket.assigned_to);
        if (assignedTo) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket, ignoreAdmin: true } })
        }
      }

      if (mergedTickets.primaryTicket.watchers) {
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, mergedTickets.primaryTicket.watchers);
        if (watchers && watchers.length) {
          if (mergedTickets.primaryTicket.assigned_to) watchers = watchers.filter(data => { return data != mergedTickets.primaryTicket.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [watcher._id], data: { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket, ignoreAdmin: true } })
          })
        }
      }

      mergedTickets.secondaryTicket.map(async ticket => {

        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })
        if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })

        if (ticket.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, ticket.assigned_to);
          if (assignedTo) {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: ticket._id, ticket: ticket } })
          }
        }

        if (ticket.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, ticket.watchers);
          if (watchers && watchers.length) {
            if (ticket.assigned_to) watchers = watchers.filter(data => { return data != ticket.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })

            })
          }
        }

      });

    } else {
      res.send({ status: 'error' });
    }

  } catch (err) {
    console.log(err);
    console.log('Error in merging ticket ');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/demergeTicket', async (req, res) => {
  try {
    let data = req.body;
    let ticketlogPrimDeMerge = ComposedTicketENUM(TicketLogMessages.PRIMARY_TICKETLOG_DEMERGE, { value: data.SecondaryReference + '<br>', by: data.email })
    let ticketlogSecDeMerge = ComposedTicketENUM(TicketLogMessages.SECONDARY_TICKETLOG_DEMERGE, { value: data.primaryReference, by: data.email })
    let ticketlog = { primaryTicketLog: ticketlogPrimDeMerge, secondaryTicketLog: ticketlogSecDeMerge }

    /**
     * @return Object<{ { primaryTicket: Object<TicketSchema>, secondaryTicket: Array<TicketSchema> } }>
     */
    let demergedTickets = await Tickets.DeMergeTickets(data.nsp, data.primaryReference, data.SecondaryReference, ticketlog);
    if (demergedTickets && demergedTickets.primaryTicket && demergedTickets.secondaryTicket) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket } })
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket } })
      if (demergedTickets.primaryTicket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [demergedTickets.primaryTicket.group], data: { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket } })
      if (demergedTickets.secondaryTicket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [demergedTickets.secondaryTicket.group], data: { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket } })

      if (demergedTickets.primaryTicket.assigned_to) {
        let assignedTo = await SessionManager.getAgentByEmail(data.nsp, demergedTickets.primaryTicket.assigned_to);
        if (assignedTo) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket } })
        }
      }

      if (demergedTickets.secondaryTicket.assigned_to) {
        let assignedTo = await SessionManager.getAgentByEmail(data.nsp, demergedTickets.secondaryTicket.assigned_to);
        if (assignedTo) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket } })
        }
      }

      if (demergedTickets.secondaryTicket.watchers) {
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, demergedTickets.secondaryTicket.watchers);
        if (watchers && watchers.length) {
          if (demergedTickets.secondaryTicket.assigned_to) watchers = watchers.filter(data => { return data != demergedTickets.secondaryTicket.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket } })

          })
        }

      }

      if (demergedTickets.primaryTicket.watchers) {
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, demergedTickets.primaryTicket.watchers);
        if (watchers && watchers.length) {
          if (demergedTickets.primaryTicket.assigned_to) watchers = watchers.filter(data => { return data != demergedTickets.primaryTicket.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket } })
          })
        }
      }

      res.send({ status: 'ok', primayTicket: demergedTickets.primaryTicket, secondaryTicket: demergedTickets.secondaryTicket });
    } else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in demerging ticket ');
    res.status(401).send('Invalid Request!');
  }
});





router.post('/editTicketNote', async (req, res) => {
  try {
    let data = req.body;
    data.properties.id = new ObjectID();
    if (data.properties && (!data.properties.id || !data.properties.added_by || !data.properties.added_at || !data.properties.ticketNote)) res.send({ status: 'error' });
    let ticketlog = ComposedTicketENUM(TicketLogMessages.NOTE_ADDED, { value: data.properties.ticketNote, by: data.email })
    let results = await Tickets.UpdateTicketNote(data.tids, data.properties, data.nsp, ticketlog);
    if (results && results.length) {
      res.send({ status: 'ok', note: results[0].ticketNotes, ticketlog: ticketlog });
      results.map(async result => {
        let origin = await Agents.GetEmailNotificationSettings(data.nsp, data.email);
        if (origin && origin.length && origin[0].settings && origin[0].settings.emailNotifications && origin[0].settings.emailNotifications.noteAddTick) {
          let recipients: Array<any> = [];
          if (result.assigned_to) recipients.push(result.assigned_to);
          if (result.watchers && result.watchers.length) {
            recipients = recipients.concat(result.watchers);
            recipients = recipients.filter((item, pos) => {
              if (recipients && recipients.length) return recipients.indexOf(item) == pos;
            })
          }
          let msg = '<span><b>ID: </b>' + result._id + '<br>'
            + '<span><b>Note: </b> ' + data.properties.ticketNote + '<br>'
            + '<span><b>Added by: </b> ' + data.email + '<br>'
            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
          let obj = {
            action: 'sendNoReplyEmail',
            to: recipients,
            subject: 'New Note added to Ticket #' + result._id,
            message: msg,
            html: msg,
            type: 'newNote'
          }
          let response;
          if (recipients && recipients.length) response = await EmailService.SendNoReplyEmail(obj, false);

        }
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(x => { return x != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }



      })
    } else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in adding ticket note');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/deleteNote', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.DELETE_NOTE, { value: data.note, by: data.email })
    let result = await Tickets.deleteNote(data.id, data.noteId, ticketlog);

    if (result && result.value) {
      res.send({ status: 'ok', deletedresult: result.value.ticketNotes, ticketlog: ticketlog });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: data.id, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: data.id, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: data.id, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.id, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in deleting ticket note');
    res.status(401).send('Invalid Request!');
  }
});



/* #region  Ticket Priority */
router.post('/changeTicketPriority', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.PRIORITY_CHANGED, { value: data.priority, by: data.email })
    let results = await Tickets.UpdateTicketPriority(data.ids, data.nsp, data.priority, ticketlog);
    if (results && results.length) {
      results.map(async result => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assigendTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {

          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(x => { return x != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }
      })
      res.send({ status: 'ok', ticketlog: ticketlog });
    }
    else {
      res.send({ status: 'error' });
    }

  } catch (err) {
    console.log(err);
    console.log('Error in changing priority');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket State */
router.post('/changeTicketState', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.STATE_CHANGED, { value: data.state, by: data.email });
    let results = await Tickets.UpdateTicket(data.tids, data.nsp, ticketlog, data.state);
    let lasttouchedTime = new Date().toISOString();
    if (results && results.length) {
      let survey = await FeedBackSurveyModel.getActivatedSurvey();
      let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
      if (data.state == 'SOLVED' && survey && survey.length && survey[0].sendWhen == 'solved' && getMessageById && getMessageById.length) {
        let message = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
        getMessageById.map(data => {
          EmailService.SendEmail({
            action: 'StateChangedFeedbackSurvey',
            survey: survey && survey.length ? survey[0] : [],
            ticket: results,
            reply: data.to[0],
            message: message
          }, 5, true);
        })
      }
      if (data.state == 'CLOSED' && survey && survey.length && survey[0].sendWhen == 'closed' && getMessageById && getMessageById.length) {
        let message = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
        getMessageById.map(data => {
          EmailService.SendEmail({
            action: 'StateChangedFeedbackSurvey',
            survey: survey && survey.length ? survey[0] : [],
            ticket: results,
            reply: data.to[0],
            message: message
          }, 5, true);
        })

      }
      if (data.state == 'CLOSED') {
        let ticketClosed = await Tickets.TicketClosed(data.tids, lasttouchedTime);
      }
      if (data.state == 'SOLVED') {
        let ticketSolved = await Tickets.TicketSolved(data.tids, lasttouchedTime, data.email);
      }
      results.map(async result => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assignedTo && assignedTo.type == 'Agents' && assignedTo.permissions.tickets.canView == 'assignedOnly') await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(x => { return x != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }



      })
      res.send({ status: 'ok', ticketlog: ticketlog });
    }
    else {
      res.send({ status: 'error' });
    }

  } catch (err) {
    console.log(err);
    console.log('Error in changing state');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket Group */
router.post('/changeGroup', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.GROUP_ASSIGNED, { value: data.group, by: data.email })
    let results = await Tickets.UpdateTicketGroup(data.ids, data.nsp, data.group, ticketlog);
    if (results && results.length) {
      res.send({ status: 'ok', ticketlog: ticketlog });
      results.map(async ticket => {
        let origin = await Company.GetEmailNotificationSettings(data.nsp);
        if (origin && origin.length && origin[0].settings.emailNotifications.tickets.assignToGroup) {
          let groupAdmins = await TicketGroupsModel.GetGroupAdmins(data.nsp, ticket.group);

          if (ticket.watchers && ticket.watchers.length) {
            if (groupAdmins && groupAdmins.length) groupAdmins = groupAdmins.concat(ticket.watchers);
            else groupAdmins = ticket.watchers
            if (groupAdmins && groupAdmins.length) {
              groupAdmins = groupAdmins.filter((item, pos) => {
                if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
              })
            }
          }

          if (groupAdmins && groupAdmins.length) {
            // console.log("groupAdmins", groupAdmins);

            let msg = '<span><b>ID: </b>' + ticket._id + '<br>'
              + '<span><b>Group: </b> ' + ticket.group + '<br>'
              + '<span><b>Assigned by: </b> ' + data.email + '<br>'
              + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
            let obj = {
              action: 'sendNoReplyEmail',
              to: groupAdmins,
              subject: 'Group assigned to Ticket #' + ticket._id,
              message: msg,
              html: msg,
              type: 'newTicket'
            }
            // let response = EmailService.SendNoReplyEmail(obj, false);

          }
        }
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })

        if (ticket.assigned_to) {
          let agent = await SessionManager.getAgentByEmail(data.nsp, ticket.assigned_to);

          if (agent && agent.permissions.ticket.canView != 'all') {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [agent._id], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })
          }

        }
        if (ticket.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, ticket.watchers);
          if (watchers && watchers.length) {
            watchers = watchers.filter(data => { return data != ticket.assigned_to })

            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })
            });
          }
        }
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [data.previousGroup], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [ticket.group], data: { ticket: ticket, ignoreAdmin: false } })
      })

    }
  } catch (err) {
    res.status(401).send('Invalid Request!');
    console.log(err);
    console.log('Error in changing group');
  }
});
/* #endregion */

/* #region  Ticket Watchers */
router.post('/addWatchers', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.WATCHERS_ADDED, { value: data.agents.toString(), by: data.email })
    let watchers = await Tickets.addWatchers(data.tids, data.agents, ticketlog, data.nsp);
    if (watchers && watchers.length) {
      res.send({ status: 'ok', watchers: watchers[0], ticketlog: ticketlog });
      watchers.map(async watcher => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: watcher._id, ticket: watcher } })
        if (watcher.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher.group], data: { tid: watcher._id, ticket: watcher } })

        if (watcher.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, watcher.assigned_to);
          if (assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly') {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: watcher._id, ticket: watcher } })
          }
        }
        if (watcher.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, watcher.watchers);
          if (watcher.assigned_to) watchers = watchers.filter(x => { return x != watcher.assigned_to })

          watchers.map(async result => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result._id], data: { tid: watcher._id, ticket: watcher } })
          })
        }

        //new added agents
        if (data.agents) {
          let msg = 'Hello, Agent '
            + '<span>You have been added as a watcher by:  ' + data.email + '<br>'
            + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + watcher._id + '<br>';
          let obj = {
            action: 'sendNoReplyEmail',
            to: data.agents,
            subject: 'Added as watcher to Ticket #' + watcher._id,
            message: msg,
            html: msg,
            type: 'newTicket'
          }
          let response = EmailService.SendNoReplyEmail(obj, false);
          data.agents.map(async result => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [result._id], data: { ticket: watcher, ignoreAdmin: false } })
          })
        }
      })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in adding watcher');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/deleteWatcher', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.deleteWatcher(data.id, data.agent);

    if (result && result.value) {
      res.send({ status: 'ok', msg: "Watcher deleted successfully!" });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result.value._id, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: result.value._id, ticket: result.value } })
      if (result.value.assigned_to) {
        let assignedTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assignedTo && assignedTo.permissions.ticket.canView != 'all') await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: result.value._id, ticket: result.value } })
      }
      if (result.value.watchers) {
        let val = result.value;
        let watchers = await SessionManager.getOnlineWatchers(data.nsp, val.watchers);
        if (watchers && watchers.length) {
          if (result.value.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: data.id, ticket: val } })
          })
        }
      }
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in deleting ticket watcher');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket Assign Agent */
router.post('/assignAgentForTicket', async (req, res) => {
  try {
    if (!req.body.nsp || !req.body.agent_email) {
      res.status(401).send('Invalid Request!');
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      let promises: any;
      let ticketlog: TicketLogSchema;
      if (data.assignment != '') {
        ticketlog = {
          time_stamp: new Date().toISOString(),
          status: data.agent_email,
          title: 'Ticket Assigned to',
          updated_by: 'ICONN Platform',
          user_type: 'ICONN Platform'
        }
      }
      else {
        ticketlog = ComposedTicketENUM(TicketLogMessages.AGENT_ASSIGNED, { value: data.agent_email, by: data.email })
      }

      promises = await Promise.all([
        SessionManager.getAgentByEmail(data.nsp, data.agent_email),
        Tickets.AssignAgent(data.tids, data.nsp, data.agent_email, ticketlog)
      ]);
      let assign_Agent = promises[0];
      let result = promises[1];
      if (result && !result.length) {
        res.status(401).send({ status: 'error' });
      } else {
        /**
         * @Callback_Data
         * 1. Array<TicketsSchema>
         * 2. dateTime : ISOSTRING
         */

        result.map(async ticket => {
          if (ticket.previousAgent) {
            let previousAgent = await SessionManager.getAgentByEmail(data.nsp, ticket.previousAgent);

            // console.log(previousAgent.email);
            if (previousAgent) {
              switch (previousAgent.permissions.tickets.canView) {
                case 'assignedOnly':
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })
                  break;
                case 'group':
                  //check if group admin
                  //If no them emit
                  if ((ticket.group && !previousAgent.groups.includes(ticket.group)) || !ticket.group) {
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })
                  }
                  break;
                default:
                  break;
              }
            }

            //Emit to Teams for remove ticket
            let teamsOfPreviousAgent = await TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.previousAgent);
            teamsOfPreviousAgent.forEach(async team => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [team], data: { tid: ticket._id, ticket: ticket } })
            })
          }
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })
          if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })

          if (assign_Agent && assign_Agent.permissions.tickets.canView != 'all') {
            // console.log('Assigned Agent: ' + assign_Agent.email);
            // if (assign_Agent.permissions.tickets.canView == 'assignedOnly') {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [assign_Agent._id], data: { ticket: ticket, ignoreAdmin: false } })
            // }
          }
          if (ticket.watchers) {
            let watchers = await SessionManager.getOnlineWatchers(data.nsp, ticket.watchers);
            if (watchers && watchers.length) {
              if (ticket.assigned_to) watchers = watchers.filter(x => { return x != ticket.assigned_to })

              watchers.map(async watcher => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })
              })
            }
          }

          //Emit to Teams for new ticket
          let recipients = Array();
          if (ticket.assigned_to) {
            let EmailRecipients = Array();
            let res = await Tickets.getWatchers(ticket._id, data.nsp);
            if (res && res.length) {
              EmailRecipients = EmailRecipients.concat(res[0].watchers);
            }
            EmailRecipients.push(ticket.assigned_to);
            recipients = EmailRecipients.filter((item, pos) => {
              return EmailRecipients.indexOf(item) == pos;
            })
            let teams = await TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.assigned_to);
            teams.forEach(async team => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [team], data: { ticket: ticket, ignoreAdmin: false } })
            });
          }
          let origin = await Agents.GetEmailNotificationSettings(data.nsp, data.email);
          if (origin && origin.length && origin[0].settings.emailNotifications.assignToAgent) {
            // console.log('Sending email to agent');
            let recipients = Array();
            recipients.push(ticket.assigned_to);
            if (ticket.watchers && ticket.watchers.length) {
              recipients = recipients.concat(ticket.watchers);
              recipients = recipients.filter((item, pos) => {
                if (recipients && recipients.length) return recipients.indexOf(item) == pos;
              })
            }
            let msg = '<span><b>ID: </b>' + ticket._id + '<br>'
              + '<span><b>Assigned by: </b>' + data.email + '<br>'
              + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
            if (recipients && recipients.length) {
              let response = await EmailService.NotifyAgentForTicket({
                ticket: ticket,
                subject: ticket.subject,
                nsp: data.nsp.substring(1),
                to: recipients,
                msg: msg
              });
              if (response && !response.MessageId) {
                console.log('Email SEnding TO Agent When Assigning Failed');
              }
            }

          }
        });
        res.send({ status: 'ok', ticket_data: result[0], ticketlog: ticketlog });
      }
    }
  } catch (err) {
    res.status(401).send('Invalid Request!');
    console.log(err);
    console.log('Error in adding ticket tag');
  }
})
router.post('/assignAvailableAgent', async (req, res) => {
  try {
    if (!req.body.ticketID || !req.body.group) {
      res.status(401).send('Invalid Request!');
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      let fetchedTicket = await Tickets.getTicketById(data.ticketID);
      if (fetchedTicket && fetchedTicket.length) {
        let updatedTicket: any = await Tickets.FindBestAvailableAgentTicketInGroup(fetchedTicket[0].group, fetchedTicket[0]);
        if (updatedTicket) {
          await Tickets.UpdateTicketObj(updatedTicket);
          res.send({ status: 'ok', ticket: updatedTicket });
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: updatedTicket.nsp, roomName: ['ticketAdmin'], data: { tid: updatedTicket._id, ticket: updatedTicket } })
          if (updatedTicket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { tid: updatedTicket._id, ticket: updatedTicket } })

          if (updatedTicket.assigned_to) {
            let liveAgent = await SessionManager.getAgentByEmail(updatedTicket.nsp, updatedTicket.assigned_to);
            if (liveAgent && liveAgent.permissions.tickets.canView == 'assignedOnly') {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [liveAgent._id], data: { ticket: updatedTicket, ignoreAdmin: false } })
            }
            // console.log('Assigned Agent: ' + assign_Agent.email);
            // if (assign_Agent.permissions.tickets.canView == 'assignedOnly') {
            // }
          }
        } else {
          res.send({ status: 'error' });
        }
      } else {
        res.send({ status: 'error' });
      }
    }
  } catch (err) {
    res.status(401).send('Invalid Request!');
    console.log(err);
    console.log('Error in adding ticket tag');
  }
})
router.post('/applyRulesets', async (req, res) => {
  try {
    if (!req.body.ticketID) {
      res.status(401).send('Invalid Request!');
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      //getTicket
      let ticket: any = await Tickets.getTicketById(data.ticketID);
      //ApplyRulesets
      if (ticket && ticket.length) {
        let previousGroup = (ticket[0].group) ? ticket[0].group : '';
        let previousAgent = (ticket[0].assigned_to) ? ticket[0].assigned_to : '';
        // console.log(ticket.value.processing);
        let updatedTicket: any = await RuleSetDescriptor(ticket[0]);
        if (updatedTicket.assigned_to) {
          ticket.assignmentList = [
            {
              assigned_to: ticket.assigned_to,
              assigned_time: ticket.first_assigned_time,
              read_date: ''
            }
          ]
        }
        await Tickets.UpdateTicketObj(updatedTicket);
        res.send({ status: 'ok' });
        // console.log(previousGroup);
        // console.log(updatedTicket.group);
        if (previousGroup) {
          console.log('Remove ticket from previous group: ' + previousGroup);
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: updatedTicket.nsp, roomName: [previousGroup], data: { tid: updatedTicket._id, ticket: updatedTicket, email: updatedTicket.assigned_to } })
          console.log('Emit ticket to new group: ' + updatedTicket.group);
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: updatedTicket.nsp, roomName: ['ticketAdmin'], data: { tid: updatedTicket._id, ticket: updatedTicket, email: updatedTicket.assigned_to } })
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { ticket: updatedTicket, ignoreAdmin: false } })
          console.log('Update Ticket: ' + updatedTicket.nsp + ' ' + updatedTicket.group);
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { tid: updatedTicket._id, ticket: updatedTicket } })
        }
        if (updatedTicket.assigned_to) {
          // await Tickets.UpdateTicketObj(ticket.value);
          let liveAgent = await SessionManager.getAgentByEmail(updatedTicket.nsp, updatedTicket.assigned_to);
          if (liveAgent && liveAgent.permissions.tickets.canView == 'assignedOnly') {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [liveAgent._id], data: { ticket: updatedTicket, ignoreAdmin: false } })
          }
        }
      } else {
        res.send({ status: 'error' })
      }
      //Emits

    }
  } catch (err) {
    res.status(401).send('Invalid Request!');
    console.log(err);
    console.log('Error in adding ticket tag');
  }
})
/* #endregion */

/* #region  Ticket Dynamic Property */
router.post('/updateDynamicProperty', async (req, res) => {
  try {
    let ticketlog: any;
    let data = req.body;
    if (data.assignment != '') {
      ticketlog = ComposedTicketENUM(TicketLogMessages.UPDATE_DYNAMIC_FIELD_ICONN, { value: data.value, by: data.email, extraPara: data.name, ByextraOptions: data.assignment })

    } else {

      ticketlog = ComposedTicketENUM(TicketLogMessages.UPDATE_DYNAMIC_FIELD, { value: data.value, by: data.email, extraPara: data.name })
    }
    let result = await Tickets.UpdateDynamicProperty(data.tid, data.name, data.value, ticketlog);
    if (result && result.value) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result.value._id, ticket: result.value } })
      if (result.value.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.value.group], data: { tid: result.value._id, ticket: result.value } })
      if (result.value.assigned_to) {
        let assigendTo = await SessionManager.getAgentByEmail(data.nsp, result.value.assigned_to);
        if (assigendTo && assigendTo.permissions.tickets.canView != 'all') await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assigendTo._id], data: { tid: result.value._id, ticket: result.value } })
      }
      if (result.value.watchers) {

        let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.value.watchers);
        if (watchers && watchers.length) {
          let val = result.value;
          if (val.assigned_to) watchers = watchers.filter(x => { return x != val.assigned_to })
          watchers.map(async watcher => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: val._id, ticket: val } })
          })
        }
      }
      res.send({ status: 'ok', result: result.value, ticketlog: ticketlog })
    }
    else res.send({ status: 'error' });

  } catch (err) {
    console.log(err);
    console.log('Error in changing dynamic property');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket Update viewState */
router.post('/updateViewState', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM(TicketLogMessages.UPDATE_VIEW_STATE, { value: data.viewState, by: data.email })
    let results = await Tickets.UpdateViewState(data.tids, data.nsp, data.viewState, ticketlog);

    if (results && results.length) {
      res.send({ status: 'ok' });
      results.map(async result => {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly') await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {

          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(x => { return x != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }
      })
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in update ViewState');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/updateFirstReadDate', async (req, res) => {
  try {
    let data = req.body;
    let ticketlog = ComposedTicketENUM("Ticket First Read By", { value: data.email, by: "System" })
    let results = await Tickets.UpdateFirstReadDate(data.tids, data.nsp, ticketlog);
    if (results && results.result.ok) {
      res.send({ status: 'ok' });
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in update ViewState');
    res.status(401).send('Invalid Request!');
  }
});
/* #endregion */

/* #region  Ticket Scenario */
router.post('/executeScenario', async (req, res) => {
  try {
    let data = req.body;
    let $update = {};
    let $renUpdate = {};
    let $setObj = {};
    let newAgent: any;
    //reference of previous tickets...
    // let previousState = data.tickets;
    let $pushObj = {
      ticketlog: ComposedTicketENUM(TicketLogMessages.EXECUTE_SCENARIO, { value: '', by: data.email, extraPara: data.scenario.scenarioTitle })
    };
    let $renameObj = {};
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    let origin = await Agents.GetEmailNotificationSettings(data.nsp, data.email);
    data.scenario.actions.map(async action => {
      switch (action.scenarioName) {
        case 'agentAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canAssignAgent) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Agent assignment <br> State is closed, Cannot assign agent to closed ticket <br>';
          }
          else if ($setObj && $setObj['state'] == 'CLOSED') {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Agent assignment <br> State is closed, Cannot assign agent to closed ticket <br>';
          }
          else {
            $setObj['assigned_to'] = action.scenarioValue;
            Object.assign($renameObj, { 'assigned_to': "previousAgent" });
          }
          break;
        case 'groupAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b>' + action.scenarioValue + '</b> <br>';
          if (session && !session.permissions.tickets.canAssignGroup) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Group assignment <br> Not have permission to assign group <br>';
          }
          else {
            $setObj['group'] = action.scenarioValue;
            Object.assign($renameObj, { 'group': "previousGroup" });
          }
          break;
        case 'viewStateAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>';
          $setObj['viewState'] = action.scenarioValue;
          break;
        case 'priorityAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canSetPriority) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Priority assignment <br> Not have permission to change priority <br>';
          } else {
            $setObj['priority'] = action.scenarioValue;
          }
          break;
        case 'stateAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canChangeState) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : State assignment <br> Not have permission to change state <br>';
          }
          else {
            $setObj['state'] = action.scenarioValue;
          }
          break;
        case 'snoozeAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canSnooze) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Snooze assignment <br> Not have permission to snooze ticket <br>';
          }
          else {
            if (action.scenarioValue && !isNaN(Date.parse(action.scenarioValue))) {
              let snoozeObj = { snooze_time: new Date(action.scenarioValue).toISOString(), email: data.email }
              $setObj['snoozes'] = snoozeObj;
            }

          }
          break;
        case 'noteAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canAddNote) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Note addition <br> Not have permission to add Note <br>';
          }
          else {
            $pushObj['ticketNotes'] = { ticketNote: action.scenarioValue, added_by: data.email, added_at: new Date().toISOString(), id: new ObjectID() }
          }
          break;
        case 'tagAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
          if (session && !session.permissions.tickets.canAddTag) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Tag addition <br> Not have permission to add tag <br>';
          }
          data.tickets.map(ticket => {
            if (ticket.tags && ticket.tags.length) {
              ticket.tags.map(tag => {
                if (tag.includes(action.scenarioValue)) {
                  action.scenarioValue = action.scenarioValue.filter(data => { return data != tag })
                  $pushObj['tags'] = action.scenarioValue
                }
                else {
                  $pushObj['tags'] = action.scenarioValue
                }
              })
            } else {
              $pushObj['tags'] = action.scenarioValue;
            }
          })
          break;
        case 'taskAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';

          if (session && !session.permissions.tickets.canAddTask) {
            $pushObj['ticketlog'].status += 'Failed to perform operation : Task addition <br> Not have permission to add task <br>';
          }
          else {
            $pushObj['todo'] = { todo: action.scenarioValue, agent: data.email, completed: false, datetime: new Date().toISOString(), id: new ObjectID() }
          }
          break;
        case 'watcherAssign':
          $pushObj['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>';
          data.tickets.map(ticket => {
            if (ticket.watchers && ticket.watchers.length) {
              ticket.watchers.map(watcher => {
                action.scenarioValue = action.scenarioValue.filter(data => { return data != watcher })
                action.scenarioValue = action.scenarioValue.filter(data => { return data != ticket.assigned_to })
              })
              $pushObj['watchers'] = action.scenarioValue;
            }
            if (action.scenarioValue && action.scenarioValue.length) {
              let msg = 'Hello, Agent '
                + '<span>You have been added as a watcher by:  ' + data.email + '<br>'
                + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
              let obj = {
                action: 'sendNoReplyEmail',
                to: action.scenarioValue,
                subject: 'Added as watcher to Ticket #' + ticket._id,
                message: msg,
                html: msg,
                type: 'newTicket'
              }
              let response = EmailService.SendNoReplyEmail(obj, false);
              data.agents.map(async result => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [result._id], data: { ticket: ticket, ignoreAdmin: false } })
              })
              $pushObj['watchers'] = action.scenarioValue;
            }
          })
          break;
      }
    });
    $setObj['lasttouchedTime'] = new Date().toISOString();
    $setObj['lastScenarioExecuted'] = data.scenario.scenarioTitle;

    if (Object.keys($setObj).length) Object.assign($update, { $set: $setObj });
    if (Object.keys($pushObj).length) Object.assign($update, { $push: $pushObj });
    if (Object.keys($renameObj).length) Object.assign($renUpdate, { $rename: $renameObj });

    let results = await Tickets.ExecuteScenarios(data.ids, data.nsp, $update, $renameObj);

    //NOTIFICATIONS && EMITS:
    if (results && results.length) {
      res.send({ status: 'ok', updatedProperties: $update });
      results.map(async result => {
        //notify to previous agent
        if (result.previousAgent && $update['$set'] && $update['$set'].assigned_to) {
          let previousAgent = await SessionManager.getAgentByEmail(data.nsp, result.previousAgent);
          if (previousAgent) {
            switch (previousAgent.permissions.tickets.canView) {
              case 'assignedOnly':
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [previousAgent._id], data: { tid: result._id, ticket: result } })
                break;
              case 'group':
                //check if group admin
                //If no them emit
                if ((result.group && !previousAgent.groups.includes(result.group)) || !result.group) {
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [previousAgent._id], data: { tid: result._id, ticket: result } })
                }
                break;
              default:
                break;
            }
          }

          //Emit to Teams for remove ticket
          let teamsOfPreviousAgent = await TeamsModel.getTeamsAgainstAgent(result.nsp, result.previousAgent);
          teamsOfPreviousAgent.forEach(async team => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [team], data: { tid: result._id, ticket: result } })
          })
        }

        //notify to previous group
        if (result.previousGroup && $update['$set'] && $update['$set'].group) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data.nsp, roomName: [result.previousGroup], data: { tid: result._id, ticket: result, email: result.assigned_to } })
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [result.group], data: { ticket: result, ignoreAdmin: false } })
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        }

        //if ticket is solved
        if (result.state == 'SOLVED' && $update['$set'] && $update['$set'].state) {
          //solved time && send survey email && sla policy work
          let message = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
          let survey = await FeedBackSurveyModel.getActivatedSurvey();
          if (survey && survey.length && survey[0].sendWhen == 'solved') {
            let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
            if (getMessageById && getMessageById.length) {
              getMessageById.map(data => {
                EmailService.SendEmail({
                  action: 'StateChangedFeedbackSurvey',
                  survey: survey && survey.length ? survey[0] : undefined,
                  ticket: result,
                  reply: data.to[0],
                  message: message
                }, 5, true);
              })
            }
          }
          let solvedDatetime = ((new Date(result.solved_date).getTime()) * 60000);
          let ticketDatetime = ((new Date(result.datetime).getTime()) * 60000);
          let diffForSolved = solvedDatetime - ticketDatetime;
          let currentDatetime = ((new Date().getTime()) * 60000);

          let policies = await SLAPolicyModel.getActivatedPolicies();
          if (policies && policies.length) {
            //can be multiple policies:
            policies.map(async active => {
              let requiredPriorityObj = active.policyTarget.filter(obj => { return obj.priority == result.priority });

              //VIOLATION OF RESOLUTION
              if (!result.slaPolicy.violationResolution && active.violationResolution && active.violationResolution.length && active.violationResponse[0].time && diffForSolved && (diffForSolved > requiredPriorityObj[0].timeResolved)) { //base case..
                if ((solvedDatetime + active.violationResolution[0].time) > currentDatetime) {

                  active.violationResolution.map(async (violate, ind) => {
                    //send email after n minutes:
                    if (currentDatetime - (solvedDatetime + violate.time) > 0) {
                      let ticketLog: TicketLogSchema = {
                        time_stamp: new Date().toISOString(),
                        status: `violation of resolution step #` + ind + 1,
                        title: `Escalation email for resolution sent as per policy`,
                        updated_by: 'Beelinks',
                        user_type: 'Beelinks Scheduler'
                      }
                      result.slaPolicy.violationResolution = true;
                      let res = await Tickets.SetViolationTime(result._id, result.nsp, ticketLog);
                      if (res && (!res.ok || !res.value)) {
                        // console.log('unsetting and pushing log failed of ' + solve._id);
                      }
                      if (requiredPriorityObj[0].emailActivationEscalation) {
                        let arr: any = [];
                        violate.notifyTo.map(email => {
                          if (email == 'Assigned Agent') {
                            arr.push(result.assigned_to)
                          }
                          else {
                            arr.push(email)
                          }
                        })
                        //sending emails heirarchy..
                        let obj = {
                          action: 'sendNoReplyEmail',
                          to: arr,
                          subject: 'Escalation Email for Resolution of Ticket :  ' + result._id + ' having priority ' + result.priority,
                          message: `Hello Agent,
                                                                    <br>
                                                                    Just wanted to let you know that your time to resolve the ticket ${result._id} is escalated.
                                                                    <br>
                                                                    Ticket Subject : ${result.subject}
                                                                    <br>
                                                                    You can check the activity on https://app.beelinks.solutions/tickets
                                                                    <br>
                                                                    Regards,
                                                                    Beelinks Team`,
                          html: `Hello Agent,
                                                                    <br>
                                                                    Just wanted to let you know that your time to resolve the ticket ${result._id} is escalated.
                                                                    <br>
                                                                    Ticket Subject : ${result.subject}
                                                                    <br>
                                                                    You can check the activity on <a href="https://app.beelinks.solutions/tickets/ticket-view/${result._id}">Beelinks Ticket</a>
                                                                    <br>
                                                                    Regards,
                                                                    <br>
                                                                    Beelinks Team
                                                                    `
                        }
                        let response = EmailService.SendNoReplyEmail(obj, false);
                        if (response) {
                          console.log("violation resolution email sent");

                        } else {
                          console.log('Email Delivery Failed For escalation');
                        }
                      }
                    }
                  })
                }
              }
              else {
                console.log("not send email, resolution not violated.");
                return;
              }
            })
          }
          else {
            console.log("no activated policies!");
            return;
          }
        }

        //if ticket is closed
        if (result.state == 'CLOSED' && $update['$set'] && $update['$set'].state) {
          //send survey email
          let message = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
          let survey = await FeedBackSurveyModel.getActivatedSurvey();
          if (survey && survey.length && survey[0].sendWhen == 'closed') {
            let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
            if (getMessageById && getMessageById.length) {
              getMessageById.map(data => {
                EmailService.SendEmail({
                  action: 'StateChangedFeedbackSurvey',
                  survey: survey && survey.length ? survey[0] : undefined,
                  ticket: result,
                  reply: data.to[0],
                  message: message
                }, 5, true);
              })
            }
          }
        }

        //if ticket is updated else leave it..
        //emit to ticket admin
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })

        //emit to watchers
        if (result.watchers && result.watchers.length) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })

            watchers.map(async single => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data.nsp, roomName: [single._id], data: { tid: result._id, ticket: result } })
            })
          }
        }

        //emit to new agent
        if (result.assigned_to) {
          newAgent = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);

          if (newAgent) {
            if (newAgent.permissions.tickets.canView == 'assignedOnly') {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [newAgent._id], data: { ticket: result, ignoreAdmin: false } })
            }
          }
        }

        //Emit to Teams for new ticket
        let EmailRecipients = Array();
        if (result && result.assigned_to) {
          let res = await Tickets.getWatchers(result._id, data.nsp);
          if (res && res.length) {
            EmailRecipients = EmailRecipients.concat(res[0].watchers);
          }
          if (result.assigned_to) EmailRecipients.push(result.assigned_to);
          EmailRecipients = EmailRecipients.filter((item, pos) => {
            return EmailRecipients.indexOf(item) == pos;
          })
          let teams = await TeamsModel.getTeamsAgainstAgent(result.nsp, result.assigned_to);
          teams.forEach(async team => {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [team], data: { ticket: result, ignoreAdmin: false } })
          });

          //email to assigned agent..
          if (origin && origin.length && origin[0].settings.emailNotifications.assignToAgent && $update['$set'] && $update['$set'].assigned_to) {
            let msg = '<span><b>ID: </b>' + result._id + '<br>'
              + '<span><b>Assigned by: </b>' + data.email + '<br>'
              + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
            let response = await EmailService.NotifyAgentForTicket({
              ticket: result,
              subject: result.subject,
              nsp: data.nsp.substring(1),
              to: EmailRecipients,
              msg: msg
            });
            if (response && response.MessageId) {
              console.log('Email Sending TO Agent When Assigning Failed');
            }
          }
        }

        //note notify
        if (origin && origin.length && origin[0].settings.emailNotifications.noteAddTick && $update['$push'] && $update['$push'].ticketNotes) {
          //ticket.assigned_to + watchers:
          let recipients: Array<any> = [];
          if (result.assigned_to) recipients.push(result.assigned_to);
          if (result.watchers && result.watchers.length) {
            recipients = recipients.concat(result.watchers);
            recipients = recipients.filter((item, pos) => {
              if (recipients && recipients.length) return recipients.indexOf(item) == pos;
            })
          }

          let msg = '<span><b>ID: </b>' + result._id + '<br>'
            + '<span><b>Note: </b> ' + result.ticketNote + '<br>'
            + '<span><b>Added by: </b> ' + data.email + '<br>'
            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
          let obj = {
            action: 'sendNoReplyEmail',
            to: recipients,
            subject: 'New Note added to Ticket #' + result._id,
            message: msg,
            html: msg,
            type: 'newNote'
          }
          let response;
          if (recipients && recipients.length) response = await EmailService.SendNoReplyEmail(obj, false);

        }

      })
    }
    else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in get executing scenario');
  }
});

// router.post('/revertScenario', async (req, res) => {
//     try {
//         let data = req.body;
//         let ticketlog = ComposedTicketENUM(TicketLogMessages.REVERT_SCENARIO, { value: '', by: data.email })
//         let reverted = await Tickets.RevertScenario(data.ids, data.nsp, ticketlog);
//         if (reverted && reverted.value) {
//             res.send({ status: 'ok', revertScenario: reverted.value, ticketlog: ticketlog });
//         } else {
//             res.send({ status: 'error', revertScenario: undefined });
//         }
//     }

//     catch (error) {
//         console.log(error);
//         console.log('error in revert scenario');
//     }
// });
/* #endregion */

/* #region  Ticket Reply */
router.post('/replyTicket', async (req, res) => {
  try {
    console.log('replyTicket');
    let data = req.body;
    let sign = await Tickets.getActiveSignature(data.email);
    if (sign && sign.length) {
      data.ticket.message = sign[0].header + '<br>' + data.ticket.message + '<br>' + sign[0].footer
    }
    // console.log(data)
    if (data.mergedTicketIds && data.mergedTicketIds.length) {
      data.ticket.datetime = new Date().toISOString();
      let subjectForMerged = data.ticket.subject.toString();
      delete data.ticket.subject;
      data.ticket._id = new ObjectID();
      let ticketsData = await Tickets.getTicketsData(data.mergedTicketIds);
      if (ticketsData && ticketsData.length) {
        let messageId = await Tickets.GetMessageIdByTID(data.mergedTicketIds);
        let response: S3.DeleteObjectOutput | SQS.SendMessageResult | AWSError | undefined;
        data.ticket.nsp = data.nsp;
        let insertMessageForMerge = await Tickets.InsertMessage(data.ticket, 'Agent');
        let updatedTicket = await Tickets.UpdateTicketTouchedTime(data.mergedTicketIds[0], data.nsp);
        if (insertMessageForMerge.insertedCount && updatedTicket && updatedTicket.length) {
          //Status SEnding

          res.send({ status: 'ok', ticket: data.ticket });
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data.nsp, roomName: ['ticketAdmin'], data: { ticket: insertMessageForMerge.ops[0], viewState: 'READ' } })

          updatedTicket.map(async ticket => {
            if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data.nsp, roomName: [ticket.group], data: { ticket: insertMessageForMerge.ops[0], viewState: 'READ' } })
          })

          // notification sending to assigned agent
          if (updatedTicket && updatedTicket.length && updatedTicket[0].assigned_to) {
            let assignedTo = await SessionManager.getAgentByEmail(data.nsp, updatedTicket[0].assigned_to);
            if (assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly') {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data.nsp, roomName: [assignedTo._id], data: { ticket: insertMessageForMerge.ops[0], viewState: 'READ' } })
            }
          }
          if (updatedTicket && updatedTicket.length && updatedTicket[0].watchers) {
            let res = updatedTicket[0];
            let watchers = await SessionManager.getOnlineWatchers(data.nsp, updatedTicket[0].watchers);
            if (watchers && watchers.length) {
              if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
              watchers.map(async watcher => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data.nsp, roomName: [watcher._id], data: { ticket: insertMessageForMerge.ops[0], viewState: 'READ' } })
              })
            }
          }
          if (insertMessageForMerge && insertMessageForMerge.insertedCount) {
            data.ticket.subject = subjectForMerged;
            if (data.ticket.from != ticketEmail) {
              //Status SENT
              let activatedSurvey = await FeedBackSurveyModel.getActivatedSurvey();

              if (activatedSurvey && activatedSurvey.length && activatedSurvey[0].sendWhen == "replies") {

                // response = await EmailService.SendEmail({
                //     action: 'sendEmail',
                //     reply: data.ticket,
                //     ticketsData: ticketsData,
                //     nsp: data.nsp.substring(1),
                //     inReplyTo: (messageId && messageId.length) ? messageId : undefined
                // }, 5, true);

                response = await EmailService.SendEmail({
                  action: 'SendFeedbackSurveyEmail',
                  reply: data.ticket,
                  survey: activatedSurvey[0],
                  ticketsData: ticketsData,
                  nsp: data.nsp.substring(1),
                  inReplyTo: (messageId && messageId.length) ? messageId : undefined
                }, 5, true);
              }

              else if (activatedSurvey && activatedSurvey.length && activatedSurvey[0].sendWhen == "manually_attached" && data.ticket.survey) {

                response = await EmailService.SendEmail({
                  action: 'SendFeedbackSurveyEmail',
                  reply: data.ticket,
                  survey: activatedSurvey[0],
                  ticketsData: ticketsData,
                  nsp: data.nsp.substring(1),
                  inReplyTo: (messageId && messageId.length) ? messageId : undefined
                }, 5, true);
              }

              else {

                response = await EmailService.SendEmail({
                  action: 'sendEmail',
                  reply: data.ticket,
                  username: (data.username) ? data.username : '',
                  ticketsData: ticketsData,
                  nsp: data.nsp.substring(1),
                  inReplyTo: (messageId && messageId.length) ? messageId : undefined
                }, 5, true);
              }
            }
            else {
              //Status SENT
              response = await EmailService.SendSupportEmail({
                action: 'sendSupportEmail',
                reply: data.ticket,
                ticketsData: ticketsData,
                nsp: data.nsp.substring(1),
                inReplyTo: (messageId && messageId.length) ? messageId : undefined
              }, 5, true);
            }
          }
          else {
            //Status Failed
            res.send({ status: 'error', ticket: data.ticket });
          }

        }
      } else {
        //Status failed
        res.send({ status: 'error', ticket: data.ticket });

      }

    }
    //check if reply is within violation time, false slaenvaled flag.
    else {
      //Status failed
      res.send({ status: 'error', ticket: data.ticket });

    }
  } catch (error) {
    console.log(error);
    console.log('error in Reply Ticket');
    res.send({ status: 'error' });
    //Status Failed
  }

});
/* #endregion */

/* #region  New Ticket Insertion */
router.post('/insertNewTicket', async (req, res) => {
  try {

    let data = req.body;
    let sessionObj = res.locals.sessionObj;
    // if (!data.details.thread || !data.details.message) throw new Error('Invalid Request');
    let origin = await Agents.GetEmailNotificationSettings(sessionObj.nsp, sessionObj.email);
    let originNSP = await Company.GetEmailNotificationSettings(sessionObj.nsp);
    let randomColor = rand[Math.floor(Math.random() * rand.length)];
    let primaryEmail = await Tickets.GetPrimaryEmail(sessionObj.nsp);
    if (data.details.thread.cannedForm) {
      data.details.thread.cannedForm.id = new ObjectID(data.details.thread.cannedForm.id);
    }
    if (primaryEmail && primaryEmail.length) {
      let ticket: TicketSchema;
      ticket = {
        type: 'email',
        subject: data.details.thread.subject,
        nsp: data.nsp,
        priority: data.details.thread.priority,
        state: data.details.thread.state,
        datetime: new Date().toISOString(),
        from: data.details.thread.visitor.email,
        visitor: {
          name: data.details.thread.visitor.name,
          email: data.details.thread.visitor.email
        },
        lasttouchedTime: new Date().toISOString(),
        viewState: 'UNREAD',
        createdBy: 'Agent',
        agentName: data.email,
        ticketlog: [],
        mergedTicketIds: [],
        viewColor: randomColor,
        group: data.details.thread.group ? data.details.thread.group : '',
        assigned_to: data.details.thread.assigned_to ? data.details.thread.assigned_to : '',
        tags: data.details.thread.tags ? data.details.thread.tags : [],
        watchers: data.details.thread.watchers ? data.details.thread.watchers : [],
        cannedForm: data.details.thread.cannedForm ? data.details.thread.cannedForm : undefined,
        source: 'panel',
        slaPolicy: {
          reminderResolution: false,
          reminderResponse: false,
          violationResponse: false,
          violationResolution: false
        },
        InternalSlaPolicy: {
          reminder: false,
          escalation: false
        },
        assignmentList: []
      };

      //Ticket Automation Work
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
      //Check if assigned_to has Agent
      let insertedTicket = await Tickets.CreateTicket(ticket);

      let ticketId: ObjectID | undefined;
      if (insertedTicket && insertedTicket.insertedCount) {
        ticketId = insertedTicket.insertedId as ObjectID
      }
      if (ticketId) {
        let arr: any = [];
        arr.push(ticketId);
        let message: TicketMessageSchema = {
          datetime: new Date().toISOString(),
          nsp: data.nsp,
          senderType: 'Visitor',
          message: data.details.message.body,
          from: data.details.thread.visitor.email,
          to: ticketEmail,
          replytoAddress: data.details.thread.visitor.email,
          tid: [ticketId],
          attachment: [],
          viewColor: '',
          form: (data.form) ? data.form : '',
          submittedForm: (data.submittedForm) ? data.submittedForm : ''

        };
        let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
        if (insertedMessage && insertedMessage.insertedCount && insertedTicket && insertedTicket.insertedCount) {
          res.send({ status: 'ok', ticket: insertedTicket.ops[0] });
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } })
          if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [ticket.group], data: { ticket: insertedTicket.ops[0] } })

          if (insertedTicket.ops[0].watchers) {
            let watchers = await SessionManager.getOnlineWatchers(data.nsp, insertedTicket.ops[0].watchers);

            if (watchers && watchers.length) {
              watchers.map(async single => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [single._id], data: { ticket: insertedTicket ? insertedTicket.ops[0] : undefined } })
              })
            }
          }
          if (insertedTicket.ops[0].assigned_to) {
            let EmailRecipients = Array();
            let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, data.nsp);
            if (res && res.length) {
              EmailRecipients = EmailRecipients.concat(res[0].watchers);
            }
            EmailRecipients.push(insertedTicket.ops[0].assigned_to);
            let recipients = EmailRecipients.filter((item, pos) => {
              return EmailRecipients.indexOf(item) == pos;
            })
            // let onlineAgent = await SessionManager.getAgentByEmail(data.nsp, insertedTicket.ops[0].assigned_to);

            // if (onlineAgent && !onlineAgent.groups.includes(ticket.group)) {
            //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket.ops[0] } })
            // }
            if (origin && origin.length && origin[0].settings.emailNotifications.assignToAgent) {
              let msg = '<span><b>ID: </b>' + ticketId + '<br>'
                + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
              let obj = {
                action: 'sendNoReplyEmail',
                to: recipients,
                subject: 'You have been assigned a new ticket #' + ticketId,
                message: msg,
                html: msg,
                type: 'agentAssigned'
              }

              let response = EmailService.SendNoReplyEmail(obj, false);
            }
            // TODO email sending
          }
          if (insertedTicket.ops[0].group) {
            if (originNSP && originNSP.length && originNSP[0].settings.emailNotifications.tickets.assignToGroup) {
              let groupAdmins = await TicketGroupsModel.GetGroupAdmins(data.nsp, ticket.group);
              if (groupAdmins) {
                let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, data.nsp);
                if (res && res.length) {
                  groupAdmins = groupAdmins.concat(res[0].watchers);
                }
                let recipients = groupAdmins.filter((item, pos) => {
                  if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
                })
                recipients.forEach(async admin => {
                  let msg = '<span><b>ID: </b>' + ticketId + '<br>'
                    + '<span><b>Group: </b> ' + ticket.group + '<br>'
                    + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                    + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
                  let obj = {
                    action: 'sendNoReplyEmail',
                    to: admin,
                    subject: 'Group assigned to Ticket #' + ticketId,
                    message: msg,
                    html: msg,
                    type: 'newTicket'
                  }

                  let response = EmailService.SendNoReplyEmail(obj, false);
                });
              }
            }
          }
        } else {
          res.send({ status: 'error', msg: 'Unable To Create Ticket' });
        }
      } else {
        res.send({ status: 'error', msg: 'Unable To Create Ticket' });
      }
      return;
    } else {
      res.send({ status: 'error', msg: 'Unable To Create Ticket' });
    }
  } catch (error) {
    console.log(error);
    console.log('error in Creating New Ticket');
    res.send({ status: 'error', msg: error })
  }
});
/* #endregion */

/* #region Customer Icon Registration */
router.post('/RegisterCustomer', async (req, res) => {
  try {
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body;
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
    // console.log(customerData);
    let registerCustomerDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=VG8ShVbAq5QVfb8K0mkanDeoq63qz9aN0KIcppb1CCYGNRNSGO3fTA==";
    let registerCustomerStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=PdSaRLUU48BkwakllFMnYcaHIEZ7qpvJbaOm11i88rGvoEAmLPYOcQ==";
    let registerCustomerProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=EJpXGBballVmi1R9prsk6P5/wpqFMsA3p233Iib41rmBS75wTf6cog==";
    let response = await request.post({
      url: registerCustomerProduction,
      body: customerData,
      json: true,
      timeout: 60000
    });

    if (response) {
      res.send({ status: 'ok', response: response });
    }
    else res.status(401).send({ status: 'error' });

  } catch (error) {
    // console.log(error);
    console.log('error in registered customer');
    res.status(401).send({ status: 'error' });
  }

});
/* #endregion */

/* #region Check Customer Registration in Icon */
router.post('/CheckRegistration', async (req, res) => {
  try {
    // let groups = ['UK Inquires', 'INB MACHINERY', 'INB OTHER MKT (NIGHT)', 'INB TRUCK DAY (GROUP A)', 'INB TRUCK DAY (GROUP B)', 'INB TRUCK DAY (GROUP C)', 'INB TRUCK DAY (TAGGED) LMs', 'INB TRUCK NIGHT (GROUP E)', 'INB TRUCK NIGHT (TAGGED) LMS', 'INB TRUCK NIGHT(GROUP D)', 'SBT UAE INFORMATION - IN HOUSE', 'JAPAN IT HELPDESK', 'Korea Operations', 'China Operations', 'USA Operations', 'Germany Operations', 'Singapore Operations', 'Australia Operations', 'South Africa Operations', 'Collection Team', 'Collection Night Team', 'JAPAN IT HELPDESK', 'Collection Myanmar', 'PK Inbound Sales', 'Kaitore'];
    let results = Array();
    let promises = [];
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    let data = req.body;
    let groups = await TicketGroupsModel.getExcludeGroups(data.nsp);
    if (Array.isArray(data.customerEmail) || Array.isArray(data.customerPhone)) {
      data.customerEmail.map(mail => {
        promises = promises.concat(data.customerPhone.map(async val => {
          let customerData = {
            "MailAddress": (mail) ? mail.toLowerCase() : '',
            "PhoneNumber": (val) ? val : '',
            "StockId": '',
            "CustomerId": (data.customerID) ? data.customerID : '',
          }
          let response = await request.post({
            uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
            body: customerData,
            json: true,
            timeout: 60000
          });

          if (response) {
            results.push(response);
          }
        }))
      });
      await Promise.all(promises).then(val => {
        res.send({ status: 'ok', response: results, groups: groups });
      });
    }
    else {
      let customerData = {
        "MailAddress": (data.customerEmail) ? data.customerEmail : '',
        "PhoneNumber": (data.customerPhone) ? data.customerPhone : '',
        "StockId": '',
        "CustomerId": (data.customerID) ? data.customerID : '',
      }
      let response = await request.post({
        uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
        body: customerData,
        json: true,
        timeout: 50000
      });
      if (response) {
        res.send({ status: 'ok', response: [response], groups: groups });
      }
      else res.status(401).send({ error: 'error' });
    }


  } catch (error) {
    // console.log(error);
    console.log('error in getting registered customer');
    res.status(401).send({ error: 'error' });
  }

});

router.post('/InsertCustomerInfo', async (req, res) => {
  let data = req.body;
  let result: any;
  let check: any;
  let ticketlog;
  if (data.assignment != '') {
    ticketlog = ComposedTicketENUM(TicketLogMessages.CUSTOMER_REGISTERED, { value: data.cusInfo.customerId, by: data.email, ByextraOptions: data.assignment })
  }
  else {
    ticketlog = ComposedTicketENUM(TicketLogMessages.CUSTOMER_REGISTERED, { value: data.cusInfo.customerId, by: data.email })

  }
  if ((data.visitorEmail && data.visitorEmail.length) || (data.visitorPhone && data.visitorPhone.length)) {
    check = await Tickets.CheckRegAgainstVisitor(data.visitorEmail, data.visitorPhone, data.nsp);
    if (check && check.length) {
      result = await Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, check[0].reg_date);
    }
    else {
      result = await Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, new Date().toISOString());
    }
  }
  else {
    result = await Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, new Date().toISOString());
  }


  if (result && result.value) {
    if (data.iconIntroducerEmail != '') {
      //message of cmid to agent
      let msg = `
            <p>Respectfully,<br />This is to inform you that your sent registration data to register customer in ICONN is registered successfully.</p>
            <p>The customer ID of registered customer is:<b> ${data.cusInfo.customerId}</b><br></p>

            <p>Regards,</p>
            <p>Beelinks Team.</p>
            `;
      let obj = {
        action: 'sendNoReplyEmail',
        to: data.iconIntroducerEmail,
        subject: 'Customer Registered by provided ICONN Registration Data',
        message: msg,
        html: msg,
        type: 'agentAssigned'
      }
      let response = EmailService.SendNoReplyEmail(obj, false);
    }
    res.send({ status: 'ok', ticket: result.value, ticketlog: ticketlog });
  }
  else {
    res.status(401).send({ error: 'error' });
  }

});

router.post('/UnbindCustomer', async (req, res) => {
  let data = req.body;
  let ticketlog = ComposedTicketENUM(TicketLogMessages.UNBIND_ICON_CUSTOMER, { value: data.custId, by: data.email })
  let result = await Tickets.UnBindIconnCustomer(data.id, data.nsp, ticketlog);

  if (result && result.value) {

    res.send({ status: 'ok', ticketlog: ticketlog });
  }
  else {
    res.status(401).send({ error: 'error' });
  }
});
/* #endregion */

/**Icon Registration through dialog */
router.post('/sendRegistrationData', async (req, res) => {
  try {
    let data = req.body;
    let msg = '';
    let settings = await Company.getSettings(data.nsp);
    let configurableEmail = '';
    if (settings && settings.length) {
      configurableEmail = settings[0].settings.iconnSettings.configurableEmail;
    }

    msg += `<p>Respectfully,</p>
        <p><strong>Registration request details are as follows:</strong></p>
        <table style="height: 245; width: 400; float: left;" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
        <td style="width: 250px;">Customer Name</td>
        <td style="width: 300px;">${data.details.customerName} </td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 250px;">Company Name</td>
        <td style="width: 300px;">${data.details.customerName}</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 250px;">Default Email</td>
        <td style="width: 300px;">${data.details.contactMailEmailAddress[0]}</td>
        <td>&nbsp;</td>

        </tr>
        `
    if (data.details.contactMailEmailAddress.length > 1) {
      data.details.contactMailEmailAddress.map((val, ind) => {
        if (ind != 0) {
          msg += `<tr>
                    <td style="width: 250px;">Email (Alternate) # ${ind}</td>
                    <td style="width: 300px;"> ${val} </td>
                    <td>&nbsp;</td>
                    `
        }
      });
      msg += `</tr>`

    }
    msg += `<tr>
        <td style="width: 250px;">Country</td>
        <td style="width: 300px;"> ${data.details.destCountry}</td>
        <td>&nbsp;</td>

        </tr>
        <tr>
        <td style="width: 250px;">Port</td>
        <td style="width: 300px;">${data.details.port}</td>
        <td>&nbsp;</td>

        </tr>
        <tr>
        <td style="width: 250px;">Default Phone</td>
        <td style="width: 300px;">${data.details.contactPhoneNumber[0]}</td>
        <td>&nbsp;</td>

        </tr>`

    if (data.details.contactPhoneNumber.length > 1) {
      data.details.contactPhoneNumber.map((val, ind) => {
        if (ind != 0) {
          msg += `<tr>
                    <td style="width: 250px;">Phone (Alternate) # ${ind}</td>
                    <td style="width: 300px;"> ${val} </td>
                    <td>&nbsp;</td>
                    `
        }
      });

    }
    msg += ` </tbody>
        </table>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>

        <br>`
    if (data.details.introducerCode && data.details.introducer) {
      msg += `
            <p><strong>Introducer details are as follows:</strong></p>
        <table style="height: 56px; float: left;" width="306">
        <tbody>
        <tr>
        <td style="width: 145px;">Employee Id</td>
        <td style="width: 145px;">${data.details.introducerCode}</td>
        </tr>
        <tr>
        <td style="width: 145px;">Employee Name</td>
        <td style="width: 145px;">${data.details.introducer}</td>
        </tr>
        </tbody>
        </table>
            `
    }
    if (data.details.salePersonUserCode && data.details.salesPerson) {
      msg += `<p style="text-align: left;">&nbsp;</p>
        <p style="text-align: left;">&nbsp;</p>
        <br>
        <p style="text-align: left;"><strong>Sales-Person details are as follows:</strong></p>
        <table style="height: 61px; float: left;" width="297">
        <tbody>
        <tr>
        <td style="width: 139px;">Employee id</td>
        <td style="width: 142px;">${data.details.salePersonUserCode}</td>
        </tr>
        <tr>
        <td style="width: 139px;">Employee Name</td>
        <td style="width: 142px;">${data.details.salesPerson}</td>
        </tr>
        </tbody>
        </table>`

    }
    `<p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>Regards,</p>
        <p>Beelinks Team.</p>
`;

    let randomColor = rand[Math.floor(Math.random() * rand.length)];
    let incomingEmail = await Tickets.GetIncomingEmails(configurableEmail);
    if (incomingEmail && incomingEmail.length && configurableEmail) {
      let ticket: TicketSchema;
      ticket = {
        type: 'email',
        subject: 'ICONN Data',
        nsp: data.nsp,
        priority: '',
        state: 'OPEN',
        datetime: new Date().toISOString(),
        from: configurableEmail,
        visitor: {
          name: 'ICONN Registration Data Ticket',
          email: data.agentEmail
        },
        IconnIntroducerEmail: data.agentEmail,
        ICONNData: data.details,
        lasttouchedTime: new Date().toISOString(),
        viewState: 'UNREAD',
        createdBy: 'Agent',
        ticketlog: [],
        mergedTicketIds: [],
        viewColor: randomColor,
        group: incomingEmail[0].group ? incomingEmail[0].group : '',
        assigned_to: '',
        tags: ['#ICONN_REGISTRATION_DATA'],
        watchers: [],
        source: 'panel',
        assignmentList: []
      };
      ticket = await RuleSetDescriptor(ticket, incomingEmail[0].applyExternalRulesets);

      if (ticket.assigned_to) {
        ticket.assignmentList = [
          {
            assigned_to: ticket.assigned_to,
            assigned_time: ticket.first_assigned_time,
            read_date: ''
          }
        ]
      }

      let insertedTicket = await Tickets.CreateTicket(ticket);
      let ticketId: ObjectID | undefined;
      if (insertedTicket && insertedTicket.insertedCount) {
        ticketId = insertedTicket.insertedId as ObjectID
      }
      if (ticketId) {
        let arr: any = [];
        arr.push(ticketId);
        let message: TicketMessageSchema = {
          datetime: new Date().toISOString(),
          nsp: data.nsp,
          senderType: 'Visitor',
          message: msg,
          from: data.agentEmail,
          to: configurableEmail,
          replytoAddress: data.agentEmail,
          tid: [ticketId],
          attachment: [],
          viewColor: '',
          form: (data.form) ? data.form : '',
          submittedForm: (data.submittedForm) ? data.submittedForm : ''

        };
        let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
        if (insertedMessage && insertedMessage.insertedCount && insertedTicket && insertedTicket.insertedCount) {
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } })

          if (insertedTicket.ops[0].watchers && insertedTicket.ops[0].watchers.length) {
            let watchers = await SessionManager.getOnlineWatchers(data.nsp, insertedTicket.ops[0].watchers);

            if (watchers && watchers.length) {
              watchers.map(async single => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [single._id], data: { ticket: insertedTicket ? insertedTicket.ops[0] : undefined } })
              })
            }
          }

          if (insertedTicket.ops[0].IconnIntroducerEmail) {
            let message = '';
            message += 'Dear Agent,<br>'
              + '<span>Your request for sending registration data is sent to respective person successfully and ticket is created against your request.<br>'
              + 'You will get response after your data is accessed and registered</span><br><br>'
              + 'Regards, <br> Beelinks Team.'
              + '<br> The copy of message can be seen below.<br>'
              + '----------------------------------------------------------------------------------------------------<br>'
              + '----------------------------------------------------------------------------------------------------';
            message += msg;
            let obj = {
              action: 'sendNoReplyEmail',
              to: insertedTicket.ops[0].IconnIntroducerEmail,
              subject: 'Request Sent for Registration data',
              message: message,
              html: message,
              type: 'newTicket'
            }

            let response = EmailService.SendNoReplyEmail(obj, false);
          }
          //SEND EMAIL TO ASSIGNED TICKET PERSON
          if (insertedTicket.ops[0].assigned_to) {
            let origin = await Agents.GetEmailNotificationSettings(data.nsp, data.agentEmail);
            if (origin && origin.length && origin[0].settings.emailNotifications.assignToAgent) {

              let EmailRecipients = Array();
              let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, data.nsp);
              if (res && res.length) {
                EmailRecipients = EmailRecipients.concat(res[0].watchers);
              }
              EmailRecipients.push(insertedTicket.ops[0].assigned_to);
              if (insertedTicket.ops[0].nsp == '/sbtjapan.com' || insertedTicket.ops[0].nsp == '/sbtjapaninquiries.com') {
                EmailRecipients.push('globalqc@sbtjapan.com');
              }

              let recipients = EmailRecipients.filter((item, pos) => {
                return EmailRecipients.indexOf(item) == pos;
              })

              let onlineAgent = await SessionManager.getAgentByEmail(data.nsp, insertedTicket.ops[0].assigned_to);

              if (onlineAgent) {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket.ops[0] } })
              }

              let message = '';
              message += msg;
              message += '<br><br><span><b>ID: </b>' + ticketId + '<br>'
                + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';

              let obj = {
                action: 'sendNoReplyEmail',
                to: recipients,
                subject: 'ICONN Registration Data Ticket assigned # ' + ticketId,
                message: message,
                html: message,
                type: 'agentAssigned'
              }

              let response = EmailService.SendNoReplyEmail(obj, false);
            }
          }
          if (insertedTicket.ops[0].group) {
            let originNSP = await Company.GetEmailNotificationSettings(data.nsp);
            if (originNSP && originNSP.length && originNSP[0].settings.emailNotifications.tickets.assignToGroup) {
              let groupAdmins = await TicketGroupsModel.GetGroupAdmins(data.nsp, ticket.group);
              if (groupAdmins) {
                let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, data.nsp);
                if (res && res.length) {
                  groupAdmins = groupAdmins.concat(res[0].watchers);
                }
                let recipients = groupAdmins.filter((item, pos) => {
                  if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
                })
                recipients.forEach(async admin => {
                  let msg = '<span><b>ID: </b>' + ticketId + '<br>'
                    + '<span><b>Group: </b> ' + ticket.group + '<br>'
                    + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                    + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
                  let obj = {
                    action: 'sendNoReplyEmail',
                    to: admin,
                    subject: 'Group assigned to Ticket #' + ticketId,
                    message: msg,
                    html: msg,
                    type: 'newTicket'
                  }

                  let response = EmailService.SendNoReplyEmail(obj, false);
                });
              }
            }
          }
          res.send({ status: 'ok', ticket: insertedTicket.ops[0] });

        }
      }
    } else {
      res.send({ status: 'error' })
    }
  } catch (error) {
    console.log(error);
    console.log('error in sending data of customer');
    res.status(401).send({ error: 'error' });
  }

});

/* #region  Agents */

router.post('/getAgentAgainstWatchers', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.watcherList) res.status(401).send('Invalid Request!');
    let agents = await Agents.getAgentAgainstWatchers(data.nsp, data.watcherList);
    if (agents && agents.length) {
      res.send({ status: 'ok', agents: agents });
    }
    else {
      res.send({ status: 'error', msg: 'Agent list not found!' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting agents against watchers');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getAgentsAgainstGroup', async (req, res) => {
  try {

    let data = req.body;
    if (!data.nsp || !data.groupList) res.status(401).send('Invalid Request!');
    if (data.groupList) {
      let agents = await TicketGroupsModel.getAgentsAgainstGroup(data.nsp, data.groupList);
      // let temp: any = await Tickets.getTicketsCountOP(req.body.nsp);
      // agents.map(res => {
      //   let agentTicketCount = temp.filter(t => res.email == t._id)[0];
      //   if (agentTicketCount) {
      //     res.openTickets = agentTicketCount.open
      //     res.pendingTickets = agentTicketCount.pending
      //   } else {
      //     res.openTickets = 0
      //     res.pendingTickets = 0
      //   }
      //   return res;
      // });
      res.send({ status: 'ok', agents: agents })
    } else {
      res.send({ status: 'error', msg: 'Group list not defined!' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get agents against group');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getAgentsAgaintTeams', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.teams) res.status(401).send('Invalid Request!');
    if (data.teams) {
      let agents = await TeamsModel.getTeamsMembersAgainstTeams(data.nsp, data.teams);
      res.send({ status: 'ok', agents: agents })
    } else {
      res.send({ status: 'error', msg: 'Group list not defined!' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get agents against teams');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getAllAgentsAgainstAdmin', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let agents = await TicketGroupsModel.getAllAgentsAgainstAdmin(data.nsp, data.email);
    res.send({ status: 'ok', agents: agents })
  } catch (err) {
    console.log(err);
    console.log('Error in get agents against admin');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getAgentByEmail', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');

    // console.log('Get agent by email: ' + data.email);
    let agent = await Agents.getAgentByEmail(data.nsp, data.email);
    if (agent) {
      res.send({ status: 'ok', agentInfo: agent })
    }
    else {
      res.send({ status: 'error' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get agents by email');
    res.status(401).send('Invalid Request!');
  }
});


/* #endregion */

/* #region  Incoming Email */
router.post('/getIncomingEmailsByNSP', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send('Invalid Request!');
    let email_data = await Tickets.GetIncomingEmailsByNSP(data.nsp);
    if (email_data) {
      // console.log(email_data);
      res.send({ status: 'ok', email_data: email_data });
    } else {
      res.send({ status: 'error', msg: 'No incoming emails by nsp found!' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting incoming emails by nsp');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getIncomingEmails', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) res.status(401).send('Invalid Request!');
    let email_data = await Tickets.GetIncomingEmails(data.email);
    if (email_data && email_data.length) {
      // console.log(email_data);
      res.send({ status: 'ok', email_data: email_data });
    } else {
      res.send({ status: 'error', msg: 'No incoming emails found!' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting incoming emails');
    res.status(401).send('Invalid Request!');
  }
})

router.post('/addIncomingEmail', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) res.status(401).send('Invalid Request!');
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.incomingEmail.maxIncomingEmails != -1) {
      let groupsCount = await Tickets.GetIncomingEmailsCount(data.nsp);
      if (groupsCount && groupsCount.length && pkg[0].package.tickets.incomingEmail.maxIncomingEmails && groupsCount[0].count >= pkg[0].package.tickets.incomingEmail.maxIncomingEmails) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    let result = await Tickets.AddIncomingEmail(data.domainEmail, data.incomingEmail, data.group, data.name, data.nsp);
    if (result && result.insertedCount) {
      res.send({ status: 'ok', msg: 'Incoming Email of Agent Added!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable To add incoming email of agent' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in adding incoming email');
  }
})
router.post('/addRuleSet', async (req, res) => {
  try {

    let data = req.body;
    console.log(data);
    let pkg = await Company.getPackages(data.nsp);
    console.log(pkg);
    if (pkg && pkg.length && pkg[0].package.tickets.rulesets.quota != -1) {
      let groupsCount = await TicketGroupsModel.getRulesetsCount(data.nsp);
      if (groupsCount && groupsCount.length && pkg[0].package.tickets.rulesets.quota && groupsCount[0].count >= pkg[0].package.tickets.rulesets.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    let ruleSetInDb: RuleSetSchema = {
      nsp: data.nsp,
      name: data.ruleset.name,
      conditions: data.ruleset.conditions,
      actions: data.ruleset.actions,
      lastmodified: data.ruleset.lastmodified,
      operator: data.ruleset.operator,
      isActive: data.ruleset.isActive
    }
    let ruleSet = await TicketGroupsModel.addRuleSet(ruleSetInDb);// socket.handshake.session.nsp,data.rulename, data.condition, );

    if (ruleSet && ruleSet.insertedCount) res.send({ status: 'ok', ruleset: ruleSet.ops[0] });
    else res.send({ status: 'error', msg: 'No RuleSet added!' });

  } catch (error) {
    console.log(error);
  }
})

router.post('/updateIncomingId', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) res.status(401).send('Invalid Request!');
    let updatedemail_data = await Tickets.UpdateIncomingEmailId(data.emailId, data.domainEmail, data.incomingEmail, data.name, data.group, data.nsp);
    if (updatedemail_data && updatedemail_data.value) {

      res.send({ status: 'ok', Updateddata: updatedemail_data.value });
    } else {
      res.send({ status: 'error', msg: 'No incoming emails deleted!' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in adding incoming email');
  }
})

router.post('/deleteIncomingId', async (req, res) => {
  try {
    let data = req.body;
    let deletedemail_data = await Tickets.DeleteIncomingEmailId(data.emailId, data.nsp);
    if (deletedemail_data) {
      let packet = {
        action: 'RemoveIdentity',
        email: data.email
      }
      EmailService.SendNoReplyEmail(packet, true);
      res.send({ status: 'ok', msg: "Incoming Email Deleted" });
    } else {
      res.send({ status: 'error', msg: 'No incoming emails deleted!' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in deleting incoming email');
  }
})

router.post('/sendActivation', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) res.status(401).send('Invalid Request!');
    let id = new ObjectID();
    id.toString()
    let token: TokenSchema = {
      email: data.emailId,
      expiryDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString(),
      id: id.toHexString(),
      type: 'emailActivation'
    }

    Tokens.inserToken(token);
    let origin = await Company.GetEmailNotificationSettings(data.nsp);
    if (origin && origin.length && origin[0].settings.emailNotifications.tickets.userActEmail) {

      await EmailService.SendActivationEmail({ to: data.emailId, subject: 'Activation Email', message: 'https://app.beelinks.solutions/agent/activation/' + token.id });
      res.send({ status: 'ok', msg: "Activation Email Sent" });
    }

    res.send({ status: 'ok', msg: "Activation Email Notification Disabled" });

  } catch (error) {
    console.log(error);
    console.log('Error in sending act. email');
  }
})

router.post('/sendIdentityVerificationEmail', async (req, res) => {
  try {
    let data = req.body;
    if (data.email) {
      let exists = await EmailActivations.checkEmailIfAlreadySent(data.email);
      if (exists && exists.length) {
        res.send({ status: 'error', msg: "Identitity Verification has been sent already please verify!" });
      } else {
        let packet = {
          action: 'IdentityVerification',
          email: data.email
        }
        await EmailService.SendNoReplyEmail(packet, true);
        res.send({ status: 'ok', msg: "Identitity Verification Email Sent!" });
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in sendIdentityVerificationEmail');
  }
});

router.post('/toggleUseOriginalEmail', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.ToggleUseOriginalEmail(data.id, data.value);
    if (result && result.value) {
      res.send({ status: 'ok', msg: ((data.value) ? 'Enabled' : 'Disabled') + ' sending from original email!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable to toggle the use of original email!' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in toggleUseOriginalEmail');
  }
});

router.post('/toggleExternalRuleset', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.ToggleExternalRuleset(data.id, data.value);
    if (result && result.value) {
      res.send({ status: 'ok', msg: 'External ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable To toggle' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in toggleUseOriginalEmail');
  }
});
router.post('/toggleIconnDispatcher', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.ToggleIconnDispatcher(data.id, data.value);
    if (result && result.value) {
      res.send({ status: 'ok', msg: 'Iconn Dispatcher ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable To toggle' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in toggleUseOriginalEmail');
  }
});

router.post('/toggleIconnDispatcherTicketView', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.ToggleIconnDispatcherTicketView(data.id, data.value);
    if (result && result.value) {
      res.send({ status: 'ok', msg: 'Iconn Dispatcher while opening ticket ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable To toggle' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in toggleUseOriginalEmail');
  }
});

router.post('/toggleAckEmail', async (req, res) => {
  try {
    let data = req.body;
    let result = await Tickets.ToggleAckEmail(data.id, data.value);
    if (result && result.value) {
      res.send({ status: 'ok', msg: 'Acknowledgement Email toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
    }
    else {
      res.send({ status: 'error', msg: 'Unable To toggle' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in toggleUseOriginalEmail');
  }
});

router.post('/setPrimaryEmail', async (req, res) => {
  try {
    let data = req.body;
    let emailData = await Tickets.setPrimaryEmail(data.nsp, data.id, data.flag);
    if (emailData && emailData.value) {
      res.send({ status: 'ok', emailData: emailData.value });
    } else {
      res.send({ status: 'error', msg: 'Cannot set email primary' });
    }

  } catch (error) {
    console.log(error);
    console.log("error in setting primary email");
  }
});

/* #endregion */

/* #region  Groups */
router.post('/getGroupByNSP', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let groupFromDb = await TicketGroupsModel.GetGroupDetailsByNSP(data.nsp);
    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let ticketPermissions = session.permissions.tickets;
      if (groupFromDb) {
        if (ticketPermissions.canView == 'group') {
          groupFromDb = groupFromDb.filter(g => g.agent_list.filter(a => a.email == data.email).length)
        }
        res.send({ status: 'ok', group_data: groupFromDb });
      } else {
        res.send({ status: 'error', msg: 'No Groups found!' });
      }
    } else {
      res.status(401).send('Invalid Request!');
    }
  } catch (error) {
    console.log(error);
    console.log('Error in get groups by nsp');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/insertGroup', async (req, res) => {
  try {
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.groups.quota != -1) {
      let groupsCount = await TicketGroupsModel.GetGroupsCount(data.nsp);
      if (groupsCount && groupsCount.length && pkg[0].package.tickets.groups.quota && groupsCount[0].count >= pkg[0].package.tickets.groups.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'Limit Exceeded' });
        return;
      }
    }

    let groups = await TicketGroupsModel.InsertGroup(data.group, data.nsp);
    if (groups) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
      res.send({ status: 'ok' });
    } else {
      res.send({ status: 'error' });
    }

  } catch (error) {
    console.log(error);
    res.send({ status: 'error', msg: error });
  }
});
router.post('/insertTeam', async (req, res) => {
  try {
    // console.log("team add",data.team);
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.team.quota != -1) {
      let groupsCount = await TeamsModel.getTeamsCount(data.nsp);
      if (groupsCount && groupsCount.length && pkg[0].package.tickets.team.quota && groupsCount[0].count >= pkg[0].package.tickets.team.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'Limit Exceeded' });
        return;
      }
    }
    data.team.nsp = data.nsp;
    data.team.agents = [];
    let team = await TeamsModel.insertTeam(data.team);
    if (team && team.insertedCount > 0) {
      res.send({ status: 'ok', team: team.ops[0] });
    } else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    res.send({ status: 'error', msg: err })
  }
});
router.post('/addTicketTemplate', async (req, res) => {
  try {
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.ticketTemplate.quota != -1) {
      let checkCount = await TicketTemplateModel.TemplatesCount(data.nsp);
      if (checkCount && checkCount.length && pkg[0].package.tickets.ticketTemplate.quota && checkCount[0].count >= pkg[0].package.tickets.ticketTemplate.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    data.templateObj.cannedForm = data.templateObj.cannedForm ? new ObjectID(data.templateObj.cannedForm) : undefined;
    let template = await TicketTemplateModel.AddTicketTemplate(data.templateObj);

    if (template) {
      res.send({ status: 'ok', templateInserted: template.ops[0] });
    } else {
      res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
    }

  } catch (error) {
    console.log(error);
    console.log('error in creating ticket Template')
  }
});
router.post('/insertForm', async (req, res) => {
  try {
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.formDesigner.quota != -1) {
      let checkCount = await FormDesignerModel.GetFormsCount(data.nsp);
      if (checkCount && checkCount.length && pkg[0].package.tickets.formDesigner.quota && checkCount[0].count >= pkg[0].package.tickets.formDesigner.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    data.obj.lastModified.by = data.email;
    data.obj.lastModified.date = new Date().toISOString();
    // let actionUrl
    // if (data.obj.actionType != 'CustomUrl' && !data.obj.actionUrl) actionUrl = await FormDesignerModel.GetActionUrl(data.obj.actionType)

    // if (actionUrl) data.obj.actionUrl = actionUrl

    let result = await FormDesignerModel.InsertForm(data.obj);

    if (result && result.insertedCount) {
      res.send({ status: 'ok', forminserted: result.ops[0] });
    } else {
      res.send({ status: 'error', msg: "Error in designing Form!" });
    }

  } catch (error) {
    res.send({ status: 'error', msg: error });
  }
});
router.post('/AddPolicy', async (req, res) => {
  try {
    // console.log("before add");
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.SLA.quota != -1) {
      let checkCount = await SLAPolicyModel.getPoliciesCount(data.nsp);
      if (checkCount && checkCount.length && pkg[0].package.tickets.SLA.quota && checkCount[0].count >= pkg[0].package.tickets.SLA.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    let policy = await SLAPolicyModel.AddPolicy(data.policyObj);


    if (policy) {
      // console.log("added", policy.ops[0]);
      res.send({ status: 'ok', policyInserted: policy.ops[0] });
    } else {
      res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });

    }

  } catch (error) {
    console.log(error);
    console.log('error in creating policy')
  }
});
router.post('/addScenario', async (req, res) => {
  try {
    let data = req.body;
    let pkg = await Company.getPackages(data.nsp);
    if (pkg && pkg.length && pkg[0].package.tickets.scenarioAutomation.quota != -1) {
      let checkCount = await TicketScenariosModel.getScenariosCount(data.nsp);
      if (checkCount && checkCount.length && pkg[0].package.tickets.scenarioAutomation.quota && checkCount[0].count >= pkg[0].package.tickets.scenarioAutomation.quota) {
        // console.log('Limit Exceeded');
        res.send({ status: 'error', msg: 'Limit Exceeded!' });
        return;
      }
    }
    let scenario = await TicketScenariosModel.AddScenario(data.scenarioObj);

    if (scenario) {
      res.send({ status: 'ok', scenarioInserted: scenario.ops[0] });
    } else {
      res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
    }

  } catch (error) {
    console.log(error);
    console.log('error in creating scenario')
  }
});

router.post('/deleteGroup', async (req, res) => {
  try {
    let data = req.body;
    let group = await TicketGroupsModel.deleteGroup(data.group_name, data.nsp);
    if (group) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
      res.send({ status: 'ok', group_data: group });
    } else {
      res.send({ status: 'error' });
    }

  } catch (error) {
    res.send({ status: 'error', msg: error });
  }
});

router.post('/assignAgent', async (req, res) => {
  try {
    let data = req.body;
    let count = await TicketGroupsModel.getAgentAssignedCount(data.agent_email, "OPEN");
    if (count) {

      let agent_list: AgentListInfo = {
        email: data.agent_email,
        count: count.length,
        isAdmin: false,
        excluded: false
      }

      let group = await TicketGroupsModel.AssignAgent(data.agent_email, data.group_name, data.nsp, agent_list);
      if (group) {
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
        res.send({ status: 'ok' });
      } else {
        res.send({ status: 'error' });
      }
    }
  } catch (error) {
    res.send({ status: 'error', msg: error });
  }
});

router.post('/unAssignAgent', async (req, res) => {
  try {
    let data = req.body;

    let group = await TicketGroupsModel.UnAssignAgent(data.agent_email, data.group_name, data.nsp);

    if (group) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
      res.send({ status: 'ok' });
    } else {
      res.send({ status: 'error' });
    }
  }
  catch (error) {
    res.send({ status: 'error', msg: error });
  }
});

router.get('/exportCustomTickets', async (req, res) => {
  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    console.log('Export Tickets');
    Tickets.getCustomData2();
    res.send('Done!');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})

router.post('/toggleExclude', async (req, res) => {
  try {
    let data = req.body;
    let group = await TicketGroupsModel.toggleExclude(data.nsp, data.group_name, data.email, data.value);
    if (group) {
      res.send({ status: 'ok', group: group });
    } else {
      res.send({ status: 'error', msg: 'Toggle exclude error', data: data });
    }
  } catch (err) {
    console.log('Error in toggle admin');
    console.log(err);
  }
});

router.post('/toggleAdmin', async (req, res) => {
  try {
    let data = req.body;
    let group = await TicketGroupsModel.toggleAdmin(data.nsp, data.group_name, data.email, data.value);
    if (group) {
      res.send({ status: 'ok', group: group });
    } else {
      res.send({ status: 'error', msg: 'Toggle admin error', data: data });
    }
  } catch (err) {
    console.log('Error in toggle admin');
    console.log(err);
  }
});

router.post('/setGroupAutoAssign', async (req, res) => {
  try {
    let data = req.body;
    let group = await TicketGroupsModel.SetAutoAssign(data.nsp, data.group_name, data.auto_assign);
    if (group && group.value) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })

      res.send({ status: 'ok', group: group.value })
    } else {
      res.send({ status: 'error' })
    }
  } catch (err) {

  }
});

// router.post('/setICONNGroupAuto', async (req, res) => {
//     try {
//         let data = req.body;
//         let group = await TicketGroupsModel.setICONNGroupAuto(data.nsp, data.group_name, data.ICONNAuto);
//         if (group && group.value) {
//             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })

//             res.send({ status: 'ok', group: group.value })
//         } else {
//             res.send({ status: 'error' })
//         }
//     } catch (err) {

//     }
// });

router.post('/importSaveSettings', async (req, res) => {
  try {
    let data = req.body;
    let promises = [];
    promises = promises.concat(data.dataArray.map(async res => {
      await TicketGroupsModel.importSaveSettings(data.nsp, res.group_name, res.unEntertainedTime, res.assignmentLimit, res.fallbackLimitExceed, res.fallbackNoShift, res.unAvailibilityHours, res.enabled);
    }));
    await Promise.all(promises).then(val => {
      __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
      res.send({ status: 'ok', response: data.myData });
    });
  } catch (err) {
    console.log(err)
  }
});

router.post('/saveGeneralSettings', async (req, res) => {
  try {
    let data = req.body;
    let group = await TicketGroupsModel.saveGeneralSettings(data.nsp, data.group_name, data.settings);
    if (group && group.value) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })

      res.send({ status: 'ok' })
    } else {
      res.send({ status: 'error' })
    }
  } catch (err) {
    console.log(err)
  }
});


/* #endregion */

/* #region  Signature */
router.post('/saveSignature', async (req, res) => {
  try {
    let data = req.body;
    let savedSignature = await Tickets.EmailSignature(data.header, data.footer, data.email);
    if (savedSignature) {

      res.send({ status: 'ok', savedSignature: savedSignature.ops[0] });
    } else {
      res.send({ status: 'error' });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in adding ticket sign');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/updateSignature', async (req, res) => {
  try {
    let data = req.body;
    data.lastModified = new Date().toISOString();
    let updatedSignature = await Tickets.UpdateSignature(data.header, data.footer, data.id, data.lastModified, data.email);
    if (updatedSignature && updatedSignature.value) {
      res.send({ status: 'ok', updatedSignature: updatedSignature.value });
    } else {
      res.send({ status: 'error' });
    }

  } catch (err) {
    console.log(err);
    console.log('Error in updating ticket sign');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/deleteSign', async (req, res) => {
  try {
    let data = req.body;
    let signs = await Tickets.deleteSign(data.signId, data.email);
    if (signs) {
      res.send({ status: 'ok' });
    } else {
      res.send({ status: 'error' });
    }

  } catch (err) {
    console.log(err);
    console.log('Error in deleting ticket sign');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/setStatus', async (req, res) => {
  try {
    if (!req.body.id) {
      res.status(401).send('Invalid Request!');
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      let ticketlog = ComposedTicketENUM(TicketLogMessages.UPDATE_STATUS, { value: data.status, by: data.email })
      //Set status
      //close the ticket
      let fetchedTicket = await Tickets.InsertStatus(data.id, data.nsp, data.status, ticketlog);
      if (fetchedTicket && fetchedTicket.value) {
        res.send({ status: 'ok', ticket: fetchedTicket, ticketlog: ticketlog });
        //Emits
        let result = fetchedTicket.value;
        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
        if (result.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })
        if (result.assigned_to) {
          let assignedTo = await SessionManager.getAgentByEmail(data.nsp, result.assigned_to);
          if (assignedTo) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [assignedTo._id], data: { tid: result._id, ticket: result } })
        }
        if (result.watchers) {
          let watchers = await SessionManager.getOnlineWatchers(data.nsp, result.watchers);
          if (watchers && watchers.length) {
            if (result.assigned_to) watchers = watchers.filter(x => { return x != result.assigned_to })
            watchers.map(async watcher => {
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })
            })
          }
        }
      } else {
        res.send({ status: 'error' });
      }
    }
  } catch (err) {
    res.status(401).send('Invalid Request!');
    console.log(err);
    console.log('Error in adding ticket tag');
  }
})
router.post('/toggleSign', async (req, res) => {
  try {
    let data = req.body;
    let lastModified = '';
    lastModified = new Date().toISOString();
    let signs = await Tickets.toggleSign(data.email, data.signId, data.check, lastModified);
    if (signs && signs.value) {
      res.send({ status: 'ok', signs: signs.value });
    }
  } catch (err) {
    console.log(err);
    console.log('Error in toggling ticket sign');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getSignatures', async (req, res) => {
  try {

    let data = req.body;
    if (!data.email) res.status(401).send('Invalid Request!');

    let signs = await Tickets.getSign(data.email);

    if (signs && signs.length) {
      res.send({ status: 'ok', signs: signs });
    } else {
      res.send({ status: 'error', msg: 'Cannot get signs' });

    }
  } catch (err) {
    console.log(err);
    console.log('Error in getting signatures');

  }
})


/* #endregion */

router.post('/getTeamsByNSP', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let teams = await TeamsModel.getTeams(data.nsp);
    if (teams) {
      res.send({ status: 'ok', teams: teams });
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in get teams by nsp');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getSanGroupNames', async (req, res) => {
  try {
    let groups = ['UK Inquires', 'INB MACHINERY', 'INB OTHER MKT (NIGHT)', 'INB TRUCK DAY (GROUP A)', 'INB TRUCK DAY (GROUP B)', 'INB TRUCK DAY (GROUP C)', 'INB TRUCK DAY (TAGGED) LMs', 'INB TRUCK NIGHT (GROUP E)', 'INB TRUCK NIGHT (TAGGED) LMS', 'INB TRUCK NIGHT(GROUP D)', 'SBT UAE INFORMATION - IN HOUSE', 'JAPAN IT HELPDESK', 'Korea Operations', 'China Operations', 'USA Operations', 'Germany Operations', 'Singapore Operations', 'Australia Operations', 'South Africa Operations', 'Collection Team', 'Collection Night Team', 'Collection Myanmar', 'PK Inbound Sales'];
    if (groups) {
      res.send({ status: 'ok', groups: groups });
    } else {
      res.send({ status: 'error', groups: [] });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getSanGroupNames');
    res.status(401).send('Invalid Request!');
  }
});
router.post('/getAgentsAgainstUser', async (req, res) => {
  try {

    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let groups = await TicketGroupsModel.GetGroupsAgainstAgent(data.nsp, data.email);
    if (groups) {
      let agents = await TicketGroupsModel.getAgentsAgainstGroupNotExcluded(data.nsp, groups);
      res.send({ status: 'ok', agents: agents })
    } else {
      res.send({ status: 'error', msg: 'Group list not defined!' })
    }
  } catch (err) {
    console.log(err);
    console.log('Error in get agents against group');
    res.status(401).send('Invalid Request!');
  }
});

router.post('/getAgentsByUsername', async (req, res) => {
  try {
    let data = req.body;
    let agents = await Agents.getAgentsByUsername(data.nsp, data.username);

    if (agents && agents.length) {
      res.send({ status: 'ok', agents: agents });
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agents against role');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/abc', async (req, res) => {
  console.log("api abc hit");
  let ticket = {
    _id: '5ef1dec21eed543918676626',
    visitor: {
      name: "fahad"
    },
    subject: "hello123",
    clientID: "7YYNU"
  }
  let data = [
    {
      email: 'mufahad9213@sbtjapan.com', assigned: '3', role: 'agent', lastLogin: '03/16/2020 11:03 AM'
    }
    // {email:'fahad.ansari88@yahoo.com',                assigned:'30'  ,     role:'agent'},
    // { email: 'rabi.fatima17@yahoo.com' },
    // {email:'fahad.ansari88@yahoo.com',                assigned:'30'  ,     role:'agent',                      lastLogin:'03/15/2020 11:03 AM'}

  ]
  // let ticketassigneddate = "05/14/2020";
  // // let data = [
  // //     { email: 'abdyvaliev2040@sbtjapan.com', assigned: '3', lastLogin: '0' },
  // //     { email: 'abidhassan9134@sbtjapan.com', assigned: '1', lastLogin: '05/12/2020 12:01 PM' },
  // //     { email: 'abiya9912@sbtjapan.com', assigned: '2', lastLogin: '05/13/2020 00:45 AM' },

  // //     { email: 'zainmed95617@sbtjapan.com', assigned: '2', lastLogin: '05/04/2020 12:15 PM' },
  // //     { email: 'zeekhan9604@sbtjapan.com', assigned: '7', lastLogin: '05/13/2020 02:05 AM' },
  // //     { email: 'zhumabekov2078@sbtjapan.com', assigned: '1', lastLogin: '04/30/2020 09:54 AM' },
  // //     { email: 'zia9892@sbtjapan.com', assigned: '3', lastLogin: '04/28/2020 13:41 PM' },
  // //     { email: 'zktushar4524@sbtjapan.com', assigned: '3', lastLogin: '05/10/2020 18:10 PM' },
  // //     { email: 'zohaib9267@sbtjapan.com', assigned: '1', lastLogin: '05/13/2020 16:19 PM' },
  // //     { email: 'zuuddin9908@sbtjapan.com', assigned: '9', lastLogin: '05/13/2020 16:24 PM' },
  // //     { email: 'zyambo@sbtjapan.com', assigned: '2', lastLogin: '04/09/2020 13:16 PM' }
  // // ];
  // let e = {};
  // let f: any = [];

  data.forEach(async (d, index) => {

    //     d.email = d.email.trim();
    //     // d.assigned = d.assigned.trim();
    //     // d.lastLogin = d.lastLogin.trim();
    //     // console.log(d.email);

    //     let res = await Agents.getAgentsByEmail(d.email);
    //     e['email'] = d.email;
    //     e['exists'] = res && res.length;
    //     // console.log(res);

    //     // console.log(e);
    //     f[index] = (e);
    //     // console.log(f);
    //     if (f && f.length) {
    //         if (f[0].exists == 1) {

    //             // console.log(f[0].email);

    //         }
    //         else {
    //             console.log("exists");

    //         }
    //     }
    // f=[];

    //     let message = `<p>Respectfully,</p>
    // <p>This is to ask you the reason for not logging into the Beelinks on 14th May, as you was having assigned ticket, Following is the stats:</p>
    // <p>*If 0 in last Login, means you haven't logged in from 1st April to 14th May 2020.</p>
    // <table border="1" style="border-collapse: collapse; width: 100%;">
    // <tbody></tbody>
    // </table>
    // <table border="1" style="border-collapse: collapse; width: 100%;">
    // <tbody>
    // <tr>
    // <td style="width: 33.3333%;">Ticket Assigned Date</td>
    // <td style="width: 33.3333%;">Ticket Assigned</td>
    // <td style="width: 33.3333%;">Your last login</td>
    // </tr>
    // <tr>
    // <td style="width: 33.3333%;">${ticketassigneddate} </td>
    //  <td style="width: 33.3333%;">${d.assigned} </td>
    // <td style="width: 33.3333%;">${d.lastLogin}</td>
    // </tr>
    // </tbody>
    // </table>
    // <p></p>
    // <p>Kindly state us the reason, if you are encountering some issue in logging into beelinks?</p>
    // <p>Best regards,</p>
    // <p>Team Helpdesk.</p>`;

    let message = '<p>Dear ' + ticket.visitor.name + ',</p>'
      + '<p>We would like to acknowledge that we have received your request and a ticket has been created with ID - <b>' + ticket.clientID + '</b>.</p>'
      + '<p>A support representative will be viewing your request and will send you a personal response. (usually within 2 hours).</p>'
      + '<p>Ticket Subject : <b>' + ticket.subject + '</b></p>'
      + '<p>Ticket Link: https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '</p>'
      + '<p>Thankyou for your patience.</p>'
    EmailService.SendEmail({
      action: 'SendSanEmails',
      msg: message,
      to: d.email,
      from: 'support@beelinks.solutions'
    }, 5, true);
  });
  // console.log(e);
  // console.log(f);

  res.send({ status: "ok" })

});

router.post('/res', async (req, res) => {
  let data = [
    { email: 'star.pekachu@gmail.com' },
    { email: 'rejon.2013@gmail.com' },
    { email: 'nrrumi2000@gmail.com' },
    { email: 'deasinmotors@gmail.com' },
    { email: 'monjur_2k3@yahoo.com' },
    { email: 'tapiwajmkandawire@gmail.com' },
    { email: 'mitunshil747@gmail.com' },
    { email: 'majakirhossen24@gmail.com' },
    { email: 'tschwehr1@gmail.com' },
    { email: 'touhid.jcm@gmail.com' },
    { email: 'palmainjapan@gmail.com' },
    { email: 'sagorhowlader5208@gmail.com' },
    { email: 'sean@alive-web.co.jp' },
    { email: 'mongolzitr@gmail.com' },
    { email: 'rozanmd20@gmail.com' },
    { email: 'imrant146@gmail.com' },
    { email: 'eriko.kaneoka@zigexn.co.jp' },
    { email: 'victorawili@yandex.com' },
    { email: 'dosjan@yahoo.com' },
    { email: 'tmazzalwayzz@yahoo.com' },
    { email: 'ariful8422@gmail.com' },
    { email: 'ajith.liyanagejpn@gmail.com' },
    { email: 'imrul69@gmail.com' },
    { email: 'haralds.degis@gmail.com' },
    { email: 'khaingkhaingkw@gmail.com' },
    { email: 'sgodsonamamoo@gmail.com' },
    { email: 'zobo361@gmail.com' },
    { email: 'snyamuranga@unicef.org' },
    { email: 'nyamkhuu1130@gmail.com' },
    { email: 'hasnainsiddiqui.siddiqui@gmail.com' },
    { email: 'sahil_78600@yahoo.com' },
    { email: 'sani4161@yahoo.com' },
    { email: 'syedahsanshah99@gmail.com' },
    { email: 'mujtabaabdulkhaliq@hotmail.com' },
    { email: 'ahsanullahkhan.mkt@gmail.com' },
    { email: 'maqsoodqurtaba@gmail.com' },
    { email: 'ahadkhan321@gmail.com' },
    { email: 'aleem605@yahoo.com' },
    { email: 'jam.yasin_j@rocketmail.com' },
    { email: 'zeeshan.oai@gmail.com' },
    { email: 'noman.jahangir@hotmail.com' },
    { email: 'moss786@live.com' },
    { email: 'asad.shakil@meezanbank.com' },
    { email: 'babarali_87@ymail.com' },
    { email: 'f.ullah99@gmail.com' },
    { email: 'iasiddiqui130310@gmail.com' },
    { email: 'altaf.iqbal@yahoo.com' },
    { email: 'fexan@live.com' },
    { email: 'fakharejaz25@yahoo.com' },
    { email: 'muhammadwaqqaas@gmail.com' },
    { email: 'qmr67kar@gmail.com' },
    { email: 'touseef.ahsan@yahoo.com' },
    { email: 'bajwak7@hotmail.com' },
    { email: 'frozen_fire@hotmail.com' },
    { email: 'shoaibmemon21@gmail.com' },
    { email: 'aamir.siddiqui95@gmail.com' },
    { email: 'royalworks@hotmail.com' },
    { email: 'm_jamshaid121@yahoo.com' },
    { email: 'humayun44@yahoo.com' },
    { email: 'mr_rashid_hussain@yahoo.com' },
    { email: 'chuvoh@hotmail.com' },
    { email: 'haris.sadiq@gmail.com' },
    { email: 'muhammad.baig@mail.com' },
    { email: 'fahad.cma@gmail.com' },
    { email: 'bilalubit5@gmail.com' },
    { email: 'jahanzaib.chandio@lcbizltd.com' },
    { email: 'junaid.shb@gmail.com' },
    { email: 'usama.sukhera_343@hotmail.com' },
    { email: 'zabih_niazi91@hotmail.com' },
    { email: 'shaikhzeeshan1989@gmail.com' },
    { email: 'srizshaikh@gmail.com' },
    { email: 'atif_jamil_s@hotmail.com' },
    { email: 'waheedroyal87@yahoo.com' },
    { email: 'rooshan87@yahoo.com' },
    { email: 'risk-taker92@hotmail.com' },
    { email: 'rehan.usman19@gmail.com' },
    { email: 'riazshah7867@yahoo.com' },
    { email: 'farhansarkar@gmail.com' },
    { email: 'junejo@mail.com' },
    { email: 'juju649556@yahoo.com' },
    { email: 'muhamad.hassan13@gmail.com' },
    { email: 'raselansari@gmail.com' },
    { email: 'shedding_tearz@hotmail.com' },
    { email: 'hami_virgo@hotmail.com' },
    { email: 'laiglet@yahoo.fr' },
    { email: 'alifaisal32@hotmail.com' },
    { email: 'jaq_cs@hotmail.com' },
    { email: 'jerjab@aol.com' },
    { email: 'seerat123@gmail.com' },
    { email: 'saif-ul-islam@hotmail.com' },
    { email: 'armaghan_saad@hotmail.com' },
    { email: 'ghani64@ymail.com' },
    { email: 'ahtesham.arshad1@gmail.com' },
    { email: 'najafhaider55@hotmail.com' },
    { email: 'hussain_aquil@hotmail.com' },
    { email: 'engr.mazhar03@gmail.com' },
    { email: 'najafali_rizvi@yahoo.com' },
    { email: 'soulkatcher@hotmail.com' },
    { email: 'tariqawan77@gmail.com' },
    { email: 'drasif_mansoori@hotmail.com' },
    { email: 'fam697@gmail.com' },
    { email: 'umairhanif@hotmail.com' },
    { email: 'nfarooq01@gmail.com' },
    { email: 'asaamirshaikh1@gmail.com' },
    { email: 'guitarixt@live.com' },
    { email: 'saad9265@sbtjapan.com' },
    { email: 'hamzaj1988@gmail.com' },
    { email: 'noumanaslam@outlook.com' },
    { email: 'danish2002607@hotmail.com' },
    { email: 'lookingaone@gmail.com' },
    { email: 'shaharyar_88@hotmail.com' },
    { email: 'dxb3579@gmail.com' },
    { email: 'muhammadadilj@yahoo.com' }
  ];

  async function asyncFunction(email) {
    console.log("Hit")

    return request.post('http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==', {
      json: {
        "MailAddress": email,
        "PhoneNumber": '',
        "StockId": '',
        "CustomerId": '',
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      else {
        console.log("success")
        console.log(`statusCode: ${res.statusCode}`)
      }
      // console.log(body)

    })


  }


  let updatedList = data.map(async (msg, index) => {
    await asyncFunction(msg.email);

  });
  await Promise.all(updatedList).then(val => { res.send({ status: "ok" }) });

  // if(promisses && !promisses.length) console.log("not finish")
  // else console.log("finish")
});

router.post('/def', async (req, res) => {
  console.log("api def hit");
  // let emails = ['gomi8092@sbtjapan.com', 'noguchi8069@sbtjapan.com', 'yuzawa8419@sbtjapan.com', 'shahbaz9347@sbtjapan.com', 'mussharaf9006@sbtjapan.com', 'alihussain9208@sbtjapan.com', 'hashimoto8208@sbtjapan.com'];
  let emails = ['mufahad9213@sbtjapan.com'];



  let htmlTemplate = `<p>Respectfully,</p>
                                <p>This is to inform you for the weekly report of agents from <b> 26th April to 2nd May 2020 </b> that are logging into the Beelinks, Following is the stats:</p>
                                <p>*If 0 in (last login) means they haven't logged in from <b> 1st April to 4th May 2020.</b></p>
                                <p>*If 0 in (login frequency) means they haven't logged in from <b> 26th April to 2nd May 2020.</b></p>
                                <table border="1" style="border-collapse: collapse; width: 100%;">
                                <tbody></tbody>
                                </table>
                                <table border="1" style="border-collapse: collapse; width: 100%;">
                                <tbody>
                                <tr>
                                <th style="width: 108px;">Agent Email</th>
                                <th style="width: 80px;">Role</th>
                                <th style="width: 100px;">Frequency of Logins (Weekly)</th>
                                <th style="width: 80px;">Tickets Assigned (Weekly)</th>
                                <th style="width: 108px;">Last Login during this week</th>
                                </tr>
                                `

  // data.forEach(d => {
  //     d.email = d.email.trim();
  //     d.assigned = d.assigned.trim();
  //     d.role = d.role.trim();

  //     d.lastLogin = d.lastLogin.trim();

  //     htmlTemplate += `
  //      <tr><td style="width: 108px;">${d.email} </td>
  //      <td style="width: 80px; text-align: center;">${d.role} </td>
  //      <td style="width: 100px; text-align: center;">${d.freq} </td>
  //      <td style="width: 80px; text-align: center;">${d.assigned} </td>
  //      <td style="width: 108px;">${d.lastLogin}</td>
  //      </tr>`;
  // });
  htmlTemplate += `
                    </tbody>
                    </table>
                    <br>
                    <p>Best regards,</p>
                    <p>Support Team.</p>`
  EmailService.SendEmail({
    action: 'SendCCEmails',
    msg: htmlTemplate,
    from: 'support@beelinks.solutions',
    to: emails,
  }, 5, true);
  res.send({ status: "ok" })
});
// ,'mufakhruddin9417@sbtjapan.com'
router.post('/ghi', async (req, res) => {
  console.log("api ghi hit");
  await Utils.GroupAutoAssign();
});

// router.get('/assignTicketCustom', async (req, res) => {

//     let ticketDetails = [
//         {clientID: '4G5CB', salesPerson: 'HAMNASLAM',               group: 'Pakistan Inquires'                 },
//         {clientID: 'kYFCp', salesPerson: 'SHAGUFTA',                group: 'Lesotho Inquires'                },
//         {clientID: 'jD8mU', salesPerson: 'ALEEMUDDIN',              group: 'Pakistan Inquires'                  },
//         {clientID: 'XmzeH', salesPerson: 'MARQAMAR',                group: 'Swaziland Inquires'                },
//         {clientID: 'R81Fr', salesPerson: 'FARHID',                  group: 'South Africa Inquires'              },
//         {clientID: 'xVCT6', salesPerson: 'MENDOZA',                 group: 'Paraguay Inquires'               },
//         {clientID: 'yRiSl', salesPerson: 'REMSHA',                  group: 'Malawi Inquires'              },
//         {clientID: 'Y6qSD', salesPerson: 'NAYIM',                   group: 'Botswana Inquires'             },
//         {clientID: 'RJTyl', salesPerson: 'MTSHOAIB',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'fAaxI', salesPerson: 'ABIDHASSAN',              group: 'Pakistan Inquires'                  },
//         {clientID: '4QRW2', salesPerson: 'PARIJAT',                 group: 'Botswana Inquires'               },
//         {clientID: 'Y7giH', salesPerson: 'RAZMANSOOR',              group: 'TURKS AND CAICOS (CARIB)'                  },
//         {clientID: 'gpv6I', salesPerson: 'ABIHA',                   group: 'CONGO Inquries'             },
//         {clientID: 'vy9z8', salesPerson: 'SMTALHA',                 group: 'ENGLAND (EUROPE)'               },
//         {clientID: 'vt77e', salesPerson: 'KIYINGI',                 group: 'Uganda Inquires'               },
//         {clientID: 'XWf1A', salesPerson: 'NAFLAN',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'l7UbS', salesPerson: 'MBILAL',                  group: 'SURINAME (CARIB)'              },
//         {clientID: 'TbcIm', salesPerson: 'USAMALI',                 group: 'Zambia Inquires'               },
//         {clientID: '9Y9cN', salesPerson: 'RAMEESA',                 group: 'CYPRUS (EUROPE)'               },
//         {clientID: 'VGWSu', salesPerson: 'MHAMRIAZ',                group: 'Malawi Inquires'                },
//         {clientID: 'PvCNB', salesPerson: 'DILOSHAN',                group: 'Malawi Inquires'                },
//         {clientID: '52kbn', salesPerson: 'MIHSAN',                  group: 'Tanzania Inquires'              },
//         {clientID: 'ynEtT', salesPerson: 'NMISAL',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: '9Wyd9', salesPerson: 'SAADMANI',                group: 'Tanzania Inquires'                },
//         {clientID: 'G2vRA', salesPerson: 'KHARLYN',                 group: 'Kenya Inquires'               },
//         {clientID: 'qDC9C', salesPerson: 'ASIMKHAN',                group: 'Uganda Inquires'                },
//         {clientID: 'zr2Qz', salesPerson: 'SHAPERVAIZ',              group: 'Uganda Inquires'                  },
//         {clientID: 'PSOfO', salesPerson: 'MMOHKHAN',                group: 'JAMAICA (CARIB)'                },
//         {clientID: 'Hs79K', salesPerson: 'MUHAMFAIZAN',             group: 'Pakistan Inquires'                   },
//         {clientID: 's0S05', salesPerson: 'HASVOHRA',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'CaOxF', salesPerson: 'JOSEPHM',                 group: 'Uganda Inquires'               },
//         {clientID: '0Shu6', salesPerson: 'MOEEZKHAN',               group: 'Botswana Inquires'                 },
//         {clientID: 'sqCIc', salesPerson: 'YAKTA',                   group: 'West Africa English'             },
//         {clientID: 'VMIZ0', salesPerson: 'SKHALIRAZA',              group: 'BAHAMAS (CARIB)'                  },
//         {clientID: 'tR7HX', salesPerson: 'MAHALAM',                 group: 'UAE Inquires'               },
//         {clientID: 'Ti3H7', salesPerson: 'ALIASSHAH',               group: 'TURKS AND CAICOS (CARIB)'                 },
//         {clientID: 'h1wHk', salesPerson: 'SADALTAF',                group: 'CYPRUS (EUROPE)'                },
//         {clientID: '3LP17', salesPerson: 'ARMUGHAL',                group: 'Tanzania Inquires'                },
//         {clientID: 'HUBUX', salesPerson: 'ABWAHAB',                 group: 'West Africa English'               },
//         {clientID: 'S07LA', salesPerson: 'MMOHAIMIN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'mRoCW', salesPerson: 'OKERO',                   group: 'Kenya Inquires'             },
//         {clientID: 'Y7Kb8', salesPerson: 'MSHEHERYASIF',            group: 'South Sudan'                    },
//         {clientID: 'YyFjc', salesPerson: 'BAZAI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'loDXu', salesPerson: 'FAIZANALI',               group: 'CONGO Inquries'                 },
//         {clientID: 'CxxfT', salesPerson: 'MDSOURAV',                group: 'Malawi Inquires'                },
//         {clientID: 'aLHgk', salesPerson: 'IHSANA',                  group: 'Tanzania Inquires'              },
//         {clientID: 'SqjEH', salesPerson: 'ROBIN',                   group: 'Mozambique Inquires'             },
//         {clientID: '2thc9', salesPerson: 'FOYSAL',                  group: 'Zambia Inquires'              },
//         {clientID: 'dhKyW', salesPerson: 'RIFKA',                   group: 'Malawi Inquires'             },
//         {clientID: 'HLNU8', salesPerson: 'DARYL',                   group: 'Malawi Inquires'             },
//         {clientID: 'FukTL', salesPerson: 'NIYOMI',                  group: 'Malawi Inquires'              },
//         {clientID: '5A0OU', salesPerson: 'AHAMED',                  group: 'Tanzania Inquires'              },
//         {clientID: 'U6Eny', salesPerson: 'ALZAKY',                  group: 'Mozambique Inquires'              },
//         {clientID: 'MJogU', salesPerson: 'JUEL',                    group: 'Kenya Inquires'            },
//         {clientID: 'deFTm', salesPerson: 'AEKUALA',                 group: 'Mozambique Inquires'               },
//         {clientID: '6N79P', salesPerson: 'AMINAL',                  group: 'Tanzania Inquires'              },
//         {clientID: 'IEbHZ', salesPerson: 'ZAKARIAH',                group: 'Botswana Inquires'                },
//         {clientID: 'p6Pb5', salesPerson: 'MUFEES',                  group: 'Zambia Inquires'              },
//         {clientID: 'Gku8S', salesPerson: 'RAHAL',                   group: 'Kenya Inquires'             },
//         {clientID: '3X0OJ', salesPerson: 'HAKEEM',                  group: 'Mozambique Inquires'              },
//         {clientID: '0Gj7B', salesPerson: 'KONOKUULU',               group: 'CYPRUS (EUROPE)'                 },
//         {clientID: 'w4vGz', salesPerson: 'AMJALI',                  group: 'UAE Inquires'              },
//         {clientID: 'bXjmY', salesPerson: 'NAFEEL',                  group: 'Mozambique Inquires'              },
//         {clientID: '9p1AQ', salesPerson: 'ASIFR',                   group: 'Malawi Inquires'             },
//         {clientID: 'L3s3J', salesPerson: 'SHINDE',                  group: 'Zambia Inquires'              },
//         {clientID: '9obuY', salesPerson: 'TANZEEL',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'JGLyH', salesPerson: 'NIDHARSHAN',              group: 'Kenya Inquires'                  },
//         {clientID: 'YyMC4', salesPerson: 'DILUKSHAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'q9F5i', salesPerson: 'MDASHIQ',                 group: 'Tanzania Inquires'               },
//         {clientID: 'vYfAg', salesPerson: 'MOLOI',                   group: 'Botswana Inquires'             },
//         {clientID: 'IPB8w', salesPerson: 'MOLOI',                   group: 'Botswana Inquires'             },
//         {clientID: 'Jo7js', salesPerson: 'KISHANTHAN',              group: 'Lesotho Inquires'                  },
//         {clientID: 'u88Oi', salesPerson: 'SANJAY',                  group: 'Malawi Inquires'              },
//         {clientID: 'rxAKR', salesPerson: 'LEOMAMBRU',               group: 'Dominican Republic Inquires'                 },
//         {clientID: 'jC0mZ', salesPerson: 'RANANOMAN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'VlCqE', salesPerson: 'SHAEYMA',                 group: 'IRELAND (EUROPE)'               },
//         {clientID: 'cAEQK', salesPerson: 'KIKOMEKO',                group: 'Uganda Inquires'                },
//         {clientID: 'QFwKq', salesPerson: 'SHABHUSSAIN',             group: 'CONGO Inquries'                   },
//         {clientID: '8iQ9d', salesPerson: 'ASRAZA',                  group: 'Malawi Inquires'              },
//         {clientID: 'zOw9K', salesPerson: 'MISHAEL',                 group: 'Kenya Inquires'               },
//         {clientID: 'nLdqe', salesPerson: 'TALAHMED',                group: 'UAE Inquires'                },
//         {clientID: 'BOXNJ', salesPerson: 'ALLOCEN',                 group: 'Uganda Inquires'               },
//         {clientID: 'hz4FE', salesPerson: 'MMSALEEM',                group: 'Malawi Inquires'                },
//         {clientID: 'xbImy', salesPerson: 'SHAHRIAZ',                group: 'Mozambique Inquires'                },
//         {clientID: 'k5W7E', salesPerson: 'SAMSON',                  group: 'Kenya Inquires'              },
//         {clientID: 'XyLd7', salesPerson: 'JCHARLES',                group: 'Malawi Inquires'                },
//         {clientID: 'UtaYw', salesPerson: 'RALP',                    group: 'Kenya Inquires'            },
//         {clientID: 'd2V05', salesPerson: 'MBHOSSAIN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'hye6X', salesPerson: 'MGISLAM',                 group: 'Kenya Inquires'               },
//         {clientID: 'mGerU', salesPerson: 'MGISLAM',                 group: 'Kenya Inquires'               },
//         {clientID: 'nwLWt', salesPerson: 'SAYEDSAKIB',              group: 'Zambia Inquires'                  },
//         {clientID: 'eJLnW', salesPerson: 'TOUHIDUZZAM',             group: 'Tanzania Inquires'                   },
//         {clientID: 'moWFb', salesPerson: 'SYMAZEHRA',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'bmnL4', salesPerson: 'AJOY',                    group: 'Tanzania Inquires'            },
//         {clientID: 'BfmwF', salesPerson: 'KANYMETOVA',              group: 'CYPRUS (EUROPE)'                  },
//         {clientID: 'w7oF8', salesPerson: 'MHBHUIYA',                group: 'Kenya Inquires'                },
//         {clientID: 'Ot25K', salesPerson: 'TANZIR',                  group: 'Kenya Inquires'              },
//         {clientID: 'gyjXz', salesPerson: 'FSHABEENA',               group: 'Zambia Inquires'                 },
//         {clientID: 'h1ann', salesPerson: 'TANZIR',                  group: 'Kenya Inquires'              },
//         {clientID: 'G0glR', salesPerson: 'FSHABEENA',               group: 'Zambia Inquires'                 },
//         {clientID: 'aeyUb', salesPerson: 'USPERVEZ',                group: 'Malawi Inquires'                },
//         {clientID: 'wCDxu', salesPerson: 'QMOHTASHIM',              group: 'Malawi Inquires'                  },
//         {clientID: 'GQHPn', salesPerson: 'ZAIMUSTAFA',              group: 'Tanzania Inquires'                  },
//         {clientID: 'HWPJJ', salesPerson: 'BAIKURMAN',               group: 'CYPRUS (EUROPE)'                 },
//         {clientID: 'mAgDW', salesPerson: 'ARBERENALIEV',            group: 'CONGO Inquries'                    },
//         {clientID: 'FyJo2', salesPerson: 'MELV',                    group: 'Kenya Inquires'            },
//         {clientID: 'GfP2h', salesPerson: 'MISKATH',                 group: 'Uganda Inquires'               },
//         {clientID: '7LvTQ', salesPerson: 'RAHMANDUL',               group: 'Swaziland Inquires'                 },
//         {clientID: 'xWh03', salesPerson: 'SHEHMIRZA',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '6CtH8', salesPerson: 'UMRIAZ',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: '5b45G', salesPerson: 'NARMKHAN',                group: 'Tanzania Inquires'                },
//         {clientID: 'rb5Fs', salesPerson: 'MUANASSID',               group: 'Malawi Inquires'                 },
//         {clientID: 'uKMOO', salesPerson: 'MMURIUKI',                group: 'Kenya Inquires'                },
//         {clientID: '6goBL', salesPerson: 'CHRIS',                   group: 'Kenya Inquires'             },
//         {clientID: 'YpVda', salesPerson: 'RILWANM',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'XpGaj', salesPerson: 'ASFANDYARM',              group: 'Malawi Inquires'                  },
//         {clientID: 'Zu7KD', salesPerson: 'NAVROZL',                 group: 'Zambia Inquires'               },
//         {clientID: '9DWRW', salesPerson: 'JESOOK',                  group: 'Lesotho Inquires'              },
//         {clientID: 'xwzKG', salesPerson: 'HAMYONUS',                group: 'Zambia Inquires'                },
//         {clientID: 'V1ZXS', salesPerson: 'AMMASROOR',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'Uk2Q2', salesPerson: 'MUHJAHANZAIB',            group: 'MAURITIUS (EUROPE)'                    },
//         {clientID: 'hQdAc', salesPerson: 'FAISHAFIQUE',             group: 'Uganda Inquires'                   },
//         {clientID: 'hracw', salesPerson: 'MEHNLAIQAT',              group: 'Malawi Inquires'                  },
//         {clientID: 'IAk0V', salesPerson: 'KAIZHAINAKOV',            group: 'TRINIDAD (CARIB)'                    },
//         {clientID: 'dWJgG', salesPerson: 'SUMALIKHAN',              group: 'Zambia Inquires'                  },
//         {clientID: 'NMXaj', salesPerson: 'AZAKHTAR',                group: 'Kenya Inquires'                },
//         {clientID: 'bufJ1', salesPerson: 'KALILANI',                group: 'CONGO Inquries'                },
//         {clientID: 'rFXkq', salesPerson: 'SASHEHPAR',               group: 'Tanzania Inquires'                 },
//         {clientID: 'Baw4o', salesPerson: 'TAHMIDKARIM',             group: 'Malawi Inquires'                   },
//         {clientID: 'sAcqI', salesPerson: 'RATRI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'SKW2X', salesPerson: 'QAIMALI',                 group: 'MAURITIUS (EUROPE)'               },
//         {clientID: 'HA9E6', salesPerson: 'ZARAKKHAN',               group: 'GUYANA (CARIB)'                 },
//         {clientID: '8SVep', salesPerson: 'MUZASLAM',                group: 'Malawi Inquires'                },
//         {clientID: 'Itj1y', salesPerson: 'CNYEMBA',                 group: 'Zimbabwe Inquires'               },
//         {clientID: 'TsY0j', salesPerson: 'SALVE',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'y6Zjw', salesPerson: 'SYAKMAL',                 group: 'Malawi Inquires'               },
//         {clientID: 'UFZFz', salesPerson: 'MUBILSAEED',              group: 'BAHAMAS (CARIB)'                  },
//         {clientID: 'hcDI5', salesPerson: 'MOSHIURR',                group: 'SURINAME (CARIB)'                },
//         {clientID: 'aUs5s', salesPerson: 'MUNSIDDIQUI',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'f8c3H', salesPerson: 'MSLASKAR',                group: 'IRELAND (EUROPE)'                },
//         {clientID: 'pFdgp', salesPerson: 'SYMUAHSAN',               group: 'Kenya Inquires'                 },
//         {clientID: 'wv2vB', salesPerson: 'SAIQARIF',                group: 'Kenya Inquires'                },
//         {clientID: 'obJR6', salesPerson: 'MNHUDA',                  group: 'Oceania Inquires'              },
//         {clientID: 'IzIFv', salesPerson: 'MUFAKHKHAN',              group: 'UAE Inquires'                  },
//         {clientID: 'bb05K', salesPerson: 'PARTHA',                  group: 'ENGLAND (EUROPE)'              },
//         {clientID: 'VPvhb', salesPerson: 'SSRABIDI',                group: 'CONGO Inquries'                },
//         {clientID: 'YlXgL', salesPerson: 'IBRAPARKAR',              group: 'Botswana Inquires'                  },
//         {clientID: 'U1OWP', salesPerson: 'SALIFTIKHAR',             group: 'Zimbabwe Inquires'                   },
//         {clientID: '5589E', salesPerson: 'WAQRAEES',                group: 'Malawi Inquires'                },
//         {clientID: 'IqgQI', salesPerson: 'AMINISLAM',               group: 'West Africa English'                 },
//         {clientID: 'EATUi', salesPerson: 'TALSHAFIQ',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'q6yVc', salesPerson: 'MZUBAIR',                 group: 'TURKS AND CAICOS (CARIB)'               },
//         {clientID: 'lg6A1', salesPerson: 'KOUSHIK',                 group: 'Tanzania Inquires'               },
//         {clientID: 'nqr6X', salesPerson: 'ASSADRAS',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'olwWt', salesPerson: 'SGITAU',                  group: 'Kenya Inquires'              },
//         {clientID: 'bHTe9', salesPerson: 'NADHAMEED',               group: 'Zambia Inquires'                 },
//         {clientID: 'HEjwP', salesPerson: 'LPAPIONA',                group: 'TRINIDAD (CARIB)'                },
//         {clientID: 'rcxLf', salesPerson: 'JKIRUKI',                 group: 'Kenya Inquires'               },
//         {clientID: '7Aghd', salesPerson: 'SYSANSHAHID',             group: 'CYPRUS (EUROPE)'                   },
//         {clientID: 'VavL2', salesPerson: 'KURMANOVZHAN',            group: 'MAURITIUS (EUROPE)'                    },
//         {clientID: '9dowl', salesPerson: 'XANDER',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'UKgTa', salesPerson: 'AWAZIZ',                  group: 'CONGO Inquries'              },
//         {clientID: 's2xPt', salesPerson: 'RRAZZAQ',                 group: 'Malawi Inquires'               },
//         {clientID: 'R3NNY', salesPerson: 'DANJUNEJO',               group: 'Malawi Inquires'                 },
//         {clientID: '0x4UH', salesPerson: 'IMMANGA',                 group: 'Tanzania Inquires'               },
//         {clientID: 'x0xzQ', salesPerson: 'SIVAKUMARAN',             group: 'Uganda Inquires'                   },
//         {clientID: 'RyiFs', salesPerson: 'JULIETH',                 group: 'Tanzania Inquires'               },
//         {clientID: 'e75Cv', salesPerson: 'RIYAZ',                   group: 'Zambia Inquires'             },
//         {clientID: 'Ii0Ei', salesPerson: 'JCHISUWO',                group: 'Malawi Inquires'                },
//         {clientID: 'ghsin', salesPerson: 'KAKHAN',                  group: 'Mozambique Inquires'              },
//         {clientID: '6a86d', salesPerson: 'AFSANA',                  group: 'Kenya Inquires'              },
//         {clientID: 'ymaJu', salesPerson: 'MAMUNBILLAH',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'lnCo5', salesPerson: 'ALIMALIK',                group: 'CONGO Inquries'                },
//         {clientID: 'smjdV', salesPerson: 'AYZAI',                   group: 'CONGO Inquries'             },
//         {clientID: 'tOKtE', salesPerson: 'SHUVO',                   group: 'UAE Inquires'             },
//         {clientID: 'Jz495', salesPerson: 'BABTARIQ',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'srOpt', salesPerson: 'JEYSINTHUJAN',            group: 'BAHAMAS (CARIB)'                    },
//         {clientID: 'yCLeN', salesPerson: 'SOHZAFAR',                group: 'Zambia Inquires'                },
//         {clientID: 'WwwzR', salesPerson: 'ABMMAHFUZUR',             group: 'Kenya Inquires'                   },
//         {clientID: '8bZLT', salesPerson: 'AMMSIDDIQUI',             group: 'UAE Inquires'                   },
//         {clientID: '1X7CJ', salesPerson: 'TABINDA',                 group: 'South Sudan'               },
//         {clientID: 'kEh7j', salesPerson: 'FAIHASSAN',               group: 'Kenya Inquires'                 },
//         {clientID: '5kZSl', salesPerson: 'NOUSARWAR',               group: 'UAE Inquires'                 },
//         {clientID: 'fWjdj', salesPerson: 'MOHHASSAAN',              group: 'CONGO Inquries'                  },
//         {clientID: 'DNz0Y', salesPerson: 'SYEDAHSAN',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'IOBK3', salesPerson: 'RAFAYAKHTER',             group: 'Malawi Inquires'                   },
//         {clientID: 'dUvlT', salesPerson: 'DANMEMON',                group: 'Zimbabwe Inquires'                },
//         {clientID: 'Vb92A', salesPerson: 'VINCENT',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'ty0Fi', salesPerson: 'ISHUAH',                  group: 'Kenya Inquires'              },
//         {clientID: 'l7Aow', salesPerson: 'HASOOMRO',                group: 'Kenya Inquires'                },
//         {clientID: 'ncEm1', salesPerson: 'RASEDUZZAMAN',            group: 'Tanzania Inquires'                    },
//         {clientID: 'RViSI', salesPerson: 'MSSHAHID',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'yne8G', salesPerson: 'KJISLAM',                 group: 'ENGLAND (EUROPE)'               },
//         {clientID: 'P6oNZ', salesPerson: 'SHARMINKHAN',             group: 'Kenya Inquires'                   },
//         {clientID: 'Rw1k2', salesPerson: 'KHAWNASEEM',              group: 'West Africa English'                  },
//         {clientID: 'yfmyP', salesPerson: 'MAYENG',                  group: 'Oceania Inquires'              },
//         {clientID: 'Sb3lC', salesPerson: 'SSALIKHAN',               group: 'CONGO Inquries'                 },
//         {clientID: '8Nv3E', salesPerson: 'ARNOLD',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'EBiOs', salesPerson: 'FGOMONDA',                group: 'Malawi Inquires'                },
//         {clientID: 'swfTJ', salesPerson: 'MINHAJHOS',               group: 'Zambia Inquires'                 },
//         {clientID: 'WslhR', salesPerson: 'JAVAN',                   group: 'BAHAMAS (CARIB)'             },
//         {clientID: 'JdUUI', salesPerson: 'DENNIS',                  group: 'Tanzania Inquires'              },
//         {clientID: 'sXGlW', salesPerson: 'USFAROOQ',                group: 'Malawi Inquires'                },
//         {clientID: 'dMLfp', salesPerson: 'OSAMAKHAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '7OQWD', salesPerson: 'HADIQA',                  group: 'Zambia Inquires'              },
//         {clientID: 'x1WbR', salesPerson: 'KQURESHI',                group: 'Zambia Inquires'                },
//         {clientID: 'cpxDU', salesPerson: 'RIAZKHAN',                group: 'Kenya Inquires'                },
//         {clientID: '4yYkU', salesPerson: 'IMSALEEM',                group: 'Tanzania Inquires'                },
//         {clientID: 'SylBV', salesPerson: 'FASZAID',                 group: 'Botswana Inquires'               },
//         {clientID: 'AUcSh', salesPerson: 'MANUELG',                 group: 'Mozambique Inquires'               },
//         {clientID: 'aFEb2', salesPerson: 'SARTAJM',                 group: 'West Africa English'               },
//         {clientID: 'nrPmM', salesPerson: 'MSHEIKH',                 group: 'UAE Inquires'               },
//         {clientID: 'Pb9sj', salesPerson: 'UMBAIG',                  group: 'Uganda Inquires'              },
//         {clientID: 't4HES', salesPerson: 'HARISMED',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'jvjqG', salesPerson: 'ZZUMRUD',                 group: 'Botswana Inquires'               },
//         {clientID: '9nEIX', salesPerson: 'ABIYA',                   group: 'Kenya Inquires'             },
//         {clientID: 'LVDuP', salesPerson: 'FARSIDDIQUI',             group: 'TURKS AND CAICOS (CARIB)'                   },
//         {clientID: 'BZHRW', salesPerson: 'JMSIS',                   group: 'Tanzania Inquires'             },
//         {clientID: 'moOOY', salesPerson: 'JHANAZEB',                group: 'Uganda Inquires'                },
//         {clientID: '7LkFa', salesPerson: 'VICKY',                   group: 'Uganda Inquires'             },
//         {clientID: 'KUxZx', salesPerson: 'ABDBASIT',                group: 'Tanzania Inquires'                },
//         {clientID: '4xZbo', salesPerson: 'IBTESAM',                 group: 'GUYANA (CARIB)'               },
//         {clientID: 'eLwhI', salesPerson: 'MUHSAAD',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'fiNye', salesPerson: 'MUHANOMAN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'oGRdu', salesPerson: 'AZESIDDIQUI',             group: 'TRINIDAD (CARIB)'                   },
//         {clientID: '2VKF5', salesPerson: 'SAHIFATIMA',              group: 'CONGO Inquries'                  },
//         {clientID: 'FJnn7', salesPerson: 'ATHAROON',                group: 'GUYANA (CARIB)'                },
//         {clientID: 'PdVAk', salesPerson: 'USNASEER',                group: 'Pakistan Inquires'                },
//         {clientID: 'p5qWe', salesPerson: 'OMJAMEEL',                group: 'Tanzania Inquires'                },
//         {clientID: 'bm558', salesPerson: 'SUAD',                    group: 'UAE Inquires'            },
//         {clientID: 'hmojc', salesPerson: 'PHILLIP',                 group: 'Zimbabwe Inquires'               },
//         {clientID: 'EAL4G', salesPerson: 'ISHTIAK',                 group: 'Kenya Inquires'               },
//         {clientID: 'GISrI', salesPerson: 'JERUSA',                  group: 'Kenya Inquires'              },
//         {clientID: 'PrVIX', salesPerson: 'HASNAINALI',              group: 'TRINIDAD (CARIB)'                  },
//         {clientID: 'BxLya', salesPerson: 'AMANI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'rfhXx', salesPerson: 'ZBUTT',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'ZrUYB', salesPerson: 'ZAIQBAL',                 group: 'Malawi Inquires'               },
//         {clientID: 'NZWIF', salesPerson: 'THAVER',                  group: 'Uganda Inquires'              },
//         {clientID: '28Cqp', salesPerson: 'LEKULE',                  group: 'Tanzania Inquires'              },
//         {clientID: 'hO2hm', salesPerson: 'UZZAL',                   group: 'Kenya Inquires'             },
//         {clientID: 'vbUgD', salesPerson: 'BINAYUB',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: '7B9wz', salesPerson: 'FHAQUE',                  group: 'Tanzania Inquires'              },
//         {clientID: 'F8elV', salesPerson: 'SYSHABBAS',               group: 'Malawi Inquires'                 },
//         {clientID: 'RHaOV', salesPerson: 'REDWAN',                  group: 'Tanzania Inquires'              },
//         {clientID: 'XB8Ib', salesPerson: 'DANAYAZ',                 group: 'CONGO Inquries'               },
//         {clientID: 'SoewI', salesPerson: 'MUHHASSAN',               group: 'Malawi Inquires'                 },
//         {clientID: 'xtnML', salesPerson: 'AMSALK',                  group: 'Zambia Inquires'              },
//         {clientID: 'yzweY', salesPerson: 'MDNASIR',                 group: 'Malawi Inquires'               },
//         {clientID: 'oZmBx', salesPerson: 'IQRA',                    group: 'Tanzania Inquires'            },
//         {clientID: 'nTrxp', salesPerson: 'WISHAQ',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'bUleX', salesPerson: 'HAMZAHEER',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '5SxMW', salesPerson: 'ANBALAGAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'cju7U', salesPerson: 'MIMSHAFRAN',              group: 'Botswana Inquires'                  },
//         {clientID: 'SQWuL', salesPerson: 'HIBAAFAQ',                group: 'Malawi Inquires'                },
//         {clientID: '0OnNR', salesPerson: 'FAAKASH',                 group: 'Zambia Inquires'               },
//         {clientID: 'XDH8q', salesPerson: 'MARIAMALAM',              group: 'Tanzania Inquires'                  },
//         {clientID: 'E2BN6', salesPerson: 'SHEREEN',                 group: 'Tanzania Inquires'               },
//         {clientID: 'NauBW', salesPerson: 'MAITHA',                  group: 'Kenya Inquires'              },
//         {clientID: 'JFShZ', salesPerson: 'AZAD',                    group: 'TRINIDAD (CARIB)'            },
//         {clientID: '50yxu', salesPerson: 'SHEILA',                  group: 'Zambia Inquires'              },
//         {clientID: 'xauxu', salesPerson: 'ARBABR',                  group: 'Malawi Inquires'              },
//         {clientID: 'zTujR', salesPerson: 'SHOSHUJA',                group: 'Kenya Inquires'                },
//         {clientID: 'r5g3M', salesPerson: 'AHMGHANI',                group: 'Uganda Inquires'                },
//         {clientID: '5FKT4', salesPerson: 'LAKSHIKA',                group: 'Malawi Inquires'                },
//         {clientID: 'qja9a', salesPerson: 'SMUMTAZ',                 group: 'Zambia Inquires'               },
//         {clientID: 'EQEXG', salesPerson: 'FEONIA',                  group: 'GUYANA (CARIB)'              },
//         {clientID: '9qtho', salesPerson: 'ANIK',                    group: 'BAHAMAS (CARIB)'            },
//         {clientID: 'QXQxe', salesPerson: 'WAJKHAN',                 group: 'Kenya Inquires'               },
//         {clientID: '6w9IQ', salesPerson: 'HISAMUDDIN',              group: 'CONGO Inquries'                  },
//         {clientID: 'gIjvc', salesPerson: 'SHERBAH',                 group: 'Georgia Inquires'               },
//         {clientID: 'lHSMo', salesPerson: 'BARAKA',                  group: 'Tanzania Inquires'              },
//         {clientID: 'yLZXp', salesPerson: 'TANZEEL',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'DA2im', salesPerson: 'NUJHATUN',                group: 'Zambia Inquires'                },
//         {clientID: 'xDZeK', salesPerson: 'MOSHARRAF',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'CEOyI', salesPerson: 'MAIDHA',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'qg8TJ', salesPerson: 'ALIFAR',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'RQ2Hq', salesPerson: 'ZEEKHAN',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'OOIj7', salesPerson: 'SHAREHMAN',               group: 'TRINIDAD (CARIB)'                 },
//         {clientID: 'wp7RL', salesPerson: 'AFRIDI',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'idCne', salesPerson: 'MOHAMEDADIL',             group: 'JAMAICA (CARIB)'                   },
//         {clientID: 'HYNWv', salesPerson: 'KARYDES',                 group: 'CYPRUS (EUROPE)'               },
//         {clientID: 'wulrm', salesPerson: 'KHADIJA',                 group: 'Malawi Inquires'               },
//         {clientID: 'GGdJI', salesPerson: 'KATHY',                   group: 'Kenya Inquires'             },
//         {clientID: 'VhqJo', salesPerson: 'SUREHARID',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'XzDD4', salesPerson: 'HABDULLAH',               group: 'GUYANA (CARIB)'                 },
//         {clientID: 'rJCQ3', salesPerson: 'NABALI',                  group: 'CONGO Inquries'              },
//         {clientID: 'UDSLP', salesPerson: 'ARLENE',                  group: 'Malawi Inquires'              },
//         {clientID: '0ETtP', salesPerson: 'SAJAMSHED',               group: 'Kenya Inquires'                 },
//         {clientID: 'Vi4Il', salesPerson: 'JANE',                    group: 'TURKS AND CAICOS (CARIB)'            },
//         {clientID: 'jUoTt', salesPerson: 'BOLOTBEKCHIN',            group: 'Georgia Inquires'                    },
//         {clientID: 'VLLXe', salesPerson: 'SINELA',                  group: 'Mozambique Inquires'              },
//         {clientID: 'Gd59I', salesPerson: 'MTPARACHA',               group: 'IRELAND (EUROPE)'                 },
//         {clientID: 'XjqX2', salesPerson: 'JUNSHAMSHAD',             group: 'Malawi Inquires'                   },
//         {clientID: 'qrrWB', salesPerson: 'WAQRASUL',                group: 'UAE Inquires'                },
//         {clientID: '30EXS', salesPerson: 'MUTISYA',                 group: 'Kenya Inquires'               },
//         {clientID: '2nzUc', salesPerson: 'JACKLINE',                group: 'Tanzania Inquires'                },
//         {clientID: 'u2pkE', salesPerson: 'JOHNCRIS',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: '6PUqR', salesPerson: 'KRISTINE',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'pnBFz', salesPerson: 'MASOAHMED',               group: 'Kenya Inquires'                 },
//         {clientID: '6UG6z', salesPerson: 'TASIDDIQUI',              group: 'Kenya Inquires'                  },
//         {clientID: 'SA6bc', salesPerson: 'OGECHI',                  group: 'Kenya Inquires'              },
//         {clientID: 'pxFIg', salesPerson: 'RABAB',                   group: 'Malawi Inquires'             },
//         {clientID: 'G9uDT', salesPerson: 'ZAINMED',                 group: 'Kenya Inquires'               },
//         {clientID: 'SLf86', salesPerson: 'AGNESS',                  group: 'Zambia Inquires'              },
//         {clientID: 'ZNyUe', salesPerson: 'MAINA',                   group: 'Kenya Inquires'             },
//         {clientID: 'KkPGK', salesPerson: 'IMTIYAZALAM',             group: 'Zambia Inquires'                   },
//         {clientID: '8e5Rj', salesPerson: 'MUHEHSAN',                group: 'MAURITIUS (EUROPE)'                },
//         {clientID: 'wEay7', salesPerson: 'SALHUSSAIN',              group: 'Kenya Inquires'                  },
//         {clientID: 'FCWji', salesPerson: 'HASSAHMED',               group: 'Swaziland Inquires'                 },
//         {clientID: 'BkqeX', salesPerson: 'ZAINASIR',                group: 'ENGLAND (EUROPE)'                },
//         {clientID: '1MAxV', salesPerson: 'SOHELMRIDHA',             group: 'West Africa English'                   },
//         {clientID: 'dDKIb', salesPerson: 'MUKRY',                   group: 'Uganda Inquires'             },
//         {clientID: 'LkwQg', salesPerson: 'MUSHFIQUR',               group: 'Malawi Inquires'                 },
//         {clientID: '5PqmH', salesPerson: 'REQEEB',                  group: 'Kenya Inquires'              },
//         {clientID: 'EDUOH', salesPerson: 'JANDY',                   group: 'CONGO Inquries'             },
//         {clientID: 'QjgRV', salesPerson: 'MUWAQAS',                 group: 'CONGO Inquries'               },
//         {clientID: 'aW02X', salesPerson: 'SADIQNEK',                group: 'MALTA (EUROPE)'                },
//         {clientID: 'dR2G8', salesPerson: 'KHUQAZI',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'KQOvf', salesPerson: 'SEMPERTEGUI',             group: 'Paraguay Inquires'                   },
//         {clientID: '7w0uO', salesPerson: 'ANRAFIQUE',               group: 'Uganda Inquires'                 },
//         {clientID: 'i8JiS', salesPerson: 'ALIBHAI',                 group: 'Kenya Inquires'               },
//         {clientID: 'jjlT2', salesPerson: 'DALMAS',                  group: 'Kenya Inquires'              },
//         {clientID: 'RziaI', salesPerson: 'ZYAMBO',                  group: 'Zambia Inquires'              },
//         {clientID: 'l1np2', salesPerson: 'SARAH',                   group: 'Uganda Inquires'             },
//         {clientID: 'f1dKD', salesPerson: 'SYNABEEL',                group: 'Pakistan Inquires'                },
//         {clientID: 'o9ljs', salesPerson: 'LYDIAH',                  group: 'Kenya Inquires'              },
//         {clientID: 'cWQul', salesPerson: 'SHEJUNAID',               group: 'SURINAME (CARIB)'                 },
//         {clientID: 'PuYMC', salesPerson: 'HIRAFAIZ',                group: 'Malawi Inquires'                },
//         {clientID: 'QPbNv', salesPerson: 'JAHUSSAIN',               group: 'TURKS AND CAICOS (CARIB)'                 },
//         {clientID: '2DsuC', salesPerson: 'FAHHMED',                 group: 'UAE Inquires'               },
//         {clientID: 'Y6VOj', salesPerson: 'FRANCE',                  group: 'Kenya Inquires'              },
//         {clientID: 'mFn2y', salesPerson: 'KHUBAB',                  group: 'MAURITIUS (EUROPE)'              },
//         {clientID: 'ut7YK', salesPerson: 'SWAHASSAN',               group: 'GUYANA (CARIB)'                 },
//         {clientID: 'HDwzY', salesPerson: 'TAHSEEN',                 group: 'Malawi Inquires'               },
//         {clientID: 'C1HKm', salesPerson: 'MUHADEEL',                group: 'Swaziland Inquires'                },
//         {clientID: 'vYDIC', salesPerson: 'ZOAHKHAN',                group: 'Zambia Inquires'                },
//         {clientID: 'mSPqk', salesPerson: 'SUALI',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'dzqTj', salesPerson: 'MUHDANIYAL',              group: 'JAMAICA (CARIB)'                  },
//         {clientID: 'sjPkO', salesPerson: 'SHAKFAROOQUI',            group: 'BAHAMAS (CARIB)'                    },
//         {clientID: 'iDSjl', salesPerson: 'ALLAUDIN',                group: 'Malawi Inquires'                },
//         {clientID: 'QFAUF', salesPerson: 'SHENAZIR',                group: 'IRELAND (EUROPE)'                },
//         {clientID: 'UcTf3', salesPerson: 'DUISHENOV',               group: 'Georgia Inquires'                 },
//         {clientID: 'dAUqs', salesPerson: 'ASFANDIYAR',              group: 'South Sudan'                  },
//         {clientID: 'lBlKS', salesPerson: 'NOUMAN',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'tvY5d', salesPerson: 'HASHUSSAIN',              group: 'Zambia Inquires'                  },
//         {clientID: 'QMQWN', salesPerson: 'NAZAHMED',                group: 'Tanzania Inquires'                },
//         {clientID: 'fRvBm', salesPerson: 'ZUUDDIN',                 group: 'Malawi Inquires'               },
//         {clientID: 'aSlEq', salesPerson: 'MUMUZAMMIL',              group: 'Malawi Inquires'                  },
//         {clientID: 'vm4EV', salesPerson: 'ZIA',                     group: 'Uganda Inquires'           },
//         {clientID: 'RtvzH', salesPerson: 'ANMEER',                  group: 'Kenya Inquires'              },
//         {clientID: 'Jjv8h', salesPerson: 'MASOOMRO',                group: 'Malawi Inquires'                },
//         {clientID: 'WSq4Z', salesPerson: 'JAFFRI',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'KpgNg', salesPerson: 'IJAZ',                    group: 'Kenya Inquires'            },
//         {clientID: 'UxEql', salesPerson: 'FARIHA',                  group: 'Kenya Inquires'              },
//         {clientID: 'IWUFq', salesPerson: 'SHAALKHAN',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'n3R8m', salesPerson: 'AZIZI',                   group: 'Kenya Inquires'             },
//         {clientID: 'bnf8K', salesPerson: 'ARSLAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'CNwmA', salesPerson: 'RAFEEQ',                  group: 'Zambia Inquires'              },
//         {clientID: 'mTNdT', salesPerson: 'MARSIDDIQUI',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'HfLWL', salesPerson: 'SAMUSTAFA',               group: 'Kenya Inquires'                 },
//         {clientID: 'QGsEg', salesPerson: 'MKJAVED',                 group: 'Kenya Inquires'               },
//         {clientID: '0tnQz', salesPerson: 'UZMA',                    group: 'Malawi Inquires'            },
//         {clientID: '6o5kC', salesPerson: 'WAHAB',                   group: 'Tanzania Inquires'             },
//         {clientID: 'bdsIL', salesPerson: 'MUHARSA',                 group: 'Kenya Inquires'               },
//         {clientID: 'oHG8w', salesPerson: 'ARSAFDAR',                group: 'GUYANA (CARIB)'                },
//         {clientID: 'TLufW', salesPerson: 'IMRANA',                  group: 'Zambia Inquires'              },
//         {clientID: 'xVapn', salesPerson: 'AFAQUE',                  group: 'Zambia Inquires'              },
//         {clientID: '7X0Sh', salesPerson: 'MIBRKHAN',                group: 'Zimbabwe Inquires'                },
//         {clientID: 'q6QqL', salesPerson: 'JUANKA',                  group: 'Paraguay Inquires'              },
//         {clientID: 'BIDnu', salesPerson: 'YOUALI',                  group: 'Kenya Inquires'              },
//         {clientID: 'cHyz9', salesPerson: 'QUADRI',                  group: 'Malawi Inquires'              },
//         {clientID: 'N3qvN', salesPerson: 'TALKHALID',               group: 'IRELAND (EUROPE)'                 },
//         {clientID: 'jsJGk', salesPerson: 'MUREHAN',                 group: 'Kenya Inquires'               },
//         {clientID: 'Eqnpg', salesPerson: 'RAZAFAR',                 group: 'CONGO Inquries'               },
//         {clientID: 'HTDkL', salesPerson: 'SUMMIYA',                 group: 'Uganda Inquires'               },
//         {clientID: 'LnAoV', salesPerson: 'ADNANABDU',               group: 'CONGO Inquries'                 },
//         {clientID: 'NI4bo', salesPerson: 'SAMIRA',                  group: 'MAURITIUS (EUROPE)'              },
//         {clientID: 'cn4aQ', salesPerson: 'MORIZVI',                 group: 'Kenya Inquires'               },
//         {clientID: '9Yd7C', salesPerson: 'OMJAMEEL',                group: 'Tanzania Inquires'                },
//         {clientID: '6QzA7', salesPerson: 'NOUREEN',                 group: 'Malawi Inquires'               },
//         {clientID: 'aUgWS', salesPerson: 'ZAINALI',                 group: 'Zambia Inquires'               },
//         {clientID: '0jrrV', salesPerson: 'FMOIZ',                   group: 'Zambia Inquires'             },
//         {clientID: 'SOlRM', salesPerson: 'BURHAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'Wcezu', salesPerson: 'JALEEL',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: 'qNZnr', salesPerson: 'IRSHAD',                  group: 'Zambia Inquires'              },
//         {clientID: '01oU7', salesPerson: 'MUHOWAIS',                group: 'CONGO Inquries'                },
//         {clientID: 'rquXI', salesPerson: 'LAURAPA',                 group: 'Paraguay Inquires'               },
//         {clientID: 'YEHjv', salesPerson: 'NAWAZ',                   group: 'Tanzania Inquires'             },
//         {clientID: 'KAZRF', salesPerson: 'WSALEEM',                 group: 'UAE Inquires'               },
//         {clientID: 'F7Tgb', salesPerson: 'ROCRIFE',                 group: 'Paraguay Inquires'               },
//         {clientID: 'EXRUD', salesPerson: 'SANAULLAH',               group: 'Tanzania Inquires'                 },
//         {clientID: 'b5R83', salesPerson: 'SIFTULLAH',               group: 'Malawi Inquires'                 },
//         {clientID: 'etZa5', salesPerson: 'GHORI',                   group: 'Kenya Inquires'             },
//         {clientID: 'cOs5z', salesPerson: 'SHIRAZ',                  group: 'Zambia Inquires'              },
//         {clientID: 'CkFWS', salesPerson: 'HASNAIN',                 group: 'Kenya Inquires'               },
//         {clientID: '74cqB', salesPerson: 'MAALI',                   group: 'Zambia Inquires'             },
//         {clientID: 'cC5U4', salesPerson: 'AHMEDALI',                group: 'Malawi Inquires'                },
//         {clientID: 'q8hSK', salesPerson: 'DARWIN',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'YfNSh', salesPerson: 'IVANN',                   group: 'Mozambique Inquires'             },
//         {clientID: 'SzZZf', salesPerson: 'SHERWANI',                group: 'Zambia Inquires'                },
//         {clientID: 'MGWhr', salesPerson: 'JAKHAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'uQ6jY', salesPerson: 'MARIA',                   group: 'Tanzania Inquires'             },
//         {clientID: 'eWnRi', salesPerson: 'SAKTHAR',                 group: 'Zambia Inquires'               },
//         {clientID: 'Y0Fmx', salesPerson: 'NAKHAN',                  group: 'Kenya Inquires'              },
//         {clientID: 'sUHRs', salesPerson: 'ADEELKHAN',               group: 'West Africa English'                 },
//         {clientID: 'yKd4A', salesPerson: 'ZULFIQAR',                group: 'Zambia Inquires'                },
//         {clientID: 'dfc1t', salesPerson: 'MUSTAFA',                 group: 'Tanzania Inquires'               },
//         {clientID: 'g2KbT', salesPerson: 'DANIYAL',                 group: 'Mozambique Inquires'               },
//         {clientID: 'fpBIW', salesPerson: 'LUIS',                    group: 'Paraguay Inquires'            },
//         {clientID: '7YXPH', salesPerson: 'JILL',                    group: 'Kenya Inquires'            },
//         {clientID: 'n4mNC', salesPerson: 'HKHALID',                 group: 'South Sudan'               },
//         {clientID: 'taWDo', salesPerson: 'AKARIM',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: 'lqO9b', salesPerson: 'FAROOK',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'OtYxK', salesPerson: 'HASHIMOTOKEI',            group: 'South Sudan'                    },
//         {clientID: 'aPwvY', salesPerson: 'MARIANBO',                group: 'Paraguay Inquires'                },
//         {clientID: 'XvyC2', salesPerson: 'ALIBAIG',                 group: 'RUSSIA Inquires'               },
//         {clientID: 'x3xIC', salesPerson: 'MATHAR',                  group: 'Zambia Inquires'              },
//         {clientID: 'BT9qb', salesPerson: 'TSUTSUMI',                group: 'Kenya Inquires'                },
//         {clientID: 'PZuzy', salesPerson: 'AREEB',                   group: 'Kenya Inquires'             },
//         {clientID: 'IqZR8', salesPerson: 'TAIMUR',                  group: 'Zambia Inquires'              },
//         {clientID: '9gAKG', salesPerson: 'AHKHAN',                  group: 'South Sudan'              },
//         {clientID: 'EhmYi', salesPerson: 'HAQ',                     group: 'Zambia Inquires'           },
//         {clientID: 'TEN4t', salesPerson: 'NGUL',                    group: 'Kenya Inquires'            },
//         {clientID: 'TAUsf', salesPerson: 'MJUNAID',                 group: 'Mozambique Inquires'               },
//         {clientID: 'XAOgP', salesPerson: 'AKHAN',                   group: 'Pakistan Inquires'             },
//         {clientID: 'USAPf', salesPerson: 'SMREZA',                  group: 'RUSSIA Inquires'              },
//         {clientID: 'Bz0GB', salesPerson: 'MSAKRAM',                 group: 'Zambia Inquires'               },
//         {clientID: 'uB7Fj', salesPerson: 'ZEESHANALI',              group: 'Australia Inquires'                  },
//         {clientID: 'ydrMI', salesPerson: 'DON',                     group: 'TURKS AND CAICOS (CARIB)'           },
//         {clientID: 'DqvQR', salesPerson: 'RUSSELL',                 group: 'UAE Inquires'               },
//         {clientID: 'Rupoy', salesPerson: 'ROCKWEL',                 group: 'Tanzania Inquires'               },
//         {clientID: 'ql2xw', salesPerson: 'WAQASHUSSAIN',            group: 'Kenya Inquires'                    },
//         {clientID: 'kJTSc', salesPerson: 'KEN',                     group: 'GUYANA (CARIB)'           },
//         {clientID: 'Sru5M', salesPerson: 'ADNANAHMED',              group: 'Malawi Inquires'                  },
//         {clientID: 'AoEVm', salesPerson: 'SALAHUDDIN',              group: 'Kenya Inquires'                  },
//         {clientID: 'eSu4g', salesPerson: 'SHAMID',                  group: 'Kenya Inquires'              },
//         {clientID: 'Dwn0c', salesPerson: 'CHEL',                    group: 'Malawi Inquires'            },
//         {clientID: 'LGJWy', salesPerson: 'WASIF',                   group: 'Mozambique Inquires'             },
//         {clientID: 'SgiL5', salesPerson: 'FIDA',                    group: 'JAMAICA (CARIB)'            },
//         {clientID: 'XCNYy', salesPerson: 'JAHANGIR',                group: 'Botswana Inquires'                },
//         {clientID: 'kqPPT', salesPerson: 'YOUSUF',                  group: 'UAE Inquires'              },
//         {clientID: 'aTedp', salesPerson: 'SALLY',                   group: 'Oceania Inquires'             },
//         {clientID: 'r343p', salesPerson: 'YASIR',                   group: 'Mozambique Inquires'             },
//         {clientID: 'CrsVk', salesPerson: 'SHEHZAD',                 group: 'RUSSIA Inquires'               },
//         {clientID: '4kZqN', salesPerson: 'HASNAIN',                 group: 'Kenya Inquires'               },
//         {clientID: 'nRC1F', salesPerson: 'PAULA',                   group: 'New Zealand Inquires'             },
//         {clientID: 'dMw8y', salesPerson: 'NASIR',                   group: 'Pakistan Inquires'             },
//         {clientID: 'lp8yX', salesPerson: 'RASHID',                  group: 'Kenya Inquires'              },
//         {clientID: 'cxOWk', salesPerson: 'PATRICK',                 group: 'Kenya Inquires'               },
//         {clientID: 'UnZuL', salesPerson: 'MJUNAID',                 group: 'Malawi Inquires'               },
//         {clientID: 'i4MBt', salesPerson: 'EDWIN',                   group: 'Kenya Inquires'             },
//         {clientID: '4oqIH', salesPerson: 'WALLY',                   group: 'Kenya Inquires'             },
//         {clientID: 'SRsbA', salesPerson: 'SEGUN',                   group: 'TURKEY (EUROPE)'             },

//     ];
//     // let promises : any = [];
//     let noAgentFound  : any = [];
//     let details = ticketDetails.map(async element => {
//         let agent = await Agents.getAgentsByUsername('/sbtjapaninquiries.com', element.salesPerson.toLowerCase());

//         if(agent && agent.length){
//             Object.assign(element, {assigned_to : agent[0].email});
//             // promises.push(
//             await Tickets.collection.findOneAndUpdate({clientID: element.clientID}, {$set: {group: element.group, assigned_to: agent[0].email}})
//             // );
//         }else{
//             noAgentFound.push(element);
//             Object.assign(element, {assigned_to : ''});
//             // promises.push(
//             await Tickets.collection.findOneAndUpdate({clientID: element.clientID}, {$set: {group: element.group}})
//             // );
//         }
//         return agent;
//     });
//     await Promise.all(details);
//     res.send({ status: "ok" , unassiged: noAgentFound});
// });




export const ticketRoutes: express.Router = router;