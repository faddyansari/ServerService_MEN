
//Created By Saad Ismail Shaikh
//Date : 19-1-2018


//Express Module Reference
import * as express from 'express';
import * as requestIp from 'request-ip';
// Path Object to Define "Default/Static/Generic" Routes
import * as path from "path";
import { Company } from '../../models/companyModel';
import { Assets, ARCHIVINGQUEUE } from '../config/constants';
import { SessionManager } from '../server/sessionsManager';
import { VisitorSessionSchema } from '../../schemas/VisitorSessionSchema';
import { Agents } from '../../models/agentModel';
import { Referer } from '../../schemas/reportsSchema';
import { iceServersModel } from '../../models/iceServersModel';
import { Visitor } from '../../models/visitorModel';
import { ContactSessionManager } from '../server/contactSessionsManager';
import { ContactSessionSchema } from '../../schemas/contactSessionSchema';
import { MakeActive } from '../../actions/GlobalActions/CheckActive';
import { rand } from "../../globals/config/constants";
import { Tickets } from '../../models/ticketsModel';
import { TicketSchema } from '../../schemas/ticketSchema';
import { TicketDispatcher } from '../../actions/TicketAbstractions/TicketDispatcher';
import { __BIZZC_REDIS } from '../__biZZCMiddleWare';
import { __biZZC_SQS } from '../../actions/aws/aws-sqs';
import { EventLogMessages } from './enums';
import { WorkerManager } from '../server/WorkersManager';
import { Conversations } from '../../models/conversationModel';
import { ObjectID } from 'mongodb';
import { Contacts } from '../../models/contactModel';
import { TicketGroupsModel } from '../../models/TicketgroupModel';
import { AgentSessionSchema } from '../../schemas/agentSessionSchema';
import { TeamsModel } from '../../models/teamsModel';
import { ReportsModel } from '../../models/reportsModel';
import { SQSPacket } from '../../schemas/sqsPacketSchema';


//import * as request from 'request-promise';
//import { Headers } from 'request';
//const requestIp = require('request-ip');


const { URL } = require('url');

const allowedReferers = [
  { referer: 'hrm.sbtjapan.com', nsp: '/hrm.sbtjapan.com' }
]

// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.

//Router Object Which Will be used to validate requests in Request Handler.
var router: express.Router = express.Router();

const publicPath = path.resolve(__dirname + '/../../');

const AngularRoutes = [
  '/login',
  '/home',
  '/chats',
  '/tags',
  '/tickets',
  '/ticket-view',
  '/visitors',
  '/agents',
  '/reports',
  '/installation',
  '/pre-chat-survey',
  '/register',
  '/post-chat-survey',
  '/queued-visitors',
  '/theme',
  '/canned-responses',
  '/keyboard-shortcuts',
  '/settings',
  '/ticket-survey',
]

router.get('/signup/signUpFrame', (req, res) => {

  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", 'https://beelinks.solutions');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Connection', 'keep-alive');
    res.header('Content-Length', '0');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
  }
  res.sendFile(publicPath + '/public/dist/signUpFrame.html');


});

router.get('/login/getFrame', (req, res) => {

  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", 'https://beelinks.solutions');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Connection', 'keep-alive');
    res.header('Content-Length', '0');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
  }
  res.sendFile(publicPath + '/public/dist/loginFrame.html');


});

router.get('/signupReseller/signUpResellerFrame', (req, res) => {

  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", 'https://beelinks.solutions');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Connection', 'keep-alive');
    res.header('Content-Length', '0');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
  }

  res.sendFile(publicPath + '/public/dist/signUpResellerFrame.html');


});

router.get('/adminSignUp/adminSignupframe', (req, res) => {

  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", 'https://beelinks.solutions');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Connection', 'keep-alive');
    res.header('Content-Length', '0');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
  }

  res.sendFile(publicPath + '/public/dist/signUpResellerFrame.html');


});


//Default Home Pages Routes of Application.
router.get('/', (req, res) => {

  res.sendFile(publicPath + '/public/dist/index.html');

});


router.get(AngularRoutes, (req, res) => {
  res.sendFile(publicPath + '/public/dist/index.html');
});


router.get('/js/*', (req, res) => {
  res.sendFile(publicPath + '/public/dist/' + path.basename(req.path));
  // console.log('caught');
});


//NEW ROUTES ADDED TO OPTIMIZE BUILD
router.get('/css/*', (req, res) => {
  res.sendFile(publicPath + '/public/dist/' + path.basename(req.path));
});


router.get('/assets/ccss/*', (req, res) => {
  res.sendFile(publicPath + '/public/static' + path.dirname(req.path) + "/" + path.basename(req.path));
});

router.get('/assets/packages/*', (req, res) => {
  //console.log(publicPath + '/public/static' + path.dirname(req.path) +  "/" + path.basename(req.path));
  res.sendFile(publicPath + '/public/static' + path.dirname(req.path) + "/" + path.basename(req.path));
});

router.get('/assets/img/backgrounds/*', (req, res) => {
  //console.log(publicPath + '/public/dist/assets/img/backgrounds/' + path.basename(req.path));
  res.sendFile(publicPath + '/public/dist/assets/img/backgrounds/' + path.basename(req.path));
});





router.get('/assets/img/icons/*', (req, res) => {
  //console.log(publicPath + '/public/dist/assets/img/icons/' + path.basename(req.path));
  res.sendFile(publicPath + '/public/dist/assets/img/icons/' + path.basename(req.path));
});

router.get('/assets/img/*', (req, res) => {
  // console.log(publicPath + '/public/dist/assets/img/' + path.basename(req.path));
  res.sendFile(publicPath + '/public/dist/assets/img/' + path.basename(req.path));
});

router.get('/img/*', (req, res) => {
  // console.log(publicPath + '/public/dist/assets/' + req.path);
  res.sendFile(publicPath + '/public/dist/assets/' + req.path);
});

router.get('/images/*', (req, res) => {
  res.sendFile(publicPath + '/public/static/assets/images/' + path.basename(req.path));
});

router.get('/fonts/*', (req, res) => {
  res.sendFile(publicPath + '/public/static/assets/fonts/' + path.basename(req.path));
});


// router.get('/loadscript/:license?/:url?/:sid?', async (req, res) => {
//   try {

//     // console.log('loadscript');

//     //TODO : Re-Active if Session was Inactive

//     if (!req.params.license || !req.params.url) res.status(401).send();

//     else {

//       //Impemented After CloudFront
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//       res.header('Expires', '-1');
//       res.header('Pragma', 'no-cache');
//       // let clientIp = requestIp.getClientIp(req);
//       // let ip;
//       // if (req.headers['x-forwarded-for']) {
//       //     console.log('xforwarded for');

//       //     ip = (req.headers['x-forwarded-for'] as Headers).split(",")[0];

//       // } else if (req.connection && req.connection.remoteAddress) {

//       //     console.log('req.connection.remoteAddress');
//       //     ip = req.connection.remoteAddress;

//       //     ip = req.ip;

//       // }
//       // console.log(ip);
//       // console.log(clientIp);


//       // let ip = (req.connection.remoteAddress || req.socket.remoteAddress || req.ip);


