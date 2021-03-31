import * as express from "express";
import * as path from 'path';

import { Agents } from "../models/agentModel";
import { Reseller } from "../models/resellerModel";
import { SessionManager } from '../globals/server/sessionsManager';
import { Tokens } from "../models/tokensModel";
import { encrypt } from '../globals/config/constants';
const requestIp = require('request-ip');
const { URL } = require('url');
import { defaultSettings } from "../globals/config/constants";
import { MailingList } from "../models/mailingListModel";
import { ResellerSessionSchema } from "../schemas/resellerSessionSchema";
import { Company } from "../models/companyModel";
import { Headers } from "request";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
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

router.use(async (req, res, next) => {
  if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
    // console.log('refferer', req.headers.referer);
    // console.log('req URL', req.url);

    next();
  } else {
    console.log('refferer', req.headers.referer);
    console.log('req URL', req.url);

    res.status(401).send({ err: 'unauthorized' });
  }
})

router.post('/getResellerAdmin', async (req, res, next) => {
  // console.log(req.body);


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

  //if (req.body.email == 'admin@beelinks.solutions' && req.body.password == '12345678') {
  try {
    let reseller = await Reseller.AuthenticateReseller(req.body.email, req.body.password);
    // console.log(reseller);
    if (reseller) {

      //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
      //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
      let exists = await SessionManager.GetLiveResellerSessionFromDatabase(req.body.email);
      //console.log(exists);
      if (reseller.length && exists.length) {

        //console.log('Returning Existing sessions');
        reseller[0].csid = exists[0]._id
        //Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
        res.send(reseller);

      }
      //End (Multiple Login Case)
      else if (reseller.length && !(exists.length)) {

        let Reseller: ResellerSessionSchema = {
          socketID: [],
          createdDate: new Date().toISOString(),
          personalInfo: reseller[0].personalInfo,
          type: 'Reseller',
          isReseller: true,
          date: new Date().toISOString(),
          bank: reseller[0].bank

        }


        // console.log('Before Inserting Session');
        // console.log(!!exists.length);
        let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Reseller)), true);
        // console.log(insertedSession)
        if (insertedSession) {
          reseller[0].csid = insertedSession.ops[0]._id
          reseller[0].isReseller = true;

          //Contacts.updateStatus(Agent.email, Agent.nsp, true);
        } else {
          res.status(501).send();
        }
        res.send(reseller);
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
  // }
  // else {
  //     return res.status(401).send({ status: 'incorrectcredintials' });
  // }

});


// router.post('/getSettings', async (req, res) => {
//     try {
//         if (!req.body.email) res.status(401).send();
//         if (req.body.email == 'admin@beelinks.solutions') {



//             if (req.body.nsp) {
//                 let AgentsettingsPromise = Agents.getSetting(req.body.email) as any;
//                 let companySettingsPromise = Company.GetVerificationStatus(req.body.nsp) as any;

//                 let resolvedPromises = await Promise.all([AgentsettingsPromise, companySettingsPromise]);
//                 let agentSettings = resolvedPromises[0];
//                 let companySettings = resolvedPromises[1];

//                 if (agentSettings && agentSettings.length > 0 && companySettings && companySettings.length > 0) {
//                     if (agentSettings[0].automatedMessages == undefined) {
//                         agentSettings[0].automatedMessages = [];
//                     }

//                     if (companySettings[0]) {
//                         agentSettings[0].verified = companySettings[0].settings.verified;
//                         agentSettings[0].createdAt = companySettings[0].createdAt;
//                         agentSettings[0].expiry = companySettings[0].expiry;
//                     }


//                     res.json(agentSettings[0]);
//                 } else {
//                     res.send({});
//                 }
//             }
//         }
//         else return res.status(401).send({ status: 'incorrectcredintials' });
//     } catch (error) {
//         console.log(error);
//         console.log('Error in Get Settings');
//         res.status(501).send();

//     }
//     });


router.post('/getResellers', async (req, res) => {
  try {



    if (!req.body.email) res.status(401).send();
    let resellerAdmin = decodeURIComponent(req.body.email)
    let Resellers = await Reseller.GetResellers();
    if (Resellers && Resellers.length) {
      res.send(Resellers);
    }
    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Resellers');
    res.status(501).send();
  }
});

router.post('/verifyReseller', async (req, res) => {
  try {
    if (!req.body.email) res.status(401).send();
    let email = decodeURIComponent(req.body.email);
    let value = decodeURIComponent(req.body.value);
    let admin = decodeURIComponent(req.body.admin);
    value = JSON.parse(value);
    // console.log(email);
    // console.log(value);
    // console.log(admin);


    let Resellers = await Reseller.VerifyReseller(email, value, admin);
    if (Resellers) {
      //res.status(200).send();
      res.send(Resellers);
    }
    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Resellers');
    res.status(501).send();
  }
});


