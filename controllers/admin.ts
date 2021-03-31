import * as express from "express";

import { Agents } from "../models/agentModel";
import { Company } from "../models/companyModel";
import { SessionManager } from '../globals/server/sessionsManager';
import { AgentSessionSchema } from "../schemas/agentSessionSchema";
import { defaultSettings } from "../globals/config/constants";
import { MailingList } from "../models/mailingListModel";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import { Headers } from "request";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { TeamsModel } from "../models/teamsModel";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";


let router = express.Router();
const requestIp = require('request-ip');
const { URL } = require('url');

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

router.post('/getAdmin', async (req, res, next) => {

  //console.log('admin');
  //console.log(req.body);
  let clientIp = requestIp.getClientIp(req);


  // var ip1 = req.header('x-forwarded-for') || req.connection.remoteAddress;
  // console.log(ip1);

  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = (req.headers['x-forwarded-for'] as Headers).split(",")[0];

  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;

    ip = req.ip;

  }
  if (!req.body.email || !req.body.password) return res.status(401).send({ status: 'invalidparameters' });
  // console.log(req.body);
  req.body.email = decodeURIComponent(req.body.email);
  req.body.password = decodeURIComponent(req.body.password);

  if (req.body.email == 'admin@beelinks.solutions' && req.body.password == '12345678') {
    try {
      let agent = await Agents.AuthenticateAdmin(req.body.email, req.body.password);
      //console.log(agent);
      if (agent) {

        //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
        //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
        let exists = await SessionManager.GetLiveAdminSessionFromDatabase(req.body.email);
        //console.log(exists);
        if (agent.length && exists.length) {

          //console.log('Returning Existing sessions');
          agent[0].csid = exists[0]._id
          //Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
          res.send(agent);

        }
        //End (Multiple Login Case)
        else if (agent.length && !(exists.length)) {
          //End (Multiple Login Case)
          let acceptingChats = !(agent[0].applicationSettings)
            ? true
            : agent[0].applicationSettings.acceptingChatMode;


          //let groups = await Company.getGroups(agent[0].nsp);
          let activeRooms: Array<string> = [];
          let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
          let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
          let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
          let Agent: AgentSessionSchema = {
            socketID: [],
            nsp: agent[0].nsp,
            agent_id: agent[0]._id,
            createdDate: new Date().toISOString(),
            nickname: agent[0].nickname,
            email: agent[0].email,
            rooms: {},
            chatCount: 0,
            type: 'Admin',
            location: activeRooms,
            visitorCount: 0,
            role: '',
            acceptingChats: acceptingChats,
            state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
            idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
            image: (agent[0].image) ? agent[0].image : '',
            locationCount: {},
            isAdmin: true,
            callingState: {
              socketid: '',
              state: false,
              agent: ''
            },
            permissions: {},
            groups: groups,
            teams: teams,
            isOwner: isOwner,
            updated: true,
            concurrentChatLimit: 0
          }
          // console.log('Before Inserting Session');
          // console.log(!!exists.length);
          let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);

          if (insertedSession) {
            agent[0].csid = insertedSession.ops[0]._id
            agent[0].callingState = insertedSession.ops[0].callingState;
            agent[0].isAdmin = true;

            //Contacts.updateStatus(Agent.email, Agent.nsp, true);
          } else {
            res.status(501).send();
          }
          res.send(agent);
          //next();
        }
        else {
          res.status(401).send({ status: 'incorrectcredintials' }).end();
        }
      }
      else {
        //console.log('Second Else');
        res.status(401).send({ status: 'incorrectcredintials' }).end();
      }
    } catch (error) {
      console.log('Error in Get User');
      console.log(error);
      res.status(401).send({ status: 'error' });
    }
  }
  else {
    return res.status(401).send({ status: 'incorrectcredintials' });
  }

});


router.post('/getSettings', async (req, res) => {
  try {
    if (!req.body.email) res.status(401).send();
    if (req.body.email == 'admin@beelinks.solutions') {



      if (req.body.nsp) {
        let AgentsettingsPromise = Agents.getSetting(req.body.email) as any;
        let companySettingsPromise = Company.GetVerificationStatus(req.body.nsp) as any;

        let resolvedPromises = await Promise.all([AgentsettingsPromise, companySettingsPromise]);
        let agentSettings = resolvedPromises[0];
        let companySettings = resolvedPromises[1];

        if (agentSettings && agentSettings.length > 0 && companySettings && companySettings.length > 0) {
          if (agentSettings[0].automatedMessages == undefined) {
            agentSettings[0].automatedMessages = [];
          }

          if (companySettings[0]) {
            agentSettings[0].verified = companySettings[0].settings.verified;
            agentSettings[0].createdAt = companySettings[0].createdAt;
            agentSettings[0].expiry = companySettings[0].expiry;
          }


          res.json(agentSettings[0]);
        } else {
          res.send({});
        }
      }
    }
    else return res.status(401).send({ status: 'incorrectcredintials' });
  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();

  }
});