//       // https://extreme-ip-lookup.com/json/?key=lI5wJac2GM614TMH80gr
//       // https://extreme-ip-lookup.com/json/125.209.124.210?key=lI5wJac2GM614TMH80gr
//       // https://extreme-ip-lookup.com/json/?callback=getIP&key=lI5wJac2GM614TMH80gr
//       // https://extreme-ip-lookup.com/json/125.209.124.210?callback=getIP&key=lI5wJac2GM614TMH80gr
//       // https://extreme-ip-lookup.com/csv/?key=lI5wJac2GM614TMH80gr
//       // https://extreme-ip-lookup.com/csv/125.209.124.210?key=lI5wJac2GM614TMH80gr


//       // await request.get("https://extreme-ip-lookup.com/json/" + ((process.env.NODE_ENV == 'production') ? ip : '125.209.124.210') + "?callback=getIP&key=lI5wJac2GM614TMH80gr").then((response) => {
//       //     console.log(response);
//       // });


//       let temp = await Company.verifylicense(req.params.license);
//       // console.log('get company');

//       let session = await SessionManager.ExistandUpdate(req.params.sid, req.headers.referer as string);
//       //let temp = await companypromise;

//       // console.log(temp[0].settings);
//       // console.log(temp[0].deactivated);

//       //let session = await sessionpromise;
//       // console.log(session)
//       let url1;
//       let url2;
//       // console.log(temp[0].settings.displaySettings.settings.chatwindow.feedbackFrom);
//       // console.log(req.params);
//       // console.log(req.headers.referer);

//       // console.log('Before Temp');
//       if (temp && temp.length) {
//         // console.log('in Temp');
//         if (temp[0].deactivated) { res.status(401).send(); return; }

//         let packg = temp[0].package;
//         // console.log(packg);

//         if (packg && packg.visitors.quota != -1) {
//           let totalVisitors = await SessionManager.GetVisitorsCount(temp[0].name);

//           // console.log('totalVisitors');
//           // if (totalVisitors) console.log(totalVisitors);
//           // if (session && session.value) console.log('session exists');
//           if (!session || (session && !session.value)) {
//             if (totalVisitors && totalVisitors.length && packg.visitors.quota && totalVisitors[0].count >= packg.visitors.quota) {
//               console.log('limit Exceeded for visiotrs quota');
//               res.status(401).send(); return;
//             }
//           }
//         }
//         let referer: Referer = {
//           date: new Date(),
//           nsp: temp[0].name,
//           urls: [{ url: req.headers.referer as string, count: 1 }]
//         }
//         // console.log(topVisitedLink);
//         // await ReportsModel.InsertOrUpdateTopVisitedLink(referer);
//         url1 = new URL(temp[0].company_info.company_website).hostname;

//         // console.log(url1);


//         (req.params.url.indexOf('localhost') != -1 || req.params.url.indexOf('192.168') != -1)
//           ? url2 = 'localhost.com' : url2 = (req.params.url).replace(/(www\.)?/ig, '')

//         // console.log(url2);


//         if ((url1 == url2) || (req.params.url.indexOf('websiteqa') != -1)) {
//           //#region Setting CORS headers
//           if (req.headers.origin) {
//             res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
//             res.header("Access-Control-Allow-Headers", "content-type");
//             res.header('Access-Control-Allow-Methods', 'GET');
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.header('Vary', 'Origin, Access-Control-Request-Headers');
//           }
//         }


//         let banned = false;


//         if (session && session.value) {
//           // console.log('session.inactive');
//           // console.log(session.value.inactive);

//           let bannedVisitor = await Visitor.GetBannedVisitorByDeviceID(session.value.deviceID)
//           if (bannedVisitor && bannedVisitor.length) {
//             // console.log(' visitor banned');
//             // console.log(bannedVisitor);

//             { res.status(401).send(); return; }
//           }
//           else if (session.value.inactive) await MakeActive(session.value as VisitorSessionSchema);


//         }
//         //#endregion
//         res.status(200).send({
//           nsp: temp[0].name,
//           fileShare: temp[0].settings.chatSettings.permissions.forVisitors,
//           showchathistory: temp[0].settings.chatSettings.permissions.showRecentChats,
//           chatAsGuest: temp[0].settings.chatSettings.permissions.chatAsGuest,
//           invitationChatInitiations: temp[0].settings.chatSettings.permissions.invitationChatInitiations,
//           allowedCall: temp[0].settings.callSettings.permissions.v2a,
//           allowedNews: temp[0].settings.widgetMarketingSettings.permissions.news,
//           allowedPromotions: temp[0].settings.widgetMarketingSettings.permissions.promotions,
//           allowedFaqs: temp[0].settings.widgetMarketingSettings.permissions.faqs,
//           allowedAgentAvailable: temp[0].settings.ticketSettings.allowedAgentAvailable,
//           barEnabled: temp[0].settings.displaySettings.barEnabled,
//           avatarColor: temp[0].settings.displaySettings.avatarColor,
//           settings: (temp[0].settings.displaySettings.barEnabled) ? temp[0].settings.displaySettings.settings.chatbar : temp[0].settings.displaySettings.settings.chatbubble,
//           cwSettings: temp[0].settings.displaySettings.settings.chatwindow,
//           userScript: temp[0].settings.customScript.userFetching,
//           exists: (session && session.value) ? true : false,
//           extendedSettings: temp[0].settings.displaySettings,
//           customFields: temp[0].settings.schemas.chats.fields,
//           session: (session && session.value) ? {
//             csid: session.value._id,
//             state: session.value.state,
//             agent: session.value.agent,
//             cid: session.value.conversationID,
//             username: session.value.username,
//             email: session.value.email,
//             nsp: session.value.nsp,
//             newUser: false,
//             _id: session.value._id,
//             id: session.value._id,
//             deviceID: session.value.deviceID,
//             isMobile: session.value.isMobile,
//           } : undefined
//         });
//       }
//       else res.status(401).send();
//     }
//   } catch (error) {
//     console.log('Error in Loading Script');
//     console.log(error);
//     res.status(401).send();

//   }

// });


