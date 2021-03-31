"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticRoutes = void 0;
//Express Module Reference
var express = require("express");
var requestIp = require("request-ip");
// Path Object to Define "Default/Static/Generic" Routes
var path = require("path");
var companyModel_1 = require("../../models/companyModel");
var constants_1 = require("../config/constants");
var sessionsManager_1 = require("../server/sessionsManager");
var agentModel_1 = require("../../models/agentModel");
var iceServersModel_1 = require("../../models/iceServersModel");
var visitorModel_1 = require("../../models/visitorModel");
var contactSessionsManager_1 = require("../server/contactSessionsManager");
var CheckActive_1 = require("../../actions/GlobalActions/CheckActive");
var constants_2 = require("../../globals/config/constants");
var __biZZCMiddleWare_1 = require("../__biZZCMiddleWare");
var aws_sqs_1 = require("../../actions/aws/aws-sqs");
var enums_1 = require("./enums");
var WorkersManager_1 = require("../server/WorkersManager");
var mongodb_1 = require("mongodb");
var contactModel_1 = require("../../models/contactModel");
var TicketgroupModel_1 = require("../../models/TicketgroupModel");
var teamsModel_1 = require("../../models/teamsModel");
var reportsModel_1 = require("../../models/reportsModel");
//import * as request from 'request-promise';
//import { Headers } from 'request';
//const requestIp = require('request-ip');
var URL = require('url').URL;
var allowedReferers = [
    { referer: 'hrm.sbtjapan.com', nsp: '/hrm.sbtjapan.com' }
];
// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.
//Router Object Which Will be used to validate requests in Request Handler.
var router = express.Router();
var publicPath = path.resolve(__dirname + '/../../');
var AngularRoutes = [
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
];
router.get('/signup/signUpFrame', function (req, res) {
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
router.get('/login/getFrame', function (req, res) {
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
router.get('/signupReseller/signUpResellerFrame', function (req, res) {
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
router.get('/adminSignUp/adminSignupframe', function (req, res) {
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
router.get('/', function (req, res) {
    res.sendFile(publicPath + '/public/dist/index.html');
});
router.get(AngularRoutes, function (req, res) {
    res.sendFile(publicPath + '/public/dist/index.html');
});
router.get('/js/*', function (req, res) {
    res.sendFile(publicPath + '/public/dist/' + path.basename(req.path));
    // console.log('caught');
});
//NEW ROUTES ADDED TO OPTIMIZE BUILD
router.get('/css/*', function (req, res) {
    res.sendFile(publicPath + '/public/dist/' + path.basename(req.path));
});
router.get('/assets/ccss/*', function (req, res) {
    res.sendFile(publicPath + '/public/static' + path.dirname(req.path) + "/" + path.basename(req.path));
});
router.get('/assets/packages/*', function (req, res) {
    //console.log(publicPath + '/public/static' + path.dirname(req.path) +  "/" + path.basename(req.path));
    res.sendFile(publicPath + '/public/static' + path.dirname(req.path) + "/" + path.basename(req.path));
});
router.get('/assets/img/backgrounds/*', function (req, res) {
    //console.log(publicPath + '/public/dist/assets/img/backgrounds/' + path.basename(req.path));
    res.sendFile(publicPath + '/public/dist/assets/img/backgrounds/' + path.basename(req.path));
});
router.get('/assets/img/icons/*', function (req, res) {
    //console.log(publicPath + '/public/dist/assets/img/icons/' + path.basename(req.path));
    res.sendFile(publicPath + '/public/dist/assets/img/icons/' + path.basename(req.path));
});
router.get('/assets/img/*', function (req, res) {
    // console.log(publicPath + '/public/dist/assets/img/' + path.basename(req.path));
    res.sendFile(publicPath + '/public/dist/assets/img/' + path.basename(req.path));
});
router.get('/img/*', function (req, res) {
    // console.log(publicPath + '/public/dist/assets/' + req.path);
    res.sendFile(publicPath + '/public/dist/assets/' + req.path);
});
router.get('/images/*', function (req, res) {
    res.sendFile(publicPath + '/public/static/assets/images/' + path.basename(req.path));
});
router.get('/fonts/*', function (req, res) {
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
router.get('/loadscript/:license?/:url?/:sid?/:deviceID?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var temp_1, bannedVisitor, session, url1, url2, packg, totalVisitors, referer, banned, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                if (!(!req.params.license || !req.params.url)) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 11];
            case 1:
                //Impemented After CloudFront
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                return [4 /*yield*/, companyModel_1.Company.verifylicense(req.params.license)];
            case 2:
                temp_1 = _a.sent();
                bannedVisitor = void 0;
                if (!req.params.deviceID) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorModel_1.Visitor.GetBannedVisitorByDeviceID(temp_1[0].name, req.params.deviceID)
                    // console.log('visitor banned');
                    // console.log(bannedVisitor);
                ];
            case 3:
                bannedVisitor = _a.sent();
                _a.label = 4;
            case 4:
                // console.log('visitor banned');
                // console.log(bannedVisitor);
                if (bannedVisitor && bannedVisitor.length) {
                    {
                        res.status(401).send();
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.ExistandUpdate(req.params.sid, req.headers.referer)];
            case 5:
                session = _a.sent();
                url1 = void 0;
                url2 = void 0;
                if (!(temp_1 && temp_1.length)) return [3 /*break*/, 10];
                // console.log('in Temp');
                if (temp_1[0].deactivated) {
                    res.status(401).send();
                    return [2 /*return*/];
                }
                packg = temp_1[0].package;
                if (!(packg && packg.visitors.quota != -1)) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorsCount(temp_1[0].name)];
            case 6:
                totalVisitors = _a.sent();
                // console.log('totalVisitors');
                // if (totalVisitors) console.log(totalVisitors);
                // if (session && session.value) console.log('session exists');
                if (!session || (session && !session.value)) {
                    if (totalVisitors && totalVisitors.length && packg.visitors.quota && totalVisitors[0].count >= packg.visitors.quota) {
                        console.log('limit Exceeded for visiotrs quota');
                        res.status(401).send();
                        return [2 /*return*/];
                    }
                }
                _a.label = 7;
            case 7:
                referer = {
                    date: new Date(),
                    nsp: temp_1[0].name,
                    urls: [{ url: req.headers.referer, count: 1 }]
                };
                // console.log(topVisitedLink);
                // await ReportsModel.InsertOrUpdateTopVisitedLink(referer);
                url1 = new URL(temp_1[0].company_info.company_website).hostname;
                // console.log(url1);
                (req.params.url.indexOf('localhost') != -1 || req.params.url.indexOf('192.168') != -1)
                    ? url2 = 'localhost.com' : url2 = (req.params.url).replace(/(www\.)?/ig, '');
                // console.log(url2);
                if ((url1 == url2) || (req.params.url.indexOf('websiteqa') != -1)) {
                    //#region Setting CORS headers
                    if (req.headers.origin) {
                        res.header("Access-Control-Allow-Origin", req.headers.origin);
                        res.header("Access-Control-Allow-Headers", "content-type");
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Vary', 'Origin, Access-Control-Request-Headers');
                    }
                }
                banned = false;
                if (!(session && session.value)) return [3 /*break*/, 9];
                if (!session.value.inactive) return [3 /*break*/, 9];
                return [4 /*yield*/, CheckActive_1.MakeActive(session.value)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                //#endregion
                res.status(200).send({
                    nsp: temp_1[0].name,
                    fileShare: temp_1[0].settings.chatSettings.permissions.forVisitors,
                    showchathistory: temp_1[0].settings.chatSettings.permissions.showRecentChats,
                    chatAsGuest: temp_1[0].settings.chatSettings.permissions.chatAsGuest,
                    invitationChatInitiations: temp_1[0].settings.chatSettings.permissions.invitationChatInitiations,
                    allowedCall: temp_1[0].settings.callSettings.permissions.v2a,
                    allowedNews: temp_1[0].settings.widgetMarketingSettings.permissions.news,
                    allowedPromotions: temp_1[0].settings.widgetMarketingSettings.permissions.promotions,
                    allowedFaqs: temp_1[0].settings.widgetMarketingSettings.permissions.faqs,
                    allowedAgentAvailable: temp_1[0].settings.ticketSettings.allowedAgentAvailable,
                    barEnabled: temp_1[0].settings.displaySettings.barEnabled,
                    avatarColor: temp_1[0].settings.displaySettings.avatarColor,
                    settings: (temp_1[0].settings.displaySettings.barEnabled) ? temp_1[0].settings.displaySettings.settings.chatbar : temp_1[0].settings.displaySettings.settings.chatbubble,
                    cwSettings: temp_1[0].settings.displaySettings.settings.chatwindow,
                    userScript: temp_1[0].settings.customScript.userFetching,
                    exists: (session && session.value) ? true : false,
                    extendedSettings: temp_1[0].settings.displaySettings,
                    customFields: temp_1[0].settings.schemas.chats.fields,
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
                return [3 /*break*/, 11];
            case 10:
                res.status(401).send();
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _a.sent();
                console.log('Error in Loading Script');
                console.log(error_1);
                res.status(401).send();
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.get('/createSession/:nsp?/:location?/:fullCountryName?/:ip?/:url?/:email?/:username?/:family?/:name?/:version?/:product?/:manufacturer?/:referrer?/:deviceID?/:returningVisitor?/:latitude?/:longitude?/:isMobile?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var banned, exists, returningVisitor, primaryIP, secondaryIP, forwardedFOR, cordinates, deviceInformation, randomColor, session, insertedSession, event, token, SQSPromises, _a, _b, _c, origin, chatBot, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 16, , 17]);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!(!req.params
                    || !req.params.username
                    || !req.params.email
                    || !req.params.ip
                    || !req.params.location
                    || !req.params.fullCountryName
                    || !req.params.nsp
                    || !req.params.url
                    || !req.params.deviceID)) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 15];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                banned = false;
                exists = void 0;
                returningVisitor = (req.params.returningVisitor == 'true') ? true : false;
                primaryIP = req.params.ip;
                secondaryIP = '';
                if (!req.params.deviceID) return [3 /*break*/, 3];
                forwardedFOR = req.header('X-Forwarded-For') || req.header('x-forwarded-for');
                if (forwardedFOR && forwardedFOR.length.toString().split(',').length > 1) {
                    primaryIP = forwardedFOR.length.toString().split(',')[0];
                    secondaryIP = forwardedFOR.length.toString().split(',')[1];
                }
                return [4 /*yield*/, visitorModel_1.Visitor.getVisitorByDeviceID(req.params.deviceID)
                    // let endTme = new Date().toISOString();
                    // let totaltTime = (Date.parse(endTme) - Date.parse(startTme)) / 1000;
                    // console.log('Getting Banned Visitors', totaltTime);
                ];
            case 2:
                // console.log('Request Origin-IP : ', req.header('X-Forwarded-For') || req.header('x-forwarded-for'))
                exists = _d.sent();
                // let endTme = new Date().toISOString();
                // let totaltTime = (Date.parse(endTme) - Date.parse(startTme)) / 1000;
                // console.log('Getting Banned Visitors', totaltTime);
                if (exists && exists.length) {
                    if (exists[0].banned)
                        banned = true;
                }
                _d.label = 3;
            case 3:
                if (!banned) return [3 /*break*/, 4];
                res.status(401).send();
                return [3 /*break*/, 15];
            case 4:
                cordinates = {
                    latitude: req.params.latitude,
                    longitude: req.params.longitude
                };
                deviceInformation = {
                    name: req.params.family,
                    os: req.params.name,
                    version: req.params.version,
                    product: (req.params.product != undefined && req.params.product != 'undefined') ? req.params.product : undefined,
                    manufacturer: (req.params.manufacturer != undefined && req.params.manufacturer != 'undefined') ? req.params.manufacturer : undefined
                };
                randomColor = constants_2.rand[Math.floor(Math.random() * constants_2.rand.length)];
                session = {
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
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(session)), true)];
            case 5:
                insertedSession = _d.sent();
                if (!(insertedSession && insertedSession.insertedCount > 0)) return [3 /*break*/, 14];
                // if( req.params.nsp.toString() == 'hrm.sbtjapan.com')console.log('session inserted');
                // console.log("User Creating")
                session = insertedSession.ops[0];
                event = 'Visitor Connected';
                token = req.params.deviceID;
                if (exists && (!exists.length) && !returningVisitor) {
                    token = req.params.deviceID + ((session._id) ? session._id : session.id);
                    req.params.deviceID = token;
                    //Visitor.insertVisitor(req.params, session.nsp);
                }
                session.deviceID = token;
                _b = (_a = Promise).all;
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CONNECTED, (session._id) ? session._id : session.id, constants_1.ARCHIVINGQUEUE)];
            case 6:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'NewVisitors',
                        deviceinfo: deviceInformation,
                        token: token,
                        params: req.params,
                        nsp: session.nsp,
                        sid: (session._id) ? session._id : session.id
                    }, constants_1.ARCHIVINGQUEUE)];
            case 7: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
            case 8:
                SQSPromises = _d.sent();
                return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
            case 9:
                origin = _d.sent();
                if (!(session.state == 1 && origin && origin.length && origin[0].settings.chatSettings.assignments.botEnabled)) return [3 /*break*/, 11];
                chatBot = {
                    id: "",
                    image: "/cw/assets/img/icons/svg/chatbot-outline.svg",
                    name: "ChatBot",
                    nickname: "ChatBot"
                };
                // session.state = 8;
                session.agent = chatBot;
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session._id, session, 8, session.state)];
            case 10:
                _d.sent();
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
                return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session._id, session)];
            case 12:
                _d.sent();
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
                _d.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                res.status(501).send();
                _d.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                error_2 = _d.sent();
                console.log(error_2);
                console.log('Error in Creating Session');
                res.send(500).send();
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
router.get('/cw/loadTesting', function (req, res) {
    res.set('Cache-Control', 'public, max-age=3600');
    res.sendFile(publicPath + '/public/static/js/' + constants_1.Assets['loaderForLoad.js']);
});
router.get('/cw/license', function (req, res) {
    res.set('Cache-Control', 'public, max-age=3600');
    res.sendFile(publicPath + '/public/static/js/' + constants_1.Assets['loader.js']);
});
router.get('/cw/*', function (req, res) {
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
router.get('/cbam/js/*', function (req, res) {
    //console.log(publicPath + 'public/static/js/' + path.basename(req.path));
    res.set('Cache-Control', 'public, max-age=3600');
    res.sendFile(publicPath + '/public/static/js/' + path.basename(req.path));
});
router.get('/cbam/html/*', function (req, res) {
    //console.log(publicPath + 'public/static/html/' + path.basename(req.path))
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(publicPath + '/public/static/html/' + path.basename(req.path));
});
router.get('/signupReseller/signUpResellerFrame/*', function (req, res) {
    //console.log(publicPath + 'public/static/html/' + path.basename(req.path))
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(publicPath + '/public/static/html/' + path.basename(req.path));
});
router.get('/cw/css/*', function (req, res) {
    //console.log(Assets);
    res.set('Cache-Control', 'public, max-age=2592000000');
    if (req.hostname == 'localhost' || req.hostname == 'localhost') {
        if (req.url.indexOf('iFrameLayout.css') != -1) {
            res.sendFile(publicPath + '/public/static/assets/css/' + constants_1.Assets[path.basename(req.path)]);
        }
        else {
            res.sendFile(publicPath + '/public/static/assets/css/' + path.basename(req.path));
        }
    }
    else {
        res.sendFile(publicPath + '/public/static/assets/css/' + constants_1.Assets[path.basename(req.path)]);
    }
});
router.get('/cw/js/*', function (req, res) {
    res.set('Cache-Control', 'public, max-age=2592000000');
    if (req.hostname == 'localhost') {
        if (req.url.indexOf('chatWindow.js') != -1) {
            res.sendFile(publicPath + '/public/static/assets/js/' + constants_1.Assets[path.basename(req.path)]);
        }
        else {
            res.sendFile(publicPath + '/public/static/assets/js/' + path.basename(req.path));
        }
    }
    else {
        res.sendFile(publicPath + '/public/static/assets/js/' + path.basename(req.path));
    }
});
router.get('/cw/html/*', function (req, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(publicPath + '/public/static/assets/html/' + path.basename(req.path));
});
router.get('/cw/chatWindow/js/*', function (req, res) {
    res.set('Cache-Control', 'public, max-age=2592000000');
    res.sendFile(publicPath + '/public/static/assets/js/' + constants_1.Assets[path.basename(req.path)]);
});
router.get('/cw/images/*', function (req, res) {
    res.set('Cache-Control', 'public, max-age=2592000000');
    res.sendFile(publicPath + '/public/static/assets/images/' + path.basename(req.path));
});
router.get('/cw/fonts/*', function (req, res) {
    res.set('Cache-Control', 'public, max-age=2592000000');
    res.sendFile(publicPath + '/public/static/assets/fonts/' + path.basename(req.path));
});
router.get('/testing_prod', function (req, res) {
    // console.log('testing');
    //  console.log(publicPath + '/' + '__dummy.html');
    res.sendFile(publicPath + '/__dummy_prod.html');
});
router.get('/testing', function (req, res) {
    // console.log('testing');
    //  console.log(publicPath + '/' + '__dummy.html');
    // res.sendFile(publicPath + '/__dummy.html');
    res.send("<script type=\"text/javascript\" async>\n    if (window.__bizC == undefined) window.__bizC = {};\n    window.__bizC['license'] = '8aee0d0be73372274a3a82b79bc3ff9529b1f63e';  var scr = document.createElement('script');\n    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;\n    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);\n</script>");
});
router.get('/testing1', function (req, res) {
    res.send("<script type=\"text/javascript\" async>\n    if (window.__bizC == undefined) window.__bizC = {};\n    window.__bizC['license'] = '445c7857227fa591ba539c83951623959c07a9fe';  var scr = document.createElement('script');\n    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;\n    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);\n</script>");
    // res.sendFile(publicPath + '/public/static/assets/html/' + '__dummy.html');
});
router.get('/popup', function (req, res) {
    // console.log('Popup');
    res.sendFile(publicPath + '/public/static/assets/html/' + 'chatWindow.html');
});
router.post('/app_validate/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var temp_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                //console.log('App_validate');
                //   console.log(JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!!JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, companyModel_1.Company.verifylicenseMobile(JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]).license)];
            case 2:
                temp_2 = _a.sent();
                //console.log(JSON.stringify({ nsp: temp[0].name }));
                if (temp_2.length > 0) {
                    res.status(200).send({
                        nsp: temp_2[0].name,
                        settings: temp_2[0].settings.displaySettings,
                        permissions: temp_2[0].settings.chatSettings.permissions
                    });
                }
                else {
                    res.status(401).send();
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log('Error in Loading Script');
                console.log(error_3);
                res.status(401).send();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getsession/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, exisitingSession, iceServers, session, insertedSession, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                body = JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]);
                //console.log(body);
                // console.log('getsession');
                if (body.csid == 'undefined' || body.csid == 'null') {
                    // console.log('No Sid Present');
                    req.body.csid = undefined;
                }
                if (!body || !body.username || !body.email || !body.ip || !body.location || !body.fullCountryName || !body.nsp) {
                    // console.log('Returning 401');
                    res.status(401).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.Exists_contact(body.email)];
            case 1:
                exisitingSession = _a.sent();
                return [4 /*yield*/, iceServersModel_1.iceServersModel.getICEServers()];
            case 2:
                iceServers = _a.sent();
                if (!(exisitingSession && exisitingSession.value)) return [3 /*break*/, 4];
                // if(body.isMobile){
                //     await SessionManager.updateIsMobileBoolean(body.csid, body.isMobile);
                // }
                return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateDeviceToken(exisitingSession.value.id || exisitingSession.value._id, exisitingSession.value.deviceID)];
            case 3:
                // if(body.isMobile){
                //     await SessionManager.updateIsMobileBoolean(body.csid, body.isMobile);
                // }
                _a.sent();
                res.status(200).send({
                    csid: exisitingSession.value.id || exisitingSession.value._id,
                    state: exisitingSession.value.state,
                    agent: exisitingSession.value.agent,
                    cid: exisitingSession.value.conversationID,
                    iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
                });
                return [3 /*break*/, 6];
            case 4:
                session = {
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
                };
                return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.insertSession(JSON.parse(JSON.stringify(session)))];
            case 5:
                insertedSession = _a.sent();
                if (insertedSession) {
                    // console.log(insertedSession.ops[0]);
                    res.json({
                        csid: insertedSession.ops[0]._id,
                        agent: undefined,
                        cid: undefined,
                        iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
                    });
                }
                else {
                    res.status(501).send();
                }
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                console.log(error_4);
                console.log('Error in Get Session Of Mobile');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/getsession_livechat/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, exisitingSession, iceServers, randomColor, session, insertedSession, origin, token, logEvent, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                body = JSON.parse(Object.keys(JSON.parse(JSON.stringify(req.body)))[0]);
                req.body = body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.Exists_registered(body.email)];
            case 1:
                exisitingSession = _a.sent();
                return [4 /*yield*/, iceServersModel_1.iceServersModel.getICEServers()];
            case 2:
                iceServers = _a.sent();
                if (!(exisitingSession && exisitingSession.value)) return [3 /*break*/, 3];
                console.log('existingSession');
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
                return [3 /*break*/, 12];
            case 3:
                console.log('New Session');
                randomColor = constants_2.rand[Math.floor(Math.random() * constants_2.rand.length)];
                session = {
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
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(session)), true)];
            case 4:
                insertedSession = _a.sent();
                if (!(insertedSession && insertedSession.insertedCount > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
            case 5:
                origin = _a.sent();
                session = insertedSession.ops[0];
                token = req.body.deviceID;
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CONNECTED, (session._id) ? session._id : session.id)];
            case 6:
                logEvent = _a.sent();
                if (!(session.state == 1 && origin && origin.length && origin[0].settings.chatSettings.assignments.botEnabled)) return [3 /*break*/, 8];
                session.state = 8;
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session._id, session, 8, session.state)];
            case 7:
                _a.sent();
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
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session._id, session)];
            case 9:
                _a.sent();
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
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(501).send();
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('Error in Get Session Of Mobile');
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.get('/test/query', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllActiveAgents({ nsp: '/localhost.com' })];
            case 1:
                result = _a.sent();
                res.status(200).send({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.log(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/test/redis_set', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, error_7;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = res.status(200)).send;
                _c = {};
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.GenerateSID('abc.com', 213213213)];
            case 1:
                _b.apply(_a, [(_c.result = _d.sent(), _c)]);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _d.sent();
                console.log(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/test/redis_get', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, error_8;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = res.status(200)).send;
                _c = {};
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.GetID('_abc.com_213213213')];
            case 1:
                _b.apply(_a, [(_c.result = _d.sent(), _c)]);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _d.sent();
                console.log(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('agents/fixCount/:value', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        value = req.params.fixcount;
        WorkersManager_1.WorkerManager.SetFixCount = value;
        res.send({ status: 'ok', fixCount: WorkersManager_1.WorkerManager.GetFixCount });
        return [2 /*return*/];
    });
}); });
router.post('agents/checkSID/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        try {
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            res.header("Access-Control-Allow-Headers", "content-type");
            res.header('Access-Control-Allow-Methods', 'GET');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Vary', 'Origin, Access-Control-Request-Headers');
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            if (!req.body.sid) {
                res.status(401).send();
                return [2 /*return*/];
            }
            result = __biZZCMiddleWare_1.__BIZZC_REDIS.Exists(req.body.sid);
            if (result)
                res.status(200).send({ status: 'ok' });
            else
                res.status(401).send();
        }
        catch (error) {
            res.status(401).send();
            console.log(error);
            console.log('error in checkingSID');
        }
        return [2 /*return*/];
    });
}); });
//agent authentication routes
router.post('/validateCode', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accesscode, agent, checkActivation, continueProcess, authPermissions, clientIp_1, exists, acceptingChats, activeRooms, permissions, groups, teams, isOwner, Agent, insertedSession, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //console.log('get User');
                //console.log(req.headers.referer);
                if (!req.body.code)
                    return [2 /*return*/, res.status(401).send({ status: 'invalidCode' })];
                req.body.code = decodeURIComponent(req.body.code);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 20, , 21]);
                return [4 /*yield*/, agentModel_1.Agents.ValidateCode(req.body.code)];
            case 2:
                accesscode = _a.sent();
                if (!!accesscode) return [3 /*break*/, 3];
                res.status(401).send({ status: 'invalidCode' });
                return [3 /*break*/, 19];
            case 3: return [4 /*yield*/, agentModel_1.Agents.GetAgentByEmail(accesscode.email.toLowerCase())];
            case 4:
                agent = _a.sent();
                checkActivation = void 0;
                if (!(agent && agent.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, companyModel_1.Company.getCompany(agent[0].nsp)];
            case 5:
                checkActivation = _a.sent();
                _a.label = 6;
            case 6:
                if (!(agent && agent.length && checkActivation && !checkActivation[0].deactivated)) return [3 /*break*/, 18];
                continueProcess = false;
                authPermissions = checkActivation[0].settings.authentication;
                // Case IF the user is superadmin then ignore the SSO check
                if (agent[0].role == 'superadmin') {
                    continueProcess = true;
                }
                else {
                    if (authPermissions.suppressionList.includes(agent[0].email)) {
                        continueProcess = true;
                    }
                    else {
                        if (!authPermissions[agent[0].role].enableSSO) {
                            continueProcess = true;
                        }
                        else {
                            clientIp_1 = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
                            //console.log(clientIp.toString());
                            //console.log(req.headers['x-forwarded-for']);
                            if (authPermissions.allowedIPs.filter(function (ip) { return ip == clientIp_1.toString(); }).length)
                                continueProcess = true;
                        }
                    }
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveSessionAgentByEmail(agent[0].email)];
            case 7:
                exists = _a.sent();
                if (!continueProcess) return [3 /*break*/, 16];
                if (!(agent.length && exists.length)) return [3 /*break*/, 8];
                //console.log('Returning Existing sessions');
                agent[0].csid = exists[0]._id;
                if (req.params.loginUrl)
                    agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
                else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1)
                    agent[0].loginUrl = req.headers.referer;
                // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
                res.send(agent);
                return [2 /*return*/];
            case 8:
                if (!(agent.length && !(exists.length))) return [3 /*break*/, 14];
                acceptingChats = !(agent[0].applicationSettings)
                    ? true
                    : agent[0].applicationSettings.acceptingChatMode;
                activeRooms = [];
                return [4 /*yield*/, companyModel_1.Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role)];
            case 9:
                permissions = _a.sent();
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email)];
            case 10:
                groups = _a.sent();
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email)];
            case 11:
                teams = _a.sent();
                return [4 /*yield*/, companyModel_1.Company.isOwner(agent[0].nsp, agent[0].email)];
            case 12:
                isOwner = _a.sent();
                Agent = {
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
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true)];
            case 13:
                insertedSession = _a.sent();
                if (insertedSession) {
                    agent[0].csid = insertedSession.ops[0]._id;
                    agent[0].callingState = insertedSession.ops[0].callingState;
                    agent[0].isOwner = insertedSession.ops[0].isOwner;
                    agent[0].groups = insertedSession.ops[0].groups;
                    agent[0].teams = insertedSession.ops[0].teams;
                    agentModel_1.Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
                    contactModel_1.Contacts.updateStatus(Agent.email, Agent.nsp, true);
                }
                else {
                    res.status(501).send();
                    return [2 /*return*/];
                }
                if (req.params.loginUrl)
                    agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
                else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1)
                    agent[0].loginUrl = req.headers.referer;
                res.send(agent);
                return [2 /*return*/];
            case 14:
                res.status(401).send({ status: 'invalidCode' }).end();
                return [2 /*return*/];
            case 15: return [3 /*break*/, 17];
            case 16:
                //console.log(agent[0].email + ' is not authorized!');
                res.status(401).send({ status: 'invalidCode' }).end();
                return [2 /*return*/];
            case 17: return [3 /*break*/, 19];
            case 18:
                res.status(401).send({ status: 'no agent found' });
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                error_9 = _a.sent();
                console.log('Error in Get User');
                console.log(error_9);
                res.status(401).send({ status: 'error' });
                return [2 /*return*/];
            case 21: return [2 /*return*/];
        }
    });
}); });
router.post('/authenticate/:csid?', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var exisitingSession, checkActivation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!req.body.csid) return [3 /*break*/, 1];
                return [2 /*return*/, res.send(401)];
            case 1: return [4 /*yield*/, sessionsManager_1.SessionManager.Exists(req.body.csid)];
            case 2:
                exisitingSession = _a.sent();
                checkActivation = void 0;
                if (!(exisitingSession && exisitingSession.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, companyModel_1.Company.getCompany(exisitingSession[0].nsp)];
            case 3:
                checkActivation = _a.sent();
                _a.label = 4;
            case 4:
                // console.log(checkActivation);
                //if (checkActivation && checkActivation[0].deactivated) res.status(401).send();
                //else
                if (exisitingSession) {
                    if (exisitingSession.length > 0) {
                        contactModel_1.Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
                        res.status(200).send(exisitingSession[0].callingState);
                        return [2 /*return*/];
                    }
                    else {
                        res.status(401).send(401);
                        return [2 /*return*/];
                    }
                }
                else {
                    return [2 /*return*/, res.status(401).send(401)];
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getUser', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var iceServers, agent, checkActivation, continueProcess, authPermissions, clientIp_2, exists, code, insertedCode, acceptingChats, activeRooms, permissions, groups, teams, isOwner, Agent, insertedSession, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('get User');
                console.log(req.body);
                if (!req.body.email || !req.body.password)
                    return [2 /*return*/, res.status(401).send({ status: 'invalidparameters' })];
                req.body.email = decodeURIComponent(req.body.email);
                req.body.password = decodeURIComponent(req.body.password);
                return [4 /*yield*/, iceServersModel_1.iceServersModel.getICEServers()];
            case 1:
                iceServers = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 26, , 27]);
                return [4 /*yield*/, agentModel_1.Agents.AuthenticateUser(req.body.email, req.body.password)];
            case 3:
                agent = _a.sent();
                checkActivation = void 0;
                if (!(agent && agent.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, companyModel_1.Company.getCompany(agent[0].nsp)];
            case 4:
                checkActivation = _a.sent();
                _a.label = 5;
            case 5:
                if (!(agent && checkActivation && !checkActivation[0].deactivated)) return [3 /*break*/, 24];
                continueProcess = false;
                authPermissions = checkActivation[0].settings.authentication;
                //Case IF the user is superadmin then ignore the SSO check
                if (agent[0].role == 'superadmin') {
                    continueProcess = true;
                }
                else {
                    if (authPermissions.suppressionList.includes(agent[0].email)) {
                        continueProcess = true;
                    }
                    else {
                        if (!authPermissions[agent[0].role].enableSSO) {
                            continueProcess = true;
                        }
                        else {
                            clientIp_2 = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
                            //console.log(clientIp.toString());
                            //console.log(req.headers['x-forwarded-for']);
                            if (authPermissions.allowedIPs.filter(function (ip) { return ip == clientIp_2.toString(); }).length)
                                continueProcess = true;
                        }
                    }
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveSessionAgentByEmail(req.body.email)];
            case 6:
                exists = _a.sent();
                if (!(continueProcess && authPermissions[agent[0].role].TwoFA)) return [3 /*break*/, 13];
                if (!agent.length) return [3 /*break*/, 11];
                code = new mongodb_1.ObjectID().toHexString();
                return [4 /*yield*/, agentModel_1.Agents.InsertCode(code, req.body.email.toLowerCase())];
            case 7:
                insertedCode = _a.sent();
                if (!(insertedCode && insertedCode.insertedCount)) return [3 /*break*/, 9];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendaccesscode', code: code, email: req.body.email.toLowerCase() })];
            case 8:
                _a.sent();
                res.status(203).send({ status: 'ok' });
                return [3 /*break*/, 10];
            case 9:
                res.status(501).send();
                _a.label = 10;
            case 10: return [2 /*return*/];
            case 11:
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                return [2 /*return*/];
            case 12: return [3 /*break*/, 23];
            case 13:
                if (!(continueProcess && !authPermissions[agent[0].role].TwoFA)) return [3 /*break*/, 22];
                if (!(agent.length && exists.length)) return [3 /*break*/, 14];
                //console.log('Returning Existing sessions');
                agent[0].csid = exists[0]._id;
                agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined;
                if (req.params.loginUrl)
                    agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
                else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1)
                    agent[0].loginUrl = req.headers.referer;
                // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
                res.send(agent);
                return [2 /*return*/];
            case 14:
                if (!(agent.length && !(exists.length))) return [3 /*break*/, 20];
                acceptingChats = !(agent[0].applicationSettings)
                    ? true
                    : agent[0].applicationSettings.acceptingChatMode;
                activeRooms = [];
                return [4 /*yield*/, companyModel_1.Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role)];
            case 15:
                permissions = _a.sent();
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email)];
            case 16:
                groups = _a.sent();
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email)];
            case 17:
                teams = _a.sent();
                return [4 /*yield*/, companyModel_1.Company.isOwner(agent[0].nsp, agent[0].email)];
            case 18:
                isOwner = _a.sent();
                Agent = {
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
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true)];
            case 19:
                insertedSession = _a.sent();
                if (insertedSession) {
                    agent[0].csid = insertedSession.ops[0]._id;
                    agent[0].callingState = insertedSession.ops[0].callingState;
                    agent[0].isOwner = insertedSession.ops[0].isOwner;
                    agent[0].groups = insertedSession.ops[0].groups;
                    agent[0].teams = insertedSession.ops[0].teams;
                    agentModel_1.Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
                    contactModel_1.Contacts.updateStatus(Agent.email, Agent.nsp, true);
                }
                else {
                    res.status(501).send();
                    return [2 /*return*/];
                }
                if (req.params.loginUrl)
                    agent[0].loginUrl = decodeURIComponent(req.body.loginUrl);
                else if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1)
                    agent[0].loginUrl = req.headers.referer;
                agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined;
                res.send(agent);
                return [2 /*return*/];
            case 20:
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                return [2 /*return*/];
            case 21: return [3 /*break*/, 23];
            case 22:
                //console.log(agent[0].email + ' is not authorized!');
                res.status(401).send({ status: 'unauthorized' }).end();
                return [2 /*return*/];
            case 23: return [3 /*break*/, 25];
            case 24:
                // console.log('Second Else');
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                return [2 /*return*/];
            case 25: return [3 /*break*/, 27];
            case 26:
                error_10 = _a.sent();
                console.log('Error in Get User');
                console.log(error_10);
                res.status(401).send({ status: 'error' });
                return [2 /*return*/];
            case 27: return [2 /*return*/];
        }
    });
}); });
router.post('/registerAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company, agent, pkg, totalAgents, exists, writeResult, packet, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 16, , 17]);
                if (!(!req.body.first_name ||
                    !req.body.last_name ||
                    !req.body.nickname ||
                    !req.body.username ||
                    !req.body.password ||
                    !req.body.email ||
                    !req.body.gender ||
                    !req.body.nsp ||
                    !req.body.token)) return [3 /*break*/, 1];
                res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Invalid parameters' });
                return [3 /*break*/, 15];
            case 1: return [4 /*yield*/, companyModel_1.Company.getCompanyByNSPandToken(req.body.nsp, req.body.token)];
            case 2:
                company = _a.sent();
                if (!(company && company.length)) return [3 /*break*/, 14];
                agent = {
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
                return [4 /*yield*/, companyModel_1.Company.getPackages(agent.nsp)];
            case 3:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.agents.quota != -1)) return [3 /*break*/, 5];
                return [4 /*yield*/, agentModel_1.Agents.GetAgentsCount(agent.nsp)];
            case 4:
                totalAgents = _a.sent();
                if (totalAgents && totalAgents.length && pkg[0].package.agents.quota && (totalAgents[0].count >= pkg[0].package.agents.quota) && (totalAgents[0].count >= pkg[0].package.agents.limit)) {
                    // console.log('Limit Exceeded');
                    res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Limit exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 5;
            case 5: return [4 /*yield*/, agentModel_1.Agents.getAgentByEmail(agent.nsp, agent.email)];
            case 6:
                exists = _a.sent();
                if (!(exists && !exists.length)) return [3 /*break*/, 12];
                return [4 /*yield*/, agentModel_1.Agents.RegisterAgent(agent)];
            case 7:
                writeResult = _a.sent();
                if (!!writeResult) return [3 /*break*/, 8];
                res.send(400).send({ result: false, response_code: 700006, status: 'error', message: 'Could not register agent!' });
                return [3 /*break*/, 11];
            case 8:
                if (!(process.env.NODE_ENV == 'production')) return [3 /*break*/, 10];
                packet = {
                    action: 'newAgent',
                    body: writeResult[0]
                };
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessageToSOLR(packet, 'agent')];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                res.status(200).send({ result: true, response_code: 200, status: 'success', message: 'Agent registered successfully!' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Agent already exists!' });
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                res.status(401).send({ result: false, response_code: 700006, status: 'error', message: 'Invalid token!' });
                _a.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                error_11 = _a.sent();
                console.log(error_11);
                console.log('Error in Register Agent');
                res.status(500).send({ result: false, response_code: 700006, status: 'error', message: 'Internal server error!' });
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
router.post('/deactivateAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company, exists, agent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!(!req.body.email || !req.body.token || !req.body.nsp)) return [3 /*break*/, 1];
                res.status(401).send({ result: false, response_code: 700006, status: 'error', message: "Invalid Request!" });
                return [3 /*break*/, 8];
            case 1: return [4 /*yield*/, companyModel_1.Company.getCompanyByNSPandToken(req.body.nsp, req.body.token)];
            case 2:
                company = _a.sent();
                if (!(company && company.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, agentModel_1.Agents.getAgentByEmail(company[0].name, req.body.email)];
            case 3:
                exists = _a.sent();
                if (!(exists && exists.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, agentModel_1.Agents.DeActivateAgent(exists[0].email, exists[0].nsp)];
            case 4:
                agent = _a.sent();
                if (agent && agent.value) {
                    res.status(200).send({ result: true, response_code: 200, status: 'success', message: 'Agent deactivated successfully!' });
                }
                else {
                    res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Agent could not be deactivated!' });
                }
                return [3 /*break*/, 6];
            case 5:
                res.status(400).send({ result: false, response_code: 700006, status: 'error', message: 'Agent not found!' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ result: false, response_code: 700006, status: 'error', message: 'Invalid token!' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.log(err_1);
                console.log('Error in deactivating Agent');
                res.status(500).send({ result: false, response_code: 700006, status: 'error', message: 'Internal server error!' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.get('/getPassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, html;
    return __generator(this, function (_a) {
        try {
            url = (process.env.NODE_ENV == 'production') ? 'https://app.beelinks.solutions' : (process.env.NODE_ENV == 'development') ? 'https://dev.beelinks.solutions' : 'http://localhost:8005';
            html = "\n    <script>\n    function getDetails(e) {\n      e.preventDefault();\n      var previousTable = document.getElementById('dataTable');\n      if (previousTable) previousTable.remove();\n      var xhttp = new XMLHttpRequest();\n      var formData = document.getElementById(\"dataForm\");\n      let obj = {\n        email: formData.elements['email'].value,\n        password: formData.elements['password'].value,\n        useremail: formData.elements['useremail'].value\n      }\n      xhttp.open(\"POST\", \"" + url + "/getPassword\", false);\n      xhttp.setRequestHeader(\"Content-type\", \"application/json\");\n      xhttp.send(JSON.stringify(obj));\n      // if (xhttp.status == 200) {\n        var table = document.createElement(\"table\");\n        table.id = 'dataTable';\n        var response = JSON.parse(xhttp.responseText);\n        var tr = document.createElement(\"tr\");\n        Object.keys(response).map(function(key) {\n          var th = document.createElement(\"th\");\n          var t = document.createTextNode(key);\n          th.appendChild(t);\n          tr.appendChild(th);\n        });\n        table.appendChild(tr);\n        var tr = document.createElement(\"tr\");\n        Object.keys(response).map(function(key) {\n          var td = document.createElement(\"td\");\n          var t = document.createTextNode(response[key]);\n          td.appendChild(t);\n          tr.appendChild(td);\n        });\n        table.appendChild(tr);\n        document.body.appendChild(table);\n      // } else {\n      //   // alert(xhttp.responseText)\n      //   var t = document.createTextNode(xhttp.responseText);\n      //   document.body.appendChild(t);\n      // }\n    }\n    </script>\n    <style>\n      table {\n        font-family: arial, sans-serif;\n        border-collapse: collapse;\n        width: 100%;\n      }\n\n      td, th {\n        border: 1px solid #dddddd;\n        text-align: left;\n        padding: 8px;\n      }\n\n      tr:nth-child(even) {\n        background-color: #dddddd;\n      }\n    </style>\n    <form id=\"dataForm\" name=\"dataForm\" onsubmit=\"return getDetails(event)\">\n      <label for=\"email\">Email:</label>\n      <input type=\"text\" id=\"email\" name=\"email\" placeholder=\"email\" autocomplete=\"off\"><br><br>\n      <label for=\"password\">Password:</label>\n      <input type=\"password\" id=\"password\" name=\"password\" placeholder=\"password\" autocomplete=\"off\"><br><br>\n      <label for=\"password\">Details for:</label>\n      <input type=\"text\" id=\"useremail\" name=\"useremail\" placeholder=\"email\" autocomplete=\"off\"><br><br>\n      <input type=\"submit\" value=\"Submit\">\n    </form>\n   ";
            res.send(html);
        }
        catch (err) {
            console.log('Error in getting password');
            console.log(err);
            res.status(401).send();
        }
        return [2 /*return*/];
    });
}); });
router.post('/getPassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authAgent, clientIp, agent, code, responseObj, responseObj, responseObj, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                // console.log(req.body);
                if (!req.body.email || !req.body.password || !req.body.useremail)
                    return [2 /*return*/, res.status(401).send({ status: 'error', msg: 'Invalid parameters!' })];
                return [4 /*yield*/, agentModel_1.Agents.AuthenticateUser(req.body.email, req.body.password)];
            case 1:
                authAgent = _a.sent();
                clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
                if (!(authAgent && authAgent.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(req.body.useremail)];
            case 2:
                agent = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.getAccessCode(req.body.useremail)];
            case 3:
                code = _a.sent();
                if (!(agent && agent.length)) return [3 /*break*/, 5];
                responseObj = {
                    status: 'success',
                    _id: agent[0]._id,
                    email: agent[0].email,
                    password: agent[0].password,
                    nsp: agent[0].nsp,
                    role: agent[0].role,
                    accesscode: code
                };
                return [4 /*yield*/, reportsModel_1.ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp)];
            case 4:
                _a.sent();
                res.send(responseObj);
                return [3 /*break*/, 7];
            case 5:
                responseObj = { status: 'error', msg: 'Agent not found!' };
                return [4 /*yield*/, reportsModel_1.ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp)];
            case 6:
                _a.sent();
                res.send(responseObj);
                _a.label = 7;
            case 7: return [3 /*break*/, 10];
            case 8:
                responseObj = { status: 'error', msg: 'Invalid credentials!' };
                return [4 /*yield*/, reportsModel_1.ReportsModel.insertPasswordLog(req.body.email, req.body.useremail, JSON.stringify(responseObj), responseObj.status, clientIp)];
            case 9:
                _a.sent();
                res.send(responseObj);
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                err_2 = _a.sent();
                console.log('Error in getting password');
                console.log(err_2);
                res.status(401).send({ status: 'error', msg: 'Internal server error!' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/auth', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(!req.body.email || !req.body.password || !req.body.nsp)) return [3 /*break*/, 1];
                res.status(401).send({ status: 'error', msg: 'Invalid credentials!' });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, companyModel_1.Company.setAuthToken(req.body.email, req.body.password, req.body.nsp)];
            case 2:
                company = _a.sent();
                if (company && company.value) {
                    res.send({ status: 'ok', token: company.value.companyToken });
                }
                else {
                    res.send({ status: 'error', msg: 'Could not create token!' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                console.log('Error in setting/getting auth token');
                res.status(401).send({ status: 'error', msg: 'Internal server error!' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
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
exports.StaticRoutes = router;
//# sourceMappingURL=staticRoutes.js.map