
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection, ObjectID } from "mongodb";
import { Agents } from "./agentModel";
import { defaultSettings } from "../globals/config/constants";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";

const { URL } = require('url');

const crypto = require('crypto');


export class Company {


  static db: Db;
  static collection: Collection;
  static collectionAppToken: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await CompaniesDB.connect();
      this.collection = await this.db.createCollection('companies')
      console.log(this.collection.collectionName);
      Company.initialized = true;
      return Company.initialized;
    } catch (error) {
      console.log('error in Initializing Company Model');
      throw new Error(error);
    }

  }


  public static CheckCompany(companyurl): Promise<any[]> {
    try {
      //console.log(companyurl);
      //console.log((new URL(companyurl).hostname));
      return this.collection
        .find({ name: '/' + (new URL(companyurl).hostname) })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Error in Check Company In Exists");
    }
  }

  public static GetTempProfile(id): Promise<any[]> {
    try {
      //console.log(companyurl);
      //console.log((new URL(companyurl).hostname));
      return this.db.collection('tempProfile')
        .find({ _id: new ObjectID(id) })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Error in Check Company In Exists");
    }
  }

  public static generateScript(hash: string): string {
    return `
<script type="text/javascript" async>
    if (window.__bizC == undefined) window.__bizC = {};
    window.__bizC['license'] = '`+ hash + `';  var scr = document.createElement('script');
    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;
    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);
</script>`;
  }

  public static async setAuthToken(email: any, password: any, nsp: any) {
    try {
      let hash = crypto.createHash('sha256').update(new Date().getTime() + email + password + nsp).digest('hex');
      return this.collection.findOneAndUpdate({ email: email, password: password, name: nsp }, { $set: { companyToken: hash } }, { upsert: false, returnOriginal: false })
    } catch (err) {
      console.log(err);
      console.log('Error in setting auth token');

    }
  }
  public static verifylicense(license) {
    return this.collection.find(
      {
        license: license
      }, {
      fields:
      {
        company_info: 1,
        name: 1,
        deactivated: 1,
        package: 1,
        ['settings.callSettings.permissions.v2a']: 1,
        ['settings.widgetMarketingSettings.permissions.news']: 1,
        ['settings.widgetMarketingSettings.permissions.promotions']: 1,
        ['settings.widgetMarketingSettings.permissions.faqs']: 1,
        ['settings.displaySettings']: 1,
        ['settings.customScript']: 1,
        ['settings.chatSettings.permissions']: 1,
        ['settings.ticketSettings.allowedAgentAvailable']: 1,
        ['settings.schemas']: 1,
      }
    })
      .limit(1).toArray();

  }

  public static async GetLogoTranscript(nsp) {
    return await this.collection.find(
      {
        name: nsp
      }, {
      fields:
      {
        ['settings.chatSettings.transcriptLogo']: 1,
      }
    })
      .limit(1).toArray();

  }


  public static GetTags(nsp) {

    try {
      return this.collection.find(
        {
          name: nsp
        }, {
        fields:
        {
          ['settings.chatSettings.tagList']: 1,
          // ['settings.displaySettings']: 1
        }
      })
        .limit(1).toArray();

    } catch (error) {
      console.log(error);
      console.log('Error in Getting Tags in Company Model');
      return undefined;
    }

  }


  public static verifylicenseMobile(license) {
    return this.collection.find(
      {
        license: license
      }, {
      fields:
      {
        company_info: 1,
        name: 1,
        ['settings.chatSettings.permissions']: 1,
        ['settings.displaySettings']: 1,
        // ['settings.chatSettings.allowFileSharing.forVisitors']: 1,
        // ['settings.displaySettings']: 1
      }
    })
      .limit(1).toArray();

  }

  public static getScript(nsp) {
    //console.log(nsp);
    return this.collection.find({ name: nsp }, { fields: { script: 1 } }).toArray();
  }

  public static GetCompanyInfo(nsp) {
    //console.log(nsp);
    return this.collection.find({ name: nsp }, { fields: { script: 1, company_info: 1 } }).toArray();
  }

  public static async GetCompanies() {
    return this.collection.find().toArray();
  }

  public static async GetCompaniesNsp() {
    return this.collection.find({}, {
      fields: {
        _id: 0,
        name: 1,
      }

    }).toArray();
  }

  public static getPackages(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          package: 1
        }
      })
      .limit(1).toArray();
  }

  public static GetSubscription(name: string) {
    return this.db.collection('packages').find({ name: name })
      .limit(1).toArray();
  }

  public static getSettings(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.chatSettings': 1,
          'settings.emailNotifications': 1,
          'settings.iconnSettings': 1

        }
      })
      .limit(1).toArray();
  }


  public static async GetChatSettings(nsp: string) {
    let companySettings = await this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.chatSettings': 1,
        }
      })
      .limit(1).toArray();
    if (companySettings && companySettings.length) return companySettings[0];
    else return undefined;
  }

  public static GetVerificationStatus(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.verified': 1,
          'createdAt': 1,
          'expiry': 1,
          'package': 1,
          'settings.permissions': 1,
          'settings.authentication': 1,
          'settings.windowNotifications': 1,
          'settings.schemas': 1
        }
      })
      .limit(1).toArray();
  }

  public static getWebHooks(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.customScript': 1,
        }
      })
      .limit(1).toArray();
  }

  public static getGroupsAutomationSettings(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.groupsAutomation': 1,
        }
      })
      .limit(1).toArray();
  }


  public static getDisplaySettings(nsp: string) {
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.displaySettings': 1
        }
      })
      .limit(1).toArray();
  }

  public static getAdminSettings(nsp: string) {
    //console.log(nsp);
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.chatSettings': 1,
          'settings.callSettings': 1,
          'settings.contactSettings': 1,
          'settings.widgetMarketingSettings': 1
        }
      })
      .limit(1).toArray();
  }


  public static GetTicketSettings(nsp: string) {
    //console.log(nsp);
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.ticketSettings': 1
        }
      })
      .limit(1).toArray();
  }
  public static GetEmailNotificationSettings(nsp: string) {
    //console.log(nsp);
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.emailNotifications': 1
        }
      })
      .limit(1).toArray();
  }
  public static GetWindowNotificationSettings(nsp: string) {
    //console.log(nsp);
    return this.collection.find(
      { name: nsp },
      {
        fields: {
          _id: 0,
          'settings.windowNotifications': 1
        }
      })
      .limit(1).toArray();
  }


  //#region Update Settings

  public static updateNSPChatSettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.chatSettings." + data.settingsName]: data.settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static updateNSPCallSettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.callSettings"]: data.settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static updateNSPContactSettings(nsp: string, type, settings: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.contactSettings." + type]: settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static async updateNSPPermissions(nsp, userRole, permissions, role, push = false) {
    try {
      permissions.updatedOn = new Date().toISOString();
      if (push) {
        let company = await this.collection.find({ name: nsp }).limit(1).toArray();
        if (company && company.length) {
          company[0].settings.permissions.superadmin.settings.rolesAndPermissions.canView.push(role)
          company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.push(role);
          if (userRole != 'admin' && userRole != 'superadmin') {
            company[0].settings.permissions[userRole].settings.rolesAndPermissions.canView.push(role);
          }
          Object.assign(company[0].settings.authentication, { [role]: { enableSSO: false } });
          await this.collection.save(company[0]);
        }
      }
      return await this.collection.findOneAndUpdate({ name: nsp }, { $set: { ['settings.permissions.' + role]: permissions } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in updating company permissions');
      console.log(err);
    }
  }
  public static async GetRoles(nsp) {
    try {
      let roles: Array<string> = [];
      let company = await this.collection.find({ name: nsp }).limit(1).toArray();
      if (company && company.length) {
        roles = this.getKeys(company[0].settings.permissions);
      }
      return roles;
    } catch (error) {

    }
  }
  public static async deleteNSPPermissions(nsp, permissions, role) {
    try {
      permissions.updatedOn = new Date().toISOString();
      let company = await this.collection.find({ name: nsp }).limit(1).toArray();
      if (company && company.length) {
        Object.keys(company[0].settings.permissions).map(key => {
          company[0].settings.permissions[key].settings.rolesAndPermissions.canView = this.removeRolesFromAllPermissions(company[0].settings.permissions[key].settings.rolesAndPermissions.canView, role);
        });
        delete company[0].settings.authentication[role];
        // let index = company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.indexOf(role)
        // company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.splice(index, 1);
        await this.collection.save(company[0]);
      }
      return await this.collection.findOneAndUpdate({ name: nsp }, { $unset: { ['settings.permissions.' + role]: 1 } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async toggleAuthPermissions(nsp, role, value) {
    try {
      return await this.collection.findOneAndUpdate({ name: nsp }, { $set: { ['settings.authentication.' + role + '.enableSSO']: value } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async addIP(nsp, ip) {
    try {
      return await this.collection.findOneAndUpdate({ name: nsp }, { $push: { 'settings.authentication.allowedIPs': ip } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async setSuppressionList(nsp, emails) {
    try {
      return await this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.authentication.suppressionList': emails } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async removeIP(nsp, ip) {
    try {
      return await this.collection.findOneAndUpdate({ name: nsp }, { $pull: { 'settings.authentication.allowedIPs': ip } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async removeAgentFromSuppressionList(nsp, email) {
    try {
      return await this.collection.findOneAndUpdate({ name: nsp }, { $pull: { 'settings.authentication.suppressionList': email } }, { upsert: false, returnOriginal: false });
    } catch (err) {
      console.log('Error in deleting company permissions');
      console.log(err);
    }
  }
  public static async getNSPPermission(nsp) {
    try {
      return await this.collection.find({ name: nsp }, { fields: { 'settings.permissions': 1 } }).limit(1).toArray();
    } catch (err) {
      console.log('Error in getting company permissions');
      console.log(err);
    }
  }
  public static async getNSPPermissionsByRole(nsp, role) {
    try {
      let permissions = {};
      let company = await this.collection.find({ name: nsp }, { fields: { ['settings.permissions.' + role]: 1 } }).limit(1).toArray();
      if (company && company.length) {
        permissions = company[0].settings.permissions[role]
      }
      return permissions;
    } catch (err) {
      console.log('Error in getting company permissions');
      console.log(err);
    }
  }
  public static updateNSPWMSettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.widgetMarketingSettings"]: data.settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }


  public static UpdateTicketSettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.ticketSettings"]: data
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static UpdateEmailNotificationSettings(nsp: string, settingsName: any, settings) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.emailNotifications." + settingsName]: settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }
  public static UpdateWindowNotificationSettings(nsp: string, settings) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.windowNotifications"]: settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }


  public static updateNSPDisplaySettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.displaySettings.barEnabled"]: data.barEnabled,
          ["settings.displaySettings.avatarColor"]: data.avatarColor,
          ["settings.displaySettings.settings." + data.settingsName]: data.settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }

  public static UpdateBackGroundImage(nsp: string, data: any, remove: boolean) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.displaySettings.settings.chatwindow.themeSettings.bgImage"]: (remove) ? {} : data
        }
      }, { returnOriginal: false, upsert: false }
    );
  }

  public static updateChatWindowFormSettings(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.displaySettings.settings.chatwindow." + data.settingsName]: data.settings
        }
      }, { returnOriginal: false, upsert: false }
    );
  }

  public static updateAgentLimit(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $inc: {
          ["package.agents.limit"]: data
        }
      }, { returnOriginal: false, upsert: false }
    );
  }

  public static updateCompanyPackage(nsp: string, data: any) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          package: data
        }
      }, { returnOriginal: false, upsert: false }
    );
  }


  public static SetCustomScript(nsp: string, script: string) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: {
          ["settings.customScript.userFetching"]: script
        }
      }, { returnOriginal: false, upsert: false }
    )
  }

  //#endregion

  //Deprecated
  //Remove When All references from code are eliminated
  public static async RegisterCompany(companiprofile, panel?) {
    try {

      let verified;
      //verified = (!companiprofile.verified) ? false : '';

      if (panel) {
        delete companiprofile['verified'];
        delete companiprofile['mailingList'];
      }





      let current_date = (new Date()).valueOf().toString();
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      let hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
      companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
      companiprofile.rooms = {
        DF: {
          isActive: true,
          Agents: [companiprofile.email]
        }
      };
      companiprofile.license = hash;
      companiprofile.deactivated = false;
      companiprofile.createdAt = new Date().toISOString();
      companiprofile.expiry = expiryDate.toISOString();
      companiprofile.script = Company.generateScript(hash);
      companiprofile.settings = defaultSettings;
      companiprofile.orderID = '';
      //if (!verified) companiprofile.settings.verified = false;
      let inserted = await this.collection.insertOne(companiprofile);
      __biZZC_SQS.SendMessage({ action: 'RegisterNamespace', name: companiprofile.name, rooms: companiprofile.rooms, settings: defaultSettings });


      if (inserted.insertedCount) {

        //#region Inserting Agent
        let agent = await Agents.RegisterAgent({
          first_name: companiprofile.full_name,
          last_name: '',
          phone_no: companiprofile.phone_no,
          nickname: companiprofile.username,
          username: companiprofile.username,
          password: companiprofile.password,
          email: companiprofile.email,
          role: 'superadmin',
          gender: '',
          nsp: companiprofile.name,
          created_date: current_date,
          created_by: 'self',
          group: ['DF'],
          location: companiprofile.country,
          editsettings: {
            editprofilepic: true,
            editname: true,
            editnickname: true,
            editpassword: true
          },
          communicationAccess: {
            chat: true,
            voicecall: false,
            videocall: false
          },
          settings: {
            simchats: 20,
          }
        });
        //#endregion

        // console.log('agent');
        // console.log(agent);

        return inserted;
      }

      else return undefined
    } catch (error) {
      console.log('Error in Registering company');
      console.log(error);
      return undefined;
    }

  }

  public static async RegisterCompanyNew(TempProfiles) {
    try {

      let temp = JSON.parse(JSON.stringify(TempProfiles.agent));
      TempProfiles.verified = true;
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      TempProfiles.expiry = expiryDate.toISOString();
      delete TempProfiles.agent;
      TempProfiles.deactivated = false;
      let inserted = await this.collection.insertOne(TempProfiles);
      __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'RegisterNamespace', name: TempProfiles.name, rooms: TempProfiles.rooms, settings: TempProfiles.settings });


      if (inserted.insertedCount) {

        //#region Inserting Agent
        let agent = await Agents.RegisterAgent(temp);
        //#endregion

        // console.log('agent');
        // console.log(agent);

        return inserted;
      }

      else return undefined
    } catch (error) {
      console.log('Error in Registering company');
      console.log(error);
      return undefined;
    }

  }
  public static async RegisterCompanyUnverified(companiprofile, pkg, panel?,) {
    try {


      let current_date = (new Date()).valueOf().toString();
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      let hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
      companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
      companiprofile.rooms = {
        DF: {
          isActive: true,
          Agents: [companiprofile.email]
        }
      };
      companiprofile.license = hash;
      companiprofile.deactivated = true;
      companiprofile.createdAt = new Date().toISOString();
      companiprofile.expiry = expiryDate.toISOString();
      companiprofile.verified = false;
      companiprofile.script = Company.generateScript(hash);
      companiprofile.settings = defaultSettings;
      companiprofile.package = pkg;
      companiprofile.agent = {
        first_name: companiprofile.full_name,
        last_name: '',
        phone_no: companiprofile.phone_no,
        nickname: companiprofile.username,
        username: companiprofile.username,
        password: companiprofile.password,
        email: companiprofile.email,
        role: 'superadmin',
        gender: '',
        nsp: companiprofile.name,
        created_date: current_date,
        created_by: 'self',
        group: ['DF'],
        location: companiprofile.country,
        editsettings: {
          editprofilepic: true,
          editname: true,
          editnickname: true,
          editpassword: true
        },
        communicationAccess: {
          chat: true,
          voicecall: false,
          videocall: false
        },
        settings: {
          simchats: 20,
        }
      }
      //if (!verified) companiprofile.settings.verified = false;
      let inserted = await this.db.collection('tempProfile').insertOne(companiprofile);
      if (inserted.insertedCount) {
        return inserted;
      }

      else return undefined
    } catch (error) {
      console.log('Error in Registering company');
      console.log(error);
      return undefined;
    }

  }

  public static async getCompanyByOrderID(orderID) {
    return this.collection.find({ orderID: orderID }).limit(1).toArray();
  }

  public static async getCompany(nsp) {
    return this.collection.find({ name: nsp }).limit(1).toArray();
  }
  public static async getCompanyByNSPandToken(nsp, token) {
    return this.collection.find({ name: nsp , companyToken: token}).limit(1).toArray();
  }
  public static async setRuleSetScheduler(nsp, scheduler) {
    return this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.ruleSetScheduler': scheduler } });
  }
  public static async updateScheduler(nsp, datetime) {
    return await this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.ruleSetScheduler.scheduled_at': datetime } });
  }

  public static async getCompaniesWithScheduler() {
    return this.collection.find({ 'settings.ruleSetScheduler.enabled': true }, { fields: { name: 1, 'settings.ruleSetScheduler': 1 } }).toArray();
  }

  public static async InsertOrderID(nsp, orderID) {
    try {
      return await this.collection.findOneAndUpdate(
        { name: nsp },
        {
          $set: { orderID: orderID }
        });
    } catch (error) {
      console.log(error);
      console.log('error in inserting ORder ID');
    }
  }


  //#region Group Functions
  public static getGroups(nsp) {
    return this.collection.find({ name: nsp }, { fields: { _id: 0, rooms: 1 } }).toArray();
  }

  public static AddGroup(nsp, groupName) {
    return this.collection.findOneAndUpdate(
      { name: nsp, ["rooms." + groupName]: { $exists: false } },
      {
        $set: { ["rooms." + groupName]: { isActive: false, Agents: [] } }
      }, { returnOriginal: false, upsert: false });
  }
  public static updateNSPDispatcherSettings(nsp, value) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: { 'settings.customDispatcher': value }
      }, { returnOriginal: false, upsert: false });
  }
  public static updateNSPSolrSearchSettings(nsp, value) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: { 'settings.solrSearch': value }
      }, { returnOriginal: false, upsert: false });
  }
  public static updateFacebookAppId(nsp, value) {
    return this.collection.findOneAndUpdate(
      { name: nsp },
      {
        $set: { 'settings.webhook.facebook.app_id': value }
      }, { returnOriginal: false, upsert: false });
  }


  public static AddAgentToGroup(nsp, groupName, agentEmail) {
    return this.collection.findOneAndUpdate(
      {
        name: nsp,
        ["rooms." + groupName]: { $exists: true },
        ["rooms." + groupName + ".Agents"]: { $nin: [agentEmail] }
      },
      {
        $addToSet: { ["rooms." + groupName + ".Agents"]: agentEmail }
      }, { returnOriginal: false, upsert: false, });
  }

  public static GetGroupByName(nsp, groupName) {
    return this.collection.find(
      {
        name: nsp,
        ["rooms." + groupName]: { $exists: true }
      }).limit(1).toArray();
  }

  public static async GetActiveGroups(nsp: string, groups: Array<string>) {
    return await this.collection.aggregate([
      { "$match": { "name": nsp } },
      { "$project": { 'locations': { '$objectToArray': '$rooms' } } }
    ]).limit(1).toArray();

  }

  public static RemoveAgentFromGroup(nsp, groupName, agentEmail) {
    return this.collection.findOneAndUpdate(
      {
        name: nsp,
        ["rooms." + groupName]: { $exists: true },
        ["rooms." + groupName + ".Agents"]: { $in: [agentEmail] }
      },
      {
        $pull: { ["rooms." + groupName + ".Agents"]: agentEmail }
      }, { returnOriginal: false, upsert: false, });
  }

  public static UpdateGroup(nsp, groupName, isActive: boolean) {
    if (!isActive) {
      return this.collection.findOneAndUpdate(
        {
          name: nsp,
          ["rooms." + groupName]: { $exists: true },
          ["rooms." + groupName + ".Agents"]: { $gt: [] }
        },
        {
          $set: { ["rooms." + groupName + ".isActive"]: isActive }
        }, { returnOriginal: false, upsert: false });
    } else {
      return this.collection.findOneAndUpdate(
        {
          name: nsp,
          ["rooms." + groupName]: { $exists: true },
          ["rooms." + groupName + ".Agents"]: { $gt: [] }
        },
        {
          $set: { ["rooms." + groupName + ".isActive"]: isActive }
        }, { returnOriginal: false, upsert: false });
    }

  }

  public static async isOwner(nsp, email) {
    try {
      let isOwner = await this.collection.find({ name: nsp, email: email }).limit(1).toArray();
      return (isOwner.length > 0);
    } catch (error) {

    }
  }

  public static async UpdateCompany(company) {
    try {
      //console.log(company)
      let CompnpanyInfo: any = {
        company_website: company.company_info.company_website,
        company_type: company.company_info.company_type,
        company_size: company.company_info.company_size,


      }
      if (company.name) {

        return this.collection.findOneAndUpdate(
          { name: company.name },
          {
            $set:
            {
              email: company.email,
              username: company.username,
              full_name: company.full_name,
              password: company.password,
              country: company.country,
              phone_no: company.phone_no,
              company_info: CompnpanyInfo,
              settings: company.settings,
              expiry: company.expiry,
              fullCountryName: company.fullCountryName
            }
          }, { returnOriginal: false, upsert: false },

        );

      }
      else return undefined
    } catch (error) {
      console.log('Error in Registering company');
      console.log(error);
      return undefined;
    }

  }

  public static async DeactivateCompany(name, value) {
    try {
      if (name) {

        return this.collection.findOneAndUpdate(
          { name: name },
          {
            $set:
            {
              deactivated: value,
              "settings.verified": !value
            }
          }, { returnOriginal: false, upsert: false },

        );

      }
    } catch (err) {
      console.log(err);
    }

  }

  public static async getDefaultPermissions() {
    try {
      return await this.db.collection('defaultPermissions').find({}, { fields: { _id: 0, createdBy: 0 } }).limit(1).toArray();
    } catch (error) {
      console.log(error);
    }
  }
  public static async getAuthPermissions(nsp) {
    try {
      let authPermissions: any;
      console.log(nsp);
      let company = await this.collection.find({ name: nsp }).limit(1).toArray();
      if (company && company.length) {
        authPermissions = company[0].settings.authentication;
      }
      return authPermissions;
    } catch (error) {
      console.log(error);
    }
  }

  private static getKeys(objectRef) {
    let keys: Array<string> = [];
    Object.keys(objectRef).map(key => {
      keys.push(key);
    });
    return keys;
  }

  public static async DeleteCompany(nsp) {
    try {
      return await this.collection.deleteOne({ name: nsp });
      // return await this.collection.find({nsp: nsp}).toArray();
    } catch (err) {
      console.log(err);
    }

  }

  public static removeRolesFromAllPermissions(RolePermissions, role) {
    let index = RolePermissions.indexOf(role);
    if (index !== -1) RolePermissions.splice(index, 1);
    return RolePermissions;
  }



  //#endregion






  // -------------------------------x---------------------------------------------------x ||
  //                              Functions operatiing on Databases
  //--------------------------------x---------------------------------------------------x ||




  //-------------------------------x-------------------------------------------------------x ||
  //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
  //--------------------------------x------------------------------------------------------- ||


}