//new with device ID
router.get('/loadscript/:license?/:url?/:sid?/:deviceID?', async (req, res) => {
  try {

    // console.log('loadscript');

    //TODO : Re-Active if Session was Inactive

    if (!req.params.license || !req.params.url) res.status(401).send();

    else {

      //Impemented After CloudFront
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      // let clientIp = requestIp.getClientIp(req);
      // let ip;
      // if (req.headers['x-forwarded-for']) {
      //     console.log('xforwarded for');

      //     ip = (req.headers['x-forwarded-for'] as Headers).split(",")[0];

      // } else if (req.connection && req.connection.remoteAddress) {

      //     console.log('req.connection.remoteAddress');
      //     ip = req.connection.remoteAddress;

      //     ip = req.ip;

      // }
      // console.log(ip);
      // console.log(clientIp);


      // let ip = (req.connection.remoteAddress || req.socket.remoteAddress || req.ip);


      // https://extreme-ip-lookup.com/json/?key=lI5wJac2GM614TMH80gr
      // https://extreme-ip-lookup.com/json/125.209.124.210?key=lI5wJac2GM614TMH80gr
      // https://extreme-ip-lookup.com/json/?callback=getIP&key=lI5wJac2GM614TMH80gr
      // https://extreme-ip-lookup.com/json/125.209.124.210?callback=getIP&key=lI5wJac2GM614TMH80gr
      // https://extreme-ip-lookup.com/csv/?key=lI5wJac2GM614TMH80gr
      // https://extreme-ip-lookup.com/csv/125.209.124.210?key=lI5wJac2GM614TMH80gr


      // await request.get("https://extreme-ip-lookup.com/json/" + ((process.env.NODE_ENV == 'production') ? ip : '125.209.124.210') + "?callback=getIP&key=lI5wJac2GM614TMH80gr").then((response) => {
      //     console.log(response);
      // });



      let temp = await Company.verifylicense(req.params.license);

      let bannedVisitor;
      if (req.params.deviceID) bannedVisitor = await Visitor.GetBannedVisitorByDeviceID(temp[0].name, req.params.deviceID)
      // console.log('visitor banned');
      // console.log(bannedVisitor);
      if (bannedVisitor && bannedVisitor.length) {

        { res.status(401).send(); return; }
      }
      // console.log('get company');

      let session = await SessionManager.ExistandUpdate(req.params.sid, req.headers.referer as string);
      //let temp = await companypromise;

      // console.log(temp[0].settings);
      // console.log(temp[0].deactivated);

      //let session = await sessionpromise;
      // console.log(session)
      let url1;
      let url2;
      // console.log(temp[0].settings.displaySettings.settings.chatwindow.feedbackFrom);
      // console.log(req.params);
      // console.log(req.headers.referer);

      // console.log('Before Temp');
      if (temp && temp.length) {
        // console.log('in Temp');
        if (temp[0].deactivated) { res.status(401).send(); return; }

        let packg = temp[0].package;
        // console.log(packg);

        if (packg && packg.visitors.quota != -1) {
          let totalVisitors = await SessionManager.GetVisitorsCount(temp[0].name);

          // console.log('totalVisitors');
          // if (totalVisitors) console.log(totalVisitors);
          // if (session && session.value) console.log('session exists');
          if (!session || (session && !session.value)) {
            if (totalVisitors && totalVisitors.length && packg.visitors.quota && totalVisitors[0].count >= packg.visitors.quota) {
              console.log('limit Exceeded for visiotrs quota');
              res.status(401).send(); return;
            }
          }
        }
        let referer: Referer = {
          date: new Date(),
          nsp: temp[0].name,
          urls: [{ url: req.headers.referer as string, count: 1 }]
        }
        // console.log(topVisitedLink);
        // await ReportsModel.InsertOrUpdateTopVisitedLink(referer);
        url1 = new URL(temp[0].company_info.company_website).hostname;

        // console.log(url1);


        (req.params.url.indexOf('localhost') != -1 || req.params.url.indexOf('192.168') != -1)
          ? url2 = 'localhost.com' : url2 = (req.params.url).replace(/(www\.)?/ig, '')

        // console.log(url2);


        if ((url1 == url2) || (req.params.url.indexOf('websiteqa') != -1)) {
          //#region Setting CORS headers
          if (req.headers.origin) {
            res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
            res.header("Access-Control-Allow-Headers", "content-type");
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Vary', 'Origin, Access-Control-Request-Headers');
          }
        }


        let banned = false;


        if (session && session.value) {
          // console.log('session.inactive');
          // console.log(session.value.inactive);

          // let bannedVisitor = await Visitor.GetBannedVisitorByDeviceID(temp[0].name, req.params.deviceID)
          // console.log('visitor banned');
          // console.log(bannedVisitor);
          // if (bannedVisitor && bannedVisitor.length) {

          //   { res.status(401).send(); return; }
          // }
          // else
          if (session.value.inactive) await MakeActive(session.value as VisitorSessionSchema);


        }
        //#endregion
        res.status(200).send({
          nsp: temp[0].name,
          fileShare: temp[0].settings.chatSettings.permissions.forVisitors,
          showchathistory: temp[0].settings.chatSettings.permissions.showRecentChats,
          chatAsGuest: temp[0].settings.chatSettings.permissions.chatAsGuest,
          invitationChatInitiations: temp[0].settings.chatSettings.permissions.invitationChatInitiations,
          allowedCall: temp[0].settings.callSettings.permissions.v2a,
          allowedNews: temp[0].settings.widgetMarketingSettings.permissions.news,
          allowedPromotions: temp[0].settings.widgetMarketingSettings.permissions.promotions,
          allowedFaqs: temp[0].settings.widgetMarketingSettings.permissions.faqs,
          allowedAgentAvailable: temp[0].settings.ticketSettings.allowedAgentAvailable,
          barEnabled: temp[0].settings.displaySettings.barEnabled,
          avatarColor: temp[0].settings.displaySettings.avatarColor,
          settings: (temp[0].settings.displaySettings.barEnabled) ? temp[0].settings.displaySettings.settings.chatbar : temp[0].settings.displaySettings.settings.chatbubble,
          cwSettings: temp[0].settings.displaySettings.settings.chatwindow,
          userScript: temp[0].settings.customScript.userFetching,
          exists: (session && session.value) ? true : false,
          extendedSettings: temp[0].settings.displaySettings,
          customFields: temp[0].settings.schemas.chats.fields,
          session: (session && session.value) ? {
            csid: session.value._id,
            state: session.value.state,
            agent: session.value.agent,
            cid: session.value.conversationID,
            username: session.value.username,
            email: session.value.email,
            nsp: session.value.nsp,
            newUser: false,
            _id: session.value._id,
            id: session.value._id,
            deviceID: session.value.deviceID,
            isMobile: session.value.isMobile,
          } : undefined
        });
      }
      else res.status(401).send();
    }
  } catch (error) {
    console.log('Error in Loading Script');
    console.log(error);
    res.status(401).send();

  }

});


