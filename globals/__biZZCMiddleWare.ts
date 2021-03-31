import { TicketScenariosModel } from './../models/ticketScenariosModel';
import { TicketTemplateModel } from './../models/ticketTemplateModel';

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
import * as express from "express";


// Body Parser is used to parse Request Url body
import * as bodyParser from "body-parser";

// import Common Routes
import * as Routes from "./config/routes";


import * as Constants from "./config/constants"


import { Db } from "mongodb";
import { DataBaseConfig } from "./config/database";
import { ArchivingDB } from "./config/databses/Analytics-Logs-DB";


import { Visitor } from "../models/visitorModel";
import { Agents } from "../models/agentModel";
import { Contacts } from "../models/contactModel"
import { SessionManager } from './server/sessionsManager';
import { Conversations } from '../models/conversationModel';
import { visitorSessions } from '../models/visitorSessionmodel';
import { agentSessions } from '../models/agentSessionModel';
import { Company } from '../models/companyModel';
import { CaseModel } from '../models/ChatBot/caseModel';
import { Tokens } from "../models/tokensModel";
import { StateMachineModel } from "../models/ChatBot/stateMachineModel";
import { WorkFlowsModel } from "../models/ChatBot/workflowModel";
import { AgentConversations } from "../models/agentConversationModel";
import { TagsModel } from "../models/tagsModel";
import { TicketGroupsModel } from "../models/TicketgroupModel";


//Service Import
import { EmailService } from '../services/emailService'
import { Tickets } from "../models/ticketsModel";
import { ContactConversations } from "../models/contactConversationModel";
import { KnowledgeBaseModel } from "../models/knowledgeBaseModel";
import { MailingList } from "../models/mailingListModel";
import { WidgetMarketingModel } from "../models/widgetMarketingModel";
import { AddressBookModel } from "../models/addressBookModel";
import { iceServersModel } from "../models/iceServersModel";
import { ReportsModel } from "../models/reportsModel";
import { EventLogs } from "../models/eventLogs";
import { Reseller } from "../models/resellerModel";
import { ContactSessionManager } from "./server/contactSessionsManager";
import { intentModel } from "../models/ChatBot/intentModel";
import { entityModel } from "../models/ChatBot/entityModel";
import { synonymModel } from "../models/ChatBot/synonymModel";
import { tPhraseModel } from "../models/ChatBot/tPhraseModel";
import { storyModel } from "../models/ChatBot/storyModel"
import { responseModel } from "../models/ChatBot/responseModel";
import { respFuncModel } from "../models/ChatBot/respFuncModel"
import { actionModel } from "../models/ChatBot/actionModel";
import { regexModel } from "../models/ChatBot/regexModel";
import { AutomaticEngagement } from "../actions/agentActions/AutomaticEngagement";
import { AssignmentRules } from "../models/assignmentRuleModel";
import { FormDesignerModel } from "../models/FormDesignerModel";
import { EmailDesignTemplates } from "../models/TemplateDesignModel";
import { CustomFields } from "../models/customFieldsModel";
import { TeamsModel } from "../models/teamsModel";
import { FeedBackSurveyModel } from "../models/FeedBackSurveyModel";
import { EmailActivations } from "../models/emailActivations";
import { SLAPolicyModel } from "../models/SLAPolicyModel";
import { AgentConversationStatus } from "../models/AgentConversationStatus";
import { REDISCLIENT } from "../redis/redis";
import { ChatsDB } from './config/databses/ChatsDB';
import { CompaniesDB } from './config/databses/Companies-DB';
import { TicketsDB } from './config/databses/TicketsDB';
import { MarketingDB } from './config/databses/Marketing-DB';
import { Webhooks } from '../models/webhooksModel';
import { REDISPUBSUB } from '../redis/redis-pub-sub';
import { AgentsDB } from './config/databses/AgentsDB';
import { __biZZC_SQS } from '../actions/aws/aws-sqs';
import * as CP from 'child_process';
import { WorkerManager } from './server/WorkersManager';
import { PackagesModel } from '../models/packagesModel';
import { Stock } from '../models/stockModel';
import { Orders } from '../models/orders';
import { EmailOwnerModel } from '../models/emailOwnerModel';
import { CampaignManagementModel } from '../models/campaignMgtModel';

