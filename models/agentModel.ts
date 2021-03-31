
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { Db, Collection, InsertOneWriteOpResult } from "mongodb";
import { AgentSchema } from '../schemas/agentSchema';
import * as _ from "lodash";
import { AgentSessionSchema } from "../schemas/agentSessionSchema";
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
import { AgentsDB } from "../globals/config/databses/AgentsDB";
import { TicketGroupsModel } from "./TicketgroupModel";
import { SessionManager } from "../globals/server/sessionsManager";

export class Agents {


  static db: Db;
  static collection: Collection;
  static codesCollection: Collection;
  static initialized = false;

  // Current Visitor Array
  private static AgentsList: any = {};

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await AgentsDB.connect();
      this.collection = await this.db.createCollection('agents');
      this.codesCollection = await this.db.createCollection('agentcodes')
      console.log(this.collection.collectionName);
      Agents.initialized = true;
      return Agents.initialized;
    } catch (error) {
      console.log('error in Initializing Agent Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections


  }





  // -------------------------------x---------------------------------------------------x ||
  //                              Functions operatiing on Databases
  //--------------------------------x---------------------------------------------------x ||

  public static getAgentsByID(): number {
    return 0;
  }
  public static async getAgentsByEmail(email: string) {
    try {
      return await this.collection
        .find({ email: email })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public static async getAgentByShiftTime(email, nsp) {
    try {
      let result = await this.collection
        .find({ nsp: nsp, email: email }).project({ ShiftTime: 1 })
        .limit(1)
        .toArray();
      if (result && result.length) return result[0].ShiftTime;
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public static async getAgentsByUsername(nsp, username) {
    try {
      if (username) {
        return await this.collection
          .find({ nsp: nsp, username: username })
          .limit(1)
          .toArray();
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public static async UpdateWindowNotificationSettings(nsp, email, settings) {
    try {
      return this.collection.findOneAndUpdate(
        { nsp: nsp, email: email },
        {
          $set: {
            ["settings.windowNotifications"]: settings
          }
        }, { returnOriginal: false, upsert: false }
      );
    } catch (error) {
      console.log(error);
      throw new Error("Can't update window notifs");
    }
  }
  public static async UpdateEmailNotificationSettings(nsp: string, email: string, settings) {
    return this.collection.findOneAndUpdate(
      { nsp: nsp, email: email },
      {
        $set: {
          ["settings.emailNotifications"]: settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static async saveAgentTicketFilters(nsp: string, email: string, filters, applyInner = false) {
    return this.collection.findOneAndUpdate(
      { nsp: nsp, email: email },
      {
        $set: {
          ["settings.ticketFilters"]: filters,
          ["settings.applyFilteronInnerView"]: applyInner,
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static async GetWindowNotificationSettings(nsp: string, email: string) {
    try {
      return this.collection.find(
        { nsp: nsp, email: email },
        {
          fields: {
            _id: 0,
            'settings.windowNotifications': 1
          }
        })
        .limit(1).toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't get window notifs");
    }
  }
  public static async GetEmailNotificationSettings(nsp: string, email: string) {
    try {
      return this.collection.find(
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
  public static async getFilteredAgents(nsp, filters, chunk = "0") {
    try {
      let dataToSend: any = [];
      if (filters) {
        let groups: any = [];
        let agents: any = [];
        let status = 'all';
        // console.log(filters);
        Object.keys(filters).map(key => {
          if (key == 'groups') groups = filters[key];
          if (key == 'agents') agents = filters[key];
          if (key == 'status') status = filters[key];
        });
        if (groups.length) {
          let groupAgents = await TicketGroupsModel.getAgentsAgainstGroup(nsp, groups);
          agents = groupAgents.map(a => a.email);
        }
        // console.log(agents);

        switch (status) {
          case 'all':
            if (agents.length) {
              dataToSend = await this.getAgentsByEmails(nsp, agents);
            } else {
              dataToSend = await this.getAllAgents(nsp);
            }
            let AgentSessions = await SessionManager.GetAllAgentsByNSP(nsp);
            let AgentsMap: any = {};
            if (AgentSessions) {
              AgentSessions.map(agent => {
                AgentsMap[agent.email] = agent;
              });
              if (dataToSend) {
                dataToSend = dataToSend.map(agent => {
                  if (AgentsMap[agent.email]) {
                    agent.liveSession = {};
                    agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
                    agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
                    agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                    agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
                    agent.callingState = AgentsMap[agent.email].callingState;
                  }
                  agent.details = true;
                  return agent
                });
              }
            }
            break;
          case 'online':
            if (agents.length) {
              dataToSend = await SessionManager.getAllLiveAgentsByEmails(nsp, agents);
            } else {
              dataToSend = await SessionManager.GetAllAgentsByNSP(nsp);
            }
            break;
          case 'offline':
            // let offlineAgents : any = [];
            if (agents.length) {
              dataToSend = await this.getAgentsByEmails(nsp, agents);
              AgentSessions = await SessionManager.GetAllAgentsByNSP(nsp);
              if (AgentSessions && AgentSessions.length) {
                AgentSessions.forEach(agent => {
                  let index = dataToSend.findIndex(a => a.email == agent.email);
                  if (index != -1) {
                    dataToSend.splice(index, 1);
                  }
                })
              }
            } else {
              AgentSessions = await SessionManager.GetAllAgentsByNSP(nsp);
              if (AgentSessions && AgentSessions.length) {
                let AgentsMap: any = {};
                AgentSessions.map(agent => {
                  AgentsMap[agent.email] = agent;
                });
                dataToSend = await Agents.getAgentsNotInEmails(AgentSessions.map(a => a.email), nsp);
              } else {
                dataToSend = await Agents.getAllAgentsAsync(nsp);
              }
            }
            break;
          case 'idle':
            let liveAgents: any = [];
            if (agents.length) {
              liveAgents = await SessionManager.getAllLiveAgentsByEmails(nsp, agents);
              if (liveAgents && liveAgents.length) {
                dataToSend = liveAgents.filter(a => !a.acceptingChats);
              }
            } else {
              liveAgents = await SessionManager.GetAllAgentsByNSP(nsp);
              // console.log(liveAgents);

              if (liveAgents && liveAgents.length) {
                dataToSend = liveAgents.filter(a => !a.acceptingChats);
              }
            }
            break;
          case 'active':
            if (agents.length) {
              liveAgents = await SessionManager.getAllLiveAgentsByEmails(nsp, agents);
              if (liveAgents && liveAgents.length) {
                dataToSend = liveAgents.filter(a => a.acceptingChats);
              }
            } else {
              liveAgents = await SessionManager.GetAllAgentsByNSP(nsp);
              if (liveAgents && liveAgents.length) {
                dataToSend = liveAgents.filter(a => a.acceptingChats);
              }
            }
            break;
        }
      } else {
        // let agents : any = [];
        dataToSend = await this.getAllAgents(nsp);
        let AgentSessions = await SessionManager.GetAllAgentsByNSP(nsp);
        let AgentsMap: any = {};
        if (AgentSessions) {
          AgentSessions.map(agent => {
            AgentsMap[agent.email] = agent;
          });
          if (dataToSend) {
            dataToSend = dataToSend.map(agent => {
              if (AgentsMap[agent.email]) {
                agent.liveSession = {};
                agent.liveSession.acceptingChats = AgentsMap[agent.email].acceptingChats;
                agent.liveSession.createdDate = AgentsMap[agent.email].createdDate;
                agent.liveSession.state = (AgentsMap[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                agent.liveSession.idlePeriod = AgentsMap[agent.email].idlePeriod;
                agent.callingState = AgentsMap[agent.email].callingState;
              }
              agent.details = true;
              return agent
            });
          }
        }
      }
      return dataToSend;
    } catch (error) {
      console.log(error);
    }
  }

  public static async getAgentsByEmails(nsp, emails: Array<string>) {
    try {
      return await this.collection
        .find({ email: { $in: emails }, nsp: nsp })
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }
  public static async getAgentsNotInEmails(emails: Array<string>, nsp) {
    try {
      return await this.collection
        .find({ email: { $nin: emails }, nsp: nsp })
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }
  public static async getAgentByEmail(nsp: string, email: string) {
    try {
      return await this.collection
        .find({ nsp: nsp, email: email })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Beelinks");
    }
  }
  public static async insertAgent(params: any): Promise<InsertOneWriteOpResult<any>> {
    try {
      let agent: AgentSchema = {
        "username": params.username,
        "email": params.email,
        "date": Date.now(),
        "time": new Date().getTime(),
        "location": params.location,
        "count": 1,
        "ipAddress": params.ipAddress
      }
      return await this.collection.insertOne(JSON.parse(JSON.stringify(agent)));
    } catch (error) {
      console.log(error);
      throw new Error("Can't Insert Visitor");
    }

  }
  public static async AgentExists(userEmail: string): Promise<boolean> {
    // //console.log(this.collection);
    try {
      return !!(await this.collection
        .find({ email: userEmail })
        .limit(1)
        .toArray()).length;
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }

  }

  public static InserAutomatedMessage(hashTag, responseText, agentEmail) {
    try {
      return this.collection.findOneAndUpdate({ email: agentEmail }, {
        $push: {
          automatedMessages: { hashTag: hashTag, responseText: responseText }
        }
      }, { returnOriginal: false, upsert: true });
    } catch (error) {
      console.log(error);
      console.log('error in Insert Automated Message');
    }
  }
  public static updateLastLogin(nsp, email, date) {
    try {
      return this.collection.findOneAndUpdate({ email: email, nsp: nsp }, {
        $set: {
          lastLogin: date
        }
      }, { returnOriginal: false, upsert: true });
    } catch (error) {
      console.log(error);
      console.log('error in Insert Automated Message');
    }
  }

  public static async DeleteAutomatedMessage(hashTag, agentEmail) {
    //console.log('Deleteing ');
    try {
      this.collection.findOneAndUpdate({ email: agentEmail }, {
        $pull: {
          automatedMessages: {
            hashTag: hashTag
          }
        }
      });
    } catch (error) {
      console.log(error);
      console.log('error in Delete Automated Messages');
    }

  }

  public static async ChangePassword(password, email) {
    // console.log(password);
    // console.log(email);
    try {
      return this.collection.findOneAndUpdate({ email: email }, {
        $set: {
          password: password
        }
      }, { returnOriginal: false, upsert: false })
    } catch (error) {
      console.log(error);
      console.log('error in Change Password');
    }
  }

  public static async EditAutomatedMessage(hashTag, responseText, agentEmail) {
    try {
      this.collection.findOneAndUpdate({ email: agentEmail, "automatedMessages.hashTag": hashTag }, {
        $set: {
          "automatedMessages.$.responseText": responseText
        }
      });
    } catch (error) {
      console.log(error);
      console.log('error in Delete Automated Messages');
    }

  }

  public static async AuthenticateUser(email: string, password: string) {
    try {

      return (await this.collection
        .find(
          {
            $and: [
              { email: email.toLowerCase() },
              { password: password }
            ]
          },
          {
            fields: {
              cannedMessages: 0,
              automatedMessages: 0,
              editsettings: 0,
              communicationAccess: 0,
              password: 0
            }
          })
        .limit(1)
        .toArray());
    } catch (error) {
      console.log('Error in Authenticate User');
      console.log(error);
    }
  }

  public static async ValidateCode(code) {
    try {
      let result = await this.codesCollection.find({ code: code }).limit(1).toArray();
      if (result && result.length) return result[0];
      else return undefined;
    } catch (error) {
      console.log(error);
      console.log('error in Validating Code');
    }
  }
  public static async getAccessCode(email) {
    try {
      let result = await this.codesCollection.find({ email: email }, { sort: { _id: -1 } }).limit(1).toArray();
      if (result && result.length) return result[0].code;
      else return '';
    } catch (error) {
      console.log(error);
      console.log('error in Validating Code');
      return '';
    }
  }

  public static async InsertCode(code, email) {
    try {
      let result = await this.codesCollection.insertOne({ code: code, email: email, expireAt: new Date() });
      if (result && result.insertedCount) return result;
      else return undefined;
    } catch (error) {
      console.log(error);
      console.log('error in Validating Code');
    }
  }


  public static getAllAgents(nsp: string) {
    try {
      return this.collection.find({ nsp: nsp },
        {
          fields:
          {
            cannedMessages: 0,
            automatedMessages: 0,
            editsettings: 0,
            password: 0
          }
        }
      ).toArray();

    } catch (error) {
      console.log(error);
      console.log('Error in Get All Agents');
    }
  }

  public static getAllDBAgents() {
    try {
      return this.collection.find({}).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in Get All Agents');
      return [];
    }
  }

  public static async getAllAgentsAsync(nsp, chunk: string = '0') {
    //console.log(chunk);
    try {
      if (chunk == "0") {

        return await this.collection.aggregate([
          { "$match": { "nsp": nsp } },
          { "$sort": { "first_name": 1 } },
          { "$limit": 20 }
        ]).toArray();
      } else {
        return await this.collection.aggregate([
          { "$match": { "nsp": nsp } },
          { "$sort": { "first_name": 1 } },
          { "$match": { 'first_name': { "$gt": chunk } } },
          { "$limit": 20 }
        ]).toArray();
      }

    } catch (error) {
      console.log(error);
      console.log('error in getting Archives from Model');
    }
  }



  public static async searchAgents(nsp, keyword, chunk = '0') {
    // console.log('Searching Contact!');
    // console.log(nsp);
    // console.log(keyword);
    try {
      if (chunk == '0') {
        return await this.collection.find({
          nsp: nsp,
          '$or': [
            { first_name: new RegExp(keyword) },
            { email: new RegExp(keyword) }
          ]

        }).sort({ first_name: 1 }).limit(20).toArray();
      } else {
        return await this.collection.aggregate([
          {
            "$match": {
              "nsp": nsp,
              '$or': [
                { first_name: new RegExp(keyword) },
                { email: new RegExp(keyword) }
              ]
            }
          },
          { "$sort": { first_name: 1 } },
          { "$match": { "first_name": { "$gt": chunk } } },
          { "$limit": 20 }
        ]).toArray();
      }
    } catch (err) {
      console.log('Error in Search Agents');
      console.log(err);
      return [];
    }
  }

  public static getAgentsInfo(agent: any) {
    try {
      return this.collection.find({ nsp: agent.nsp, email: agent.email }).toArray();

    } catch (error) {
      console.log(error);
      console.log('Error in Get All Agents');
    }
  }

  public static async RegisterAgent(agent) {
    try {
      agent.email = agent.email.toLowerCase();
      await this.collection.insertOne(agent);
      return await this.collection.find({ email: agent.email }).limit(1).toArray();

    } catch (error) {
      console.log('Error in Register Agent');
      console.log(error);
    }
  }
  public static async DeActivateAgent(email, nsp) {
    try {
      // email += ' - deactivated';
      // nsp += ' - deactivated';
      return await this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { email: email += ' - deactivated', nsp: nsp += ' - deactivated' } });
    } catch (error) {
      console.log('Error in Register Agent');
      console.log(error);
    }
  }
  public static async GetAgentsCount(nsp) {
    try {
      return await this.collection.aggregate([
        { "$match": { "nsp": nsp } },
        { "$group": { "_id": null, "count": { $sum: 1 } } }
      ]).toArray();

    } catch (error) {
      console.log('Error in Getting Agents Count');
      console.log(error);
    }
  }

  public static EditAgentProperTies(properties, email) {
    try {
      return this.collection.findOneAndUpdate(
        { email: email },
        {
          $set:
          {
            first_name: properties.first_name,
            last_name: properties.last_name,
            nickname: properties.nickname,
            phone_no: properties.phone_no,
            username: properties.username,
            gender: properties.gender,
            'settings.simchats': properties.simchats,
            role: properties.role
          }
        }, { returnOriginal: false, upsert: false },

      );
    } catch (error) {
      console.log(error);
      console.log('error in Editing Agent Properties in AgentModel');
    }
  }

  static EditProfilePic(email: string, url: string) {
    try {
      return this.collection.findOneAndUpdate(
        { email: email },
        {
          $set:
          {
            image: url
          }
        }, { returnOriginal: false, upsert: false },

      );

    } catch (error) {
      console.log('error in Updating Profile Image in Model');
      console.log(error);
    }
  }


  public static getSetting(agentEmail) {
    try {
      return this.collection.find(
        {
          email: agentEmail
        },
        {
          fields: {
            _id: 0,
            applicationSettings: 1,
            automatedMessages: 1,
            editsettings: 1,
            communicationAccess: 1,
            settings: 1,
          }
        })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log('Error in Get Settings');
      console.log(error);
    }
  }

  public static AddGroup(agentEmail, groupName) {
    try {
      return this.collection.findOneAndUpdate(
        {
          email: agentEmail,
          group: { $nin: [groupName] }
        },
        {
          $addToSet: { group: groupName }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in Adding Group To Agent');
      console.log(error);
    }
  }

  public static async GetAgentByEmail(agentEmail) {
    try {
      return await this.collection.find(
        {
          email: agentEmail
        }).toArray();
    } catch (error) {
      console.log('Error in Getting Agent By Email');
      console.log(error);
    }
  }

  public static async GetAllAgentsForRole(nsp, role) {
    try {
      return this.collection.find({ nsp: nsp, role: role }).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in getting agents according to role.');

    }
  }

  public static async saveRoleForAgents(nsp, users, selectedRole, role) {
    try {
      await this.collection.updateMany({ nsp: nsp, email: { $in: users } }, { $set: { role: role } });
      return this.collection.find({ nsp: nsp, role: selectedRole }).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in getting agents according to role.');

    }
  }
  public static async updateAgentTimings(nsp, email, shiftStart, duration, showTime) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, email: email }, { $set: { ['ShiftTime.ShiftStart']: shiftStart, ['ShiftTime.Duration']: duration, ['ShiftTime.showShiftStart']: showTime } }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log(error);
      console.log('Error in shift update');

    }
  }
  public static async assignNewRolesForAgents(nsp, users) {
    try {
      let agents = await this.collection.find({}).toArray();
      agents.forEach(agent => {
        let user = users.filter(u => u.email == agent.email);
        if (user.length) {
          agent.role = user[0].role;
        }
        this.collection.save(agent);
      });
      return this.collection.find({ nsp: nsp }).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in getting agents according to role.');

    }
  }


  public static RemoveGroup(agentEmail, groupName) {
    try {
      return this.collection.findOneAndUpdate(
        {
          email: agentEmail,
          group: { $in: [groupName] }
        },
        {
          $pull: { group: groupName }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in Adding Group To Agent');
      console.log(error);
    }
  }




  //-------------------------------x-------------------------------------------------------x ||
  //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
  //--------------------------------x------------------------------------------------------- ||
  // public static NotifyAll(session, location): string {
  //     return 'Agents' + location;
  // }

  public static NotifyAll(): string {
    return 'Agents';
  }

  public static NotifyAllVisitorLocation(session: VisitorSessionSchema): string {
    return 'Agents' + session.location;
  }

  public static NotifyAllocations(session: AgentSessionSchema): Array<string> {
    let rooms: Array<string> = [];
    session.location.map(location => {
      rooms.push('Agents' + location);
    });
    return rooms;
  }

  public static async UpdateAgentTicketCount(agent_email: string, ticket_tag: string, nsp: string) {
    try {
      console.log("inside agent count udpate");
      let count = await this.collection.findOne({ nsp: nsp, email: agent_email, agent_ticketcount: { $elemMatch: { tag: ticket_tag } } });
      //console.log(count);
      if (!count) {
        //console.log("Insert Agent Ticket Count");
        //console.log(agent_email + " - " + ticket_tag + " - " + nsp);
        return this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email }, { $push: { agent_ticketcount: { tag: ticket_tag, count: 1 } } });
      } else {
        //console.log("Update Agent Ticket Count");
        return this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email, agent_ticketcount: { $elemMatch: { tag: ticket_tag } } }, { $inc: { "agent_ticketcount.$.count": 1 } });
      }
    } catch (error) {
      console.log(error);
    }
  }


  public static async ResetAgentTicketCount(agent_email: string, nsp: string) {
    try {
      //console.log("reset count");
      return this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email }, { $set: { "agent_ticketcount.$.count": 0 } });
    } catch (error) {
      console.log(error);
    }
  }

  public static NotifyOne(session, msgType = 'private'): string {
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

  public static NotifyAllAdmins(): string {
    return 'Admins'
  }




  public static validatePassword(email, password) {
    let agent: any = [];
    agent = this.collection.find({ email: email, password: password }).limit(1).toArray();
    return agent;
  }



  public static async ToogleChatMode(AgentSession: AgentSessionSchema, chatMode: string): Promise<any | undefined> {
    //Refactored
    try {
      if (this.db && this.collection) {
        switch (chatMode) {
          case 'IDLE':
            return await this.collection.findOneAndUpdate(
              {
                nsp: AgentSession.nsp,
                email: AgentSession.email
              },
              {
                $set: { 'applicationSettings.acceptingChatMode': false },
              }, { returnOriginal: false, upsert: false }
            );

          case 'ACTIVE':
            return await this.collection.findOneAndUpdate(
              {
                nsp: AgentSession.nsp,
                email: AgentSession.email
              },
              {
                $set: { 'applicationSettings.acceptingChatMode': true },
              }, { returnOriginal: false, upsert: false }
            );
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

  public static async getAgentAgainstWatchers(nsp, watchers) {
    try {
      return await this.collection.find({ email: { $nin: watchers }, nsp: nsp }).project({ email: 1 }).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in getting agents against watchers');

    }
  }

  public static async getResponseByAgent(nsp: string, email: string) {
    try {
      return await this.collection.find({ nsp: nsp, email: email }).project({ automatedMessages: 1 }).toArray()
    } catch (error) {
      console.log('Error in getting responses by agent');
      console.log(error);
    }
  }



  public static async AuthenticateAdmin(email: string, password: string) {
    try {

      // { nsp: '/admin' },
      // { isAdmin: { $exists: true }}
      return (await this.collection
        .find(
          {
            $and: [
              { email: email.toLowerCase() },
              { password: password }
            ]
          })
        .limit(1)
        .toArray());
    } catch (error) {
      console.log('Error in Authenticating Admin');
      console.log(error);
    }
  }


  public static async DeleteAgentsByCompany(nsp) {
    try {
      return await this.collection.deleteMany({ nsp: nsp });
      // return await this.collection.find({nsp: nsp}).toArray();
    } catch (err) {
      console.log(err);
    }

  }
  public static async SavePermissionsAgent(permissions, email, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { 'settings.permissions': permissions } })
    } catch (err) {
      console.log(err);
    }
  }

}