router.get('/createSession/:nsp?/:location?/:fullCountryName?/:ip?/:url?/:email?/:username?/:family?/:name?/:version?/:product?/:manufacturer?/:referrer?/:deviceID?/:returningVisitor?/:latitude?/:longitude?/:isMobile?', async (req, res) => {

  try {

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.params
      || !req.params.username
      || !req.params.email
      || !req.params.ip
      || !req.params.location
      || !req.params.fullCountryName
      || !req.params.nsp
      || !req.params.url
      || !req.params.deviceID) {
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


      let banned = false;
      let exists;
      let returningVisitor = (req.params.returningVisitor == 'true') ? true : false
      let primaryIP = req.params.ip;
      let secondaryIP = '';
      if (req.params.deviceID) {
        let forwardedFOR = req.header('X-Forwarded-For') || req.header('x-forwarded-for');
        if (forwardedFOR && forwardedFOR.length.toString().split(',').length > 1) {
          primaryIP = forwardedFOR.length.toString().split(',')[0];
          secondaryIP = forwardedFOR.length.toString().split(',')[1];
        }
        // console.log('Request Origin-IP : ', req.header('X-Forwarded-For') || req.header('x-forwarded-for'))


        exists = await Visitor.getVisitorByDeviceID(req.params.deviceID)
        // let endTme = new Date().toISOString();
        // let totaltTime = (Date.parse(endTme) - Date.parse(startTme)) / 1000;
        // console.log('Getting Banned Visitors', totaltTime);
        if (exists && exists.length) {
          if (exists[0].banned) banned = true

        }
      }

      //console.log('bannedCheck');


      if (banned) res.status(401).send();
      else {
        let cordinates: any = {
          latitude: req.params.latitude,
          longitude: req.params.longitude
        }

        let deviceInformation: any = {
          name: req.params.family,
          os: req.params.name,
          version: req.params.version,
          product: (req.params.product != undefined && req.params.product != 'undefined') ? req.params.product : undefined,
          manufacturer: (req.params.manufacturer != undefined && req.params.manufacturer != 'undefined') ? req.params.manufacturer : undefined
        }

        let randomColor = rand[Math.floor(Math.random() * rand.length)];

        let session: VisitorSessionSchema = {
          socketID: [],
          location: 'DF',
          country: req.params.location.toString(),
          fullCountryName: req.params.fullCountryName.toString(),
          ip: primaryIP,
          secondaryIP: secondaryIP,
          nsp: '/' + req.params.nsp.toString(),
          creationDate: new Date().toISOString(),
          url: new Array(unescape(req.params.url.toString())),
          state: 1,
          agent: { id: '', name: '', image: '' },
          type: 'Visitors',
          newUser: true,
          conversationID: undefined,
          typingState: false,
          greetingMessageSent: false,
          currentState: undefined,
          stateMachine: [],
          isMobile: (req.params.isMobile == 'true') ? true : false,
          email: decodeURIComponent(req.params.email),
          username: decodeURIComponent(req.params.username),
          deviceID: (req.params.deviceID != undefined && req.params.deviceID != 'undefined') ? req.params.deviceID : '',
          referrer: (req.params.referrer && (req.params.referrer != 'undefined')) ? decodeURIComponent(req.params.referrer) : 'Direct',
          makeActive: false,
          deviceInfo: {
            name: decodeURIComponent(req.params.family),
            os: decodeURIComponent(req.params.name),
            version: decodeURIComponent(req.params.version),
            product: (req.params.product != undefined && req.params.product != 'undefined') ? decodeURIComponent(req.params.product) : undefined,
            manufacturer: (req.params.manufacturer != undefined && req.params.manufacturer != 'undefined') ? decodeURIComponent(req.params.manufacturer) : undefined
          },
          returningVisitor: returningVisitor,
          callingState: {
            socketid: '',
            state: false,
            agent: ''
          },
          cordinates: (cordinates) ? cordinates : '',
          inactive: false,
          lastTouchedTime: new Date().toISOString(),
          viewColor: randomColor
        }

        // if( req.params.nsp.toString() == 'hrm.sbtjapan.com')console.log('session');


        let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(session)), true);
        // if( req.params.nsp.toString() == 'hrm.sbtjapan.com') console.log(insertedSession);
        if (insertedSession && insertedSession.insertedCount > 0) {
          // if( req.params.nsp.toString() == 'hrm.sbtjapan.com')console.log('session inserted');
          // console.log("User Creating")
          session = insertedSession.ops[0];
          // let token: string = req.params.deviceID + ((req.params.returningVisitor == 'false') ? (((insertedSession.ops[0]._id) ? insertedSession.ops[0]._id : insertedSession.ops[0].id)) : '')
          let event = 'Visitor Connected';
          let token: any = req.params.deviceID;


          if (exists && (!exists.length) && !returningVisitor) {
            token = req.params.deviceID + ((session._id) ? session._id : session.id);
            req.params.deviceID = token;

            //Visitor.insertVisitor(req.params, session.nsp);
          }


          session.deviceID = token;
          let SQSPromises = await Promise.all([
            await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_CONNECTED, (session._id) ? session._id : session.id, ARCHIVINGQUEUE),
            await __biZZC_SQS.SendMessage({
              action: 'NewVisitors',
              deviceinfo: deviceInformation,
              token: token,
              params: req.params,
              nsp: session.nsp,
              sid: (session._id) ? session._id : session.id
            }, ARCHIVINGQUEUE)
          ]);
          // if( req.params.nsp.toString() == 'hrm.sbtjapan.com')console.log('SQSPromises');
          let origin = await Company.getSettings(session.nsp);

          // if( req.params.nsp.toString() == 'hrm.sbtjapan.com')console.log(origin);
          if (session.state == 1 && origin && origin.length && origin[0].settings.chatSettings.assignments.botEnabled) {

            let chatBot: any = {
              id: "",
              image: "/cw/assets/img/icons/svg/chatbot-outline.svg",
              name: "ChatBot",
              nickname: "ChatBot"
            };
            // session.state = 8;
            session.agent = chatBot;
            await SessionManager.UpdateSession(session._id, session, 8, session.state);


            res.json({
              _id: insertedSession.ops[0]._id,
              id: insertedSession.ops[0]._id,
              csid: insertedSession.ops[0]._id,
              cid: '',
              agent: chatBot,
              state: 8,
              username: insertedSession.ops[0].username,
              email: insertedSession.ops[0].email,
              nsp: insertedSession.ops[0].nsp,
              deviceID: token,
              newUser: true,
              isMobile: insertedSession.ops[0].isMobile
            });
          }

          else {
            await SessionManager.UpdateSession(session._id, session);
            res.json({
              agent: undefined,
              _id: insertedSession.ops[0]._id,
              id: insertedSession.ops[0]._id,
              csid: insertedSession.ops[0]._id,
              state: insertedSession.ops[0].state,
              cid: undefined,
              username: insertedSession.ops[0].username,
              email: insertedSession.ops[0].email,
              nsp: insertedSession.ops[0].nsp,
              deviceID: token,
              newUser: true,
              isMobile: insertedSession.ops[0].isMobile
            });
          }
        } else {
          res.status(501).send();
        }
      }

    }

  } catch (error) {
    console.log(error);
    console.log('Error in Creating Session');
    res.send(500).send();
  }

});
router.get('/cw/loadTesting', (req, res) => {

  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(publicPath + '/public/static/js/' + Assets['loaderForLoad.js']);
});

router.get('/cw/license', (req, res) => {

  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(publicPath + '/public/static/js/' + Assets['loader.js']);
});


router.get('/cw/*', (req, res) => {

  if (path.basename(req.path).indexOf('chat-window.html') != -1) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
  }
  else {
    res.set('Cache-Control', 'public, max-age=2592000000');
  }
  res.sendFile(publicPath + '/public/static/' + req.path);
});

router.get('/cbam/js/*', (req, res) => {
  //console.log(publicPath + 'public/static/js/' + path.basename(req.path));
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(publicPath + '/public/static/js/' + path.basename(req.path));
});


router.get('/cbam/html/*', (req, res) => {
  //console.log(publicPath + 'public/static/html/' + path.basename(req.path))
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.sendFile(publicPath + '/public/static/html/' + path.basename(req.path));
});

router.get('/signupReseller/signUpResellerFrame/*', (req, res) => {
  //console.log(publicPath + 'public/static/html/' + path.basename(req.path))
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.sendFile(publicPath + '/public/static/html/' + path.basename(req.path));
});

router.get('/cw/css/*', (req, res) => {
  //console.log(Assets);
  res.set('Cache-Control', 'public, max-age=2592000000');
  if (req.hostname == 'localhost' || req.hostname == 'localhost') {
    if (req.url.indexOf('iFrameLayout.css') != -1) {
      res.sendFile(publicPath + '/public/static/assets/css/' + Assets[path.basename(req.path)]);
    } else {
      res.sendFile(publicPath + '/public/static/assets/css/' + path.basename(req.path));
    }
  } else {
    res.sendFile(publicPath + '/public/static/assets/css/' + Assets[path.basename(req.path)]);
  }
});

router.get('/cw/js/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592000000');
  if (req.hostname == 'localhost') {
    if (req.url.indexOf('chatWindow.js') != -1) {
      res.sendFile(publicPath + '/public/static/assets/js/' + Assets[path.basename(req.path)]);
    } else {
      res.sendFile(publicPath + '/public/static/assets/js/' + path.basename(req.path));
    }
  } else {
    res.sendFile(publicPath + '/public/static/assets/js/' + path.basename(req.path));
  }
});

