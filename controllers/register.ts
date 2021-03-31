
// Created By Saad Ismail Shaikh
// Date : 12-4-18

import * as express from "express";
import { Company } from "../models/companyModel";
import { Agents } from "../models/agentModel";
import { machineIP, WEBSITEURL } from '../globals/config/constants';
import { MailingList } from "../models/mailingListModel";
import { Reseller } from "../models/resellerModel";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";

const requestIp = require('request-ip');


//Load The Model For The First Time
// if (!Agents.initialized) {
//     Agents.Initialize();
// }

let router = express.Router();

router.get('/verifyProfile/:id', async (req, res) => {


  try {

    console.log('Verifying Profile');
    if (!req.params.id) res.status(401).send();

    else {

      let tempProfile = await Company.GetTempProfile(req.params.id);
      if (tempProfile && tempProfile.length) {
        let Exists = await Company.CheckCompany(tempProfile[0].company_info.company_website);
        let Agent_exists = await Agents.AgentExists(tempProfile[0].agent.email);
        if (Exists.length > 0 && Agent_exists) {
          console.log('Both Exists');
          // res.redirect(((process.env.NODE_ENV == 'production') ? 'https://beelinks.solutions' : 'http://localhost:8006') + '/rerror')
          res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror')
        }
        else if (Exists.length > 0 && !Agent_exists) {
          console.log('Company Exists');
          // console.log(Exists);
          // res.status(403).send({ error: "CompanyExists" })
          res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror');
          // if (process.env.NODE_ENV == 'production') {
          //   res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror');
          // } else {
          //   res.redirect('http://localhost:8006/rerror');
          // }
        }
        else if (Agent_exists && !Exists.length) {
          // res.status(405).send({ error: "AgentExists" })
          console.log('Agent Exists');
          res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror');
          // if (process.env.NODE_ENV == 'production') {
          //   res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror');
          // } else {
          //   res.redirect('http://localhost:8006/rerror');
          // }
        }
        else {
          console.log('Company Registering');

          let registered = await Company.RegisterCompanyNew(tempProfile[0]);
          if (registered && registered.insertedCount) {
            await __biZZC_SQS.SendMessage({
              action: 'sendAccAppEmail',
              to: tempProfile[0].email,
              action_url: WEBSITEURL + '/login'
            });
            res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/welcome');
            // if (process.env.NODE_ENV == 'production') {
            //   // res.redirect('https://beelinks.solutions/welcome');
            //   res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/welcome');
            // } else {
            //   res.redirect('http://localhost:8006/welcome');
            // }
          } else res.status(500).send();

        }
      } else {
        //TEmp Profile Deleted

        res.redirect(((WEBSITEURL) ? WEBSITEURL : 'http://localhost:8006') + '/rerror');
        // if (process.env.NODE_ENV == 'production') {
        //   res.redirect('https://beelinks.solutions/rerror');
        // } else {
        //   res.redirect('http://localhost:8006/rerror');
        // }
      }

    }

  } catch (error) {
    console.log(error);
    console.log('error in registering company unverified');
    res.status(500).send();
  }

});

router.post('/companyUV/', async (req, res) => {

  try {

    console.log('registering');


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
    if (!req.body.companyprofile) res.status(401).send();

    else {

      let Exists = await Company.CheckCompany(req.body.companyprofile.company_info.company_website);
      let Agent_exists = await Agents.AgentExists(req.body.companyprofile.email);
      if (Exists.length > 0 && Agent_exists) {
        res.status(406).send({ error: "CompanyAndAgentExists" })
      }
      else if (Exists.length > 0 && !Agent_exists) {
        // console.log('Exists');
        // console.log(Exists);
        res.status(403).send({ error: "CompanyExists" })
      }
      else if (Agent_exists && !Exists.length) {
        res.status(405).send({ error: "AgentExists" })
      }
      else {
        let pkg = await Company.GetSubscription(req.body.companyprofile.packageName);
        if (pkg && pkg.length) {

          let registered = await Company.RegisterCompanyUnverified(req.body.companyprofile, pkg[0].details);
          if (registered && registered.insertedCount) {

            if (req.body.addToMailingList) await MailingList.addToMailingList(req.body.companyprofile.email);

            await __biZZC_SQS.SendMessage({
              action: 'sendEmailVerificationLink',
              email: req.body.companyprofile.email,
              url: WEBSITEURL + '/register/verifyProfile/' + registered.insertedId,
            });
            res.status(200).send('Successfull');

          } else res.status(500).send();

        } else res.status(405).send({ error: "Invalid Package" })

      }
    }

  } catch (error) {
    console.log(error);
    console.log('error in registering company unverified');
    res.status(500).send();
  }


});

