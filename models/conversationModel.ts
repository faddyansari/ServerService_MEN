
// Created By Saad Ismail Shaikh
// Date : 05-03-18
import { Db, Collection, ObjectID } from "mongodb";
import { MessageSchema } from '../schemas/messageSchema';
import { ObjectId } from "bson";
import { ConversationLogSchema } from "../schemas/conversationLogSchema";
import { Agents } from "./agentModel";
import { ChatsDB } from "../globals/config/databses/ChatsDB";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { ARCHIVINGQUEUE } from "../globals/config/constants";

export class Conversations {


  static db: Db;
  static collection: Collection;
  static initialized = false;
  //static greetingMessage="Hello QA :D";

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await ChatsDB.connect();
      this.collection = await this.db.createCollection('conversations')
      console.log(this.collection.collectionName);
      Conversations.initialized = true;
      return Conversations.initialized;
    } catch (error) {
      console.log('error in Initializing Conversations Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections


  }
  static Destroy() {
    (this.db as any) = undefined;
    (this.collection as any) = undefined;
  }


  public static async getConversationClientID(str: string, nsp: string) {

    // let allConversationHashes = await this.collection.find({ nsp: nsp, clientID: { $exists: true } }, { fields: { clientID: 1 } }).toArray();


    // let obj: any = {};
    // if (allConversationHashes && allConversationHashes.length) allConversationHashes.map(hash => {
    //     obj[hash.clientID] = true
    // })
    let exists: any = [];
    let duplicate = false
    let randomString = '';
    do {

      let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      let exists = await this.collection.find({ nsp: nsp, clientID: randomString }).toArray();

      if (exists && exists.length) duplicate = true
      else duplicate = false
    }
    while (duplicate)

    return randomString;
  }

  public static async SetClientID(cid, nsp, clientID) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }
  public static async InsertCustomerID(customerID, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { CMID: customerID } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Customer ID');
      console.log(error);
    }
  }


  public static async InsertCustomerRegistration(registered, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { Registered: registered } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Customer Registration');
      console.log(error);
    }
  }
  public static async InsertFormDetails(stockFormData, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { StockForm: stockFormData } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Stock List');
      console.log(error);
    }
  }
  public static async InsertStockList(stockList, stockURL, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { StockList: stockList, StockURL: stockURL } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Stock List');
      console.log(error);
    }
  }
  public static async RemoveStockList(cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $unset: { StockList: 1, StockURL: 1 } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Remove Stock List');
      console.log(error);
    }
  }
  public static async InsertCustomerInfo(customerInfo, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { CustomerInfo: customerInfo } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Customer Info');
      console.log(error);
    }
  }
  public static async InsertCountryCode(countryCode, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { countryCode: countryCode } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Customer Info');
      console.log(error);
    }
  }
  public static async InsertSimilar(allCustomer, cid, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(cid), nsp: nsp }, { $set: { RelatedCustomerInfo: allCustomer } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Insert Customer Info');
      console.log(error);
    }
  }

  public static async createConversation(conversationID: ObjectID, visitorEmail: string, sessionid: string, nsp: string, visitorColor, agentEmail?: string, visitorName?: string, state: number = 1, deviceID?: string, greetingMessage?: any): Promise<any> {
    try {
      //console.log(greetingMessage);
      // let agent;
      // if (agentEmail) agent = await Agents.getAgentsByEmail(agentEmail)

      // console.log(agent[0]);

      let conversation = await this.collection.insertOne({
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
        // console.log(conversation);
        if (conversation.insertedId) {
          clientID = await Conversations.getConversationClientID((conversation.ops[0]._id as any).toHexString(), nsp);

          if (clientID) {
            // console.log(clientID);
            let updatedConversation = await Conversations.SetClientID(conversation.ops[0]._id, nsp, clientID.toString());
            if (updatedConversation && updatedConversation.value) {
              conversation.ops[0].clientID = updatedConversation.value.clientID
            }

          }

        }
        // __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: conversation.ops[0] }, ARCHIVINGQUEUE);
        return conversation
      }


    } catch (error) {
      console.log('Error in Create Conversation');
      console.log(error);
    }
  }

  public static async UpdateLastPickedTime(cid, nsp) {
    try {
      console.log('UpdateLastPickedTime');
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid), nsp: nsp },
        {
          $set: {
            lastPickedTime: new Date().toISOString()

          }
        }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Update Last Picked Time for Chat');
    }
  }

  public static async MakeInactive(cid: string) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        { $set: { inactive: true } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('error in Making Conversation Inactive');
      console.log(error);
    }
  }

  public static async UpdateConversationState(cid: string, state: number, makeInactive) {
    try {

      if (!makeInactive) {

        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: { state: state, inactive: false } },
          { returnOriginal: false, upsert: false });

      } else {
        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: { state: state, inactive: true } },
          { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation');
    }
  }

  /**
   *
   * @param cid
   * @param message
   * @param options : { insertMessageID : boolean, email : string , MessageId : string | ObjectId }
   */

  public static async UpdateLastMessage(cid: string, message: any, options?: any) {
    try {

      let inserMessageID = (options && options.insertMessageID && options.email && options.MessageId) ? true : false
      if (inserMessageID) {
        return await this.collection.findOneAndUpdate({
          _id: new ObjectID(cid), ['assigned_to.email']: options.email
        }, {
          $set: { lastMessage: message, entertained: true },
          $addToSet: { ['assigned_to.$.messageIds']: { id: new ObjectID(options.MessageId), date: message.date } }
        }, { returnOriginal: false, upsert: false });

      } else {
        return await this.collection.findOneAndUpdate(
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

  public static async getMessagesByTime(cid, date, _id: string = '') {
    try {
      if (_id) return this.db.collection('messages').find({ cid: new ObjectID(cid), _id: { $gt: new ObjectID(_id) } }).sort({ _id: 1 }).toArray();
      else return await this.db.collection('messages').find({ cid: new ObjectID(cid) }).toArray();

    } catch (error) {
      console.log('Error in Get Messag By Time');
      console.log(error);
      return [];
    }
  }

  public static async getInactiveChat(cid, timeInMinutes, checkCreatedOn) {
    try {
      let date = new Date();
      date.setMinutes(date.getMinutes() - timeInMinutes);
      console.log('Getting Inactive Chat : ', { cid: cid, timeInMinutes: timeInMinutes });
      if (!checkCreatedOn) {
        return await this.collection.find(
          {
            _id: new ObjectID(cid),
            $and: [
              {
                lastMessage: { $exists: true },
                ['lastMessage.date']: { $lte: date.toISOString() },
              }
            ]
          }).limit(1).toArray();
      } else {
        return await this.collection.find(
          {
            _id: new ObjectID(cid),
            $or: [
              { $and: [{ lastMessage: { $exists: true }, ['lastMessage.date']: { $lte: date.toISOString() } }] },
              { createdOn: { $lte: date.toISOString() } }
            ]



          }).limit(1).toArray();

      }

    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation');
      return [];
    }
  }

  public static async getCustomerConversations(filter, nsp, token = 'deviceID', chunk = '') {

    try {
      let agent;
      let search: any = {}
      if (!filter) return [];

      else {

        search.nsp = nsp;
        search[token.toString()] = filter;
        let searchObj = {
          "lastMessage": { "$ne": "" },
          "endingDate": { "$exists": true }
        }

        search = Object.assign(search, searchObj)
        // search.$and = [{ "lastMessage": { "$ne": null } }, { "lastMessage": { "$ne": "" } }, { "state": { $in: [1, 3, 4] } }, { "endingDate": { "$exists": true } }]
        if (chunk) search._id = { $lt: new ObjectId(chunk) }

        let obj = {};

        if (token == 'visitorEmail') obj = {
          $not: /unregistered/gi
        }
        else obj = {
          $exists: true
        }
        if ((search as Object).hasOwnProperty(token)) {
          search.$and = [];
          search.$and[0] = {}
          search.$and[0][token] = obj

        }
        else search[token] = obj
      }

      //console.log(search);

      let conversations = await this.collection.find(search).sort({ _id: -1 }).limit(10).toArray();
      if (conversations && conversations.length) {
        let updatedList = conversations.map(async (convo) => {

          if (convo.agentEmail) {
            agent = await Agents.getAgentsByEmail(convo.agentEmail)

            if (agent && agent.length) {
              convo.agentName = agent[0].nickname
            }
          }
          return convo;
        })
        return await Promise.all(updatedList);
      }

    }
    catch (error) {
      console.log('Error in Get Messag By Device ID');
      console.log(error);
      return [];
    }

  }

  public static async getMoreConversationsByDeviceID(deviceID, id, nsp) {

    //new ObjectID()
    try {
      let agent;
      let conversations = await this.collection.find({
        nsp: nsp, deviceID: deviceID,
        "lastMessage": { "$ne": "" },
        "endingDate": { "$exists": true },
        _id: { $lt: new ObjectID(id) },
        // { "state": { $in: [1, 3, 4] } },

      }).sort({ _id: -1 }).limit(5).toArray();

      if (conversations && conversations.length) {
        let updatedList = conversations.map(async (convo) => {

          if (convo.agentEmail) {
            agent = await Agents.getAgentsByEmail(convo.agentEmail);

            if (agent && agent.length) {
              convo.agentName = agent[0].nickname
            }
          }
          return convo;
        })
        return await Promise.all(updatedList);
      }

    }
    catch (error) {
      console.log('Error in Get Messag By Device ID');
      console.log(error);
      return [];
    }

  }

  // public static async getConversationsByDeviceID2(deviceID) {

  //     try {
  //         return await this.collection.find({ deviceID: deviceID, "lastMessage": { "$exists": true, "$ne": "" }}).toArray();
  //     }
  //     catch (error) {
  //         console.log('Error in Get Messag By Device ID');
  //         console.log(error);
  //         return [];
  //     }

  // }


  public static async getMessagesByCid(cid) {
    try {
      return await this.db.collection('messages').find({ cid: new ObjectID(cid) }).toArray();
    } catch (error) {
      console.log('Error in Get Messag By Cid');
      console.log(error);
    }
  }

  /**
   *
   * @param cid : string
   * @param data : { id , subject , createdby , createdDate , clientID }
   */

  public static async InsertTicketDetails(cid, data) {

    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        {
          $push: { tickets: data }
        }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log(error);
      console.log('Error in iserting ticket details into conversation');
    }

  }


  public static async getArchives(email: string, canView, filters, nsp, chunk: string = '0', query = []) {
    try {



      let clause = "$and";
      let filtersObject = { [clause]: ([] as any) }
      // console.log(filters);

      // let obj = {
      //     "agentEmail": email,
      //     $and:
      //         [{
      //             state: { $in: [1, 4] }, lastMessage: { $exists: 1 }, endingDate: { $exists: 1 }, nsp: nsp,
      //         }]
      // };
      let obj = { "agentEmail": email, state: { $in: [1, 4] }, lastMessage: { $exists: 1 }, endingDate: { $exists: 1 }, nsp: nsp };
      let override = undefined;
      if (filters) {
        if (filters.filter) {
          if (filters.filter.override) {
            override = JSON.parse(JSON.stringify(filters.filter.override));
            delete filters.filter.override;
          }
          Object.keys(filters.filter).map(key => {

            if (key == 'daterange') {
              // console.log('From: ' + new Date(filters.filter[key].from).toISOString());
              // console.log('To: ' + filters.filter[key].to);
              filters.filter[key].to = new Date(new Date(filters.filter[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
              // console.log('To: ' + new Date(filters.filter[key].to).toISOString());
              filtersObject[clause].push({ 'createdOn': { $gte: new Date(filters.filter[key].from).toISOString(), $lte: new Date(filters.filter[key].to).toISOString() } });
              return;
            }
            if (key == 'agentEmail') {
              if (canView == 'all') {
                (obj.agentEmail as any) = { '$in': filters.filter[key] };
                //filtersObject[clause].push({ [key]: { '$in': filters.filter[key] } });
              }
              return;
            }
            if (key == 'state') {
              delete obj.state;
              // delete obj.$and[0].state;
              filtersObject[clause].push({ [key]: { '$in': filters.filter[key] } });
              return;
            }
            if (key == 'tickets') {
              if (filters.filter[key] != 'all') filtersObject[clause].push({ [key]: { '$exists': (filters.filter[key] == 'yes') ? true : false } });
              return;
            }
            // console.log(key);
            if (key == 'transferred') {

              if (filters.filter[key]) filtersObject[clause].push({ ['assigned_to.1']: { '$exists': true } });
              return;
            }
            if (key == 'missed') {
              // console.log(key);
              // console.log(filters.filter);

              // console.log(filters.filter[key]);

              if (filters.filter[key]) filtersObject[clause].push({ ['missed']: true });
              else filtersObject[clause].push({ ['missed']: { '$exists': false } });
              return;
            }
            // if(key == 'tags'){
            //     let tagList = filters.filter[key].map(t => '#' + t);
            //     // console.log(tagList);
            //     filtersObject[clause].push({ [key]: { '$in': tagList } });
            //     return;
            // }
            if (Array.isArray(filters.filter[key])) {
              filtersObject[clause].push({ [key]: { '$in': filters.filter[key] } });
            }
            else filtersObject[clause].push({ [key]: filters.filter[key] })



          });
        }
        if (filters.userType) {
          switch (filters.userType) {
            case 'unregistered':
              filtersObject[clause].push({ visitorEmail: 'Unregistered' })
              break;
            case 'registered':
              filtersObject[clause].push({ visitorEmail: { '$ne': 'Unregistered' } });
              break;
            default:
              break;
          }
        }
      }
      // filtersObject[clause].forEach(element => {
      //     console.log(element.filter);
      // });
      if (filtersObject[clause].length) Object.assign(obj, filtersObject);
      if (override) {
        Object.keys(override).map(key => {
          if (key == "agentEmail") {
            if (canView == 'all') {
              if (override && (override as any)[key] && obj[key]) obj[key] = (override as any)[key];
            }
          } else {
            if (override && (override as any)[key] && obj[key]) obj[key] = (override as any)[key];
          }

        });
      }
      // console.log((obj[clause] && obj[clause].length) ? obj[clause][0].lastmodified : '');
      // console.log(JSON.stringify(obj));
      // console.log(JSON.stringify(obj));

      let sort: any;
      if (filters && filters.sortBy && filters.sortBy.name) {
        sort = {
          [filters.sortBy.name]: parseInt(filters.sortBy.type)
        }
      }
      // console.log(obj);

      if (chunk == "0") {

        if (query.length) {
          return await this.collection.aggregate(query).toArray();
        }

        // console.log(obj);
        // console.log((obj as any).$and);

        return await this.collection.aggregate([
          { "$addFields": { "lastmodified": { "$ifNull": ["$lastMessage.date", "$createdOn"] }, "synced": false } },
          { "$match": obj },
          { "$sort": (sort) ? sort : { 'lastmodified': -1 } },
          { "$limit": 20 }

        ]).toArray();
      } else {
        if (filters && filters.sortBy && filters.sortBy.name) {
          if (parseInt(filters.sortBy.type) == 1) {
            //ASC
            Object.assign(obj, { [filters.sortBy.name]: { "$gt": chunk } });
          } else {
            //DESC
            Object.assign(obj, { [filters.sortBy.name]: { "$lt": chunk } });
          }
        } else {
          Object.assign(obj, { 'createdOn': { "$lt": chunk } });
        }
        // console.log(obj);
        // console.log((obj as any).$and)

        return await this.collection.aggregate([
          { "$addFields": { "lastmodified": { "$ifNull": ["$lastMessage.date", "$createdOn"] }, "synced": false } },
          { "$match": obj },
          { "$sort": (sort) ? sort : { 'lastmodified': -1 } },
          { "$limit": 20 }

        ]).toArray();
      }

    } catch (error) {
      console.log(error);
      console.log('error in getting Archives from Model');
    }
  }


  public static async getArchiveMessages(cid: string, chunk: string = "0") {
    try {
      if (chunk == "0") {
        return await this.db.collection('messages').aggregate([
          { "$match": { "cid": new ObjectID(cid) } },
          { "$sort": { "date": -1 } },
          { "$limit": 20 },
          { "$sort": { "date": 1 } }


        ]).toArray();

      } else {
        return await this.db.collection('messages').aggregate([
          { "$match": { "cid": new ObjectID(cid), "_id": { "$lt": new ObjectID(chunk) } } },
          { "$sort": { "date": -1 } },
          { "$limit": 20 },
          { "$sort": { "date": 1 } }

        ]).toArray();
      }

    } catch (error) {
      console.log(error);
      console.log('error in Get Archives');
    }
  }

  public static async getConversations(email, allChats = 'self', nsp, accessBotChats = false, chunk: string = '0') {
    let search: any = {};
    search.nsp = nsp
    search.agentEmail = { $in: [email] },
      search.state = { $in: [2, 3] }

    // if (chunk != '0') obj._id = { $lt: new ObjectID(chunk) }
    if (accessBotChats) {
      search.agentEmail.$in.push('chatBot')
      search.state.$in.push(5);
    }
    // (allChats == 'all') ? search.$or = obj : search.$and = obj
    if (chunk != '0') search._id = { $lt: new ObjectID(chunk) }

    let conversations = await this.collection.find(search).sort({ _id: -1 }).limit(20).toArray();
    return conversations;
  }


  public static async getSupervisedConversation(email, nsp, id, allChats = 'self') {
    // { _id: ObjectId('5e2e728bf52a003b5464a70e'), $and : [{ agentEmail: { $ne: 'farmanahmed2007@hotmail.com' } }, { state: { $in: [1, 2] } }, { superviserAgents: { $in: [new ObjectId('5e2e7263f52a003b5464a70c')] } }], nsp : '/localhost.com' }
    let obj: any = [
      { agentEmail: { $ne: { email } } },
      { state: { $in: [1, 2] } },
      { superviserAgents: { $in: [id.toHexString()] } }
    ];
    // if (chunk != '0') obj._id = { $lt: new ObjectID(chunk) }
    let search: any = {};
    (allChats == 'all') ? search.$or = obj : search.$and = obj
    search.nsp = nsp

    return await this.collection.find(search).sort({ _id: -1 }).toArray();
  }




  public static async getConversationsByIDs(IDs: Array<string>, email?) {
    let data: Array<ObjectId> = [];
    IDs.forEach(id => {
      data.push(new ObjectId(id));
    });
    if (email) return await this.collection.find({ _id: { '$in': data }, agentEmail: email }).toArray();
    else return await this.collection.find({ _id: { '$in': data } }).toArray();
  }

  public static async GetConversationById(cid: string) {
    try {
      return await this.collection.find({ _id: new ObjectId(cid) }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public static async getConversationBySessionID(nsp: string, sid: string) {
    try {
      return await this.collection.find({
        nsp: nsp, $or: [
          { sessionid: sid },
          { sessionid: new ObjectId(sid) }
        ]
      }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public static async getConversationBySid(cid: string) {
    return await this.collection.aggregate([
      { "$match": { "_id": new ObjectID(cid) } },
      {
        "$lookup": {
          "from": 'messages',
          "let": { "id": "$_id" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": ["$$id", "$cid"] } } },
          ],
          "as": 'messages'
        }
      }
    ]).toArray();
  }

  public static async updateMessageReadCount(cid, seen = false) {
    try {
      if (!seen) return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $inc: { messageReadCount: 1 } }, { returnOriginal: false, upsert: false });
      else return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $set: { messageReadCount: 0 } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Update Message By Count');
      console.log(error);
    }
  }




  public static async UpdateVisitorInfo(cid: string, username: string, email: string) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        {
          $set: {
            visitorEmail: email,
            visitorName: username
          }
        }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Update Visitor Conversation Info');

    }
  }

  public static async TransferChatUnmodified(cid, agentEmail, lastPickedTime?) {
    try {
      let msgReadCount = await this.db.collection('messages').count({ cid: new ObjectId(cid.toString()) });

      let promises = await Promise.all([
        this.db.collection('messages').count({ cid: new ObjectId(cid.toString()) }),
        this.collection.update(
          { _id: new ObjectID(cid), ['assigned_to.email']: { $ne: agentEmail } },
          { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
          { upsert: false }),
        this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: {
              agentEmail: agentEmail,
              messageReadCount: msgReadCount,
              state: 2,
              lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
            }
          }, { returnOriginal: false, upsert: false })
      ])
      let result = promises[2];
      return result;
      // return this.collection.findOneAndUpdate(
      //     { _id: new ObjectID(cid) },
      //     {
      //         $set: {
      //             agentEmail: agentEmail,
      //             messageReadCount: msgReadCount,
      //             state: 2,
      //             lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString()

      //         }
      //     }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Transfer Chat');
    }
  }

  public static async TransferChat(cid, agentEmail: string, makeInactive: boolean, lastPickedTime?) {
    try {
      let msgReadCount = await this.db.collection('messages').count({ cid: new ObjectId(cid.toString()) });

      let promises = await Promise.all([
        this.db.collection('messages').count({ cid: new ObjectId(cid.toString()) }),
        this.collection.update(
          { _id: new ObjectID(cid), ['assigned_to.email']: { $ne: agentEmail } },
          { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
          { upsert: false }),
        this.collection.findOneAndUpdate(
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
      let result = promises[2];
      return result;

    } catch (error) {
      console.log(error);
      console.log('Error in Transfer Chat');
    }
  }

  //updating queued List for conversation
  public static UpdateQueuedCount(cid, nsp, queuedEvent) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid), nsp: nsp },
        {
          $push: { queuedEventList: queuedEvent }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in Updating Queud List');
      console.log(error);
    }
  }

  //SuperViseChat
  public static SuperViseChat(cid, nsp, _id) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid), nsp: nsp },
        {
          $addToSet: { superviserAgents: _id }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in supervising Chat');
      console.log(error);
    }
  }
  //End SuperVisedChat
  public static EndSuperVisedChat(cid, nsp, _id) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid), nsp: nsp },
        {
          $pull: { superviserAgents: _id }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in supervising Chat');
      console.log(error);
    }
  }

  public static async EndChat(cid, updateState: boolean, session, survey?: any,) {
    try {
      if (updateState) {

        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: (!survey) ? { state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { feedback: survey, state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' }
          }, { returnOriginal: false, upsert: false });
      } else {

        return await this.collection.findOneAndUpdate(
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

  public static async EndChatMissed(cid, session, survey?: any,) {
    try {

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        {
          $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' } : { endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' }
        }, { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in End Chat Missed');
    }
  }

  public static async AddFirstResponseTime(message: any, email: string) {
    try {

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(message.cid), ['assigned_to.email']: email },
        { $set: { ['assigned_to.$.firstResponseTime']: new Date(message.date) } },
        { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in Updating Last Message');
    }
  }

  public static async AddPenaltyTime(cid: string, email: string, lastMessageTime: string) {
    try {
      let lastTime = new Date(lastMessageTime);
      let currentTime = new Date();
      // console.log(lastTime.toISOString());
      // console.log(currentTime.toISOString());
      // console.log((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString()));
      let Difference = ((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString())) / 1000) / 60;

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid), ['assigned_to.email']: email },
        { $inc: { ['assigned_to.$.penaltyTime']: Difference } },
        { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in Updating Last Message');
    }
  }


  public static async SubmitSurvey(cid, survey: any) {
    try {

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(cid) },
        {
          $set: { feedback: survey }
        }, { returnOriginal: false, upsert: false });


    } catch (error) {
      console.log(error);
      console.log('Error in End Chat');
    }
  }


  public static async StopChat(cid, state?) {
    try {
      if (state) {

        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid), missed: true },
          {
            $set: { state: state, stoppingDate: new Date().toISOString() }

          }, { returnOriginal: false, upsert: false });
      } else {
        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          {
            $set: { state: 4, stoppingDate: new Date().toISOString() }

          }, { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log(error);
      console.log('Error in End Chat');
    }
  }


  public static async getMessages1(cid) {
    try {
      // console.log('getting messages');
      // console.log(cid);
      return await this.db.collection('messages').find({ cid: new ObjectId(cid.toString()) }).toArray();

    } catch (error) {
      console.log('Error in getting MEssages 1 ');
      console.log(error);
      return [];
    }
  }

  public static getMessages(cid) {
    return this.db.collection('messages').find({ cid: new ObjectId(cid.toString()) }).toArray();
  }
  public static async insertMessage(data) {
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
    return await this.db.collection('messages').insertOne(message);
  }
  public static async UpdateConverSationEmail(conversationID, agentEmail: string, state: number = 2) {

    // console.log('UpdateConverSationEmail');
    // console.log(agentEmail);
    // console.log(conversationID);

    let cid: any;
    try {
      let promises = await Promise.all([
        this.collection.update(
          { _id: new ObjectID(conversationID), ['assigned_to.email']: { $ne: agentEmail } },
          { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
          { upsert: false }),
        this.collection.findOneAndUpdate(
          { _id: new ObjectID(conversationID) },
          {
            $set: {
              agentEmail: agentEmail, state: state, lastPickedTime: new Date().toISOString()
            }
          },
          { returnOriginal: false, upsert: false })
      ])
      let result = await promises[1];
      return result;

    } catch (error) {
      console.log('Error in Create Conversation');
      console.log(error);
    }
  }

  public static async UpdateConversation(cid: string, makeInactive: boolean, data: any) {

    try {
      // console.log('Updating Conversation State : ', cid);
      // console.log(makeInactive);
      if (!makeInactive) {
        data['inactive'] = false;
        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: JSON.parse(JSON.stringify(data)) },
          { returnOriginal: false, upsert: false });

      } else {
        data['inactive'] = true
        return await this.collection.findOneAndUpdate(
          { _id: new ObjectID(cid) },
          { $set: JSON.parse(JSON.stringify(data)) },
          { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Updating Conversation Generic in worker');
    }

  }

  public static submitSurvey(data) {
    try {
      let cid = data.cid;
      delete data.cid;
      this.collection.findOneAndUpdate({ _id: new ObjectID(cid) },
        { $set: { feedback: data, state: 3 } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in submit Survery');
    }

  }

  public static async endConversation(conversationID) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectID(conversationID) }, { $set: { state: 3 } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Ending Conversation');
    }
  }

  public static async updateDeliveryStatus(msgID) {
    try {
      return await this.db.collection('messages').findOneAndUpdate({ _id: new ObjectID(msgID) }, { $set: { delivered: true, sent: false } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in updating sent Status');
    }
  }

  public static async updateSentStatus(msgID) {
    try {
      return await this.db.collection('messages').findOneAndUpdate({ _id: new ObjectID(msgID) }, { $set: { sent: true } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in updating Delivery Status');
    }
  }



  //#region Visitor Registed Messages Loading
  public static async GetMessagesRegisteredVisitor(email: string, mid = '0') {
    try {
      return await this.collection.aggregate([
        { "$match": { "visitorEmail": email, state: 3 } },
        {
          "$lookup": {
            "from": 'messages',
            "let": { "id": "$_id" },
            "pipeline": [
              { "$match": { "$expr": { $and: [{ "$eq": ["$$id", "$cid"] }, { "$lt": ["$$" + mid, "$_id"] }] } } },
              { "$sort": { "date": -1 } },
              { "limit": 20 }
            ],
            "as": 'messages'
          }
        },
        { "$sort": { "_id": -1 } },
        { "$group": { _id: 't_aarshad@engro.com', messages: { $push: "$messages" } } },
        { "$project": { "messages": { "$slice": ["$messages", 20] } } }
      ])

    } catch (error) {
      console.log(error);
      console.log('error in Getting Messages For Regisitered Visitor');
    }
  }

  public static async UpdateAllLastMessagenByCID(cid: string) {

    try {

      let messagesList = await this.collection.aggregate([
        { "$match": { "_id": new ObjectID(cid) } },
        {
          "$lookup": {
            "from": 'messages',
            "let": { "id": "$_id" },
            "pipeline": [
              { "$match": { "$expr": { "$eq": ["$$id", "$cid"] } } },
              { "$sort": { "date": -1 } },
              { "$limit": 20 }
            ],
            "as": 'messages'
          }
        }
      ]).toArray();
      // console.log(messagesList);
      //return messagesList;
      //console.log(messagesList);
      //this.collection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $set: { lastMessage: messagesList } }, { returnOriginal: false, upsert: false });

    }
    catch (error) {
      console.log(error);
      console.log('error in Getting Messages For Regisitered Visitor');
    }
  }


  public static async addConversationTags(_id: string, nsp: string, tag: Array<string>, ConversationLog: ConversationLogSchema | any) {

    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectID(_id), nsp: nsp }, {
        $addToSet: { ConversationLog: ConversationLog, tags: { $each: tag as any } }
      }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Tagging Conversation');
    }
  }

  public static async GetClientIDByConversationID(cid, nsp) {
    try {
      return await this.collection.find({ _id: new ObjectID(cid), nsp: nsp }).limit(1).toArray();
    } catch (error) {
      console.log('Error in Getting ClientID');
      return undefined;
    }

  }
  public static async GetCustomFeedbackByConversationID(cid, nsp) {
    try {
      return await this.collection.find({ _id: new ObjectID(cid), nsp: nsp },

        {
          fields: {
            visitorCustomFields: 1
          }
        }).limit(1).toArray();
    } catch (error) {
      console.log('Error in Getting CustomFeedback');
      return undefined;
    }
  }

  public static async deleteConversationTag(_id: string, nsp, tag: string, index) {
    try {

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(_id), nsp: nsp },
        {
          $pull: { tags: tag }
        }, { upsert: false, returnOriginal: false }
      )

    } catch (error) {
      console.log('Error in deleting tag');
      console.log(error);
    }
  }

  public static async UpdateDynamicProperty(cid: ObjectId, name: string, value: string, log: any) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(cid) },
        {
          $set: { [`dynamicFields.${name}`]: value },
          $push: { customFieldLog: log }
        },
        { upsert: false, returnOriginal: false }
      );


    } catch (error) {
      console.log('Error in updating dynamic field value');
      console.log(error);
    }
  }
  public static async UpdateDynamicPropertyByVisitor(cid: ObjectId, data: any, log: any) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(cid) },
        {
          $set: { [`visitorCustomFields`]: data },
          $push: { customFieldLog: log }
        },

        { upsert: false, returnOriginal: false }
      );


    } catch (error) {
      console.log('Error in updating dynamic field value');
      console.log(error);
    }
  }

  public static async GetCustomerConversationCount(filter, nsp, token = 'deviceID', chunk = '') {
    try {

      let search: any = {}
      if (!filter) return [];

      else {


        search.nsp = nsp;
        search[token] = filter;
        search.$and = [{ "lastMessage": { "$ne": null } }, { "lastMessage": { "$ne": "" } }, { "state": { $in: [1, 3, 4] } }, { "endingDate": { "$exists": true } }]
        if (chunk) search._id = { $lt: new ObjectId(chunk) }

        let obj = {};

        if (token == 'visitorEmail') obj = {
          $not: /unregistered/gi
        }
        else obj = {
          $exists: true
        }
        if ((search as Object).hasOwnProperty(token)) {
          search.$and = [];
          search.$and[0] = {}
          search.$and[0][token] = obj

        }
        else search[token] = obj
      }
      // console.log(search);

      return await this.collection.aggregate([
        { "$match": search },
        { "$group": { "_id": null, "count": { $sum: 1 } } }
      ]).toArray();

    } catch (error) {
      console.log('Error in Getting Visitors  conversation Count');
      console.log(error);
    }
  }

    public static async getAllChats(nsp, dateFrom, dateTo) {

        try {
            let result = await this.collection.aggregate([
                {
                    "$match": {
                        "nsp": nsp,
                        "createdOn": {
                            "$gte": dateFrom,
                            "$lt": dateTo
                        }
                    }
                },
                {
                    "$project":
                    {
                        "data": { $substr: ["$createdOn", 0, 10] }
                    }
                },
                {
                    "$group": {
                        _id: { data: "$data" },
                        count: { $sum: 1 }
                    }
                }

            ]).toArray();
            if (result.length) return result
            else return [];
        } catch (err) {
            console.log('Error in getting data');
            console.log(err);
            return [];
        }
    }


  //query for updating each conversation "lastMessage" field with any last message in message collection of that conversation
  // public static async abc() {
  //     try {
  //         let conv = await this.collection.find().forEach(x => {

  //             let messageArray = this.db.collection('messages').find({ cid: x._id }).sort({ _id: -1 }).limit(1).forEach(z => {
  //                 // if (z) x.lastMessage = z;
  //                 console.log(z);
  //                 //console.log(z)
  //             });
  //             this.collection.save(x);
  //         });

  //     } catch (error) {

  //         console.log(error);
  //     }
  // }



  //#endregion
}