router.post('/getResellerInfo', async (req, res) => {
  try {

    if (!req.body.email) res.status(401).send();
    let email = decodeURIComponent(req.body.email)

    let agents = await Agents.getAllAgents(email);
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
    // console.log(req.body)
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
    // console.log(req.body.company.nsp)
    let origin = await Company.getSettings(req.body.company.nsp);

    if (!req.body.company) res.status(401).send();


    if (req.body.company.mailingListCheck) {
      await MailingList.addToMailingList(req.body.company.email);
    }
    let updatedCompany = await Company.UpdateCompany(req.body.company);
    if (updatedCompany) {

      origin[0]['settings'] = updatedCompany.value.settings;
      // console.log(origin['settings']);
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


router.post('/authenticateReseller/:csid?', async (req, res, next) => {



  if (!req.body.csid) return res.send(401);
  if (!req.body.isReseller) return res.send(401);

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

router.post('/registerCompany', async (req, res) => {
  console.log('registering');

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

    else {
      let registered = await Company.RegisterCompany(req.body.company, true);

      if (req.body.company.mailingListCheck) {
        await MailingList.addToMailingList(req.body.email);
      }


      if (registered && registered.insertedCount) {

        // console.log(registered.ops[0].name);
        let UpdatedReseller = await Reseller.UpdateResellerCompanies(registered.ops[0].name, registered.ops[0].createdBy.email);

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

  }
  //   }
  //  else {
  //   res.status(401).send();
  // }

});

router.post('/deactivateCompanyInfo', async (req, res) => {
  try {

    // console.log(req.body);
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



//forgot password request
router.post('/resetpswd', async (req, res) => {
  try {

    // console.log(req.body.email);

    if (!req.body.email) return res.status(403).send({ status: 'error' });
    else {
      if (await Reseller.ResellerExists(req.body.email)) {
        let date: any = Date.parse(new Date().toISOString());
        date = new Date(new Date(date).setDate(new Date().getDate() + 1)).toISOString();
        // console.log(date);
        let token: Tokens = {
          id: encrypt(date),
          email: req.body.email,
          expireDate: new Date(date).toISOString(),
          type: 'forget_password',
          isReseller: true
        }
        Tokens.inserToken(token);
        // console.log(token);

        res.status(200).send({ status: 'successfull' });

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

//recover password page request
router.get('/reset/:token/:email', async (req, res) => {

  // console.log(req.params);
  if (!req.params.token || !req.params.email) return res.status(404).send({ status: 'error' })
  else {
    try {
      let validated = await Tokens.validateResellerToken(req.params.token);
      if (validated) {
        res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/recover-resellerPassword.html'));
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


//For Successful Reset confirmation
router.post('/resetpswd/:password/:email', async (req, res) => {
  // console.log(req.body);

  // console.log('/resetpswd/:password/:email')
  // console.log("req.body");
  // console.log(req.body);
  if (!req.body.password || !req.body.email || !req.body.token) return res.status(401).send({ status: 'error' });
  let verified = await Tokens.VerifyResellerToken(req.body.token, req.body.email);
  console.log('verified')
  console.log(verified)
  if (verified && verified.length) {
    let changed = await Reseller.ChangePassword(req.body.password, req.body.email);
    console.log(changed);


    res.status(200).send({ status: 'ok' });
  } else {
    res.status(401).send({ status: 'invalidInput' });
  }

})




router.post('/getCompanies', async (req, res) => {
  try {
    console.log('getCompanies');


    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.body.email) res.status(401).send();
    let email = decodeURIComponent(req.body.email)

    console.log('email');


    let user = await Reseller.GetResellerByEmail(email);
    console.log(user)
    if (user && user.length) {
      let companies = await Reseller.GetCompaniesByResellerEmail(user[0]);

      console.log(companies);

      if (companies && companies.length) {
        res.send(companies);
      }
      else res.status(501).send();
    }
    else res.status(501).send();

  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});


router.post('/updateResellerCompanyInfo', async (req, res) => {
  try {
    //let origin: SocketIO.Namespace = (SocketListener.socketIO as SocketIO.Server).of(namespace.name);

    console.log("req.body.company")
    console.log(req.body.company)
    let origin = Company.getSettings(req.body.company.nsp);

    if (!req.body.company) res.status(401).send();


    if (req.body.company.mailingListCheck) {
      await MailingList.addToMailingList(req.body.company.email);
    }
    let updatedCompany = await Company.UpdateCompany(req.body.company);
    console.log(updatedCompany);

    if (updatedCompany) {

      origin[0]['settings'] = updatedCompany.value.settings;
      //console.log(origin['settings']);
      res.send(updatedCompany);
    }
    else res.status(501).send();


  } catch (error) {
    console.log(error);
    console.log('Error in Get Settings');
    res.status(501).send();
  }
});

export const resellerRoutes: express.Router = router;