router.get('/cw/html/*', (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.sendFile(publicPath + '/public/static/assets/html/' + path.basename(req.path));
});

router.get('/cw/chatWindow/js/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592000000');
  res.sendFile(publicPath + '/public/static/assets/js/' + Assets[path.basename(req.path)]);
});

router.get('/cw/images/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592000000');
  res.sendFile(publicPath + '/public/static/assets/images/' + path.basename(req.path));
});

router.get('/cw/fonts/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592000000');
  res.sendFile(publicPath + '/public/static/assets/fonts/' + path.basename(req.path));
});





router.get('/testing_prod', (req, res) => {
  // console.log('testing');
  //  console.log(publicPath + '/' + '__dummy.html');
  res.sendFile(publicPath + '/__dummy_prod.html');
});

router.get('/testing', (req, res) => {
  // console.log('testing');
  //  console.log(publicPath + '/' + '__dummy.html');
  // res.sendFile(publicPath + '/__dummy.html');
  res.send(`<script type="text/javascript" async>
    if (window.__bizC == undefined) window.__bizC = {};
    window.__bizC['license'] = '8aee0d0be73372274a3a82b79bc3ff9529b1f63e';  var scr = document.createElement('script');
    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;
    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);
</script>`);
});

router.get('/testing1', (req, res) => {
  res.send(`<script type="text/javascript" async>
    if (window.__bizC == undefined) window.__bizC = {};
    window.__bizC['license'] = '445c7857227fa591ba539c83951623959c07a9fe';  var scr = document.createElement('script');
    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;
    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);
</script>`);
  // res.sendFile(publicPath + '/public/static/assets/html/' + '__dummy.html');
});


router.get('/popup', (req, res) => {
  // console.log('Popup');
  res.sendFile(publicPath + '/public/static/assets/html/' + 'chatWindow.html');
});





router.post('/app_validate/', async (req, res) => {

  try {
    //console.log('App_validate');
    //   console.log(JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    // console.log(req.body);
    if (!JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license) {
      res.status(401).send();
    } else {
      let temp = await Company.verifylicenseMobile(JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license);
      //console.log(JSON.stringify({ nsp: temp[0].name }));
      if (temp.length > 0) {
        res.status(200).send({
          nsp: temp[0].name,
          settings: temp[0].settings.displaySettings,
          permissions: temp[0].settings.chatSettings.permissions
        });
      } else {
        res.status(401).send();
      }
    }
  } catch (error) {
    console.log('Error in Loading Script');
    console.log(error);
    res.status(401).send();

  }

});



router.post('/getsession/', async (req, res) => {

  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    let body = JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]);
    //console.log(body);
    // console.log('getsession');
    if (body.csid == 'undefined' || body.csid == 'null') {
      // console.log('No Sid Present');
      req.body.csid = undefined
    }

    if (!body || !body.username || !body.email || !body.ip || !body.location || !body.fullCountryName || !body.nsp) {
      // console.log('Returning 401');
      res.status(401).send();
      return;
    }

    // let exisitingSession = await SessionManager.Exists_registered(body.csid, body.email);
    let exisitingSession = await ContactSessionManager.Exists_contact(body.email);
    let iceServers = await iceServersModel.getICEServers();
    if (exisitingSession && exisitingSession.value) {
      // if(body.isMobile){
      //     await SessionManager.updateIsMobileBoolean(body.csid, body.isMobile);
      // }
      await ContactSessionManager.UpdateDeviceToken(exisitingSession.value.id || exisitingSession.value._id, exisitingSession.value.deviceID);
      res.status(200).send({
        csid: exisitingSession.value.id || exisitingSession.value._id,
        state: exisitingSession.value.state,
        agent: exisitingSession.value.agent,
        cid: exisitingSession.value.conversationID,
        iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
      });
    } else {
      let session: ContactSessionSchema = {
        socketID: [],
        location: 'DF',
        country: body.location.toString(),
        fullCountryName: body.fullCountryName.toString(),
        ip: body.ip,
        nsp: body.nsp.toString(),
        creationDate: new Date().toISOString(),
        url: new Array(body.url.toString()),
        type: 'Contact',
        isMobile: true,
        email: body.email,
        username: body.username,
        deviceID: (body.deviceID) ? body.deviceID : '',
        callingState: {
          socketid: '',
          state: false,
          agent: ''
        }
      }
      // console.log('Session: ');
      //console.log(session);
      //console.log('Inserting Session');

      let insertedSession = await ContactSessionManager.insertSession(JSON.parse(JSON.stringify(session)));
      if (insertedSession) {
        // console.log(insertedSession.ops[0]);
        res.json({
          csid: insertedSession.ops[0]._id,
          agent: undefined,
          cid: undefined,
          iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
        });
      } else {
        res.status(501).send();
      }

    }

  } catch (error) {
    console.log(error);
    console.log('Error in Get Session Of Mobile');
  }

});

router.post('/getsession_livechat/', async (req, res) => {

  try {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
      res.header("Access-Control-Allow-Headers", "content-type");
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }

    //console.log('getsession_livechat');
    // console.log(req.body);
    // console.log(JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]));

    // let body = JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]);
    let body = JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]);
    req.body = body;
    let exisitingSession = await SessionManager.Exists_registered(body.email);
    // console.log(req.body)
    // console.log(body)
    // console.log(exisitingSession);

    let iceServers = await iceServersModel.getICEServers();
    if (exisitingSession && exisitingSession.value) {
      console.log('existingSession')
      // if(body.isMobile){
      //     await SessionManager.updateIsMobileBoolean(body.csid, body.isMobile);
      // }
      // await ContactSessionManager.UpdateDeviceToken(exisitingSession.value.id || exisitingSession.value._id, exisitingSession.value.deviceID);
      res.status(200).send({
        csid: exisitingSession.value.id || exisitingSession.value._id,
        state: exisitingSession.value.state,
        agent: exisitingSession.value.agent,
        cid: exisitingSession.value.conversationID,
        iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
      });
    }
    else {
      console.log('New Session')
      let randomColor = rand[Math.floor(Math.random() * rand.length)];
      let session: VisitorSessionSchema = {
        socketID: [],
        location: 'DF',
        country: req.body.location,
        fullCountryName: req.body.fullCountryName,
        ip: req.body.ip,
        nsp: req.body.nsp,
        creationDate: new Date(),
        url: new Array(decodeURIComponent(req.body.url)),
        state: 1,
        agent: { id: '', name: '', image: '' },
        type: 'Visitors',
        newUser: true,
        conversationID: undefined,
        typingState: false,
        greetingMessageSent: false,
        currentState: undefined,
        stateMachine: [],
        isMobile: (req.body.isMobile == 'true') ? true : false,
        makeActive: false,
        email: decodeURIComponent(req.body.email),
        username: decodeURIComponent(req.body.username),
        deviceID: ((req.body.deviceID != undefined) && (req.body.deviceID != 'undefined')) ? req.body.deviceID : '',
        referrer: (req.body.referrer && req.body.referrer != 'undefined') ? decodeURIComponent(req.body.referrer) : 'Direct',
        returningVisitor: (req.body.returningVisitor == 'true') ? true : false,
        callingState: {
          socketid: '',
          state: false,
          agent: ''
        },
        deviceInfo: {
          name: '',
          os: '',
          version: '',
          product: '',
          manufacturer: ''
        },
        cordinates: '',
        inactive: false,
        lastTouchedTime: new Date().toISOString(),
        viewColor: randomColor
      }
      let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(session)), true);
      if (insertedSession && insertedSession.insertedCount > 0) {
        // console.log("User Creating")
        /**
         * @Note Previous Code
           let origin = socketServer.of(session.nsp);
         */
        let origin = await Company.getSettings(session.nsp);
        session = insertedSession.ops[0];
        let token: any = req.body.deviceID;

        let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_CONNECTED, (session._id) ? session._id : session.id);
        // if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

        if (session.state == 1 && origin && origin.length && origin[0].settings.chatSettings.assignments.botEnabled) {
          session.state = 8;
          await SessionManager.UpdateSession(session._id, session, 8, session.state);
          res.status(200).send({
            csid: insertedSession.ops[0]._id,
            agent: undefined,
            cid: undefined,
            state: 8,
            username: insertedSession.ops[0].username,
            email: insertedSession.ops[0].email,
            nsp: insertedSession.ops[0].nsp,
            //workflow: (origin['workflow'] as WorkFlow).formHTML,
            deviceID: token,
            newUser: true,
            isMobile: insertedSession.ops[0].isMobile
          });


        }
        else {

          await SessionManager.UpdateSession(session._id, session);
          res.status(200).send({
            csid: insertedSession.ops[0]._id,
            state: insertedSession.ops[0].state,
            agent: undefined,
            cid: undefined,
            username: insertedSession.ops[0].username,
            email: insertedSession.ops[0].email,
            nsp: insertedSession.ops[0].nsp,
            deviceID: token,
            //conversations: conversations,
            newUser: true,
            isMobile: insertedSession.ops[0].isMobile
          });
        }
      } else {
        res.status(501).send();
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Get Session Of Mobile');
  }

});



