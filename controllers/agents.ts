
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import * as express from "express";
import * as path from 'path';
import * as requestIp from 'request-ip';


import { Agents } from "../models/agentModel";
import * as request from 'request-promise';

import { SessionManager } from '../globals/server/sessionsManager';
import { AgentSessionSchema } from "../schemas/agentSessionSchema";
import { Tokens } from "../models/tokensModel";
import { encrypt, Namespaces, WEBSITEURL } from '../globals/config/constants';
import { Company } from "../models/companyModel";
import { Contacts } from "../models/contactModel";
import { Tickets } from "../models/ticketsModel";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import { server } from "../index";
import { CustomDispatcher } from "../actions/TicketAbstractions/TicketDispatcher";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { __BizzC_S3 } from "../actions/aws/aws-s3";
import { TeamsModel } from "../models/teamsModel";
import { __biZZC_Core, __BIZZC_REDIS, __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import { AgentConversations } from "../models/agentConversationModel";
import { AgentConversationStatus } from "../models/AgentConversationStatus";
import { SQSPacket } from "../schemas/sqsPacketSchema";
import { notDeepStrictEqual } from "assert";
import { ObjectID } from "mongodb";
import { iceServersModel } from "../models/iceServersModel";
import { agentSessions } from "../models/agentSessionModel";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
let { json2excel } = require('js2excel');

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
      next();
    }
    else res.status(401).send({ err: 'unauthorized' });
  }
  else res.status(401).send({ err: 'unauthorized' });

  // } else {


  //   res.status(401).send({ err: 'unauthorized' });
  // }
})

// router.post('/authenticate/:csid?', async (req, res, next) => {
//     // console.log('Auth');
//     // console.log(req.body);
//     if (!req.body.csid) return res.send(401);
//     else {
//         let exisitingSession = await SessionManager.Exists(req.body.csid);
//         let checkActivation: any;
//         if (exisitingSession && exisitingSession.length > 0) checkActivation = await Company.getCompany(exisitingSession[0].nsp);
//         // console.log(checkActivation);
//         //if (checkActivation && checkActivation[0].deactivated) res.status(401).send();
//         //else
//         if (exisitingSession) {
//             if (exisitingSession.length > 0) {
//                 Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
//                 res.status(200).send(exisitingSession[0].callingState);
//                 return;
//             } else {
//                 res.status(401).send(401);
//                 return;
//             }
//         } else {
//             return res.status(401).send(401);
//         }
//     }
// });

// router.post('/getUser', async (req, res, next) => {
//     console.log('get User');
//     console.log(req.body);
//     if (!req.body.email || !req.body.password) return res.status(401).send({ status: 'invalidparameters' });
//     req.body.email = decodeURIComponent(req.body.email);
//     req.body.password = decodeURIComponent(req.body.password);
//     let iceServers = await iceServersModel.getICEServers();

//     // iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
//     // console.log(req.body);
//     try {
//         let agent = await Agents.AuthenticateUser(req.body.email, req.body.password);
//         // console.log(agent);
//         let checkActivation;
//         if (agent && agent.length > 0) checkActivation = await Company.getCompany(agent[0].nsp);
//         // console.log(checkActivation);
//         if (agent && checkActivation && !checkActivation[0].deactivated) {
//             let continueProcess = false;
//             let authPermissions = checkActivation[0].settings.authentication;
//             //Case IF the user is superadmin then ignore the SSO check
//             if (agent[0].role == 'superadmin') {
//                 continueProcess = true;
//             } else {
//                 if (authPermissions.suppressionList.includes(agent[0].email)) {
//                     continueProcess = true;
//                 } else {
//                     if (!authPermissions[agent[0].role].enableSSO) {
//                         continueProcess = true;
//                     } else {
//                         let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
//                         //console.log(clientIp.toString());
//                         //console.log(req.headers['x-forwarded-for']);
//                         if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
//                     }
//                 }
//             }
//             //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
//             //Case IF SSO is disabled then continue the login process
//             //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
//             //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
//             let exists = await SessionManager.GetLiveSessionAgentByEmail(req.body.email);
//             // console.log(exists);
//             if (continueProcess && authPermissions[agent[0].role].TwoFA) {

//                 if (agent.length) {
//                     let code = new ObjectID().toHexString()
//                     let insertedCode = await Agents.InsertCode(code, req.body.email.toLowerCase());
//                     if (insertedCode && insertedCode.insertedCount) {
//                         await __biZZC_SQS.SendMessage({ action: 'sendaccesscode', code: code, email: req.body.email.toLowerCase() })
//                         res.status(203).send({ status: 'ok' })
//                     }
//                     else res.status(501).send()
//                     return;
//                 } else {
//                     res.status(401).send({ status: 'incorrectcredintials' }).end();
//                     return;
//                 }

//             }
//             else if (continueProcess && !authPermissions[agent[0].role].TwoFA) {
//                 if (agent.length && exists.length) {

//                     //console.log('Returning Existing sessions');
//                     agent[0].csid = exists[0]._id;
//                     agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined
//                     // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
//                     res.send(agent);
//                     return;
//                 }
//                 //End (Multiple Login Case)
//                 else if (agent.length && !(exists.length)) {
//                     //End (Multiple Login Case)
//                     let acceptingChats = !(agent[0].applicationSettings)
//                         ? true
//                         : agent[0].applicationSettings.acceptingChatMode;


//                     //let groups = await Company.getGroups(agent[0].nsp);
//                     let activeRooms: Array<string> = [];
//                     let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
//                     // console.log('Permissions: ');
//                     // console.log(permissions);
//                     let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
//                     let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
//                     let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
//                     let Agent: AgentSessionSchema = {
//                         socketID: [],
//                         agent_id: agent[0]._id,
//                         nsp: agent[0].nsp,
//                         createdDate: new Date().toISOString(),
//                         nickname: agent[0].nickname,
//                         email: agent[0].email,
//                         rooms: {},
//                         chatCount: 0,
//                         type: 'Agents',
//                         location: activeRooms,
//                         visitorCount: 0,
//                         role: agent[0].role,
//                         acceptingChats: acceptingChats,
//                         state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
//                         idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
//                         image: (agent[0].image) ? agent[0].image : '',
//                         locationCount: {},
//                         callingState: {
//                             socketid: '',
//                             state: false,
//                             agent: ''
//                         },
//                         permissions: permissions,
//                         groups: groups,
//                         teams: teams,
//                         isOwner: isOwner,
//                         updated: true,
//                         concurrentChatLimit: agent[0].settings.simchats
//                     }

//                     // console.log('agent');
//                     // console.log(agent[0]);


//                     // console.log('Before Inserting Session');
//                     // console.log(!!exists.length);
//                     let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
//                     if (insertedSession) {
//                         agent[0].csid = insertedSession.ops[0]._id
//                         agent[0].callingState = insertedSession.ops[0].callingState;
//                         agent[0].isOwner = insertedSession.ops[0].isOwner;
//                         agent[0].groups = insertedSession.ops[0].groups;
//                         agent[0].teams = insertedSession.ops[0].teams;
//                         Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
//                         Contacts.updateStatus(Agent.email, Agent.nsp, true);
//                     } else {
//                         res.status(501).send();
//                         return;
//                     }
//                     agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined
//                     res.send(agent);
//                     return;
//                     //next();
//                 }
//                 else {
//                     res.status(401).send({ status: 'incorrectcredintials' }).end();
//                     return;
//                 }
//             } else {
//                 //console.log(agent[0].email + ' is not authorized!');
//                 res.status(401).send({ status: 'unauthorized' }).end();
//                 return;
//             }
//         }
//         else {
//             // console.log('Second Else');
//             res.status(401).send({ status: 'incorrectcredintials' }).end();
//             return;
//         }
//     } catch (error) {
//         console.log('Error in Get User');
//         console.log(error);
//         res.status(401).send({ status: 'error' });
//         return;
//     }

