"use strict";
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
exports.__BIZZ_TIMEOUT_MANAGER = exports.__BIZZ_REST_REDIS_PUB = exports.__biZZC_Core = exports.__BIZZC_REDIS = void 0;
var ticketScenariosModel_1 = require("./../models/ticketScenariosModel");
var ticketTemplateModel_1 = require("./../models/ticketTemplateModel");
/* Author : Saad Ismail Shaikh
   Date   : 18-1-2015
   WARNING : Please Don Not Edit File Unless You Know Application Flow.
*/
/* ---------------------------------------------- Note (Important) ------------------------------------------
// |       --MiddleWare Sit on top of Controller Acts as Partial Controller.                                 |
// |      -- A Request Will be denied controlled from Here.                                                   |
// |      -- With The Help of Body Parsing This Layer will Decide on                                          |
// |      -- which Route/Controller a Request should be directed.                                             |
// -----------------------------------------------------------------------------------------------------------
// Express is used to Create Node Server and handling Routes (Controller Logic of MVC is implemented here)
*/
var express = require("express");
// Body Parser is used to parse Request Url body
var bodyParser = require("body-parser");
// import Common Routes
var Routes = require("./config/routes");
var Constants = require("./config/constants");
var database_1 = require("./config/database");
var Analytics_Logs_DB_1 = require("./config/databses/Analytics-Logs-DB");
var visitorModel_1 = require("../models/visitorModel");
var agentModel_1 = require("../models/agentModel");
var contactModel_1 = require("../models/contactModel");
var sessionsManager_1 = require("./server/sessionsManager");
var conversationModel_1 = require("../models/conversationModel");
var visitorSessionmodel_1 = require("../models/visitorSessionmodel");
var agentSessionModel_1 = require("../models/agentSessionModel");
var companyModel_1 = require("../models/companyModel");
var caseModel_1 = require("../models/ChatBot/caseModel");
var tokensModel_1 = require("../models/tokensModel");
var stateMachineModel_1 = require("../models/ChatBot/stateMachineModel");
var workflowModel_1 = require("../models/ChatBot/workflowModel");
var agentConversationModel_1 = require("../models/agentConversationModel");
var tagsModel_1 = require("../models/tagsModel");
var TicketgroupModel_1 = require("../models/TicketgroupModel");
var ticketsModel_1 = require("../models/ticketsModel");
var contactConversationModel_1 = require("../models/contactConversationModel");
var knowledgeBaseModel_1 = require("../models/knowledgeBaseModel");
var mailingListModel_1 = require("../models/mailingListModel");
var widgetMarketingModel_1 = require("../models/widgetMarketingModel");
var addressBookModel_1 = require("../models/addressBookModel");
var iceServersModel_1 = require("../models/iceServersModel");
var reportsModel_1 = require("../models/reportsModel");
var eventLogs_1 = require("../models/eventLogs");
var resellerModel_1 = require("../models/resellerModel");
var contactSessionsManager_1 = require("./server/contactSessionsManager");
var intentModel_1 = require("../models/ChatBot/intentModel");
var entityModel_1 = require("../models/ChatBot/entityModel");
var synonymModel_1 = require("../models/ChatBot/synonymModel");
var tPhraseModel_1 = require("../models/ChatBot/tPhraseModel");
var storyModel_1 = require("../models/ChatBot/storyModel");
var responseModel_1 = require("../models/ChatBot/responseModel");
var respFuncModel_1 = require("../models/ChatBot/respFuncModel");
var actionModel_1 = require("../models/ChatBot/actionModel");
var regexModel_1 = require("../models/ChatBot/regexModel");
var assignmentRuleModel_1 = require("../models/assignmentRuleModel");
var FormDesignerModel_1 = require("../models/FormDesignerModel");
var TemplateDesignModel_1 = require("../models/TemplateDesignModel");
var customFieldsModel_1 = require("../models/customFieldsModel");
var teamsModel_1 = require("../models/teamsModel");
var FeedBackSurveyModel_1 = require("../models/FeedBackSurveyModel");
var emailActivations_1 = require("../models/emailActivations");
var SLAPolicyModel_1 = require("../models/SLAPolicyModel");
var AgentConversationStatus_1 = require("../models/AgentConversationStatus");
var redis_1 = require("../redis/redis");
var ChatsDB_1 = require("./config/databses/ChatsDB");
var Companies_DB_1 = require("./config/databses/Companies-DB");
var TicketsDB_1 = require("./config/databses/TicketsDB");
var Marketing_DB_1 = require("./config/databses/Marketing-DB");
var redis_pub_sub_1 = require("../redis/redis-pub-sub");
var AgentsDB_1 = require("./config/databses/AgentsDB");
var WorkersManager_1 = require("./server/WorkersManager");
var packagesModel_1 = require("../models/packagesModel");
var stockModel_1 = require("../models/stockModel");
var orders_1 = require("../models/orders");
var emailOwnerModel_1 = require("../models/emailOwnerModel");
var campaignMgtModel_1 = require("../models/campaignMgtModel");
// child.on('message', (data) => { console.log('data recieved'); })
var cors = require('cors');
var compression = require('compression');
var __biZZCMiddleWare = /** @class */ (function () {
    function __biZZCMiddleWare() {
        this.ConcurrentChatLimit = 20;
        this.application = express();
        //Set Port
        this.application.set('port', Constants.port);
    }
    __biZZCMiddleWare.GetInstance = function () {
        if (!__biZZCMiddleWare.Instance) {
            __biZZCMiddleWare.Instance = new __biZZCMiddleWare();
            return __biZZCMiddleWare.Instance;
        }
        else {
            return __biZZCMiddleWare.Instance;
        }
    };
    __biZZCMiddleWare.prototype.InitApplication = function () {
        return __awaiter(this, void 0, void 0, function () {
            var archiveDbase, ticketsDB, chatsDB, dbase, agentsDB, marketingDB, companiesDB, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        console.log('Environment: ' + process.env.NODE_ENV);
                        console.log('DB Address: ' + process.env.DB_ADDRESS);
                        return [4 /*yield*/, Analytics_Logs_DB_1.ArchivingDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://reportdb.beelinks.solutions:27017/' : undefined)];
                    case 1:
                        archiveDbase = _a.sent();
                        return [4 /*yield*/, TicketsDB_1.TicketsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://ticketsdb.beelinks.solutions:27017/' : undefined)];
                    case 2:
                        ticketsDB = _a.sent();
                        return [4 /*yield*/, ChatsDB_1.ChatsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)];
                    case 3:
                        chatsDB = _a.sent();
                        return [4 /*yield*/, database_1.DataBaseConfig.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)];
                    case 4:
                        dbase = _a.sent();
                        return [4 /*yield*/, AgentsDB_1.AgentsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)];
                    case 5:
                        agentsDB = _a.sent();
                        return [4 /*yield*/, Marketing_DB_1.MarketingDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)];
                    case 6:
                        marketingDB = _a.sent();
                        return [4 /*yield*/, Companies_DB_1.CompaniesDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)];
                    case 7:
                        companiesDB = _a.sent();
                        console.log('Request Handler Connecting Database First Instance');
                        if (!(dbase && archiveDbase && chatsDB && marketingDB && ticketsDB && companiesDB && agentsDB)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.InitCollections()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9: throw new Error('Error connecting database');
                    case 10:
                        // await this.InitCollections();
                        //console.log('After init Collections');
                        /*
                        ====================== NOTE =========================
                        //All The Rest Communication Should Go In Following Function
                        //For Nested Routes for example /api/method follow the steps below.
                        1. First Add Routes in Controller along with their method Type
                        2. Grab Your Router as Export member in '/config/routes'
                        3. Add Your Api Router and use Imported Router Object Accordingly.
                        =====================================================
                        */
                        this.RegisterMiddleWare();
                        //console.log('After RegisterMiddleWare');
                        return [2 /*return*/, this.application];
                    case 11:
                        error_1 = _a.sent();
                        //console.log(error);
                        console.log('Error in Initializing Application');
                        //server.close();
                        throw new Error(error_1);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    __biZZCMiddleWare.prototype.RegisterMiddleWare = function () {
        var _this = this;
        this.application.use(function (req, res, next) {
            if (req.get('x-amz-sns-message-type')) {
                req.headers['content-type'] = 'application/json';
            }
            next();
        });
        // Parse url query string as json
        this.application.use(bodyParser.json());
        //application.use(cors());
        // Extended property allows to have embedded object in query string URI.
        // See Following Reference
        //https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
        this.application.use(bodyParser.urlencoded({
            extended: true
        }));
        // Middle Ware Handler To hand Cross Origin Angular Requests;
        //In Both The Cases They Request Files but they Don't need To Generate Session On Fetch
        this.application.use(function (req, res, next) {
            if (req.method === 'OPTIONS') {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type,Authorization");
                    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Connection', 'keep-alive');
                    res.header('Content-Length', '0');
                    res.header('Date', new Date().toISOString());
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                res.status(204);
                res.end();
            }
            else {
                //       console.log('Called Server');
                next();
            }
        });
        // if ((process.env.NODE_ENV != 'production')) {
        this.application.use(compression());
        this.application.use(cors({ credentials: true, origin: ['http://localhost:8001', 'http://localhost:4200', 'http://localhost:4201', 'http://192.168.20.73:4200', 'https://admin.beelinks.solutions', 'https://reseller.beelinks.solutions', 'http://192.168.20.100:4200', 'http://192.168.20.6:4200', , 'http://localhost:8001', 'https://ca741ca3.ngrok.io', 'https://b525abd8.ngrok.io', 'https://5bc2637a.ngrok.io'] }));
        // }
        this.application.use('/', Routes.StaticRoutes);
        this.application.use('/agent', Routes.agentRoutes);
        this.application.use('/api/chats', Routes.chatRoutes);
        this.application.use('/api/tickets', Routes.ticketRoutes);
        this.application.use('/api/bulkManagement', Routes.bulkManagementRoutes);
        this.application.use('/api/icon', Routes.iconIntegrationRoutes);
        this.application.use('/api/visitor', Routes.visitorRoutes);
        this.application.use('/api/crm', Routes.crmRoutes);
        this.application.use('/api/orders', Routes.ordersRoutes);
        this.application.use('/contact', Routes.contactRoutes);
        // this.application.use('/tickets', Routes.ticketRoutes)
        this.application.use('/register', Routes.registerRoutes);
        this.application.use('/ticketFB', Routes.FBRoutes);
        this.application.use('/admin', Routes.adminRoutes);
        this.application.use('/reseller', Routes.resellerRoutes);
        this.Application.use('/knowledgebase', Routes.KnowledgeBase);
        this.Application.use('/chatBot', Routes.chatBotRoutes);
        this.Application.use('/formActions', Routes.formActionRoutes);
        this.application.use('/displayScript', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var script, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.getScript(req.body.nsp)];
                    case 1:
                        script = _a.sent();
                        res.json({ payload: script });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Display Script');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        this.application.get('*', function (req, res) {
            res.status(401).send('what???');
        });
    };
    __biZZCMiddleWare.prototype.RegisterSocketMiddleWare = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    __biZZCMiddleWare.prototype.InitCollections = function (reconnect) {
        if (reconnect === void 0) { reconnect = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 55, , 56]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.Initialize(reconnect)];
                    case 1:
                        _a.sent();
                        /**
                         * @Note : @Analytics_DB
                         */
                        //#region Analytics DB
                        return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.Initialize()];
                    case 2:
                        /**
                         * @Note : @Analytics_DB
                         */
                        //#region Analytics DB
                        _a.sent();
                        return [4 /*yield*/, agentSessionModel_1.agentSessions.Initialize()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, eventLogs_1.EventLogs.Initialize()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, visitorModel_1.Visitor.Initialize()];
                    case 5:
                        _a.sent();
                        //#endregion
                        /**
                         * @Note : @AgentsDB
                         */
                        /* #region  AgentsDB */
                        return [4 /*yield*/, agentModel_1.Agents.Initialize()];
                    case 6:
                        //#endregion
                        /**
                         * @Note : @AgentsDB
                         */
                        /* #region  AgentsDB */
                        _a.sent();
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.Initialize()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.Initialize()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, contactModel_1.Contacts.Initialize()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.Initialize()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.Initialize()];
                    case 11:
                        _a.sent();
                        /* #endregion */
                        /**
                         * @Note : @CHATS_DB
                         */
                        //#region Chats Db
                        return [4 /*yield*/, conversationModel_1.Conversations.Initialize()];
                    case 12:
                        /* #endregion */
                        /**
                         * @Note : @CHATS_DB
                         */
                        //#region Chats Db
                        _a.sent();
                        return [4 /*yield*/, stockModel_1.Stock.Initialize()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, tagsModel_1.TagsModel.Initialize()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.Initialize()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, regexModel_1.regexModel.Initialize()];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, respFuncModel_1.respFuncModel.Initialize()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, intentModel_1.intentModel.Initialize()];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, entityModel_1.entityModel.Initialize()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, synonymModel_1.synonymModel.Initialize()];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, responseModel_1.responseModel.Initialize()];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, storyModel_1.storyModel.Initialize()];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, actionModel_1.actionModel.Initialize()];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.Initialize()];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, caseModel_1.CaseModel.Initialize()];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.Initialize()];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.Initialize()];
                    case 27:
                        _a.sent();
                        //#endregion
                        /**
                         * @Note : @COMPANY_DB
                         */
                        // //#region Company DB - Remaining
                        // 1. Tokens
                        // 2. iceServers
                        // 3. mailingList
                        return [4 /*yield*/, tokensModel_1.Tokens.Initialize()];
                    case 28:
                        //#endregion
                        /**
                         * @Note : @COMPANY_DB
                         */
                        // //#region Company DB - Remaining
                        // 1. Tokens
                        // 2. iceServers
                        // 3. mailingList
                        _a.sent();
                        return [4 /*yield*/, packagesModel_1.PackagesModel.Initialize()];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, iceServersModel_1.iceServersModel.Initialize()];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, mailingListModel_1.MailingList.Initialize()];
                    case 31:
                        _a.sent();
                        // 5. appTokensCAL
                        // await Webhooks.Initialize()
                        // 6. Website Related Data
                        // 8. resellers
                        return [4 /*yield*/, resellerModel_1.Reseller.Initialize()];
                    case 32:
                        // 5. appTokensCAL
                        // await Webhooks.Initialize()
                        // 6. Website Related Data
                        // 8. resellers
                        _a.sent();
                        // 4. defaultPermissions
                        // 7. Companies
                        // 8. CustomFields
                        return [4 /*yield*/, companyModel_1.Company.Initialize()];
                    case 33:
                        // 4. defaultPermissions
                        // 7. Companies
                        // 8. CustomFields
                        _a.sent();
                        return [4 /*yield*/, customFieldsModel_1.CustomFields.Initialize()];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, orders_1.Orders.Initialize()];
                    case 35:
                        _a.sent();
                        //#endregion
                        /**
                         * @Note : @Ticket_DB
                         */
                        //#region Tickets DB
                        // 1.  Tickets
                        // 2.  TicketMessages
                        // 3.  EmailBlackList
                        // 4.  EmailReceipants
                        // 8.  Emailsignatures
                        return [4 /*yield*/, ticketsModel_1.Tickets.Initialize()];
                    case 36:
                        //#endregion
                        /**
                         * @Note : @Ticket_DB
                         */
                        //#region Tickets DB
                        // 1.  Tickets
                        // 2.  TicketMessages
                        // 3.  EmailBlackList
                        // 4.  EmailReceipants
                        // 8.  Emailsignatures
                        _a.sent();
                        // 6.  TicketGroups
                        // 14. ruleSets
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.Initialize()];
                    case 37:
                        // 6.  TicketGroups
                        // 14. ruleSets
                        _a.sent();
                        // 7.  Teams
                        // 11. ticketScenarios
                        return [4 /*yield*/, teamsModel_1.TeamsModel.Initialize()];
                    case 38:
                        // 7.  Teams
                        // 11. ticketScenarios
                        _a.sent();
                        return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.Initialize()];
                    case 39:
                        _a.sent();
                        // 9.  feedBackSurvey
                        // 10. slaPolicy
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.Initialize()];
                    case 40:
                        // 9.  feedBackSurvey
                        // 10. slaPolicy
                        _a.sent();
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.Initialize()];
                    case 41:
                        _a.sent();
                        // 12. ticketTemplate
                        return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.Initialize()];
                    case 42:
                        // 12. ticketTemplate
                        _a.sent();
                        // 13. emailActivations
                        return [4 /*yield*/, emailActivations_1.EmailActivations.Initialize()];
                    case 43:
                        // 13. emailActivations
                        _a.sent();
                        return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.Initialize()];
                    case 44:
                        _a.sent();
                        //#endregion
                        /**
                         * @Note : @MARKETING_DB
                         */
                        //#region MarketingDB
                        return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.Initialize()];
                    case 45:
                        //#endregion
                        /**
                         * @Note : @MARKETING_DB
                         */
                        //#region MarketingDB
                        _a.sent();
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.Initialize()];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.Initialize()];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, addressBookModel_1.AddressBookModel.Initialize()];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.Initialize()];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.Initialize()];
                    case 50:
                        _a.sent();
                        //#endregion
                        return [4 /*yield*/, caseModel_1.CaseModel.Initialize()];
                    case 51:
                        //#endregion
                        _a.sent();
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.Initialize()];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.Initialize()];
                    case 53:
                        _a.sent();
                        //Wrong Collection Please Verify
                        return [4 /*yield*/, reportsModel_1.ReportsModel.Initialize()];
                    case 54:
                        //Wrong Collection Please Verify
                        _a.sent();
                        //#endregion
                        return [2 /*return*/, true];
                    case 55:
                        error_3 = _a.sent();
                        console.log('Error in InitCollections');
                        throw new Error(error_3);
                    case 56: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(__biZZCMiddleWare.prototype, "Application", {
        get: function () {
            return this.application;
        },
        enumerable: false,
        configurable: true
    });
    __biZZCMiddleWare.prototype.destroyCollections = function () {
        try {
            sessionsManager_1.SessionManager.Destroy();
        }
        catch (err) {
            console.log(err);
            console.log('Error in destroying collections');
        }
    };
    return __biZZCMiddleWare;
}());
exports.__BIZZC_REDIS = new redis_1.REDISCLIENT();
exports.__biZZC_Core = __biZZCMiddleWare.GetInstance();
redis_pub_sub_1.REDISPUBSUB.CreateQueue(Constants.REDISMQURL, Constants.REDISMQPORT).then(function (data) {
    exports.__BIZZ_REST_REDIS_PUB = data;
});
exports.__BIZZ_TIMEOUT_MANAGER = new WorkersManager_1.WorkerManager();
exports.__BIZZ_TIMEOUT_MANAGER.StartVisitorsWorker();
Object.seal(__biZZCMiddleWare);
//# sourceMappingURL=__biZZCMiddleWare.js.map