router.get('/test/query', async (req, res) => {
  //console.log('testing');
  try {

    let result = await SessionManager.GetAllActiveAgents({ nsp: '/localhost.com' })
    res.status(200).send({ result: result });
    //#endregion

  } catch (error) {
    console.log(error)
  }


});

router.get('/test/redis_set', async (req, res) => {
  //console.log('testing');
  try {

    res.status(200).send({ result: await __BIZZC_REDIS.GenerateSID('abc.com', 213213213) });
    //#endregion

  } catch (error) {
    console.log(error)
  }


});

router.get('/test/redis_get', async (req, res) => {
  //console.log('testing');
  try {

    res.status(200).send({ result: await __BIZZC_REDIS.GetID('_abc.com_213213213') });
    //#endregion

  } catch (error) {
    console.log(error)
  }


});

router.get('agents/fixCount/:value', async (req, res) => {
  let value = req.params.fixcount;
  WorkerManager.SetFixCount = value;
  res.send({ status: 'ok', fixCount: WorkerManager.GetFixCount });
})


router.post('agents/checkSID/', async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin, Access-Control-Request-Headers');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if (!req.body.sid) { res.status(401).send(); return; }
    let result = __BIZZC_REDIS.Exists(req.body.sid);
    if (result) res.status(200).send({ status: 'ok' });
    else res.status(401).send();

  } catch (error) {
    res.status(401).send();
    console.log(error);
    console.log('error in checkingSID')
  }
});

//agent authentication routes

router.post('/validateCode', async (req, res, next) => {
  //console.log('get User');
  //console.log(req.headers.referer);
  if (!req.body.code) return res.status(401).send({ status: 'invalidCode' });
  req.body.code = decodeURIComponent(req.body.code);
  // console.log(req.body);
  try {
    let accesscode = await Agents.ValidateCode(req.body.code);
    if (!accesscode) res.status(401).send({ status: 'invalidCode' });
    else {
      let agent = await Agents.GetAgentByEmail(accesscode.email.toLowerCase());
      let checkActivation;
      if (agent && agent.length) checkActivation = await Company.getCompany(agent[0].nsp);
      // console.log(checkActivation);
      if (agent && agent.length && checkActivation && !checkActivation[0].deactivated) {
        let continueProcess = false;
        let authPermissions = checkActivation[0].settings.authentication;
        // Case IF the user is superadmin then ignore the SSO check
        if (agent[0].role == 'superadmin') {
          continueProcess = true;
        } else {
          if (authPermissions.suppressionList.includes(agent[0].email)) {
            continueProcess = true;
          } else {
            if (!authPermissions[agent[0].role].enableSSO) {
              continueProcess = true;
            } else {
              let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
              //console.log(clientIp.toString());
              //console.log(req.headers['x-forwarded-for']);
              if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
            }
          }
        }
        //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
        //Case IF SSO is disabled then continue the login process
        //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
        //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
        let exists = await SessionManager.GetLiveSessionAgentByEmail(agent[0].email);
        // console.log(exists);
        if (continueProcess) {
          if (agent.length && exists.length) {

            //console.log('Returning Existing sessions');
            agent[0].csid = exists[0]._id;
            if (req.params.loginUrl) agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
            else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) agent[0].loginUrl = req.headers.referer
            // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
            res.send(agent);
            return;
          }
          //End (Multiple Login Case)
          else if (agent.length && !(exists.length)) {
            //End (Multiple Login Case)
            let acceptingChats = !(agent[0].applicationSettings)
              ? true
              : agent[0].applicationSettings.acceptingChatMode;


            //let groups = await Company.getGroups(agent[0].nsp);
            let activeRooms: Array<string> = [];
            let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
            // console.log('Permissions: ');
            // console.log(permissions);
            let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
            let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
            let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
            let Agent: AgentSessionSchema = {
              socketID: [],
              agent_id: agent[0]._id,
              nsp: agent[0].nsp,
              createdDate: new Date().toISOString(),
              nickname: agent[0].nickname,
              email: agent[0].email,
              rooms: {},
              chatCount: 0,
              type: 'Agents',
              location: activeRooms,
              visitorCount: 0,
              role: agent[0].role,
              acceptingChats: acceptingChats,
              state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
              idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
              image: (agent[0].image) ? agent[0].image : '',
              locationCount: {},
              callingState: {
                socketid: '',
                state: false,
                agent: ''
              },
              permissions: permissions,
              groups: groups,
              teams: teams,
              isOwner: isOwner,
              updated: true,
              concurrentChatLimit: agent[0].settings.simchats
            }

            // console.log('agent');
            // console.log(agent[0]);


            // console.log('Before Inserting Session');
            // console.log(!!exists.length);
            let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
            if (insertedSession) {
              agent[0].csid = insertedSession.ops[0]._id
              agent[0].callingState = insertedSession.ops[0].callingState;
              agent[0].isOwner = insertedSession.ops[0].isOwner;
              agent[0].groups = insertedSession.ops[0].groups;
              agent[0].teams = insertedSession.ops[0].teams;
              Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
              Contacts.updateStatus(Agent.email, Agent.nsp, true);
            } else {
              res.status(501).send();
              return;
            }
            if (req.params.loginUrl) agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
            else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) agent[0].loginUrl = req.headers.referer
            res.send(agent);
            return;
            //next();
          }
          else {
            res.status(401).send({ status: 'invalidCode' }).end();
            return;
          }
        } else {
          //console.log(agent[0].email + ' is not authorized!');
          res.status(401).send({ status: 'invalidCode' }).end();
          return;
        }
      }
      else res.status(401).send({ status: 'no agent found' });
    }


  } catch (error) {
    console.log('Error in Get User');
    console.log(error);
    res.status(401).send({ status: 'error' });
    return;
  }

});