// });


router.post('/setEmailNotificationSettings', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let modifiedObject = await Agents.UpdateEmailNotificationSettings(data.nsp, data.email, data.settings);

    if (modifiedObject && modifiedObject.value) {
      res.send({ status: 'ok', code: '200' });
    }
    else res.send({ status: 'error', code: '500' });


  } catch (error) {
    console.log('Error in setEmailNotificationSettings');
    res.send({ status: 'error' });
  }
});
router.post('/saveAgentTicketFilters', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let modifiedObject = await Agents.saveAgentTicketFilters(data.nsp, data.email, data.filters, data.applyInnerView);

    if (modifiedObject && modifiedObject.value) {
      res.send({ status: 'ok', code: '200' });
    }
    else res.send({ status: 'error', code: '500' });


  } catch (error) {
    console.log('Error in setEmailNotificationSettings');
    res.send({ status: 'error' });
  }
});

router.post('/getWindowNotificationSettings', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');

    let settings = await Agents.GetWindowNotificationSettings(data.nsp, data.email);

    if (settings && settings.length) {
      res.send({ status: 'ok', windowNotifications: settings[0].settings.windowNotifications });
    }
    else {
      res.send({ status: "error" })
    }
  } catch (error) {
    console.log(error);
    console.log('error in Getting Email Notificaitions Settings');
    res.send({ status: 'error' });
  }

});


router.post('/setWindowNotificationSettings', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send('Invalid Request!');
    let modifiedObject = await Agents.UpdateWindowNotificationSettings(data.nsp, data.email, data.settings);

    if (modifiedObject && modifiedObject.value) {
      res.send({ status: 'ok', code: '200' });
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'notifPermissionsChanged', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { settings: data.settings } })
    }
    else res.send({ status: 'error', code: '500' });


  } catch (error) {
    console.log('Error in setWindowNotificationSettings');
    res.send({ status: 'error' });
  }
});




