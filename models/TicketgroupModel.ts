import { Db, Collection, ObjectId } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class TicketGroupsModel {
  static db: Db;
  static collection: Collection;
  static collectionRuleSet: Collection;

  static initialized = false;

  public static async Initialize(): Promise<boolean> {
    try {
      this.db = await TicketsDB.connect();
      this.collection = await this.db.createCollection('ticketgroups');
      this.collectionRuleSet = await this.db.createCollection('ruleSets');
      TicketGroupsModel.initialized = true;
      return TicketGroupsModel.initialized;
    } catch (error) {
      console.log('error in Initializing Groups Model');
      throw new Error(error);
    }
  }

  public static async InsertGroup(group: any, nsp) {
    try {

      group.nsp = nsp;
      let groupDatabase = await this.collection.findOne({ nsp: nsp, group_name: group.group_name });
      if (!groupDatabase) {
        return await this.collection.insertOne(group);
      } else {
        return undefined;
      }

    } catch (error) {
      console.log('Error in Inserting Tag');
      console.log(error);
    }
  }

  public static async getRulesetsCount(nsp) {
    try {
      return await this.collectionRuleSet.aggregate([
        { "$match": { "nsp": nsp } },
        { "$group": { "_id": null, "count": { $sum: 1 } } },
      ]).toArray();
    } catch (err) {
      console.log(err);
      console.log('Error in get groups by name');

    }
  }


  public static async toggleActivation(nsp, flag, id, by: string) {
    try {
      let temp = new ObjectId(id);
      return await this.collectionRuleSet.findOneAndUpdate(
        { nsp: nsp, _id: temp },
        { $set: { isActive: flag, lastmodified: { date: new Date().toISOString(), by: by } } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
    }
  }


  public static async addRuleSet(rule) {
    try {
      return await this.collectionRuleSet.insertOne(JSON.parse(JSON.stringify(rule)));
    } catch (error) {
      console.log(error);
      console.log('error in Adding Ruleset')
    }
  }

  public static async updateRulset(nsp, id, ruleset) {
    try {
      delete ruleset._id
      let temp = new ObjectId(id);
      return await this.collectionRuleSet.findOneAndUpdate(
        { nsp: nsp, _id: temp },
        { $set: ruleset },
        { returnOriginal: false, upsert: false });
      // await this.collectionRuleSet.find({rulename:rulename, nsp:nsp}).limit(1).toArray();
      // await this.collectionRuleSet.updateOne(JSON.parse(JSON.stringify(rule)));
      // return await this.collectionRuleSet.find({rulename:rulename}).limit(1).toArray();
    } catch (error) {
      console.log(error);
    }
  }
  //
  public static async SaveAdmins(nsp, group_name, adminList) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { 'group_admins': adminList } }, { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log(err);
    }
  }
  public static async PushAdmin(nsp, group_name, email) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $push: { 'group_admins': email } }, { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log(err);
    }
  }

  public static async IncrementCountOfAgent(nsp, group, bestAgent) {
    try {
      return await this.db.collection('ticketgroups').findOneAndUpdate(
        { nsp: nsp, group_name: group, "agent_list.email": bestAgent },
        { $inc: { [`agent_list.$.count`]: 1 } }
      )
    } catch (err) {
      console.log(err);
    }
  }
  public static async RemoveAdmin(nsp, group_name, email) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $pull: { 'group_admins': email } }, { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log(err);
    }
  }
  public static async toggleAdmin(nsp, group_name, email, value) {
    try {
      let group = await this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray();
      if (group && group.length) {
        group[0].agent_list.filter(a => a.email == email)[0].isAdmin = value;
        this.collection.save(group[0]);
      }
      return (group && group.length) ? group[0] : undefined;
    } catch (err) {
      console.log(err);
    }
  }
  public static async toggleExclude(nsp, group_name, email, value) {
    try {
      let group = await this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray();
      if (group && group.length) {
        group[0].agent_list.filter(a => a.email == email)[0].excluded = value;
        this.collection.save(group[0]);
      }
      return (group && group.length) ? group[0] : undefined;
    } catch (err) {
      console.log(err);
    }
  }

  // rule

  public static async deleteRuleset(nsp) {
    try {
      // console.log("id",rule._id);
      // console.log("name",rule.rulename);

      // return await this.collectionRuleSet.findOneAndUpdate({ nsp:nsp, rulename:rule.rulename, _id: new ObjectId(rule._id) }, { $pull: { _id: new ObjectId(rule._id) } }, { returnOriginal: false, upsert: false });
      // , 'ruleset.conditions':rule
      // console.log("nsp", nsp);

      return await this.collectionRuleSet.deleteOne({ nsp: nsp });

    } catch (error) {
      console.log(error);
    }
  }

  public static async getGroupsbyAdmin(nsp, email) {
    try {
      let groupNames: any = [];
      let groupsFromDb = await this.collection.find({ nsp: nsp }).toArray();
      groupsFromDb.forEach(g => {
        if (g.agent_list.filter(a => a.email == email && a.isAdmin).length) {
          groupNames.push(g.group_name);
        }
      });
      return groupNames;
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Group admins')
      return [];
    }
  }

  public static async getExcludeGroups(nsp) {
    try {
      let groupNames: any = [];
      let groupsFromDb = await this.collection.find({ nsp: nsp }).toArray();
      groupsFromDb.forEach(g => {
        if (g.generalSettings && g.generalSettings.excludeGroup) {
          groupNames.push(g.group_name);
        }
      });
      return groupNames;
    } catch (error) {
      console.log(error);
      console.log('Error in Getting Group admins')
      return [];
    }
  }

  public static async getAgentsAgainstGroup(nsp, groupNames): Promise<Array<any>> {
    try {
      // console.log(nsp);
      // console.log(groupNames);
      let agents: any = [];
      groupNames = Array.isArray(groupNames) ? groupNames : [groupNames];
      let groupFromDb = await this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray();
      if (groupFromDb) {
        let groups = groupFromDb.filter(g => groupNames.includes(g.group_name)).map(g => g.agent_list);
        // console.log(groups);

        groups.map(g => {
          g.map(agent => {
            if (!agents.filter(a => a == agent.email).length) {
              agents.push({ email: agent.email });
            }
          });
        });
      }
      // console.log(agents);

      return agents;

    } catch (error) {
      console.log(error);
      console.log('Error in getting agents against groups');
      return [];
    }
  }
  public static async getAgentsAgainstGroupNotExcluded(nsp, groupNames): Promise<Array<any>> {
    try {
      // console.log(nsp);
      // console.log(groupNames);
      let agents: any = [];
      groupNames = Array.isArray(groupNames) ? groupNames : [groupNames];
      let groupFromDb = await this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray();
      if (groupFromDb) {
        let groups = groupFromDb.filter(g => groupNames.includes(g.group_name)).map(g => g.agent_list);
        // console.log(groups);

        groups.map(g => {
          g.map(agent => {
            if (!agent.excluded) {
              if (!agents.filter(a => a == agent.email).length) {
                agents.push({ email: agent.email });
              }
            }
          });
        });
      }
      // console.log(agents);

      return agents;

    } catch (error) {
      console.log(error);
      console.log('Error in getting agents against groups');
      return [];
    }
  }
  public static async getAgentsAgainstGroupObj(nsp, groupNames) {
    try {
      let agents: any = [];
      let groupFromDb = await this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray();
      if (groupFromDb) {
        let groups = groupFromDb.filter(g => groupNames.includes(g.group_name)).map(g => g.agent_list);
        // console.log(groups);

        groups.map(g => {
          g.map(agent => {
            if (!agents.filter(a => a == agent.email).length) {
              agents.push({ email: agent.email });
            }
          });
        });
      }
      // console.log(agents);

      return agents;

    } catch (error) {
      console.log(error);
      console.log('Error in getting agents against groups');

    }
  }

  public static async getAllAgentsAgainstAdmin(nsp, email) {
    let agents: any = [];
    let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
    agents = await TicketGroupsModel.getAgentsAgainstGroup(nsp, groups);
    return agents;
  }

  public static async GetRulesetByNSP(nsp) {
    try {
      let ruleFromDb = await this.collectionRuleSet.find({ nsp: nsp }).toArray();
      return ruleFromDb;
    } catch (error) {
      console.log(error);
      console.log('Error in Getting RuleSets')
      return [];
    }
  }

  public static async getGroupByName(nsp, name) {
    try {
      return this.collection.find({ nsp: nsp, group_name: name }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in Getting group by name')
      return [];
    }
  }



  public static async deleteRule(nsp, id: ObjectId) {
    try {
      let temp = new ObjectId(id);
      return await this.collectionRuleSet.deleteOne({ nsp: nsp, _id: temp });
    } catch (error) {
      console.log(error);
      console.log('error in deleting Rule');

    }
  }

  public static async GetGroupDetailsByNSP(nsp) {
    try {
      let groupFromDb = await this.collection.find({ nsp: nsp }).toArray();
      return groupFromDb;
    } catch (error) {
      console.log(error);
    }
  }
  public static async GetGroupsCount(nsp) {
    try {
      return await this.collection.aggregate([
        { "$match": { "nsp": nsp } },
        { "$group": { "_id": null, "count": { $sum: 1 } } },
      ]).toArray();
    } catch (error) {
      console.log(error);
    }
  }
  public static async GetGroupAdmins(nsp, group_name) {
    try {
      let admins: Array<string> = [];
      let groupFromDb = await this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray();
      if (groupFromDb && groupFromDb.length && groupFromDb[0].agent_list) {
        admins = groupFromDb[0].agent_list.filter(a => a.isAdmin).map(a => a.email);
      }
      return admins;
    } catch (error) {
      console.log(error);
      return undefined
    }
  }
  public static async getAgentAssignedCount(email, state) {
    try {
      let count = await this.db.collection('tickets').find({ assigned_to: email, state: state }).toArray();
      return count;
    } catch (error) {
      console.log(error);
    }
  }

  public static async deleteGroup(group_name, nsp) {
    try {
      await this.collection.deleteOne({ nsp: nsp, group_name: group_name });
      return await this.collection.find({ nsp: nsp }).toArray();

    } catch (error) {
      console.log('Error in Deleting groups');
      console.log(error);
    }
  }

  public static async SetAutoAssign(nsp, group_name, auto_assign) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { auto_assign: auto_assign } }, { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log(err);
    }
  }
  // public static async setICONNGroupAuto(nsp, group_name, ICONNAuto) {
  //     try {
  //         return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { ['generalSettings.enabled']: ICONNAuto } }, { returnOriginal: false, upsert: false });
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }

  public static async importSaveSettings(nsp, group_name, time, limit, fallbackLimitExceed, fallbackNoShift, unavailHrs, flag?) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { ['generalSettings.unEntertainedTime']: time, ['generalSettings.enabled']: flag, ['generalSettings.assignmentLimit']: limit, ['generalSettings.fallbackNoShift']: fallbackNoShift && fallbackNoShift.length ? fallbackNoShift : '', ['generalSettings.fallbackLimitExceed']: fallbackLimitExceed && fallbackLimitExceed.length ? fallbackLimitExceed : '', ['generalSettings.unAvailibilityHours']: unavailHrs } }, { returnOriginal: false, upsert: false });

    } catch (err) {
      console.log(err);
    }
  }

  public static async saveGeneralSettings(nsp, group_name, settings) {
    try {
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { generalSettings: settings } }, { returnOriginal: false, upsert: false });

    } catch (err) {
      console.log(err);
    }
  }


  public static async getGeneralSettings(nsp, group_name) {
    try {
      let result = await this.collection.find({ nsp: nsp, group_name: group_name }).project({ generalSettings: 1 }).limit(1).toArray();
      if (result && result.length) return result[0].generalSettings;
    } catch (err) {
      console.log(err);
    }
  }
  public static async GetAutoAssign(nsp, group_name) {
    try {
      return await this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray();
    } catch (err) {
      console.log(err);
    }
  }

  public static async AssignAgent(agent_email: any, group_name: string, nsp, agent_list: any) {
    try {

      // let agent_list: AgentListInfo = {
      //     email: agent_email,
      //     count: 0
      // }
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $push: { 'agent_list': agent_list } }, { returnOriginal: false, upsert: false });
      // return await this.collection.findOneAndUpdate({ nsp: nsp, groups: { $elemMatch: { group_name: group_name } } }, { $push: { 'groups.$.agent_list': agent_list } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in Assign Agent');
      console.log(error);
    }
  }

  public static async UnAssignAgent(agent_email: any, group_name: string, nsp) {
    try {
      // let agent_list: AgentListInfo = {
      //     email: agent_email,
      //     count: 0
      // }
      return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $pull: { 'agent_list': { email: agent_email } } }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log('Error in UnAssign Agent');
      console.log(error);
    }
  }

  public static async GetGroupsAgainstAgent(nsp, agent_email) {
    try {
      let groups: any = [];
      let groupsFromArr = await this.collection.find({ nsp: nsp, 'agent_list.email': agent_email }).toArray();
      groups = groupsFromArr.map(a => a.group_name);
      return groups;
    } catch (err) {
      console.log('Error in getting groups agianst agent');

      console.log(err);

    }
  }

}