router.post('/getCompanies', async (req, res) => {
  try {



    if (!req.body.email) res.status(401).send();
    let agent = decodeURIComponent(req.body.email)
    let companies = await Company.GetCompanies();
    if (companies && companies.length) {
      res.send(companies);
    }
    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});

router.post('/getCompanyInfo', async (req, res) => {
  try {

    if (!req.body.nsp) res.status(401).send();
    let companyNsp = decodeURIComponent(req.body.nsp)

    let agents = await Agents.getAllAgents(companyNsp);
    if (agents && agents.length) {

      res.send(agents);
    }

    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});

router.post('/getAgentInfo', async (req, res) => {
  try {
    //(req.body)
    if (!req.body.agent.email || !req.body.agent.nsp) res.status(401).send();

    let agentInfo = await Agents.getAgentsInfo(req.body.agent);
    if (agentInfo) {

      res.send(agentInfo);
    }

    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});



router.post('/updateCompanyInfo', async (req, res) => {
  try {
    //let origin: SocketIO.Namespace = (SocketListener.socketIO as SocketIO.Server).of(namespace.name);
    //console.log(req.body.company.nsp)

    if (!req.body.company) res.status(401).send();


    if (req.body.company.mailingListCheck) {
      await MailingList.addToMailingList(req.body.company.email);
    }
    let updatedCompany = await Company.UpdateCompany(req.body.company);
    if (updatedCompany && updatedCompany.value) {
      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'updateCompanyInfor', to: 'S', data: updatedCompany });
      res.send(updatedCompany);
    }
    else res.status(501).send();


  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});


router.post('/getDefaultSettings', async (req, res) => {
  try {

    if (!req.body.settings) res.status(401).send();

    let restoreSettings = defaultSettings[req.body.settings];


    if (restoreSettings) {
      res.send(restoreSettings);
    }
    else res.status(501).send();


  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});


router.post('/deleteCompanyInfo', async (req, res) => {
  try {

    if (!req.body.name) res.status(401).send();
    let companyNsp = decodeURIComponent(req.body.name);

    let deletedCompany = await Company.DeleteCompany(companyNsp);
    if (deletedCompany) {

      //delete all agents

      let deletedAgents = await Agents.DeleteAgentsByCompany(companyNsp);

      if (deletedAgents) res.send(deletedCompany);
      else res.status(501).send();
    }
    else res.status(501).send();


  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});


// router.post('/deactivateCompanyInfo', async (req, res) => {
//     try {

//         if (!req.body.name) res.status(401).send();


//         let companyNsp = decodeURIComponent(req.body.name);
//         let value = decodeURIComponent(req.body.value);
//         value = JSON.parse(value);
//         let MyNamespace = SocketListener.getSocketServer().of(companyNsp);
//         let deactivatedCompany;
//         deactivatedCompany = await Company.DeactivateCompany(companyNsp, value);

//         if (deactivatedCompany && value) {


//             const connectedNameSpaceSockets = Object.keys(MyNamespace.connected);

//             connectedNameSpaceSockets.forEach(socketId => {
//                 MyNamespace.connected[socketId].disconnect(true);
//             });

//             MyNamespace.removeAllListeners();

//             delete NameSpaces.NameSpaces[companyNsp];

//             if (deactivatedCompany) res.send(deactivatedCompany);
//             else res.status(501).send();
//         }
//         else if (deactivatedCompany && !value) {

//             NameSpaces.RegisterNameSpace({
//                 name: deactivatedCompany.value.name,
//                 rooms: deactivatedCompany.value.rooms,
//                 settings: deactivatedCompany.value.settings
//             })

//             res.send(deactivatedCompany);
//         }
//         else res.status(501).send();


//     } catch (error) {
//         console.log(error);
//         console.log('Error in Get Settings');
//         res.status(501).send();
//     }
// });

router.post('/deactivateCompanyInfo', async (req, res) => {
  try {

    if (!req.body.name) res.status(401).send();


    let companyNsp = decodeURIComponent(req.body.name);
    let value = decodeURIComponent(req.body.value);
    value = JSON.parse(value);
    let deactivatedCompany;
    deactivatedCompany = await Company.DeactivateCompany(companyNsp, value);

    if (deactivatedCompany) {

      if (deactivatedCompany) res.send(deactivatedCompany);
      else res.status(501).send();
    }

    else res.status(501).send();


  } catch (error) {
    console.log(error);
    console.log('Error in Deactivating Company');
    res.status(501).send();
  }
});

router.post('/authenticateAdmin/:csid?', async (req, res, next) => {
  //console.log(req.body)
  if (!req.body.csid) return res.send(401);
  if (!req.body.isAdmin) return res.send(401);

  // if (req.body.email != 'admin@beelinks.solutions') {
  //     return res.status(401).send({ status: 'incorrectcredintials' });
  // }
  else {
    let exisitingSession = await SessionManager.Exists(req.body.csid);
    if (exisitingSession) {
      if (exisitingSession.length > 0) {
        //Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
        res.status(200).send(exisitingSession[0].callingState);
      } else {
        res.status(401).send()
      }
    } else {
      undefined;
    }
  }
});

router.post('/logout/:csid?', async (req, res, next) => {
  // console.log('adminlogout');
  try {
    if (!req.body.csid) res.status(401).send();
    else {
      let exisitingSession = await SessionManager.Exists(req.body.csid);
      if (exisitingSession) {
        if (exisitingSession.length > 0) {
          // await agentSessions.InserAgentSession(exisitingSession[0], exisitingSession[0]._id);
          // exisitingSession[0].id = exisitingSession[0]._id;
          // exisitingSession[0]['ending_time'] = new Date().toISOString();
          // SessionManager.DisplaySessionList(exisitingSession[0]);
          await SessionManager.DeleteSession(req.body.csid);
          //Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, false);
          res.status(200).send({ logout: true });
        } else {
          res.status(200).send({ logout: true });
        }
      } else {
        // console.log('Exisiting Session NOt Found');
        res.status(401).send();
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Logout');
    res.status(401).send();
  }
});

router.post('/register', async (req, res) => {
  //console.log('registering');

  let clientIp = requestIp.getClientIp(req);

  // if (clientIp.slice(7) == machineIP) {

  let a = (new URL(req.body.company.company_info.company_website));

  if (!req.body.company) res.status(401).send();
  else {
    let exists = await Company.CheckCompany(req.body.company.company_info.company_website);
    let Agent_exists = await Agents.AgentExists(req.body.company.email);

    if (exists.length > 0 && Agent_exists) {
      res.status(406).send({ error: "CompanyAndAgentExists" })
    }
    else if (exists.length > 0 && !Agent_exists) {

      res.status(403).send({ error: "CompanyExists" })
    }
    else if (Agent_exists && !exists.length) {
      res.status(405).send({ error: "AgentExists" })
    }

    else if (req.body.company.verified) {


      if (req.body.company.mailingList) {
        await MailingList.addToMailingList(req.body.email);
      }

      let registered = await Company.RegisterCompany(req.body.company, true);
      if (registered && registered.insertedCount) {
        await __biZZC_SQS.SendMessage({
          action: 'sendAccAppEmail',
          to: req.body.email,
          action_url: 'https://beelinks.solutions/login'
        });

        res.status(200).send({ company: registered.ops[0] });

      } else {
        res.status(500).send();
      }
    }

    // else if (!req.body.company.verified && req.body.company && exists && !exists.length && !Agent_exists) {
    //     console.log("Unverified")
    //     //let encryptedID = Helper.encrypt(Company._id.toString());



    //     let SECRET="secret secret secret secret haaa";
    //     let IV="bbbbbbbbbbbbbbbb";

    //     let secret = Buffer.from(SECRET);
    //     let iv = Buffer.from(IV);
    //     let algorithm = 'aes-256-cbc';

    //     let cipher = crypto.createCipheriv(algorithm, secret, iv);
    //     console.log(cipher)
    //     let cid :ObjectId ;
    //     cid = await new ObjectId();
    //     console.log(cid);
    //     let encrypted = cipher.update(cid.toHexString());
    //     console.log(encrypted);
    //     encrypted = Buffer.concat([encrypted, cipher.final()]);
    //     console.log(encrypted)
    //     let encryptedID = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };


    //     console.log(encryptedID);

    //     let action_url = 'https://beelinks.solutions/verifyResellerProfile/' + encryptedID.encryptedData;
    //     console.log(action_url);

    //     let date: any = Date.parse(new Date().toISOString());
    //     date = new Date(new Date(date).setDate(new Date().getDate() + 1)).toISOString();
    //     // console.log(date);
    //     let socket = SocketListener.getSocketServer();
    //     let token: Tokens = {
    //         id: encryptedID.encryptedData,
    //         email: req.body.email,
    //         expireDate: new Date(date).toISOString(),
    //         type: 'forget_password'
    //     }

    //     let profileCreated = await Tokens.inserToken(token);
    //     res.status(200).send('Successfull');


    // }
    else res.status(401).send();

  }
  //   }
  //  else {
  //   res.status(401).send();
  // }

});

export const adminRoutes: express.Router = router;