router.post('/getEmailNotificationSettings', async (req, res) => {
  try {
    if (!req.body.nsp || !req.body.email) {
      res.status(401).send('Invalid Request!');
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      let settings = await Agents.GetEmailNotificationSettings(data.nsp, data.email);

      if (settings && settings.length) {
        res.send(
          {
            status: 'ok',
            emailNotifications: settings[0].settings.emailNotifications
          });
      }
      else {
        res.send({ status: 'error' });
      }
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log(error);
    console.log('error in Getting Email Notificaitions Settings');
  }

});


// router.post('/validateCode', async (req, res, next) => {
//     // console.log('get User');
//     // console.log(req.session);
//     if (!req.body.code) return res.status(401).send({ status: 'invalidCode' });
//     req.body.code = decodeURIComponent(req.body.code);
//     // console.log(req.body);
//     try {
//         let accesscode = await Agents.ValidateCode(req.body.code);
//         if (!accesscode) res.status(401).send({ status: 'invalidCode' });
//         else {
//             let agent = await Agents.GetAgentByEmail(accesscode.email.toLowerCase());
//             let checkActivation;
//             if (agent && agent.length) checkActivation = await Company.getCompany(agent[0].nsp);
//             // console.log(checkActivation);
//             if (agent && agent.length && checkActivation && !checkActivation[0].deactivated) {
//                 let continueProcess = false;
//                 let authPermissions = checkActivation[0].settings.authentication;
//                 // Case IF the user is superadmin then ignore the SSO check
//                 if (agent[0].role == 'superadmin') {
//                     continueProcess = true;
//                 } else {
//                     if (authPermissions.suppressionList.includes(agent[0].email)) {
//                         continueProcess = true;
//                     } else {
//                         if (!authPermissions[agent[0].role].enableSSO) {
//                             continueProcess = true;
//                         } else {
//                             let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
//                             //console.log(clientIp.toString());
//                             //console.log(req.headers['x-forwarded-for']);
//                             if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
//                         }
//                     }
//                 }
//                 //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
//                 //Case IF SSO is disabled then continue the login process
//                 //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
//                 //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
//                 let exists = await SessionManager.GetLiveSessionAgentByEmail(agent[0].email);
//                 // console.log(exists);
//                 if (continueProcess) {
//                     if (agent.length && exists.length) {

//                         //console.log('Returning Existing sessions');
//                         agent[0].csid = exists[0]._id;

//                         // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
//                         res.send(agent);
//                         return;
//                     }
//                     //End (Multiple Login Case)
//                     else if (agent.length && !(exists.length)) {
//                         //End (Multiple Login Case)
//                         let acceptingChats = !(agent[0].applicationSettings)
//                             ? true
//                             : agent[0].applicationSettings.acceptingChatMode;


//                         //let groups = await Company.getGroups(agent[0].nsp);
//                         let activeRooms: Array<string> = [];
//                         let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
//                         // console.log('Permissions: ');
//                         // console.log(permissions);
//                         let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
//                         let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
//                         let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
//                         let Agent: AgentSessionSchema = {
//                             socketID: [],
//                             agent_id: agent[0]._id,
//                             nsp: agent[0].nsp,
//                             createdDate: new Date().toISOString(),
//                             nickname: agent[0].nickname,
//                             email: agent[0].email,
//                             rooms: {},
//                             chatCount: 0,
//                             type: 'Agents',
//                             location: activeRooms,
//                             visitorCount: 0,
//                             role: agent[0].role,
//                             acceptingChats: acceptingChats,
//                             state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
//                             idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
//                             image: (agent[0].image) ? agent[0].image : '',
//                             locationCount: {},
//                             callingState: {
//                                 socketid: '',
//                                 state: false,
//                                 agent: ''
//                             },
//                             permissions: permissions,
//                             groups: groups,
//                             teams: teams,
//                             isOwner: isOwner,
//                             updated: true,
//                             concurrentChatLimit: agent[0].settings.simchats
//                         }

//                         // console.log('agent');
//                         // console.log(agent[0]);


//                         // console.log('Before Inserting Session');
//                         // console.log(!!exists.length);
//                         let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
//                         if (insertedSession) {
//                             agent[0].csid = insertedSession.ops[0]._id
//                             agent[0].callingState = insertedSession.ops[0].callingState;
//                             agent[0].isOwner = insertedSession.ops[0].isOwner;
//                             agent[0].groups = insertedSession.ops[0].groups;
//                             agent[0].teams = insertedSession.ops[0].teams;
//                             Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
//                             Contacts.updateStatus(Agent.email, Agent.nsp, true);
//                         } else {
//                             res.status(501).send();
//                             return;
//                         }
//                         res.send(agent);
//                         return;
//                         //next();
//                     }
//                     else {
//                         res.status(401).send({ status: 'invalidCode' }).end();
//                         return;
//                     }
//                 } else {
//                     //console.log(agent[0].email + ' is not authorized!');
//                     res.status(401).send({ status: 'invalidCode' }).end();
//                     return;
//                 }
//             }
//             else res.status(401).send({ status: 'no agent found' });
//         }


//     } catch (error) {
//         console.log('Error in Get User');
//         console.log(error);
//         res.status(401).send({ status: 'error' });
//         return;
//     }

// });

router.post('/getSettings', async (req, res) => {
  try {
    if (!req.body.email) res.status(401).send();

    // console.log(req.body.email);
    // console.log(req.body.nsp);

    let AgentsettingsPromise = Agents.getSetting(req.body.email) as any;
    let groups = await TicketGroupsModel.GetGroupsAgainstAgent(req.body.nsp, req.body.email);
    let companySettingsPromise = Company.GetVerificationStatus(req.body.nsp) as any;
    // console.log('Getting Settings')
    let resolvedPromises = await Promise.all([AgentsettingsPromise, companySettingsPromise]);
    let agentSettings = resolvedPromises[0];
    let companySettings = resolvedPromises[1];
    // console.log('Agent Settings: ');
    // console.log(agentSettings);
    // console.log('Company Settings: ');
    // console.log(companySettings);
    if (agentSettings && agentSettings.length > 0 && companySettings && companySettings.length > 0) {
      if (agentSettings[0].automatedMessages == undefined) {
        agentSettings[0].automatedMessages = [];
      }

      if (companySettings[0]) {
        agentSettings[0].verified = companySettings[0].settings.verified;
        agentSettings[0].createdAt = companySettings[0].createdAt;
        agentSettings[0].expiry = companySettings[0].expiry;
        agentSettings[0].permissions = companySettings[0].settings.permissions;
        agentSettings[0].authentication = companySettings[0].settings.authentication;
        agentSettings[0].package = (companySettings[0].package) ? companySettings[0].package : {};
        agentSettings[0].windowNotifications = companySettings[0].settings.windowNotifications;
        if (companySettings[0].settings.schemas && companySettings[0].settings.schemas.ticket) {

          let fieldsToSplice: any = [];
          companySettings[0].settings.schemas.ticket.fields.filter((field, index) => {
            if (field.visibilityCriteria) {
              if (field.visibilityCriteria != 'all') {
                if (field.groupList.length) {
                  if (groups && groups.length) {
                    if (!field.groupList.some(r => groups.indexOf(r) >= 0)) {
                      fieldsToSplice.push(field.label);
                    }
                  } else {
                    fieldsToSplice.push(field.label);
                    // companySettings[0].settings.schemas.ticket.fields.splice(index, 1);
                  }
                } else {
                  fieldsToSplice.push(field.label);
                }
              }
            } else {
              field.visibilityCriteria = 'all';
              field.groupList = [];
            }
          });

          // console.log(req.body.email, indexesToSplice);
          fieldsToSplice.forEach(label => {
            companySettings[0].settings.schemas.ticket.fields.map((field, index) => {
              if (field.label == label) {
                companySettings[0].settings.schemas.ticket.fields.splice(index, 1);
              }
            })
          });
          // console.log(companySettings[0].settings.schemas.ticket.fields.map(f => f.label));
        }
        agentSettings[0].schemas = companySettings[0].settings.schemas;
      }
      // console.log('Agent Settings!');
      // console.log(agentSettings[0]);

      res.json(agentSettings[0]);
      return;
    } else {
      res.send({});
      return;
    }

  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
    return;
  }
});

router.post('/getGroups/:nsp?', async (req, res) => {
  //console.log(req.body.nsp);
  try {
    //console.log('getting Groups');
    if (!req.body.nsp) res.status(400).send();
    else {
      let groups = await Company.getGroups(req.body.nsp);
      res.send(groups);
      return;
    }

  } catch (error) {
    //console.log;
    console.log('Error ins Get Groups in Agents Controller');
    return;
  }
});

router.post('/registerAgent/:agent?', async (req, res) => {
  //console.log('Registering Agent');
  //console.log(req.body.agent);
  try {
    if (!req.body.agent) res.status(400).send();
    let pkg = await Company.getPackages(req.body.agent.nsp);
    if (pkg && pkg.length && pkg[0].package.agents.quota != -1) {
      let totalAgents = await Agents.GetAgentsCount(req.body.agent.nsp);
      if (totalAgents && totalAgents.length && pkg[0].package.agents.quota && (totalAgents[0].count >= pkg[0].package.agents.quota) && (totalAgents[0].count >= pkg[0].package.agents.limit)) {
        // console.log('Limit Exceeded');
        res.status(400).send({ status: 'Limit Exceeded' });
        return;
      }
    }

    let writeResult = await Agents.RegisterAgent(req.body.agent);
    if (!writeResult) {
      res.send(400).send()
    } else {
      if (process.env.NODE_ENV == 'production') {
        let packet: SQSPacket = {
          action: 'newAgent',
          body: writeResult[0]
        }
        await __biZZC_SQS.SendMessageToSOLR(packet, 'agent');
      }
      res.send(writeResult[0]);
    }

  } catch (error) {
    console.log(error);
    console.log('Error in Register Agent');
    res.status(500).send({ status: 'internal server error' });

  }

});

router.post('/deactivateAgent', async (req, res) => {
  try {
    if (!req.body.email || !req.body.nsp) {
      res.status(401).send({ status: 'error', msg: "Invalid Request!" });
    } else {
      let agent = await Agents.DeActivateAgent(req.body.email, req.body.nsp);
      if (agent && agent.value) {
        res.status(200).send({ status: 'success', msg: 'Agent deactivated successfully!' })
      } else {
        res.status(200).send({ status: 'error', msg: 'Agent could not be deactivated!' });
      }
    }
  } catch (err) {
    console.log(err);
    console.log('Error in deactivating Agent');
  }
});

router.get('/syncAgentsOnSolr', async (req, res) => {
  try {
    // let agentsArr: any = [];

    let agentsFromDb = await Agents.getAllDBAgents();

    agentsFromDb.forEach(async agent => {
      let response = await request.get('http://searchdb.beelinks.solutions:8983/solr/collectAgents/select?q=aid%3A' + agent._id);
      if (response) {
        let result = JSON.parse(response);
        if (result.response && result.response.docs.length) {
          result.response.docs.map(async solrAgent => {
            let body = solrAgent;
            let finalBody = [{
              "id": body.id,
              "email": { "set": agent.email },
              "nsp": { "set": agent.nsp },
              "role": { "set": agent.role },
            }];
            let headersOpt = {
              "content-type": "application/json"
            };
            await request.post("http://searchdb.beelinks.solutions:8983/solr/collectAgents/update?versions=true&commit=true", {
              body: finalBody,
              json: true,
              headers: headersOpt
            }).then((solr) => {
              console.log('Agent Updated!');
            });
          });
        } else {
          let obj = {
            first_name: agent.first_name,
            last_name: agent.last_name,
            nickname: agent.nickname,
            username: agent.username,
            email: agent.email,
            gender: agent.gender,
            nsp: agent.nsp,
            aid: agent.aid,
            created_date: agent.created_date,
            role: agent.role
          }
          var headersOpt = {
            "content-type": "application/json"
          };
          console.log("Inserting agent to solr");
          await request.post("http://searchdb.beelinks.solutions:8983/solr/collectAgents/update/json/docs?commit=true", {
            body: obj,
            json: true,
            headers: headersOpt
          }).then((solr) => {
            console.log('Agent Inserted in Solr...!!!');
          });
        }
      }
    })
  } catch (error) {
    console.log(error);

  }
})

router.get('/toggleSolrSearch/:nsp?/:value?', async (req, res) => {
  try {
    // console.log(req.query);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    let statusObj = {
      status: 'error',
      msg: 'Could not update!'
    }
    if (req.params.nsp && req.params.value) {
      let company = await Company.updateNSPSolrSearchSettings('/' + req.params.nsp, (req.params.value == 'yes' || req.params.value == 'true') ? true : false);
      if (company && company.ok) {
        statusObj.status = 'success!';
        statusObj.msg = 'Updated field solrSearch of ' + req.params.nsp + ' to ' + company.value.settings.solrSearch;
      }
    }
    res.send(statusObj);
  } catch (err) {
    console.log('Error in toggling solr search');
    console.log(err);

  }
})




//for reset password testing
// router.get('/reset_test', async (req, res) => {