router.post('/authenticate/:csid?', async (req, res, next) => {
  // console.log('Auth');
  // console.log(req.body);
  if (!req.body.csid) return res.send(401);
  else {
    let exisitingSession = await SessionManager.Exists(req.body.csid);
    let checkActivation: any;
    if (exisitingSession && exisitingSession.length > 0) checkActivation = await Company.getCompany(exisitingSession[0].nsp);
    // console.log(checkActivation);
    //if (checkActivation && checkActivation[0].deactivated) res.status(401).send();
    //else
    if (exisitingSession) {
      if (exisitingSession.length > 0) {
        Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
        res.status(200).send(exisitingSession[0].callingState);
        return;
      } else {
        res.status(401).send(401);
        return;
      }
    } else {
      return res.status(401).send(401);
    }
  }
});

router.post('/getUser', async (req, res, next) => {
  console.log('get User');
  console.log(req.body);
  if (!req.body.email || !req.body.password) return res.status(401).send({ status: 'invalidparameters' });
  req.body.email = decodeURIComponent(req.body.email);
  req.body.password = decodeURIComponent(req.body.password);
  let iceServers = await iceServersModel.getICEServers();

  // iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
  // console.log(req.body);
  try {
    let agent = await Agents.AuthenticateUser(req.body.email, req.body.password);
    // console.log(agent);
    let checkActivation;
    if (agent && agent.length > 0) checkActivation = await Company.getCompany(agent[0].nsp);
    // console.log(checkActivation);
    if (agent && checkActivation && !checkActivation[0].deactivated) {
      let continueProcess = false;
      let authPermissions = checkActivation[0].settings.authentication;
      //Case IF the user is superadmin then ignore the SSO check
      if (agent[0].role == 'superadmin') {
        continueProcess = true;
      } else {
        if (authPermissions.suppressionList.includes(agent[0].email)) {
          continueProcess = true;
        } else {
          if (!authPermissions[agent[0].role].enableSSO) {
            continueProcess = true;
          } else {
            let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
            //console.log(clientIp.toString());
            //console.log(req.headers['x-forwarded-for']);
            if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
          }
        }
      }
      //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
      //Case IF SSO is disabled then continue the login process
      //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
      //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
      let exists = await SessionManager.GetLiveSessionAgentByEmail(req.body.email);
      // console.log(exists);
      if (continueProcess && authPermissions[agent[0].role].TwoFA) {

        if (agent.length) {
          let code = new ObjectID().toHexString()
          let insertedCode = await Agents.InsertCode(code, req.body.email.toLowerCase());
          if (insertedCode && insertedCode.insertedCount) {
            await __biZZC_SQS.SendMessage({ action: 'sendaccesscode', code: code, email: req.body.email.toLowerCase() })
            res.status(203).send({ status: 'ok' })
          }
          else res.status(501).send()
          return;
        } else {
          res.status(401).send({ status: 'incorrectcredintials' }).end();
          return;
        }

      }
      else if (continueProcess && !authPermissions[agent[0].role].TwoFA) {
        if (agent.length && exists.length) {

          //console.log('Returning Existing sessions');
          agent[0].csid = exists[0]._id;
          agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined

          if (req.params.loginUrl) agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
          else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) agent[0].loginUrl = req.headers.referer
          // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
          res.send(agent);
          return;
        }
        //End (Multiple Login Case)
        else if (agent.length && !(exists.length)) {
          //End (Multiple Login Case)
          let acceptingChats = !(agent[0].applicationSettings)
            ? true
            : agent[0].applicationSettings.acceptingChatMode;


          //let groups = await Company.getGroups(agent[0].nsp);
          let activeRooms: Array<string> = [];
          let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
          // console.log('Permissions: ');
          // console.log(permissions);
          let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
          let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
          let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
          let Agent: AgentSessionSchema = {
            socketID: [],
            agent_id: agent[0]._id,
            nsp: agent[0].nsp,
            createdDate: new Date().toISOString(),
            nickname: agent[0].nickname,
            email: agent[0].email,
            rooms: {},
            chatCount: 0,
            type: 'Agents',
            location: activeRooms,
            visitorCount: 0,
            role: agent[0].role,
            acceptingChats: acceptingChats,
            state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
            idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
            image: (agent[0].image) ? agent[0].image : '',
            locationCount: {},
            callingState: {
              socketid: '',
              state: false,
              agent: ''
            },
            permissions: permissions,
            groups: groups,
            teams: teams,
            isOwner: isOwner,
            updated: true,
            concurrentChatLimit: agent[0].settings.simchats
          }

          // console.log('agent');
          // console.log(agent[0]);


          // console.log('Before Inserting Session');
          // console.log(!!exists.length);
          let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
          if (insertedSession) {
            agent[0].csid = insertedSession.ops[0]._id
            agent[0].callingState = insertedSession.ops[0].callingState;
            agent[0].isOwner = insertedSession.ops[0].isOwner;
            agent[0].groups = insertedSession.ops[0].groups;
            agent[0].teams = insertedSession.ops[0].teams;
            Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
            Contacts.updateStatus(Agent.email, Agent.nsp, true);
          } else {
            res.status(501).send();
            return;
          }
          if (req.params.loginUrl) agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
          else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) agent[0].loginUrl = req.headers.referer
          agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined
          res.send(agent);
          return;
          //next();
        }
        else {
          res.status(401).send({ status: 'incorrectcredintials' }).end();
          return;
        }
      } else {
        //console.log(agent[0].email + ' is not authorized!');
        res.status(401).send({ status: 'unauthorized' }).end();
        return;
      }
    }
    else {
      // console.log('Second Else');
      res.status(401).send({ status: 'incorrectcredintials' }).end();
      return;
    }
  } catch (error) {
    console.log('Error in Get User');
    console.log(error);
    res.status(401).send({ status: 'error' });
    return;
  }

});

