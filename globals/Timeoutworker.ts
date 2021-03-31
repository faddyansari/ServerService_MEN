

// console.log('Timeout Worker Called at :', new Date());
require('source-map-support').install()

import * as REDIS from "redis";
import { MongoClient, Db, Collection, ObjectId, ObjectID, InsertOneWriteOpResult, FindAndModifyWriteOpResultObject, DeleteWriteOpResultObject } from "mongodb";
import { EventLogMessages, DynamicEventLogs, ComposedENUM } from "./config/enums";
import { REDISPUBSUB } from "../redis/redis-pub-sub";
import { REDISMQPORT, REDISMQURL, ARCHIVINGQUEUE, REDISURL, AnalytcisNewQueue } from "./config/constants";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { MessageSchema } from "../schemas/messageSchema";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
import { AgentSessionSchema } from "../schemas/agentSessionSchema";
import { SQSPacket } from "../schemas/sqsPacketSchema";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import { Tickets } from "../models/ticketsModel";
import { TicketLogSchema } from "../schemas/ticketLogSchema";
import { group } from "console";
import * as request from 'request-promise';
import { ComposedTicketENUM, TicketLogMessages } from "./config/ticketEnums";






class VisitorTimeoutWorker {

  /**
   * @Databases
   */
  private sendNotification = false;
  private databaseURI = 'mongodb://localhost:27017/'
  private sessionDB!: Db;
  private chatsDB!: Db;
  private companiesDB!: Db;
  private ArchivingDB!: Db;
  private ticketsDB!: Db;
  // private marketingDB!: Db;
  private agentsDB!: Db;

  private ticketsDB_ref!: MongoClient;
  // private marketingDB_ref!: MongoClient;
  private agentsDB_ref!: MongoClient;
  private sessionDB_ref!: MongoClient;
  private chatsDB_ref!: MongoClient;
  private companiesDB_ref!: MongoClient;
  private ArchivingDB_ref!: MongoClient;

  /**
   * @Collections
   */
  private sessionsCollection!: Collection;
  private testCollection!: Collection;
  private collectionTicketMessages!: Collection;
  private chatsCollection!: Collection;
  private companiesCollection!: Collection;
  private agentsCollection!: Collection;
  private messagesCollection!: Collection;
  private ticketsCollection!: Collection;
  private ticketsGroupCollection!: Collection;
  private teamCollection!: Collection;
  private ArchvingAgentCollection!: Collection;
  private ArchivingVisitorsCollection!: Collection;
  private LeftVisitorCollection!: Collection;
  private VisitorCollection!: Collection;
  private tokensCollection!: Collection;

  /**ICONN Collections */
  // private SalesPersonCollection!: Collection;
  // private DestinationCollection!: Collection;
  // private PortsCollection!: Collection;
  // private CustomerTypeCollection!: Collection;
  // private PhoneTypeCollection!: Collection;
  // private IconnSyncInfoCollection!: Collection;
  constructor() {
    // console.log('INitialized WOrker');
  }


  //#region Initializers
  private async ConnectDBS() {
    console.log('Connecting DBS');
    this.sessionDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI);
    this.sessionDB = this.sessionDB_ref.db((process.env.NODE_ENV == 'production') ? 'sessionsDB' : "local");