//     //let url = new URL(req.url);
//     // if(url.hostname != 'localhost')
//     // {
//     //     res.status(401).send({status : 'error'});
//     // }
//     console.log('reset_test');
//     res.sendFile(path.resolve(__dirname + '/../public/static/assets/html/recover-password.html'));
// });

router.get('/reset/:token/:email', async (req, res) => {

  console.log('Reset Link : ', req.params);
  if (!req.params.token || !req.params.email) return res.status(404).send({ status: 'error' })
  else {
    try {
      let validated = await Tokens.validateToken(req.params.token);
      if (validated) {
        res.redirect(WEBSITEURL + `/recover-pass/${req.params.token}/${req.params.email}`)
        // res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/recover-password.html'));
      } else {
        res.redirect(WEBSITEURL + '/link-expired')

        // res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/link-expired.html'));
      }
    } catch (error) {
      console.log(error);
      console.log('error in reset Token');
      return res.status(404).send({ status: 'error' })
    }
  }

});

router.get('/activation/:token/', async (req, res) => {

  // console.log(req.params);
  if (!req.params.token) return res.status(404).send({ status: 'error' })
  else {
    try {
      let validated = await Tokens.FindToken(req.params.token);

      if (validated && validated.length) {

        let activation = await Tickets.ConfirmActivation(validated[0].email);
        res.status(200).send({ status: 'activate' });

      } else {
        res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/link-expired.html'));
      }
    } catch (error) {
      console.log(error);
      console.log('error in reset Token');
      return res.status(404).send({ status: 'error' })
    }
  }

});

router.get('/ticketFrame/:nsp/:id', async (req, res) => {
  if (!req.params.id) res.send({ status: 'error', text: 'Invalid Text' });
  else {
    res.send(`<html>
        <div id="print-section" class="hide">

            <body
                style='font-family: Roboto, sans-serif;padding:0;width:100%;border:0;padding:0!important;list-style:none;margin:0 auto;line-height:inherit;'>
                <iframe src="https://beelinks.solutions/agent/ticket/${req.params.nsp}/${req.params.id}"> </iframe>


            </body>
        </div>

        </html>`);
  }


});

router.get('/ticket/:nsp/:id', async (req, res) => {
  if (!req.params.id) res.send({ status: 'error', text: 'Invalid  request' });
  else {
    let ticket = await Tickets.getTicketByID(req.params.nsp, req.params.id);
    let ticketMessage = await Tickets.getMesages([req.params.id])
    let ticketString = '';
    let messagesString = '';
    if (ticket.length) {
      ticketString += `<label>Ticket ID :</label> <span>${ticket[0]._id}</span><br>
            <label>Subject :</label> <span>${ticket[0].subject}</span><br>
            <label>State :</label> <span>${ticket[0].state}</span><br>
            <label>Priority :</label> <span>${ticket[0].priority}</span><br>
            <label>Sent By :</label> <span>${ticket[0].visitor.email}</span><br>
            <label>Priority :</label> <span>${ticket[0].priority}</span><br>
            <label>Created at :</label> <span>${ticket[0].datetime}</span><br>
            <label>Last Modified at :</label> <span>${ticket[0].lasttouchedTime}</span><br>`
    }

    if (ticketMessage) {
      ticketMessage.map(message => {
        messagesString += `
                <span>From : ${message.from}</span><br>
                <span>To : ${message.to}</span><br>
                <span>Message : ${message.message}</span><br>
                <br>
                `
      })
    }

    res.send(`<html>
            <body style='font-family: Roboto, sans-serif;padding:0;width:100%;border:0;padding:0!important;list-style:none;margin:0 auto;line-height:inherit;'>
                <div style='text-align:center; padding:30px 0;'>
                    <a href='#'><img src='https://app.beelinks.solutions/assets/img/email/logo.png' width='200'></a>
                </div>

                <div style='text-align:center; padding:0 15px 15px 15px;color:#343434;font-size:14px;'>
                    <h3 style='line-height:24px;'>Just for <span style='color:#ff681f;'><b>your
                                ease!</b></span></h3>
                    <img style='margin-bottom:15px;border:5px solid rgba(255, 255, 255, .4);'
                        src='https://app.beelinks.solutions/assets/img/email/chat_transcript.png' width='90'>
                    <h3 style='font-weight:300;font-size:20px;margin:0;'>Thanks for choosing Beelinks,
                        <b></b></h3>
                    <br>


                    <br>
                    <!-- style='box-sizing:border-box;max-width:600px;width:100%;padding:25px;border-radius:5px;background-color:#fbfbfb;border-spacing:4px;border:2px dashed #e8e8e8;margin:20px auto;'> -->

                    <div>${ticketString}
                    <br>
                    ${messagesString}

                    </div>

                    <br>
                    <p>
                        <img src='https://app.beelinks.solutions/assets/img/email/mail-send.png' alt=''><br>
                        <b>Get in touch</b>
                        <br>
                        <span>Our team is here for you 24/7. For any questions or concerns, please feel free
                            to reach out to us.</span>
                    </p>
                    <br>
                    <br>
                </div>
                <div style='width:100%;text-align:center; background:rgba(255, 104, 31, .3);font-size:14px;'>
                    <div
                        style='max-width:600px;width:100%;text-align:center;padding:20px 0 20px 0;margin:0 auto;color:#343434;font-size:14px;'>

                        <b style='margin-bottom: 0px; margin-top: 0px;'>With Beelinks, you are always
                            connected.</b>
                    </div>
                </div>

                <script>
                window.onload = function(e) { window.print(); }
                </script>


            </body>
        </html>`);
  }

});



//for successful request for forget password
router.post('/resetpswd', async (req, res) => {
  try {

    if (process.env.NODE_ENV == 'development') {
      //#region Setting CORS headers
      if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
      }
    }
    if (!req.body.email) return res.status(403).send({ status: 'error' });
    else {
      let agent = await Agents.GetAgentByEmail(req.body.email);
      if (agent && agent.length) {
        let permission = await Company.getAuthPermissions(agent[0].nsp);
        if (permission && permission.forgotPasswordEnabled) {

          let date: any = Date.parse(new Date().toISOString());
          date = new Date(new Date(date).setDate(new Date().getDate() + 1)).toISOString();
          // console.log(date);
          let token: Tokens = {
            id: encrypt(date),
            email: req.body.email,
            expireDate: new Date(date).toISOString(),
            type: 'forget_password'
          }
          Tokens.inserToken(token);

          /**
           * @Note
           * Following Technique is to achieve pub/sub architecture
           */
          await __biZZC_SQS.SendMessage({ action: 'resetpwd', token: token, url: WEBSITEURL + '/agent/reset/' });
          res.status(200).send({ status: 'successfull' });

        } else {
          res.status(401).send({ status: 'unauthorized' });
        }


      }
      else {
        res.status(403).send({ status: 'invalid' });

      }
    }
  } catch (error) {
    console.log(error);
    console.log('error in Reset Password');
    res.status(403).send({ status: 'invalid' });

  }

});

//For Successful Reset confirmation
router.post('/resetpswd/:password/:email', async (req, res) => {
  // console.log(req.body);

  //console.log('/resetpswd/:password/:email')
  //console.log("req.body");
  //console.log(req.body);
  if (!req.body.password || !req.body.email || !req.body.token) return res.status(401).send({ status: 'error' });
  let verified = await Tokens.VerifyToken(req.body.token, req.body.email);
  //console.log('verified')
  // console.log(verified)
  if (verified && verified.length) {
    await Agents.ChangePassword(req.body.password, req.body.email);

    await __biZZC_SQS.SendMessage({ action: 'sendPswdResetConf', to: req.body.email, url: WEBSITEURL + '/login' });

    res.status(200).send({ status: 'ok' });
  } else {
    res.status(401).send({ status: 'invalidInput' });
  }

})

