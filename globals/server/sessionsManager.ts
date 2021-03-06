// Created By Saad Ismail Shaikh
// Date : 01-03-18

import { Db, Collection, ObjectID, FindAndModifyWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { DataBaseConfig } from "../config/database";
import { InsertOneWriteOpResult } from "mongodb";
import { AgentSessionSchema } from "../../schemas/agentSessionSchema";
import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
import { visitorSessions } from "../../models/visitorSessionmodel";
import { agentSessions } from "../../models/agentSessionModel";
import { EventLogSchema } from "../../schemas/EventLogsSchema";
import { EventLogs } from "../../models/eventLogs";
import { Visitor } from "../../models/visitorModel";
import { __biZZC_Core } from "../__biZZCMiddleWare";
import { Conversations } from "../../models/conversationModel";
import { ApplyRuleSets } from "../../actions/ChatActions/AssignmentRuleSetDispatcher";

//const session = require("express-session");


const { ObjectId } = require('mongodb');

export class SessionManager {
  static AssignQueuedChatToManual(sender: any, conversationID: any) {
    throw new Error("Method not implemented.");
  }
  private static sessionQueue = {

  };
  private static sessionList = {

  };

  static db: Db;
  static collection: Collection;


  static Initialize(reconnect) {

    // Database Connection For Session Storage.
    DataBaseConfig.connect()
      .then((db) => {
        this.db = db;
        console.log('Session MAnager Initialized');
        this.db.createCollection('sessions')
          .then(async (collection) => {
            console.log(collection.collectionName);
            this.collection = collection;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static Destroy() {
    (this.db as any) = undefined;
    (this.collection as any) = undefined;
  }


  //#region VISITOR SESSIONS FUNCTIONS NEW SESSION MANAGEMENT IN MONGO WILL MOVE TO REDIS AFTER PERSISTENCY




  //#endregion

  //#region Visitor Functions MongoDb
  public static async getVisitor(session, sessionID?): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {
        let visitor = await this.collection.find({
          _id: new ObjectId((sessionID) ? sessionID : (session.id || session._id))
        }).limit(1).toArray();

        if (visitor.length) return visitor[0];
        else return undefined;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Get Visitors Old');
      console.log(error);
    }
  }

  public static async GetVisitorByID(sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {
        let visitor = await this.collection.find({
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

  public static async UpdateDeviceToken(sessionID, token: string): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {

        let visitor = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(sessionID)
          },
          {
            $set: { deviceID: token }
          },
          { returnOriginal: false, upsert: false }
        );

        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Get Device Token');
      console.log(error);
    }
  }
  public static async UpdateChatInitiatedDetails(sessionID, url: string, startedBy: string, invited: boolean): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {

        let visitor = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(sessionID)
          },
          {
            $set: { chatFromUrl: url, startedBy: startedBy, invited: invited }
          },
          { returnOriginal: false, upsert: false }
        );

        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Get Device Token');
      console.log(error);
    }
  }

  public static async GetSessionForChat(_id: string) {
    try {
      if (this.db && this.collection) {
        let session = await this.collection.find(
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

  public static async SetAdditionalData(data: any, sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {
        let visitor = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(sessionID),
            type: 'Visitors'
          },
          {
            $set: { additionalData: data }
          }
        );

        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Set Additional Data');
      console.log(error);
    }
  }

  public static async SetRequestedCarData(data: any, sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {
        let visitor = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(sessionID),
            type: 'Visitors'
          },
          {
            $set: { carRequestData: data }
          }
        );

        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Set Request Car Data');
      console.log(error);
    }
  }

  public static async GetBrowsingVisitors(nsp): Promise<VisitorSessionSchema[] | undefined> {
    try {
      if (this.db && this.collection) {
        let visitors = await this.collection.find({
          nsp: nsp,
          type: 'Visitors',
          state: 1
        }).toArray();

        if (visitors.length) visitors;
        else return [];
      } else return undefined;
    } catch (error) {
      console.log('Error in Get Browsing Visitors');
      console.log(error);
    }
  }

  public static async GetVisitorsForInvitation(nsp, timeInMinutes): Promise<VisitorSessionSchema[] | undefined> {
    try {
      // console.log(timeInMinutes);
      // console.log(new Date(Date.parse(new Date().toISOString()) + 1000 * 60 * timeInMinutes));
      // console.log({
      //     nsp: nsp,
      //     type: 'Visitors',
      //     state: 1,
      //     creationDate: { $lte: new Date(Date.parse(new Date().toISOString()) + 1000 * 60 * timeInMinutes) }
      // });
      if (this.db && this.collection) {
        let visitors = await this.collection.find({
          nsp: nsp,
          type: 'Visitors',
          state: 1,
          inactive: false,
          creationDate: { $lte: new Date(new Date().getTime() - 1000 * 60 * timeInMinutes).toISOString() }
        }).toArray();

        if (visitors.length) return visitors;
        else return [];
      } else return [];
    } catch (error) {
      console.log('Error in Get Browsing Visitors');
      console.log(error);
      return [];
    }
  }

  public static async UpdateState(session, state, checkstate = false): Promise<VisitorSessionSchema | undefined> {
    try {
      let visitor;
      if (this.db && this.collection) {
        if (checkstate) {
          visitor = await this.collection.findOneAndUpdate(
            {
              _id: new ObjectId(session.id),
              state: 4,
            },
            {
              $set: { state: state }
            }, { returnOriginal: false, upsert: false }
          )

        } else {
          visitor = await this.collection.findOneAndUpdate(
            {
              _id: new ObjectId(session.id),
            },
            {
              $set: { state: state }
            }, { returnOriginal: false, upsert: false }
          )
        }


        if (visitor && visitor.value) return visitor.value;
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Update State');
      console.log(error);
    }
  }

  public static async UnseAgentFromVisitor(sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {
        let session = await this.GetVisitorByID(sessionID)
        if (session) {
          let visitor = await this.collection.findOneAndUpdate(
            {
              _id: new ObjectId(sessionID)
            },
            {
              $set: {
                previousState: ((session.inactive) ? '-' : '') + session.state.toString(),
                state: 2,
                agent: { id: '', nickname: '', image: '' },
              },
            }, { returnOriginal: false, upsert: false });

          if (visitor && visitor.value) {
            if (visitor.value.previousState) await this.UpdateChatStateHistory(visitor.value)
            return visitor.value;
          }
          else return undefined;
        } else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Unsetting Agent From Visitor');
      console.log(error);
    }
  }


  public static async UpdateChatStateHistory(session): Promise<VisitorSessionSchema | undefined> {
    try {


      if (this.db && this.collection) {

        let conversation = (session.conversationID) ? await Conversations.GetConversationById(session.conversationID) : ''
        // if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == session.state)) return session
        // let states = { prevState: session.previousState, nextState: session.state , date : new Date().toISOString()}
        if (conversation && conversation.length) {

          let pullSuperViserAgent = false

          // if(conversation[0].superviserAgents.includes(session.agent.id)) await this.EndSuperVisedChat(conversation[0]._id, session.nsp, session.agent.id)
          if (conversation[0].superviserAgents.includes(session.agent.id)) pullSuperViserAgent = true

          let states = { prevState: session.previousState, nextState: ((((session.inactive) ? '-' : '') + session.state.toString()) + ''), date: new Date().toISOString() }
          if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == states.nextState) && (session.stateHistory[session.stateHistory.length - 1].prevState == states.prevState)) return session;



          let visitor = await this.collection.findOneAndUpdate(
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

  public static async UpdateChatQueHistory(session, picketBy): Promise<VisitorSessionSchema | undefined> {
    try {
      if (this.db && this.collection) {

        let obj = {
          pickedBy: picketBy,
          date: new Date().toISOString(),
          agentID: (session.agent && session.agent.id) ? session.agent.id : '',
        }
        let visitor = await this.collection.findOneAndUpdate(
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

  public static async UpdateUserInformation(session, data): Promise<VisitorSessionSchema | undefined> {
    try {
      //console.log(data);
      if (this.db && this.collection) {
        let visitor = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(session.id || session._id)
          },
          {
            $set: JSON.parse(JSON.stringify(data))
          }, { returnOriginal: false, upsert: false }
        )

        if (visitor && visitor.value) {
          await this.UpdateChatStateHistory(visitor.value)
          return visitor.value;
        }
        else return undefined;
      } else return undefined;
    } catch (error) {
      console.log('Error in Update User Information');
      console.log(error);
      return undefined;
    }
  }


  //#endregion


  //#region Generic SESSION FUNCTIONS Mongodb

  public static async insertSession(session: any, databse: boolean): Promise<InsertOneWriteOpResult<any> | undefined> {
    try {
      if (this.db && this.collection) {
        let _id = new ObjectID();
        session._id = _id;
        session.id = _id;
        //session.creationDate = new Date(session.creationDate);
        return await this.collection.insertOne(session);
      } else return undefined;
    } catch (error) {
      console.log('Error in Inserting Session');
      console.log(error);
    }
  }


  public static async UpdateSession(sid, session, newState?, previousState?, checkInactive?) {
    if (this.db && this.collection) {

      session.state = (newState) ? newState : session.state
      if (previousState && (!session.previousState || (session.previousState && (previousState != newState)))) session.previousState = previousState
      let obj: any = {};
      Object.assign(obj, session);
      //console.log("Update Session");
      // console.log(session);
      delete obj._id;
      let updatedSession;
      if (checkInactive) {
        updatedSession = await this.collection.update(
          { _id: new ObjectId(sid), inactive: false },
          { $set: JSON.parse(JSON.stringify(obj)) },
          { upsert: false, multi: false }
        );
      } else {
        updatedSession = await this.collection.update(
          { _id: new ObjectId(sid) },
          { $set: JSON.parse(JSON.stringify(obj)) },
          { upsert: false, multi: false }
        );
      }
      if (updatedSession && updatedSession.result) {
        if (obj.previousState) await this.UpdateChatStateHistory(obj)
        return updatedSession.result;
      }
      else return undefined;
    } else return undefined;
  }

  public static async UpdateSessionPermissions(nsp, role, permissions) {
    if (this.db && this.collection) {
      return await this.collection.updateMany(
        { nsp: nsp, role: role },
        { $set: { permissions: permissions } }
      );
    } else return undefined;

  }



  public static async updateIsMobileBoolean(sid, isMobile) {
    if (this.db && this.collection) {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(sid) }, { $set: { isMobile: isMobile } }, { returnOriginal: false, upsert: false });
    } else return undefined;
  }

  public static async DeleteSession(sid) {
    return await this.collection.findOneAndDelete({ _id: new ObjectId(sid) });
  }


  public static async RemoveSession(session: any, unset: boolean) {
    try {
      if (this.db && this.collection) {
        let asyncDelete = this.DeleteSession(session._id || session.id);
        let deletedDocument: FindAndModifyWriteOpResultObject<any>;
        switch (session.type) {
          case 'Agents':
            deletedDocument = await asyncDelete;
            if (deletedDocument) {
              await agentSessions.InserAgentSession(deletedDocument.value);
              return deletedDocument.value;
            }
            else if (session) { await agentSessions.InserAgentSession(session); return session }
          default:
            switch (session.state.toString()) {
              case '3':
              case '4':
                if (unset) {
                  await this.UnsetChatFromAgent(session);
                  await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
                }
                deletedDocument = await asyncDelete
                // if (deletedDocument && deletedDocument.ok) {
                //     deletedDocument.value['ending_time'] = new Date().toISOString();
                //     deletedDocument.value['email'] = (SelfAgent && SelfAgent.value) ? SelfAgent.value.email : '';
                // }
                break;
              default:
                // case '1':
                // case '5':
                // case '2':
                deletedDocument = await asyncDelete
                //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
                // if (deletedDocument && deletedDocument.ok) {
                //     deletedDocument.value['ending_time'] = new Date().toISOString();
                // }
                break;

            }

            await Visitor.UpdateVisitorSessionByDeviceID(session.deviceID, (session._id) ? session._id.toString() : session.id);
            return await visitorSessions.InsertVisitorSession(deletedDocument.value);
        }
      } else return undefined;

    } catch (error) {
      console.log('Error in Remove Session');
      console.log(error);
    }

  }




  public static async RemoveContactSession(nsp, email) {
    try {
      if (this.db && this.collection) {
        return await this.collection.findOneAndDelete({ nsp: nsp, email: email, type: 'Contact' });
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Remove Contact Session');
      console.log(error);
    }
  }

  public static async GetQueuedSession(nsp: string) {
    try {
      if (this.db && this.collection) {
        let queuedSession = await this.collection.find({
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


  public static async GetAllInactiveVisitors(nsp: string, inactivityTimeout: number, chattingVisitors: boolean): Promise<Array<any>> {
    let inactiveSessions: Array<any> = [];
    try {

      if (!nsp) return [];
      if (!isNaN(inactivityTimeout)) {
        let date = new Date();
        date.setMinutes(date.getMinutes() - inactivityTimeout);
        if (this.db && this.collection) {
          inactiveSessions = await this.collection.find({
            $and: [
              { nsp: nsp },
              { inactive: false },
              { state: { $in: (chattingVisitors) ? [3, 2] : [1, 4, 5, 8] } },
              { lastTouchedTime: { $lte: date.toISOString() } }
            ]
          }).toArray();
        }
      }
      return inactiveSessions;

    } catch (error) {
      console.log(error);
      console.log('error in GetAllInactiveNonChattingUsers');
      return inactiveSessions;
    }
  }

  public static async GetAllWaitingVisitors(nsp: string): Promise<Array<any>> {
    let inactiveSessions: Array<any> = [];
    try {
      if (this.db && this.collection) {
        inactiveSessions = await this.collection.find({
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


  public static async GetAllChattingVisitors(nsp: string): Promise<Array<any>> {
    let sessions: Array<any> = [];
    try {
      if (this.db && this.collection) {
        sessions = await this.collection.find({
          nsp: nsp,
          $or: [
            { state: 2 },
            { state: 3 },
            { state: 4 },
          ],
        }).toArray();
      }
      return sessions;
    }
    catch (error) {
      console.log(error);
      console.log('error in GetAllVisitors');
      return sessions;
    }
  }

  public static async GetAllVisitors(nsp: string): Promise<Array<any>> {
    let sessions: Array<any> = [];
    try {
      if (this.db && this.collection) {
        sessions = await this.collection.find({
          nsp: nsp,
          type: 'Visitors'
        }).toArray();
      }
      return sessions;
    }
    catch (error) {
      console.log(error);
      console.log('error in GetAllVisitors');
      return sessions;
    }
  }

  public static async GetVisitorsCount(nsp) {
    try {
      return await this.collection.aggregate([
        { "$match": { "nsp": nsp, "type": "Visitors" } },
        { "$group": { "_id": null, "count": { $sum: 1 } } }
      ]).toArray();

    } catch (error) {
      console.log('Error in Getting Visitors Count');
      console.log(error);
    }
  }

  public static async GetALLExpiredSessions(nsp: string, type: string): Promise<Array<any>> {
    try {
      let expiredSessions: any[] = []
      if (this.db && this.collection) {
        if (!nsp && !type) {
          expiredSessions = await this.collection.find({
            $and: (type == 'Agents') ?
              [{ expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }] :
              [{ expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }]
          }).toArray();
        }
        if (!nsp && type) {
          expiredSessions = await this.collection.find({
            $and: (type == 'Agents') ?
              [
                { nsp: nsp },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { nsp: nsp },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]
          }).toArray();
        }

        if (nsp && !type) {
          expiredSessions = await this.collection.find({
            $and: (type == 'Agents') ?
              [
                { type: type },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { type: type },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]

          }).toArray();
        }

        if (nsp && type) {
          expiredSessions = await this.collection.find({
            $and: (type == 'Agents') ?
              [
                { nsp: nsp }, { type: type },
                { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
              ] : [
                { nsp: nsp }, { type: type },
                { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
              ]
          }).toArray();
        }
      }
      return expiredSessions;

    } catch (error) {
      console.log(error);
      console.log('Error In Getting Expired Sessions');
      return [];
    }
  }






  public static async SetExpiry(sessionID: string, timeInMinutes: number) {
    try {
      // console.log('setting Expiry : ', sessionID);
      if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
      let date = new Date();
      date.setMinutes(date.getMinutes() + timeInMinutes);
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            _id: new ObjectID(sessionID)
          },
          {
            $set: { expiry: date.toISOString() }
          }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error In SetExpiry');
    }
  }

  public static async UnSetExpiry(sessionID: string) {
    try {
      if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            _id: new ObjectID(sessionID)
          },
          {
            $unset: { expiry: 1 },
            $set: {
              lastTouchedTime: new Date().toISOString(),
              inactive: false
            }
          }, { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      //console.log(sessionID);
      console.log(error);
      console.log('Error In UnSetExpiry');
    }
  }


  public static async MarkReActivate(sessionID: string, data?: any) {
    try {
      if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
      if (this.db && this.collection) {
        if (data && Object.keys(data).length) {
          data['lastTouchedTime'] = new Date().toISOString();
          // data['inactive'] = false;
          data['makeActive'] = true;
          return this.collection.findOneAndUpdate(
            {
              _id: new ObjectID(sessionID)
            },
            {
              $unset: { expiry: 1 },
              $set: JSON.parse(JSON.stringify(data)),
            }, { returnOriginal: false, upsert: false }
          )
        } else {
          return this.collection.findOneAndUpdate(
            {
              _id: new ObjectID(sessionID)
            },
            {
              $unset: { expiry: 1 },
              $set: { lastTouchedTime: new Date().toISOString(), makeActive: true },
            }, { returnOriginal: false, upsert: false }
          )
        }
      } else {
        return undefined;
      }
    } catch (error) {
      //console.log(sessionID);
      console.log(error);
      console.log('Error In UnsetInactive');
    }
  }


  public static async UpdateLastTouchedTime(sessionID: string) {
    try {
      console.log('Updating Last TOuched Time');
      if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            _id: new ObjectID(sessionID)
          },
          {
            $unset: { expiry: 1 },
            $set: { lastTouchedTime: new Date().toISOString(), inactive: false }
          }, { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      //console.log(sessionID);
      console.log(error);
      console.log('Error In UnsetInactive');
    }
  }

  public static async SetInactive(sessionID: string) {
    try {
      if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            _id: new ObjectID(sessionID)
          },
          {
            $set: { inactive: true }
          }, { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      //console.log(sessionID);
      console.log(error);
      console.log('Error In Setting Active');
    }
  }


  //#endregion

  //#region NEW AGENT FUNCTIONS OPERATION ON DB
  public static async getAgentByEmail(nsp, data): Promise<any | undefined> {
    try {
      if (this.db && this.collection) {
        let agent: any;
        if (data.includes('@')) {
          agent = await this.collection.find(
            {
              nsp: nsp,
              email: data
            }
          ).limit(1).toArray();
        } else {
          agent = await this.collection.find(
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
  public static async getSessionsForCall(nsp, data): Promise<any | undefined> {
    try {
      let agent: any;
      if (this.db && this.collection) {
        if (data.includes('@')) {
          agent = await this.collection.find(
            {
              nsp: nsp,
              email: data
            }
          ).limit(1).toArray();
        } else if (data != '') {
          agent = await this.collection.find(
            {
              nsp: nsp,
              _id: new ObjectId(data)
            }
          ).limit(1).toArray();
        }
      }
      if (agent && agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Agent From Email');
      return undefined;
    }
  }

  public static async GetAllActiveAgents(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.db && this.collection) {

        agent = await this.collection.find(
          {
            $and: [
              { nsp: session.nsp },
              { acceptingChats: true },
              { type: 'Agents' },
              { _id: { $nin: temp } },
              { ['permissions.chats.canChat']: true },
              {
                isAdmin: {
                  $exists: false
                }
              }
            ]
          }).limit(1).toArray();
        //#region Optional Code
        // if (ignoreConcurrentChatLimit) {

        //     agent = await this.collection.find(
        //         {
        //             $and: [
        //                 { nsp: session.nsp },
        //                 { acceptingChats: true },
        //                 { type: 'Agents' },
        //                 { _id: { $nin: temp } },
        //                 {
        //                     isAdmin: {
        //                         $exists: false
        //                     }
        //                 }
        //             ]
        //         }).limit(1).toArray();
        // } else {
        // agent = await this.collection.find(
        //     {
        //         $and: [
        //             { nsp: session.nsp },
        //             { acceptingChats: true },
        //             { type: 'Agents' },
        //             { _id: { $nin: temp } },
        //             {
        //                 isAdmin: {
        //                     $exists: false
        //                 }
        //             },
        //             { $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] } }
        //         ]
        //     }).limit(1).toArray();
        // (agent as Array<AgentSessionSchema>).filter(agent => { return agent.concurrentChatLimit < agent.chatCount  })
        //}
        //#endregion
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }

  public static async GetChattingAgents(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.db && this.collection) {
        let obj: any = [{
          nsp: session.nsp,
          acceptingChats: true,
          type: 'Agents',
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
        }];
        let search: any = {};
        search.$and = obj
        agent = await this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }

  public static async GetChattingAgentsForInvite(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.db && this.collection) {
        let obj: any = [{
          nsp: session.nsp,
          type: 'Agents',
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
        }];
        let search: any = {};
        search.$and = obj
        agent = await this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }

  public static async GetAllActiveAgentsChatting(session, exclude: Array<any> = []): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      let temp = exclude.map(id => { return new ObjectID(id); })
      if (this.db && this.collection) {
        let obj: any = [{
          nsp: session.nsp,
          acceptingChats: true,
          type: 'Agents',
          _id: { $nin: temp },
          ['permissions.chats.canChat']: true,
          isAdmin: { $exists: false },
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
        }
        ];
        let search: any = {};
        search.$and = obj
        agent = await this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else return undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return undefined;
    }
  }

  //#region Duplicate Functions
  public static async getAllLiveAgents(nsp: string, exclude: Array<any> = []) {
    try {
      exclude = exclude.map(id => { return new ObjectID(id) });
      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents',
            acceptingChats: true,
            ['permissions.chats.canChat']: true,
            _id: { $nin: exclude }
          },
        ).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Getting All Live Agents');
      console.log(error);
    }

  }

  public static async resetAgentChatCounts(nsp, type) {
    try {
      (await this.collection.find({ nsp: nsp, type: type, 'permissions.chats.canChat': true }).toArray() as Array<any>).map(async session => {
        let promises = Object.keys(session.rooms).map(async key => {
          let visitorSession = await this.collection.find({ _id: new ObjectId(key as string) }).limit(1).toArray();
          if (!visitorSession.length || (visitorSession.length && visitorSession[0].inactive)) delete session.rooms[key];
        });
        await Promise.all(promises);
        session.chatCount = Object.keys(session.rooms).length;
        this.collection.save(session);
      });

    } catch (error) {
      console.log(error);
    }
  }

  public static async getAllLiveAgentsForCount(nsp: string) {
    try {
      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents'
          },
        ).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in get All Live Agents For Count');
      console.log(error);
    }

  }
  public static async getAllLiveAgentsByEmails(nsp: string, emails) {
    try {
      //console.log(emails);
      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents',
            email: {
              $in: emails
            }
          },
        ).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in get All Live Agents By Emails');
      console.log(error);
    }

  }

  public static async GetLiveAvailableAgentForVisitors(nsp: string) {
    try {
      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents',
            acceptingChats: true,
            ['permissions.chats.canChat']: true,
            isAdmin: {
              $exists: false,
            }
          }, {
          fields: {
            _id: 1,
            image: 1,
            nickname: 1,
          }
        }).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Get Live Available Agent For Visitors');
      console.log(error);
    }

  }

  public static async GetAllMobileVisitorsDeviceIDs(nsp: string, exclude: Array<any> = []) {
    try {
      exclude = exclude.map(id => { return new ObjectID(id) });
      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Visitors',
            isMobile: true,
          },
          {
            fields: {
              deviceID: 1,
            }
          }).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Get All Mobile Visitors DeviceIDs');
      console.log(error);
    }

  }

  public static async GetAllAgents(session): Promise<AgentSessionSchema | undefined> {
    try {
      //  { socketID: { $gt: [] } }
      let agent: any = [];
      if (this.db && this.collection) {
        agent = await this.collection.find(
          {
            nsp: session.nsp
          }).limit(1).toArray();
      }

      if (agent.length) return agent[0];
      else undefined;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
    }
  }
  public static async GetAllAgentsByNSP(nsp) {
    try {
      //  { socketID: { $gt: [] } }
      let agents: any = [];
      if (this.db && this.collection) {
        agents = await this.collection.find(
          {
            type: 'Agents',
            nsp: nsp
          }).toArray();
      }

      return agents;
    } catch (error) {
      console.log('Error in Get Agents');
      console.log(error);
      return [];
    }
  }
  //#endregion


  public static async GetBestAgent(nsp) {
    try {

      let bestAgent = await this.collection.find(
        {
          nsp: nsp,
          acceptingChats: true,
          ['permissions.chats.canChat']: true,
          // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
          type: 'Agents',
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
        }, { sort: { "chatCount": 1 } },
      ).limit(1).toArray();
      if (bestAgent && bestAgent.length) return bestAgent[0];
      else return undefined;

    } catch (error) {
      console.log('Error in Get Best Agent');
      console.log(error);
      return undefined;
    }
  }



  public static async AllocateAgent(VisitorSession: VisitorSessionSchema, conversationID: ObjectID, exclude: any[] = [], state?, ruleSetSearch = ''): Promise<any | undefined> {
    //Refactored

    //console.log('ruleSetSearch : ', ruleSetSearch)
    try {
      if (this.db && this.collection) {
        exclude = exclude.map(id => { return new ObjectID(id) });
        let search: any = {
          $or: []
        };
        let $and: any = {
          $and: []
        };
        // search.$or.push(JSON.parse(JSON.stringify($and)));

        let actualRule = {
          nsp: VisitorSession.nsp,
          acceptingChats: true,
          ['permissions.chats.canChat']: true,
          // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
          type: 'Agents',
          _id: { $nin: exclude },
          $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] }
        }

        // search.$or[0]['$and'][0] = actualRule

        // if (ruleSetSearch) {
        //   search.$or.push(JSON.parse(JSON.stringify($and)));
        //   search.$or[1]['$and'][0] = (JSON.parse(JSON.stringify(actualRule)))
        //   Object.assign(search.$or[1]['$and'][0], ruleSetSearch);
        // }
        let bestAgent: any = {};
        if (Object.keys(ruleSetSearch).length) {

          search.$or.push(JSON.parse(JSON.stringify($and)));
          search.$or[0]['$and'][0] = JSON.parse(JSON.stringify(actualRule))
          Object.assign(search.$or[0]['$and'][0], ruleSetSearch);

          // search.$or[1]['$and'][0] = actualRule

          bestAgent = await this.collection.findOneAndUpdate(
            search,
            {
              $set: {
                [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
              },
              $inc: {
                chatCount: 1, visitorCount: 1
              }
            }, { returnOriginal: false, upsert: false },
          )
        }

        if (bestAgent && !bestAgent.value) {

          search.$or.push(JSON.parse(JSON.stringify($and)))
          search.$or[0]['$and'][0] = actualRule

          bestAgent = await this.collection.findOneAndUpdate(
            search,
            {
              $set: {
                [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
              },
              $inc: {
                chatCount: 1, visitorCount: 1
              }
            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
          )
        }

        //for rulset search (if agent not available then visitor should be unassigned)
        // let obj: any = [
        //     { nsp: VisitorSession.nsp },
        //     { acceptingChats: true },
        //     { ['permissions.chats.canChat']: true },
        //     // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
        //     { type: 'Agents' },
        //     { _id: { $nin: exclude } },
        //     { $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] } }
        // ];

        // let search: any = {};
        // search.$and = obj

        // console.log(search);
        // console.log(search.$or[0]);
        // console.log(search.$or[1]);


        // let bestAgent = await this.collection.findOneAndUpdate(
        //   search,
        //   {
        //     $set: {
        //       [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
        //     },
        //     $inc: {
        //       chatCount: 1, visitorCount: 1
        //     }
        //   }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
        // )

        VisitorSession.previousState = (((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString());

        let updatedVisitorSession = await this.collection.findOneAndUpdate(
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


        }
        else return undefined;
      } else {
        return undefined;
      }
    } catch (error) {

      console.log('Error in Allocating Agent');
      console.log(error);
      return undefined;
    }

  }


  public static async ToogleChatMode(AgentSession: AgentSessionSchema, chatMode: string): Promise<any | undefined> {
    //Refactored
    try {
      if (this.db && this.collection) {
        switch (chatMode) {
          case 'IDLE':
            return await this.collection.findOneAndUpdate(
              {
                _id: new ObjectID(AgentSession.id || AgentSession._id),
                nsp: AgentSession.nsp,
              },
              {
                $set: { state: 'IDLE', acceptingChats: false },
                $push: {
                  idlePeriod: {
                    $each: [{ startTime: new Date().toISOString(), endTime: undefined }],
                    $position: 0
                  }
                }
              }, { returnOriginal: false, upsert: false }
            );

          case 'ACTIVE':
            return await this.collection.findOneAndUpdate(
              {
                _id: new ObjectID(AgentSession.id || AgentSession._id),
                nsp: AgentSession.nsp
              },
              {
                $set: {
                  state: 'ACTIVE',
                  acceptingChats: true,
                  ['idlePeriod.0.endTime']: new Date().toISOString()
                },
              }, { returnOriginal: false, upsert: false }
            )
        }
      } else {
        return undefined;
      }
    } catch (error) {

      console.log('Error in Toggle Chat Mode');
      console.log(error);
      return undefined;
    }

  }

  public static async SetAgentChatCount(Agent, chatCount) {
    try {
      if (this.db && this.collection) {
        return await this.collection.findOneAndUpdate(
          {
            email: Agent.email,
            nsp: Agent.nsp,
            _id: new ObjectID(Agent.id),
          }, {
          $set: { chatCount: chatCount },

        }, { returnOriginal: false, upsert: false }
        );
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error in setting Chat Count for Agent');
    }
  }


  public static async UnsetChatFromAgent(session: VisitorSessionSchema) {
    try {
      // console.trace();
      // console.log(this.db);
      // console.log(this.collection);
      if (this.db && this.collection) {
        return await this.collection.findOneAndUpdate(
          {
            nsp: session.nsp,
            _id: new ObjectID(session.agent.id),
            [`rooms.${((session._id as string).toString() || ((session.id as string)).toString())}`]: { $exists: true }
          }, {
          $unset: { [`rooms.${((session._id || session.id) as any).toString()}`]: 1 },
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

  public static async getConversationByAgentID(nsp, id) {
    try {
      let list: any;
      if (this.db && this.collection) {
        list = await this.collection.find({
          type: 'Visitors',
          "agent.id": id,
        }).toArray();
      }
      if (list && list.length) return list
      else return []

    } catch (error) {
      console.log(error);
      console.log('Error in Unsetting Chat From Agent');
    }

  }

  public static GetLiveAdminSessionFromDatabase(email: string) {
    //{ nsp: '/admin' },
    return this.collection.find(
      {
        $and: [
          { type: "Agents" },
          { isAdmin: { $exists: true } },
          { email: email.toLowerCase() }
        ]
      })
      .limit(1)
      .toArray();
  }

  public static GetLiveSessionAgentByEmail(email: string) {

    return this.db.collection('sessions').find(
      {
        $and: [
          { type: "Agents" },
          { email: email.toLowerCase() },
          { updated: true },
          { isAdmin: { $exists: false } },
        ]
      })
      .limit(1)
      .toArray();
  }

  public static GetLiveResellerSessionFromDatabase(email: string) {
    //{ nsp: '/admin' },
    return this.collection.find(
      {
        $and: [
          { type: "Reseller" },
          { isReseller: { $exists: true } },
          { email: email.toLowerCase() }
        ]
      })
      .limit(1)
      .toArray();
  }

  public static async updateSessions(emails, team, type = '$push') {
    try {
      let modifiedCount = 0;
      console.log(emails);
      let sessions: UpdateWriteOpResult;
      if (type == '$push') {
        sessions = await this.collection.updateMany({ email: { '$in': emails } }, { $addToSet: { teams: team } });
      } else {
        sessions = await this.collection.updateMany({ email: { '$in': emails } }, { $pull: { teams: team } });
      }
      if (sessions && sessions.modifiedCount > 0) {
        modifiedCount = sessions.modifiedCount;
      }
      return modifiedCount;
    } catch (err) {
      console.log('Error in updating sessions');
      console.log(err);
    }
  }


  public static async GetAgentByID(id: string) {
    try {
      let agent: any = [];
      if (this.db && this.collection && (id && id != 'undefined')) {
        agent = await this.collection.find({
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

  public static async sendVisitorList(session) {
    try {
      let visitorList: any = [];
      if (this.db && this.collection) {
        visitorList = await this.collection.find(
          { nsp: session.nsp, type: 'Visitors' }
        ).toArray();
      }
      if (visitorList.length) return visitorList
      else return [];

    } catch (error) {
      console.log('Error in Sending Visitors List');
      console.log(error);
      return [];
    }
  }




  //#endregion

  public static async UpdateSessionGroup(sid, location: Array<string>) {
    //console.log('Sid');
    //console.log(sid);
    if (this.db && this.collection) {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(sid) }, {
        $set: {
          location: location
        }
      }, { returnOriginal: false, upsert: false });
    }

  }
  public static async UpdateCallingState(data, obj) {
    //console.log('Sid');
    //console.log(sid);
    if (this.db && this.collection) {
      if (data.includes('@')) {
        return await this.collection.findOneAndUpdate({ email: data }, {
          $set: {
            callingState: obj
          }
        }, { returnOriginal: false, upsert: false });
      } else {
        return await this.collection.findOneAndUpdate({ _id: new ObjectId(data) }, {
          $set: {
            callingState: obj
          }
        }, { returnOriginal: false, upsert: false });
      }
    }
  }

  public static async updateConversationState(nsp, email, cid, state) {
    //console.log(email, cid, state);
    if (this.db && this.collection) {
      return await this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { conversationState: { cid: cid, state: state } } }, { returnOriginal: false, upsert: false });
    }
  }

  public static async setConversationID(sid, cid) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectID(sid) },
        { $set: { conversationID: new ObjectId(cid) } },
        { returnOriginal: false, upsert: false }
      );

    } catch (error) {
      console.log(error);
      console.log('error in setting Conversation state');
    }
  }

  public static async UserAvailableForCalling(nsp, data, obj) {
    try {
      if (this.db && this.collection) {
        if (data.includes('@')) {
          return await this.collection.findOneAndUpdate(
            {
              nsp: nsp,
              email: data,
              type: 'Agents'
            }, {
            $set: {
              callingState: obj
            }
          }, { returnOriginal: false, upsert: false });

        } else {
          return await this.collection.findOneAndUpdate(
            {
              nsp: nsp,
              _id: new ObjectId(data),
              type: 'Visitors'
            }, {
            $set: {
              callingState: obj
            }
          }, { returnOriginal: false, upsert: false });
        }
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Agent From Email');
      return undefined;
    }
  }

  public static async UpdateCallingStateAgent(email, agent) {
    //console.log('Sid');
    //console.log(sid);
    if (this.db && this.collection) {
      return await this.collection.findOneAndUpdate({ email: email }, {
        $set: {
          'callingState.agent': agent
        }
      }, { returnOriginal: false, upsert: false });
    } else {
      return undefined;
    }

  }





  public static Exists(sid: any) {
    try {

      if (!sid) return undefined;
      if (this.db && this.collection) {
        return this.collection.find({ _id: new ObjectId(sid), updated: true }).limit(1).toArray();
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Session Exists');
      console.log(error);
      return undefined;
    }
  }

  public static ExistandUpdate(sid: any, href: string) {
    try {
      if (!sid) return undefined;
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          { _id: new ObjectId(sid) },
          {
            $push: { "url": { $each: [(href) ? href.trim() : ''], $position: 0, $slice: 6 } },
            $unset: { expiry: 1 },
            $set: { newUser: false, typingState: false, lastTouchedTime: new Date().toISOString() }
          },
          { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Session Exists');
      console.log(error);
      return undefined;
    }
  }

  public static Exists_registered(email) {
    try {

      // console.log(email);

      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            isMobile: true,
            email: email
          },
          {
            $set: { newUser: false }
          }, { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Session Exists');
      console.log(error);
      return undefined;
    }
  }
  public static Exists_contact(email) {
    try {
      if (this.db && this.collection) {
        return this.collection.findOneAndUpdate(
          {
            type: 'Contact',
            email: email
          },
          {
            $set: { newUser: false }
          }, { returnOriginal: false, upsert: false }
        )
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Error in Session Exists');
      console.log(error);
      return undefined;
    }
  }

  //#region Actions For Main Session Data

  public static async UpdateAgentGroup(groupName, Agents) {
    if (this.db && this.collection) {
      return this.collection.update(
        {
          email: { $in: Agents },
          location: { $nin: [groupName] }
        },
        {
          $addToSet: { location: groupName }
        }, { multi: true, upsert: false });
    } else {
      return undefined;
    }
  }

  public static async UpdateVisitorsGroup(nsp, groupName, deactivate = false) {
    if (this.db && this.collection) {
      return this.collection.update(
        {
          nsp: nsp,
          state: { $in: [1, 4, 5] },
          type: 'Visitors',
          country: groupName,
        },
        {
          $set: { location: (!deactivate) ? groupName : 'DF' }
        }, { multi: true, upsert: false });
    } else {
      return undefined;
    }
  }


  public static RemoveAgentSessionFromGroup(nsp, location, sid, agentEmail?) {

    try {

      let sessionMap = this.sessionList;
      if (sessionMap[nsp][location]['Agents' + location][sid] != undefined) {
        delete sessionMap[nsp][location]['Agents' + location][sid];
      }
      //console.log(sessionMap);
      if (this.db && this.collection) {
        if (agentEmail) {
          this.collection.findOneAndUpdate(
            {
              email: agentEmail,
              location: { $in: [location] }
            },
            {
              $pull: { location: location }
            }, { returnOriginal: false, upsert: false, });
        }
      }


    } catch (error) {
      console.log('Error in Removing Agent Location SESSION MANAGER');
      console.log(error);
    }

  }
















  public static checkSession(sid): any | undefined {
    try {
      if (this.db && this.collection) {
        return this.collection.find({ _id: sid }).toArray()
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      console.log('error in Check Session');
      return undefined
    }
  }




  // Returns Agents Session
  public static async AssignAgent(Visitorsession, AgentSessionID: string, conversationID: ObjectID, state?): Promise<any | undefined> {
    console.log('Assigning Agent');
    try {
      if (this.db && this.collection) {
        let updatedAgent = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(AgentSessionID),
            ['permissions.chats.canChat']: true,
            acceptingChats: true
          },
          {
            $set: {
              [`rooms.${(Visitorsession.id as any).toString()}`]: (Visitorsession.id as any).toString(),
            },
            $inc: {
              chatCount: 1, visitorCount: 1
            }
          },
          { returnOriginal: false, upsert: false }
        )
        if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
          let previousState = (((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()) + '';

          let updatedVisitorSession = await this.collection.findOneAndUpdate(
            { _id: new ObjectID(Visitorsession.id || Visitorsession._id) },
            {
              $set: {
                agent: {
                  id: updatedAgent.value._id.toString(),
                  name: (updatedAgent.value.nickname) ? updatedAgent.value.nickname : updatedAgent.value.name,
                  image: (updatedAgent.value.image) ? updatedAgent.value.image : ''
                },
                state: (!state) ? 3 : state,
                previousState: previousState,
                conversationID: conversationID,
                username: Visitorsession.username,
                email: Visitorsession.email

              }
            },
            { returnOriginal: false, upsert: false }
          );
          if (updatedVisitorSession && updatedVisitorSession.value) {
            if (updatedVisitorSession.value.previousState) await this.UpdateChatStateHistory(updatedVisitorSession.value)
            // setTimeout(async () => {
            //     let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
            //     let count = 0;
            //     if (convos) {
            //         console.log(convos);
            //         count = convos.length
            //         let updatedCount = await SessionManager.SetAgentChatCount(updatedAgent.value, count)
            //         if (updatedCount) console.log(updatedCount);

            //     }
            // }, 0);

            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          }
          else {
            await this.UnsetChatFromAgent(Visitorsession);
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

  public static async AssignQueuedVisitor(agentSession: AgentSessionSchema, sid: string): Promise<any | undefined> {
    console.log('AssignQueuedVisitor');
    try {
      if (this.db && this.collection) {
        let updatedVisitorSession = await this.collection.findOneAndUpdate(
          {
            _id: new ObjectId(sid),
            nsp: agentSession.nsp,
            state: 2,
            type: 'Visitors',
          },
          {
            $set: {
              agent: {
                id: ((agentSession._id || agentSession.id) as any).toString(),
                name: agentSession.nickname,
                image: (agentSession.image) ? agentSession.image : ''
              },
              state: 3,
              previousState: '2'
            }
          },
          { returnOriginal: false, upsert: false }
        );
        if (updatedVisitorSession && updatedVisitorSession.value) {
          let updatedAgent = await this.collection.findOneAndUpdate(
            {
              _id: new ObjectId(agentSession.id)
            },
            {
              $set: {
                [`rooms.${(updatedVisitorSession.value.id as any).toString()}`]: (updatedVisitorSession.value.id || updatedVisitorSession.value._id as any).toString()
              },
              $inc: {
                chatCount: 1, visitorCount: 1
              }
            },
            { returnOriginal: false, upsert: false }
          )
          if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
            // let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
            // let count = 0;

            // if (convos && convos.length) {
            //     console.log(convos.length);
            //     count = convos.length
            //     await SessionManager.SetAgentChatCount(updatedAgent.value, count)
            // }
            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          }
          return undefined;
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

  public static async AssignAgentByEmail(Visitorsession: VisitorSessionSchema, email: string, conversationID: ObjectID, state?: number, ruleSetSearch = {}): Promise<any | undefined> {
    console.log('Assigning Agent By Email');
    try {
      if (this.db && this.collection) {

        let search: any = {
          $or: []
        };
        let $and: any = {
          $and: []
        };
        search.$or.push(JSON.parse(JSON.stringify($and)));


        let actualRule = {
          nsp: Visitorsession.nsp,
          email: email,
          ['permissions.chats.canChat']: true,
          acceptingChats: true
        }

        search.$or[0]['$and'][0] = actualRule

        if (ruleSetSearch) {
          search.$or.push(JSON.parse(JSON.stringify($and)));
          search.$or[1]['$and'][0] = (JSON.parse(JSON.stringify(actualRule)))
          Object.assign(search.$or[1]['$and'][0], ruleSetSearch);
        }


        let updatedAgent = await this.collection.findOneAndUpdate(
          search,
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
          Visitorsession.previousState = (((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()) + '';
          let updatedVisitorSession = await this.collection.findOneAndUpdate(
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
            // let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
            // let count = 0;
            // if (convos && convos.length) {
            //     console.log(convos.length);
            //     count = convos.length
            //     await SessionManager.SetAgentChatCount(updatedAgent.value, count)
            // }
            return {
              agent: updatedAgent.value,
              visitor: updatedVisitorSession.value
            };
          }

          return undefined;
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

  //#region Allocation Priority Agent
  public static async AllocateAgentPriority(session, email, conversationID: ObjectID, state?: number, agentSearch = {}): Promise<any | undefined> {
    //Refactored
    try {
      if (this.db && this.collection) {
        let UpdatedSessions = await SessionManager.AssignAgentByEmail(session, email, conversationID, (state) ? state : undefined, (agentSearch) ? agentSearch : undefined);
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
  //#endregion

  //Best Fit Method





  //#region Contact Operations
  public static async GetSessionByEmailFromDatabase(email, nsp): Promise<AgentSessionSchema | undefined> {
    try {
      let visitor: any = [];
      if (this.db && this.collection) {
        visitor = await this.collection.find(
          {
            email: email,
            nsp: nsp,
            type: 'Agents'
          }).limit(1).toArray();
      }
      if (visitor.length) return visitor[0];
      else return undefined
    } catch (err) {
      console.log(err);

    }
  }
  public static async GetSessionByEmailsFromDatabase(emails, nsp): Promise<AgentSessionSchema[] | undefined> {
    try {
      let users: any = [];
      if (this.db && this.collection) {
        users = await this.collection.find(
          {
            email: { $in: emails },
            nsp: nsp,
            type: 'Agents'
          }).toArray();
      }
      if (users.length) return users;
      else return undefined
    } catch (err) {
      console.log(err);

    }
  }

  public static async GetAllSessionByEmailFromDatabase(email, nsp): Promise<VisitorSessionSchema[] | undefined> {
    try {
      let visitors: any = [];
      if (this.db && this.collection) {
        visitors = await this.collection.find(
          {
            email: email,
            nsp: nsp
          }).toArray();
      }
      if (visitors.length) return visitors;
      else return undefined
    } catch (err) {
      console.log(err);

    }
  }

  public static async GetIDsOfBotAuthorizedAgents(nsp): Promise<any | undefined> {
    try {
      let agents: any = [];
      if (this.db && this.collection) {
        agents = await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents',
            ['permissions.agents.canAccessBotChats']: true,
          }, {
          fields: {
            _id: 1
          }
        }
        ).toArray();


      }
      if (agents.length) {
        let arr = agents.reduce((obj, item) => {
          obj[item._id] = item
          return obj
        }, {})
        return Object.keys(arr);
      }
      else return undefined
    } catch (err) {
      console.log(err);

    }
  }
  //#endregion







  public static async getVisitorByLocation(nsp, location, sessionID): Promise<VisitorSessionSchema | undefined> {
    try {
      let visitor: any = [];
      if (this.db && this.collection) {
        visitor = await this.collection.find({
          nsp: nsp,
          location: location,
          _id: new ObjectID(sessionID)
        }).limit(1).toArray();
      }
      if (visitor.length) return visitor[0];
      else undefined
    } catch (error) {
      console.log('Error in Get Visitors By Location');
      console.log(error);
    }
  }





  //#endregion

  //#region
  public static async getOnlineWatchers(nsp, data): Promise<any | undefined> {
    try {

      if (this.db && this.collection) {
        return await this.collection.find(
          {
            nsp: nsp,
            type: 'Agents',
            email: {
              $in: data
            }
          },
        ).toArray();
      } else {
        return undefined;
      }

    } catch (error) {
      console.log(error);
      console.log('Error in Getting online watchers');
      return undefined;
    }
  }
  //#endregion
}