router.post('/registerAgent', async (req, res) => {
  //console.log('Registering Agent');
  //console.log(req.body.agent);
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.nickname ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email ||
      !req.body.gender ||
      !req.body.nsp ||
      !req.body.token
    ) {
      res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Invalid parameters' });
    } else {
      let company = await Company.getCompanyByNSPandToken(req.body.nsp, req.body.token);
      if (company && company.length) {
        let agent = {
          "first_name": req.body.first_name,
          "last_name": req.body.last_name,
          "phone_no": (req.body.phone_no) ? req.body.phone_no : '',
          "nickname": req.body.nickname,
          "username": req.body.username,
          "password": req.body.password,
          "group": [
            "DF"
          ],
          "email": req.body.email,
          "role": "agent",
          "gender": req.body.gender,
          "nsp": company[0].name,
          "created_date": new Date().toISOString(),
          "created_by": "api",
          "editsettings": {
            "editprofilepic": true,
            "editname": true,
            "editnickname": true,
            "editpassword": true
          },
          "communicationAccess": {
            "enablechat": true,
            "voicecall": true,
            "videocall": true
          },
          "settings": {
            "simchats": 20,
            "emailNotifications": {
              "newTickCreate": true,
              "assignToAgent": true,
              "unattendTickGroup": true,
              "repliesToTicket": true,
              "noteAddTick": true,
              "agentInviteEmail": true
            },
            "windowNotifications": {
              "newTicket": true,
              "ticketMessage": true,
              "ticketAssigned": true,
              "ticketUpdated": true,
              "agentConversation": true,
              "agentMessage": true,
              "visitorConversation": true,
              "visitorMessage": true
            }
          }
        };
        let pkg = await Company.getPackages(agent.nsp);
        if (pkg && pkg.length && pkg[0].package.agents.quota != -1) {
          let totalAgents = await Agents.GetAgentsCount(agent.nsp);
          if (totalAgents && totalAgents.length && pkg[0].package.agents.quota && (totalAgents[0].count >= pkg[0].package.agents.quota) && (totalAgents[0].count >= pkg[0].package.agents.limit)) {
            // console.log('Limit Exceeded');
            res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Limit exceeded!' });
            return;
          }
        }
        let exists = await Agents.getAgentByEmail(agent.nsp, agent.email);
        if (exists && !exists.length) {
          let writeResult = await Agents.RegisterAgent(agent);
          if (!writeResult) {
            res.send(400).send({ result: false, response_code: 700006, status: 'error', message: 'Could not register agent!' })
          } else {
            if (process.env.NODE_ENV == 'production') {
              let packet: SQSPacket = {
                action: 'newAgent',
                body: writeResult[0]
              }
              await __biZZC_SQS.SendMessageToSOLR(packet, 'agent');
            }
            res.status(200).send({ result: true, response_code: 200 ,status: 'success', message: 'Agent registered successfully!' });
          }
        } else {
          res.status(400).send({result: false, response_code: 700006, status: 'error', message: 'Agent already exists!' });
        }
      } else {
        res.status(401).send({ result: false, response_code: 700006, status: 'error', message: 'Invalid token!' });
      }
    }
  } catch (error) {
    console.log(error);
    console.log('Error in Register Agent');
    res.status(500).send({result: false, response_code: 700006, status: 'error', message: 'Internal server error!' });
  }
});

router.post('/deactivateAgent', async (req, res) => {
  try {

    if (!req.body.email || !req.body.token || !req.body.nsp) {
      res.status(401).send({ result: false, response_code: 700006, status: 'error', message: "Invalid Request!" });
    } else {
      //validate token
      let company = await Company.getCompanyByNSPandToken(req.body.nsp, req.body.token);
      if (company && company.length) {
        let exists = await Agents.getAgentByEmail(company[0].name, req.body.email);
        if (exists && exists.length) {
          let agent = await Agents.DeActivateAgent(exists[0].email, exists[0].nsp);
          if (agent && agent.value) {
            res.status(200).send({ result: true, response_code: 200, status: 'success', message: 'Agent deactivated successfully!' })
          } else {
            res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Agent could not be deactivated!' });
          }
        } else {
          res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Agent not found!' });
        }
      } else {
        res.status(401).send({  result: false, response_code: 700006, status: 'error', message: 'Invalid token!' });
      }
    }

  } catch (err) {
    console.log(err);
    console.log('Error in deactivating Agent');
    res.status(500).send({  result: false, response_code: 700006, status: 'error', message: 'Internal server error!' });
  }
});


router.get('/getPassword', async (req, res) => {
  try {
    // console.log(req.query);
    let url = (process.env.NODE_ENV == 'production') ? 'https://app.beelinks.solutions' : (process.env.NODE_ENV == 'development') ? 'https://dev.beelinks.solutions' : 'http://localhost:8005';
    let html = `
    <script>
    function getDetails(e) {
      e.preventDefault();
      var previousTable = document.getElementById('dataTable');
      if (previousTable) previousTable.remove();
      var xhttp = new XMLHttpRequest();
      var formData = document.getElementById("dataForm");
      let obj = {
        email: formData.elements['email'].value,
        password: formData.elements['password'].value,
        useremail: formData.elements['useremail'].value
      }
      xhttp.open("POST", "${url}/getPassword", false);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(obj));
      // if (xhttp.status == 200) {
        var table = document.createElement("table");
        table.id = 'dataTable';
        var response = JSON.parse(xhttp.responseText);
        var tr = document.createElement("tr");
        Object.keys(response).map(function(key) {
          var th = document.createElement("th");
          var t = document.createTextNode(key);
          th.appendChild(t);
          tr.appendChild(th);
        });
        table.appendChild(tr);
        var tr = document.createElement("tr");
        Object.keys(response).map(function(key) {
          var td = document.createElement("td");
          var t = document.createTextNode(response[key]);
          td.appendChild(t);
          tr.appendChild(td);
        });
        table.appendChild(tr);
        document.body.appendChild(table);
      // } else {
      //   // alert(xhttp.responseText)
      //   var t = document.createTextNode(xhttp.responseText);
      //   document.body.appendChild(t);
      // }
    }
    </script>
    <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
    <form id="dataForm" name="dataForm" onsubmit="return getDetails(event)">
      <label for="email">Email:</label>
      <input type="text" id="email" name="email" placeholder="email" autocomplete="off"><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" placeholder="password" autocomplete="off"><br><br>
      <label for="password">Details for:</label>
      <input type="text" id="useremail" name="useremail" placeholder="email" autocomplete="off"><br><br>
      <input type="submit" value="Submit">
    </form>
   `;
    res.send(html);

  } catch (err) {
    console.log('Error in getting password');
    console.log(err);
    res.status(401).send();
  }
});
router.post('/getPassword', async (req, res) => {
  try {
    // console.log(req.body);
    if (!req.body.email || !req.body.password || !req.body.useremail) return res.status(401).send({ status: 'error', msg: 'Invalid parameters!' });

    //authenticate user
    let authAgent = await Agents.AuthenticateUser(req.body.email, req.body.password);

    //get the required user
    let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);

    // console.log(ifaces);
    if (authAgent && authAgent.length) {
      let agent = await Agents.getAgentsByEmail(req.body.useremail);
      let code = await Agents.getAccessCode(req.body.useremail);
      if (agent && agent.length) {
        let responseObj = {
          status: 'success',
          _id: agent[0]._id,
          email: agent[0].email,
          password: agent[0].password,
          nsp: agent[0].nsp,
          role: agent[0].role,
          accesscode: code
        }
        await ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp);
        res.send(responseObj);
      } else {
        let responseObj = { status: 'error', msg: 'Agent not found!' }
        await ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp);
        res.send(responseObj);
      }
    } else {
      let responseObj = { status: 'error', msg: 'Invalid credentials!' }
      await ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp);
      res.send(responseObj);
    }

  } catch (err) {
    console.log('Error in getting password');
    console.log(err);
    res.status(401).send({ status: 'error', msg: 'Internal server error!' });
  }
});


router.post('/auth', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.nsp) {
      res.status(401).send({ status: 'error', msg: 'Invalid credentials!' });
    } else {
      let company = await Company.setAuthToken(req.body.email, req.body.password, req.body.nsp);
      if (company && company.value) {
        res.send({ status: 'ok', token: company.value.companyToken });
      } else {
        res.send({ status: 'error', msg: 'Could not create token!' });
      }
    }
    //set company token
    //
  } catch (err) {
    console.log(err);
    console.log('Error in setting/getting auth token');
    res.status(401).send({ status: 'error', msg: 'Internal server error!' });
  }
})




//#endregion


// router.get('export/visitorData', async (req, res) => {

//     try {

//         let file = fs.readFileSync('C:\\Users\\saadisheikh9705\\Desktop\\29-2-Visitos.json', { encoding: 'uft-8' });
//         let json = JSON.parse(file);
//         res.send(json)
//     } catch (error) {
//         console.log(error);
//         console.log('error in exporting');
//     }

// });





export const StaticRoutes: express.Router = router;