router.post('/initialize/', async (req, res) => {
  console.log('initialize');


  /*----------------------------------------------------------------------|
    |Note : Status Custom Coded To Invalidate Request At Client Side      |
    | 403 = Forbidden Company Exists                                      |
    | 401 = Any Error Maybe Databse ReadWrite or Unauthenticated Request  |
    |---------------------------------------------------------------------|*/



  let clientIp = requestIp.getClientIp(req);
  if (clientIp.slice(7) == machineIP) {
    if (!req.body) res.status(401).send();
    else {

      console.log('machine vaidated');

      let registered = await Company.RegisterCompany(req.body.company);

      if (req.body.mailingList) {
        await MailingList.addToMailingList(req.body.email);
      }

      // console.log('registered');
      // console.log(registered);
      if (registered && registered.insertedCount) {


        await __biZZC_SQS.SendMessage({
          action: 'sendAccAppEmail',
          to: req.body.email,
          action_url: 'https://beelinks.solutions/login'
        });
        res.status(200).send('Successfull');


      } else {
        res.status(500).send();
      }

    }
  } else {
    res.status(401).send();
  }

});


//for account Approval
router.post('/reseller/', async (req, res) => {
  // console.log('registering');
  // console.log(req.body)
  /*----------------------------------------------------------------------|
    |Note : Status Custom Coded To Invalidate Request At Client Side      |
    | 403 = Forbidden Company Exists                                      |
    | 401 = Any Error Maybe Databse ReadWrite or Unauthenticated Request  |
    |---------------------------------------------------------------------|*/
  let clientIp = requestIp.getClientIp(req);
  if (!req.body.reseller) res.status(401).send();

  else {
    // console.log(req.body.reseller)


    let Exists = await Reseller.CheckReseller(req.body.reseller.personalInfo.email);

    if (Exists && Exists.length > 0) {
      res.status(403).send({ error: "ResellerExists" })
    }
    else {
      res.status(200).send('Successfull');
    }
  }
});

//for Registering

router.post('/resellerInitialize/', async (req, res) => {
  // console.log('registering');

  // if (clientIp.slice(7) == machineIP) {

  if (!req.body.reseller) res.status(401).send();
  else {
    let Exists = await Reseller.CheckReseller(req.body.reseller.personalInfo.email);

    if (Exists && Exists.length > 0) {
      res.status(403).send({ error: "ResellerExists" })
    }
    else {

      let registered = await Reseller.RegisterReseller(req.body.reseller);

      if (registered && registered.insertedCount) {

        // console.log("registerd")
        await __biZZC_SQS.SendMessage({
          action: 'sendAccAppEmail',
          to: req.body.email,
          action_url: 'https://beelinks.solutions/login'
        });
        res.status(200).send('Successfull');

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


//   /*----------------------------------------------------------------------|
//     |Note : Status Custom Coded To Invalidate Request At Client Side      |
//     | 403 = Forbidden Company Exists                                      |
//     | 401 = Any Error Maybe Databse ReadWrite or Unauthenticated Request  |
//     |---------------------------------------------------------------------|*/

router.post('/resetPassword/', async (req, res) => {
  // console.log('resetPassword');
  let clientIp = requestIp.getClientIp(req);
  if (clientIp.slice(7) == machineIP) {
    if (!req.body.email || !req.body.password) res.status(401).send();
    else {
      let agent = await Agents.ChangePassword(req.body.password, req.body.email);
      // console.log('password changed');
      // console.log(agent);
      if (agent) {
        res.status(200).send('Successfull');
      } else {
        res.status(500).send();
      }

    }
  } else {
    res.status(401).send();
  }

});



router.post('/validateURL/', async (req, res) => {
  try {
    // console.log('Validate url');
    if (!req.body.url) res.status(401).send({ error: "exists" });
    else {
      let Exists = await Company.CheckCompany(req.body.url);

      if (Exists.length > 0) res.status(401).send({ error: "exists" });
      else res.status(200).send({ status: "Ok" });
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Register Validate');
  }

});

router.post('/updateCompany/', async (req, res) => {
  console.log('updating');

  /*----------------------------------------------------------------------|
    |Note : Status Custom Coded To Invalidate Request At Client Side      |
    | 403 = Forbidden Company Exists                                      |
    | 401 = Any Error Maybe Databse ReadWrite or Unauthenticated Request  |
    |---------------------------------------------------------------------|*/
  let clientIp = requestIp.getClientIp(req);
  if (clientIp.slice(7) == machineIP) {
    if (!req.body) res.status(401).send();
    else {
      let exists = await Company.CheckCompany(req.body.company_info.company_website);
      if (exists && exists.length) {
        res.status(200).send('Successfull');
      } else {
        let updated = await Company.UpdateCompany(req.body);

        // if (updated && updated.insertedCount) {

        // } else {
        //   res.status(500).send();
        // }
      }


    }
  } else {
    res.status(401).send();
  }

});






export const registerRoutes: express.Router = router;