// child.on('message', (data) => { console.log('data recieved'); })



const cors = require('cors');
const compression = require('compression')


class __biZZCMiddleWare {
  //Static Initialization

  private static Instance: __biZZCMiddleWare;
  public ConcurrentChatLimit = 20;

  private application;

  private eService!: EmailService;


  private constructor() {
    this.application = express();
    //Set Port
    this.application.set('port', Constants.port);
  }

  public static GetInstance(): __biZZCMiddleWare {
    if (!__biZZCMiddleWare.Instance) {
      __biZZCMiddleWare.Instance = new __biZZCMiddleWare();
      return __biZZCMiddleWare.Instance
    } else {
      return __biZZCMiddleWare.Instance;
    }
  }

  public async InitApplication(): Promise<any> {
    try {


      console.log('Environment: ' + process.env.NODE_ENV);
      console.log('DB Address: ' + process.env.DB_ADDRESS);
      // console.log((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'not Db Address' : '!production');

      //Creating Single Database Connection And Pooling Connection to Rest of The Application;
      let archiveDbase: Db = await ArchivingDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://reportdb.beelinks.solutions:27017/' : undefined);
      // let agentsDB: Db = await AgentsDB.connect('mongodb://agentsdb.beelinks.solutions:27017/');
      let ticketsDB: Db = await TicketsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://ticketsdb.beelinks.solutions:27017/' : undefined);

      let chatsDB: Db = await ChatsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined);
      let dbase: Db = await DataBaseConfig.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined);
      let agentsDB: Db = await AgentsDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined);
      let marketingDB: Db = await MarketingDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined);
      let companiesDB: Db = await CompaniesDB.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : undefined)

      console.log('Request Handler Connecting Database First Instance');
      /*
      ====================== NOTE =========================
      //All The Collection Should Go In Following Function To Keep The Singleton Nature of Database Object.
      //To Effectively Use Connection Pooling of MongoDb Driver.
      =====================================================
      */
      //    console.log('Database!');

      //     console.log(dbase);
      if (dbase && archiveDbase && chatsDB && marketingDB && ticketsDB && companiesDB && agentsDB) {
        await this.InitCollections();
      } else {
        throw new Error('Error connecting database')
      }
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

      return this.application;

    } catch (error) {
      //console.log(error);
      console.log('Error in Initializing Application');
      //server.close();
      throw new Error(error);
    }
  }


  private RegisterMiddleWare() {

    this.application.use((req, res, next) => {
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
    this.application.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        if (req.headers.origin) {
          res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
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


    this.application.use('/displayScript', async (req, res) => {

      try {
        let script = await Company.getScript(req.body.nsp);
        res.json({ payload: script });

      } catch (error) {
        console.log('Error in Display Script');
        console.log(error);
      }

    });


    this.application.get('*', function (req, res) {
      res.status(401).send('what???');
    });


  }

  public async RegisterSocketMiddleWare() {


    //Following IS A MicroService Connecter To Recieve External Event from Email Service.
    //Right Now A Special NameSpace is Reservered For Following Service and
    //External Microservice acting as Client to send Data on its NameSpace(Channel);

    //TODO : USE PROPER TCP Connection to Recieve External Data OR Create A Resfull Server to Server Webhook TO Recieve Data.
  }

  public async InitCollections(reconnect = false): Promise<boolean> {
    //These Are Models Which Needs To Be Used With Socket Events
    //Since They Dont Have Any Controller.
    try {

      await SessionManager.Initialize(reconnect);
      /**
       * @Note : @Analytics_DB
       */
      //#region Analytics DB
      await visitorSessions.Initialize();
      await agentSessions.Initialize();
      await EventLogs.Initialize();
      await Visitor.Initialize();
      //#endregion

      /**
       * @Note : @AgentsDB
       */
      /* #region  AgentsDB */
      await Agents.Initialize();
      await AgentConversations.Initialize();
      await AgentConversationStatus.Initialize();
      await Contacts.Initialize();
      await ContactConversations.Initialize();
      await ContactSessionManager.Initialize();
      /* #endregion */

      /**
       * @Note : @CHATS_DB
       */
      //#region Chats Db
      await Conversations.Initialize();
      await Stock.Initialize();
      await TagsModel.Initialize();
      await AssignmentRules.Initialize();
      await regexModel.Initialize();
      await respFuncModel.Initialize();
      await intentModel.Initialize();
      await entityModel.Initialize();
      await synonymModel.Initialize();
      await responseModel.Initialize();
      await storyModel.Initialize();
      await actionModel.Initialize();
      await tPhraseModel.Initialize();
      await CaseModel.Initialize();
      await StateMachineModel.Initialize();
      await WorkFlowsModel.Initialize();
      //#endregion

      /**
       * @Note : @COMPANY_DB
       */
      // //#region Company DB - Remaining
      // 1. Tokens
      // 2. iceServers
      // 3. mailingList
      await Tokens.Initialize();
      await PackagesModel.Initialize();
      await iceServersModel.Initialize();
      await MailingList.Initialize();
      // 5. appTokensCAL
      // await Webhooks.Initialize()
      // 6. Website Related Data

      // 8. resellers
      await Reseller.Initialize();

      // 4. defaultPermissions
      // 7. Companies
      // 8. CustomFields
      await Company.Initialize();
      await CustomFields.Initialize();
      await Orders.Initialize();

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
      await Tickets.Initialize();
      // 6.  TicketGroups
      // 14. ruleSets
      await TicketGroupsModel.Initialize();
      // 7.  Teams
      // 11. ticketScenarios
      await TeamsModel.Initialize();
      await TicketScenariosModel.Initialize();
      // 9.  feedBackSurvey
      // 10. slaPolicy
      await FeedBackSurveyModel.Initialize();
      await SLAPolicyModel.Initialize();
      // 12. ticketTemplate
      await TicketTemplateModel.Initialize();
      // 13. emailActivations
      await EmailActivations.Initialize();
      await FormDesignerModel.Initialize();
      //#endregion


      /**
       * @Note : @MARKETING_DB
       */
      //#region MarketingDB
      await WidgetMarketingModel.Initialize();
      await KnowledgeBaseModel.Initialize();
      await EmailDesignTemplates.Initialize();
      await AddressBookModel.Initialize();
      await EmailOwnerModel.Initialize();
      await CampaignManagementModel.Initialize();


      //#endregion

      await CaseModel.Initialize();
      await StateMachineModel.Initialize();
      await WorkFlowsModel.Initialize();

      //Wrong Collection Please Verify
      await ReportsModel.Initialize();
      //#endregion
      return true;
    } catch (error) {
      console.log('Error in InitCollections');
      throw new Error(error);
    }
  }

  public get Application() {
    return this.application;
  }

  public destroyCollections() {
    try {
      SessionManager.Destroy();
    } catch (err) {
      console.log(err);
      console.log('Error in destroying collections');

    }
  }
}

export const __BIZZC_REDIS = new REDISCLIENT()
export const __biZZC_Core = __biZZCMiddleWare.GetInstance();
export let __BIZZ_REST_REDIS_PUB: REDISPUBSUB;
REDISPUBSUB.CreateQueue(Constants.REDISMQURL, Constants.REDISMQPORT).then(data => {
  __BIZZ_REST_REDIS_PUB = data;
})

export const __BIZZ_TIMEOUT_MANAGER = new WorkerManager();
__BIZZ_TIMEOUT_MANAGER.StartVisitorsWorker();

Object.seal(__biZZCMiddleWare);