router.post('/logout/:csid?', async (req, res) => {
  console.log('logout');
  try {
    if (!req.body.csid) res.status(401).send();
    else {
      let exisitingSession = await SessionManager.Exists(req.body.csid);
      if (exisitingSession) {
        if (exisitingSession.length > 0) {
          // console.log(exisitingSession);
          // await agentSessions.InserAgentSession(exisitingSession[0], exisitingSession[0]._id);
          // exisitingSession[0].id = exisitingSession[0]._id;
          // exisitingSession[0]['ending_time'] = new Date().toISOString();
          // SessionManager.DisplaySessionList(exisitingSession[0]);
          //await SessionManager.DeleteSession(req.body.csid);
          res.status(200).send({ logout: true });
          Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, false);
          return;
        } else {
          res.status(200).send({ logout: true });
          return;
        }
      } else {
        // console.log('Exisiting Session NOt Found');
        res.status(401).send();
        return;
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Logout');
    res.status(401).send();
  }
});

router.post('/validate/:email?', async (req, res) => {
  try {
    if (!req.body.email) res.status(401).send();
    let agent = await Agents.AgentExists(req.body.email)
    if (agent) res.status(401).send({ message: 'Already Exisits' });
    else res.status(200).send({ message: 'OK' });
  } catch (error) {
    console.log('Error in Email Validation');
    console.log(error);
    res.status(401).send();
  }
});

router.post('/searchAgents/', async (req, res) => {
  try {
    let agents = await Agents.searchAgents(req.body.nsp, req.body.keyword, req.body.chunk);
    let AgentSessions = await SessionManager.GetAllAgentsByNSP(req.body.nsp);
    let AgentsMap: any = {};

    if (AgentSessions) {
      AgentSessions.map(agent => {
        AgentsMap[agent.email] = agent;
      });

      if (agents) {
        agents = agents.map(agent => {
          if (AgentsMap[agent.email]) {
            agent.liveSession = {};
            agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
            agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
            agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
            agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
            agent.callingState = AgentsMap[agent.email].callingState;
          }
          return agent
        });
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
      }
    }
    // console.log(contacts);
    if (agents.length) res.status(200).send({ agentList: agents });
    else res.status(200).send({ agentList: [] });
  } catch (error) {
    console.log('Error in Search Contacts');
    console.log(error);
    res.status(401).send();
  }
})
router.get('/checkQuery', async (req, res) => {
  try {
    console.log('Query Check!');

    let start = new Date().toISOString();
    // console.log(new Date().toISOString());
    await Tickets.checkQuery();
    let end = new Date().toISOString();
    // console.log(new Date().toISOString());
    res.status(200).send(
      {
        start: start,
        end: end
      }
    )
  } catch (error) {
    console.log('Error in Email Validation');
    console.log(error);
    res.status(401).send();
  }
})


router.get('/startSocket', async (req, res) => {
  try {

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    console.log('Starting Socket');
    server.StartSocket();

  } catch (error) {
    console.log('Error in Starting Socket');
    console.log(error);
    res.status(401).send();
  }
});
router.get('/setCustomDispatcher/:nsp?/:value?', async (req, res) => {
  try {
    // console.log(req.query);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    let statusObj = {
      status: 'error',
      msg: 'Could not update!'
    }
    if (req.params.nsp && req.params.value) {
      let company = await Company.updateNSPDispatcherSettings('/' + req.params.nsp, (req.params.value == 'yes' || req.params.value == 'true') ? true : false);
      if (company && company.ok) {
        statusObj.status = 'success!';
        statusObj.msg = 'Updated field customDispatcher of ' + req.params.nsp + ' to ' + company.value.settings.customDispatcher;
      }
    }
    res.send(statusObj);

  } catch (err) {
    console.log('Error in setting custom dispatcher');
    console.log(err);
    res.status(401).send();
  }
});
router.get('/getPassword/:email?', async (req, res) => {
  try {
    // console.log(req.query);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (req.params.email) {
      let agent = await Agents.getAgentsByEmail(req.params.email);
      let code = await Agents.getAccessCode(req.params.email);

      if (agent && agent.length) res.send({
        _id: agent[0]._id,
        password: agent[0].password,
        nsp: agent[0].nsp,
        role: agent[0].role,
        accesscode: code
      });
      else res.send('Agent not found!')
    } else {
      res.send('Invalid email!');
    }
    // res.send('Invalid email!');

  } catch (err) {
    console.log('Error in getting password');
    console.log(err);
    res.status(401).send();
  }
});
router.get('/checkDispatcher', async (req, res) => {
  try {
    // console.log(req.query);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    let result: any;
    let msg = `<html>

<head></head>

<body>
    <p><span style="color: rgb(86, 166, 255); white-space: nowrap; background-color: rgb(255, 255, 255);">ryJht</span></p>
    <p><span style="background-color: rgb(255, 255, 255);"><font color="#56a6ff"><span style="white-space: nowrap;">CM ID 1463968</span></font>
        <br>
        </span>
        <br>
        <br>
    </p>
    <hr class="bg-theme-gray">
    <br>---------- Forwarded message ---------
    <br>
    <br>From: no-reply@sbtjapan.com
    <br>Date: 11/30/2019, 8:39:27 PM
    <br>Subject: [From Mobile] Quotation for NISSAN ATLAS TRUCK 2005 SWAZILAND - RHD English
    <br>To: sbtinquiries@sbtjapan.bizzchats.com
    <br>
    <br>
    <h2><span style="color:red;">&#x203B;Quotation email had been sent to customer in english</span></h2>
    <h2><span style="color:red;">&#x203B;Not Logged in Customer</span></h2>
    <h3>Customer ID: Possible 1463968</h3>
    <h3>Customer Email Address: sihlongonyane06@gmail.com</h3>
    <h3>Customer Phone: 76750311</h3>
    <h3>Country Name: SWAZILAND</h3>
    <h3>City Name: Manzini</h3>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>SBT JAPAN</title>
</body>

</html>`;
    let ticket = {
      "datetime": new Date().toISOString(),
      "lasttouchedTime": new Date().toISOString(),
      "nsp": "/localhost.com",
      "mergedTicketIds": [],
      "agentName": "",
      "from": "abc@gmail.com",
      "state": "OPEN",
      "source": "email",
      "ticketlog": [{ "title": "Assigned To Group", "status": "OPEN", "updated_by": "Rule Dispatcher", "user_type": "Agent", "time_stamp": "2019-11-08T10:11:20.216Z" }],
      "createdBy": "Visitor",
      "viewState": "UNREAD",
      "type": "email",
      "group": "Congo",
      "viewColor": "#F58758",
      "visitor": { "name": "no reply", "email": "no-reply@sbtjapan.com" },
      "subject": "[From Mobile] Cotation pour LAND ROVER RANGE ROVER SPORT 2007 DR CONGO - LHD French"
    }
    let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
    if (insertedTicket) {
      let ticketMessage = {
        "datetime": new Date().toISOString(),
        "from": "no-reply@sbtjapan.com",
        "message": msg,
        "messageId": ["0100016e4a7f18c0-13f0471e-63d3-4d2f-9e56-9e16c42029f4-000000"],
        "senderType": "Visitor",
        "tid": [insertedTicket.ops[0]._id],
        "to": "beedesk@sbtjapan.bizzchats.com",
        "attachment": [],
        "replytoAddress": "no-reply@sbtjapan.com",
        "viewColor": "#F58758",
        "nsp": "/localhost.com"
      }
      let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(ticketMessage)));
      result = await CustomDispatcher(insertedTicket.ops[0], msg);
      // console.log(result);

      (insertedTicket as any).ops[0] = result.secondaryTicket;
      // console.log(insertedTicket.ops[0]);

      await Tickets.UpdateTicketObj(insertedTicket.ops[0]);

      // let socket = SocketListener.getSocketServer();

      // socket.of('/localhost.com').to('ticketAdmin').emit('newTicket', {
      //     ticket: insertedTicket.ops[0]
      // });
      // socket.of('/localhost.com').to(ticket.group).emit('newTicket', {
      //     ticket: insertedTicket.ops[0]
      // });
      // if (result.primaryTicket) {
      //     socket.of('/localhost.com').to('ticketAdmin').emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
      //     socket.of('/localhost.com').to(result.primaryTicket.group).emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
      // }
    }
    res.send(result);

  } catch (err) {
    console.log('Error in setting custom dispatcher');
    console.log(err);
    res.status(401).send();
  }
});
router.get('/createTicketDummy', async (req, res) => {
  try {
    // console.log(req.query);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    let msg = `<html>

            <head></head>

            <body>
                <p><span style="color: rgb(86, 166, 255); white-space: nowrap; background-color: rgb(255, 255, 255);">ryJht</span></p>
                <p><span style="background-color: rgb(255, 255, 255);"><font color="#56a6ff"><span style="white-space: nowrap;">CM ID 1463968</span></font>
                    <br>
                    </span>
                    <br>
                    <br>
                </p>
                <hr class="bg-theme-gray">
                <br>---------- Forwarded message ---------
                <br>
                <br>From: no-reply@sbtjapan.com
                <br>Date: 11/30/2019, 8:39:27 PM
                <br>Subject: [From Mobile] Quotation for NISSAN ATLAS TRUCK 2005 SWAZILAND - RHD English
                <br>To: sbtinquiries@sbtjapan.bizzchats.com
                <br>
                <br>
                <h2><span style="color:red;">&#x203B;Quotation email had been sent to customer in english</span></h2>
                <h2><span style="color:red;">&#x203B;Not Logged in Customer</span></h2>
                <h3>Customer ID: Possible 1463968</h3>
                <h3>Customer Email Address: sihlongonyane06@gmail.com</h3>
                <h3>Customer Phone: 76750311</h3>
                <h3>Country Name: SWAZILAND</h3>
                <h3>City Name: Manzini</h3>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <title>SBT JAPAN</title>
            </body>

            </html>`;
    let ticket = {
      "_id": '1231237152361253712',
      "datetime": new Date().toISOString(),
      "lasttouchedTime": new Date().toISOString(),
      "nsp": "/localhost.com",
      "mergedTicketIds": [],
      "agentName": "",
      "from": "abc@gmail.com",
      "state": "OPEN",
      "source": "email",
      "ticketlog": [{ "title": "Assigned To Group", "status": "OPEN", "updated_by": "Rule Dispatcher", "user_type": "Agent", "time_stamp": "2019-11-08T10:11:20.216Z" }],
      "createdBy": "Visitor",
      "viewState": "UNREAD",
      "type": "email",
      "group": "Congo",
      "viewColor": "#F58758",
      "visitor": { "name": "no reply", "email": "no-reply@sbtjapan.com" },
      "subject": "[From Mobile] Cotation pour LAND ROVER RANGE ROVER SPORT 2007 DR CONGO - LHD French"
    }
    // let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
    // if (insertedTicket) {
    let ticketMessage = {
      "datetime": new Date().toISOString(),
      "from": "no-reply@sbtjapan.com",
      "message": msg,
      "messageId": ["0100016e4a7f18c0-13f0471e-63d3-4d2f-9e56-9e16c42029f4-000000"],
      "senderType": "Visitor",
      "tid": ticket._id,
      "to": "beedesk@sbtjapan.bizzchats.com",
      "attachment": [],
      "replytoAddress": "no-reply@sbtjapan.com",
      "viewColor": "#F58758",
      "nsp": "/localhost.com"
    }
    // let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(ticketMessage)));
    // if (insertedTicket.insertedId && insertedMessage.insertedId) {
    let obj = {
      _id: ticket._id,
      subject: ticket.subject,
      message: ticketMessage.message,
      nsp: ticket.nsp
    }
    // let obj = {
    //     _id: '123',
    //     subject: 'test',
    //     message: 'test',
    //     nsp: 'test'
    // }
    // console.log(resp);
    // }
    // result = await CustomDispatcher(insertedTicket.ops[0], msg);
    // console.log(result);

    // (insertedTicket as any).ops[0] = result.secondaryTicket;
    // console.log(insertedTicket.ops[0]);

    // await Tickets.UpdateTicketObj(insertedTicket.ops[0]);

    // let socket = SocketListener.getSocketServer();

    // socket.of('/localhost.com').to('ticketAdmin').emit('newTicket', {
    //     ticket: insertedTicket.ops[0]
    // });
    // socket.of('/localhost.com').to(ticket.group).emit('newTicket', {
    //     ticket: insertedTicket.ops[0]
    // });
    // if (result.primaryTicket) {
    //     socket.of('/localhost.com').to('ticketAdmin').emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
    //     socket.of('/localhost.com').to(result.primaryTicket.group).emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
    // }
    // }
    res.send('OK');

  } catch (err) {
    console.log('Error in setting custom dispatcher');
    console.log(err);
    res.status(401).send();
  }
});

router.get('/getTicketsFromSolr/:nsp/:query', async (req, res) => {

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  let nsp = '/' + req.params.nsp;
  let encodeNsp = encodeURI(nsp);
  let query = req.params.query;
  let url = 'http://44.230.89.174:8983/solr/collect/select?df=Message&fq=nsp%3A%22' + encodeNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1&rows=5';
  // console.log(url);
  let ticketIDs: any = [];
  var resp = await request.get(url, {});
  resp = JSON.parse(resp);
  if (resp) {
    resp.grouped.tid.groups.map(e => {
      e.doclist.docs.map(element => {
        ticketIDs.push(element.tid);
      });
    });
  }
  res.send(ticketIDs);
})


router.get('/checkNamespace', (req, res) => {
  res.status(200).send({ namespaces: Namespaces });
})

router.get('/changeChatLimit/:limit', (req, res) => {
  try {
    console.log('Limit : ', isNaN((req.params.limit as any)));
    if (!isNaN((req.params.limit as any))) __biZZC_Core.ConcurrentChatLimit = parseInt(req.params.limit);
    res.status(200).send({ status: __biZZC_Core.ConcurrentChatLimit });


  } catch (error) {
    res.status(200).send({ status: 'error' })
  }
})

/* #region  Agents */
router.post('/getAgentCounts', async (req, res) => {
  try {

    if (!req.body.nsp) {
      res.status(401).send();
    } else {

      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      let data = req.body;
      let agentCounts: any = {
        total: 0,
        agents: []
      }
      let total = await Agents.getAllAgents(data.nsp);
      agentCounts.total = (total) ? total.length : 0;

      let AgentSessions = await SessionManager.getAllLiveAgentsForCount(data.nsp);

      if (AgentSessions) {
        AgentSessions.map(agent => {
          agentCounts.agents.push({ email: agent.email, state: (agent.acceptingChats) ? 'active' : 'idle' })
        });
      }
      res.send({ status: 'ok', agentCounts: agentCounts });
    }
  } catch (error) {
    res.status(401).send({ status: 'error' });
    console.log(error);
    console.log('Error in getting agent counts');
  }
});
router.post('/agentsList', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) {
      res.status(401).send("Invalid Request!");
    } else {
      if (!data.type || (data.type && data.type == 'all')) {
        let agentsFromDb = await Agents.getAllAgentsAsync(data.nsp);
        let AgentSessions = await SessionManager.GetAllAgentsByNSP(data.nsp);
        let AgentsMap: any = {};
        if (AgentSessions) {
          AgentSessions.map(agent => {
            AgentsMap[agent.email] = agent;
          });
          if (agentsFromDb) {
            agentsFromDb = agentsFromDb.map(agent => {
              if (AgentsMap[agent.email]) {
                agent.liveSession = {} as any;
                agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
                agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
                agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
                agent.callingState = AgentsMap[agent.email].callingState;
              }
              agent.details = true;
              return agent
            });
          }
        }
        res.send({ status: 'ok', agents: (agentsFromDb) ? agentsFromDb : [], ended: (agentsFromDb && agentsFromDb.length < 20) ? true : false });
      }
      else {
        let agents: any = [];
        let AgentSessions: any = [];
        switch (data.type) {
          case 'online':
            AgentSessions = await SessionManager.getAllLiveAgentsForCount(data.nsp);
            if (AgentSessions && AgentSessions.length) {
              let AgentsMap: any = {};
              AgentSessions.map(agent => {
                AgentsMap[agent.email] = agent;
              });

              agents = await Agents.getAgentsByEmails(data.nsp, AgentSessions.map(a => a.email));
              agents.map(agent => {
                if (AgentsMap[agent.email]) {
                  agent.liveSession = {};
                  agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
                  agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
                  agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                  agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
                  agent.callingState = AgentsMap[agent.email].callingState;
                }
                agent.details = true;
                return agent;
              });
            }
            res.send({ status: 'ok', agents: agents, ended: true });
            break;
          case 'offline':
            AgentSessions = await SessionManager.GetAllAgentsByNSP(data.nsp);
            if (AgentSessions && AgentSessions.length) {
              let AgentsMap: any = {};
              AgentSessions.map(agent => {
                AgentsMap[agent.email] = agent;
              });

              agents = await Agents.getAgentsNotInEmails(AgentSessions.map(a => a.email), data.nsp);
            } else {
              agents = await Agents.getAllAgentsAsync(data.nsp);
            }
            res.send({ status: 'ok', agents: agents.map(a => { a.details = true; return a; }), ended: true });
            break;
        }
      }
    }
  } catch (error) {
    res.status(401).send("Invalid Request!");
    console.log(error);
    console.log('Error in getting agent lists');
  }
});
router.get('/resetChatCounts', async (req, res) => {
  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    // let data = req.body;
    await SessionManager.resetAgentChatCounts("/sbtjapaninquiries.com", 'Agents');
    res.send('Done!');
  } catch (err) {
    console.log(err);

  }
})
router.post('/agentsListFiltered', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send("Invalid Request!");
    let agents = await Agents.getFilteredAgents(data.nsp, data.filters, data.chunk);
    // console.log(agents);
    res.send({ status: 'ok', agents: (agents) ? agents : [], ended: (agents && agents.length < 20) ? true : false });
  } catch (error) {
    console.log(error);
    console.log('Error in getting agent lists');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/getMoreAgents', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp) res.status(401).send("Invalid Request!");
    let agents = await Agents.getAllAgentsAsync(data.nsp, data.chunk);
    //console.log(agents);
    let AgentSessions = await SessionManager.getAllLiveAgents(data.nsp);
    let AgentsMap: any = {};

    if (AgentSessions) {
      AgentSessions.map(agent => {
        AgentsMap[agent.email] = agent;
      });

      if (agents) {
        agents = agents.map(agent => {
          if (AgentsMap[agent.email]) {
            agent.liveSession = {};
            agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
            agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
            agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
            agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
            agent.callingState = AgentsMap[agent.email].callingState;
          }
          return agent
        });
      }
    }
    res.send({ status: 'ok', agents: agents, ended: (agents && agents.length < 20) ? true : false });
  } catch (error) {
    console.log(error);
    console.log('Error in getting more agents');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/getAllAgentsAsync', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send("Invalid Request!");

    let session = await SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp);
    if (session) {
      let agents: any = [];
      switch (session.permissions.tickets.canView) {
        case 'all':
        case 'group':
        case 'assignedOnly':
          agents = await Agents.getAllAgentsAsync(session.nsp, data.chunk);
          break;
        case 'team':
          let agentsToSearch = await TeamsModel.getTeamMembersAgainstAgent(session.nsp, session.email);
          agents = await Agents.getAgentsByEmails(session.nsp, agentsToSearch);
          break;
      }
      // let agentsFromDb
      if (agents && agents.length) {
        res.send({ status: 'ok', agents: (agents) ? agents : [], ended: (agents && agents.length < 20) ? true : false });
      }
    } else {
      res.status(401).send("Invalid Request!");
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agents async');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/getAllAgentsForRole', async (req, res) => {
  try {
    let data = req.body;
    if (!data.role || !data.nsp) res.status(401).send("Invalid Request!");
    let agents = await Agents.GetAllAgentsForRole(data.nsp, data.role);

    if (agents) {
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
router.post('/saveRoleForAgents', async (req, res) => {
  try {
    let data = req.body;

    if (!data.role || !data.users) res.status(401).send("Invalid Request!");
    let agents = await Agents.saveRoleForAgents(data.nsp, data.users, data.selectedRole, data.role);
    if (agents) {
      res.send({ status: 'ok', agents: agents });
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in saving role for agents');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/UpdateTimings', async (req, res) => {
  try {
    let data = req.body;
    let promises = [];
    if (!data.agents || (data.agents && !data.agents.length) || !data.nsp) res.status(401).send("Invalid Request!");

    promises = promises.concat(data.agents.map(async res => {
      await Agents.updateAgentTimings(data.nsp, res.email, res.ShiftStart, res.Duration, res.showShiftStart);
    }));

    await Promise.all(promises).then(val => {
      res.send({ status: 'ok', agents: data.agents });
    });
  } catch (error) {
    console.log(error);
    console.log('Error in assigning new roles for agents');
    res.status(401).send("Invalid Request!");
  }

});
router.post('/assignNewRolesForAgents', async (req, res) => {
  try {
    let data = req.body;
    if (!data.users || !data.nsp) res.status(401).send("Invalid Request!");
    let agents = await Agents.assignNewRolesForAgents(data.nsp, data.users);

    if (agents) {
      res.send({ status: 'ok' });
    } else {
      res.send({ status: 'error' });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in assigning new roles for agents');
    res.status(401).send("Invalid Request!");
  }
});
router.post('/checkForgotPassword', async (req, res) => {
  try {
    let data = req.body;
    // console.log(data);
    if (!data.email) res.status(401).send("Invalid Request!");
    let agent = await Agents.getAgentsByEmail(decodeURIComponent(data.email));


    if (agent && agent.length) {
      // console.log(agent);
      let permission = await Company.getAuthPermissions(agent[0].nsp);
      if (permission && permission.forgotPasswordEnabled) {
        res.status(200).send();
      } else {
        res.status(501).send();
      }
    } else {
      res.status(501).send();
    }
  } catch (error) {
    console.log(error);
    console.log('Error in assigning new roles for agents');
    res.status(401).send("Invalid Request!");
  }
});

router.post('/getAgentByEmail', async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) res.status(401).send("Invalid Request!");
    let agent = await Agents.getAgentsByEmail(data.email);
    if (agent && agent.length) {
      let session = await SessionManager.getAgentByEmail(agent[0].nsp, agent[0].email);
      if (session) {
        agent[0].liveSession = {};
        agent[0].liveSession.acceptingChats = session.acceptingChats;
        agent[0].liveSession.createdDate = session.createdDate;
        agent[0].liveSession.state = (session.acceptingChats) ? 'ACTIVE' : 'IDLE';
        agent[0].liveSession.idlePeriod = session.idlePeriod;
        agent[0].callingState = session.callingState;
      }
      res.send({ status: 'ok', agent: agent[0] })
    } else {
      res.send({ status: 'error' })
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agents by email');
    res.status(401).send("Invalid Request!");
  }
})
/* #endregion */


/* #region  Agent Conversations */
router.post('/createAgentConversation', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email || !data.conversation) res.status(401).send("Invalid Request!");
    let pkg: any[] = await Company.getPackages(data.nsp);
    if (pkg && !pkg[0].package.agents.chat) {
      res.status(401).send({ status: "Not Allowed" });
      return;
    }
    // console.log(data);
    switch (data.conversation.type) {
      case 'single':
        //Check duplicate
        // console.log(data.conversation.members);
        let conversation = await AgentConversations.getConversation(data.conversation.members.map(a => a.email), data.nsp);
        if (!conversation) {
          //create new conversation
          let result = await AgentConversations.createConversation(data.conversation, data.nsp);
          if (result) {
            let cid = result.ops[0]._id;
            result.ops[0].members.forEach(member => {
              AgentConversationStatus.createConversation(cid, member.email);
            });
            //get messages
            let agentConvStatus = await AgentConversationStatus.getConversationStatus(result.ops[0]._id, data.email);
            let messages: any = [];
            if (agentConvStatus && agentConvStatus.length) {
              messages = await AgentConversations.getMessagesAsync(result.ops[0]._id, agentConvStatus[0].MessageIds);
            }
            result.ops[0].messages = (messages && messages.length) ? messages : [];
            // console.log(result.ops[0]);
            res.send({ status: 'ok', conversation: result.ops[0] });
            let recievers = await SessionManager.GetSessionByEmailsFromDatabase(data.conversation.members.filter(a => a.email != data.email).map(a => a.email), data.nsp);
            if (recievers && recievers.length) {
              recievers.map(async reciever => {
                // origin.to((reciever.id || reciever._id) as string).emit('gotNewAgentConversation', { status: 'ok', conversation: (result) ? result.ops[0] : [] });
                //Redis work
                // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: insertedMessage });
                console.log('Push to redis');
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewAgentConversation', nsp: data.nsp, roomName: [(reciever.id || reciever._id) as string], data: { status: 'ok', conversation: (result) ? result.ops[0] : [] } })
              })
            }
          }
        } else {
          let messages = await AgentConversations.getMessagesAsync(conversation._id, data.email);
          // let temp = await AgentConversations.getMessagesAsync(conversation._id);
          conversation.messages = (messages && messages.length) ? messages : [];
          res.send({ status: 'ok', conversation: conversation });
        }
        break;
      case 'group':
        //Dont check duplicate
        let result = await AgentConversations.createConversation(data.conversation, data.nsp);
        if (result && result.ops) {
          //get messages
          let cid = result.ops[0]._id;
          result.ops[0].members.forEach(member => {
            AgentConversationStatus.createConversation(cid, member.email);
          });
          // let agentConvStatus = await AgentConversationStatus.getConversationStatus(conversation._id, socket.handshake.session.email);
          let messages = await AgentConversations.getMessagesAsync(cid, data.email);

          result.ops[0].messages = (messages && messages.length) ? messages : [];
          res.send({ status: 'ok', conversation: result.ops[0] });
          let recievers = await SessionManager.GetSessionByEmailsFromDatabase(data.conversation.members.filter(a => a.email != data.email).map(a => a.email), data.nsp);
          if (recievers && recievers.length) {
            recievers.map(async reciever => {
              // origin.to((reciever.id || reciever._id) as string).emit('gotNewAgentConversation', { status: 'ok', conversation: (result) ? result.ops[0] : [] });
              //Redis Work
              console.log('Push to redis');
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewAgentConversation', nsp: data.nsp, roomName: [(reciever.id || reciever._id) as string], data: { status: 'ok', conversation: (result) ? result.ops[0] : [] } })
            })
          }
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    console.log('Error in creating agent conversation');
    res.status(401).send("Invalid Request!");
  }
})
router.post('/agentConversationsList', async (req, res) => {
  try {
    let data = req.body;
    if (!data.nsp || !data.email) res.status(401).send("Invalid Request!");
    else {
      let conversations = await AgentConversations.getAllConversations(data.email, data.nsp);
      res.send({ status: 'ok', conversations: conversations });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in getting agent conversations list');
    res.status(401).send("Invalid Request!");
  }
});


router.post('/getHourlyData', async (req, res) => {
  try {
    let data = req.body.obj;
    // console.log(data);
    let query = [
      {
        "$match": {
          "email": {
            "$in": data.agents
          }
        }
      },
      {
        "$project": {
          "createdDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$createdDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": data.timezone
            }
          },
          "endingDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$endingDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": data.timezone
            }
          },
          "email": 1.0,
          "nickname": 1,
          "idlePeriod": 1.0
        }
      },
      {
        "$match": {
          "$or": [
            {
              "createdDate": {
                "$gte": data.from.split('T')[0] + '00:00:00.000Z',
                "$lte": data.to.split('T')[0] + '00:00:00.000Z'
              }
            },
            {
              "endingDate": {
                "$gte": data.from.split('T')[0] + '00:00:00.000Z',
                "$lte": data.to.split('T')[0] + '00:00:00.000Z'
              }
            }
          ]

        }
      },
      {
        "$project": {
          "email": 1.0,
          "nickname": 1,
          "createdDate": {
            "$dateFromString": {
              "dateString": "$createdDate"
            }
          },
          "endingDate": {
            "$dateFromString": {
              "dateString": "$endingDate"
            }
          },
          "idlePeriod": 1.0
        }
      },
      {
        "$unwind": {
          "path": "$idlePeriod",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        "$addFields": {
          "idleStart": {
            "$dateFromString": {
              "dateString": {
                "$dateToString": {
                  "date": {
                    "$dateFromString": {
                      "dateString": "$idlePeriod.startTime"
                    }
                  },
                  "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                  "timezone": data.timezone
                }
              }
            }
          },
          "idleEnd": {
            "$dateFromString": {
              "dateString": {
                "$dateToString": {
                  "date": {
                    "$dateFromString": {
                      "dateString": "$idlePeriod.endTime"
                    }
                  },
                  "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                  "timezone": data.timezone
                }
              }
            }
          }
        }
      },
      {
        "$project": {
          "email": 1.0,
          "nickname": 1,
          "createdDate": {
            "$dateToString": {
              "date": "$createdDate",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          },
          "endingDate": {
            "$dateToString": {
              "date": "$endingDate",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          },
          "idleStart": {
            "$dateToString": {
              "date": "$idleStart",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          },
          "idleEnd": {
            "$dateToString": {
              "date": "$idleEnd",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          }
        }
      },
      {
        "$sort": {
          "email": 1.0,
          "createdDate": 1.0,
          "idleStart": 1.0
        }
      }
    ];
    let dataToSend: any = [];
    let archivedSessions = await agentSessions.collection.aggregate(query).toArray();
    if (archivedSessions && archivedSessions.length) {
      dataToSend = archivedSessions;
    }
    let currentSessions = await SessionManager.collection.aggregate(query).toArray();
    if (currentSessions && currentSessions.length) {
      currentSessions.forEach(session => {
        dataToSend.push(session);
      })
    }
    res.send({ data: dataToSend });
  } catch (err) {
    console.log(err);
  }
})

/* #endregion */
export const agentRoutes: express.Router = router;