    this.chatsDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI);
    this.chatsDB = this.chatsDB_ref.db((process.env.NODE_ENV == 'production') ? 'chatsDB' : "chatsDB");

    this.companiesDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)
    this.companiesDB = this.companiesDB_ref.db((process.env.NODE_ENV == 'production') ? 'companiesDB' : "companiesDB");
    // console.log((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://52.35.253.158:27017/' : undefined);
    this.ticketsDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://ticketsdb.beelinks.solutions:27017/' : this.databaseURI)
    this.ticketsDB = this.ticketsDB_ref.db((process.env.NODE_ENV == 'production') ? 'local' : "ticketsDB");

    this.agentsDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)
    this.agentsDB = this.ticketsDB_ref.db((process.env.NODE_ENV == 'production') ? 'agentsDB' : "agentsDB");

    this.ArchivingDB_ref = await MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://reportdb.beelinks.solutions:27017/' : this.databaseURI)
    this.ArchivingDB = this.ArchivingDB_ref.db((process.env.NODE_ENV == 'production') ? 'local' : "archivingDB");
  }
  private async GetCollections() {
    this.sessionsCollection = await this.sessionDB.createCollection('sessions');
    // this.testCollection = await this.sessionDB.createCollection('asyncTest');
    // console.log(this.sessionsCollection.collectionName);
    // console.log(this.testCollection.collectionName);

    this.chatsCollection = await this.chatsDB.createCollection('conversations');
    this.messagesCollection = await this.chatsDB.createCollection('messages');
    this.ticketsCollection = await this.ticketsDB.createCollection('tickets');
    this.ticketsGroupCollection = await this.ticketsDB.createCollection('ticketgroups');
    this.collectionTicketMessages = await this.ticketsDB.createCollection('ticketMessages');
    this.teamCollection = await this.ticketsDB.createCollection('teams');
    this.agentsCollection = await this.agentsDB.createCollection('agents');

    this.companiesCollection = await this.companiesDB.createCollection('companies');
    this.tokensCollection = await this.companiesDB.createCollection('tokens')

    this.ArchivingVisitorsCollection = await this.ArchivingDB.createCollection('visitorSessions');
    this.ArchvingAgentCollection = await this.ArchivingDB.createCollection('agentSessions');
    this.LeftVisitorCollection = await this.ArchivingDB.createCollection('leftVisitors');
    this.VisitorCollection = await this.ArchivingDB.createCollection('visitors');


    // this.SalesPersonCollection = await this.marketingDB.createCollection('ICONNsalesPersons');
    // this.DestinationCollection = await this.marketingDB.createCollection('ICONNdestinationCountries');
    // this.PortsCollection = await this.marketingDB.createCollection('ICONNports');
    // this.CustomerTypeCollection = await this.marketingDB.createCollection('ICONNCustomertype');
    // this.PhoneTypeCollection = await this.marketingDB.createCollection('ICONNPhonertype');
    // this.IconnSyncInfoCollection = await this.marketingDB.createCollection('ICONNSyncInfo');
  }

  //#endregion

  //#region BroadCasting Functions
  public NotifyAllAgents(): string {
    return 'Agents';
  }
  public NotifySingleAgent(session): string {
    try {
      switch (session.type) {
        case 'Visitors':
          return session.agent.id;
        case 'Agents':
          return session.id || session._id;
        default:
          return '';
      }

    } catch (error) {
      console.log('Error in Notifying Single Visitor');
      console.log(error);
      return '';
    }
  }
  public NotifyVisitorSingle(session): string {
    try {
      switch (session.type) {
        case 'Visitors':
          return (session._id as string) || (session.id as string);
        default:
          return '';
      }
    } catch (error) {
      console.log('Error in Notify One Visitors Worker');
      // console.log;
      return '';
    }
  }
  public NotifyAllVisitors(): string {
    return 'Visitors';
  }

  //#endregion


  //#region Conversation Functions
  public async MakeInactive(cid: string) {
    try {
      return this.chatsCollection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        { $set: { inactive: true } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('error in Making Conversation Inactive');
      console.log(error);
    }
  }
  // public async UpdateConversation(conversationID, agentEmail: string, state: number = 2) {

  //     // console.log('UpdateConverSationEmail');
  //     // console.log(agentEmail);
  //     // console.log(conversationID);

  //     let cid: any;
  //     try {
  //         let promises = await Promise.all([
  //             this.chatsCollection.update(
  //                 { _id: new ObjectID(conversationID), ['assigned_to.email']: { $ne: agentEmail } },
  //                 { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
  //                 { upsert: false }),
  //             this.chatsCollection.findOneAndUpdate(
  //                 { _id: new ObjectID(conversationID) },
  //                 {
  //                     $set: {
  //                         agentEmail: agentEmail, state: state, lastPickedTime: new Date().toISOString()
  //                     }
  //                 },
  //                 { returnOriginal: false, upsert: false })
  //         ])
  //         let result = await promises[1];
  //         return result;

  //     } catch (error) {
  //         console.log('Error in Create Conversation');
  //         console.log(error);
  //     }
  // }
  public async getInactiveChat(cid, timeInMinutes, checkCreatedOn) {
    try {
      let date = new Date();
      date.setMinutes(date.getMinutes() - timeInMinutes);
      // console.log(date.toISOString());
      if (this.chatsDB && this.chatsCollection) {

        if (!checkCreatedOn) {
          return await this.chatsCollection.find(
            {
              _id: new ObjectID(cid),
              $and: [
                {
                  lastMessage: { $exists: true },
                  ['lastMessage.date']: { $lte: date.toISOString() },
                  inactive: false
                }
              ]
            }).limit(1).toArray();
        } else {
          return await this.chatsCollection.find(
            {
              _id: new ObjectID(cid),
              $or: [
                { $and: [{ lastMessage: { $exists: true }, ['lastMessage.date']: { $lte: date.toISOString() }, inactive: false }] },
                { createdOn: { $lte: date.toISOString() }, inactive: false }
              ]
            }).limit(1).toArray();

        }

      } else {
        console.log('CHATS DB NOT WORKING IN WORKER');
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation');
      return [];
    }
  }
  public async insertMessage(data) {
    let message: MessageSchema = {
      from: data.from,
      to: data.to,
      body: data.body,
      cid: new ObjectId(data.cid),
      date: data.date,
      type: data.type,
      attachment: (data.attachment) ? true : false,
      filename: (data.attachment) ? data.filename : undefined,
      form: data.form ? data.form : [],
      delivered: (data.delivered) ? true : false,
      sent: (data.sent) ? true : false,
      chatFormData: data.chatFormData ? data.chatFormData : ''
    }
    return await this.messagesCollection.insertOne(message);
  }

  /**
  *
  * @param cid
  * @param message
  * @param options : { insertMessageID : boolean, email : string , MessageId : string | ObjectId }
  */

  public async UpdateLastMessage(cid: string, message: any, options?: any) {
    try {

      let inserMessageID = (options && options.insertMessageID && options.email && options.MessageId) ? true : false
      if (inserMessageID) {
        return await this.chatsCollection.findOneAndUpdate({
          _id: new ObjectID(cid), ['assigned_to.email']: options.email
        }, {
          $set: { lastMessage: message, entertained: true },
          $addToSet: { ['assigned_to.$.messageIds']: { id: new ObjectID(options.MessageId), date: message.date } }
        },
          { returnOriginal: false, upsert: false });

      } else {
        return await this.chatsCollection.findOneAndUpdate(
          {
            _id: new ObjectID(cid),
          },
          {
            $set:
            {
              lastMessage: message, entertained: true
            },
          },
          { returnOriginal: false, upsert: false });

      }



    } catch (error) {
      console.log(error);
      console.log('Error in Updating Last Message');
    }
  }
  public async updateMessageReadCount(cid, seen = false) {
    try {
      if (!seen) return await this.chatsCollection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $inc: { messageReadCount: 1 } }, { returnOriginal: false, upsert: false });
      else return await this.chatsCollection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $set: { messageReadCount: 0 } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Update Message By Count');
      console.log(error);
    }
  }
  public async getMessages1(cid) {
    try {
      // console.log('getting messages');
      // console.log(cid);
      return await this.messagesCollection.find({ cid: new ObjectId(cid.toString()) }).toArray();

    } catch (error) {
      console.log('Error in getting MEssages 1 ');
      console.log(error);
      return [];
    }
  }
  private async CreateLogMessage(message: MessageSchema) {

    try {

      // console.log('Create Message Log : ', message);


      let sender: any = undefined;
      let date = new Date();
      let insertedMessage: InsertOneWriteOpResult<any>;
      date = new Date();
      message.date = date.toISOString();
      //data.type = socket.handshake.session.type;
      // data.delivered = true
      // data.sent = false
      insertedMessage = await this.insertMessage(message);

      // let allconvo = await Conversations.UpdateAllLastMessagenByCID(data.cid);
      //console.log("messageinsertedID");
      //console.log(messageinsertedID);
      // allconvo = await Conversations.getConversationBySid(data.cid);
      // console.log(allconvo);

      //await Conversations.abc();
      await this.updateMessageReadCount(message.cid, true);

      if (insertedMessage.insertedCount > 0) {
        return insertedMessage.ops[0];
      } else {
        console.log('Error in Sending Message Message Not Inserted');
      }
      return undefined;

    } catch (error) {
      console.log(error);
      console.log('Error in Creating Message');
      // console.log(session.state);
      return undefined;
    }


  }
  public async UpdateConversation(cid: string, makeInactive: boolean, data: any) {

    try {
      // console.log('Updating Conversation State : ', cid);
      // console.log(makeInactive);
      if (!makeInactive) {
        data['inactive'] = false;
        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: JSON.parse(JSON.stringify(data)) },
          { returnOriginal: false, upsert: false });

      } else {
        data['inactive'] = true
        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: JSON.parse(JSON.stringify(data)) },
          { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation Generic in worker');
    }

  }

  public async MakeConversationActive(cid: string) {

    try {
      // console.log('Updating Conversation State : ', cid);
      // console.log(makeInactive);

      return this.chatsCollection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        { $set: { inactive: false } },
        { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation Generic in worker');
    }

  }

  public async UpdateConversationState(cid: string, state: number, makeInactive) {
    try {
      // console.log('Updating Conversation State : ', cid);
      // console.log(makeInactive);
      if (!makeInactive) {

        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: { state: state, inactive: false } },
          { returnOriginal: false, upsert: false });

      } else {
        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: { state: state, inactive: true } },
          { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation');
    }
  }
  public async GetChattingAgentsForInvite(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      // console.log('Getting Chatting Agetns For Invite : ', session);
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.sessionDB && this.sessionsCollection) {
        let obj: any = {
          nsp: session.nsp,
          type: 'Agents',
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
          acceptingChats: true
        };
        // console.log('Search QUery : ', obj);
        agent = await this.sessionsCollection.find(obj).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }
      // console.log('Agent In Getting Chatting Agents for Invite : ', agent);
      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }
  public async SetState(sid: string | ObjectID, state, previousState) {
    try {
      let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
        { _id: new ObjectID(sid), state: 1 },
        {
          $set: { state: state, previousState: previousState }
        },
        { returnOriginal: false, upsert: false }
      );
      // console.log('Set State : ', updatedVisitorSession.value);
      if (updatedVisitorSession && updatedVisitorSession.value) {
        if (updatedVisitorSession.value.previousState) this.UpdateChatStateHistory(updatedVisitorSession.value);
        return updatedVisitorSession.value;
      }
      else return undefined

    } catch (error) {
      console.log('error in Setting State Worker');
      console.log(error);
      return undefined;
    }
  }
  public async getConversationClientID(str: string, nsp: string) {

    let allConversationHashes = await this.chatsCollection.find({ nsp: nsp, clientID: { $exists: true } }, { fields: { clientID: 1 } }).toArray();


    let obj: any = {};
    if (allConversationHashes && allConversationHashes.length) allConversationHashes.map(hash => {
      obj[hash.clientID] = true
    })

    let duplicate = false
    let randomString = '';
    do {

      let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      if (obj && obj[randomString]) duplicate = true
    }
    while (duplicate)

    return randomString;
  }
  public async createConversation(conversationID: ObjectID, visitorEmail: string, sessionid: string, nsp: string, visitorColor, agentEmail?: string, visitorName?: string, state: number = 1, deviceID?: string, greetingMessage?: any): Promise<any> {
    try {
      //console.log(greetingMessage);
      // let agent;
      // if (agentEmail) agent = await Agents.getAgentsByEmail(agentEmail)

      // console.log(agent[0]);

      let conversation = await this.chatsCollection.insertOne({
        _id: conversationID,
        deviceID: deviceID,
        visitorEmail: visitorEmail,
        visitorName: visitorName,
        nsp: nsp,
        agentEmail: (agentEmail) ? agentEmail : '',
        // agentName: (agent && agent.length) ? (agent[0].nickname || agent[0].username) : '',
        sessionid: sessionid,
        createdOn: new Date().toISOString(),
        state: state,
        messages: [],
        lastMessage: (greetingMessage) ? greetingMessage : '',
        status: 'ACTIVE',
        messageReadCount: 0,
        viewColor: visitorColor,
        entertained: false,
        assigned_to: (agentEmail) ? [{ email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' }] : [],
        superviserAgents: [],
        inactive: false
      });
      if (conversation && conversation.insertedCount > 0) {
        let clientID;
        if (conversation.insertedId) {
          clientID = await this.getConversationClientID((conversation.ops[0]._id as any).toHexString(), (conversation.ops[0]._id as any).nsp);

          if (clientID) {
            let updatedConversation = await this.SetConversationClientID(conversation.ops[0]._id, nsp, clientID.toString());
            if (updatedConversation && updatedConversation.value) {
              conversation.ops[0].clientID = updatedConversation.value.clientID
            }

          }

        }
        __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: conversation.ops[0] }, ARCHIVINGQUEUE);
        return conversation
      }


    } catch (error) {
      console.log('Error in Create Conversation');
      console.log(error);
    }
  }
  public async SetConversationClientID(cid, nsp, clientID) {
    try {
      return await this.chatsCollection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }
  public async TransferChat(cid, agentEmail: string, lastPickedTime?, makeInactive?: boolean) {
    try {
      let msgReadCount = await this.messagesCollection.count({ cid: new ObjectId(cid.toString()) });

      let promises = await Promise.all([
        await this.chatsCollection.update(
          { _id: new ObjectID(cid), ['assigned_to.email']: { $ne: agentEmail } },
          { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
          { upsert: false }),
        await this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: {
              agentEmail: agentEmail,
              messageReadCount: msgReadCount,
              state: 2,
              lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
              inactive: (makeInactive) ? true : false
            }
          }, { returnOriginal: false, upsert: false })
      ])
      let result = promises[1];
      return result;
    } catch (error) {
      console.log(error);
      console.log('Error in Transfer Chat');
    }
  }



  public async GetSessionForChat(_id: string) {
    try {
      if (this.sessionsCollection) {
        let session = await this.sessionsCollection.find(
          {
            _id: new ObjectId(_id)
          }, {
          fields: {
            _id: 0,
            chatFromUrl: 1,
            fullCountryName: 1,
            isMobile: 1,
            referrer: 1,
            returningVisitor: 1,
            phone: 1
          }
        }).limit(1).toArray();

        if (session && session.length) return session[0]
        else return ''
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Getting All Live Agents');
      console.log(error);
    }

  }

  public async GetConversationById(cid: string) {
    try {
      return await this.chatsCollection.find({ _id: new ObjectId(cid) }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      return [];
    }
  }


  //#endregion


  //#region Companies Functions

  private async GetCompanies() {

    try {
      return this.companiesCollection.find({}).toArray();

    } catch (error) {
      console.log('error in Getting Companies From Worker');
    }


  }
  public async getSettings(nsp: string) {
    return this.companiesCollection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.chatSettings': 1,
        }
      })
      .limit(1).toArray();
  }
  public async DeleteExpiredTokens(): Promise<DeleteWriteOpResultObject | undefined> {
    try {
      return this.tokensCollection.deleteMany({ expireDate: { $lte: new Date().toISOString() } });


    } catch (error) {
      console.log(error);
      console.log('error in Validate Token');
      return undefined
    }
  }
  //#endregion

  //#region Session Collection Functions


  public async FixAgentsCount(type = 'Agents') {
    try {
      (await this.sessionsCollection.find({ type: type, 'permissions.chats.canChat': true }).toArray() as Array<any>).map(async session => {
        let promises = Object.keys(session.rooms).map(async key => {
          let visitorSession = await this.sessionsCollection.find({ _id: new ObjectId(key as string) }).limit(1).toArray();
          if (!visitorSession.length || (visitorSession.length && visitorSession[0].inactive)) delete session.rooms[key];
        });
        await Promise.all(promises);
        session.chatCount = Object.keys(session.rooms).length;
        this.sessionsCollection.save(session);
      });

    } catch (error) {
      console.log(error);
    }
  }
  public async GetVisitorByID(sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitor = await this.sessionsCollection.find({
          _id: new ObjectId(sessionID)
        }).limit(1).toArray();

        if (visitor.length) return visitor[0];
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Get Visitors');
      console.log(error);
    }
  }
  public async GetAgentByID(id: string) {
    try {
      //console.log(id);
      let agent: any = [];
      if (this.sessionDB && this.sessionsCollection) {
        agent = await this.sessionsCollection.find({
          _id: new ObjectId(id)
        }).limit(1).toArray();
      }
      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agent By Id');
      console.log(error);
      return undefined;
    }
  }
  public async GetAgentByIDChatting(id: string) {
    try {
      //console.log(id);
      let agent: any = [];
      if (this.sessionDB && this.sessionsCollection) {
        agent = await this.sessionsCollection.find({
          _id: new ObjectId(id),
          acceptingChats: true,
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
          [`rooms.${(id as any).toString()}`]: { $exists: false },
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
        }).limit(1).toArray();
      }
      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agent By Id');
      console.log(error);
      return undefined;
    }
  }
  public async TransferChatUnmodified(cid, agentEmail, lastPickedTime?) {
    try {
      let msgReadCount = await this.messagesCollection.count({ cid: new ObjectId(cid.toString()) });

      let promises = await Promise.all([
        this.messagesCollection.count({ cid: new ObjectId(cid.toString()) }),
        this.chatsCollection.update(
          { _id: new ObjectID(cid), ['assigned_to.email']: { $ne: agentEmail } },
          { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
          { upsert: false }),
        this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: {
              agentEmail: agentEmail,
              messageReadCount: msgReadCount,
              state: 2,
              lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
              inactive: false
            }
          }, { returnOriginal: false, upsert: false })
      ])
      let result = promises[2];
      return result;
    } catch (error) {
      console.log(error);
      console.log('Error in Transfer Chat');
    }
  }
  public async AssignQueuedVisitor(agentSession: AgentSessionSchema, sid: string, lastTouchedTime: string): Promise<any | undefined> {
    // console.log('AssignQueuedVisitor');
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
          {
            _id: new ObjectId(sid),
            nsp: agentSession.nsp,
            state: 2,
            type: 'Visitors',
            inactive: false,
            //[`rooms.${(sid as any).toString()}`]: { $exists: true },
            lastTouchedTime: new Date(lastTouchedTime).toISOString()
          },
          {
            $set: {
              agent: {
                id: agentSession._id || agentSession.id,
                name: agentSession.nickname,
                image: (agentSession.image) ? agentSession.image : ''
              },
              state: 3,
              previousState: "2",
              lastTouchedTime: new Date().toISOString()
            }
          },
          { returnOriginal: false, upsert: false }
        );
        if (updatedVisitorSession && updatedVisitorSession.value) {
          if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
          let updatedAgent = await this.sessionsCollection.findOneAndUpdate(
            {
              _id: new ObjectId(agentSession.id)
            },
            {
              $set: {
                [`rooms.${(updatedVisitorSession.value._id as any).toString()}`]: ((updatedVisitorSession.value.id || updatedVisitorSession.value._id) as any).toString()
              },
              $inc: {
                chatCount: 1, visitorCount: 1
              }
            },
            { returnOriginal: false, upsert: false }
          )
          if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(sid),
                ['agent.id']: (agentSession._id as string).toString() || (agentSession.id as string).toString(),
                state: 3,
              },
              {
                $set: {
                  agent: {
                    id: '',
                    name: '',
                    image: ''
                  },
                  state: 2
                }
              },
              { returnOriginal: false, upsert: false }
            );
            return undefined;
          }
        }
        else return undefined;
      } else {
        return undefined;
      }
    }
    catch (error) {
      console.log('Error in Assign Agent');
      console.log(error);
      return undefined;
    }
  }
  public async AssignAgentByEmail(Visitorsession: VisitorSessionSchema, email: string, conversationID: ObjectID, state?: number): Promise<any | undefined> {
    // console.log('Assigning Agent By Email');
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let updatedAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            nsp: Visitorsession.nsp,
            acceptingChats: true,
            email: email,
            ['permissions.chats.canChat']: true,
            type: 'Agents',
            [`rooms.${(Visitorsession._id as any).toString()}`]: { $exists: false },
            $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
          },
          {
            $set: {
              [`rooms.${((Visitorsession.id || Visitorsession._id) as any).toString()}`]: ((Visitorsession.id || Visitorsession._id) as any).toString()

            },
            $inc: {
              chatCount: 1, visitorCount: 1
            }
          },
          { returnOriginal: false, upsert: false }
        )
        if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
          Visitorsession.previousState = ((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()
          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(Visitorsession.id || Visitorsession._id) },
            {
              $set: {
                agent: {
                  id: updatedAgent.value._id.toString(),
                  name: (updatedAgent.value.nickname) ? updatedAgent.value.nickname : updatedAgent.value.name,
                  image: (updatedAgent.value.image) ? updatedAgent.value.image : ''
                },
                state: (!state) ? 3 : state,
                previousState: (Visitorsession.previousState) ? Visitorsession.previousState : '',
                conversationID: conversationID
              }
            },
            { returnOriginal: false, upsert: false }
          );

          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(updatedAgent.value._id),
                [`rooms.${(Visitorsession._id as any).toString()}`]: { $exists: true }
              },
              {
                $unset: { [`rooms.${(Visitorsession._id as any).toString()}`]: 1 },
                $inc: { chatCount: -1 }
              }, { returnOriginal: false, upsert: false });
            return undefined;
          }
        }
        return undefined;

      } else {
        return undefined;
      }
    }
    catch (error) {
      console.log('Error in Assign Agent');
      console.log(error);
      return undefined;
    }
  }

  public async AssignAgentByEmailCheckBrowsingState(Visitorsession: VisitorSessionSchema, email: string, conversationID: ObjectID, state?: number): Promise<any | undefined> {
    // console.log('Assigning Agent By Email');
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let updatedAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            nsp: Visitorsession.nsp,
            email: email,
            ['permissions.chats.canChat']: true,
            acceptingChats: true
          },
          {
            $set: {
              [`rooms.${(Visitorsession.id || Visitorsession._id as any).toString()}`]: ((Visitorsession.id || Visitorsession._id) as any).toString()

            },
            $inc: {
              chatCount: 1, visitorCount: 1
            }
          },
          { returnOriginal: false, upsert: false }
        )
        if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
          Visitorsession.previousState = ((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()
          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(Visitorsession.id || Visitorsession._id), state: 1 },
            {
              $set: {
                agent: {
                  id: updatedAgent.value._id.toString(),
                  name: (updatedAgent.value.nickname) ? updatedAgent.value.nickname : updatedAgent.value.name,
                  image: (updatedAgent.value.image) ? updatedAgent.value.image : ''
                },
                state: (!state) ? 3 : state,
                previousState: (Visitorsession.previousState) ? Visitorsession.previousState : '',
                conversationID: conversationID
              }
            },
            { returnOriginal: false, upsert: false }
          );

          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(updatedAgent.value._id),
                [`rooms.${(Visitorsession._id as any).toString()}`]: { $exists: true }
              },
              {
                $unset: { [`rooms.${(Visitorsession._id as any).toString()}`]: 1 },
                $inc: { chatCount: -1 }
              }, { returnOriginal: false, upsert: false });
            return undefined;
          }
        }
        return undefined;

      } else {
        return undefined;
      }
    }
    catch (error) {
      console.log('Error in Assign Agent By Browser State');
      console.log(error);
      return undefined;
    }
  }
  public async GetChattingAgents(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.sessionDB && this.sessionsCollection) {
        let obj: any = [{
          nsp: session.nsp,
          type: 'Agents',
          acceptingChats: true,
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }

        }];
        let search: any = {};
        search.$and = obj
        agent = await this.sessionsCollection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }
  public async GetQueuedSession(nsp: string) {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let queuedSession = await this.sessionsCollection.find({
          nsp: nsp,
          state: 2,
          inactive: false
        }).limit(1).toArray();
        if (!queuedSession.length) return undefined;
        else return queuedSession[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Queued session');
      return undefined;
    }
  }
  private async AutoAssignFromQueueAuto(session: VisitorSessionSchema | AgentSessionSchema, agent = false) {

    try {

      let promises = await Promise.all([
        this.GetChattingAgents((session as any)),
        this.GetQueuedSession(session.nsp),
      ]);
      let Agent = promises[0];
      let QueuedSession = promises[1];
      // console.log('Agent : ', Agent);
      // console.log(Queu)
      if (Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession) {
        let UpdatedSessions = await this.AssignQueuedVisitor(Agent, (QueuedSession._id as string), QueuedSession.lastTouchedTime);
        QueuedSession = UpdatedSessions.visitor || undefined;
        Agent = UpdatedSessions.agent || undefined;

        if (QueuedSession && Agent) {
          await this.UpdateChatQueHistory(QueuedSession, 'System');
          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: QueuedSession.id, session: QueuedSession } })

          let Queuedconversation = await this.TransferChatUnmodified(QueuedSession.conversationID, Agent.email);
          if (Queuedconversation) {
            if (Queuedconversation.value) {
              let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
              // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

              Queuedconversation.value.messages = await this.getMessages1(QueuedSession.conversationID);
              let promises = await Promise.all([
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(QueuedSession)], data: Queuedconversation.value }),
                await __BIZZ_REST_REDIS_PUB.SendMessage({
                  action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [this.NotifyVisitorSingle(QueuedSession)], data: {
                    agent: QueuedSession.agent,
                    cid: QueuedSession.conversationID,
                    state: QueuedSession.state,
                    username: QueuedSession.username,
                    email: QueuedSession.email
                  }
                })
              ]);
              return true;
            }
          }
          return true;
        } else return true;
      } else return false;

    } catch (error) {
      console.log(error);
      console.log('error in Assigning From Queue');
      return false;
    }


  }
  private async GetAllQueuedVisitors(nsp: string) {
    try {

      let QueuedSessions: Array<any> = [];
      try {

        if (!nsp) return [];
        if (this.sessionDB && this.sessionsCollection) {
          QueuedSessions = await this.sessionsCollection.find({
            $and: [
              { nsp: nsp },
              { state: 2 },
              { inactive: false }
            ]
          }).limit(100).sort({ lastTouchedTime: 1 }).toArray();
        }
        return QueuedSessions;

      } catch (error) {
        console.log(error);
        console.log('error in GetAllInactiveNonChattingUsers');
        return QueuedSessions;
      }

    } catch (error) {
      console.log(error);
      console.log('Error in All Queued')
    }
  }
  public async GetAllInactiveVisitors(nsp: string, inactivityTimeout: number, chattingVisitors: boolean): Promise<Array<any>> {
    let inactiveSessions: Array<any> = [];
    try {

      if (!nsp) return [];
      if (!isNaN(inactivityTimeout)) {
        let date = new Date();
        date.setMinutes(date.getMinutes() - inactivityTimeout);
        if (this.sessionDB && this.sessionsCollection) {
          inactiveSessions = await this.sessionsCollection.find({
            $and: [
              { nsp: nsp },
              { inactive: false },
              { state: { $in: (chattingVisitors) ? [3, 2] : [1, 4, 5, 8] } },
              { lastTouchedTime: { $lte: date.toISOString() } }
            ]
          }).limit(100).toArray();
        }
      }
      return inactiveSessions;

    } catch (error) {
      console.log(error);
      console.log('error in GetAllInactiveNonChattingUsers');
      return inactiveSessions;
    }
  }
  public async GetALLExpiredSessions(nsp: string, type: string): Promise<Array<any>> {
    try {
      let expiredSessions: any[] = []
      if (this.sessionDB && this.sessionsCollection) {
        if (!nsp && !type) {
          expiredSessions = await this.sessionsCollection.find({
            $and: (type == 'Agents') ?
              [{ expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }] :
              [{ expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }]
          }).limit(100).toArray();
        }
        if (!nsp && type) {
          expiredSessions = await this.sessionsCollection.find({
            $and: (type == 'Agents') ?
              [
                { nsp: nsp },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { nsp: nsp },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]
          }).limit(100).toArray();
        }

        if (nsp && !type) {
          expiredSessions = await this.sessionsCollection.find({
            $and: (type == 'Agents') ?
              [
                { type: type },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { type: type },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]

          }).limit(100).toArray();
        }

        if (nsp && type) {
          expiredSessions = await this.sessionsCollection.find({
            $and: (type == 'Agents') ?
              [
                { nsp: nsp }, { type: type },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { nsp: nsp }, { type: type },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]
          }).limit(100).toArray();
        }
      }
      return expiredSessions;

    } catch (error) {
      console.log(error);
      console.log('Error In Getting Expired Sessions');
      return [];
    }
  }


  public async GetAllActiveAgentsChatting(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.sessionDB && this.sessionsCollection) {
        let obj: any = [{
          nsp: session.nsp,
          acceptingChats: true,
          type: 'Agents',
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
        }];
        let search: any = {};
        search.$and = obj
        agent = await this.sessionsCollection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }




  /**
   *
   * @param _id : string
   * @param obj = Object<{ expiry : string , lasttouchedTime}>
   */
  public async SetVisitorsInactvieNonChatting(_id: string, obj: any): Promise<FindAndModifyWriteOpResultObject<any> | undefined> {
    try {

      if (this.sessionDB && this.sessionsCollection) {
        let inactivesession = await this.sessionsCollection.findOneAndUpdate({
          $and: [{ _id: new ObjectId(_id) }, { lastTouchedTime: obj.lastTouchedTime }]
        }, { $set: { inactive: true, makeActive: false, expiry: obj.expiry } }, { returnOriginal: false, upsert: false });
        return inactivesession;
      }
      else return undefined;

    } catch (error) {
      console.log(error);
      console.log('error in GetAllInactiveNonChattingUsers');
      return undefined;
    }
  }
  public async SetVisitorsInactvieChatting(_id: string, obj: any): Promise<FindAndModifyWriteOpResultObject<any> | undefined> {
    try {

      if (this.sessionDB && this.sessionsCollection) {
        let inactivesession = await this.sessionsCollection.findOneAndUpdate({
          $and: [{ _id: new ObjectId(_id) }, { lastTouchedTime: obj.lastTouchedTime }]
        }, { $set: { inactive: true, makeActive: false, expiry: obj.expiry } }, { returnOriginal: false, upsert: false });
        return inactivesession;
      }
      else return undefined;

    } catch (error) {
      console.log(error);
      console.log('error in GetAllInactiveNonChattingUsers');
      return undefined;
    }
  }
  public async getAgentByEmail(nsp, data): Promise<any | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let agent: any;
        if (data.includes('@')) {
          agent = await this.sessionsCollection.find(
            {
              nsp: nsp,
              email: data
            }
          ).limit(1).toArray();
        } else {
          agent = await this.sessionsCollection.find(
            {
              nsp: nsp,
              _id: new ObjectId(data)
            }
          ).limit(1).toArray();
        }

        if (agent.length) return agent[0];
        else return undefined;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Agent From Email');
      return undefined;
    }
  }

  public async UpdateViewState(tids: Array<string>, nsp: string, viewState: string, ticketlog: TicketLogSchema) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));

      let temp: any;
      if (viewState == 'READ') {
        let datetime = new Date().toISOString();
        await this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp, first_read_date: { $exists: false } }, { $set: { first_read_date: datetime } }, { upsert: false });
        temp = await this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState, last_read_date: datetime }, $push: { ticketlog: ticketlog } }, { upsert: false });
        await this.ticketsCollection.find({ _id: { $in: objectIdArray } }).forEach(x => {
          if (x.assignmentList && x.assignmentList.length) {
            if (x.assignmentList.filter(a => a.assigned_to == ticketlog.updated_by).length) {
              x.assignmentList.filter(a => a.assigned_to == ticketlog.updated_by).sort((a, b) => (Number(new Date(b.assigned_time)) - Number(new Date(a.assigned_time))))[0].read_date = datetime;
            }
          }
          this.ticketsCollection.save(x);
        })
      } else {
        temp = await this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState }, $push: { ticketlog: ticketlog } }, { upsert: false });
      }
      if (temp && temp.modifiedCount) return await this.ticketsCollection.find({ _id: { $in: objectIdArray } }).toArray();
      else return [];
    } catch (error) {
      console.log('Error in Update View State');
      console.log(error);
      return [];
    }
  }

  public async UnseAgentFromVisitor(sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let session = await this.GetVisitorByID(sessionID)
        if (session) {
          let visitor = await this.sessionsCollection.findOneAndUpdate(
            {
              _id: new ObjectId(sessionID)
            },
            {
              $set: {
                previousState: ((session.inactive) ? '-' : '') + session.state.toString(),
                state: 2,
                agent: { id: '', nickname: '', image: '' }
              }
            }, { returnOriginal: false, upsert: false }
          )

          if (visitor && visitor.value) {
            if (visitor.value.previousState) await this.UpdateChatStateHistory(visitor.value)
            return visitor.value;
          }
          else return undefined;
        }
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Unsetting Agent From Visitor');
      console.log(error);
    }
  }
  public async MarkReactivate(sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitor = await this.sessionsCollection.findOneAndUpdate(
          {
            _id: new ObjectId(sessionID),
            inactive: true
          },
          {
            $set: { makeActive: false, inactive: false }
          }, { returnOriginal: false, upsert: false }
        )

        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Mark Re-activating Session in Worker');
      console.log(error);
      return undefined;
    }
  }
  public async AssignChatFromInactive(session: VisitorSessionSchema, AgentEmail?: string, state?: number) {


    try {

      // console.log('AssignChatFromInactive');

      let convo = await this.GetConversationById(session.conversationID)

      if (!convo.length) return false;

      let oldagent;
      oldagent = await this.getAgentByEmail(session.nsp, convo[0].agentEmail)
      // if (oldagent) console.log(oldagent);

      let UpdatedSessions;
      if (AgentEmail) {
        UpdatedSessions = await this.AllocateAgentPriority(session, AgentEmail, session.conversationID, (state) ? state : undefined);

      } else {

        UpdatedSessions = await this.AllocateAgentWorker(session, new ObjectID(session.conversationID), [], (state) ? state : undefined);
      }


      if (UpdatedSessions && UpdatedSessions.agent) {
        let newAgent = UpdatedSessions.agent;

        let visitor = UpdatedSessions.visitor;
        let conversation = (newAgent.email) ? await this.TransferChat(visitor.conversationID, newAgent.email, false, false) : undefined;
        // console.log('Transfer Chat Normal (Assign Chat From Inactive ): ', (conversation) ? conversation.value : '');
        if (conversation && conversation.value) {

          (conversation.value.messageReadCount)
            ? conversation.value.messages = await this.getMessages1((visitor as VisitorSessionSchema).conversationID)
            : [];

          let payload = { id: (visitor as VisitorSessionSchema)._id || (visitor as VisitorSessionSchema).id, session: visitor }
          let event = '';
          if (newAgent.email != AgentEmail) event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT, { newEmail: newAgent.email, oldEmail: (AgentEmail) ? AgentEmail : '' })
          else event = ComposedENUM(DynamicEventLogs.CHAT_RE_ASSIGNED, { newEmail: newAgent.email, oldEmail: '' })

          let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((visitor as VisitorSessionSchema)._id) ? (visitor as VisitorSessionSchema)._id : (visitor as VisitorSessionSchema).id);
          // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
          let chatEvent = '';
          (newAgent.email != AgentEmail) ? chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname) : chatEvent = 'Chat Re-assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
          let insertedMessage = await this.CreateLogMessage({
            from: visitor.agent.name,
            to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
            body: chatEvent,
            type: 'Events',
            cid: (visitor.conversationID) ? visitor.conversationID : '',
            attachment: false,
            date: new Date().toISOString(),
            delivered: true,
            sent: true
          });


          if (insertedMessage) conversation.value.messages.push(insertedMessage)

          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: payload })


          if (oldagent && (oldagent.nickname != newAgent.nickname) && (oldagent.email != newAgent.email)) {
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(visitor)], data: conversation.value })

            if (conversation && conversation.value)
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: conversation.value } })

          }
          else await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationActive', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: conversation.value } })

          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [this.NotifyVisitorSingle(visitor as VisitorSessionSchema)], data: { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent } })



        }
        return true;
      } else if (UpdatedSessions && !UpdatedSessions.agent) {

        let visitor = UpdatedSessions.visitor;
        let conversation = await this.UpdateConversationState(visitor.conversationID, 2, false);
        return true;
      }
      return false;


    } catch (error) {
      console.log(error);
      console.log('error in Assign Chat To Priority Abstraction');
    }

  }

  public async AssignChatToVisitorAuto(visitor: VisitorSessionSchema, email?: string): Promise<boolean> {

    try {

      let UpdatedSessions = await this.AllocateAgentWorker(visitor, new ObjectID(visitor.conversationID));
      let newAgent = UpdatedSessions.agent;
      visitor = UpdatedSessions.visitor;


      if (UpdatedSessions && newAgent) {
        let conversation = (newAgent.email) ? await this.TransferChat(visitor.conversationID, newAgent.email, false, false) : undefined;
        // console.log('Transfer Chat Normal (AssignChat TO Visitor AUto ): ', (conversation) ? conversation.value : '');
        if (conversation && conversation.value) {

          (conversation.value.messageReadCount)
            ? conversation.value.messages = await this.getMessages1((visitor as VisitorSessionSchema).conversationID)
            : [];

          let payload = { id: (visitor as VisitorSessionSchema)._id || (visitor as VisitorSessionSchema).id, session: visitor }
          // let event = 'Chat auto Assigned to ' + newAgent.email + ' from ' + newAgent.email;
          let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_ASSIGNED_TO, { newEmail: newAgent.email, oldEmail: '' })
          let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((visitor as VisitorSessionSchema)._id) ? (visitor as VisitorSessionSchema)._id : (visitor as VisitorSessionSchema).id);
          // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
          await this.UpdateChatQueHistory(visitor, 'System');
          let chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
          let insertedMessage = await this.CreateLogMessage({
            from: visitor.agent.name,
            to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
            body: chatEvent,
            type: 'Events',
            cid: (visitor.conversationID) ? visitor.conversationID : '',
            attachment: false,
            date: new Date().toISOString(),
            delivered: true,
            sent: true
          })
          // console.log('AssignChatToVisitorAuto');
          //console.log(conversation);
          let promises = await Promise.all([
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: visitor.nsp, roomName: [this.NotifyAllAgents()], data: payload }),
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(visitor)], data: conversation.value }),
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [this.NotifyVisitorSingle(visitor as VisitorSessionSchema)], data: { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent } }),
          ])

        }
      }
      return true;

    } catch (error) {
      console.log(error);
      console.log('Error in AssignChatToVisitor Abstraction');
      return false;
    }


  }





  public async MakeActive(session: VisitorSessionSchema, company: any) {

    try {

      //console.log('Make Active');
      let visitor: any;
      let allAgents: any;


      if (session) {

        let origin = company
        switch (session.state) {
          case 1:
          case 5:


            /**
             * @Procedure :
             * 1. If Inactive then Change to Active
             */
            let mutex = await __BIZZC_REDIS.GenerateSID(session.nsp, (session._id as any).toString());
            if (!mutex) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: (session._id as any).toString(), session: session } })

            break;
          case 2:

            /**
             * @Procedure :
             * 1. If Inactive then Change to Active
             * 2. Check if Agent is Available.
             * 3. If Agent is available then Connect to Agent
             * 4. Else Do Nothing
             */

            allAgents = await this.GetAllActiveAgentsChatting(session);

            if (allAgents) {
              await this.AssignChatToVisitorAuto(session);
            } else {
              await this.MakeConversationActive(session.conversationID);
            }
            //Else Send No Agent


            break;
          case 3:

            /**
             * @Procedure :
             * 1. If Inactive then Change to Active
             * 2. Check if Old Agent is Available.
             * 3. If Old Agent is available then Connect to Agent
             * 4. Find Best Agent.
             * 5. If Best Agent Found then Assign to it.
             * 6. eles move to Unassigned Chat.
             */

            /**
            * @Cases
            * 1. If Visitor Previous he/she was talking to not available
            * 2. If Priority Agent Is set && Available.
            * 3. If Priority rule Matched Assign to Priority Agent
            * 4. If No rule Mathed Then Assign to New Random Agent
            * 5. If No Agent Found Then Move To unAssigned.
            */

            // console.log(session);
            allAgents = await this.GetAllActiveAgentsChatting(session);

            // console.log(allAgents);


            if (!allAgents) {
              /**
               * @Case 5
               */
              let mutex = await __BIZZC_REDIS.GenerateSID(session.nsp, (session._id as any).toString());
              if (mutex) {

                let pendingVisitor = await this.UnseAgentFromVisitor(session.id || session._id);

                if (pendingVisitor) {

                  let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name })
                  let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id);
                  // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                  let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })
                  ])

                  let updatedConversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                  if (updatedConversation) {
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } });
                  }
                }
              } else return;
            } else {
              /**
              * @Cases
              * 1. If Visitor Previous he/she was talking to not available
              * 2. If Priority Agent Is set && Available.
              * 3. If Priority rule Matched Assign to Priority Agent
              * 4. If No rule Mathed Then Assign to New Random Agent
              */

              let agent = await this.GetAgentByID(session.agent.id);
              let assignedAgent: any = undefined;
              let mutex = await __BIZZC_REDIS.GenerateSID(session.nsp, (session._id as any).toString());
              if (mutex) {

                if (agent && agent.acceptingChats && !assignedAgent) assignedAgent = await this.AssignChatFromInactive(session, agent.email)
                else if (origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim() && !assignedAgent)
                  assignedAgent = await this.AssignChatFromInactive(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim());
                else if (!assignedAgent) { assignedAgent = await this.AssignChatFromInactive(session); }

                if (!assignedAgent) {
                  let pendingVisitor = await this.UnseAgentFromVisitor(session.id || session._id);

                  if (pendingVisitor) {

                    let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name })
                    let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id);
                    // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    let promises = await Promise.all([
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } }),
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })
                    ]);

                    let updatedConversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                    if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } });

                  }
                }
              }

            }

            break;
          case 4:

            /**
             * @Cases
             * 1. If Agent Who Invited is available Resume to Same Agent.
             * 2. Else Close Conversation and move to Browsing
             */
            // console.log('Makeing Active State 4');
            allAgents = await this.GetAllActiveAgentsChatting(session);

            if (!allAgents) {
              /**
               * @Case 5
               */
              let mutex = await __BIZZC_REDIS.GenerateSID(session.nsp, (session._id as any).toString());
              if (mutex) {

                let pendingVisitor = await this.UnseAgentFromVisitor(session.id || session._id);

                if (pendingVisitor) {

                  let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name })
                  let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id);
                  // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                  let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })
                  ]);
                  let updatedConversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                  if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } });
                }
              }
            } else {

              /**
              * @Cases
              * 1. If Visitor Previous he/she was talking to not available
              * 2. If Priority Agent Is set && Available.
              * 3. If Priority rule Matched Assign to Priority Agent
              * 4. If No rule Mathed Then Assign to New Random Agent
              */

              let agent = await this.GetAgentByID(session.agent.id);
              let assignedAgent: any = undefined;
              let mutex = await __BIZZC_REDIS.GenerateSID(session.nsp, (session._id as any).toString());
              if (mutex) {

                if (agent && agent.acceptingChats && !assignedAgent) {
                  assignedAgent = await this.AssignChatFromInactive(session, agent.email, session.state);
                }
                else if (origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim()) {
                  assignedAgent = await this.AssignChatFromInactive(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim(), session.state);
                }
                else {
                  assignedAgent = await this.AssignChatFromInactive(session, '', session.state);
                }

                if (!assignedAgent) {
                  let pendingVisitor = await this.UnseAgentFromVisitor(session.id || session._id);

                  if (pendingVisitor) {
                    let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name })
                    let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id);
                    // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    let promises = await Promise.all([
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } }),
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })
                    ]);
                    let updatedConversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                    if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } });

                  }
                }
              }
            }

            break;
          default:
            break;

        }
      }

    } catch (error) {
      console.log(error);
      console.log('Error in Check Active');
      // console.log(session.state);

    }
  }

  public async GetSessionforReActivation(nsp): Promise<any[]> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitor = await this.sessionsCollection.find(
          {
            nsp: nsp,
            makeActive: true,
            inactive: true
          }).limit(100).sort({ lastTouchedTime: 1 }).toArray()

        return visitor;
      } else return [];
    } catch (error) {
      console.log('Error in Unsetting Agent From Visitor');
      console.log(error);
      return [];
    }
  }
  public async UnsetChatFromAgent(session: VisitorSessionSchema) {
    try {
      // console.trace();
      // console.log(this.db);
      // console.log(this.collection);
      if (this.sessionDB && this.sessionsCollection) {
        return this.sessionsCollection.findOneAndUpdate(
          {
            nsp: session.nsp,
            _id: new ObjectID(session.agent.id),
            [`rooms.${((session._id as string).toString())}`]: { $exists: true }
          }, {
          $unset: { [`rooms.${(session._id as string).toString()}`]: 1 },
          $inc: { chatCount: -1 }

        }, { returnOriginal: false, upsert: false }
        );
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Unsetting Chat From Agent');
    }

  }

  public async TransferAgentAuto(visitor, newAgent) {
    try {
      // console.log('Transfering Agent AUto');
      if (this.sessionDB && this.sessionsCollection) {
        let bestAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            _id: newAgent._id,
            [`rooms.${(visitor._id as any).toString()}`]: { $exists: false },
          },
          {
            $set: { [`rooms.${((visitor.id || visitor._id) as any).toString()}`]: ((visitor.id || visitor._id) as any).toString() },
            $inc: { chatCount: 1, visitorCount: 1 }
          }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } }
        )
        if (bestAgent && bestAgent.value) {

          let promises = await Promise.all([
            this.UnsetChatFromAgent(visitor),
            this.sessionsCollection.findOneAndUpdate(
              { _id: new ObjectID(visitor.id || visitor._id) },
              {
                $set: {
                  agent: {
                    id: bestAgent.value._id,
                    name: bestAgent.value.nickname,
                    image: (bestAgent.value.image) ? bestAgent.value.image : ''
                  },
                  state: 3,
                  username: visitor.username,
                  email: visitor.email
                }
              },
              { returnOriginal: false, upsert: false }
            )
          ])
          let oldUpdateAgent = (promises[0]) ? promises[0].value : undefined;
          let updatedVisitor = (promises[1]) ? promises[1].value : undefined;
          return {
            oldAgent: oldUpdateAgent,
            newAgent: bestAgent.value,
            updatedVisitor: updatedVisitor
          }
        } else {
          return undefined;
        }

      }

    } catch (error) {
      console.log(error);
      console.log('error');
      return undefined;
    }
  }

  public async DeleteSession(sid, checkInactive = false) {
    try {
      if (!checkInactive) return await this.sessionsCollection.findOneAndDelete({ _id: new ObjectId(sid) });
      else return await this.sessionsCollection.findOneAndDelete({ _id: new ObjectId(sid), inactive: true, makeActive: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Deleting Session');
      return undefined;
    }
  }
  public async RemoveSession(session: any, unset: boolean) {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let deletedDocument: FindAndModifyWriteOpResultObject<any> | undefined;
        let deleted = false;
        switch (session.type) {
          case 'Agents':
            deletedDocument = await this.DeleteSession(session._id || session.id);
            if (deletedDocument && deletedDocument.value) {
              await this.ArchiveAgentSession(deletedDocument.value);
              return deletedDocument.value;
            }
            return false;
          default:
            deletedDocument = await this.DeleteSession(session._id || session.id, true);
            if (deletedDocument && deletedDocument.value) {

              switch (session.state.toString()) {
                case '3':
                case '4':
                  if (unset) {
                    await this.UnsetChatFromAgent(session);
                  }
                  // if (deletedDocument && deletedDocument.ok) {
                  //     deletedDocument.value['ending_time'] = new Date().toISOString();
                  //     deletedDocument.value['email'] = (SelfAgent && SelfAgent.value) ? SelfAgent.value.email : '';
                  // }
                  break;
                default:
                  // case '1':
                  // case '5':
                  // case '2':
                  // if (deletedDocument && deletedDocument.ok) {
                  //     deletedDocument.value['ending_time'] = new Date().toISOString();
                  // }
                  break;

              }
              await this.ArchiveVisitorSession(deletedDocument.value);
              deleted = true;
              return deleted;
            } else return deleted

        }
      } else return false;

    } catch (error) {
      console.log('Error in Remove Session Worker');
      console.log(error);
      return false;
    }

  }
  public async EndChat(cid, updateState: boolean, session, survey?: any,) {
    try {
      // console.log('End Chat : ', cid);
      // console.log('End Chat : ', updateState);
      // console.log('ENd Chat : ', session);
      if (updateState) {

        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: (!survey) ? { state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { feedback: survey, state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' }
          }, { returnOriginal: false, upsert: false });
      } else {

        return this.chatsCollection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { endingDate: new Date().toISOString(), session: (session) ? session : '' }
          }, { returnOriginal: false, upsert: false });
      }

    } catch (error) {
      console.log(error);
      console.log('Error in End Chat');
    }
  }
  public async EndChatMissed(cid, session, survey?: any,) {
    try {

      return await this.chatsCollection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        {
          $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' } : { endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' }
        }, { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in End Chat Missed');
    }
  }
  public async AddPenaltyTime(cid: string, email: string, lastMessageTime: string) {
    try {
      let lastTime = new Date(lastMessageTime);
      let currentTime = new Date();
      // console.log(lastTime.toISOString());
      // console.log(currentTime.toISOString());
      // console.log((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString()));
      let Difference = ((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString())) / 1000) / 60;

      return await this.chatsCollection.findOneAndUpdate(
        { _id: new ObjectID(cid), ['assigned_to.email']: email },
        { $inc: { ['assigned_to.$.penaltyTime']: Difference } },
        { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in Updating Last Message');
    }
  }
  public async GetAllWaitingVisitors(nsp: string): Promise<Array<any>> {
    let inactiveSessions: Array<any> = [];
    try {
      if (this.sessionDB && this.sessionsCollection) {
        inactiveSessions = await this.sessionsCollection.find({
          $and: [
            { nsp: nsp },
            { inactive: false },
            { state: 3 },
          ]
        }).toArray();
      }
      return inactiveSessions;
    }
    catch (error) {
      console.log(error);
      console.log('error in GetAllInactiveNonChattingUsers');
      return inactiveSessions;
    }
  }
  public async getAllVisitors(nsp, exclude?: string) {
    try {
      // console.log(session)
      let visitorList = await this.VisitorCollection.find({ nsp: nsp }).sort({ _id: -1 }).limit(20).toArray();
      if (visitorList.length) return visitorList
      else return [];

    } catch (error) {
      console.log('Error in Sending Visitors List');
      console.log(error);
    }
  }
  public async UnbanVisitor(deviceID, nsp) {
    try {

      if (deviceID) {

        return this.VisitorCollection.findOneAndUpdate(
          { nsp: nsp, deviceID: deviceID },
          {
            $set:
            {
              banned: false,
              banSpan: 0,
              bannedOn: ''
            }
          }, { returnOriginal: false, upsert: false },

        );

      }
    } catch (err) {
      console.log(err);
    }

  }
  public async AllocateAgentWorker(VisitorSession: VisitorSessionSchema, conversationID: ObjectID, exclude: any[] = [], state?): Promise<any | undefined> {
    //Refactored
    // console.log('Allocate agent')

    //console.log('Chat Limit : ', __biZZC_Core.ConcurrentChatLimit)
    try {
      if (this.sessionDB && this.sessionsCollection) {


        exclude = exclude.map(id => { return new ObjectID(id) });

        let bestAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            nsp: VisitorSession.nsp,
            acceptingChats: true,
            ['permissions.chats.canChat']: true,
            type: 'Agents',
            _id: { $nin: exclude },
            [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: false },
            $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
          },
          {
            $set: {
              [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
            },
            $inc: { chatCount: 1, visitorCount: 1 }
          }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
        )

        if (bestAgent && bestAgent.value) {
          VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString()

          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(VisitorSession.id || VisitorSession._id) },
            {
              $set: {
                agent: (bestAgent.value) ? {
                  id: bestAgent.value._id.toString(),
                  name: (bestAgent.value.nickname) ? bestAgent.value.nickname : bestAgent.value.name,
                  image: (bestAgent.value.image) ? bestAgent.value.image : ''
                } : { id: '', name: '', image: '' },
                state: (state) ? state : (bestAgent.value) ? 3 : 2,
                previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                conversationID: (conversationID) ? conversationID : '',
                username: VisitorSession.username,
                email: VisitorSession.email
              }
            },
            { returnOriginal: false, upsert: false }
          );
          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            return {
              agent: bestAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(bestAgent.value._id),
                [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: true }
              },
              {
                $unset: { [`rooms.${(VisitorSession._id as any).toString()}`]: 1 },
                $inc: { chatCount: -1 }
              }, { returnOriginal: false, upsert: false })
            return undefined;
          }
        }

        else return undefined;
      } else {
        return undefined;
      }
    } catch (error) {

      console.log('Error in Allocating Agent Worker');
      console.log(error);
      return undefined;
    }

  }



  public async AllocateAgentWorkerFromInvitation(VisitorSession: VisitorSessionSchema, conversationID: ObjectID, exclude: any[] = [], state): Promise<any | undefined> {
    //Refactored
    // console.log('Allocate agent')

    //console.log('Chat Limit : ', __biZZC_Core.ConcurrentChatLimit)
    try {
      if (this.sessionDB && this.sessionsCollection) {


        exclude = exclude.map(id => { return new ObjectID(id) });

        let bestAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            nsp: VisitorSession.nsp,
            acceptingChats: true,
            ['permissions.chats.canChat']: true,
            type: 'Agents',
            _id: { $nin: exclude },
            [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: false },
            $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
          },
          {
            $set: {
              [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
            },
            $inc: { chatCount: 1, visitorCount: 1 }
          }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
        )

        if (bestAgent && bestAgent.value) {
          VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString()
          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(VisitorSession.id || VisitorSession._id), state: 1 },
            {
              $set: {
                agent: (bestAgent.value) ? {
                  id: bestAgent.value._id.toString(),
                  name: (bestAgent.value.nickname) ? bestAgent.value.nickname : bestAgent.value.name,
                  image: (bestAgent.value.image) ? bestAgent.value.image : ''
                } : { id: '', name: '', image: '' },
                state: (state) ? state : (bestAgent.value) ? 3 : 2,
                previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                conversationID: (conversationID) ? conversationID : '',
                username: VisitorSession.username,
                email: VisitorSession.email
              }
            },
            { returnOriginal: false, upsert: false }
          );
          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            return {
              agent: bestAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(bestAgent.value._id),
                [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: true }
              },
              {
                $unset: { [`rooms.${(VisitorSession._id as any).toString()}`]: 1 },
                $inc: { chatCount: -1 }
              }, { returnOriginal: false, upsert: false })
            return undefined;
          }
        }

        else return undefined;
      } else {
        return undefined;
      }
    } catch (error) {

      console.log('Error in Allocating Agent Worker With State');
      console.log(error);
      return undefined;
    }

  }
  public async AllocateAgentWorkeWhenAgentDissconnect(VisitorSession: VisitorSessionSchema, conversationID: ObjectID, exclude: any[] = [], state?): Promise<any | undefined> {
    //Refactored
    // console.log('Allocate agent')

    //console.log('Chat Limit : ', __biZZC_Core.ConcurrentChatLimit)
    try {
      if (this.sessionDB && this.sessionsCollection) {


        exclude = exclude.map(id => { return new ObjectID(id) });

        let bestAgent = await this.sessionsCollection.findOneAndUpdate(
          {
            nsp: VisitorSession.nsp,
            acceptingChats: true,
            ['permissions.chats.canChat']: true,
            type: 'Agents',
            _id: { $nin: exclude },
            [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: false },
            $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
          },
          {
            $set: {
              [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
            },
            $inc: { chatCount: 1, visitorCount: 1 }
          }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
        )

        if (bestAgent && bestAgent.value) {
          VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString()
          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(VisitorSession.id || VisitorSession._id) },
            {
              $set: {
                agent: {
                  id: bestAgent.value._id,
                  name: (bestAgent.value.nickname) ? bestAgent.value.nickname : '',
                  image: (bestAgent.value.image) ? bestAgent.value.image : ''
                },
                state: 3,
                previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                conversationID: conversationID,
                username: VisitorSession.username,
                email: VisitorSession.email
              }
            },
            { returnOriginal: false, upsert: false }
          );
          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            return {
              agent: bestAgent.value,
              visitor: updatedVisitorSession.value
            };
          } else {
            await this.sessionsCollection.findOneAndUpdate(
              {
                _id: new ObjectId(bestAgent.value._id),
                [`rooms.${(VisitorSession._id as any).toString()}`]: { $exists: true }
              },
              {
                $unset: { [`rooms.${(VisitorSession._id as any).toString()}`]: 1 },
                $inc: { chatCount: -1 }
              }, { returnOriginal: false, upsert: false })
            return undefined;
          }
        } else {
          let updatedVisitorSession = await this.sessionsCollection.findOneAndUpdate(
            { _id: new ObjectID(VisitorSession.id || VisitorSession._id) },
            {
              $set: {
                agent: { id: '', name: '', image: '' },
                state: 2,
                conversationID: conversationID,
                username: VisitorSession.username,
                email: VisitorSession.email
              }
            },
            { returnOriginal: false, upsert: false }
          );
          if (updatedVisitorSession && updatedVisitorSession.value) {
            return { agent: undefined, visitor: updatedVisitorSession.value }
          } else return undefined;
        }

      } else {
        return undefined;
      }
    } catch (error) {

      console.log('Error in Allocating Agent Fallback Worker');
      console.log(error);
      return undefined;
    }

  }

  public async AllocateAgentPriorityOnInvitation(session, email, conversationID: ObjectID, state?: number): Promise<any | undefined> {
    //Refactored
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let UpdatedSessions = await this.AssignAgentByEmailCheckBrowsingState(session, email, conversationID, (state) ? state : undefined);
        if (UpdatedSessions) return UpdatedSessions;
        else return undefined;
      } else {
        return undefined;
      }
      //#region Finding BestAgent

    } catch (error) {
      console.log('Error in Allocating Agent');
      console.log(error);
      return undefined;
    }

  }
  public async AllocateAgentPriority(session, email, conversationID: ObjectID, state?: number): Promise<any | undefined> {
    //Refactored
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let UpdatedSessions = await this.AssignAgentByEmail(session, email, conversationID, (state) ? state : undefined);
        if (UpdatedSessions) return UpdatedSessions;
        else return undefined;
      } else {
        return undefined;
      }
      //#region Finding BestAgent

    } catch (error) {
      console.log('Error in Allocating Agent');
      console.log(error);
      return undefined;
    }

  }
  public async TransferChatOnChatDisconnect(pendingVisitor: VisitorSessionSchema, visitorID: string, agent: AgentSessionSchema, id: string | ObjectID) {
    try {


      let UpdatedSessions = (await this.AllocateAgentWorker(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [id]));
      // let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [(agent.id || agent._id)]));
      let newAgent = UpdatedSessions.agent;
      pendingVisitor = UpdatedSessions.visitor;

      if (UpdatedSessions && newAgent) {
        let conversation = (newAgent.email) ? await this.TransferChatUnmodified((pendingVisitor as VisitorSessionSchema).conversationID, newAgent.email, false) : undefined;
        // console.log('Transfer Chat Unmodified (AssignChat Transfer Chat on Disconnect ): ', (conversation) ? conversation.value : '');
        if (conversation && conversation.value) {

          this.AddPenaltyTime((pendingVisitor as VisitorSessionSchema).conversationID, agent.email, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
          (conversation.value.messageReadCount)
            ? conversation.value.messages = await this.getMessages1((pendingVisitor as VisitorSessionSchema).conversationID)
            : [];

          let payload = { id: (pendingVisitor as VisitorSessionSchema)._id || (pendingVisitor as VisitorSessionSchema).id, session: pendingVisitor }
          // let event = 'Chat auto transferred to ' + newAgent.email + ' from ' + agent.email;
          //                let event = 'Chat auto transferred to ' + newAgent.email + ((agent && agent.email) ? ' from ' + agent.email : '');
          let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' })
          let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);
          // if (loggedEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
          let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + ((agent as any).name || (agent as any).username || agent.nickname) : '');

          let promises = await Promise.all([
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [this.NotifyAllAgents()], data: payload }),
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: agent.nsp, roomName: [this.NotifySingleAgent(pendingVisitor)], data: conversation.value }),
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: agent.nsp, roomName: [this.NotifyVisitorSingle(pendingVisitor as VisitorSessionSchema)], data: { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent }, event: chatEvent }),
          ])
          return UpdatedSessions;
        }
      } else {
        let pendingVisitor = await this.UnseAgentFromVisitor(visitorID);
        if (pendingVisitor) {

          let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })

          let promises = await Promise.all([
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: agent.nsp, roomName: [visitorID], data: { state: 2, agent: pendingVisitor.agent } }),
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } }),
            await __biZZC_SQS.SendEventLog(queEvent, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id),
            await this.UpdateConversationState(pendingVisitor.conversationID, 1, false)
          ]);
          // if (logEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);


        }
        return undefined;
      }

    } catch (error) {
      console.log(error);
      console.log('error in Transfer Agent Disconnect');
      return undefined;
    }
  }
  public async GetVisitorsForInvitationByTimeSpent(nsp, timeInMinutes): Promise<VisitorSessionSchema[] | []> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitors = await this.sessionsCollection.find({
          nsp: nsp,
          type: 'Visitors',
          state: 1,
          inactive: false,
          newUser: false,
          creationDate: { $lte: new Date(new Date().getTime() - 1000 * 60 * timeInMinutes).toISOString() },
        }).limit(100).toArray();

        if (visitors.length) return visitors;
        else return [];
      } else return [];
    } catch (error) {
      console.log('Error in Get Browsing Visitors');
      console.log(error);
      return [];
    }
  }

  public async GetVisitorsForInvitationByURLVisited(nsp, urlLength): Promise<VisitorSessionSchema[] | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitors = await this.sessionsCollection.find({
          nsp: nsp,
          type: 'Visitors',
          state: 1,
          inactive: false,
          newUser: false,
          [`url.${urlLength - 1}`]: { $exists: true },
        }).limit(100).toArray();

        if (visitors.length) return visitors;
        else return [];
      } else return [];
    } catch (error) {
      console.log('Error in Get Browsing Visitors');
      console.log(error);
      return [];
    }
  }

  public async GetVisitorsForInvitationByCurrentUrl(nsp, url: Array<string>): Promise<VisitorSessionSchema[] | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {
        let visitors = await this.sessionsCollection.find({
          nsp: nsp,
          type: 'Visitors',
          state: 1,
          inactive: false,
          newUser: false,
          ['url.0']: { $in: url },
        }).limit(100).toArray();

        if (visitors.length) return visitors;
        else return [];
      } else return [];
    } catch (error) {
      console.log('Error in Get Browsing Visitors');
      console.log(error);
      return [];
    }
  }


  public async AutomaticEngagement(visitorSession: VisitorSessionSchema, state: number, chatOnInvitation: boolean, greetingMessage: string, priorityAgent: string) {
    try {


      let allAgents = (chatOnInvitation) ? await this.GetAllActiveAgentsChatting(visitorSession) : await this.GetChattingAgentsForInvite(visitorSession);
      // if (!session.username) session.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
      // if (!session.email) session.email = session.email || 'Unregistered';
      // console.log('All Agents in AUtomatic Engagement : ', allAgents)
      if (!allAgents) {
        return;
      } else {
        //Allocating Agent From BestFit Method || Manual Assignment If State == 4
        let allocatedAgent: AgentSessionSchema | undefined;
        let cid: ObjectID = new ObjectID();

        let session = (await this.GetVisitorByID(visitorSession.id || visitorSession._id)) as VisitorSessionSchema;
        session.username = session.username || 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
        session.email = session.email || 'UnRegistered';
        if (!session || (session && (session.state != 1))) return;
        // console.log(origin['settings']['chatSettings']['assignments']);
        let UpdatedSessions;
        switch (true) {
          case chatOnInvitation:
            let locked = await __BIZZC_REDIS.GenerateSID(session.nsp, session._id);
            if (!locked) return;
            UpdatedSessions = (priorityAgent.trim()) ? await this.AllocateAgentPriorityOnInvitation(session, priorityAgent, cid, state) : await this.AllocateAgentWorkerFromInvitation(session, cid, [], state);
            if (UpdatedSessions && UpdatedSessions.agent) {
              allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
              session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
              if (allocatedAgent) {

                //Creating Conversation in Database
                //Conversation States:
                // 1. Conversation Created But No Agent Assignend
                // 2. Conversation Created and Got agent
                // 3. Conversation Ended

                let conversation;
                /**
                 * @Note TO test atomicity between operation Uncomment Following Code
                 *  console.log('After Seleep Code');
                 */
                // console.log('Sleeping In HAlf After Creating Conversation');
                // await this.Sleep(3000);
                conversation = await this.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID);
                if (conversation && conversation.insertedCount) {
                  await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                  let payload = { id: session.id, session: session };
                  /**
                   * @Special_Case
                   * Consider Business Requirements to allow Agents to set their personal greeting message
                   * Code has been Done When Asked please uncomment the following
                   * if (allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
                   */
                  let lastMessage;
                  if (greetingMessage) {

                    lastMessage = {
                      from: session.nsp.substr(1),
                      to: session.username,
                      body: greetingMessage,
                      cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                      date: (new Date()).toISOString(),
                      type: 'Agents',
                      attachment: false
                    }
                    let messageinsertedID = await this.insertMessage(lastMessage);
                    conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                    await this.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                  }
                  let newEngagement: any = {
                    clientID: conversation.ops[0].clientID,
                    state: state,
                    username: session.username,
                    email: session.email,
                    agent: session.agent,
                    greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                    cid: (session.conversationID) ? session.conversationID : ''
                  }
                  let mutex = await __BIZZC_REDIS.GetID(`_${session.nsp}_${(session._id as any).toString()}`)
                  if (mutex > 1) {
                    session = await this.GetVisitorByID(session._id) as VisitorSessionSchema;
                    payload.session = session;
                    newEngagement = {
                      clientID: conversation.ops[0].clientID,
                      state: session.state,
                      username: session.username,
                      email: session.email,
                      agent: session.agent,
                      greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                      cid: (session.conversationID) ? session.conversationID : ''
                    }
                  }

                  await Promise.all([
                    //Server Push Visitor To Recieve Invitation
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [this.NotifyVisitorSingle(session)], data: newEngagement }),
                    //Server Push New Conversation to Agent.
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [(allocatedAgent.id as string)], data: conversation.ops[0] }),
                    //Broadcast To All Agents That User Information and State Has Been Updated.
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: payload }),
                    //Inform archiving Database to update SQS LOG
                    await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id),
                    //Deleting Mutex
                    await __BIZZC_REDIS.DeleteID(`_${session.nsp}_${(session._id as any).toString()}`)
                  ]);

                } else {

                }



              }
            }
            break;
          default:
            /**
             * @Note For Delay and Atomiticity Testing Use Following Code
             *  // console.log('Sleeping in state 5');
             *  // await this.Sleep(5000);
             */
            UpdatedSessions = await this.SetState(session._id as string, 5, session.state.toString());
            if (UpdatedSessions) {
              let payload = { id: session.id, session: UpdatedSessions };
              /**
                 * @Special_Case
                 * Consider Business Requirements to allow Agents to set their personal greeting message
                 * Code has been Done When Asked please uncomment the following
                 * if (allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
                 */

              let lastMessage;
              if (greetingMessage) {

                lastMessage = {
                  from: UpdatedSessions.nsp.substr(1),
                  to: UpdatedSessions.username,
                  body: greetingMessage,
                  cid: '',
                  date: (new Date()).toISOString(),
                  type: 'Agents',
                  attachment: false
                }
              }
              let newEngagement: any = {
                clientID: '',
                state: state,
                username: UpdatedSessions.username,
                email: UpdatedSessions.email,
                agent: UpdatedSessions.agent,
                greetingMessage: (lastMessage) ? lastMessage : '',
                cid: ''
              }

              await Promise.all([
                //Broadcast To All Agents That User Information and State Has Been Updated.
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: UpdatedSessions.nsp, roomName: [this.NotifyAllAgents()], data: payload }),
                await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INVITED, (UpdatedSessions._id) ? UpdatedSessions._id : UpdatedSessions.id),
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: UpdatedSessions.nsp, roomName: [this.NotifyVisitorSingle(session)], data: newEngagement })
              ])

            }
            break;
        }
      }

    }
    catch (error) {
      // let session = (await this.GetVisitorByID(visitorSession)) as VisitorSessionSchema;
      // await this.UpdateSession(session.id || session._id, session);
      console.log(error);
      console.log('Error in Automatic Engagement Worker');

    }

  }
  //#endregion

  //#region Archiving Session
  public async ArchiveAgentSession(session, id?) {
    //console.log('Inserting Agent Sessio nArchive');
    try {

      if (id && !session._id) {
        session._id = id;
      }
      if (session) {
        session.endingDate = new Date();
        //Code to test by murtaza
        if (session.idlePeriod && session.idlePeriod.length && session.idlePeriod[0].endTime == null) {
          session.idlePeriod[0].endTime = session.endingDate;
        }
        //Code to test end by murtaza
        return await __biZZC_SQS.SendMessage({ action: 'agentSessionEnded', session: session }, ARCHIVINGQUEUE);
        // return await this.collection.insertOne(session);
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Inserting Agent Session Worker');
      console.log(error);
    }

  }
  public async ArchiveVisitorSession(session, id?) {

    try {

      if (id && !session._id) {
        session._id = id;
      }
      session.endingDate = new Date();
      await this.UpdateVisitorSessionByDeviceID(session.deviceID, (session._id) ? session._id.toString() : session.id);
      await this.InsertLeftVisitor(session.nsp, session);
      //return await this.collection.insertOne(session);
      return await __biZZC_SQS.SendMessage({ action: 'visitorSessionEnded', session: session }, AnalytcisNewQueue);


    } catch (error) {
      console.log('error in Inserting Visitor Session Worker');
      console.log(error);
    }

  }
  public async UpdateVisitorSessionByDeviceID(userDeviceID, sessionid) {
    try {
      return this.VisitorCollection.findOneAndUpdate(
        {
          deviceID: userDeviceID,
        },
        {
          $addToSet: { sessions: sessionid }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in Updating Sessions Worker');
      console.log(error);
    }
  }
  public async InsertLeftVisitor(nsp, session) {
    try {

      let updated = await this.LeftVisitorCollection.findOneAndUpdate(
        { nsp: nsp },
        {
          $push: { "session": { $each: [session], $slice: -30 } },
        },
        { returnOriginal: false, upsert: true })
      // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
      return updated;

    } catch (error) {
      console.log(error);
      console.log('error in inserting LeftVisitor Worker');
    }
  }
  //#endregion

  public IgnoreNameSpace(nsp: string) {
    switch (nsp.toLowerCase()) {
      case '/':
      case '/emailservice':
        return true;
      default:
        if (nsp.indexOf('.') != -1) return false;
        else return false;
    }
  }

  public async CheckInactiveVisitorsNonChatting() {


    // console.log('Checking Inactive Visitors Non Chatting');
    let companies = await this.GetCompanies();

    if (companies && companies.length) {
      for (let i = 0; i < companies.length; i++) {
        // console.log('Companies : ', companies[i].name);
        if (this.IgnoreNameSpace(companies[i].name)) continue;
        let expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
        let InactiveSessions: any[] = (await this.GetAllInactiveVisitors(companies[i].name, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], false) as Array<any>);
        let promises: any;
        let event: string = '';
        let updateSession: FindAndModifyWriteOpResultObject<any> | undefined = undefined;
        for (let j = 0; j < InactiveSessions.length; j++) {
          try {

            InactiveSessions[j].inactive = true;
            InactiveSessions[j].expiry = expiryDate.toISOString();
            switch (InactiveSessions[j].state) {
              case 1:
              case 5:
              case 8:

                //chatEvent = 'Marked Inactive from' + ((session.state == 5) ? 'Invited' : 'Browsing') + 'state';
                updateSession = await this.SetVisitorsInactvieNonChatting(InactiveSessions[j]._id || InactiveSessions[j].id, { expiry: expiryDate.toISOString(), lastTouchedTime: InactiveSessions[j].lastTouchedTime });
                if (updateSession && updateSession.value) {

                  promises = await Promise.all([
                    __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value._id, session: updateSession.value } }),
                    __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_MARKED_INACTIVE_FROM_BROWSING, updateSession.value._id)
                  ])
                  await promises
                }
                break;
              case 4:
                updateSession = await this.SetVisitorsInactvieNonChatting(InactiveSessions[j]._id || InactiveSessions[j].id, { expiry: expiryDate.toISOString(), lastTouchedTime: InactiveSessions[j].lastTouchedTime });
                if (updateSession && updateSession.value) {
                  this.UnsetChatFromAgent(InactiveSessions[j])
                  event = ComposedENUM(DynamicEventLogs.VISITOR_INVITED_INACTIVE, { newEmail: '', oldEmail: '', name: InactiveSessions[j].agent.name });
                  promises = await Promise.all([
                    __biZZC_SQS.SendEventLog(event, InactiveSessions[j]._id),
                    this.MakeInactive(InactiveSessions[j].conversationID)
                  ])
                  let updatedconversation = promises[1]

                  let insertedMessage = await this.CreateLogMessage({
                    from: InactiveSessions[j].agent.name,
                    to: (InactiveSessions[j].username) ? InactiveSessions[j].agent.name || InactiveSessions[j].agent.nickname : '',
                    body: event,
                    type: 'Events',
                    cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                    attachment: false,
                    date: new Date().toISOString(),
                    delivered: true,
                    sent: true
                  });
                  if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage });
                  if (updatedconversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: updateSession.value.nsp, roomName: [this.NotifySingleAgent(updateSession.value)], data: { conversation: updatedconversation.value } });
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value.id || updateSession.value._id, session: updateSession.value } });
                }


                //#endregion
                break;

              default:
                break;
            }
          } catch (error) {
            console.log(error);
            console.log('Error in Checking Inactive Visitors');
          }

        }
      }
    }
  }
  public async CheckInactiveVisitorsChatting() {

    try {
      // console.log('Checking Inactive Visitors Chatting');
      let companies = await this.GetCompanies();

      if (companies && companies.length) {
        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) continue;
          let expiryDate = new Date();
          expiryDate.setMinutes(expiryDate.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
          let InactiveSessions: any[] = await this.GetAllInactiveVisitors(companies[i].name, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true) as Array<any>;
          // console.log('Getting Inactive Chatting Sessions :');
          let promises: any;
          let event: string = '';
          let updateSession: FindAndModifyWriteOpResultObject<any> | undefined = undefined;
          for (let j = 0; j < InactiveSessions.length; j++) {
            try {
              // console.log('Getting INactive Chats');
              let conversation = await this.getInactiveChat(InactiveSessions[j].conversationID, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true);
              // console.log('Converstaion : ', conversation);
              // console.log('Ended Getting inactive chats');
              let promises: any;
              InactiveSessions[j].inactive = true;
              InactiveSessions[j].expiry = expiryDate.toISOString();
              let logEvent: any = undefined;
              let event: string = '';
              let chatEvent: string = '';

              let inactivityDate = new Date();
              inactivityDate.setMinutes(inactivityDate.getMinutes() - companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout']);

              let updateSession: any = undefined

              let date = new Date();
              date.setMinutes(date.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);


              if (conversation && conversation.length && conversation[0].lastMessage) {

                // console.log('Visitor State : ', InactiveSessions[j].state)
                switch (InactiveSessions[j].state) {
                  case 2:

                    /**
                         * @Note :
                         * Inactive Propositions
                         * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                         * 2. IF Last Touched Time + N(mins) < Current Time  And Lastmessage timestamp + N(mins) < Current Time
                         * @Action Move To Inactive
                    */

                    if (conversation[0].createdOn > inactivityDate.toISOString() && InactiveSessions[j].lastTouchedTime > inactivityDate.toISOString()) {
                      continue;
                    } else if (conversation[0].lastMessage.date < inactivityDate.toISOString()) {
                      chatEvent = 'Marked Inactive in Unassigned State'
                      updateSession = this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() });
                      if (updateSession && updateSession.value) {
                        promises = await Promise.all([
                          __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, InactiveSessions[j]._id),
                          await this.MakeInactive(InactiveSessions[j].conversationID)
                        ]);

                        let insertedMessage = await this.CreateLogMessage({
                          from: (InactiveSessions[j].agent.name) ? InactiveSessions[j].agent.name : '',
                          to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                          body: chatEvent,
                          type: 'Events',
                          cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                          attachment: false,
                          date: new Date().toISOString(),
                          delivered: true,
                          sent: true
                        })
                        console.log('inactive event message');

                        if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: InactiveSessions[j].nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: InactiveSessions[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: InactiveSessions[j]._id, session: updateSession.value } });
                      }
                    }

                    break;
                  case 3:
                    /**
                     * @Note :
                     * Inactive Propositions
                     * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                     * 2. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Agent  And Lastmessage timestamp + N(mins) < Current Time
                     * @Action Move To Inactive
                     */


                    if (((conversation[0].lastMessage.type == 'Agents') && (conversation[0].lastMessage.date < inactivityDate.toISOString()))
                      || ((conversation[0].lastMessage.type == 'Visitors' && conversation[0].lastMessage.date < inactivityDate.toISOString()) && conversation[0].createdOn < inactivityDate.toISOString())) {
                      // console.log('Conversation Length : ', conversation.length);
                      // console.log('Last Message == Agents : ', conversation[0].lastMessage.type == 'Agents');
                      // console.log('Conversation LAst Message Date : ', conversation[0].lastMessage.date)
                      // console.log('Conversation Inactive Time : ', inactivityDate.toISOString())
                      // console.log('Conversation Criterea : ', conversation[0].lastMessage.date < inactivityDate.toISOString())

                      let promises: any;
                      InactiveSessions[j].inactive = true;
                      InactiveSessions[j].expiry = expiryDate.toISOString();
                      let logEvent: any = undefined;
                      let event: string = '';
                      let chatEvent: string = '';

                      let inactivityDate = new Date();
                      inactivityDate.setMinutes(inactivityDate.getMinutes() - companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout']);

                      let updateSession: any = undefined

                      let date = new Date();
                      date.setMinutes(date.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
                      event = ComposedENUM(DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { newEmail: '', oldEmail: '', name: InactiveSessions[j].agent.name });
                      updateSession = await this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() });
                      if (updateSession && updateSession.value) {
                        promises = await Promise.all([
                          __biZZC_SQS.SendEventLog(event, InactiveSessions[j]._id),
                          this.MakeInactive(InactiveSessions[j].conversationID),
                          this.UnsetChatFromAgent(InactiveSessions[j])
                        ]);
                        logEvent = await promises[0];
                        let updatedconversation = await promises[1];
                        //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

                        let insertedMessage;
                        /**
                         * Move Logic To server-side
                         */
                        // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);

                        insertedMessage = await this.CreateLogMessage({
                          from: InactiveSessions[j].agent.name,
                          to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                          body: event,
                          type: 'Events',
                          cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                          attachment: false,
                          date: new Date().toISOString(),
                          delivered: true,
                          sent: true
                        })
                        // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        console.log('inactive event message');
                        if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value._id, session: updateSession.value } });

                        if (updatedconversation && updatedconversation.value) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: updateSession.value.nsp, roomName: [this.NotifySingleAgent(updateSession.value)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } });

                      }
                    }
                    break;
                }
              } else {

                if (conversation && conversation.length && conversation[0].createdOn < inactivityDate.toISOString()) {

                  switch (InactiveSessions[j].state) {
                    case 2:

                      /**
                           * @Note :
                           * Inactive Propositions
                           * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                           * 2. IF Last Touched Time + N(mins) < Current Time  And Lastmessage timestamp + N(mins) < Current Time
                           * @Action Move To Inactive
                      */
                      InactiveSessions[j].inactive = true;
                      InactiveSessions[j].expiry = date.toISOString();
                      event = 'Visitor Went Inactive from Unassigned chat.';
                      chatEvent = 'Marked Inactive in Unassigned State'
                      updateSession = await this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() });
                      //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                      if (updateSession && updateSession.value) {
                        promises = await Promise.all([
                          __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, InactiveSessions[j]._id),
                          this.MakeInactive(InactiveSessions[j].conversationID)
                        ]);
                        logEvent = promises[0];
                        let insertedMessage = await this.CreateLogMessage({
                          from: InactiveSessions[j].agent.name,
                          to: InactiveSessions[j].username,
                          body: event,
                          type: 'Events',
                          cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                          attachment: false,
                          date: new Date().toISOString(),
                          delivered: true,
                          sent: true
                        })
                        // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('visitorInactive', { session: session })
                        // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('inactiveVisitorState', { state: session.state, inactive: true, event: chatEvent })


                        // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });

                        if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value.id || updateSession.value._id, session: updateSession.value } });
                      }
                      break;

                    case 3:
                      /**
                       * @Note :
                       * Inactive Propositions
                       * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                       * 2. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Agent  And Lastmessage timestamp + N(mins) < Current Time
                       * @Action Move To Inactive
                       */

                      InactiveSessions[j].inactive = true;
                      InactiveSessions[j].expiry = date.toISOString();
                      event = ComposedENUM(DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { oldEmail: '', newEmail: '', name: InactiveSessions[j].agent.name });
                      updateSession = await this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() })
                      if (updateSession && updateSession.value) {
                        promises = await Promise.all([
                          __biZZC_SQS.SendEventLog(event, InactiveSessions[j]._id || InactiveSessions[j].id),
                          this.MakeInactive(InactiveSessions[j].conversationID),
                          this.UnsetChatFromAgent(InactiveSessions[j])
                        ]);
                        logEvent = promises[0];
                        let updatedconversation = promises[1];
                        //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

                        let insertedMessage
                        /**
                         * Move Logic To server-side
                         */
                        // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);

                        insertedMessage = await this.CreateLogMessage({
                          from: InactiveSessions[j].agent.name,
                          to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                          body: event,
                          type: 'Events',
                          cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                          attachment: false,
                          date: new Date().toISOString(),
                          delivered: true,
                          sent: true
                        })
                        // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage);
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        console.log('inactive event message');
                        if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value._id, session: updateSession.value } });

                        if (updatedconversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: updateSession.value.nsp, roomName: [this.NotifySingleAgent(updateSession.value)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } });

                      }
                      break;
                  }

                }

              }

            } catch (error) {
              console.log(error);
              console.log('Error in Checking Inactive Visitors Worker Loop');
            }

          }
        }
      }
    } catch (error) {
      console.log(error);
      console.log('error in Checking Visitors Inactive Worker');
    }

  }
  public async Reactivate() {
    try {

      // console.log('Reactivating Visitors');
      let companies = await this.GetCompanies();

      if (companies && companies.length) {
        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) continue;
          let ActiveSessions: any[] = await this.GetSessionforReActivation(companies[i].name) as Array<any>;
          for (let j = 0; j < ActiveSessions.length; j++) {
            try {
              let renewedSession = await this.MarkReactivate(ActiveSessions[j]._id)
              if (renewedSession) {
                await this.MakeActive(renewedSession, companies[i])
              }
            } catch (error) {
              console.log(error);
              console.log('Error in Checking Inactive Visitors Worker Loop');
            }

          }
        }
      }

    } catch (error) {
      console.log(error);
      console.log('error in Reactivating in Worker');
    }
  }
  public async DeleteInactiveVisitors() {
    try {
      // console.log('Deleting Inactive Visitors');
      let companies = await this.GetCompanies();

      if (companies) {

        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) return;
          let ExpirtedSession: any[] = (await this.GetALLExpiredSessions(companies[i].name, 'Visitors') as Array<any>);

          for (let j = 0; j < ExpirtedSession.length; j++) {
            let endedConversation: any = undefined;
            let deleted = false;
            switch (ExpirtedSession[j].state) {

              case 1:
              case 5:
                deleted = await this.RemoveSession(ExpirtedSession[j], false);
                // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('removeUser', session.id);
                if (deleted) {

                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j]._id });
                }
                break;
              case 2:
              case 3:
              case 4:
              case 8:
                // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('endChatDisconnection');
                let data = await this.GetSessionForChat((ExpirtedSession[j]._id || ExpirtedSession[j].id) as string)
                if (data) deleted = await this.RemoveSession(ExpirtedSession[j], false);
                // console.log('Deleted : ', deleted);
                if (deleted) {

                  endedConversation = (ExpirtedSession[j].state == 2) ? await this.EndChatMissed(ExpirtedSession[j].conversationID, (data) ? data : '') : await this.EndChat(ExpirtedSession[j].conversationID, true, (data) ? data : '');
                  if (endedConversation && endedConversation.value) {
                    await __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: endedConversation.value }, ARCHIVINGQUEUE);
                    let insertedMessage = await this.CreateLogMessage({
                      from: ExpirtedSession[j].agent.name,
                      to: (ExpirtedSession[j].username) ? ExpirtedSession[j].username : '',
                      body: 'Chat ended due to inactivity',
                      type: 'Events',
                      cid: (ExpirtedSession[j].conversationID) ? ExpirtedSession[j].conversationID : '',
                      attachment: false,
                      date: new Date().toISOString(),
                      delivered: true,
                      sent: true
                    })

                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifySingleAgent(ExpirtedSession[j])], data: { conversation: endedConversation.value } });
                    if (endedConversation && endedConversation.value && endedConversation.value.superviserAgents && endedConversation.value.superviserAgents.length) {
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: ExpirtedSession[j].nsp, roomName: endedConversation.value.superviserAgents, data: { conversation: (endedConversation && endedConversation.value) ? endedConversation.value : '' } });
                    }
                    if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessage', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifySingleAgent(ExpirtedSession[j])], data: insertedMessage });
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'Admin', broadcast: false, eventName: 'removeUnassignedConvo', nsp: ExpirtedSession[j].nsp, roomName: [], data: { conversation: endedConversation.value } });
                  }

                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j]._id });
                  await __BIZZC_REDIS.SetID(ExpirtedSession[j]._id, 5);
                  // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'endChatDisconnection', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyVisitorSingle(ExpirtedSession[j])], data: '' });
                  // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('removeUser', session.id);
                  let packet: SQSPacket = {
                    action: 'endConversation',
                    cid: ExpirtedSession[j].conversationID
                  }
                  await __biZZC_SQS.SendMessage(packet, ARCHIVINGQUEUE);

                  /**
                   * @Note
                   * Incomplete Process. Implement it properly when working on Admin Roles, Unnassigned Conversations, Chat Supervision
                   */


                }


                break;
              default:
                deleted = await this.RemoveSession(ExpirtedSession[j], false);
                if (deleted) {

                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j].id });
                }
                break;
            }
            if (deleted) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: ExpirtedSession[j] })
          }

        }
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Deleting Visitors Worker');
    }
  }
  public async DeleteInactiveAgents() {

    try {
      // console.log('Deleting Inactive Agent');
      let companies = await this.GetCompanies();
      if (companies) {

        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) return;
          let ExpiredSession: any[] = (await this.GetALLExpiredSessions(companies[i].name, 'Agents') as Array<any>);

          for (let j = 0; j < ExpiredSession.length; j++) {

            try {
              // console.log('Deleting ' + ExpiredSession[j].type + ' ' + ExpiredSession[j].id);
              let deleted = false;
              deleted = await this.RemoveSession(ExpiredSession[j], false);
              // await SocketListener.DisconnectSession(nsp, agent.id || agent._id);
              if (deleted) {

                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: ExpiredSession[j] })

                // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: agent });
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'agentUnavailable', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { email: ExpiredSession[j].email, session: ExpiredSession[j] } });

                // if (agent.permissions.chats.canChat) SocketServer.of(nsp).to(Visitor.BraodcastToVisitors()).emit('agentUnavailable', { id: agent.id || agent._id });
                if (ExpiredSession[j].permissions.chats.canChat) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'agentUnavailable', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllVisitors()], data: { id: ExpiredSession[j]._id } });

                let ConnectedVisitors = Object.keys(ExpiredSession[j].rooms);
                if (!ConnectedVisitors.length) continue;
                else {
                  let allAgents = await this.GetAllActiveAgentsChatting(ExpiredSession[j]);
                  for (let k = 0; k < ConnectedVisitors.length; k++) {
                    if (!allAgents) {
                      let pendingVisitor = await this.UnseAgentFromVisitor(ConnectedVisitors[k]);
                      if (pendingVisitor) {

                        let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: ExpiredSession[j].email })

                        // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });

                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: ExpiredSession[j].nsp, roomName: [ConnectedVisitors[k]], data: { state: 2, agent: pendingVisitor.agent } });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } });


                        let conversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                        if (conversation && conversation.value)
                          await this.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);

                        let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
                        //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

                      }
                      return;
                    } else {
                      let pendingVisitor = await this.GetVisitorByID(ConnectedVisitors[k]);

                      if (!pendingVisitor) continue;

                      let UpdatedSessions = await this.TransferChatOnChatDisconnect(pendingVisitor, ConnectedVisitors[k], ExpiredSession[j], ExpiredSession[j]._id);

                      //#region old Non-Abstract Code
                      let newAgent = UpdatedSessions.agent;
                      pendingVisitor = UpdatedSessions.visitor;

                      if (UpdatedSessions && newAgent) {
                        continue;
                      } else {
                        let pendingVisitor = await this.UnseAgentFromVisitor(ConnectedVisitors[k]);
                        if (pendingVisitor) {
                          let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: ExpiredSession[j].email })

                          // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                          // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });

                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: ExpiredSession[j].nsp, roomName: [ConnectedVisitors[k]], data: { state: 2, agent: pendingVisitor.agent } });
                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } });

                          let conversation = await this.UpdateConversationState(pendingVisitor.conversationID, 1, false);
                          if (conversation && conversation.value)
                            await this.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);

                          let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
                          //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        }
                      }
                      //#endregion
                    }
                  }
                }
              }
            } catch (error) {
              console.log(error);
              console.log('Error in Agent Delete Function Worker');
            }
          }

        }
      }
    } catch (error) {
      console.log(error);
      console.log('error in Deleting Inactive Agents Worker')
    }
  }
  public async IntervalAutomaticAssignment() {
    //console.log('Interval Automatic Assignment!');
    //get all visitors which fall into the current nsp
    //check for each rule if the activity time rule exists
    //check each visitors time if it matches the rule
    //start engagement for that visitor

    try {
      // console.log('Checking Automatic Assignment');
      let companies = await this.GetCompanies()

      if (companies && companies.length) {

        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) continue;
          if (!companies[i]['settings']) continue;
          else if (!companies[i]['settings']['chatSettings']['assignments'].aEng) continue;
          else {
            // console.log('running else');
            // console.log(nsp);
            let greetingMessage: string = companies[i]['settings']['chatSettings']['greetingMessage'] || '';
            let chatOnInvitation: boolean = companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations'] || false;
            let priorityAgent: string = companies[i]['settings']['chatSettings']['assignments'].priorityAgent.trim() || '';
            let Rules = companies[i]['settings']['chatSettings']['assignments'].ruleSets || [];
            // let TimeoutRuleFound = ruleSets.map(rule => { if (rule.id == 'r_activity_time') { return rule; } });
            // console.log(TimeoutRuleFound);
            if (Rules && Rules.length) {
              // console.log('Timeout Rule Found');
              // console.log(TimeoutRuleFound);

              for (let k = 0; k < Rules.length; k++) {
                let AllVisitors: any[] = [];
                switch (Rules[k].id) {
                  case 'r_pages_visited':
                    if (!isNaN(Rules[k].pagesVisited)) {

                      AllVisitors = (await this.GetVisitorsForInvitationByURLVisited(companies[i].name, Rules[k].pagesVisited) as Array<any>);
                      // let allAgents = await SessionManager.GetAllActiveAgentsChatting(session);
                      // console.log(AllVisitors);
                      for (let j = 0; j < AllVisitors.length; j++) {
                        await this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent);
                      }
                    }
                    break;
                  case 'r_activity_time':
                    // console.log('r_activity_time');
                    // console.log(Rules[k].activityTime);
                    if (!isNaN(Rules[k].activityTime)) {


                      AllVisitors = (await this.GetVisitorsForInvitationByTimeSpent(companies[i].name, Rules[k].activityTime) as Array<any>);
                      // console.log(AllVisitors);

                      // console.log(AllVisitors);
                      for (let j = 0; j < AllVisitors.length; j++) {
                        await this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent);
                      }
                    }
                    break;
                  case 'r_particular_page':
                    let pages = (Rules[k].pageUrl && !Array.isArray(Rules[k].pageUrl)) ? [Rules[k].pageUrl] : Rules[k].pageUrl;
                    AllVisitors = (await this.GetVisitorsForInvitationByCurrentUrl(companies[i].name, pages) as Array<any>);
                    // console.log(AllVisitors);
                    for (let j = 0; j < AllVisitors.length; j++) {
                      await this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent);
                    }
                    break;
                }
              }


            }
          }
        }
      }

    } catch (error) {
      console.log(error);
      console.log('Error in INterval AutoAssignement Worker');
    }

  }
  public async AutomaticTransfer() {
    // console.log('Interval Automatic Transfer!');
    //get all visitors which fall into the current nsp
    //check for each rule if the activity time rule exists
    //check each visitors time if it matches the rule
    //start engagement for that visitor

    try {

      let companies = await this.GetCompanies()

      if (companies && companies.length) {

        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) continue;
          let InactiveSessions: any[] = (await this.GetAllWaitingVisitors(companies[i].name) as Array<any>);

          for (let j = 0; j < InactiveSessions.length; j++) {
            switch (InactiveSessions[j].state) {

              case 3:

                let logEvent: any = undefined;
                let event: string = '';
                let oldSession = JSON.parse(JSON.stringify(InactiveSessions[j]))

                let updateSession: any = undefined

                let conversation = await this.getInactiveChat(InactiveSessions[j].conversationID, companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'], false);
                let Conversationreference = conversation;
                let promises: any;

                let date: string = '';

                if (conversation && conversation.length) date = ((conversation[0] as Object).hasOwnProperty('lastPickedTime')) ? conversation[0].lastPickedTime : conversation[0].lastMessage.date

                let transferIn = new Date();
                let date1: any;
                if (date) {
                  date1 = new Date(date);
                  // if (conversation[0]) console.log(date1);
                  date1.setMinutes(date1.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn']);
                }
                // console.log(date1);
                //transferIn.setMinutes(transferIn.getMinutes() + SocketServer.of(nsp)['settings']['chatSettings']['inactivityTimeouts']['transferIn']);
                /**
                     * @Note :
                     * Auto Transfer Propositions
                     * 1. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Visitor  And Lastmessage timestamp + N(mins) < Current Time
                     * @Action Move To Inactive
                */
                if ((conversation && conversation.length && conversation[0].entertained && (conversation[0].lastMessage && (conversation[0].lastMessage.type == 'Visitors') && (date1.toISOString() < transferIn.toISOString())))) {

                  // console.log('autotransfer');

                  let bestAgent = await this.GetAllActiveAgentsChatting(InactiveSessions[j], [InactiveSessions[j].agent.id]);
                  if (!bestAgent) break;
                  else {

                    let transferred = await this.TransferAgentAuto(InactiveSessions[j], bestAgent);
                    if (transferred) {
                      let oldAgent = transferred.oldAgent;
                      let newAgent = transferred.newAgent;
                      let updatedVisitor = transferred.updatedVisitor;
                      if (newAgent && updatedVisitor) {
                        (Conversationreference && Conversationreference.length && Conversationreference[0].agentEmail) ?
                          await this.AddPenaltyTime(updatedVisitor.conversationID, Conversationreference[0].agentEmail, (Conversationreference[0].lastMessage) ? Conversationreference[0].lastMessage.date : Conversationreference[0].createdOn) : undefined;

                        let conversation = (newAgent.email) ? await this.TransferChat((updatedVisitor as VisitorSessionSchema).conversationID, newAgent.email, transferIn.toISOString(), false) : undefined;
                        // console.log('Transfer Chat Normal (Auto Transfer ): ', (conversation) ? conversation.value : '');
                        if (conversation && conversation.value) {
                          //let lastTransfered = await Conversations.UpdateLastTransferred((pendingVisitor as VisitorSessionSchema).conversationID, transferIn)
                          (conversation.value.messageReadCount)
                            ? conversation.value.messages = await this.getMessages1((updatedVisitor as VisitorSessionSchema).conversationID)
                            : [];

                          let payload = { id: (updatedVisitor as VisitorSessionSchema)._id, session: updatedVisitor }
                          let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_TRANSFERED_NO_RESPONSE, {
                            newEmail: newAgent.nickname, oldEmail: InactiveSessions[j].agent.name,
                            mins: companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'],
                            name: updatedVisitor.agent.name
                          })



                          let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ' from ' + InactiveSessions[j].agent.name + ' due to no reply in ' + companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'] + 'minutes.';
                          let insertedMessage = await this.CreateLogMessage({
                            from: InactiveSessions[j].agent.name,
                            to: (updatedVisitor.username) ? updatedVisitor.username : '',
                            body: chatEvent,
                            type: 'Events',
                            cid: (updatedVisitor.conversationID) ? updatedVisitor.conversationID : '',
                            attachment: false,
                            date: new Date().toISOString(),
                            delivered: true,
                            sent: true
                          })

                          if (insertedMessage) {
                            conversation.value.messages.push(insertedMessage)

                            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(updatedVisitor)], data: insertedMessage });
                          }

                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updatedVisitor.nsp, roomName: [this.NotifyAllAgents()], data: payload });

                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(updatedVisitor)], data: conversation.value });


                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: updatedVisitor.nsp, roomName: [this.NotifyVisitorSingle(updatedVisitor as VisitorSessionSchema)], data: { agent: (updatedVisitor as VisitorSessionSchema).agent, event: chatEvent } });
                          await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(oldSession)], data: { conversation: conversation.value } });

                          await __biZZC_SQS.SendEventLog(event, ((updatedVisitor as VisitorSessionSchema)._id) ? (updatedVisitor as VisitorSessionSchema)._id : (updatedVisitor as VisitorSessionSchema).id);

                        }
                      }
                    }
                  }

                }

                break;

              default:
                break;

            }
          }
        }
      }

    } catch (error) {
      console.log(error);
      console.log('Error in INterval AutoAssignement Worker');
    }
  }
  public async CheckBannedVisitor() {

    // console.log('Check For Banned Visitors!');
    //console.log('Checking Banned Banned Visitors!');
    try {
      let companies = await this.GetCompanies();
      if (companies) {

        for (let i = 0; i < companies.length; i++) {
          let BannedVisitors: any[] = (await this.getAllVisitors(companies[i].name) as Array<any>);
          for (let j = 0; j < BannedVisitors.length; j++) {
            let updatedVisitor: any;

            if (!BannedVisitors[j].banned || BannedVisitors[j].banSpan < 0) continue;

            let logEvent: any = undefined;
            let event: string = '';

            let currentDate = Date.parse(new Date().toISOString());


            let expired = new Date(BannedVisitors[j].bannedOn);
            // //for minutes(testing)
            // let expiryDate = expired.setMinutes(expired.getMinutes() + BannedVisitors[j].banSpan);

            //for minutes(testing)
            let expiryDate = expired.setHours(expired.getHours() + BannedVisitors[j].banSpan);

            //for days
            // let expiryDate = expired.setDate(expired.getDate() + visitor.banSpan);
            if (expiryDate < currentDate) {
              //innerPromise = await Promise.all([
              updatedVisitor = await this.UnbanVisitor(BannedVisitors[j].deviceID, BannedVisitors[j].nsp);
              // SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('removeBannedVisitor', updatedVisitor.value);
              await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeBannedVisitor', nsp: companies[i].name, roomName: [this.NotifyAllAgents()], data: updatedVisitor.value });

              //]);
            }

          }

        }


      }

    } catch (error) {
      console.log(error);
      console.log('error in Checking Banned Visitors');
    }

  }

  public async UpdateChatStateHistory(session): Promise<VisitorSessionSchema | undefined> {
    try {


      if (this.sessionDB && this.sessionsCollection) {

        let conversation = (session.conversationID) ? await this.GetConversationById(session.conversationID) : ''
        // if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == session.state)) return session
        // let states = { prevState: session.previousState, nextState: session.state , date : new Date().toISOString()}
        if (conversation && conversation.length) {

          let pullSuperViserAgent = false

          // if(conversation[0].superviserAgents.includes(session.agent.id)) await this.EndSuperVisedChat(conversation[0]._id, session.nsp, session.agent.id)
          if (conversation[0].superviserAgents.includes(session.agent.id)) pullSuperViserAgent = true
          let states = { prevState: session.previousState, nextState: ((((session.inactive) ? '-' : '') + session.state.toString()) + ''), date: new Date().toISOString() }
          if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == states.nextState) && (session.stateHistory[session.stateHistory.length - 1].prevState == states.prevState)) return session;



          let visitor = await this.sessionsCollection.findOneAndUpdate(
            {
              _id: new ObjectId(session._id || session.id)
            },
            {
              $push: {
                stateHistory: states
              },
              $pull: {
                superviserAgents: (pullSuperViserAgent) ? new ObjectID(session.agent._id) : ''
              }
            }, { returnOriginal: false, upsert: false }
          )

          if (visitor && visitor.value) {
            return visitor.value;
          }
          else return undefined;
        }
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Unsetting Agent From Visitor');
      console.log(error);
    }
  }

  // private async UpdateChatStateHistory(session): Promise<VisitorSessionSchema | undefined> {
  //     try {
  //         if (this.sessionDB && this.sessionsCollection) {

  //             let states = { prevState: session.previousState, nextState: ((((session.inactive) ? '-' : '') + session.state.toString()) + ''), date: new Date().toISOString() }
  //             if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == states.nextState) && (session.stateHistory[session.stateHistory.length - 1].prevState == states.prevState)) return session;
  //             let visitor = await this.sessionsCollection.findOneAndUpdate(
  //                 {
  //                     _id: new ObjectId(session._id || session.id)
  //                 },
  //                 {
  //                     $push: {
  //                         stateHistory: states
  //                     },
  //                 }, { returnOriginal: false, upsert: false }
  //             )

  //             if (visitor && visitor.value) {
  //                 return visitor.value;
  //             }
  //             else return undefined;
  //         } else return undefined;
  //     } catch (error) {
  //         console.log('Error in setting visitor state history');
  //         console.log(error);
  //     }
  // }

  private async UpdateChatQueHistory(session, picketBy): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.sessionDB && this.sessionsCollection) {

        let obj = {
          pickedBy: picketBy,
          date: new Date().toISOString(),
          agentID: (session.agent && session.agent.id) ? session.agent.id : '',
        }
        let visitor = await this.sessionsCollection.findOneAndUpdate(
          {
            _id: new ObjectId(session._id || session.id)
          },
          {
            $push: {
              pickedBy: obj
            },
          }, { returnOriginal: false, upsert: false }
        )

        if (visitor && visitor.value) {
          return visitor.value;
        }
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in setting visitor que history');
      console.log(error);
    }
  }

  public async EndSuperVisedChat(cid, nsp, _id) {
    try {
      return this.chatsCollection.findOneAndUpdate(
        { _id: new ObjectID(cid), nsp: nsp },
        {
          $pull: { superviserAgents: _id }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in supervising Chat');
      console.log(error);
    }
  }

  public async AssignQueuedVisitors() {

    try {
      // console.log('Assigning Queued Chatting');
      let companies = await this.GetCompanies();

      if (companies && companies.length) {
        for (let i = 0; i < companies.length; i++) {
          if (this.IgnoreNameSpace(companies[i].name)) continue;
          if (!companies[i]['settings']['chatSettings']['assignments'].aEng) continue;
          let QueuedSessions: any[] = await this.GetAllQueuedVisitors(companies[i].name) as Array<any>;
          for (let j = 0; j < QueuedSessions.length; j++) {
            try {
              console.log('Got QUeued Sessions : ');
              let result = await this.AutoAssignFromQueueAuto(QueuedSessions[j]);
              if (!result) break;
            } catch (error) {
              console.log(error);
              console.log('Error in Checking Inactive Visitors Worker Loop');
              break;
            }

          }
        }
      }
    } catch (error) {
      console.log(error);
      console.log('error in Checking Visitors Inactive Worker');
    }

  }

  public async TokenTimouetManager() {
    try {
      let result = await this.DeleteExpiredTokens();
      if (result) console.log('Deleted : ' + result.deletedCount + ' Tokens');

    } catch (error) {
      console.log('Error in Token Timouts');
      console.log(error);

    }
  }

  private Sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }

  public addHours(hours) {
    return new Date().setTime(new Date().getTime() + (hours * 60 * 60 * 1000));
  }
  public addHoursByDate(date: Date, hours) {
    return new Date(date.setTime(date.getTime() + (hours * 60 * 60 * 1000)));
  }
  public addMinutesByDate(date: Date, minutes) {
    return new Date(date.setTime(date.getTime() + (minutes * 60000)));
  }
  public async get2DaysTickets(nspList, greaterThan, includedGroups: Array<any>) {
    // excludedGroups = ['CONGO.D'];
    let datetime = new Date().toISOString();
    let twelveHr = 'T19:00:00.000Z';
    let $lte = datetime.split('T')[0] + twelveHr;
    let $gte = greaterThan.split('T')[0] + twelveHr;
    let query = [
      {
        $match: {
          nsp: { $in: nspList },
          state: { $in: ["OPEN", "PENDING"] },
          'CustomerInfo.customerId': {
            $exists: false
          },
          $or: [
            {
              CustomerInfo: {
                $exists: false
              }
            },
            {
              $and: [
                { 'CustomerInfo.salesPersonName': 'FREE' },
                { 'CustomerInfo.customerId': { '$exists': false } }
              ]
            }
          ],
          // $or:[{nsp:'/sbtjapan.com'},{nsp:'/sbtjapaninquiries.com'}],
          datetime: { $gte: $gte, $lte: $lte }
        }
      },
      {
        $match: {
          $or: [
            { sbtVisitor: { $exists: true } },
            { sbtVisitorPhone: { $exists: true } },
            { ICONNData: { $exists: true } },
            { source: 'livechat' },
            { source: 'email' },
            { 'visitor.phone': { $exists: true } }
          ],
          $and: [
            { group: { $exists: true } },
            { group: { $ne: '' } },
            {
              $or: [
                { entertained: { $exists: false } },
                { entertained: false }
              ]
            }
          ]
        }
      },
      {
        $addFields: {
          manipulatedGroup: {
            $concat: ["$group", "-", "$nsp"]
          }
        }
      },
      {
        $match: {
          nsp: { $exists: true }
        }
      },
      {
        $limit: 50
      },
      {
        $lookup:
        {
          from: "ticketgroups",
          localField: "group",
          foreignField: "group_name",
          as: "groupDetails"
        }

      },
      {
        $match:
        {
          'groupDetails.0': {
            $exists: true
          }
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ];
    if (includedGroups.length) {
      Object.assign(query[3].$match, { manipulatedGroup: { $in: includedGroups } });
    }
    console.log(JSON.stringify(query));
    return await this.ticketsCollection.aggregate(query, { allowDiskUse: true }).toArray();
  }

  public async AutoAssignAgentAccoridngToGroup() {
    // console.log("Checking AutoAssignAgentAccoridngToGroup");
    let includedGroups: any = [];
    let NSPArr: any = [];
    if (process.env.NODE_ENV == 'production') {
      NSPArr = ['/sbtjapan.com', '/sbtjapaninquiries.com'];
    }
    else if (process.env.NODE_ENV == 'development') {
      NSPArr = ['/beelinks.solutions']
    } else {
      NSPArr = ['/localhost.com']
    }
    let currentDate = new Date();
    let groups = await this.GetGroupDetailsByNSP(NSPArr);
    let weekDay = new Date().toString().split(' ')[0];
    if (groups && groups.length) {
      groups.forEach(g => {
        // console.log(g.group_name);
        if (g.generalSettings && g.generalSettings.enabled) {
          let groupDetailList = g.generalSettings.unAvailibilityHours.filter(u => u.weekDay == weekDay);
          let groupDetail: any;
          if (groupDetailList && groupDetailList.length) {
            groupDetail = groupDetailList[0];
          }
          // console.log(groupDetail);
          if (groupDetail) {
            // console.log(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime+'+00');
            let shiftStart = new Date(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime + '+00');
            let shiftEnd = this.addHoursByDate(new Date(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime + '+00'), groupDetail.duration);
            //check if current datetime is greater than shift and is less than shift end
            // console.log('Current DateTime: ' + currentDate);
            // console.log('ShiftStart DateTime: ' + shiftStart);
            // console.log('ShiftEnd DateTime: ' + shiftEnd);
            if (!(currentDate > shiftStart && currentDate < shiftEnd)) {
              includedGroups.push(g.group_name + '-' + g.nsp);
            }
          }
          // else {
          //   excludedGroups.push(g.group_name + '-' + g.nsp);
          // }
        }
        // else {
        //   excludedGroups.push(g.group_name + '-' + g.nsp);
        // }
      })
    }
    // console.log(excludedGroups);
    //Get filtered Tickets
    //Check
    // if (lockDay != 'Sun') {
    console.log("Included groups for automation: ");
    console.log(includedGroups);
    if (includedGroups.length) {
      let previousTickets = await this.get2DaysTickets(NSPArr, this.addHoursByDate(new Date(), -48).toISOString(), includedGroups);
      if (previousTickets && previousTickets.length) {
        console.log('Ticket Length: ' + previousTickets.length);
        let promises = previousTickets.map(async ticket => {
          let generalsettingsdata = ticket.groupDetails[0].generalSettings;
          // console.log(generalsettingsdata.unEntertainedTime);
          // console.log(this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime))
          //incrementing count and appending checking time
          ticket.iterationcount = ((ticket.iterationcount) ? ticket.iterationcount : 0);
          //if iteration count is not equal to limit setted
          let check = false;
          if (ticket.assigned_to && (ticket.first_assigned_time || ticket.last_assigned_time)) {
            if (new Date() > this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime)) {
              if (ticket.iterationcount < generalsettingsdata.assignmentLimit) {
                // let increment = false;
                let agentDetails = await this.getAgentByShiftTime(ticket.assigned_to, ticket.nsp);
                if (agentDetails) {
                  // console.log('Available agent in shift time: ' + ticket.assigned_to);
                  // console.log(agentDetails);
                  //assigned date time + unentertained time
                  let shiftEnd = this.addHoursByDate(new Date(new Date().toLocaleDateString() + ' ' + agentDetails.ShiftStart + '+00'), agentDetails.Duration);
                  // console.log('Current DateTime: ' + currentDate);
                  // console.log('Agent ShiftStart DateTime: ' + new Date(new Date().toLocaleDateString() + ' ' + agentDetails.ShiftStart));
                  // console.log('Agent ShiftEnd DateTime: ' + shiftEnd);
                  // console.log('Ticket Assigned Time + UnEnt: ' + this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime));

                  //check if this time < above time
                  //If session of this user exists, If yes then check if current datetime is gt , check = true
                  let onlineAgents = await this.getAllLiveAgentsByEmails(ticket.nsp, [ticket.assigned_to]);
                  if (onlineAgents && onlineAgents.length) {
                    if (new Date() > this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime)) {
                      check = true;
                    }
                  }

                  if (this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime) <= shiftEnd) {
                    // console.log('Shift still remains, ticket will be re-assigned');
                    check = true;
                    // increment = true;
                  }


                } else {
                  check = true;
                }

              } else {

                if (ticket.assigned_to) ticket.previousAgent = ticket.assigned_to;

                ticket.assigned_to = generalsettingsdata.fallbackLimitExceed;

                if (!ticket.assignmentList) ticket.assignmentList = [];
                let assigned_time = new Date().toISOString();
                ticket.assignmentList.push({
                  assigned_to: ticket.assigned_to,
                  assigned_time: assigned_time,
                  read_date: ''
                });

                if (!ticket.first_assigned_time) ticket.first_assigned_time = assigned_time;
                ticket.last_assigned_time = assigned_time;

                let logSchema: TicketLogSchema = {
                  title: 'Ticket Assigned to Fallback Agent (re-assignment limit exceeded), Iteration: ' + ticket.iterationcount,
                  status: ticket.assigned_to,
                  updated_by: 'Group Auto Assignment',
                  user_type: 'Group Auto Assignment',
                  time_stamp: new Date().toISOString()
                }
                ticket.ticketlog.push(logSchema);
                ticket.entertained = true;
                this.sendNotification = true;
              }
            } else {
              check = false;
            }
          } else {
            check = true;
          }

          if (check) {
            ticket.iterationcount = ticket.iterationcount + 1;

            ticket = await this.getBestFittedAgentInShiftTimes(ticket);
            //above function returned ticket with asisgned_to if best agent founded
            if (ticket && ticket.assigned_to != '') {
              // console.log('Best Agent in shift time: ');
              // console.log(ticket.assigned_to);
              let logSchema: TicketLogSchema = {
                title: 'Ticket Assigned to Shift Time Agent, Iteration: ' + ticket.iterationcount,
                status: ticket.assigned_to,
                updated_by: 'Group Auto Assignment',
                user_type: 'Group Auto Assignment',
                time_stamp: new Date().toISOString()
              }
              ticket.ticketlog.push(logSchema);
              this.sendNotification = true;
            }
            else {
              ticket.assigned_to = generalsettingsdata.fallbackNoShift;
              if (!ticket.assignmentList) ticket.assignmentList = [];
              let assigned_time = new Date().toISOString();
              ticket.assignmentList.push({
                assigned_to: ticket.assigned_to,
                assigned_time: assigned_time,
                read_date: ''
              });
              if (!ticket.first_assigned_time) ticket.first_assigned_time = assigned_time;
              ticket.last_assigned_time = assigned_time;
              // console.log('Assigning to fallback agent: ');
              // console.log(ticket.assigned_to);
              let logSchema: TicketLogSchema = {
                title: 'Ticket Assigned to Fallback Agent (no-one in shift), Iteration: ' + ticket.iterationcount,
                status: ticket.assigned_to,
                updated_by: 'Group Auto Assignment',
                user_type: 'Group Auto Assignment',
                time_stamp: new Date().toISOString()
              }
              ticket.ticketlog.push(logSchema);
              ticket.entertained = true;
              this.sendNotification = true;
            }


          }
          //Emits and email notifications:
          if (this.sendNotification) {
            ticket.lasttouchedTime = new Date().toISOString();

            if (ticket.previousAgent) {
              let ticketlogViewState = ComposedTicketENUM(TicketLogMessages.UPDATE_VIEW_STATE, { value: "UNREAD", by: 'System' });
              // this.UpdateViewState([ticket._id], ticket.nsp, "UNREAD", ticketlogViewState);
              ticket.viewState = "UNREAD";

              if (!ticket.ticketlog) ticket.ticketlog = [];

              ticket.ticketlog.push(ticketlogViewState);

              let previousAgent = await this.getAgentByEmail(ticket.nsp, ticket.previousAgent);

              if (previousAgent) {
                switch (previousAgent.permissions.tickets.canView) {
                  case 'assignedOnly':
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })
                    break;
                  case 'group':
                    if ((ticket.group && !previousAgent.groups.includes(ticket.group)) || !ticket.group) {
                      await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })
                    }
                    break;
                  default:
                    break;
                }
              }

              //Emit to Teams for remove ticket
              let teamsOfPreviousAgent = await this.getTeamsAgainstAgent(ticket.nsp, ticket.previousAgent);
              teamsOfPreviousAgent.forEach(async team => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [team], data: { tid: ticket._id, ticket: ticket } })
              })
            }

            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })
            if (ticket.group) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })

            if (ticket.assigned_to) {
              let assign_Agent = await this.getAgentByEmail(ticket.nsp, ticket.assigned_to);
              if (assign_Agent) {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: ticket.nsp, roomName: [assign_Agent._id], data: { ticket: ticket, ignoreAdmin: false } })
              }

              let recipients = Array();
              let EmailRecipients = Array();
              EmailRecipients.push(ticket.assigned_to);
              recipients = EmailRecipients.filter((item, pos) => {
                return EmailRecipients.indexOf(item) == pos;
              })
              let teams = await this.getTeamsAgainstAgent(ticket.nsp, ticket.assigned_to);
              teams.forEach(async team => {
                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: ticket.nsp, roomName: [team], data: { ticket: ticket, ignoreAdmin: false } })
              });
            }
            if (ticket.watchers && ticket.watchers.length) {
              let watchers = await this.getOnlineWatchers(ticket.nsp, ticket.watchers);
              if (watchers && watchers.length) {
                if (ticket.assigned_to) watchers = watchers.filter(x => { return x != ticket.assigned_to })

                watchers.map(async watcher => {
                  await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })
                })
              }
            }

            let recipients = Array();
            recipients.push(ticket.assigned_to);
            if (ticket.watchers && ticket.watchers.length) {
              recipients = recipients.concat(ticket.watchers);
              recipients = recipients.filter((item, pos) => {
                if (recipients && recipients.length) return recipients.indexOf(item) == pos;
              })
            }
            let msg = '<span>Hello,</span> <br>'
              + '<span>Following ticket is assigned to you </span> <br>'
              + '<span><b>by: </b> Group Auto Assignment <br>'
              + '<span><b>Ticket ID: </b>' + ticket._id + '<br>'
              + '<span><b>Ticket Subject: </b>' + ticket.subject + '<br>'
              + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
            if (recipients && recipients.length) {
              let response = await this.NotifyAgentForTicket({
                ticket: ticket,
                subject: ticket.subject,
                nsp: ticket.nsp.substring(1),
                to: recipients,
                msg: msg
              });
              if (response && !response.MessageId) {
                console.log('Email SEnding TO Agent When Assigning Failed');
              }
            }
          }

          if (ticket.manipulatedGroup) delete ticket.manipulatedGroup;
          if (ticket.groupDetails) delete ticket.groupDetails;

          await this.UpdateTicketObj(ticket);
        });
        await Promise.all(promises);
      }
    }
    console.log('Iteration Completed!');
  }

  public async GetEmailNotificationSettings(nsp: string, email: string) {
    try {
      return this.agentsCollection.find(
        { nsp: nsp, email: email },
        {
          fields: {
            _id: 0,
            'settings.emailNotifications': 1
          }
        })
        .limit(1).toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't get email notifs");

    }
  }
  public async GetGroupDetailsByNSP(nspList) {
    try {
      let groupFromDb = await this.ticketsGroupCollection.find({ nsp: { $in: nspList }, 'generalSettings.enabled': true }).toArray();
      return groupFromDb;
    } catch (error) {
      console.log(error);
    }
  }

  public async getWatchers(id, nsp) {
    try {
      return await this.ticketsCollection.find({ _id: new ObjectID(id), nsp: nsp }).project({ watchers: 1 }).toArray();
    } catch (err) {
      console.log('Error in getting watchers');
      console.log(err);
    }
  }

  public async NotifyAgentForTicket(data: any) {
    try {
      return __biZZC_SQS.SendMessage({ action: 'sendEmailToAgent', data });
    } catch (error) {
      console.log(error);
      console.log('error in NotifyingAgent For Ticket');
    }
  }

  public async getTeamsAgainstAgent(nsp, email) {
    try {
      let teams: any = [];
      let teamsFromDb = await this.teamCollection.find({
        nsp: nsp,
        'agents.email': email
      }).toArray();
      if (teamsFromDb && teamsFromDb.length) {
        teams = teamsFromDb.map(t => t.team_name);
      }
      return teams;
    } catch (err) {
      console.log('Error in getting team against agent');
      console.log(err);

    }
  }

  public async getOnlineWatchers(nsp, data): Promise<any | undefined> {
    try {
      return await this.sessionsCollection.find(
        {
          nsp: nsp,
          type: 'Agents',
          email: {
            $in: data
          }
        },
      ).toArray();

    } catch (error) {
      console.log(error);
      console.log('Error in Getting online watchers');
      return undefined;
    }
  }
  public async UpdateTicketObj(ticket) {
    try {
      await this.ticketsCollection.findOneAndReplace({ _id: new ObjectID(ticket._id) }, (ticket), { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in updating ticket Object');
      console.log(err);

    }
  }

  public async getMessagesByTicketId(ids) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));
      return await this.collectionTicketMessages.find({ tid: { $in: objectIdArray }, senderType: "Agent" }).sort({ _id: -1 }).limit(1).toArray();
    }
    catch (error) {
      console.log('Error in getting message by ticket');
      console.log(error);
    }
  }

  // public async SyncICONNData() {
  //   try {
  //     console.log("start SyncICONNData");

  //     let timeToStart = new Date(new Date().toLocaleDateString() + ' 5:00').toISOString().split('T')[1].split(":")[0];
  //     let timeToEnd = new Date(new Date().toLocaleDateString() + ' 6:00').toISOString().split('T')[1].split(":")[0];
  //     console.log(timeToStart, timeToEnd);

  //     let checkEntry = await this.CheckICONNSyncReport();
  //     if (checkEntry && checkEntry.length && checkEntry[0].dateTime) {
  //       if (new Date(checkEntry[0].dateTime).toDateString() != new Date().toDateString()) {
  //         await this.InsertICONNDataInBeelinks();
  //       }
  //     }
  //     else {
  //       console.log("in else");

  //       await this.InsertICONNDataInBeelinks();
  //     }
  //   } catch (err) {
  //     console.log('Error in syncing iconn data');
  //     console.log(err);
  //     return undefined;
  //   }
  // }

  // public async InsertICONNDataInBeelinks() {
  //   console.log("in InsertICONNDataInBeelinks");

  //   try {
  //     let receivedData: any;
  //     let insertedObj = {
  //       destination: false,
  //       ports: false,
  //       customerType: false,
  //       phoneType: false,
  //       salesPerson: false
  //     }
  //     receivedData = await this.GetMasterData(1);
  //     console.log("receivedData");

  //     if (receivedData) {
  //       let result: any = await this.InsertICONNMasterData('1', receivedData.MasterData);
  //       if (result.status == "ok") insertedObj.destination = true;
  //     }
  //     else insertedObj.destination = false;

  //     if (insertedObj.destination) {
  //       receivedData = await this.GetMasterData(2);
  //       if (receivedData) {
  //         let result: any = await this.InsertICONNMasterData('2', receivedData.MasterData);
  //         if (result.status == "ok") insertedObj.ports = true;
  //       }
  //     }
  //     if (insertedObj.destination) {
  //       receivedData = await this.GetMasterData(3);
  //       if (receivedData) {
  //         let result: any = await this.InsertICONNMasterData('3', receivedData.MasterData);
  //         if (result.status == "ok") insertedObj.customerType = true;
  //       }
  //     }
  //     if (insertedObj.destination) {
  //       receivedData = await this.GetMasterData(4);
  //       if (receivedData) {
  //         let result: any = await this.InsertICONNMasterData('4', receivedData.MasterData);
  //         if (result.status == "ok") insertedObj.phoneType = true;
  //       }
  //     }
  //     if (insertedObj.destination) {
  //       receivedData = await this.GetMasterData(19);
  //       if (receivedData) {
  //         let result: any = await this.InsertICONNMasterData('19', receivedData.MasterData);
  //         if (result.status == "ok") insertedObj.salesPerson = true;
  //       }
  //     }

  //     // await this.InsertIconnSyncInfo(insertedObj);
  //   } catch (err) {
  //     console.log("Error in Insert ICONN Data In Beelinks");
  //     console.log(err);
  //   }
  // }

  // public async GetMasterData(code) {
  //   let masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
  //   let masterData = {
  //     "MasterDataTypeId": code
  //   }
  //   let response = await request.post({
  //     uri: masterDataProductionURL,
  //     body: masterData,
  //     json: true,
  //     timeout: 100000
  //   });
  //   if (response) {
  //     return response;
  //   }
  //   else return undefined;
  // }

  // public async InsertICONNMasterData(code, data) {
  //   try {
  //     console.log("InsertICONNMasterData", code);
  //     let inserted: any;
  //     if (code == '1') inserted = await this.DestinationCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
  //     if (code == '2') inserted = await this.PortsCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
  //     if (code == '19') inserted = await this.SalesPersonCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
  //     if (code == '3') inserted = await this.CustomerTypeCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
  //     if (code == '4') inserted = await this.PhoneTypeCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });

  //     if (inserted && inserted.value) return { status: "ok" };
  //     else return { status: "error" };
  //   } catch (err) {
  //     console.log('Error in Inserting Master data of code :' + code);
  //     console.log(err);
  //     return false;
  //   }
  // }

  // public async InsertIconnSyncInfo(obj) {
  //   try {
  //     obj['dateTime'] = new Date().toISOString()
  //     return await this.IconnSyncInfoCollection.insert(obj);
  //   } catch (err) {
  //     console.log('Error in Inserting iconn sync report');
  //     console.log(err);
  //     return undefined;
  //   }
  // }

  // public async CheckICONNSyncReport() {
  //   return await this.IconnSyncInfoCollection.find({ dateTime: new Date().toISOString() }).project({ dateTime: 1 }).limit(1).toArray();
  // }

  public async getBestFittedAgentInShiftTimes(ticket) {
    try {
      // console.log("in getBestFittedAgentInShiftTimes");
      let filteredAgents: any = [];
      //assign agent
      let count = 0;
      let bestAgent = '';
      let previousAgent = '';
      let groups = ticket.groupDetails;

      if (groups && groups.length) {
        let onlineAgents = await this.getAllLiveAgentsByEmails(groups[0].nsp, groups[0].agent_list.map(a => a.email));
        // let onlineAgents = [{ email: 'mufahad9213@sbtjapan.com' }]
        if (onlineAgents && onlineAgents.length) {
          onlineAgents.map(agent => {
            if (agent.email != ticket.assigned_to) {
              filteredAgents.push({
                email: agent.email,
                count: groups[0].agent_list.filter(a => a.email == agent.email)[0].count,
                isAdmin: groups[0].agent_list.filter(a => a.email == agent.email)[0].isAdmin,
                excluded: groups[0].agent_list.filter(a => a.email == agent.email)[0].excluded
              })
            } else {
              previousAgent = agent.email;
            }
          });
          groups[0].agent_list = filteredAgents;
        } else {
          groups[0].agent_list = [];
        }
        groups[0].agent_list.filter(a => !a.excluded).map((agent, index) => {
          if (index == 0) {
            count = agent.count;
            bestAgent = agent.email;
            return;
          }
          else {
            if (agent.count < count) {
              bestAgent = agent.email;
              count = agent.count;
            }
          }
        })
      }

      if (bestAgent) {
        let assigned_time = new Date().toISOString();
        if (ticket.assignmentList) {
          ticket.assignmentList.push({
            assigned_to: bestAgent,
            assigned_time: assigned_time,
            read_date: ''
          })
        } else {
          ticket.assignmentList = [{
            assigned_to: bestAgent,
            assigned_time: assigned_time,
            read_date: ''
          }]
        }
        ticket.previousAgent = ticket.assigned_to;
        ticket.assigned_to = bestAgent;

        if (!ticket.first_assigned_time) ticket.first_assigned_time = assigned_time;
        ticket.last_assigned_time = assigned_time;
        await this.IncrementCountOfAgent(ticket.nsp, ticket.group, bestAgent);
      } else {
        ticket.previousAgent = ticket.assigned_to;
        ticket.assigned_to = '';
      }

      return ticket;
    } catch (err) {
      console.log(err);
      console.log('Error in Finding Best AGent Ticket');
      return undefined;
    }
  }

  public async IncrementCountOfAgent(nsp, group, bestAgent) {
    try {
      return await this.ticketsGroupCollection.findOneAndUpdate(
        { nsp: nsp, group_name: group, "agent_list.email": bestAgent },
        { $inc: { [`agent_list.$.count`]: 1 } }
      )
    } catch (err) {
      console.log(err);
    }
  }

  public async getAgentByShiftTime(email, nsp) {
    try {
      let result = await this.agentsCollection
        .find({ nsp: nsp, email: email }).project({ ShiftTime: 1 })
        .limit(1)
        .toArray();
      if (result && result.length) return (result[0].ShiftTime) ? result[0].ShiftTime : undefined;
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public async getAllLiveAgentsByEmails(nsp, emails) {
    try {
      return await this.sessionsCollection.find(
        {
          nsp: nsp,
          type: 'Agents',
          email: {
            $in: emails
          }
        },
      ).toArray();

    } catch (error) {
      console.log('Error in get All Live Agents By Emails');
      console.log(error);
    }
  }

  public async getGroupByName(nsp, name) {
    try {
      return this.ticketsGroupCollection.find({ nsp: nsp, group_name: name }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in Getting group by name')
      return [];
    }
  }

  public async getGeneralSettings(nsp, group_name) {
    try {
      let result = await this.ticketsGroupCollection.find({ nsp: nsp, group_name: group_name }).project({ generalSettings: 1 }).limit(1).toArray();
      if (result && result.length) return result[0].generalSettings;
    } catch (err) {
      console.log(err);
    }
  }

  public async Process() {
    try {

      // console.log('Process Started In Worker');
      await this.ConnectDBS();
      await this.GetCollections();
      await this.CheckInactiveVisitorsNonChatting();
      await this.CheckInactiveVisitorsChatting();
      await this.Reactivate();
      await this.DeleteInactiveVisitors();
      await this.DeleteInactiveAgents();
      await this.IntervalAutomaticAssignment();
      await this.AutomaticTransfer();
      await this.AssignQueuedVisitors();
      await this.CheckBannedVisitor();
      await this.TokenTimouetManager();
      // await this.SyncICONNData();
      await this.AutoAssignAgentAccoridngToGroup();

      if (process.env.FIXCOUNT) await this.FixAgentsCount();

    } catch (error) {
      console.log(error);
      console.log('Error in Process Worker');
      this.EndProcess();
    }


  }

  public async EndProcess() {
    this.sessionDB_ref.close();
    this.chatsDB_ref.close();
    this.ticketsDB_ref.close();
    // this.marketingDB_ref.close();
    this.agentsDB_ref.close();
    this.companiesDB_ref.close();
    this.ArchivingDB_ref.close();
  }
}



class REDISCLIENT {

  serverIP = REDISURL
  redisClient: REDIS.RedisClient;
  connected = false;

  constructor() {
    this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true })
    this.redisClient.on('error', (err) => {
      // console.log(this.serverIP);

      console.log('error in Redis', err);
      this.connected = false;
      //Notify Timeout Manager not working
      //   this.Reconnect();
    })
    this.redisClient.on('connect', (data) => {
      console.log('connected to redis in worker');
      this.connected = true;
    })
  }


  Reconnect() {
    try {
      this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true })

    } catch (error) {
      setTimeout(() => {
        this.Reconnect();
      }, 5000);
    }
  }

  SetID(sid, timeInminutes = 0) {
    let result = false;
    if (!timeInminutes) result = this.redisClient.set(sid.toString(), sid.toString());
    else result = this.redisClient.SETEX(sid.toString(), Math.round(timeInminutes * 60), sid.toString());

    return result;
  }

  Exists(sid) {
    let result = false;
    return new Promise((resolve, reject) => {
      result = this.redisClient.get(sid.toString(), (err, data) => {
        // console.log('data : ', data);
        // console.log('err : ', err);
        if (!data || err) resolve(false);
        else return resolve(true);
      });
    })
  }

  GenerateSID(nsp, sid) {
    return new Promise((resolve, reject) => {

      let result = this.redisClient.SET(`_${nsp}_${sid.toString()}`, '1', 'PX', 5000, 'NX', (err, res) => {
        if (!res) resolve(false)
        else resolve(true);
      });
    })

  }

  GetID(key): Promise<any> {
    return new Promise((resolve, reject) => {

      this.redisClient.GET(key, ((err, res) => {
        if (!res) resolve(false);
        else resolve(res);
      }));
    })
  }

  DeleteID(key): Promise<any> {
    return new Promise((resolve, reject) => {

      this.redisClient.DEL(key, ((err, res) => {
        if (!res) resolve(false);
        else resolve(res);
      }));
    })
  }

  Disconnect() {
    this.redisClient.quit();
  }



}




let __BIZZ_REST_REDIS_PUB;
let __BIZZC_REDIS: REDISCLIENT = new REDISCLIENT();
REDISPUBSUB.CreateQueue(REDISMQURL, REDISMQPORT).then((data => {
  //console.log('REDIS CONNECTED IN WORKER');
  __BIZZ_REST_REDIS_PUB = data;
  let worker = new VisitorTimeoutWorker();
  worker.Process().then(async () => {
    //console.log('Process Ended');
    __BIZZC_REDIS.Disconnect();
    __BIZZ_REST_REDIS_PUB.QuitConnection();
    await worker.EndProcess();

  }).catch(async (e) => {
    console.log(e);
  })
})).catch(e => { console.log('Error in Creating Queue At Worker:', e); });








