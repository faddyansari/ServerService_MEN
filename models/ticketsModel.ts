import { SLAPolicySchema } from './../schemas/slaPolicySchema';


// Created By Saad Ismail Shaikh
// Date : 05-03-18
import { Db, Collection, ObjectID, ObjectId, FindAndModifyWriteOpResultObject, UpdateWriteOpResult, Decimal128 } from "mongodb";
import { TicketLogSchema } from "../schemas/ticketLogSchema";
import { TicketSchema } from "../schemas/ticketSchema";
import { TaskList } from "../schemas/taskListSchema";
import { TicketGroupsModel } from "./TicketgroupModel";
import { RuleSetSchema } from "../schemas/ticketGroupsSchema";
import * as request from 'request-promise';
import { SessionManager } from "../globals/server/sessionsManager";
import { TeamsModel } from "./teamsModel";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { TicketsDB } from '../globals/config/databses/TicketsDB';
import * as cheerio from 'cheerio';
import { SQSPacket } from '../schemas/sqsPacketSchema';
var json2xls = require('json2xls');
const fs = require('fs');
var path = require('path');

// import { Schema } from "mongoose";
// const {ObjectId} = require('mongodb');
const solr = require('solr-client');

export class Tickets {

  static db: Db;
  static collection: Collection;
  static collectionEmailRecipients: Collection;
  static initialized = false;
  static result = false;
  static orResult = [];
  static andResult = [];


  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await TicketsDB.connect();
      this.collection = await this.db.createCollection('tickets');
      this.collectionEmailRecipients = await this.db.createCollection('emailRecipients');
      Tickets.initialized = true;
      return Tickets.initialized;
    } catch (error) {
      console.log(error);

      console.log('error in Initializing Tickets Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections


  }
  static Destroy() {
    (this.db as any) = undefined;
    (this.collection as any) = undefined;
  }

  public static async getTicketByID(nsp: any, tid: any) {
    try {
      if (tid[0]) {
        return await this.collection.find({ _id: new ObjectId(tid[0].toString()), nsp: nsp }).limit(1).toArray()
      } else {
        return [];
      }
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
      return [];
    }
  }
  public static async getTicketsCountOP(nsp) {
    try {
      return await this.collection.aggregate([
        {
          '$match': {
            'nsp': nsp,
            '$and': [
              {
                'assigned_to': {
                  '$ne': ''
                }
              }, {
                'assigned_to': {
                  '$exists': true
                }
              }
            ]
          }
        }, {
          '$group': {
            '_id': '$assigned_to',
            'open': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$state', 'OPEN'
                    ]
                  },
                  'then': 1,
                  'else': 0
                }
              }
            },
            'pending': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$state', 'PENDING'
                    ]
                  },
                  'then': 1,
                  'else': 0
                }
              }
            }
          }
        }
      ]).toArray();
    } catch (err) {
      console.log("Error!");
      console.log(err);
      return [];

    }
  }
  public static async getTicketById(tid: any) {
    try {
      if (tid) {
        return await this.collection.find({ _id: new ObjectId(tid.toString()) }).limit(1).toArray()
      } else {
        return [];
      }
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
      return [];
    }
  }
  public static async getTicketHistoryEmail(nsp: any, email: any) {
    try {

      return await this.collection.find({ nsp: nsp, sbtVisitor: email }, { sort: { _id: -1 } }).limit(20).toArray()
    } catch (error) {
      console.log('Error in getting ticket history');
      console.log(error);
      return [];
    }
  }
  public static async getTicketHistory(nsp: any, email: any, field: any) {
    try {
      return await this.collection.find({
        nsp: nsp, $or:
          [
            { sbtVisitor: { $exists: true, $eq: email } },
            { 'visitor.email': email },
            { 'dynamicFields.CM ID': { $exists: true, $eq: field } }
          ]
      }, { sort: { _id: -1 } }).limit(20).toArray();
    } catch (error) {
      console.log('Error in getting ticket history');
      console.log(error);
      return [];
    }
  }
  public static async Response(data: any) {
    try {

      data.forEach(d => {

        d.email = d.email.trim();

        request.post({
          uri: 'http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==',
          body: {
            "MailAddress": d.email,
            "PhoneNumber": '',
            "StockId": '',
            "CustomerId": '',
          },
          json: true,
          timeout: 50000
        });

        return 'done'
      });
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
      return [];
    }
  }
  public static async getSurveyResults(nsp: any, tid: any) {
    return await this.collection.find({ nsp: nsp, _id: new ObjectID(tid) }).project({ SubmittedSurveyData: 1 }).limit(1).toArray();
  }

  public static async getMessagesByTicketId(tids: any) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));
      return await this.db.collection('ticketMessages').find({ tid: { $in: objectIdArray }, senderType: "Agent" }).sort({ _id: -1 }).limit(1).toArray();
    }
    catch (error) {
      console.log('Error in getting message by ticket');
      console.log(error);
    }
  }

  public static async getTicketBySBTVisitor(nsp: any, datetime, visitorEmail) {
    try {

      return await this.collection.aggregate([
        {
          $match: {
            nsp: nsp,
            sbtVisitor: visitorEmail,
            datetime: { $gt: datetime }
          }
        },
        {
          $sort: {
            _id: -1
          }
        }


      ]).toArray();
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
      return [];
    }
  }

  public static async getPreviousTicketsByNSP(nsp: any, datetimeLessThan, datetimeGreaterThan) {
    try {
      return await this.collection.aggregate([
        {
          $match: {
            nsp: nsp,
            state: "OPEN",
            // $or:[{nsp:'/sbtjapan.com'},{nsp:'/sbtjapaninquiries.com'}],
            datetime: { $gt: datetimeLessThan, $lt: datetimeGreaterThan }
          }
        },
        {
          $sort: {
            _id: -1
          }
        }


      ]).toArray();
    } catch (error) {
      console.log('Error in getting 2 days ticket');
      console.log(error);
      return [];
    }
  }


  public static async CheckRegAgainstVisitor(emails: any, phones: any, nsp: string) {
    try {
      return await this.collection.find({
        nsp: nsp,
        CustomerInfo: { $exists: true },
        reg_date: { $exists: true },
        $or: [
          { sbtVisitor: { $in: emails } },
          { sbtVisitorPhone: { $in: phones } },
          { ['visitor.email']: { $in: emails } },
          { ['visitor.phone']: { $in: phones } },
          { ['ICONNData.contactMailEmailAddress']: { $elemMatch: { $in: emails } } },
          { ['ICONNData.contactPhoneNumber']: { $elemMatch: { $in: phones } } }
        ]
      }).project({ reg_date: 1 }).limit(1).toArray();
    } catch (error) {
      console.log('Error in Check Reg Against Visitor');
      console.log(error);
      return [];
    }
  }

  public static async getTicketsByGroup(group_name, nsp: any) {
    try {
      return await this.collection.find({ nsp: nsp, group: group_name }).toArray();
    } catch (error) {
      console.log('Error in getting ticket by group');
      console.log(error);
      return [];
    }
  }

  public static async getTicketsByVisitorData(data, nsp, token) {
    try {

      let search: any = {}
      search.nsp = nsp
      search[token] = data
      let obj = {};

      if (token == 'visitor.email') obj = {
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

      //console.log(search);


      return await this.collection.find(search).toArray();
    } catch (error) {
      console.log('Error in getting ticket by visitor');
      console.log(error);
      return [];
    }
  }

  public static async getTicketIds(id) {
    try {
      console.log('Get all ticket IDs');
      if (id) {
        return await this.collection.find({ id: { $gt: new ObjectId(id) } }, { fields: { id: 1 } }).limit(50).toArray();
      } else {
        return await this.collection.find({}, { fields: { _id: 1 } }).limit(50).toArray();
      }
    } catch (error) {
      console.log('Error in getting ticket Id');
      console.log(error);
      return [];
    }
  }

  public static async DeleteIncomingEmailId(tid: any, nsp: any) {
    try {
      return await this.collectionEmailRecipients.deleteOne({ _id: new ObjectId(tid), nsp: nsp });

    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }
  public static async UpdateIncomingEmailId(tid: any, domainEmail: any, incomingEmail: any, name: any, group: any, nsp: any) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectId(tid), nsp: nsp }, { $set: { domainEmail: domainEmail, name: name, group: group, incomingEmail: incomingEmail } }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }

  public static async setPrimaryEmail(nsp, tid: any, flag: any) {
    try {

      if (flag) {
        let emails = await this.collectionEmailRecipients.find({ nsp: nsp, primaryEmail: true }).toArray();
        if (emails.length < 1) {
          return await this.collectionEmailRecipients.findOneAndUpdate({ nsp: nsp, _id: new ObjectId(tid) }, { $set: { primaryEmail: true } }, { returnOriginal: false, upsert: false });
        } else {
          return undefined;
        }
      } else {
        return await this.collectionEmailRecipients.findOneAndUpdate({ nsp: nsp, _id: new ObjectId(tid) }, { $set: { primaryEmail: false } }, { returnOriginal: false, upsert: false });
      }
      // console.log(nsp, tid, flag);

      // if (tid) {
      //     return await this.collectionEmailRecipients.findOneAndUpdate({ nsp: nsp, _id: new ObjectId(tid) }, { $set: { primaryEmail: flag } }, { returnOriginal: false, upsert: false });
      // }
    } catch (err) {
      console.log('Error in setting primary email');
      console.log(err);
    }
  }

  public static async SendActivationEmail(tid: any, nsp: any) {
    try {
      return this.collectionEmailRecipients.find(
        { _id: new ObjectId(tid), nsp: nsp }).toArray();
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }

  public static async Snooze(time: any, agentEmail: string, ticketId: any, nsp: any, ticketlog: TicketLogSchema) {
    try {
      let snoozeObj = { snooze_time: time, email: agentEmail }
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectID(ticketId), nsp: nsp },
        { $set: { snoozes: snoozeObj, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } },
        { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log('Error in setting ticket snooze');
      console.log(error);
    }
  }
  public static async InsertStatus(id, nsp, status, ticketlog: TicketLogSchema) {
    try {
      if (status == 'REJECT') {
        return await this.collection.findOneAndUpdate({ _id: new ObjectId(id), nsp: nsp }, { $set: { status: status, state: 'CLOSED', closed_time: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { returnOriginal: false, upsert: false });
      } else {
        return await this.collection.findOneAndUpdate({ _id: new ObjectId(id), nsp: nsp }, { $set: { status: status }, $push: { ticketlog: ticketlog } }, { returnOriginal: false, upsert: false });

      }

    } catch (err) {
      console.log('Error in InsertCustomerInfo');
      console.log(err);

    }

  }
  public static async InsertCustomerInfo(id, nsp, cusInfo, reCusInfo, ICONNData, ticketlog: TicketLogSchema, reg_date: any) {
    try {

      return await this.collection.findOneAndUpdate({ _id: new ObjectID(id), nsp: nsp },

        { $set: { CustomerInfo: cusInfo, RelatedCustomerInfo: reCusInfo, reg_date: reg_date }, $push: { ticketlog: ticketlog } }, { upsert: false, returnOriginal: false });


    } catch (err) {
      console.log('Error in InsertCustomerInfo');
      console.log(err);

    }

  }

  public static async UnBindIconnCustomer(id, nsp, ticketlog: TicketLogSchema) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectID(id), nsp: nsp },

        { $set: { CustomerInfo: {} }, $push: { ticketlog: ticketlog } }, { upsert: false, returnOriginal: false });

    } catch (err) {
      console.log('Error in UnBindIconnCustomer');
      console.log(err);

    }
  }

  public static async AddIncomingEmail(domainEmail, incomingAgent, group: string, name: string, nsp) {
    try {
      // await this.db.collection('ticketgroups').findOneAndUpdate({ nsp: nsp, groups: { $elemMatch: { group_name: group } } }, { $addToSet: { 'groups.$.agent_list': { email: domainEmail, count: 0 } } }, { returnOriginal: false, upsert: false });
      return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail, applyExternalRulesets: true, canUseOriginalEmail: false, useOriginalEmail: false, iconnDispatcher: false, acknowledgementEmail: true });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }

  public static async addWatchers(tids, agents, ticketlog, nsp) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));
      let temp = await this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { lasttouchedTime: new Date().toISOString() }, $addToSet: { watchers: agents[0], ticketlog: ticketlog } }, { upsert: false });
      if (temp && temp.modifiedCount == tids.length) {
        let tickets = await this.collection.find({ _id: { $in: objectIdArray } }).limit(tids.length).toArray();
        if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
          this.updateTicketSolr(tickets);
        }
        return tickets;
      } else return [];
    } catch (err) {
      console.log('Error in adding watchers');
      console.log(err);
    }
  }


  public static async getWatchers(id, nsp) {
    try {
      return await this.collection.find({ _id: new ObjectID(id), nsp: nsp }).project({ watchers: 1 }).toArray();
    } catch (err) {
      console.log('Error in getting watchers');
      console.log(err);
    }
  }



  public static async ToggleExternalRuleset(id, value) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { applyExternalRulesets: value } });
      // return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }
  public static async ToggleIconnDispatcher(id, value) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { iconnDispatcher: value } });
      // return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }

  public static async ToggleIconnDispatcherTicketView(id, value) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { iconnDispatcherTicketView: value } });
      // return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail });
    } catch (error) {
      console.log('Error in adding ToggleIconnDispatcherTicketView');
      console.log(error);
    }
  }
  public static async ToggleAckEmail(id, value) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { acknowledgementEmail: value } });
      // return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }
  public static async ToggleUseOriginalEmail(id, value) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { useOriginalEmail: value } });
      // return await this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }

  public static async ConfirmActivation(Activationemail) {
    try {
      return await this.collectionEmailRecipients.findOneAndUpdate({
        email: Activationemail
      }, { $set: { activated: true } });



    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }

  public static async GetIncomingEmails(email) {
    try {
      let email_data = await this.collectionEmailRecipients.find({ domainEmail: email }).limit(1).toArray();
      return email_data;
    } catch (error) {
      console.log(error);
    }
  }
  public static async GetIncomingEmailsCount(nsp) {
    try {
      return await this.collectionEmailRecipients.aggregate([
        { "$match": { "nsp": nsp } },
        { "$group": { "_id": null, "count": { $sum: 1 } } },
      ]).toArray();
    } catch (error) {
      console.log(error);
    }
  }

  public static async GetForwardingEmail(email) {
    try {
      let email_data = await this.collectionEmailRecipients.find({ email: email }).toArray();
      return email_data;
    } catch (error) {
      console.log(error);
    }
  }

  public static async GetPrimaryEmail(nsp) {
    try {
      let email_data = await this.collectionEmailRecipients.find({ primaryEmail: true, nsp: nsp }).toArray();
      return email_data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public static async GetIncomingEmail(email) {
    try {
      let email_data = await this.collectionEmailRecipients.find({
        $and: [
          { activated: true },
          {
            $or: [
              { domainEmail: email },
              { email: email }
            ]
          }
        ]
      }).limit(1).toArray();
      return email_data;
    } catch (error) {
      console.log(error);
    }
  }

  public static async GetIncomingEmailsByNSP(nsp) {
    try {
      let email_data = await this.collectionEmailRecipients.find({ nsp: nsp }).toArray();
      return email_data;
    } catch (error) {
      console.log(error);
    }
  }

  public static async getExportData(datafrom: any, datato: any, nsp, email: string, canView: string, filters: any, clause: string, query: string, sortBy: any, assignType: any, mergeType: any) {
    try {
      // console.log(datafrom);
      // console.log(datato);
      // console.log(filters);

      if (!clause) clause = "$and"
      let filtersObject = { [clause]: ([] as any) }
      let obj = { 'nsp': nsp };
      let $or: any = [];
      let _id: any = undefined;
      if (filters) {
        Object.keys(filters).map(key => {
          // if (key == 'daterange') {
          //     filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
          //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
          //     // console.log('Date From', filters[key].from);
          //     // console.log('Date To ', filters[key].to)
          //     // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
          //     //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
          //     // }
          //     // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })

          //     return;
          // }
          if (Array.isArray(filters[key])) {
            filtersObject[clause].push({ [key]: { '$in': filters[key] } });
          }
          else filtersObject[clause].push({ [key]: filters[key] })
        });
      }
      if (ObjectID.isValid(query)) _id = { _id: new ObjectID(query) }
      if (filtersObject[clause].length) Object.assign(obj, filtersObject);
      if (query) {

        $or = [
          { subject: new RegExp(query, 'gmi') },
          { from: new RegExp(query) },
          { ['visitor.name']: new RegExp(query, 'gmi') },
          { ['visitor.email']: new RegExp(query, 'gmi') },
          { clientID: new RegExp(query, 'gmi') }
        ]
        let tickets = await this.db.collection('ticketMessages').aggregate([
          {
            '$match': {
              nsp: nsp,
              $and: [
                {
                  $text: {
                    $search: query
                  }
                },
                {
                  message: new RegExp(query)
                }
              ]
            }
          }, {
            '$group': {
              '_id': '$nsp',
              'tids': {
                '$addToSet': {
                  '$arrayElemAt': [
                    '$tid', 0
                  ]
                }
              }
            }
          }
        ]).limit(1).toArray();
        if (tickets && tickets.length && tickets[0].tids.length) {
          // console.log(tickets[0].tids.length);
          // console.log(tickets[0].tids.map(id => {return new ObjectID(id)}));
          let objectIdArray = tickets[0].tids.map(s => { return new ObjectId(s) });
          $or.push({ _id: { $in: objectIdArray } });
          // console.log($or[4]);
        }
      }
      if (_id) $or.push(_id);
      switch (canView) {
        case 'all':
          //Do Nothing
          break;

        case 'assignedOnly':
          Object.assign(obj, { "assigned_to": email });
          break;
        case 'group':
          let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
          Object.assign(obj, {
            '$or': [
              { group: { '$in': groups } },
              { assigned_to: email }
            ]
          });
          break;
        case 'team':

          let teamMembers = await TeamsModel.getTeamMembersAgainstAgent(nsp, email);
          // console.log(teamMembers);

          Object.assign(obj, { "assigned_to": { '$in': teamMembers } });
          break;
        default:
          break;
      }
      switch (assignType) {
        case 'assigned':
          Object.assign(obj, {
            assigned_to: {
              $exists: true
            }
          })
          break;
        case 'unassigned':
          Object.assign(obj, {
            $or: [
              {
                assigned_to: {
                  $exists: false
                }
              },
              {
                assigned_to: ''
              }
            ]
          });
          break;
        default:
          break;
      }
      switch (mergeType) {
        case 'yes':
          Object.assign(obj, {
            merged: true
          })
          break;
        case 'no':
          Object.assign(obj, {
            $or: [
              {
                merged: {
                  $exists: false
                }
              },
              {
                merged: false
              }
            ]
          });
          break;
        default:
          break;
      }
      if (query) Object.assign(obj, { '$or': $or })

      let sort: any;
      if (sortBy && sortBy.name) {
        sort = {
          [sortBy.name]: parseInt(sortBy.type)
        }
      }

      return this.collection.aggregate([
        {
          '$match': obj
        }, {
          '$addFields': {
            'dateISO': {
              '$dateFromString': {
                'dateString': '$datetime'
              }
            }
          }
        }, {
          '$match': {
            'dateISO': {
              '$lte': new Date(datato),//datafrom.name,
              '$gte': new Date(datafrom)//datato.name
            }
          }
        },
        { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } }

      ]).toArray();


    } catch (error) {
      console.log('Error in getting exportdata');
      console.log(error);
    }
  }

  public static async MoveToClosed(notPrimaryRef, nsp) {
    try {
      let objectIdArray = notPrimaryRef.map(s => new ObjectId(s));
      await this.collection.update({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { state: "CLOSED", lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true });
      return this.collection.find({ _id: { $in: objectIdArray } }).toArray();

      // return await this.collection.findOneAndUpdate({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { state:  "CLOSED" } }, { returnOriginal: false, upsert: false });

    }
    catch (error) {
      console.log('Error in MoveToClosed');
      console.log(error);
    }

  }


  public static async CreateTicket(ticket: TicketSchema) {
    try {
      let data = await this.collection.insertOne(JSON.parse(JSON.stringify(ticket)));


      if (data && data.insertedCount > 0) {

        let clientID = await Tickets.getTicketClientID((data.ops[0]._id as any).toHexString(), ticket.nsp);
        if (clientID) {
          let updatedTicket = await Tickets.SetClientID(data.ops[0]._id, data.ops[0].nsp, clientID.toString());
          if (updatedTicket) data.ops[0].clientID = clientID;
        }
      }
      return data;
    } catch (error) {
      console.log('Error in Create Conversation');
      console.log(error);
    }
  }


  private static onerror(err) {
    console.error(err);
  }

  private static CommitSolr(docs): Promise<any> {
    return new Promise((resolve, reject) => {
      let client = solr.createClient({
        host: '127.0.0.1',
        port: '8983',
        core: 'sample_new',
      });
      client.add(docs, function (err, obj) {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          // console.log('Added Docs', obj);
          client.commit(function (err, res) {
            if (err) reject(err);
            if (res) resolve(obj)
          });
        }
      });
    })

  }

  public static async CheckMessageEntry(ticket) {
    try {
      if (!Array.isArray(ticket._id)) ticket._id = [ticket._id];
      return await this.db.collection('ticketMessages').find({
        senderType: 'Agent', nsp: ticket.nsp, tid: { $in: (ticket._id) }
      }).sort({ _id: -1 }).toArray();

    } catch (error) {
      console.log(error);
      console.log('Error in Getting Snoozing Tickets');
      //Send Sentry Email
      return [];
    }
  }

  public static async UnsetBooleanOrPushLog(id, nsp, log?: TicketLogSchema) {
    try {
      if (log) {
        return await this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.reminderResolution': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: log } }, { returnOriginal: false, upsert: false });
      }
      else {
        return await this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.reminderResponse': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() } }, { returnOriginal: false, upsert: false });

      }
    } catch (error) {
      console.log('Error in unsetting policy');
      console.log(error);
    }
  }

  public static async TicketClosed(tids: Array<string>, closed_time) {
    try {
      let temp = tids.map(tid => { return new ObjectId(tid) });
      await this.collection.update(
        { _id: { $in: temp } },
        { $set: { closed_time: closed_time } },
        { multi: true });

      return await this.collection.find({ _id: { $in: temp } }).toArray();
    } catch (err) {
      console.log('Error in Ticket Closed');
      console.log(err);
    }
  }

  public static async SetViolationTime(id, nsp, log?: TicketLogSchema) {
    try {
      if (log) {
        return await this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.violationResolution': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: log } }, { returnOriginal: false, upsert: false });
      }
      else {
        return await this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.violationResolution': true, lasttouchedTime: new Date().toISOString() } }, { returnOriginal: false, upsert: false });

      }
    } catch (error) {
      console.log('Error in unsetting policy');
      console.log(error);
    }
  }



  public static async checkQuery() {
    try {
      // let client = solr.createClient({
      //     host: '127.0.0.1',
      //     port: '8983',
      //     core: 'sample',
      // });

      // Switch on "auto commit", by default `client.autoCommit = false`
      // client.autoCommit = true;

      // Save all the products in the csv file into the database
      // fs.createReadStream('C:\\Users\\mufakharuddin9417\\Desktop\\tickets.json')
      //     .on('error', this.onerror)
      //     .pipe(client.createAddStream())
      //     .on('error', this.onerror)
      //     .on('end', function () {
      //         console.log('all products are in the database now.');
      //         // client.commit(function(err,res){
      //         //                 if(err) console.log(err);
      //         //                 if(res) console.log('All Committed',res);
      //         //              });
      //     });
      //  client.deleteByQuery('*:*',function(err,obj){
      //     if(err){
      //         console.log(err);
      //     }else{
      //         client.commit(function(err,res){
      //             if(err) console.log(err);
      //             if(res) console.log(res);
      //          });
      //     }
      //  });
      let docs: any = [];
      let count = 0;
      await this.db.collection('ticketMessages').find({ nsp: '/sbtjapan.com' }).forEach(async message => {
        docs.push(message);
        count++;
        if (!(count % 1000)) {
          console.log('Adding to SOlr');
          await this.CommitSolr(docs);
          docs = [];
          count == 0;
        }
      })

      if (count) {
        await this.CommitSolr(docs);
        count = 0;
        docs = [];
      }

      console.log('Added ALl to SOlr');


    } catch (err) {

    }
  }

  public static async AgentLevel(agentsArray, currentAgent, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ agent_email: currentAgent, nsp: nsp }, { $set: { externalAgents: agentsArray } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }

  public static async TicketsAccToLevel(agentsArray, currentAgent, nsp) {
    try {
      return await this.collection.findOneAndUpdate({ agent_email: currentAgent, nsp: nsp }, { $set: { externalAgents: agentsArray } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in adding ext. agents');
      console.log(error);
    }
  }
  public static async BulkTagAssign(ids: any, tagToassign: string, ticketlog: TicketLogSchema | any) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));
      // let search =  await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
      // search.forEach(element => {
      //     if(element.tags && element.tags.length){
      await this.collection.update(
        { _id: { $in: objectIdArray } },
        { "$push": { "tags": tagToassign, ticketlog: ticketlog } },
        { "multi": true }
      )

      return await this.collection.find({ _id: { $in: objectIdArray } }).toArray();


      // else{
      //     return await this.collection.update(
      //         { _id: { $in: objectIdArray } },
      //         { "$set": { "tags": tagToassign } },
      //         { "multi": true }
      //     )
      // return await this.collection.insert({"_id": { $in: objectIdArray } , {$set:{"tags": tagToassign}},{ "multi": true } });
      //     }
      // });


    } catch (error) {
      console.log('Error in bulk tag assignment');
      console.log(error);
    }
  }


  public static async getBulkTickets(ids: any) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));
      return await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
    } catch (error) {
      console.log('Error in bulk assignment');
      console.log(error);
    }
  }
  public static async BulkAgentAssign(ids: any, emailToassign: string, ticketlog: TicketLogSchema | any) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));

      await this.collection.update({ _id: { $in: objectIdArray } }, { $set: { assigned_to: emailToassign, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true });
      return await this.collection.find({ _id: { $in: objectIdArray } }).toArray();


    } catch (error) {
      console.log('Error in bulk assignment');
      console.log(error);
    }
  }

  public static async getcount(agents: any) {
    try {

      return this.collection.aggregate([
        {
          '$match': {
            'assigned_to': {
              '$in': agents
            }
          }
        }, {
          '$group': {
            '_id': '$assigned_to',
            'count': {
              '$sum': 1
            }
          }
        }
      ]).toArray();


      // this.collection.aggregate([
      //     {
      //       $unwind: "$assigned_to"
      //     },
      //     {
      //       $group: {
      //         _id: "$assigned_to",
      //         count: {
      //           $sum: 1
      //         }
      //       }
      //     }
      //   ])

      // return this.collection.find({ assigned_to: { $in: agents } }).toArray();

    } catch (err) {
      console.log('Error in search assignment count');
      console.log(err);
    }
  }

  public static async EmailSignature(header: any, footer: any, agent: any) {
    try {
      let data = {
        header: header,
        footer: footer,
        agent_email: agent,
        active: false,
        createdOn: new Date().toISOString()
      }
      return this.db.collection('emailSignatures').insertOne(data);
    }
    catch (error) {
      console.log(error);
      console.log('error in email signs in ticketmodel');
    }
  }

  public static async UpdateSignature(header: string, footer: string, id: any, lastModified, email: string) {
    try {
      return await this.db.collection('emailSignatures').findOneAndUpdate(
        { _id: new ObjectID(id), agent_email: email },
        { $set: { header: header, footer: footer, lastModified: lastModified } },
        { returnOriginal: false, upsert: false }
      );

    } catch (error) {
      console.log('error in updating signature');
      console.log(error);
    }
  }

  public static async getSign(agent_email: any) {
    try {
      return await this.db.collection('emailSignatures').find({ agent_email: agent_email }).sort({ createdOn: -1 }).toArray();
    } catch (err) {
      console.log('Error in Get Signatures');
      console.log(err);
    }
  }

  public static async updateCheckedOne(threadid: any, todos: any, ids: any) {
    let objectIdArray = ids.map(s => new ObjectId(s));

    try {

      return await this.collection.findOneAndUpdate(
        { "todo.id": { $in: objectIdArray } },
        { $set: { "todo.$[elem].completed": true } },
        { arrayFilters: [{ "elem.id": { $in: objectIdArray } }], upsert: false, returnOriginal: false }
      )

    } catch (error) {
      console.log('error in update CheckedOne');
      console.log(error);

    }
  }

  public static async checkedTask(threadid: any, id: any, status: boolean, ticketlog: any) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(threadid), "todo.id": new ObjectId(id) },
        { $set: { "todo.$[elem].completed": status }, $push: { ticketlog: ticketlog } },
        { arrayFilters: [{ "elem.id": new ObjectId(id) }], upsert: false, returnOriginal: false });

    } catch (err) {
      console.log(err);
      console.log("error in updating completed tasks");
    }
  }

  public static async updateTask(threadid: any, id: any, properties: any, ticketlog: any) {
    try {
      return this.collection.findOneAndUpdate(
        {
          _id: new ObjectId(threadid),
          "todo.id": new ObjectId(id)
        },
        {
          $set: { "todo.$.todo": properties },
          $push: { ticketlog: ticketlog }
        }, { returnOriginal: false, upsert: false });

    }
    catch (err) {
      console.log(err);

    }
  }
  public static async bulkTicketsUnread(tids: Array<string>, viewState: string) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));

      let temp = await this.collection.updateMany({ _id: { $in: objectIdArray } }, { $set: { viewState: viewState } }, { upsert: false });
      if (temp && temp.modifiedCount == tids.length) return await this.collection.find({ _id: { $in: objectIdArray } }).limit(tids.length).toArray();
      else return [];

    } catch (error) {
      console.log('Error in bulk mark Unread');
      console.log(error);
      return [];
    }
  }

  public static async bulkTicketsRead(ids: any, viewState: string) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));

      await this.collection.update({ _id: { $in: objectIdArray } }, { $set: { viewState: viewState, lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true });
      return this.collection.find({ _id: { $in: objectIdArray } }).toArray();

    } catch (error) {
      console.log('Error in bulk mark Read');
      console.log(error);
    }
  }

  public static async getTask(nsp) {
    try {
      return await this.collection.find({ nsp: nsp }).project({ todo: 1 }).limit(1).toArray();
    } catch (err) {
      console.log('Error in Get tasks');
      console.log(err);
    }
  }

  public static async getActiveSignature(agent_email: any) {
    try {
      return await this.db.collection('emailSignatures').find({ agent_email: agent_email, active: { $eq: true } }).sort({ createdOn: -1 }).toArray();
    } catch (err) {
      console.log('Error in Get Signatures');
      console.log(err);
    }
  }

  public static async toggleSign(agent, signId, flag: boolean, lastModified) {

    try {
      await this.db.collection('emailSignatures').findOneAndUpdate(
        { active: true, agent_email: agent },
        {
          $set: { active: false },
        },
        { returnOriginal: false, upsert: false });

      return await this.db.collection('emailSignatures').findOneAndUpdate(
        { _id: new ObjectID(signId), agent_email: agent },
        {
          $set: { active: flag, lastModified: lastModified },
        },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in activating surveys');
      console.log(error);
    }
  }

  public static async deleteSign(signId, agent) {
    try {
      return await this.db.collection('emailSignatures').deleteOne({ _id: new ObjectId(signId) });
    } catch (error) {
      console.log('Error in deleting signature');
      console.log(error);
    }
  }


  public static async UpdateTicketNote(tids: Array<string>, note: any, nsp: string, ticketlog: TicketLogSchema | any) {
    try {
      // console.log(ticketlog)
      let temp = tids.map(tid => { return new ObjectId(tid); })
      let result = await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $push: { ticketNotes: note, ticketlog: ticketlog }
        },

        { upsert: false },

      );

      if (result && result.result.ok && result.modifiedCount == tids.length)
        return await this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
      else return [];
    } catch (error) {
      console.log(error);
      console.log('error in Editing ticket note Properties in ticketmodel');
      return [];
    }
  }

  public static async UpdateViewState(tids: Array<string>, nsp: string, viewState: string, ticketlog: TicketLogSchema) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));

      let temp: any;
      if (viewState == 'READ') {
        let datetime = new Date().toISOString();
        temp = await this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { last_read_date: datetime }, $push: { ticketlog: ticketlog } }, { upsert: false });
        await this.collection.find({ _id: { $in: objectIdArray } }).forEach(x => {

          if (!x.assigned_to || (x.assigned_to && x.assigned_to == ticketlog.updated_by)) {
            x.viewState = viewState;
          }

          if (x.assignmentList && x.assignmentList.length) {
            if (x.assignmentList.filter(a => a.assigned_to == ticketlog.updated_by).length) {
              x.assignmentList.filter(a => a.assigned_to == ticketlog.updated_by).sort((a, b) => (Number(new Date(b.assigned_time)) - Number(new Date(a.assigned_time))))[0].read_date = datetime;
            }
          }
          this.collection.save(x);
        })
      } else {
        temp = await this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState }, $push: { ticketlog: ticketlog } }, { upsert: false });
      }
      if (temp && temp.modifiedCount) return await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
      else return [];
    } catch (error) {
      console.log('Error in Update View State');
      console.log(error);
      return [];
    }
  }
  public static async UpdateFirstReadDate(tids: Array<string>, nsp: string, ticketlog: TicketLogSchema) {
    try {
      let objectIdArray = tids.map(s => new ObjectId(s));
      let datetime = new Date().toISOString();
      return await this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp, first_read_date: { $exists: false } }, { $set: { first_read_date: datetime }, $push: { ticketlog: ticketlog } }, { upsert: false });
    } catch (error) {
      console.log('Error in Update First Read Date');
      console.log(error);
      return undefined;
    }
  }

  public static async GetMessageByID(messageId: string) {
    try {
      return this.db.collection('ticketMessages').find({ messageId: messageId }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in Get message by messageId');
    }
  }



  public static async GetMessageIdByTID(tid: Array<string>): Promise<Array<string>> {
    try {
      let objectIdArray = tid.map(s => new ObjectId(s));

      let lastMessage = await this.db.collection('ticketMessages').find({
        tid: { $in: tid }
      }).sort({ _id: -1 }).limit(1).toArray();
      if (lastMessage && lastMessage.length && lastMessage[0].messageId) return [lastMessage[0].messageId]
      else return [];
    } catch (error) {
      console.log(error);
      console.log('Error in Get message by messageId');
      return [];
    }
  }

  public static async UpdateTicketAgent(id: ObjectID, nsp: string, agent: string, ticketlog: TicketLogSchema | any) {
    try {

      if (agent) {

        if (Object.keys(ticketlog).length) {
          return this.collection.findOneAndUpdate(
            { _id: id, nsp: nsp },
            {
              $set: { assigned_to: agent, lasttouchedTime: new Date().toISOString() },
              $push: { ticketlog: ticketlog }
            },
            { returnOriginal: false, upsert: false });
        }
      }

    } catch (error) {
      console.log('In Else Update Ticket agent');
      console.log(error);
    }
  }

  public static async UpdateTicketGroup(ids: any, nsp: string, group: string, ticketlog: TicketLogSchema | any) {
    try {

      //FOR BULK AND SINGLE-->NEW
      let objectIdArray = ids.map(s => new ObjectId(s));

      if (Object.keys(ticketlog).length) {
        let result = await this.collection.updateMany(
          { _id: { $in: objectIdArray }, nsp: nsp },
          {
            $rename: { 'group': "previousGroup" },
            // $push: { ticketlog: ticketlog }
          },
          { upsert: false, });
        result = await this.collection.updateMany(
          { _id: { $in: objectIdArray }, nsp: nsp },
          {
            $set: { group: group },
            $push: { ticketlog: ticketlog }
          },
          { upsert: false, });
        if (result && result.result.ok && result.modifiedCount == ids.length) {
          let tickets = await this.collection.find({ _id: { $in: objectIdArray }, nsp: nsp }).limit(ids.length).toArray();
          if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
            this.updateTicketSolr(tickets);
          }
          return tickets;
        } else return [];




        //OLD-->FOR SINGLE:
        // if (Object.keys(ticketlog).length) {
        //     return this.collection.findOneAndUpdate(
        //         { _id: { $in: objectIdArray[0] }, nsp: nsp },
        //         {
        //             $set: { group: group, lasttouchedTime: new Date().toISOString() },
        //             $push: { ticketlog: ticketlog }
        //         },
        //         { returnOriginal: false, upsert: false });
        // }
      }

    } catch (error) {
      console.log('In Else Update Ticket group');
      console.log(error);
    }
  }


  public static async UpdateTicketPriority(tids: any, nsp: string, priority: string, ticketlog: TicketLogSchema | any) {
    try {

      let temp = tids.map(tid => { return new ObjectId(tid) });
      if (Object.keys(ticketlog).length) {

        let updated = await this.collection.updateMany(
          { _id: { $in: temp }, nsp: nsp },
          {
            $set: { priority: priority },
            $push: { ticketlog: ticketlog }
          },
          { upsert: false });
        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
          return this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
        } else {
          return [];
        }
      }




      // if (Object.keys(ticketlog).length) {
      //     // console.log(id, nsp, priority);

      //     return this.collection.findOneAndUpdate(
      //         { _id: temp[0], nsp: nsp },
      //         {
      //             $set: { priority: priority },
      //             $push: { ticketlog: ticketlog }
      //         },
      //         { returnOriginal: false, upsert: false });
      // }



    } catch (error) {
      console.log('In Else Update Ticket priority');
      console.log(error);
    }
    // console.log("t3");

  }

  public static async UpdateBulkTicket(ids: any, nsp: string, ticketlog: TicketLogSchema | any, state?: string) {
    try {
      let objectIdArray = ids.map(s => new ObjectId(s));
      if (state) {
        if (Object.keys(ticketlog).length) {

          await this.collection.update({ _id: { $in: objectIdArray } }, { $set: { state: state, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true });
          return this.collection.find({ _id: { $in: objectIdArray } }).toArray();

        } else {
          await this.collection.update({ _id: { $in: objectIdArray } }, { $set: { state: state, lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true });
          return this.collection.find({ _id: { $in: objectIdArray } }).toArray();
        }


      } else {
        // console.log('In Else Bulk Update Ticket: ' + objectIdArray + ' nsp: ' + nsp);
        await this.collection.update({ _id: { $in: objectIdArray } }, { $set: { lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true });
        return this.collection.find({ _id: { $in: objectIdArray } }).toArray();
      }

    } catch (error) {
      console.log('Error in Bulk Update Ticket');
      console.log(error);
    }
  }

  public static async UpdateTicket(tids: Array<string>, nsp: string, ticketlog: TicketLogSchema | any, state?: string) {
    try {
      let temp = tids.map(tid => { return new ObjectId(tid) });
      if (state) {
        if (Object.keys(ticketlog).length) {

          let updated = await this.collection.updateMany(
            { _id: { $in: temp }, nsp: nsp },
            {
              $set: { state: state },
              $push: { ticketlog: ticketlog }
            },
            { upsert: false });
          if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
            return this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
          } else {
            return [];
          }
        } else {
          let updated = await this.collection.updateMany(
            { _id: { $in: temp }, nsp: nsp },
            {
              $set: { state: state }
            },
            { upsert: false });
          if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
            return this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
          } else {
            return [];
          }
        }


      } else {
        // console.log('In Else Update Ticket: ' + tids + ' nsp: ' + nsp);
        let updated = await this.collection.updateMany(
          { _id: { $in: temp }, nsp: nsp },
          {
            $set: { lasttouchedTime: new Date().toISOString() }
          },
          { upsert: false });
        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
          return this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
        } else {
          return [];
        }
      }

    } catch (error) {
      console.log('Error in Update Ticket');
      console.log(error);
      return [];
    }
  }

  public static async UpdateTicketObj(ticket) {
    try {
      await this.collection.findOneAndReplace({ _id: new ObjectID(ticket._id) }, (ticket), { upsert: false, returnOriginal: false });
      // await this.collection.update({_id: new ObjectId(ticket._id)}, ticket, {upsert: false});
    } catch (err) {
      console.log('Error in updating ticket Object');
      console.log(err);

    }
  }

  public static async UpdateTicketTouchedTime(tids: Array<string>, nsp: string) {
    try {
      if (!Array.isArray(tids)) tids = [tids];
      let temp = tids.map(tid => { return new ObjectId(tid) });

      // console.log('In Else Update Ticket: ' + tids + ' nsp: ' + nsp);
      let updated = await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $set: { lasttouchedTime: new Date().toISOString() }
        },
        { upsert: false });
      if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
        return this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
      } else {
        [];
      }


    } catch (error) {
      console.log('Error in Update Ticket');
      console.log(error);
    }
  }


  public static async UpdateTicketFromSNS(id: ObjectID, nsp: string, lasttouchedTime: string, ticketlog: TicketLogSchema | any, state?: string) {
    try {
      if (state) {
        if (Object.keys(ticketlog).length) {
          return this.collection.findOneAndUpdate(
            { _id: id, nsp: nsp },
            {
              $set: { state: state, lasttouchedTime: lasttouchedTime },
              $push: { ticketlog: ticketlog }
            },
            { returnOriginal: false, upsert: false });
        } else {
          return this.collection.findOneAndUpdate(
            { _id: id, nsp: nsp },
            [
              { $set: { state: state, lasttouchedTime: lasttouchedTime } }
            ],
            { returnOriginal: false, upsert: false });
        }


      } else {
        // console.log('In Else Update Ticket');
        return this.collection.findOneAndUpdate(
          { _id: id, nsp: nsp },
          { $set: { lasttouchedTime: lasttouchedTime } },
          { returnOriginal: false, upsert: false });
      }

    } catch (error) {
      console.log('Error in Update Ticket');
      console.log(error);
    }
  }

  public static async TicketSolved(tids: Array<string>, solved_date, solved_by) {
    try {
      let temp = tids.map(tid => { return new ObjectId(tid) });
      await this.collection.update(
        { _id: { $in: temp } },
        { $set: { solved_date: solved_date, solved_by: solved_by } },
        { multi: true });

      //for sla policy, need to send email if resolved is violated.
      return await this.collection.find({ _id: { $in: temp } }).project({ solved_date: 1, assigned_to: 1, }).toArray();
    } catch (err) {
      console.log('Error in TicketSolved');
      console.log(err);
    }
  }

  public static async TicketBulkedSolved(tid: ObjectID, solved_date, solved_by) {
    try {
      return await this.collection.update({ _id: tid }, { $set: { solved_date: solved_date, solved_by: solved_by } });
    } catch (err) {
      console.log('Error in Bulk TicketSolved');
      console.log(err);
    }
  }

  public static async addTask(tids: any, nsp: any, properties: TaskList | any, ticketlog: TicketLogSchema | any) {
    try {
      let temp = tids.map(tid => { return new ObjectId(tid); })
      let result = await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $push: { ticketlog: ticketlog, todo: properties }
        },
        { upsert: false });
      if (result && result.result.ok && result.modifiedCount == tids.length) return await this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
      else return [];

      //OLD
      // return this.collection.findOneAndUpdate(
      //     { _id: temp[0], nsp: nsp },
      //     {
      //         $push: { ticketlog: ticketlog, todo: properties }
      //     }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log('Error in Adding task');
      console.log(error);
    }
  }

  public static async UpdateDynamicProperty(threadid: ObjectId, name: string, value: string, ticketlog) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(threadid) },
        {
          $set: { [`dynamicFields.${name}`]: value },
          $push: { ticketlog: ticketlog }
        },
        { upsert: false, returnOriginal: false }
      );


    } catch (error) {
      console.log('Error in deleting dynamic prop');
      console.log(error);
    }
  }

  public static async deleteNote(threadid: string, noteId: string, ticketlog: TicketLogSchema) {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(threadid) },
        {
          $set: { lasttouchedTime: new Date().toString() },
          $pull: { ticketNotes: { id: new ObjectID(noteId) } },
          $push: { ticketlog: ticketlog }
        },
        { upsert: false, returnOriginal: false }
      );


    } catch (error) {
      console.log('Error in deleting note');
      console.log(error);
    }
  }
  public static async deleteTask(threadid: string, taskid: string, ticketlog: any) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectId(threadid) },
        {
          $pull: { todo: { id: new ObjectId(taskid) } },
          $push: { ticketlog: ticketlog }
        },
        { upsert: false, returnOriginal: false }
      )


    } catch (error) {
      console.log('Error in deleting tasks');
      console.log(error);
    }
  }


  public static async addTag(tids: Array<string>, nsp: string, tag: string, ticketlog: TicketLogSchema | any) {
    try {
      let temp = tids.map(tid => { return new ObjectId(tid); })
      let result = await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $push: { ticketlog: ticketlog, tags: { $each: tag as any } }
        },
        { upsert: false });
      if (result && result.result.ok && result.modifiedCount == tids.length) return await this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
      else return [];
    } catch (error) {
      console.log('Error in Adding tag');
      console.log(error);
      return [];
    }

  }


  public static async deleteTag(threadid: string, nsp, tag: string, ticketlog: TicketLogSchema) {
    try {

      return await this.collection.findOneAndUpdate(
        { _id: new ObjectId(threadid), nsp: nsp },
        {
          $pull: { tags: tag },
          $push: { ticketlog: ticketlog }
        }, { upsert: false, returnOriginal: false }
      )
    } catch (error) {
      console.log('Error in deleting tag');
      console.log(error);
    }
  }
  public static async AssignAgent(tids: Array<string>, nsp: string, agent_email: string, ticketlog: TicketLogSchema | any) {
    try {
      let temp = tids.map(id => { return new ObjectId(id); });
      let assigned_time = new Date().toISOString();
      let reassignmentListObj = {
        assigned_to: agent_email,
        assigned_time: assigned_time,
        read_date: ''
      };
      await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $rename: { 'assigned_to': "previousAgent" },
          // $push: { ticketlog: ticketlog }
        },
        { upsert: false, });
      await this.collection.updateMany({ _id: { $in: temp }, nsp: nsp, first_assigned_time: { $exists: false } }, { $set: { first_assigned_time: assigned_time } }, { upsert: false });
      let ticketlogarr: any = []
      ticketlogarr.push(ticketlog);
      // ticketlogarr.push({
      //   title: 'Ticket Set As ',
      //   status: 'UNREAD',
      //   time_stamp: new Date().toISOString(),
      //   updated_by: 'System',
      //   user_type: 'Agent'
      // });
      let result = await this.collection.updateMany(
        { _id: { $in: temp }, nsp: nsp },
        {
          $set: { assigned_to: agent_email, viewState: 'UNREAD' },
          $push: { ticketlog: { $each: ticketlogarr }, assignmentList: reassignmentListObj }
        },
        { upsert: false });

      // console.log(result.modifiedCount, tids.length);
      if (result && result.result.ok && result.modifiedCount == tids.length) {
        let tickets = await this.collection.find({ _id: { $in: temp }, nsp: nsp }).limit(tids.length).toArray();
        if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
          this.updateTicketSolr(tickets);
        }
        return tickets;
      } else {
        return []
      };
    } catch (error) {
      console.log('Error in Assigning agent');
      console.log(error);
      return [];
    }

  }

  public static async getTicketsData(ids: Array<any>) {
    try {
      if (!Array.isArray(ids)) ids = [ids];
      let objectIdArray = ids.map(s => { return new ObjectId(s) });
      return await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
    }

    catch (error) {
      console.log('Error in getting data of specified ids');
      console.log(error);
    }
  }

  public static async getTags(id, nsp: any) {
    try {
      return await this.collection.find({ _id: new ObjectID(id), nsp: nsp }).project({ tags: 1 }).limit(1).toArray();
    }
    catch (error) {
      console.log('Error in getting data of tag by ids');
      console.log(error);
    }
  }

  public static async getMergeTickets(nsp: string, email, canView: string, merge: boolean) {

    switch (canView) {
      case 'all':
        return this.collection.find({ nsp: nsp, merged: merge }).sort({ lasttouchedTime: -1 }).limit(100).toArray();
      case 'assignedOnly':
        return this.collection.find({ nsp: nsp, merged: merge, assigned_to: email }).sort({ lasttouchedTime: -1 }).limit(100).toArray();
      default:
        return this.collection.find({ nsp: nsp, merged: merge }).sort({ lasttouchedTime: -1 }).limit(100).toArray();
    }
    // .limit(200)-->add

  }

  public static async getTicketsForLazyLoading(nsp: string, email, canView: string, filters: any, clause: string, query: string, chunk: string, sortBy: any, assignType: any, groupAssignType: any, mergeType: any, solrSearchEnabled = false) {
    try {
      if (!chunk) return undefined;
      if (!clause) clause = "$and"
      let filtersObject = { [clause]: ([] as any) }
      let obj: any = { 'nsp': nsp, '$and': [] };
      let $or: any = [];
      let _id: any = undefined;
      if (filters) {
        Object.keys(filters).map(key => {
          if (key == 'daterange') {
            filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
            filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
            // console.log('Date From', filters[key].from);
            // console.log('Date To ', filters[key].to)
            // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
            //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
            // }
            // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })

            return;
          }
          if (Array.isArray(filters[key])) {
            let arrayIn: any = [];
            filters[key].forEach(field => {
              if (typeof field == 'object') {
                arrayIn.push(field.value);
              } else {
                arrayIn.push(field);
              }
            });
            filtersObject[clause].push({ [key]: { '$in': arrayIn } });
            // filtersObject[clause].push({ [key]: { '$in': filters[key] } });
          }
          else filtersObject[clause].push({ [key]: new RegExp(filters[key], 'gmi') })
        });
      }
      if (ObjectID.isValid(query)) _id = { _id: new ObjectID(query) }
      if (chunk) {
        if (sortBy && sortBy.name) {
          if (parseInt(sortBy.type) == 1) {
            //ASC
            Object.assign(obj, { [sortBy.name]: { "$gt": chunk } });
          } else {
            //DESC
            Object.assign(obj, { [sortBy.name]: { "$lt": chunk } });
          }
        } else {
          Object.assign(obj, { 'lasttouchedTime': { "$lt": chunk } });
        }
      }
      if (filtersObject[clause].length) Object.assign(obj, filtersObject);

      let encodedEmail = encodeURI(email);
      let encodedNsp = encodeURI(nsp);
      let solrQuery = 'select?fl=tid&df=Message&fq=nsp%3A%22' + encodedNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1';
      switch (canView) {
        case 'all':
          //Do Nothing
          obj.$and.push({ "_id": { $exists: true } });
          break;
        case 'assignedOnly':
          // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
          solrQuery = 'select?df=Message&fl=tid&fq=assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';
          break;
        case 'group':
          let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
          obj.$and.push({
            '$or': [
              { group: { '$in': groups } },
              { assigned_to: email },
              { "watchers": { $in: [email] } }
            ]
          });
          let groupQuery = '';
          groups.forEach(group => {
            groupQuery += 'group%3A%22' + encodeURI(group) + '%22%20OR%20'
          });
          solrQuery = 'select?df=Message&fl=tid&fq=' + groupQuery + 'assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';

          break;
        case 'team':

          let teamMembers = await TeamsModel.getTeamMembersAgainstAgent(nsp, email);
          // console.log(teamMembers);
          // Object.assign(obj, { $or : [ {"assigned_to": {$in: teamMembers} },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });

          let assignToQuery = '';
          teamMembers.forEach(agent => {
            assignToQuery += 'assigned_to%3A%22' + encodeURI(agent) + '%22%20OR%20'
          });
          solrQuery = 'select?df=Message&fl=tid&fq=' + assignToQuery + 'watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';
          break;
        default:
          break;
      }
      if (query) {
        if (!solrSearchEnabled) {
          $or = [
            { subject: new RegExp(query, 'gmi') },
            { from: new RegExp(query) },
            { ['visitor.name']: new RegExp(query, 'gmi') },
            { ['visitor.email']: new RegExp(query, 'gmi') },
            { clientID: new RegExp(query, 'gmi') }
          ]
        } else {
          $or = [
            { from: new RegExp(query) },
            { ['visitor.name']: new RegExp(query, 'gmi') },
            { ['visitor.email']: new RegExp(query, 'gmi') },
            { clientID: new RegExp(query, 'gmi') }
          ]
        }
        // if(process.env.NODE_ENV == 'production'){
        //     let ticketIDs = await this.getTicketIDsFromSolr(nsp, query, limit);
        //     // console.log(ticketIDs);
        //     if (ticketIDs.length) {
        //         let objectIdArray = ticketIDs.map(s => { return new ObjectId(s) });
        //         $or.push({ _id: { $in: objectIdArray } });
        //     }
        // }else{
        // let company = await Company.getCompany(nsp)[0];
        // console.log('Solr Search Enabled: ' + solrSearchEnabled);

        if (!solrSearchEnabled) {
          let tickets = await this.db.collection('ticketMessages').aggregate([
            {
              '$match': {
                nsp: nsp,
                $and: [
                  {
                    $text: {
                      $search: query
                    }
                  },
                  {
                    message: new RegExp(query)
                  }
                ]
              }
            }, {
              '$group': {
                '_id': '$nsp',
                'tids': {
                  '$addToSet': {
                    '$arrayElemAt': [
                      '$tid', 0
                    ]
                  }
                }
              }
            }
          ]).limit(1).toArray();

          if (tickets && tickets.length && tickets[0].tids.length) {
            // console.log(tickets[0].tids.length);
            // console.log(tickets[0].tids.map(id => {return new ObjectID(id)}));
            let objectIdArray = tickets[0].tids.map(s => { return new ObjectId(s) });
            $or.push({ _id: { $in: objectIdArray } });
            // console.log($or[4]);
          }
        } else {
          let ticketIDs: any = [];
          ticketIDs = await this.getTicketIDsFromSolr(solrQuery, 50);
          // console.log(ticketIDs);
          if (ticketIDs.length) {
            let objectIdArray = ticketIDs.map(s => { return new ObjectId(s) });
            $or.push({ _id: { $in: objectIdArray } });
          }
        }
      }
      if (_id) $or.push(_id);
      switch (canView) {
        case 'all':
          //Do Nothing
          obj.$and.push({ "_id": { $exists: true } });
          break;

        case 'assignedOnly':
          // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
          break;
        case 'group':
          let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
          obj.$and.push({
            '$or': [
              { group: { '$in': groups } },
              { assigned_to: email },
              { "watchers": { $in: [email] } }
            ]
          });
          break;
        case 'team':

          let teamMembers = await TeamsModel.getTeamMembersAgainstAgent(nsp, email);
          // console.log(teamMembers);

          obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
          break;
        default:
          break;
      }

      switch (assignType) {
        case 'assigned':
          if (!obj.$and) {
            Object.assign(obj, {
              $and: [
                {
                  assigned_to: {
                    $exists: true
                  }
                },
                {
                  assigned_to: {
                    $ne: ''
                  }
                }
              ]
            })
          } else {
            obj.$and.push({
              assigned_to: {
                $exists: true
              }
            });
            obj.$and.push({
              assigned_to: {
                $ne: ''
              }
            });
          }
          break;
        case 'unassigned':
          if (!obj.$or) {
            Object.assign(obj, {
              $or: [
                {
                  assigned_to: {
                    $exists: false
                  }
                },
                {
                  assigned_to: ''
                }
              ]
            });
          } else {
            obj.$or.push({
              assigned_to: {
                $exists: false
              }
            });
            obj.$or.push({
              assigned_to: ''
            });
          }
          break;
        default:
          break;
      }
      switch (groupAssignType) {
        case 'assigned':
          if (!obj.$and) {
            Object.assign(obj, {
              $and: [
                {
                  group: {
                    $exists: true
                  }
                },
                {
                  group: {
                    $ne: ''
                  }
                }
              ]
            })
          } else {
            obj.$and.push({
              group: {
                $exists: true
              }
            })
            obj.$and.push({
              group: {
                $ne: ''
              }
            })
          }

          break;
        case 'unassigned':
          if (!obj.$or) {
            Object.assign(obj, {
              $or: [
                {
                  group: {
                    $exists: false
                  }
                },
                {
                  group: ''
                }
              ]
            });
          } else {
            obj.$or.push({
              group: {
                $exists: false
              }
            });
            obj.$or.push({
              group: ''
            });
          }

          break;
        default:
          break;
      }
      switch (mergeType) {
        case 'yes':
          Object.assign(obj, {
            merged: true
          })
          break;
        case 'no':
          Object.assign(obj, {
            $or: [
              {
                merged: {
                  $exists: false
                }
              },
              {
                merged: false
              }
            ]
          });
          break;
        default:
          break;
      }
      // console.log('Getting More', obj);
      // if (query) Object.assign(obj, { '$or': $or });
      if (query) obj.$and.push({ '$or': $or });

      let sort: any;
      if (sortBy && sortBy.name) {
        sort = {
          [sortBy.name]: parseInt(sortBy.type)
        }
      }
      return await this.db.collection('tickets').aggregate([
        { "$match": obj },
        { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } },
        { "$limit": 50 }
      ]).toArray();


    } catch (error) {
      console.log(error);
      console.log('error in Get Messages');
    }
  }

  public static async getUnassignedTickets(nsp) {
    try {

      return this.collection.find({ nsp: nsp, $and: [{ $or: [{ assigned_to: { $exists: false } }, { assigned_to: { $eq: '' } }] }, { $or: [{ processing: false }, { processing: { $exists: false } }] }], state: 'OPEN' }, { fields: { _id: 1 } }).toArray();
    } catch (err) {
      console.log(err);
      console.log('Error in getting unassigned tickets');

    }
  }

  public static async getTickets(nsp: string, email: string, canView: string, filters: any, clause: string, query: string, sortBy: any, assignType: any, groupAssignType: any, mergeType: any, limit = undefined, solrSearchEnabled = false) {
    try {
      if (!clause) clause = "$and"
      let filtersObject = { [clause]: ([] as any) }
      let obj: any = {
        'nsp': nsp,
        '$and': []
      };
      let $or: any = [];
      let _id: any = undefined;
      // let ticketCount = 0;
      if (filters) {
        Object.keys(filters).map(key => {
          if (key == 'daterange') {
            filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
            filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
            // console.log('Date From', new Date(filters[key].from).toISOString());
            // console.log('Date To ', new Date(filters[key].to).toISOString());
            // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
            //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
            // }
            // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })

            return;
          }
          if (Array.isArray(filters[key])) {
            let arrayIn: any = [];
            filters[key].forEach(field => {
              if (typeof field == 'object') {
                arrayIn.push(field.value);
              } else {
                arrayIn.push(field);
              }
            });
            filtersObject[clause].push({ [key]: { '$in': arrayIn } });
          }
          else filtersObject[clause].push({ [key]: new RegExp(filters[key], 'gmi') })
        });
      }
      if (ObjectID.isValid(query)) _id = { _id: new ObjectID(query) }
      if (filtersObject[clause].length) Object.assign(obj, filtersObject);

      let encodedEmail = encodeURI(email);
      let encodedNsp = encodeURI(nsp);
      let solrQuery = 'select?fl=tid&df=Message&fq=nsp%3A%22' + encodedNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1';
      // console.log(email + ':' + canView);
      switch (canView) {
        case 'all':
          //Do Nothing
          obj.$and.push({ "_id": { $exists: true } });
          break;
        case 'assignedOnly':
          // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
          solrQuery = 'select?df=Message&fl=tid&fq=assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';
          break;
        case 'group':
          let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
          obj.$and.push({
            '$or': [
              { group: { '$in': groups } },
              { assigned_to: email },
              { "watchers": { $in: [email] } }
            ]
          });
          let groupQuery = '';
          groups.forEach(group => {
            groupQuery += 'group%3A%22' + group + '%22%20OR%20'
          });
          solrQuery = 'select?df=Message&fl=tid&fq=' + groupQuery + 'assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';

          break;
        case 'team':

          let teamMembers = await TeamsModel.getTeamMembersAgainstAgent(nsp, email);
          // console.log(teamMembers);
          // Object.assign(obj, { $or : [ {"assigned_to": {$in: teamMembers} },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });

          let assignToQuery = '';
          teamMembers.forEach(agent => {
            assignToQuery += 'assigned_to%3A%22' + encodeURI(agent) + '%22%20OR%20'
          });
          solrQuery = 'select?df=Message&fl=tid&fq=' + assignToQuery + 'watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query +'&sort=dateTime%20desc%2C%20id%20asc&wt=json';
          break;
        default:
          break;
      }
      if (query) {
        query = query.replace("\\", '');
        if (!solrSearchEnabled) {
          $or = [
            { subject: new RegExp(query, 'gmi') },
            { from: new RegExp(query) },
            { ['visitor.name']: new RegExp(query, 'gmi') },
            { ['visitor.email']: new RegExp(query, 'gmi') },
            { clientID: new RegExp(query, 'gmi') }
          ]
        } else {
          $or = [
            { from: new RegExp(query) },
            { ['visitor.name']: new RegExp(query, 'gmi') },
            { ['visitor.email']: new RegExp(query, 'gmi') },
            { clientID: new RegExp(query, 'gmi') }
          ]
        }
        // if(process.env.NODE_ENV == 'production'){
        //     let ticketIDs = await this.getTicketIDsFromSolr(nsp, query, limit);
        //     // console.log(ticketIDs);
        //     if (ticketIDs.length) {
        //         let objectIdArray = ticketIDs.map(s => { return new ObjectId(s) });
        //         $or.push({ _id: { $in: objectIdArray } });
        //     }
        // }else{
        // let company = await Company.getCompany(nsp)[0];
        // console.log('Solr Search Enabled: ' + solrSearchEnabled);
        // console.log('Solr Query: ' + solrQuery);

        if (!solrSearchEnabled) {
          let tickets = await this.db.collection('ticketMessages').aggregate([
            {
              '$match': {
                nsp: nsp,
                $and: [
                  {
                    $text: {
                      $search: query
                    }
                  },
                  {
                    message: new RegExp(query)
                  }
                ]
              }
            }, {
              '$group': {
                '_id': '$nsp',
                'tids': {
                  '$addToSet': {
                    '$arrayElemAt': [
                      '$tid', 0
                    ]
                  }
                }
              }
            }
          ]).limit(1).toArray();

          if (tickets && tickets.length && tickets[0].tids.length) {
            // console.log(tickets[0].tids.length);
            // console.log(tickets[0].tids.map(id => {return new ObjectID(id)}));
            let objectIdArray = tickets[0].tids.map(s => { return new ObjectId(s) });
            $or.push({ _id: { $in: objectIdArray } });
            // console.log($or[4]);
          }
        } else {
          let ticketIDs: any = [];
          ticketIDs = await this.getTicketIDsFromSolr(solrQuery, limit);
          // console.log(ticketIDs);
          if (ticketIDs.length) {
            let objectIdArray = ticketIDs.map(s => { return new ObjectId(s) });
            $or.push({ _id: { $in: objectIdArray } });
          }
        }
      }
      // }
      if (_id) $or.push(_id);
      switch (assignType) {
        case 'assigned':
          if (!obj.$and) {
            Object.assign(obj, {
              $and: [
                {
                  assigned_to: {
                    $exists: true
                  }
                },
                {
                  assigned_to: {
                    $ne: ''
                  }
                }
              ]
            })
          } else {
            obj.$and.push({
              assigned_to: {
                $exists: true
              }
            });
            obj.$and.push({
              assigned_to: {
                $ne: ''
              }
            });
          }
          break;
        case 'unassigned':
          if (!obj.$or) {
            Object.assign(obj, {
              $or: [
                {
                  assigned_to: {
                    $exists: false
                  }
                },
                {
                  assigned_to: ''
                }
              ]
            });
          } else {
            obj.$or.push({
              assigned_to: {
                $exists: false
              }
            });
            obj.$or.push({
              assigned_to: ''
            });
          }
          break;
        default:
          break;
      }
      switch (groupAssignType) {
        case 'assigned':
          if (!obj.$and) {
            Object.assign(obj, {
              $and: [
                {
                  group: {
                    $exists: true
                  }
                },
                {
                  group: {
                    $ne: ''
                  }
                }
              ]
            })
          } else {
            obj.$and.push({
              group: {
                $exists: true
              }
            })
            obj.$and.push({
              group: {
                $ne: ''
              }
            })
          }

          break;
        case 'unassigned':
          if (!obj.$or) {
            Object.assign(obj, {
              $or: [
                {
                  group: {
                    $exists: false
                  }
                },
                {
                  group: ''
                }
              ]
            });
          } else {
            obj.$or.push({
              group: {
                $exists: false
              }
            });
            obj.$or.push({
              group: ''
            });
          }

          break;
        default:
          break;
      }
      switch (mergeType) {
        case 'yes':
          Object.assign(obj, {
            merged: true
          })
          break;
        case 'no':
          Object.assign(obj, {
            $or: [
              {
                merged: {
                  $exists: false
                }
              },
              {
                merged: false
              }
            ]
          });
          break;
        default:
          break;
      }
      // if (query) Object.assign(obj, { '$or': $or })
      if (query) obj.$and.push({ '$or': $or });

      let sort: any;
      if (sortBy && sortBy.name) {
        sort = {
          [sortBy.name]: parseInt(sortBy.type)
        }
      }
      // console.log('Object', JSON.stringify(obj));
      return await Promise.all([
        this.db.collection('tickets').aggregate([
          { "$match": obj },
          { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } },
          { "$limit": (limit) ? limit : 50 }
        ]).toArray(),
        this.db.collection('tickets').aggregate([
          { "$match": obj },
          { "$group": { _id: '$state', count: { "$sum": 1 } } },
          { "$project": { _id: 0, state: "$_id", count: 1 } }
        ]).toArray()
      ]);
    } catch (error) {
      console.log(error);
      console.log('error in Get Tickets');
    }
  }

  public static async getTicketIDsFromSolr(solrQuery, limit) {
    try {
      let rows = 2147483647;
      if (limit < 6) {
        rows = limit
      }
      // let encodeNsp = encodeURI(nsp);
      let url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/' + solrQuery + '&rows=' + rows;
      // console.log(url);
      let ticketIDs: Array<string> = [];
      var resp = await request.get(url, {});
      resp = JSON.parse(resp);
      // console.log(resp);
      if (resp) {
        resp.grouped.tid.groups.map(e => {
          e.doclist.docs.map(element => {
            ticketIDs.push(element.tid);
          });
        });
      }
      return ticketIDs;
    } catch (err) {
      // console.log(err);
      console.log('Error in getting tickets from solr');
      return [];
    }
  }

  public static async getTicketsFromSolr(tid) {
    try {
      // let tid = '5d95faed728de83055078271'
      let url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/select?q=tid%3A' + tid + '&rows=2147483647';
      let resp = await request.get(url);
      return resp;
    } catch (err) {
      console.log('Error in gettings tickets from solr');
      console.log(err);

    }
  }

  public static async updateTicketSolr(tickets) {
    try {
      let ticketsData = Array.isArray(tickets) ? tickets : [tickets];
      //    console.log(tickets)
      ticketsData.forEach(async ticket => {
        let response = await this.getTicketsFromSolr(ticket._id);
        let result = JSON.parse(response);

        if (result.response && result.response.docs.length) {
          // console.log(result);
          result.response.docs.map(async solrTicket => {
            let body = solrTicket;
            body.assigned_to = ticket.assigned_to;
            body.group = ticket.group;
            body.watchers = ticket.watchers;
            delete body._version_;
            // console.log(body);
            let url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/update?stream.body=[' + JSON.stringify(body) + ']&commit=true';
            // console.log(url)
            await request.get(url);
          })
        }
      })
    } catch (err) {
      console.log('Error in updating ticket in solr');
      console.log(err);

    }
  }

  public static async getTicketssByIDs(IDs: Array<string>) {
    let data: Array<ObjectId> = [];
    IDs.forEach(id => {
      data.push(new ObjectId(id));
    });
    return await this.collection.find({ _id: { '$in': data } }).toArray();
  }
  public static async getTicketssByIDsAndProcess(id) {

    return await this.collection.findOneAndUpdate({ _id: new ObjectID(id), $or: [{ processing: false }, { processing: { $exists: false } }] }, { $set: { 'processing': true } }, { returnOriginal: false, upsert: false });
  }

  public static async temp(nsp, email, canview: string, filters: any, chunk: string) {
    let matchObject = {}
    Object.keys(filters).map(key => {
      if (Array.isArray(filters[key])) {
        matchObject[key] = { '$in': filters[key] }
      }
      else matchObject[key] = filters[key]
    });

    Object.assign(matchObject, { 'nsp': nsp });

    // console.log(JSON.stringify(matchObject));
    // Object.assign(matchObject, { 'lasttouchedTime': { "$lt": chunk } });

    return await this.db.collection('tickets').aggregate([
      { "$match": { $or: [matchObject] } },
      { "$sort": { "lasttouchedTime": -1 } },
      { "$limit": 50 }
    ]).toArray();

  }

  public static async getTicketsCount(nsp: string, email, canView, filters: any, query: string, clause: string, assignType: any, groupAssignType: any, mergeType: any) {
    try {
      if (!clause) clause = "$and";
      let filtersObject = { [clause]: ([] as any) }
      let obj: any = { 'nsp': nsp, '$and': [] };
      let $or: any = [];
      let _id: any = undefined;
      if (filters) {
        Object.keys(filters).map(key => {
          if (key == 'daterange') {
            filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
            filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
            // console.log('Date From', filters[key].from);
            // console.log('Date To ', filters[key].to)
            // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
            //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
            // }
            // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })

            return;
          }
          if (Array.isArray(filters[key])) {
            filtersObject[clause].push({ [key]: { '$in': filters[key] } });
          }
          else filtersObject[clause].push({ [key]: filters[key] })
        });
      }
      if (ObjectID.isValid(query)) _id = { _id: new ObjectID(query) }
      if (filtersObject[clause].length) Object.assign(obj, filtersObject)
      if (query) {

        $or = [
          { subject: new RegExp(query, 'gmi') },
          { from: new RegExp(query, 'gmi') },
          { ['visitor.name']: new RegExp(query, 'gmi') },
          { ['visitor.email']: new RegExp(query, 'gmi') },
          { clientID: new RegExp(query, 'gmi') }
        ]
        let tickets = await this.db.collection('ticketMessages').aggregate([
          {
            '$match': {
              nsp: nsp,
              $and: [
                {
                  $text: {
                    $search: query
                  }
                },
                {
                  message: new RegExp(query)
                }
              ]
            }
          }, {
            '$group': {
              '_id': '$nsp',
              'tids': {
                '$addToSet': {
                  '$arrayElemAt': [
                    '$tid', 0
                  ]
                }
              }
            }
          }
        ]).limit(1).toArray();
        if (tickets && tickets.length && tickets[0].tids.length) {
          // console.log(tickets[0].tids.length);
          // console.log(tickets[0].tids.map(id => {return new ObjectID(id)}));
          let objectIdArray = tickets[0].tids.map(s => { return new ObjectId(s) });
          $or.push({ _id: { $in: objectIdArray } });
          // console.log($or[4]);
        }
      }
      if (_id) $or.push(_id);
      switch (canView) {
        case 'all':
          //Do Nothing
          obj.$and.push({ "_id": { $exists: true } });
          break;

        case 'assignedOnly':
          // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
          obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
          break;
        case 'group':
          let groups = await TicketGroupsModel.getGroupsbyAdmin(nsp, email);
          obj.$and.push({
            '$or': [
              { group: { '$in': groups } },
              { assigned_to: email },
              { "watchers": { $in: [email] } }
            ]
          });
          break;
        case 'team':

          let teamMembers = await TeamsModel.getTeamMembersAgainstAgent(nsp, email);
          // console.log(teamMembers);

          obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
          break;
        default:
          break;
      }
      switch (assignType) {
        case 'assigned':
          Object.assign(obj, {
            assigned_to: {
              $exists: true
            }
          })
          break;
        case 'unassigned':
          Object.assign(obj, {
            $or: [
              {
                assigned_to: {
                  $exists: false
                }
              },
              {
                assigned_to: ''
              }
            ]
          });
          break;
        default:
          break;
      }
      switch (groupAssignType) {
        case 'assigned':
          Object.assign(obj, {
            $and: [
              {
                group: {
                  $exists: true
                }
              },
              {
                group: {
                  $ne: ''
                }
              }
            ]
          })
          break;
        case 'unassigned':
          Object.assign(obj, {
            $or: [
              {
                group: {
                  $exists: false
                }
              },
              {
                group: ''
              }
            ]
          });
          break;
        default:
          break;
      }
      switch (mergeType) {
        case 'yes':
          Object.assign(obj, {
            merged: true
          })
          break;
        case 'no':
          Object.assign(obj, {
            $or: [
              {
                merged: {
                  $exists: false
                }
              },
              {
                merged: false
              }
            ]
          });
          break;
        default:
          break;
      }
      // if (query) Object.assign(obj, { '$or': $or })
      if (query) obj.$and.push({ '$or': $or });
      return this.collection.aggregate([
        { "$match": obj },
        { $group: { _id: '$state', count: { "$sum": 1 } } },
        { $project: { _id: 0, state: "$_id", count: 1 } }
      ]).toArray()


      //return this.collection.find({ nsp: nsp }).toArray();
    }
    catch (error) {
      console.log(error);
      console.log('error in Get Tickets Count');
    }
  }


  public static async getNSP(tid: string) {
    try {
      return this.collection.find({ tid: tid }, { fields: { nsp: 1 } }).limit(1).toArray();
    } catch (error) {
      console.log(error);
      console.log('Error in Get NSP');
    }
  }
  public static async getMessages(tid: Array<any>) {
    //console.log('Getting Ticket Messages');

    // console.log(tid);
    let objectIdArray = tid.map(s => { return new ObjectId(s) });
    // console.log('Getting Merged Messaged');

    // console.log(tid);
    try {
      let messageCollection = this.db.collection('ticketMessages');


      let result = messageCollection.find({ tid: { $in: objectIdArray } }).toArray();

      return result;


    } catch (error) {
      console.log(error);
      console.log('error in Getting Ticket Messages');
    }

  }
  public static async getMesages(tid: Array<string>) {
    try {
      let objectIdArray = tid.map(s => { return new ObjectId(s) });
      let messageCollection = this.db.collection('ticketMessages');

      return messageCollection.find({ tid: { $in: objectIdArray } }).toArray();

    } catch (error) {
      console.log(error);
      console.log('error in Getting Ticket Messages Multi');
    }
  }

  public static async InsertMessage(message: any, lastReply : any  = undefined) {
    message.tid = message.tid.map(tid => { return new ObjectID(tid) });
    let messageCollection = this.db.collection('ticketMessages');
    let data = await messageCollection.insertOne(message);
    if (this.collection && lastReply) await this.collection.updateOne({ _id: message.tid[0] }, { $set: { lastReply: lastReply } });

    if (process.env.NODE_ENV == 'production') {
      console.log('Sending Message to SOLR Queue');
      let packet: SQSPacket = {
        action: 'newTicketMessage',
        body: {
          "tid": message.tid[0],
          "msg": message.message,
          "dateTime": message.datetime,
          "nsp": message.nsp
        }
      }
      await __biZZC_SQS.SendMessageToSOLR(packet, 'ticket');
    }
    return data;
  }

  public static async InsertMessages(messages: any) {
    let messageCollection = this.db.collection('ticketMessages');
    let data = await messageCollection.insertMany(messages);
    return data;
  }


  public static async DeMergeTickets(nsp: string, primaryReference: string | ObjectId, SecondaryReference: string | ObjectId, ticketlog: { primaryTicketLog: any, secondaryTicketLog: any }) {
    try {
      let returingObj = { primaryTicket: (undefined as any), secondaryTicket: (undefined as any) };
      primaryReference = new ObjectId(primaryReference);
      SecondaryReference = new ObjectId(SecondaryReference);
      let updatedPrimary: FindAndModifyWriteOpResultObject<any> | undefined = undefined;
      let updatedSecondary: FindAndModifyWriteOpResultObject<any> | undefined = undefined;



      /**
       * @Work
       * 1. Pull Reference
       * @Verify_Cases_SecondaryTicket
       * 1. if Secondary ticket doesn't MergeTicketIDs && doesn't have References)
       *      a. resume state
       *      b. set merge and isprimary to false
       *
       * 2. if Secondary ticket doesn't have MergeTicketIDs && have References
       *      a. do nothing
       * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
       *      a. resume state
       * 4. if Secondary ticket have MergeTicketIDs && have References
       *      a. do nothing
       *
       * @Work
       * 1. Pull MergeTicketIDs
       * @Verify_Cases_Primary_Ticket
       * 1. if Primary ticket doesn't have MergeTicketIDs && doesn't have References)
       *      b. set merge and isprimary to false
       *
       * 2. if Primary ticket doesn't have MergeTicketIDs && have References
       *      a. set isPrimary to false
       * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
       *      a. do nothing
       * 4. if Secondary ticket have MergeTicketIDs && have References
       *      a. do nothing
       */


      updatedSecondary = await this.collection.findOneAndUpdate(
        {
          nsp: nsp,
          _id: { $in: [SecondaryReference] }

        },
        {
          $pull: { references: { $in: [primaryReference] } },
        },
        { returnOriginal: false, upsert: false }
      );
      //#region Updating Secondary Ticket
      if (updatedSecondary && updatedSecondary.value) {

        /**
        * @case_1
        * if Secondary ticket doesn't have MergeTicketIDs && doesn't have References
        *       a. resume state
        *       b. set merge and isprimary to false
        */
        if (!updatedSecondary.value.mergedTicketIds || !updatedSecondary.value.mergedTicketIds.length) {
          if (!updatedSecondary.value.references || !updatedSecondary.value.references.length) {
            if (updatedSecondary.value.preservedState) updatedSecondary.value.state = updatedSecondary.value.preservedState;
            let newlog = JSON.parse(JSON.stringify(ticketlog.secondaryTicketLog)) as TicketLogSchema;
            newlog.title = "Resumed State to " + updatedSecondary.value.state + "from " + updatedSecondary.value.preservedState;
            updatedSecondary = await this.collection.findOneAndUpdate(
              {
                nsp: nsp,
                _id: { $in: [SecondaryReference] }

              },
              {
                $set: { state: updatedSecondary.value.state, merged: false, isPrimary: false },
                $unset: { preservedState: 1 },
                $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog, newlog] } }
              },
              { returnOriginal: false, upsert: false }
            );
          }
        }
        /**
         * @case_3
         * if Secondary ticket have MergeTicketIDs && doesn't have References
         *       a. resume state
         */
        else if (updatedSecondary.value.mergedTicketIds && updatedSecondary.value.mergedTicketIds.length) {
          if (!updatedSecondary.value.references || !updatedSecondary.value.references.length) {
            let newlog = JSON.parse(JSON.stringify(ticketlog.secondaryTicketLog)) as TicketLogSchema;
            newlog.title = "Resumed State to " + updatedSecondary.value.state + "from " + updatedSecondary.value.preservedState;
            updatedSecondary.value.state = updatedSecondary.value.preservedState;
            updatedSecondary = await this.collection.findOneAndUpdate(
              {
                nsp: nsp,
                _id: { $in: [SecondaryReference] }

              },
              {
                $set: { state: updatedSecondary.value.state },
                $unset: { preservedState: 1 },
                $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog, newlog] } }
              },
              { returnOriginal: false, upsert: false }
            );
          }
        } else {
          updatedSecondary = await this.collection.findOneAndUpdate(
            {
              nsp: nsp,
              _id: { $in: [SecondaryReference] }

            },
            {
              $set: { state: updatedSecondary.value.state },
              $unset: { preservedState: 1 },
              $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog] } }
            },
            { returnOriginal: false, upsert: false }
          );
        }

      }
      //#endregion


      //#region Updating Primary Ticket
      if (updatedSecondary && updatedSecondary.value) {

        /**
        * @Verify_Cases_Primary_Ticket
        * 1. if Primary ticket doesn't have MergeTicketIDs && doesn't have References)
        *       a. set merged to false
        *       b. isprimary to false
        *
        * 2. if Primary ticket doesn't have MergeTicketIDs && have References
        *      a. set isPrimary to false
        * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
        *      a. do nothing
        * 4. if Secondary ticket have MergeTicketIDs && have References
        *      a. do nothing
        */
        updatedPrimary = await this.collection.findOneAndUpdate(
          { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
          {
            $pull: {
              references: { $in: [SecondaryReference] },
              mergedTicketIds: { _id: { $in: [SecondaryReference] } }
            }
          }, { returnOriginal: false, upsert: false }
        )


        if (updatedPrimary && updatedPrimary.value) {

          if (!updatedPrimary.value.mergedTicketIds || !updatedPrimary.value.mergedTicketIds.length) {
            /**
            * @Case
            * 1.if Primary ticket doesn't have MergeTicketIDs && doesn't have References)
            *      a. set merged to false
            *      b. isprimary to false
            */
            if (!updatedPrimary.value.references || !updatedPrimary.value.references.length) {
              updatedPrimary = await this.collection.findOneAndUpdate(
                { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
                {
                  $set: { isPrimary: false, merged: false },
                  $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }

                }, { returnOriginal: false, upsert: false }
              )

            }
            /**
            * @Case
            * 2.if Primary ticket doesn't have MergeTicketIDs && have References
            *      b. isprimary to false
            */
            else if (updatedPrimary.value.references && updatedPrimary.value.references.length) {

              updatedPrimary = await this.collection.findOneAndUpdate(
                { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
                {
                  $set: { isPrimary: false },
                  $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }

                }, { returnOriginal: false, upsert: false }
              )
            }
          } else {
            updatedPrimary = await this.collection.findOneAndUpdate(
              { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
              {
                $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }

              }, { returnOriginal: false, upsert: false }
            )
          }

        }


        if (updatedPrimary && updatedPrimary.value) {
          returingObj.primaryTicket = updatedPrimary.value;
          returingObj.secondaryTicket = updatedSecondary.value;
        }
      }
      //#endregion
      return returingObj;


    } catch (error) {
      console.log(error);
      console.log('error in MergeTickets');
      return { primaryTicket: undefined, secondaryTicket: undefined }
    }
  }

  public static async MergeTickets(nsp: string, mergeIds: any, ticketlog: { primaryTicketLog: any, secondaryTicketLog: any }, seondaryTicketDetails: Array<any>, primaryReference: any, mergedTicketsDetails?: any) {
    try {
      let returingObj = { primaryTicket: (undefined as any), secondaryTicket: ([] as any) }
      let secondaryTicketIds: Array<ObjectID> = []
      let updatedPrimary: FindAndModifyWriteOpResultObject<any> | undefined = undefined;
      let updatedSecondaries: UpdateWriteOpResult | undefined = undefined;
      let objectIdArray = mergeIds.map(s => new ObjectId(s));
      let objectIDArrayWithoutPrimaryID: Array<ObjectId> = objectIdArray.filter(id => { return (id != primaryReference) });
      seondaryTicketDetails = seondaryTicketDetails.map(ticket => { ticket._id = new ObjectId(ticket._id); return ticket });
      seondaryTicketDetails.map(ticket => { secondaryTicketIds.push(new ObjectId(ticket._id)); return ticket });

      /**
       * @Work
       * 1. Set Reference and Merged Boolean on All Secondary Tickets and Set Closed To All Except Primary Reference
       * 2. Set secondary References on Primary Ticket && Merged To True && PrimaryReference && isPrimary True
       * 3. Find All Updated Secondary Tickets
       * 4. Compose Object and return returningObj
       */
      updatedSecondaries = await this.collection.updateMany(
        {
          nsp: nsp,
          $and: [
            { _id: { $in: objectIdArray } },
            { _id: { $nin: [new ObjectId(primaryReference)] } },
            { state: { $ne: 'CLOSED' } }
          ]

        },
        {
          $rename: { "state": "preservedState" },
        },
        { upsert: false }
      );

      updatedSecondaries = await this.collection.updateMany(
        {
          nsp: nsp,
          $and: [
            { _id: { $in: objectIdArray } },
            { _id: { $nin: [new ObjectId(primaryReference)] } }
          ]

        },
        {
          $set:
          {
            merged: true,
            state: 'CLOSED',
            primaryTicketId: primaryReference
          },
          $addToSet: { references: new ObjectID(primaryReference) },
          $push: { ticketlog: ticketlog.secondaryTicketLog }
        },
        { upsert: false }
      );
      if (updatedSecondaries && updatedSecondaries.modifiedCount == objectIDArrayWithoutPrimaryID.length) {
        updatedPrimary = await this.collection.findOneAndUpdate(
          { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
          {
            $pull: { "mergedTicketIds": { _id: { $in: secondaryTicketIds } } },
          }, { returnOriginal: false, upsert: false }
        )
        updatedPrimary = await this.collection.findOneAndUpdate(
          { _id: { $in: [new ObjectId(primaryReference)] }, nsp: nsp },
          {
            $set: {
              merged: true,
              lasttouchedTime: new Date().toISOString(),
              isPrimary: true,
              mergedTicketsDetails: mergedTicketsDetails
            },
            $addToSet: { references: { $each: secondaryTicketIds } },
            $push: { ticketlog: ticketlog.primaryTicketLog, mergedTicketIds: { $each: seondaryTicketDetails } }
          }, { returnOriginal: false, upsert: false }
        )

        if (updatedPrimary && updatedPrimary.value) {
          let secondaryTickets = await this.collection.find({ _id: { $in: objectIDArrayWithoutPrimaryID } }).limit(objectIDArrayWithoutPrimaryID.length).toArray();
          returingObj.primaryTicket = updatedPrimary.value;
          returingObj.secondaryTicket = secondaryTickets;
        }
      }
      return returingObj;


    } catch (error) {
      console.log(error);
      console.log('error in MergeTickets');
      return { primaryTicket: undefined, secondaryTicket: ([] as any) }
    }
  }

  public static async AppendToPrimaryId(merged: boolean, mergeIds: any, Primaryid: any, nsp: string, ticketlog: TicketLogSchema | any, primaryReference?: any) {
    try {
      let objectIdArray = mergeIds.map(s => new ObjectId(s));
      // console.log(objectIdArray);
      // console.log(Primaryid);


      return this.collection.findOneAndUpdate(
        { _id: new ObjectId(Primaryid), nsp: nsp },
        {
          $set:
          {
            primaryReference: new ObjectId(Primaryid),
            merged: merged,
            lasttouchedTime: new Date().toISOString(),
            mergedTicketIds: objectIdArray
          },
          $push: { ticketlog: ticketlog }
        },
        { returnOriginal: false, upsert: false }
      );


    } catch (error) {
      console.log(error);
      console.log('error in adding merged ticket Ids');
    }
  }

  public static MatchSubject(ticket: TicketSchema, operator: any, value: any) {
    let regexSubject: Array<any> = [];

    regexSubject.push({ operator: operator, keywords: value });
    let countMatchedKeywords = 0;
    let matched_subject: Array<any> = [];
    let regex: RegExp;
    regexSubject.map(element => {
      countMatchedKeywords = 0;
      element.keywords.map(keyword => {
        // switch (element.operator) {
        //     case 'CONTAIN':
        //         regex = new RegExp("\\b" + keyword + "\\b", "gmi");
        //         return countMatchedKeywords++;
        //     case 'DOESNOTCONTAIN':

        //         return countMatchedKeywords++;
        //     case 'STARTSWITH':
        //         regex = new RegExp('^' + keyword), "gmi";
        //         return countMatchedKeywords++;
        //     case 'ENDSWITH':
        //         regex = new RegExp(keyword + '$', " gmi");
        //         return countMatchedKeywords++;
        // }
        if (element.operator == "CONTAIN" && ticket.subject && ticket.subject.toLowerCase().includes(keyword)) {
          return countMatchedKeywords++;
        }
        else if (element.operator == "DOESNOTCONTAIN" && ticket.subject && !ticket.subject.toLowerCase().includes(keyword)) {
          return countMatchedKeywords++;
        }
        else if (element.operator == "STARTSWITH" && ticket.subject && ticket.subject.toLowerCase().startsWith(keyword)) {
          return countMatchedKeywords++;
        }
        else if (element.operator == "ENDSWITH" && ticket.subject && ticket.subject.toLowerCase().endsWith(keyword)) {
          return countMatchedKeywords++;
        }
        else {
          return countMatchedKeywords;
        }
      });
      return matched_subject.push({
        operator: element.operator,
        count: countMatchedKeywords,
      });
    })
    return ({ matchedSubjectCount: matched_subject, matchedboolean: (countMatchedKeywords > 0) ? true : false })
  }

  public static MatchSource(ticket: TicketSchema, operator: any, value: any) {
    let regexSource: Array<any> = [];
    regexSource.push({
      operator: operator,
      sources: value

    });
    let countMatchedSources = 0;
    let matched_source: Array<any> = [];
    regexSource.map(element => {
      countMatchedSources = 0;
      element.sources.map(source => {
        if (element.operator == "IS" && ticket.source && ticket.source.toLowerCase() == source.toLowerCase()) {
          return countMatchedSources++;
        }
        else if (element.operator == "ISNOT" && ticket.source && ticket.source.toLowerCase() != source.toLowerCase()) {
          return countMatchedSources++;
        }

        else {
          return countMatchedSources;
        }
      });
      return matched_source.push({
        operator: element.operator,
        count: countMatchedSources
      });
    })
    return ({ matchedSourceCount: matched_source, matchedboolean: (countMatchedSources > 0) ? true : false })
  }



  public static async GetRulesets(ticket: TicketSchema): Promise<Array<RuleSetSchema>> {
    try {
      let rules = await this.db.collection('ruleSets').find({ nsp: ticket.nsp, isActive: true }).toArray();
      if (rules.length) return rules as Array<RuleSetSchema>
      else return [];

    } catch (error) {
      console.log(error);
      console.log('error in Applying Rulesets');
      return [];
    }

  }

  public static async FindBestAgentTicketInGroup(groupName, ticket): Promise<TicketSchema | undefined> {

    try {

      //assign agent
      let count = 0;
      let bestAgent = '';
      // let position = -1;
      let groups = await this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray();

      groups[0].agent_list.filter(a => !a.excluded).map((agent, index) => {
        if (index == 0) {
          count = agent.count;
          bestAgent = agent.email;
          // position = index;
          return;
        }
        else {
          if (agent.count < count) {
            bestAgent = agent.email;
            count = agent.count;
            // position = index;
          }
        }
      });

      if (bestAgent) {
        //increment count of agent assigned ticket
        ticket.assigned_to = bestAgent;
        ticket.first_assigned_time = new Date().toISOString();
        // groups[0].agent_list[position].count++;
        let logSchema: TicketLogSchema = {
          title: 'assigned to',
          status: ticket.assigned_to,
          updated_by: 'Group Automation',
          user_type: 'Group Automation',
          time_stamp: new Date().toISOString()
        }
        ticket.ticketlog.push(logSchema);

        await this.db.collection('ticketgroups').findOneAndUpdate(
          { nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent },
          { $inc: { [`agent_list.$.count`]: 1 } }
        )


      }
      return ticket

    } catch (error) {
      console.log(error);
      console.log('Error in Finding BEst AGent Ticket');
      return undefined;
    }

  }
  public static async FindBestAvailableAgentTicketInGroup(groupName, ticket): Promise<TicketSchema | undefined> {

    try {

      //assign agent
      let count = 0;
      let bestAgent = '';
      // let position = -1;
      let groups = await this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray();


      if (groups && groups.length) {
        let onlineAgents = await SessionManager.getAllLiveAgentsByEmails(ticket.nsp, groups[0].agent_list.map(a => a.email));
        // console.log(onlineAgents);

        if (onlineAgents && onlineAgents.length) {
          let filteredAgents: any = [];
          onlineAgents.map(agent => {
            filteredAgents.push({
              email: agent.email,
              count: groups[0].agent_list.filter(a => a.email == agent.email)[0].count,
              isAdmin: groups[0].agent_list.filter(a => a.email == agent.email)[0].isAdmin,
              excluded: groups[0].agent_list.filter(a => a.email == agent.email)[0].excluded
            })
          });
          groups[0].agent_list = filteredAgents;
          // if(filteredAgents.length){
          //     groups[0].agent_list = filteredAgents;
          // }
        } else {
          groups[0].agent_list = [];
        }
        groups[0].agent_list.filter(a => !a.excluded).map((agent, index) => {
          if (index == 0) {
            count = agent.count;
            bestAgent = agent.email;
            // position = index;
            return;
          }
          else {
            if (agent.count < count) {
              bestAgent = agent.email;
              count = agent.count;
              // position = index;
            }
          }
        })
      }

      if (bestAgent) {
        //increment count of agent assigned ticket
        ticket.assigned_to = bestAgent;
        ticket.first_assigned_time = new Date().toISOString();
        // groups[0].agent_list[position].count++;
        let logSchema: TicketLogSchema = {
          title: 'assigned to',
          status: ticket.assigned_to,
          updated_by: 'Group Automation',
          user_type: 'Group Automation',
          time_stamp: new Date().toISOString()
        }
        ticket.ticketlog.push(logSchema);

        await this.db.collection('ticketgroups').findOneAndUpdate(
          { nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent },
          { $inc: { [`agent_list.$.count`]: 1 } }
        )
      }
      return ticket
    } catch (error) {
      console.log(error);
      console.log('Error in Finding BEst AGent Ticket');
      return undefined;
    }

  }

  public static CheckPrerequisites(policy, ticket: any): [] {
    try {
      /**
       Check if policy containing applyTo contains in ticket as well, then return policy's data.
      */
      let matchedArr = new Array().fill(false);
      let returningData: any = Array();
      policy.policyApplyTo.map((applyTo, ind) => {
        switch (applyTo.name) {
          case 'group':
            if (applyTo.value.includes(ticket.group) > -1) {
              console.log("yes group matched");
              matchedArr[ind] = true;
            }
            break;
          case 'state':
            if (applyTo.value.includes(ticket.state) > -1) {
              console.log("yes state matched");
              matchedArr[ind] = true;
            }
            break;
          case 'source':
            if (applyTo.value.includes(ticket.source) > -1) {
              console.log("yes source matched");
              matchedArr[ind] = true;
            }
            break;
        }
      });
      console.log("matched arr", matchedArr);

      if (matchedArr.every(data => data === true)) {
        console.log("yes all matched!");
        console.log("return value now!");

        let data;
        data = {
          policyName: policy.policyName,
          reminderResolution: policy.reminderResolution,
          reminderResponse: policy.reminderResponse,
          violationResolution: policy.violationResolution,
          violationResponse: policy.violationResponse,
          slaTarget: policy.policyTarget
        };
        returningData.push(data)
        return returningData;
      }
      else {
        return [];
      }
    } catch (err) {
      console.log(err);
      console.log('error in Applying policies');
      return [];
    }
  }

  public static async getTicketBySBTVisitorSpecialCase(nsp: any, datetime, visitorEmail, group) {
    try {

      return await this.collection.aggregate([
        {
          $match: {
            nsp: nsp,
            sbtVisitor: visitorEmail,
            group: group,
            datetime: { $gt: datetime }
          }
        },
        {
          $sort: {
            _id: -1
          }
        }


      ]).toArray();
    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
      return [];
    }
  }
  public static async GetAgentInRoundRobin(groupName, ticket): Promise<TicketSchema | undefined> {
    try {
      if (this.db) {

        let count = 0;
        let bestAgent = '';
        // let position = -1;
        let groups = await this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray();

        groups[0].agent_list.filter(a => !a.excluded).map((agent, index) => {
          if (index == 0) {
            count = agent.turnCount;
            bestAgent = agent.email;
            // position = index;
            return;
          }
          else {
            if (agent.turnCount < count) {
              bestAgent = agent.email;
              count = agent.turnCount;
              // position = index;
            }
          }
        });

        if (bestAgent) {
          //increment count of agent assigned ticket
          ticket.assigned_to = bestAgent;
          ticket.first_assigned_time = new Date().toISOString();
          // groups[0].agent_list[position].count++;
          let logSchema: TicketLogSchema = {
            title: 'assigned to',
            status: ticket.assigned_to,
            updated_by: 'Group Automation',
            user_type: 'Group Automation',
            time_stamp: new Date().toISOString()
          }
          ticket.ticketlog.push(logSchema);

          await this.db.collection('ticketgroups').findOneAndUpdate(
            { nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent },
            { $inc: { [`agent_list.$.turnCount`]: 1 } }
          )


        }
        return ticket
      }
    } catch (error) {
      console.log(error);
    }
  }

  public static ApplyRuleSets(rulesets: Array<RuleSetSchema>, obj: any): RuleSetSchema | undefined {
    try {

      let matched = new Array(rulesets.length).fill(0);
      let votingArray = new Array(rulesets.length).fill(0);
      rulesets.map((ruleset, index) => {
        switch (ruleset.operator.toLowerCase()) {

          case 'or':
            // console.log('Case OR');

            ruleset.conditions.map(condition => {
              // console.log(condition.key);
              // console.log(condition.regex);
              // console.log(obj[condition.key]);

              if ((obj as Object).hasOwnProperty(condition.key)) {
                // console.log('Condition Matched', (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi')));

                let result = (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi'))
                if (result && result.length) {
                  // console.log('Regex Matched', result);
                  votingArray[index] += result.length
                  matched[index] = true;
                }
              }

            })
            break;

          case 'and':
            let canMatch = true;
            ruleset.conditions.map(condition => {
              if (canMatch && (obj as Object).hasOwnProperty(condition.key)) {
                let result = (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi'))
                if (result && result.length) {
                  votingArray[index] += result.length
                  matched[index] = true;
                } else {
                  matched[index] = false;
                  canMatch = false;
                }
              }

            })
            break;

        }
      });

      let RuleIndex = -1;
      let max = -1;
      // console.log('Matched Array', matched);
      // console.log('Voting Array', votingArray);
      matched.map((match, index) => {
        if (match && votingArray[index] > max) {
          RuleIndex = index;
          max = votingArray[index];
        }
      })
      if (RuleIndex > -1) return rulesets[RuleIndex];
      else return undefined

    } catch (error) {
      console.log(error);
      console.log('error in Applying RuleSets');
      return undefined;
    }
  }



  public static async getTicketsForFilter(nsp: string, chunk: string = '', filters: Object) {
    try {

      let filtersObject = { '$or': ([] as any) }
      let obj = { 'nsp': nsp };
      if (filters) {
        Object.keys(filters).map(key => {
          if (key == 'daterange') {
            filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
            filtersObject['$or'].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
            // console.log('Date From', filters[key].from);
            // console.log('Date To ', filters[key].to)
            // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
            //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
            // }
            // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })

            return;
          }
          if (Array.isArray(filters[key])) {
            filtersObject['$or'].push({ [key]: { '$in': filters[key] } });
          }
          else filtersObject['$or'].push({ [key]: filters[key] })
        });
      }

      if (chunk) Object.assign(obj, { 'lasttouchedTime': { "$lt": chunk } });
      if (filtersObject['$or'].length) Object.assign(obj, filtersObject)


      return await this.db.collection('tickets').aggregate([
        { "$match": obj },
        { "$sort": { "lasttouchedTime": -1 } },
        { "$limit": 50 }
      ]).toArray();
    }


    catch (error) {
      console.log(error);
      console.log('error in Get tickets');
    }

  }


  //Suporting Functions
  public static GenerateSubject(subject: string) {

  }

  //actual hash method
  public static hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    let i, l,
      hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
      // Convert to 8 digit hex string
      return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
  }

  public static async getTicketClientID(str: string, nsp) {


    // let allTicketHashes = await this.collection.find({ nsp: nsp, clientID: { $exists: true } }, { fields: { clientID: 1 } }).toArray();

    // let obj: any = {};
    // if (allTicketHashes && allTicketHashes.length) allTicketHashes.map(hash => {
    //     obj[hash.clientID] = true
    // })
    let exists: any = [];
    let duplicate = false;
    let randomString = '';
    do {

      let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
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

  public static async SetClientID(tid, nsp, clientID) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(tid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false });

    } catch (error) {
      console.log('Error in getting particular ticket');
      console.log(error);
    }
  }


  public static async UpdateTicketWithSurveyData(tid: any, surveyId: string, surveyData: any) {
    try {
      let findQuestion = await this.collection.find({ _id: new ObjectId(tid) }).limit(1).toArray();
      if (findQuestion && findQuestion[0].SubmittedSurveyData && findQuestion[0].SubmittedSurveyData.length) {
        if (findQuestion[0].SubmittedSurveyData.filter(data => data.question.toLowerCase() == surveyData.question.toLowerCase()).length > 0) {
          return await this.collection.update({ _id: new ObjectID(tid), 'SubmittedSurveyData.question': surveyData.question },
            { $set: { 'SubmittedSurveyData.$.answer': surveyData.answer } }, { upsert: false, multi: false });
        }
        else {
          return await this.collection.update({ _id: new ObjectID(tid) },
            { $push: { SubmittedSurveyData: surveyData } }, { upsert: false, multi: false });
        }
      }
      else {
        return await this.collection.findOneAndUpdate({ _id: new ObjectID(tid) }, { $set: { surveyId: new ObjectId(surveyId), SubmittedSurveyData: [surveyData] } });
      }
    } catch (error) {
      console.log('Error in updating ticket with survey data');
      console.log(error);
    }
  }
  public static async deleteWatcher(id, agent) {
    try {
      let ticket = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $pull: { watchers: agent } }, { upsert: false, returnOriginal: false });
      if (process.env.NODE_ENV == 'production' && ticket.ok) {
        // console.log('Sending Message to SOLR Queue');
        let packet: SQSPacket = {
          action: 'updateTicket',
          body: {
            "tids": [ticket.value._id],
            "watchers": (ticket.value.watchers && ticket.value.watchers.length) ? ticket.value.watchers.join(',') : '',
          }
        }
        await __biZZC_SQS.SendMessageToSOLR(packet, 'ticket');
      }
      return ticket;
    } catch (error) {
      console.log('Error in deleteWatcher');
      console.log(error);
    }

  }

  public static async ExecuteScenarios(tids, nsp, updateObj, renameObj?) {

    try {
      //to set previous state of ticket, so that it can be reverted
      // if (updateObj['$set'] || Object.keys(updateObj['$push'] == 'ticketNotes').length || Object.keys(updateObj['$push'] == 'tags').length || Object.keys(updateObj['$push'] == 'watchers').length || Object.keys(updateObj['$push'] == 'todo').length) {
      //     previousStates.map(async ticket => {

      //         ticket._id = new ObjectId(ticket._id);
      //         let ticketCopy = await this.collection.findOne({ _id: new ObjectID(ticket._id), nsp: nsp });
      //         await this.collection.findOneAndUpdate({ _id: new ObjectId(ticket._id), nsp: nsp }, { $set: { previousTicketState: ticketCopy } }, { returnOriginal: false, upsert: false });
      //     })
      // }

      //in case of changeGroup and changeAgent:
      let result: any
      let objectIdArray = tids.map(s => new ObjectId(s));
      if (Object.keys(renameObj).length) {
        result = await this.collection.updateMany(
          { _id: { $in: objectIdArray }, nsp: nsp },
          { $rename: renameObj },
          { upsert: false });
      }

      //bulk execution of scenario
      result = await this.collection.updateMany(
        { _id: { $in: objectIdArray }, nsp: nsp },
        updateObj,
        { upsert: false });

      //find updated ones.
      if (result && result.result.ok && result.modifiedCount == tids.length) return await this.collection.find({ _id: { $in: objectIdArray }, nsp: nsp }).limit(tids.length).toArray();
      else return [];

    } catch (error) {
      console.log('Error in executing scenario');
      console.log(error);
    }
  }

  public static async getCustomData() {
    try {
      let promise1 = this.collection.aggregate([
        {
          '$match': {
            'datetime': {
              '$gte': '2020-01-01',
              '$lte': '2020-02-20'
            },
            "visitor.email": new RegExp('no-reply'),
            '_id': {
              '$in': [
                new ObjectId('5e3e9dfc0afc1f04e1f00b53'),
                new ObjectId('5e40fb8548e376550b5212d6'),
                new ObjectId('5e410ca448e376550b5214db'),
                new ObjectId('5e4115bb63bdee0d8e955024'),
                new ObjectId('5e411341ca76f25723c05d32'),
                new ObjectId('5e41527a2a1d505792089005'),
                new ObjectId('5e414fb763bdee0d8e9552c9'),
                new ObjectId('5e415ede63bdee0d8e95536d'),
                new ObjectId('5e41691863bdee0d8e9553e8'),
                new ObjectId('5e417ac863bdee0d8e9554bf'),
                new ObjectId('5e417afe63bdee0d8e9554c3'),
                new ObjectId('5e417a8b63bdee0d8e9554b6'),
                new ObjectId('5e417ed263bdee0d8e9554d9'),
                new ObjectId('5e417eb02a1d5057920891ae'),
                new ObjectId('5e40cb7c48e376550b520fe2'),
                new ObjectId('5e41b1732a1d505792089352'),
                new ObjectId('5e41ba4a63bdee0d8e95568b'),
                new ObjectId('5e41de7f2a1d505792089484'),
                new ObjectId('5e41ddfd63bdee0d8e955764'),
                new ObjectId('5e41e61463bdee0d8e95577b'),
                new ObjectId('5e41e28263bdee0d8e955775'),
                new ObjectId('5e4220cb63bdee0d8e955830'),
                new ObjectId('5e42268563bdee0d8e95583f'),
                new ObjectId('5e41974d2a1d50579208925b'),
                new ObjectId('5e4119ec2a1d505792088d39'),
                new ObjectId('5e3ec6030afc1f04e1f00c3e'),
                new ObjectId('5e40f6fc48e376550b52124d'),
                new ObjectId('5e41286f2a1d505792088e0d'),
                new ObjectId('5e4129ca63bdee0d8e9550fc'),
                new ObjectId('5e4134fc63bdee0d8e95518f'),
                new ObjectId('5e413c8263bdee0d8e9551c6'),
                new ObjectId('5e4141e563bdee0d8e955229'),
                new ObjectId('5e41499963bdee0d8e955281'),
                new ObjectId('5e41499263bdee0d8e95527e'),
                new ObjectId('5e414e5a63bdee0d8e9552b4'),
                new ObjectId('5e4150762a1d505792088ffb'),
                new ObjectId('5e4172102a1d505792089156'),
                new ObjectId('5e41778963bdee0d8e9554a1'),
                new ObjectId('5e418ca863bdee0d8e955526'),
                new ObjectId('5e419e9d63bdee0d8e9555a9'),
                new ObjectId('5e4148682a1d505792088fa8'),
                new ObjectId('5e41a1df63bdee0d8e9555c5'),
                new ObjectId('5e41a61163bdee0d8e9555ee'),
                new ObjectId('5e40c83548e376550b520fd0'),
                new ObjectId('5e41c0432a1d5057920893c6'),
                new ObjectId('5e41f6c12a1d5057920894e1'),
                new ObjectId('5e42100063bdee0d8e9557ea'),
                new ObjectId('5e42102f2a1d505792089523'),
                new ObjectId('5e4190cc63bdee0d8e955544'),
                new ObjectId('5e41979163bdee0d8e95556b'),
                new ObjectId('5e394d80a8e15c6568f2f8d5'),
                new ObjectId('5e395929a8e15c6568f2f9f0'),
                new ObjectId('5e39630fa8e15c6568f2faac'),
                new ObjectId('5e396806a8e15c6568f2faf4'),
                new ObjectId('5e39728fa8e15c6568f2fbe4'),
                new ObjectId('5e397b47a8e15c6568f2fc84'),
                new ObjectId('5e3981fea8e15c6568f2fd28'),
                new ObjectId('5e3983ada8e15c6568f2fd4b'),
                new ObjectId('5e39b4f2a8e15c6568f30082'),
                new ObjectId('5e39b294a8e15c6568f3005f'),
                new ObjectId('5e39cfd8a8e15c6568f30248'),
                new ObjectId('5e39ccc1a8e15c6568f3020f'),
                new ObjectId('5e39d1dfa8e15c6568f30268'),
                new ObjectId('5e3a1f82a8e15c6568f30513'),
                new ObjectId('5e3a08a5a8e15c6568f3047e'),
                new ObjectId('5e3a6ad0a8e15c6568f3091b'),
                new ObjectId('5e3a6168a8e15c6568f30869'),
                new ObjectId('5e3a603aa8e15c6568f3084d'),
                new ObjectId('5e3b806d8f6b6e0892140830'),
                new ObjectId('5e3b8717c8a0e264908680a8'),
                new ObjectId('5e3bbb5f8f6b6e08921409ed'),
                new ObjectId('5e3bbf55c8a0e264908682d4'),
                new ObjectId('5e3eedf348e376550b520462'),
                new ObjectId('5e3eefb70afc1f04e1f00d62'),
                new ObjectId('5e3ef2050afc1f04e1f00d74'),
                new ObjectId('5e3ef5930afc1f04e1f00d8f'),
                new ObjectId('5e3ef7c20afc1f04e1f00da5'),
                new ObjectId('5e3ef7c10afc1f04e1f00da4'),
                new ObjectId('5e3efd6e48e376550b5204d6'),
                new ObjectId('5e3f02fc48e376550b5204fa'),
                new ObjectId('5e3f05b348e376550b520500'),
                new ObjectId('5e3effc50afc1f04e1f00dda'),
                new ObjectId('5e3f05090afc1f04e1f00e0a'),
                new ObjectId('5e3f0fe60afc1f04e1f00e37'),
                new ObjectId('5e3f0fea48e376550b52052a'),
                new ObjectId('5e3f126548e376550b520539'),
                new ObjectId('5e3f126448e376550b520536'),
                new ObjectId('5e3f13310afc1f04e1f00e46'),
                new ObjectId('5e3f1c8c48e376550b520566'),
                new ObjectId('5e3f29950afc1f04e1f00ec7'),
                new ObjectId('5e3f2ae848e376550b52059f'),
                new ObjectId('5e3f2bc60afc1f04e1f00ecd'),
                new ObjectId('5e3f2eb948e376550b5205b4'),
                new ObjectId('5e3f33000afc1f04e1f00ef4'),
                new ObjectId('5e3f32fd0afc1f04e1f00ef1'),
                new ObjectId('5e3f36b40afc1f04e1f00f15'),
                new ObjectId('5e3f4a890afc1f04e1f00f54'),
                new ObjectId('5e3f5f490afc1f04e1f00f87'),
                new ObjectId('5e3f61460afc1f04e1f00f90'),
                new ObjectId('5e3f657f0afc1f04e1f00fa2'),
                new ObjectId('5e3f7db148e376550b520662'),
                new ObjectId('5e3f8a5d48e376550b52067a'),
                new ObjectId('5e3f8ad348e376550b520683'),
                new ObjectId('5e3f8ba00afc1f04e1f00fed'),
                new ObjectId('5e3f8f1948e376550b520689'),
                new ObjectId('5e3f930148e376550b5206a1'),
                new ObjectId('5e3f945c0afc1f04e1f01008'),
                new ObjectId('5e3f973c48e376550b5206c4'),
                new ObjectId('5e3fa2360afc1f04e1f01073'),
                new ObjectId('5e3f01ff48e376550b5204f7'),
                new ObjectId('5e3f05890afc1f04e1f00e0d'),
                new ObjectId('5e3fad3d48e376550b520788'),
                new ObjectId('5e3fae7f48e376550b5207aa'),
                new ObjectId('5e3fb08948e376550b5207c2'),
                new ObjectId('5e3fb40748e376550b5207e3'),
                new ObjectId('5e3fba2448e376550b52080d'),
                new ObjectId('5e3fb8bb0afc1f04e1f01149'),
                new ObjectId('5e3fbae548e376550b520811'),
                new ObjectId('5e3fbe8848e376550b520823'),
                new ObjectId('5e3fbe7648e376550b520820'),
                new ObjectId('5e3fc0cf48e376550b52082c'),
                new ObjectId('5e3fcd2b48e376550b520865'),
                new ObjectId('5e3fd0390afc1f04e1f0119e'),
                new ObjectId('5e3fd17a48e376550b520879'),
                new ObjectId('5e3fe16948e376550b5208d8'),
                new ObjectId('5e3fec0048e376550b520921'),
                new ObjectId('5e423e2d2a1d5057920895ed'),
                new ObjectId('5e4240012a1d505792089600'),
                new ObjectId('5e42432b2a1d50579208961d'),
                new ObjectId('5e4245c82a1d505792089635'),
                new ObjectId('5e4245fd2a1d505792089638'),
                new ObjectId('5e42565b2a1d5057920896db'),
                new ObjectId('5e4259372a1d5057920896ed'),
                new ObjectId('5e4256572a1d5057920896d8'),
                new ObjectId('5e4262a02a1d505792089739'),
                new ObjectId('5e4265072a1d505792089751'),
                new ObjectId('5e42645a2a1d50579208974e'),
                new ObjectId('5e4265c02a1d50579208975d'),
                new ObjectId('5e426e1763bdee0d8e955a84'),
                new ObjectId('5e426ffb2a1d5057920897b7'),
                new ObjectId('5e4270d02a1d5057920897c5'),
                new ObjectId('5e426d5f2a1d50579208979c'),
                new ObjectId('5e4280a12a1d50579208984b'),
                new ObjectId('5e428deb63bdee0d8e955b9a'),
                new ObjectId('5e429ab763bdee0d8e955bf7'),
                new ObjectId('5e40791f48e376550b520d25'),
                new ObjectId('5e42a6dc63bdee0d8e955c68'),
                new ObjectId('5e42aa5163bdee0d8e955c80'),
                new ObjectId('5e42adca63bdee0d8e955cb3'),
                new ObjectId('5e42b99063bdee0d8e955d45'),
                new ObjectId('5e42c4d92a1d505792089ab9'),
                new ObjectId('5e4166652a1d5057920890be'),
                new ObjectId('5e42d18963bdee0d8e955e16'),
                new ObjectId('5e42d6f163bdee0d8e955e3f'),
                new ObjectId('5e42bf0563bdee0d8e955d6e'),
                new ObjectId('5e42db682a1d505792089b90'),
                new ObjectId('5e42de4363bdee0d8e955e7f'),
                new ObjectId('5e42de4e63bdee0d8e955e82'),
                new ObjectId('5e42de512a1d505792089ba9'),
                new ObjectId('5e42416763bdee0d8e9558de'),
                new ObjectId('5e425d742a1d50579208970f'),
                new ObjectId('5e425e2a2a1d505792089714'),
                new ObjectId('5e40bc2c48e376550b520f8b'),
                new ObjectId('5e3f423f48e376550b5205e4'),
                new ObjectId('5e42305e63bdee0d8e95585d'),
                new ObjectId('5e41afa563bdee0d8e955621'),
                new ObjectId('5e4233ca2a1d505792089597'),
                new ObjectId('5e41cf7a2a1d505792089429'),
                new ObjectId('5e42455a2a1d50579208962e'),
                new ObjectId('5e42461a63bdee0d8e955909'),
                new ObjectId('5e42593c63bdee0d8e9559b1'),
                new ObjectId('5e42580c2a1d5057920896e9'),
                new ObjectId('5e4270c163bdee0d8e955aa8'),
                new ObjectId('5e4277be63bdee0d8e955ad4'),
                new ObjectId('5e427c9d63bdee0d8e955b11'),
                new ObjectId('5e428fce63bdee0d8e955bae'),
                new ObjectId('5e4290f82a1d5057920898c6'),
                new ObjectId('5e42922a2a1d5057920898cd'),
                new ObjectId('5e429bd663bdee0d8e955c07'),
                new ObjectId('5e42ad1863bdee0d8e955ca7'),
                new ObjectId('5e42acc163bdee0d8e955ca1'),
                new ObjectId('5e42ae7b2a1d5057920899cf'),
                new ObjectId('5e42c2712a1d505792089aaa'),
                new ObjectId('5e42c89063bdee0d8e955dbf'),
                new ObjectId('5e42d1ec2a1d505792089b39'),
                new ObjectId('5e42d6be2a1d505792089b68'),
                new ObjectId('5e42d8d92a1d505792089b77'),
                new ObjectId('5e42b70e2a1d505792089a29'),
                new ObjectId('5e42e29a63bdee0d8e955ea0'),
                new ObjectId('5e42e47d2a1d505792089bc7'),
                new ObjectId('5e42aee82a1d5057920899d5'),
                new ObjectId('5e42ebd663bdee0d8e955f0c'),
                new ObjectId('5e42edef63bdee0d8e955f33'),
                new ObjectId('5e42ebca63bdee0d8e955f09'),
                new ObjectId('5e42c2552a1d505792089aa7'),
                new ObjectId('5e42f5502a1d505792089c82'),
                new ObjectId('5e4299ae63bdee0d8e955bee'),
                new ObjectId('5e41fe242a1d5057920894f0'),
                new ObjectId('5e41ea7b2a1d5057920894b4'),
                new ObjectId('5e42fb3063bdee0d8e955f9b'),
                new ObjectId('5e42fc2063bdee0d8e955fa1'),
                new ObjectId('5e42f84363bdee0d8e955f77'),
                new ObjectId('5e4093f948e376550b520e16'),
                new ObjectId('5e42fe082a1d505792089cca'),
                new ObjectId('5e42fe042a1d505792089cc7'),
                new ObjectId('5e42fe722a1d505792089ccd'),
                new ObjectId('5e42fe6d63bdee0d8e955fc6'),
                new ObjectId('5e428f9b2a1d5057920898bd'),
                new ObjectId('5e426e3f63bdee0d8e955a87'),
                new ObjectId('5e41bdad63bdee0d8e9556a3'),
                new ObjectId('5e43083b2a1d505792089d18'),
                new ObjectId('5e4310b92a1d505792089d4e'),
                new ObjectId('5e4310bb2a1d505792089d51'),
                new ObjectId('5e43108263bdee0d8e95603b'),
                new ObjectId('5e4313da2a1d505792089d6f'),
                new ObjectId('5e431d3f63bdee0d8e956084'),
                new ObjectId('5e431ce62a1d505792089d9b'),
                new ObjectId('5e431ce02a1d505792089d98'),
                new ObjectId('5e431e6f2a1d505792089d9e'),
                new ObjectId('5e4346fd2a1d505792089eab'),
                new ObjectId('5e4349a363bdee0d8e9561a7'),
                new ObjectId('5e434a282a1d505792089eba'),
                new ObjectId('5e434e9563bdee0d8e9561cc'),
                new ObjectId('5e434b8463bdee0d8e9561b3'),
                new ObjectId('5e43475463bdee0d8e956192'),
                new ObjectId('5e4346f02a1d505792089ea8'),
                new ObjectId('5e4346f263bdee0d8e95618f'),
                new ObjectId('5e434cc063bdee0d8e9561b6'),
                new ObjectId('5e4345212a1d505792089e9c'),
                new ObjectId('5e4359ba63bdee0d8e9561ef'),
                new ObjectId('5e4357a12a1d505792089f0e'),
                new ObjectId('5e4347bd63bdee0d8e95619b'),
                new ObjectId('5e434cf72a1d505792089ec9'),
                new ObjectId('5e434d2063bdee0d8e9561b9'),
                new ObjectId('5e435fff63bdee0d8e95620d'),
                new ObjectId('5e436f592a1d505792089f64'),
                new ObjectId('5e4370c52a1d505792089f67'),
                new ObjectId('5e4316b563bdee0d8e956060'),
                new ObjectId('5e432a742a1d505792089df8'),
                new ObjectId('5e432ab02a1d505792089e06'),
                new ObjectId('5e432ae52a1d505792089e12'),
                new ObjectId('5e432e1a63bdee0d8e95610a'),
                new ObjectId('5e437dcf2a1d505792089fa7'),
                new ObjectId('5e4300bb63bdee0d8e955fe5'),
                new ObjectId('5e43807f2a1d505792089fb4'),
                new ObjectId('5e42d8be63bdee0d8e955e53'),
                new ObjectId('5e42d2892a1d505792089b3c'),
                new ObjectId('5e4394902a1d50579208a045'),
                new ObjectId('5e4310802a1d505792089d4b'),
                new ObjectId('5e434a2663bdee0d8e9561aa'),
                new ObjectId('5e437dcd63bdee0d8e9562a6'),
                new ObjectId('5e439cd463bdee0d8e956386'),
                new ObjectId('5e439dae63bdee0d8e95639c'),
                new ObjectId('5e43a08663bdee0d8e9563c4'),
                new ObjectId('5e43a3612a1d50579208a0da'),
                new ObjectId('5e43a8952a1d50579208a120'),
                new ObjectId('5e43e8072a1d50579208a40b'),
                new ObjectId('5e43e96463bdee0d8e9566cc'),
                new ObjectId('5e43eaa72a1d50579208a42d'),
                new ObjectId('5e43edb12a1d50579208a458'),
                new ObjectId('5e43ef8063bdee0d8e95671e'),
                new ObjectId('5e43f6c52a1d50579208a4be'),
                new ObjectId('5e43e21d2a1d50579208a3ae'),
                new ObjectId('5e43ec9e2a1d50579208a448'),
                new ObjectId('5e43c0be2a1d50579208a254'),
                new ObjectId('5e43cad863bdee0d8e9565c2'),
                new ObjectId('5e43ca7c2a1d50579208a2b6'),
                new ObjectId('5e43e2032a1d50579208a374'),
                new ObjectId('5e43e32163bdee0d8e95668c'),
                new ObjectId('5e43d33c2a1d50579208a315'),
                new ObjectId('5e43e5952a1d50579208a3ee'),
                new ObjectId('5e43d9e963bdee0d8e956648'),
                new ObjectId('5e43e68b63bdee0d8e9566b1'),
                new ObjectId('5e4402c563bdee0d8e9567cb'),
                new ObjectId('5e43ffac63bdee0d8e9567b0'),
                new ObjectId('5e43fee62a1d50579208a51d'),
                new ObjectId('5e43a3632a1d50579208a0dd'),
                new ObjectId('5e43bc802a1d50579208a21f'),
                new ObjectId('5e43bbda2a1d50579208a218'),
                new ObjectId('5e43bf312a1d50579208a23f'),
                new ObjectId('5e43bfb22a1d50579208a244'),
                new ObjectId('5e43c49f63bdee0d8e956586'),
                new ObjectId('5e43b1e82a1d50579208a197'),
                new ObjectId('5e42c0472a1d505792089a97'),
                new ObjectId('5e42c0302a1d505792089a94'),
                new ObjectId('5e43b68a63bdee0d8e9564ea'),
                new ObjectId('5e41873b2a1d5057920891e2'),
                new ObjectId('5e43bbc163bdee0d8e956523'),
                new ObjectId('5e442f6d2a1d50579208a6fa'),
                new ObjectId('5e44f15563bdee0d8e956e4d'),
                new ObjectId('5e44f0df63bdee0d8e956e44'),
                new ObjectId('5e4465c72a1d50579208a896'),
                new ObjectId('5e440f0763bdee0d8e956874'),
                new ObjectId('5e43fbbf63bdee0d8e956782'),
                new ObjectId('5e43fe0663bdee0d8e95679b'),
                new ObjectId('5e43fc822a1d50579208a4fe'),
                new ObjectId('5e440b882a1d50579208a5b4'),
                new ObjectId('5e4414342a1d50579208a60f'),
                new ObjectId('5e4412b82a1d50579208a5fd'),
                new ObjectId('5e44107f63bdee0d8e95687f'),
                new ObjectId('5e41523963bdee0d8e9552e5'),
                new ObjectId('5e444ce063bdee0d8e956a98'),
                new ObjectId('5e444e752a1d50579208a7e7'),
                new ObjectId('5e442c5e2a1d50579208a6eb'),
                new ObjectId('5e43e21063bdee0d8e95666d'),
                new ObjectId('5e3356d66ce949443df88132'),
                new ObjectId('5e437b6a2a1d505792089f98'),
                new ObjectId('5e43e21063bdee0d8e95666a'),
                new ObjectId('5e44228a2a1d50579208a690'),
                new ObjectId('5e43ff272a1d50579208a520'),
                new ObjectId('5e442fa863bdee0d8e9569ae'),
                new ObjectId('5e41f6d063bdee0d8e95579c'),
                new ObjectId('5e441a922a1d50579208a651'),
                new ObjectId('5e432c2a63bdee0d8e956101'),
                new ObjectId('5e4432cc2a1d50579208a718'),
                new ObjectId('5e442fb12a1d50579208a700'),
                new ObjectId('5e4410eb63bdee0d8e956889'),
                new ObjectId('5e4403f463bdee0d8e9567dd'),
                new ObjectId('5e4439c22a1d50579208a74b'),
                new ObjectId('5e449f9663bdee0d8e956c7d'),
                new ObjectId('5e44b5bd2a1d50579208aa26'),
                new ObjectId('5e44d8e063bdee0d8e956da4'),
                new ObjectId('5e44da0063bdee0d8e956da7'),
                new ObjectId('5e44de0d2a1d50579208aae6'),
                new ObjectId('5e4492542a1d50579208a995'),
                new ObjectId('5e44e3842a1d50579208ab21'),
                new ObjectId('5e44e4ec2a1d50579208ab39'),
                new ObjectId('5e48204e8b03c9076e3bb9a6'),
                new ObjectId('5e4827a18f9df23ae3788622'),
                new ObjectId('5e482eb08b03c9076e3bba16'),
                new ObjectId('5e482dec8b03c9076e3bba0d'),
                new ObjectId('5e484c598b03c9076e3bbb4f'),
                new ObjectId('5e48a35e8b03c9076e3bbd34'),
                new ObjectId('5e48a3bd8b03c9076e3bbd3a'),
                new ObjectId('5e48b5858b03c9076e3bbd6d'),
                new ObjectId('5e48c69c8b03c9076e3bbd94'),
                new ObjectId('5e4804268b03c9076e3bb904'),
                new ObjectId('5e483d618b03c9076e3bbac9'),
                new ObjectId('5e48e7a08b03c9076e3bbe9a'),
                new ObjectId('5e4903078b03c9076e3bbf75'),
                new ObjectId('5e49047f8b03c9076e3bbf8d'),
                new ObjectId('5e4916f68b03c9076e3bc061'),
                new ObjectId('5e4918c08b03c9076e3bc081'),
                new ObjectId('5e47ebdd8b03c9076e3bb85b'),
                new ObjectId('5e4923fd8b03c9076e3bc0f3'),
                new ObjectId('5e49235b8b03c9076e3bc0ec'),
                new ObjectId('5e4930cd8b03c9076e3bc17e'),
                new ObjectId('5e4943b18b03c9076e3bc20b'),
                new ObjectId('5e4972638b03c9076e3bc3c4'),
                new ObjectId('5e497e238b03c9076e3bc40c'),
                new ObjectId('5e497e618b03c9076e3bc412'),
                new ObjectId('5e497ef38b03c9076e3bc421'),
                new ObjectId('5e464be963bdee0d8e957939'),
                new ObjectId('5e4654b82a1d50579208b6e2'),
                new ObjectId('5e46529d63bdee0d8e957978'),
                new ObjectId('5e4654b463bdee0d8e957991'),
                new ObjectId('5e4654d263bdee0d8e957994'),
                new ObjectId('5e4679382a1d50579208b85a'),
                new ObjectId('5e467c0963bdee0d8e957ad9'),
                new ObjectId('5e46a6988b03c9076e3bb01b'),
                new ObjectId('5e46b3978f9df23ae3787d51'),
                new ObjectId('5e4609ea63bdee0d8e957781'),
                new ObjectId('5e46ba188b03c9076e3bb15a'),
                new ObjectId('5e4776d48b03c9076e3bb591'),
                new ObjectId('5e47a07f8f9df23ae3788272'),
                new ObjectId('5e478fd28f9df23ae378820d'),
                new ObjectId('5e47a8098f9df23ae378829d'),
                new ObjectId('5e47a80b8b03c9076e3bb67f'),
                new ObjectId('5e47acab8b03c9076e3bb6aa'),
                new ObjectId('5e47c18f8f9df23ae378833b'),
                new ObjectId('5e47cf5e8b03c9076e3bb7ad'),
                new ObjectId('5e47e2a38b03c9076e3bb828'),
                new ObjectId('5e476f1b8f9df23ae3788181'),
                new ObjectId('5e4966468b03c9076e3bc34f'),
                new ObjectId('5e497c1c8b03c9076e3bc3fa'),
                new ObjectId('5e497dba8b03c9076e3bc406'),
                new ObjectId('5e49844b8b03c9076e3bc457'),
                new ObjectId('5e4983048b03c9076e3bc448'),
                new ObjectId('5e4982ca8b03c9076e3bc445'),
                new ObjectId('5e45438763bdee0d8e9571a4'),
                new ObjectId('5e45487b2a1d50579208af61'),
                new ObjectId('5e454ba62a1d50579208af7d'),
                new ObjectId('5e454e662a1d50579208af97'),
                new ObjectId('5e45550163bdee0d8e957273'),
                new ObjectId('5e4554e863bdee0d8e95726c'),
                new ObjectId('5e45506163bdee0d8e95722a'),
                new ObjectId('5e45528763bdee0d8e95724a'),
                new ObjectId('5e45511463bdee0d8e957235'),
                new ObjectId('5e455d592a1d50579208b077'),
                new ObjectId('5e455fa02a1d50579208b080'),
                new ObjectId('5e456a7f2a1d50579208b0f8'),
                new ObjectId('5e457ae72a1d50579208b166'),
                new ObjectId('5e44bb622a1d50579208aa34'),
                new ObjectId('5e458d8d63bdee0d8e957479'),
                new ObjectId('5e459afe63bdee0d8e957504'),
                new ObjectId('5e459b712a1d50579208b2a0'),
                new ObjectId('5e45579263bdee0d8e9572a1'),
                new ObjectId('5e45563b63bdee0d8e95728c'),
                new ObjectId('5e45736d63bdee0d8e9573c5'),
                new ObjectId('5e4579402a1d50579208b161'),
                new ObjectId('5e44a1e22a1d50579208a9d6'),
                new ObjectId('5e448baa2a1d50579208a97d'),
                new ObjectId('5e44d73863bdee0d8e956d9b'),
                new ObjectId('5e453f5a63bdee0d8e957179'),
                new ObjectId('5e44beb92a1d50579208aa55'),
                new ObjectId('5e44c0df2a1d50579208aa58'),
                new ObjectId('5e44c5f32a1d50579208aa7f'),
                new ObjectId('5e44c36b2a1d50579208aa6a'),
                new ObjectId('5e44c2292a1d50579208aa64'),
                new ObjectId('5e4597ed63bdee0d8e9574d7'),
                new ObjectId('5e44c5602a1d50579208aa7c'),
                new ObjectId('5e44d1d063bdee0d8e956d79'),
                new ObjectId('5e45a44463bdee0d8e95755b'),
                new ObjectId('5e45a6ca63bdee0d8e957576'),
                new ObjectId('5e45ad2663bdee0d8e95759f'),
                new ObjectId('5e4456952a1d50579208a82f'),
                new ObjectId('5e44018a2a1d50579208a52f'),
                new ObjectId('5e44627763bdee0d8e956b48'),
                new ObjectId('5e43e8bf2a1d50579208a40f'),
                new ObjectId('5e446cac63bdee0d8e956b89'),
                new ObjectId('5e4470312a1d50579208a8ff'),
                new ObjectId('5e44607563bdee0d8e956b3c'),
                new ObjectId('5e446ec72a1d50579208a8e8'),
                new ObjectId('5e446d3e2a1d50579208a8da'),
                new ObjectId('5e446fc22a1d50579208a8f6'),
                new ObjectId('5e44a11263bdee0d8e956c8b'),
                new ObjectId('5e44ad1763bdee0d8e956ccf'),
                new ObjectId('5e44bdbb63bdee0d8e956d1c'),
                new ObjectId('5e44c2ca63bdee0d8e956d37'),
                new ObjectId('5e44c18d63bdee0d8e956d31'),
                new ObjectId('5e44c18a2a1d50579208aa5b'),
                new ObjectId('5e44c87e63bdee0d8e956d43'),
                new ObjectId('5e44c8832a1d50579208aa8b'),
                new ObjectId('5e44a3c663bdee0d8e956c99'),
                new ObjectId('5e44a6042a1d50579208a9f1'),
                new ObjectId('5e44a89063bdee0d8e956cb1'),
                new ObjectId('5e44a8972a1d50579208aa02'),
                new ObjectId('5e44a48b2a1d50579208a9e8'),
                new ObjectId('5e44a89363bdee0d8e956cb4'),
                new ObjectId('5e44ac6b2a1d50579208aa08'),
                new ObjectId('5e44a3732a1d50579208a9e2'),
                new ObjectId('5e44abdd63bdee0d8e956cc6'),
                new ObjectId('5e44abec63bdee0d8e956cc9'),
                new ObjectId('5e44be0363bdee0d8e956d22'),
                new ObjectId('5e44bdbd63bdee0d8e956d1f'),
                new ObjectId('5e44830963bdee0d8e956c0c'),
                new ObjectId('5e4492562a1d50579208a998'),
                new ObjectId('5e44995b63bdee0d8e956c65'),
                new ObjectId('5e449a7d2a1d50579208a9b0'),
                new ObjectId('5e449cda63bdee0d8e956c71'),
                new ObjectId('5e450b0a2a1d50579208ac98'),
                new ObjectId('5e3a776aa8e15c6568f309f4'),
                new ObjectId('5e3edee70afc1f04e1f00ccd'),
                new ObjectId('5e451c6c63bdee0d8e956fee'),
                new ObjectId('5e4506182a1d50579208ac6d'),
                new ObjectId('5e450d942a1d50579208acb4'),
                new ObjectId('5e44ff2c2a1d50579208ac18'),
                new ObjectId('5e44ff282a1d50579208ac15'),
                new ObjectId('5e45316c63bdee0d8e9570ce'),
                new ObjectId('5e4533662a1d50579208ae86'),
                new ObjectId('5e453aae63bdee0d8e95714f'),
                new ObjectId('5e451f9163bdee0d8e957020'),
                new ObjectId('5e45221b2a1d50579208adc1'),
                new ObjectId('5e4520902a1d50579208adb5'),
                new ObjectId('5e451e7e63bdee0d8e957013'),
                new ObjectId('5e451de02a1d50579208ad8f'),
                new ObjectId('5e451e132a1d50579208ad95'),
                new ObjectId('5e451e172a1d50579208ad98'),
                new ObjectId('5e451f012a1d50579208ada3'),
                new ObjectId('5e451e7a63bdee0d8e957010'),
                new ObjectId('5e451f8e2a1d50579208adaa'),
                new ObjectId('5e452cf263bdee0d8e9570a7'),
                new ObjectId('5e452dbf2a1d50579208ae4f'),
                new ObjectId('5e43f4a22a1d50579208a4a8'),
                new ObjectId('5e4533d763bdee0d8e9570f4'),
                new ObjectId('5e4538002a1d50579208aec6'),
                new ObjectId('5e455b592a1d50579208b060'),
                new ObjectId('5e455b4563bdee0d8e9572e6'),
                new ObjectId('5e45673f63bdee0d8e957350'),
                new ObjectId('5e45673e2a1d50579208b0ef'),
                new ObjectId('5e4568fe63bdee0d8e957369'),
                new ObjectId('5e45911c63bdee0d8e9574ac'),
                new ObjectId('5e1656ad38cdec6804663be3'),
                new ObjectId('5e45d30a2a1d50579208b429'),
                new ObjectId('5e45d2042a1d50579208b426'),
                new ObjectId('5e45d40d63bdee0d8e9576c6'),
                new ObjectId('5e45d31d2a1d50579208b42c'),
                new ObjectId('5e45d39d63bdee0d8e9576c3'),
                new ObjectId('5e45d4b22a1d50579208b432'),
                new ObjectId('5e45d4fa2a1d50579208b438'),
                new ObjectId('5e45d59763bdee0d8e9576d2'),
                new ObjectId('5e45da1e2a1d50579208b44d'),
                new ObjectId('5e45e1032a1d50579208b470'),
                new ObjectId('5e45e5ce63bdee0d8e957701'),
                new ObjectId('5e45efd263bdee0d8e957720'),
                new ObjectId('5e45f0322a1d50579208b49a'),
                new ObjectId('5e45ec812a1d50579208b491'),
                new ObjectId('5e45cbcb63bdee0d8e95767c'),
                new ObjectId('5e46363a63bdee0d8e95785c'),
                new ObjectId('5e45b98e63bdee0d8e95761a'),
                new ObjectId('5e454b4763bdee0d8e9571fb'),
                new ObjectId('5e43fd3b2a1d50579208a50b'),
                new ObjectId('5e45ae8363bdee0d8e9575a8'),
                new ObjectId('5e45c48b2a1d50579208b3d4'),
                new ObjectId('5e45c50a2a1d50579208b3d7'),
                new ObjectId('5e45c52963bdee0d8e957653'),
                new ObjectId('5e45fe6c63bdee0d8e957768'),
                new ObjectId('5e44373363bdee0d8e9569e4'),
                new ObjectId('5e44786363bdee0d8e956bba'),
                new ObjectId('5e44390563bdee0d8e9569f7'),
                new ObjectId('5e44380863bdee0d8e9569f0'),
                new ObjectId('5e45cb642a1d50579208b408'),
                new ObjectId('5e45c90763bdee0d8e957665'),
                new ObjectId('5e4438652a1d50579208a742'),
                new ObjectId('5e44365e63bdee0d8e9569da'),
                new ObjectId('5e4437a563bdee0d8e9569ed'),
                new ObjectId('5e45cbcd63bdee0d8e95767f'),
                new ObjectId('5e45cec763bdee0d8e95769f'),
                new ObjectId('5e45cf6063bdee0d8e9576a5'),
                new ObjectId('5e458b3b2a1d50579208b1d9'),
                new ObjectId('5e458b3663bdee0d8e95746a'),
                new ObjectId('5e45c9d763bdee0d8e957670'),
                new ObjectId('5e458e9363bdee0d8e95748e'),
                new ObjectId('5e45c9a82a1d50579208b3fc'),
                new ObjectId('5e45cd762a1d50579208b414'),
                new ObjectId('5e44ae0b2a1d50579208aa11'),
                new ObjectId('5e45cd7863bdee0d8e957694'),
                new ObjectId('5e45cd8a63bdee0d8e957697'),
                new ObjectId('5e45831f2a1d50579208b198'),
                new ObjectId('5e462afe63bdee0d8e9577fd'),
                new ObjectId('5e45fe6a63bdee0d8e957765'),
                new ObjectId('5e4660d72a1d50579208b745'),
                new ObjectId('5e465e7e2a1d50579208b72e'),
                new ObjectId('5e46683063bdee0d8e957a24'),
                new ObjectId('5e466d3e63bdee0d8e957a4d'),
                new ObjectId('5e466ea263bdee0d8e957a55'),
                new ObjectId('5e46754f2a1d50579208b82e'),
                new ObjectId('5e46cc1e8b03c9076e3bb1e8'),
                new ObjectId('5e46d34e8b03c9076e3bb219'),
                new ObjectId('5e468d202a1d50579208b913'),
                new ObjectId('5e4688082a1d50579208b8d5'),
                new ObjectId('5e45ddfb2a1d50579208b455'),
                new ObjectId('5e46b3a88b03c9076e3bb11f'),
                new ObjectId('5e46bbce8b03c9076e3bb160'),
                new ObjectId('5e46f3eb8b03c9076e3bb311'),
                new ObjectId('5e46f3f08f9df23ae3787f42'),
                new ObjectId('5e46f4ec8b03c9076e3bb323'),
                new ObjectId('5e46f2b88f9df23ae3787f14'),
                new ObjectId('5e469688d006683994c58e48'),
                new ObjectId('5e4699f68f9df23ae3787bfa'),
                new ObjectId('5e469a548f9df23ae3787bfd'),
                new ObjectId('5e469b948b03c9076e3bafbb'),
                new ObjectId('5e46a2e78f9df23ae3787c50'),
                new ObjectId('5e46a63b8f9df23ae3787c5e'),
                new ObjectId('5e46bb548f9df23ae3787d8d'),
                new ObjectId('5e46ba1b8b03c9076e3bb15d'),
                new ObjectId('5e46d37c8f9df23ae3787e35'),
                new ObjectId('5e46aff58f9df23ae3787d2d'),
                new ObjectId('5e46df8b8f9df23ae3787e90'),
                new ObjectId('5e45a13763bdee0d8e957533'),
                new ObjectId('5e460d7563bdee0d8e957790'),
                new ObjectId('5e46e6d08b03c9076e3bb2ac'),
                new ObjectId('5e46e9ce8f9df23ae3787eca'),
                new ObjectId('5e46eb028b03c9076e3bb2cd'),
                new ObjectId('5e46db148b03c9076e3bb262'),
                new ObjectId('5e46ee968b03c9076e3bb2d5'),
                new ObjectId('5e46ffa78b03c9076e3bb3ec'),
                new ObjectId('5e4707c78f9df23ae378800f'),
                new ObjectId('5e4623b82a1d50579208b538'),
                new ObjectId('5e4708348f9df23ae3788012'),
                new ObjectId('5e470aec8f9df23ae378802f'),
                new ObjectId('5e47108a8b03c9076e3bb451'),
                new ObjectId('5e3b3a7fc8a0e26490867f05'),
                new ObjectId('5e4717a78f9df23ae3788060'),
                new ObjectId('5e4720c78b03c9076e3bb4a8'),
                new ObjectId('5e4727898f9df23ae37880a8'),
                new ObjectId('5e473e658f9df23ae37880f7'),
                new ObjectId('5e475c7f8f9df23ae378814b'),
                new ObjectId('5e4776d28b03c9076e3bb58e'),
                new ObjectId('5e4708338b03c9076e3bb421'),
                new ObjectId('5e4779918b03c9076e3bb5a0'),
                new ObjectId('5e47865e8f9df23ae37881cf'),
                new ObjectId('5e46df6e8f9df23ae3787e8a'),
                new ObjectId('5e470c4f8b03c9076e3bb43f'),
                new ObjectId('5e4713168b03c9076e3bb460'),
                new ObjectId('5e36342ba8e15c6568f2ce02'),
                new ObjectId('5e47117f8f9df23ae378804d'),
                new ObjectId('5e4723d48b03c9076e3bb4b5'),
                new ObjectId('5e460d0b2a1d50579208b4e9'),
                new ObjectId('5e47568a8b03c9076e3bb546'),
                new ObjectId('5e475a6e8f9df23ae378813c'),
                new ObjectId('5e475a738f9df23ae378813f'),
                new ObjectId('5e4a09228b03c9076e3bc816'),
                new ObjectId('5e4a0ecf8b03c9076e3bc838'),
                new ObjectId('5e4a0ed18b03c9076e3bc83b'),
                new ObjectId('5e495aa88b03c9076e3bc2e9'),
                new ObjectId('5e4a137a8b03c9076e3bc85e'),
                new ObjectId('5e4a13818b03c9076e3bc861'),
                new ObjectId('5e4a15648b03c9076e3bc87e'),
                new ObjectId('5e4a1a3b8b03c9076e3bc8ae'),
                new ObjectId('5e49a7b08b03c9076e3bc5aa'),
                new ObjectId('5e47e2a18f9df23ae378844e'),
                new ObjectId('5e49bb7b8b03c9076e3bc631'),
                new ObjectId('5e4a27e18b03c9076e3bc946'),
                new ObjectId('5e4723d08b03c9076e3bb4b2'),
                new ObjectId('5e4999d98b03c9076e3bc4f5'),
                new ObjectId('5e4a37d58b03c9076e3bca61'),
                new ObjectId('5e4a3ccf8b03c9076e3bcaba'),
                new ObjectId('5e4a47fe8b03c9076e3bcb7d'),
                new ObjectId('5e4a5b008b03c9076e3bccc2'),
                new ObjectId('5e49d9f38b03c9076e3bc6f1'),
                new ObjectId('5e4810bb8f9df23ae378859b'),
                new ObjectId('5e476bb58b03c9076e3bb570'),
                new ObjectId('5e4a12748b03c9076e3bc855'),
                new ObjectId('5e4a126e8b03c9076e3bc852'),
                new ObjectId('5e49816e8b03c9076e3bc43c'),
                new ObjectId('5e4931328b03c9076e3bc18d'),
                new ObjectId('5e4a167c8b03c9076e3bc88a'),
                new ObjectId('5e495b9d8b03c9076e3bc2f2'),
                new ObjectId('5e498e438b03c9076e3bc490'),
                new ObjectId('5e4804248f9df23ae3788537'),
                new ObjectId('5e4a37fa8b03c9076e3bca67'),
                new ObjectId('5e4a457f8b03c9076e3bcb4b'),
                new ObjectId('5e4a45818b03c9076e3bcb4e'),
                new ObjectId('5de20db95b51ba6500d1fedd'),
                new ObjectId('5e4a87fa8b03c9076e3bd09b'),
                new ObjectId('5e4a82db8b03c9076e3bd024'),
                new ObjectId('5e4acee18b03c9076e3bd517'),
                new ObjectId('5e4acee48b03c9076e3bd51a'),
                new ObjectId('5e4a172e8b03c9076e3bc896'),
                new ObjectId('5e4ad2628b03c9076e3bd547'),
                new ObjectId('5e4ad1a38b03c9076e3bd541'),
                new ObjectId('5e4acb458b03c9076e3bd4c8'),
                new ObjectId('5e4acb498b03c9076e3bd4cb'),
                new ObjectId('5e4ad2698b03c9076e3bd54a'),
                new ObjectId('5e4ae0c38b03c9076e3bd622'),
                new ObjectId('5e4ae0fd8b03c9076e3bd625'),
                new ObjectId('5e4aedb88b03c9076e3bd6f4'),
                new ObjectId('5e4aedbd8b03c9076e3bd6f7'),
                new ObjectId('5e4af1118b03c9076e3bd72d'),
                new ObjectId('5e4af1098b03c9076e3bd72a'),
                new ObjectId('5e4af6be8b03c9076e3bd777'),
                new ObjectId('5e4ae1e18b03c9076e3bd63a'),
                new ObjectId('5e4ae2768b03c9076e3bd643'),
                new ObjectId('5e4ae53c8b03c9076e3bd661'),
                new ObjectId('5e4ae9ce8b03c9076e3bd6af'),
                new ObjectId('5e4af36e8b03c9076e3bd753'),
                new ObjectId('5e4ae2a68b03c9076e3bd64c'),
                new ObjectId('5e4af45c8b03c9076e3bd765'),
                new ObjectId('5e4a16df8b03c9076e3bc88e'),
                new ObjectId('5e4a19ad8b03c9076e3bc8aa'),
                new ObjectId('5e4a0e088b03c9076e3bc82f'),
                new ObjectId('5e4ad7d88b03c9076e3bd59d'),
                new ObjectId('5e4ad94b8b03c9076e3bd5b2'),
                new ObjectId('5e4ad9058b03c9076e3bd5ac'),
                new ObjectId('5e4ad9088b03c9076e3bd5af'),
                new ObjectId('5e4b1e748b03c9076e3bd92c'),
                new ObjectId('5e4b24ef8b03c9076e3bd985'),
                new ObjectId('5e4b251d8b03c9076e3bd98b'),
                new ObjectId('5e4b252f8b03c9076e3bd98e'),
                new ObjectId('5e4b25098b03c9076e3bd988'),
                new ObjectId('5e4b25ef8b03c9076e3bd9a6'),
                new ObjectId('5e4b25df8b03c9076e3bd9a3'),
                new ObjectId('5e4b25ca8b03c9076e3bd9a0'),
                new ObjectId('5e4b255e8b03c9076e3bd994'),
                new ObjectId('5e4b25918b03c9076e3bd99d'),
                new ObjectId('5e4b25728b03c9076e3bd99a'),
                new ObjectId('5e4b25fd8b03c9076e3bd9a9'),
                new ObjectId('5e4b254d8b03c9076e3bd991'),
                new ObjectId('5e4b25708b03c9076e3bd997'),
                new ObjectId('5e4b26df8b03c9076e3bd9d6'),
                new ObjectId('5e4b26ca8b03c9076e3bd9d3'),
                new ObjectId('5e4b268f8b03c9076e3bd9c7'),
                new ObjectId('5e4b26998b03c9076e3bd9ca'),
                new ObjectId('5e4b26be8b03c9076e3bd9d0'),
                new ObjectId('5e4b26ad8b03c9076e3bd9cd'),
                new ObjectId('5e4b500c8b03c9076e3bdb1c'),
                new ObjectId('5e4b500e8b03c9076e3bdb1f'),
                new ObjectId('5e4ae9818b03c9076e3bd6a6'),
                new ObjectId('5e4ae8228b03c9076e3bd68b'),
                new ObjectId('5e4ae8e08b03c9076e3bd698'),
                new ObjectId('5e4b0a5c8b03c9076e3bd855'),
                new ObjectId('5e4b104f8b03c9076e3bd899'),
                new ObjectId('5e4b15fc8b03c9076e3bd8c8'),
                new ObjectId('5e4b1cdf8b03c9076e3bd912'),
                new ObjectId('5e4b1ef48b03c9076e3bd935'),
                new ObjectId('5e4b1f0e8b03c9076e3bd93b'),
                new ObjectId('5e4b1eac8b03c9076e3bd932'),
                new ObjectId('5e4b1f0c8b03c9076e3bd938'),
                new ObjectId('5e4b265d8b03c9076e3bd9bb'),
                new ObjectId('5e4b26418b03c9076e3bd9b8'),
                new ObjectId('5e4b262b8b03c9076e3bd9b2'),
                new ObjectId('5e4b26738b03c9076e3bd9be'),
                new ObjectId('5e4b267d8b03c9076e3bd9c1'),
                new ObjectId('5e4b26818b03c9076e3bd9c4'),
                new ObjectId('5e4b260b8b03c9076e3bd9ac'),
                new ObjectId('5e4b26178b03c9076e3bd9af'),
                new ObjectId('5e4a976c8b03c9076e3bd1a6'),
                new ObjectId('5e4b3d148b03c9076e3bda8d'),
                new ObjectId('5e4b55418b03c9076e3bdb43'),
                new ObjectId('5e4b5a4f8b03c9076e3bdb7d'),
                new ObjectId('5e4b5ccb8b03c9076e3bdb8e'),
                new ObjectId('5e4b60048b03c9076e3bdbcb'),
                new ObjectId('5e4b5fd98b03c9076e3bdbc2'),
                new ObjectId('5e4b5fd78b03c9076e3bdbbf'),
                new ObjectId('5e4b5ffe8b03c9076e3bdbc5'),
                new ObjectId('5e46412163bdee0d8e9578c8'),
                new ObjectId('5e4701088b03c9076e3bb3f5'),
                new ObjectId('5e1a252db51f7a4bf28d4632'),
                new ObjectId('5e1a244e3d9a4d2a65c27c7c'),
                new ObjectId('5e1a27823d9a4d2a65c27c9d'),
                new ObjectId('5e477c858f9df23ae37881b2'),
                new ObjectId('5e477d168b03c9076e3bb5a6'),
                new ObjectId('5e479ce28f9df23ae3788262'),
                new ObjectId('5e47a8e48f9df23ae37882ac'),
                new ObjectId('5e47b2198b03c9076e3bb6dd'),
                new ObjectId('5e47b3098b03c9076e3bb6e6'),
                new ObjectId('5e47c3448b03c9076e3bb75a'),
                new ObjectId('5e47cc7a8f9df23ae3788393'),
                new ObjectId('5e47cf638f9df23ae37883b9'),
                new ObjectId('5e47d6258f9df23ae37883f7'),
                new ObjectId('5e47ddea8f9df23ae3788436'),
                new ObjectId('5e47e0118f9df23ae3788442'),
                new ObjectId('5e47e3dc8b03c9076e3bb834'),
                new ObjectId('5e47f57d8b03c9076e3bb8a9'),
                new ObjectId('5e47f61a8b03c9076e3bb8b2'),
                new ObjectId('5e47f9798f9df23ae37884de'),
                new ObjectId('5e4745c88b03c9076e3bb528'),
                new ObjectId('5e47ff648b03c9076e3bb8e0'),
                new ObjectId('5e47ff6a8b03c9076e3bb8e3'),
                new ObjectId('5e4803ec8f9df23ae3788534'),
                new ObjectId('5e4806988b03c9076e3bb910'),
                new ObjectId('5e474c918b03c9076e3bb531'),
                new ObjectId('5e4b6cb88b03c9076e3bdc5b'),
                new ObjectId('5e4b7be58b03c9076e3bdd3b'),
                new ObjectId('5e4a88e48b03c9076e3bd0b1'),
                new ObjectId('5e4b950f8b03c9076e3bdee8'),
                new ObjectId('5e4b944a8b03c9076e3bdecc'),
                new ObjectId('5e4b9fea18529c7a7a88095f'),
                new ObjectId('5e4ba14b29f0360bdd60d0fc'),
                new ObjectId('5e4ba44c18529c7a7a88098c'),
                new ObjectId('5e4ba42918529c7a7a880989'),
                new ObjectId('5e4baab418529c7a7a8809d7'),
                new ObjectId('5e4babef18529c7a7a8809e9'),
                new ObjectId('5e4bac4a18529c7a7a8809ef'),
                new ObjectId('5e4bae2118529c7a7a8809fb'),
                new ObjectId('5e4bae3018529c7a7a8809fe'),
                new ObjectId('5e4bb6a129f0360bdd60d1ac'),
                new ObjectId('5e4bbd2729f0360bdd60d1f8'),
                new ObjectId('5e4bc12729f0360bdd60d227'),
                new ObjectId('5e4bc86a18529c7a7a880b36'),
                new ObjectId('5e4bcf3218529c7a7a880b7f'),
                new ObjectId('5e4bd4ad18529c7a7a880bb5'),
                new ObjectId('5e4bd5d318529c7a7a880bcc'),
                new ObjectId('5e4bd5ce29f0360bdd60d314'),
                new ObjectId('5e4bd7bb29f0360bdd60d32c'),
                new ObjectId('5e4bd7be29f0360bdd60d32f'),
                new ObjectId('5e4bd7b629f0360bdd60d329'),
                new ObjectId('5e4be72b29f0360bdd60d3b6'),
                new ObjectId('5e4bead629f0360bdd60d3d6'),
                new ObjectId('5e4bf19429f0360bdd60d425'),
                new ObjectId('5e4bf1ab18529c7a7a880cd1'),
                new ObjectId('5e4bf40829f0360bdd60d44c'),
                new ObjectId('5e4bf40929f0360bdd60d44f'),
                new ObjectId('5e4bf90f18529c7a7a880d22'),
                new ObjectId('5e4bf95a18529c7a7a880d25'),
                new ObjectId('5e4c01a529f0360bdd60d4d7'),
                new ObjectId('5e4c01a218529c7a7a880d7d'),
                new ObjectId('5e4b5d0a8b03c9076e3bdb95'),
                new ObjectId('5e4b75978b03c9076e3bdce0'),
                new ObjectId('5e4aed3f8b03c9076e3bd6e5'),
                new ObjectId('5e4b76d38b03c9076e3bdcf5'),
                new ObjectId('5e4b765f8b03c9076e3bdceb'),
                new ObjectId('5e4b7b0c8b03c9076e3bdd34'),
                new ObjectId('5e4b7fe88b03c9076e3bdd9a'),
                new ObjectId('5e4b800d8b03c9076e3bdd9d'),
                new ObjectId('5e4b83a08b03c9076e3bdde8'),
                new ObjectId('5e4b91b08b03c9076e3bdea8'),
                new ObjectId('5e4b98428b03c9076e3bdf29'),
                new ObjectId('5e4ba9fd18529c7a7a8809d0'),
                new ObjectId('5e4bab9218529c7a7a8809e0'),
                new ObjectId('5e4baf0718529c7a7a880a0a'),
                new ObjectId('5e4bb6d129f0360bdd60d1b3'),
                new ObjectId('5e4bb6db29f0360bdd60d1b7'),
                new ObjectId('5e4bbdbd29f0360bdd60d201'),
                new ObjectId('5e4bc81929f0360bdd60d282'),
                new ObjectId('5e4bd54529f0360bdd60d310'),
                new ObjectId('5e4bd7b129f0360bdd60d326'),
                new ObjectId('5e4beb4e29f0360bdd60d3e9'),
                new ObjectId('5e4bebda18529c7a7a880c9e'),
                new ObjectId('5e4bec9d29f0360bdd60d3f2'),
                new ObjectId('5e4bfacf29f0360bdd60d49a'),
                new ObjectId('5e4bfd9218529c7a7a880d55'),
                new ObjectId('5e48287f8f9df23ae3788625'),
                new ObjectId('5e481a838b03c9076e3bb98c'),
                new ObjectId('5e481b7d8b03c9076e3bb98f'),
                new ObjectId('5e4831338b03c9076e3bba31'),
                new ObjectId('5e4831078b03c9076e3bba2b'),
                new ObjectId('5e4833438b03c9076e3bba62'),
                new ObjectId('5e483d668b03c9076e3bbace'),
                new ObjectId('5e483d5e8b03c9076e3bbac5'),
                new ObjectId('5e483d618b03c9076e3bbac8'),
                new ObjectId('5e484cb38b03c9076e3bbb58'),
                new ObjectId('5e4866f18b03c9076e3bbc7e'),
                new ObjectId('5e486eb08b03c9076e3bbcb1'),
                new ObjectId('5e487d7d8b03c9076e3bbcd5'),
                new ObjectId('5e4881c18b03c9076e3bbcd8'),
                new ObjectId('5e48a4618b03c9076e3bbd3d'),
                new ObjectId('5e48a75d8b03c9076e3bbd46'),
                new ObjectId('5e48d9168b03c9076e3bbe02'),
                new ObjectId('5e48ee498b03c9076e3bbee9'),
                new ObjectId('5e4917f88b03c9076e3bc06b'),
                new ObjectId('5e492c968b03c9076e3bc134'),
                new ObjectId('5e4965458b03c9076e3bc346'),
                new ObjectId('5e498e458b03c9076e3bc493'),
                new ObjectId('5e499b628b03c9076e3bc504'),
                new ObjectId('5e488b558b03c9076e3bbcec'),
                new ObjectId('5e488b4f8b03c9076e3bbce9'),
                new ObjectId('5e499d178b03c9076e3bc513'),
                new ObjectId('5e499f378b03c9076e3bc525'),
                new ObjectId('5e484f4b8b03c9076e3bbb73'),
                new ObjectId('5e49a6968b03c9076e3bc598'),
                new ObjectId('5e48b0d18b03c9076e3bbd59'),
                new ObjectId('5e48b1e68b03c9076e3bbd5e'),
                new ObjectId('5e492ea58b03c9076e3bc150'),
                new ObjectId('5e4930098b03c9076e3bc175'),
                new ObjectId('5e492f1e8b03c9076e3bc15d'),
                new ObjectId('5e492f628b03c9076e3bc160'),
                new ObjectId('5e492fcf8b03c9076e3bc16f'),
                new ObjectId('5e492e338b03c9076e3bc14d'),
                new ObjectId('5e49c9728b03c9076e3bc685'),
                new ObjectId('5e496c698b03c9076e3bc38b'),
                new ObjectId('5e49a7b28b03c9076e3bc5ad'),
                new ObjectId('5e495bfc8b03c9076e3bc2f5'),
                new ObjectId('5e486ba68b03c9076e3bbc99'),
                new ObjectId('5e485ddb8b03c9076e3bbc1b'),
                new ObjectId('5e49ab028b03c9076e3bc5c8'),
                new ObjectId('5e49b43d8b03c9076e3bc60a'),
                new ObjectId('5e49aab68b03c9076e3bc5c5'),
                new ObjectId('5e497f0f8b03c9076e3bc425'),
                new ObjectId('5e498e8a8b03c9076e3bc49c'),
                new ObjectId('5e488a638b03c9076e3bbce4'),
                new ObjectId('5e49858b8b03c9076e3bc466'),
                new ObjectId('5e49be288b03c9076e3bc64c'),
                new ObjectId('5e49c28e8b03c9076e3bc65e'),
                new ObjectId('5e49c3fd8b03c9076e3bc66d'),
                new ObjectId('5e48a3608b03c9076e3bbd37'),
                new ObjectId('5e4a6a768b03c9076e3bce0c'),
                new ObjectId('5e4a6afb8b03c9076e3bce21'),
                new ObjectId('5e4a6a3e8b03c9076e3bce05'),
                new ObjectId('5e4a7f948b03c9076e3bcfc5'),
                new ObjectId('5e4a6bcc8b03c9076e3bce41'),
                new ObjectId('5e4a80158b03c9076e3bcfcb'),
                new ObjectId('5e4a81858b03c9076e3bd007'),
                new ObjectId('5e4a7a398b03c9076e3bcf4f'),
                new ObjectId('5e4a7b7c8b03c9076e3bcf67'),
                new ObjectId('5e4a867a8b03c9076e3bd061'),
                new ObjectId('5e4a87dc8b03c9076e3bd08d'),
                new ObjectId('5e4a880a8b03c9076e3bd09e'),
                new ObjectId('5e4a983f8b03c9076e3bd1ca'),
                new ObjectId('5e4a9ad48b03c9076e3bd1f1'),
                new ObjectId('5e4a9cc68b03c9076e3bd202'),
                new ObjectId('5e4a9dbe8b03c9076e3bd220'),
                new ObjectId('5e4aa0258b03c9076e3bd251'),
                new ObjectId('5e4aa2988b03c9076e3bd295'),
                new ObjectId('5e4aa4338b03c9076e3bd2b0'),
                new ObjectId('5e4aa4928b03c9076e3bd2bc'),
                new ObjectId('5e4aabe68b03c9076e3bd341'),
                new ObjectId('5e4ab3118b03c9076e3bd3a8'),
                new ObjectId('5e4ac0938b03c9076e3bd474'),
                new ObjectId('5e49644d8b03c9076e3bc337'),
                new ObjectId('5e4a88748b03c9076e3bd0a5'),
                new ObjectId('5e4a89028b03c9076e3bd0ba'),
                new ObjectId('5e4a88e88b03c9076e3bd0b4'),
                new ObjectId('5e4a89c38b03c9076e3bd0c9'),
                new ObjectId('5e4a899d8b03c9076e3bd0c6'),
                new ObjectId('5e4a8bdc8b03c9076e3bd0f7'),
                new ObjectId('5e4a89088b03c9076e3bd0bd'),
                new ObjectId('5e397da8a8e15c6568f2fcb3'),
                new ObjectId('5e4a93968b03c9076e3bd17e'),
                new ObjectId('5e4a95b68b03c9076e3bd197'),
                new ObjectId('5e4775128b03c9076e3bb58b'),
                new ObjectId('5e4a60488b03c9076e3bcd1c'),
                new ObjectId('5e4812f48b03c9076e3bb94a'),
                new ObjectId('5e4a5fe08b03c9076e3bcd17'),
                new ObjectId('5e4ab10e8b03c9076e3bd38e'),
                new ObjectId('5e4a01bf8b03c9076e3bc7f5'),
                new ObjectId('5e4a91518b03c9076e3bd153'),
                new ObjectId('5e4757428b03c9076e3bb549'),
                new ObjectId('5e4a8f218b03c9076e3bd134'),
                new ObjectId('5e49f5298b03c9076e3bc7a7'),
                new ObjectId('5e4806458f9df23ae378854c'),
                new ObjectId('5e4c150318529c7a7a880e49'),
                new ObjectId('5e4c281618529c7a7a880ef1'),
                new ObjectId('5e4c3c8518529c7a7a880f71'),
                new ObjectId('5e4c19e318529c7a7a880e70'),
                new ObjectId('5e4c3ea129f0360bdd60d6d1'),
                new ObjectId('5e4c1ec529f0360bdd60d5c0'),
                new ObjectId('5e4b292e8b03c9076e3bd9f3'),
                new ObjectId('5e4c49ad29f0360bdd60d727'),
                new ObjectId('5e4c4f7718529c7a7a881000'),
                new ObjectId('5e4c560029f0360bdd60d773'),
                new ObjectId('5e4c5c5f29f0360bdd60d792'),
                new ObjectId('5e4c71c629f0360bdd60d7fc'),
                new ObjectId('5e4c8b5218529c7a7a881138'),
                new ObjectId('5e4c975d18529c7a7a88118e'),
                new ObjectId('5e4c375918529c7a7a880f41'),
                new ObjectId('5e4cd93f18529c7a7a8813b6'),
                new ObjectId('5e4cd95718529c7a7a8813bd'),
                new ObjectId('5e4cdaeb18529c7a7a8813e8'),
                new ObjectId('5e4c1f6329f0360bdd60d5cf'),
                new ObjectId('5e4c292418529c7a7a880efd'),
                new ObjectId('5e4c366029f0360bdd60d685'),
                new ObjectId('5e4c3d7029f0360bdd60d6c6'),
                new ObjectId('5e4c3fb318529c7a7a880f91'),
                new ObjectId('5e4c0cb818529c7a7a880dfd'),
                new ObjectId('5e4c08c729f0360bdd60d523'),
                new ObjectId('5e4c455c18529c7a7a880faf'),
                new ObjectId('5e4c4ea918529c7a7a880ffa'),
                new ObjectId('5e4c50ff29f0360bdd60d764'),
                new ObjectId('5e4c58e729f0360bdd60d787'),
                new ObjectId('5e4c596829f0360bdd60d78d'),
                new ObjectId('5e4c7e6c18529c7a7a881106'),
                new ObjectId('5e4ca5c518529c7a7a8811dc'),
                new ObjectId('5e4ca5c918529c7a7a8811df'),
                new ObjectId('5e4cbc8b29f0360bdd60d945'),
                new ObjectId('5e4cbc5718529c7a7a881234'),
                new ObjectId('5e4c36a318529c7a7a880f38'),
                new ObjectId('5e4cc4c018529c7a7a881287'),
                new ObjectId('5e4cdaf018529c7a7a8813eb'),
                new ObjectId('5e4cdaf418529c7a7a8813ee'),
                new ObjectId('5e4cdaf718529c7a7a8813f1'),
                new ObjectId('5e4b57ae8b03c9076e3bdb5d'),
                new ObjectId('5e4bfbdd18529c7a7a880d3c'),
                new ObjectId('5e4c469218529c7a7a880fb5'),
                new ObjectId('5e4c8bd029f0360bdd60d859'),
                new ObjectId('5e4c8c5f18529c7a7a88113b'),
                new ObjectId('5e4c8ccd18529c7a7a881144'),
                new ObjectId('5e4c956629f0360bdd60d87f'),
                new ObjectId('5e4cbc5529f0360bdd60d942'),
                new ObjectId('5e4c2bc729f0360bdd60d642'),
                new ObjectId('5e4cda1218529c7a7a8813d3'),
                new ObjectId('5e4cdaca18529c7a7a8813dc'),
                new ObjectId('5e4cda6f18529c7a7a8813d9'),
                new ObjectId('5e4cdf6318529c7a7a881440'),
                new ObjectId('5e4ce18618529c7a7a88146e'),
                new ObjectId('5e125643bec9b026a839f779'),
                new ObjectId('5e126e82f297d42f6892476e'),
                new ObjectId('5e126161f297d42f68924725'),
                new ObjectId('5e1247dcbec9b026a839f716'),
                new ObjectId('5e124837bec9b026a839f719'),
                new ObjectId('5e1261bfbec9b026a839f7cd'),
                new ObjectId('5e1256d5bec9b026a839f77f'),
                new ObjectId('5e12558df297d42f689246da'),
                new ObjectId('5e0f717df297d42f6892393b'),
                new ObjectId('5e0f81a4bec9b026a839ea1b'),
                new ObjectId('5e0f7b4ef297d42f68923984'),
                new ObjectId('5e0f7f7ebec9b026a839ea0d'),
                new ObjectId('5e0f957ef297d42f68923a49'),
                new ObjectId('5e0fb17cf297d42f68923b06'),
                new ObjectId('5e0fbb92bec9b026a839ebcb'),
                new ObjectId('5e0fbcc0f297d42f68923b3f'),
                new ObjectId('5e0fbd41f297d42f68923b4b'),
                new ObjectId('5e0fbe9bbec9b026a839ebe0'),
                new ObjectId('5e0fc32ff297d42f68923b63'),
                new ObjectId('5e0fbda0f297d42f68923b4e'),
                new ObjectId('5e0fb1d1f297d42f68923b0c'),
                new ObjectId('5e0fc475f297d42f68923b6c'),
                new ObjectId('5e0f6251bec9b026a839e980'),
                new ObjectId('5e0f7029bec9b026a839e9c8'),
                new ObjectId('5e0f6502f297d42f689238cb'),
                new ObjectId('5e0f81f7bec9b026a839ea1e'),
                new ObjectId('5e0f8d84bec9b026a839ea8d'),
                new ObjectId('5e0f8084f297d42f689239a0'),
                new ObjectId('5e0faf09bec9b026a839eb83'),
                new ObjectId('5e10bc1bbec9b026a839f076'),
                new ObjectId('5e135b27b51f7a4bf28d159a'),
                new ObjectId('5e135bc8b51f7a4bf28d15a1'),
                new ObjectId('5e136e4cb51f7a4bf28d162d'),
                new ObjectId('5e13780fb51f7a4bf28d1686'),
                new ObjectId('5e1377c9b51f7a4bf28d1683'),
                new ObjectId('5e137d8ca20d9d37ba81afbb'),
                new ObjectId('5e091889cc5c7f74916f72ce'),
                new ObjectId('5e14bc1da20d9d37ba81ba0d'),
                new ObjectId('5e162b0238cdec6804663ac6'),
                new ObjectId('5e150f51a20d9d37ba81bc59'),
                new ObjectId('5e14caecb51f7a4bf28d21b6'),
                new ObjectId('5e1613de38cdec6804663a1f'),
                new ObjectId('5e160d8e38cdec68046639fc'),
                new ObjectId('5e160e7c38cdec6804663a02'),
                new ObjectId('5e17559638cdec6804664378'),
                new ObjectId('5e17591538cdec680466439d'),
                new ObjectId('5e177ab1b51f7a4bf28d34dd'),
                new ObjectId('5e14e0c9a20d9d37ba81bb67'),
                new ObjectId('5e16339038cdec6804663aff'),
                new ObjectId('5e313c94dcacb677e09e75bf'),
                new ObjectId('5e2f236509b5ec201f89f095'),
                new ObjectId('5e4332f32a1d505792089e4e'),
                new ObjectId('5e1378c3a20d9d37ba81af84'),
                new ObjectId('5e16184b38cdec6804663a46')
              ]
            },
            'nsp': '/sbtjapaninquiries.com'
          }
        },
        {
          '$project': {
            '_id': 1,
            'clientID': 1,
            'subject': 1,
            'assigned_to': 1,
            'group': 1,
            'datetime': 1
          }
        },
        {
          '$group': {
            _id: '$group',
            count: {
              $sum: 1
            }
          }
        },
        {
          '$sort': {
            '_id': 1
          }
        }
      ]).toArray();
      let promise2 = this.collection.aggregate([
        {
          '$match': {
            'datetime': {
              '$gte': '2020-01-01',
              '$lte': '2020-02-20'
            },
            'visitor.email': new RegExp('no-reply'),
            'nsp': '/sbtjapaninquiries.com',
            'group': {
              '$in': [
                'DOMINICAN REPUBLIC.D ( All Counties )', 'Australia Inquires', 'Sri Lanka Inquires', 'Zimbabwe Inquires', 'Tanzania Inquires', 'Bangladesh Inquires', 'Kenya Inquires', 'ENGLAND (EUROPE)', 'CONGO Inquries', 'TRINIDAD (CARIB)', 'UAE Inquires', 'New Zealand Inquires', 'Paraguay Inquires', 'BAHAMAS (CARIB)', 'Uganda Inquires', 'Dominican Republic Inquires', 'Mozambique Inquires', 'Namibia Inquires', 'SURINAME (CARIB)', 'JAMAICA (CARIB)', 'Pakistan Inquires', 'CHILE (LATIN AMERICA)', 'Lesotho Inquires', 'South Africa Inquires', 'TURKS AND CAICOS (CARIB)', 'IRELAND (EUROPE)', 'Malawi Inquires', 'CYPRUS (EUROPE)', 'Zambia Inquires', 'West Africa French', 'GUYANA (CARIB)', 'Swaziland Inquires', 'LHD - CARIB LATIN', 'Oceania Inquires', 'South Sudan', 'China Operations', 'MAURITIUS (EUROPE)', 'Botswana Inquires', 'MALTA (EUROPE)', 'West Africa English', 'RUSSIA Inquires', 'UK Inquires'
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$group',
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ]).toArray();
      return await Promise.all([promise1, promise2]);
    } catch (error) {
      console.log(error);

    }
  }

  public static async getCustomData2() {
    try {
      let ticketIDs = [
        'FKZfK',
        'OQUzZ',
        'Mybma',
        'e6PeP',
        'QIAtu',
        'MQWfF',
        'iXXGs',
        'jMgrA',
        't0AS5',
        'eYHnQ',
        '9MScR',
        '9wsO9',
        'OozDh',
        'O0hgQ',
        'mfNOY',
        'FXOAh',
        'jrXdZ',
        '2tGNF',
        'BwNEi',
        'lvrln',
        'cPfgc',
        'hOBDD',
        '1MC9x',
        '67OQh',
        'gppaQ',
        'Nv0O0',
        'K3xMn',
        'bBSvl',
        'xSLmO',
        '88kiQ',
        'Lj9d5',
        'LpEr3',
        'Oi6xX',
        'ddvuJ',
        'vhO24',
        'uVlpz',
        '4jwmt',
        '7rb3b',
        '6t5TA',
        '4ibOv',
        'bjTvj',
        'xK6KA',
        'me0vs',
        'Ti1Sr',
        'v4i0v',
        'qjLxd',
        '5JWU8',
        'QxVoU',
        'BmXfc',
        'PnDLD',
        'p9PQC',
        'SsoB4',
        'xZiip',
        'ThFhT',
        'fdvqN',
        'GWjmV',
        'XeyTW',
        'bfx6D',
        'kMAXq',
        'jJy6g',
        'V2F1B',
        'kOl3d',
        'JHLhK',
        'Vf2MR',
        'L8Fja',
        'wzhxe',
        'hFyfe',
        '6h2R1',
        '104SI',
        'nL0dB',
        'QQeQi',
        '7cemq',
        'ey7Y6',
        'CgXXb',
        'gb4XX',
        'oxZ0B',
        'npn6p',
        'IwQei',
        'KzpAe',
        'CLVxe',
        'y0dXt',
        'CciSx',
        'XnLjT',
        'ikpxi',
        '2imS5',
        'LVdH9',
        '49a4l',
        'ZES3G',
        '8NDFU',
        'J2otK',
        '2lgib',
        '75fVH',
        'lIRBW',
        'ig0Zp',
        'TrBrM',
        'nDCz7',
        'yRBmE',
        'CHeE1',
        'ikTn1',
        'OAdP6',
        'hlH23',
        'dnYUZ',
        'Q0F67',
        'gvrpD',
        'BlcWq',
        'zvBeE',
        'SGHrv',
        'Z3qo5',
        'oSa1V',
        'g8sej',
        'XV6m2',
        '6klSJ',
        '67FXr',
        'yz7Ux',
        'roXQU',
        'ywqO7',
        'Wib0P',
        '8wQLT',
        'WFjrs',
        '4aMmR',
        'p9da1',
        'ykSys',
        'W62Co',
        'qlrWG',
        'zYTlp',
        'lB2Kz',
        'A1ayd',
        'nVJj7',
        '2jxTI',
        'XOsY8',
        '0DcZ3',
        'tDMfK',
        'WV6wa',
        '7acqT',
        'KHOOx',
        'FMaxs',
        'iwrco',
        'rzpOe',
        'f3ltM',
        'L5AZr',
        'z4AP7',
        'LQ4XO',
        'iAe07',
        'g18H8',
        'XBPua',
        'Yms1M',
        'EypMs',
        'rsc1u',
        'YBc2b',
        'YlqwO',
        'JfWoE',
        'df7Lq',
        'LSiHl',
        'HCBGt',
        'YiF7r',
        'Qyqxc',
        'Jpepg',
        'j2VSS',
        'X6BQk',
        '9CGNh',
        'NfhLJ',
        'aa9Bt',
        'r6L2i',
        'sHYIc',
        'gNfhs',
        'bh237',
        'pnLTU',
        'oEWj2',
        'x5Mlu',
        '6pspb',
        '53Pri',
        'Kyayd',
        '04FT6',
        '1k7et',
        'PKunt',
        '1yqN2',
        'gh1E5',
        '5ClIb',
        'u8IN9',
        'bD9hZ',
        'PqXHp',
        'PuBmW',
        'NGKRF',
        'a4i8U',
        'FKrUZ',
        'kmDz8',
        'NPGvW',
        'Qkhwa',
        'JQKmo',
        'YwVMx',
        'cQlKl',
        'jjQFE',
        'VPjQZ',
        'yOLLC',
        'eZsEa',
        'GRQIz',
        'UuIsb',
        'EX4vF',
        '7aq04',
        'o0jqb',
        'uZ8H3',
        '5geI7',
        'QsAs7',
        'ar243',
        '5JyFJ',
        'waLvw',
        'Q5Ug0',
        'Naaa1',
        'D40Dw',
        'bMuVW',
        'mSlVw',
        'PjrMi',
        'RbHux',
        'aBmCe',
        'aez2G',
        'rKIgK',
        'Ilskd',
        'ynMLr',
        'uVrvb',
        '2Nmmd',
        'jUJ48',
        'vmdTH',
        'hyDHr',
        '6z6f8',
        'RHvjy',
        'os4pZ',
        '92VqH',
        'BAJHW',
        'FWAVo',
        'VNAVQ',
        '4pyEA',
        'jAD0w',
        'mYAXm',
        'Tqdzd',
        'AmGJm',
        'I6rHO',
        'QrRp7',
        '2opSM',
        'T8OrM',
        'MWNIo',
        '1q5cg',
        'DfoK1',
        'JmtHt',
        'xOUMO',
        'FeiIO',
        'w0LUv',
        '86Vzh',
        'zU5uQ',
        'gQkYN',
        'YWnOE',
        't9GmL',
        '9KLtc',
        'STtHa',
        '8AtTo',
        'a4INp',
        'RD9Um',
        'v4WAg',
        'hkuSM',
        'rfv6F',
        'aFcIk',
        'M8UqH',
        'PfzNN',
        'SEJe7',
        '9EbOi',
        'Hz7F3',
        'A7pmC',
        'EppPa',
        'AXH7a',
        'VFAQE',
        'A6OBF',
        'ncirg',
        'niEUt',
        'JwFUw',
        '8O7MN',
        '5JVRx',
        'QqTQp',
        'utdYi',
        'NFRkw',
        'quujp',
        'SrhBy',
        'OywK0',
        'SoVbZ',
        'puQut',
        'MTeTx',
        '0pFYU',
        'iNnEr',
        'HR9MX',
        'cscnp',
        'eEBA3',
        'b4Diq',
        'mSRGY',
        'pqKoM',
        'OHQpi',
        '2XgWI',
        'Rm6dZ',
        'jEFdn',
        'WYNWA',
        '7fYNq',
        'eASmX',
        'MUlIk',
        '7yBpU',
        'Trhkd',
        'p5PrF',
        'tFS7P',
        'KP1Kc',
        'NVpGA',
        '4Xa63',
        'QgvSR',
        'Br41Z',
        'cVQto',
        'IUVN0',
        '3NPsO',
        '5JLf1',
        'XkSrs',
        'zRmB7',
        '1lCkf',
        'Vx9Zk',
        'la95n',
        'kvqYl',
        'xwJ49',
        'eGFzE',
        'lNr1m',
        'qnzz0',
        '4pXOW',
        'u6Uaq',
        'TAp4o',
        'rIexI',
        'LFiCD',
        'lAwBe',
        'K6w5A',
        'at7Tb',
        'wYcRe',
        'qRHVH',
        'IT0nN',
        'BuFti',
        '82eSj',
        '6rGKF',
        '1xxDm',
        'MclEh',
        'Kf2fD',
        '8WnuX',
        'enfjV',
        'S0Rv9',
        'loidC',
        '0yz9O',
        'huhQe',
        'ro6MJ',
        'sUXQ7',
        'sABJA',
        'HURjg',
        'kbBz6',
        'ezthw',
        'Pu76q',
        '9bClz',
        'gZcXx',
        'zRXr3',
        'KnLsK',
        'ng8Bb',
        'zAzhA',
        'WjsCH',
        'XvMRV',
        'u2Lmc',
        'y69oA',
        'Atwai',
        'g7Oxm',
        'phA1T',
        'I9NWS',
        'Kiiww',
        'dtrBV',
        'TEUT2',
        'GOB9y',
        'wgg5I',
        'NvR8z',
        'GBvsN',
        'ByInW',
        'jdNUY',
        'w7tp6',
        'riIts',
        'NFLHi',
        'pL9J2',
        'FhxpG',
        'SWcZv',
        '7d1Li',
        'wqgIQ',
        'm1nMl',
        'cRsUQ',
        'rESQV',
        'hefta',
        'nhtF5',
        '7KREU',
        'XKtdg',
        'mRtwk',
        'JfDKv',
        'InJ5q',
        '2Ap83',
        '44NoV',
        'cY55Y',
        'Gzh4b',
        'PgDA5',
        '0qgaz',
        'Z1ngs',
        '7uaTY',
        '5FT4J',
        'Xo2Bg',
        'kE8DO',
        'tVAC7',
        'tYdIv',
        'ASgBn',
        'iyOxY',
        'LtH1H',
        'DmPVE',
        'I5QIq',
        '9i938',
        'G2z4N',
        'hK2DO',
        'TGJ8p',
        '6nEqp',
        'OnoA7',
        '9BKTv',
        'QA4K6',
        '3LCW4',
        'fvvvG',
        'MKCtM',
        'G5SvR',
        'y3kDT',
        'c7Oow',
        'v8suX',
        'OOcAw',
        'S1Axw',
        'LJRtb',
        'bzID0',
        'jS8ar',
        'QCJl2',
        'W4WWa',
        'J2NtD',
        'DZOpG',
        'zdVPC',
        '3ulmJ',
        '8sDla',
        'ycWnK',
        'STFZo',
        'av0HI',
        'vmeNY',
        '7X19m',
        'C9uM7',
        'jBSN6',
        'kYW0w',
        'udXn9',
        'tmrac',
        'c37Rs',
        'sKcaI',
        'pIXxt',
        'Leune',
        'F5hJC',
        'CniWP',
        'skXAw',
        'ElM9n',
        'zN2vv',
        'EKPVV',
        'r6koq',
        'R4BPS',
        'nQDb6',
        'kfsM4',
        'Gy6am',
        'XPGUc',
        'u6hww',
        'sEyfW',
        'aiQR7',
        '1G5Ng',
        '9IfmX',
        'wV7uj',
        '9iSJj',
        '0PNCB',
        'hwYGD',
        'JTpD5',
        '6oGXn',
        'ybWTZ',
        'iE2sN',
        'scJgQ',
        'pYeil',
        'Jceh0',
        'x4IDV',
        'w0FCa',
        'thDrs',
        's2qP3',
        'Xl5x9',
        'SydfF',
        's7Xjg',
        'XOtvF',
        'OpcTJ',
        'bd78V',
        'O9Jo6',
        'jYsrG',
        'oA3Du',
        'bZdtj',
        'Cl5eh',
        '05UTM',
        'ucOXq',
        'isFc7',
        '6XDOI',
        'uARoT',
        'RLnGZ',
        'WBfsS',
        'Kq5Bp',
        '5kbj7',
        'xThXH',
        'uZ59G',
        '84vRg',
        'qZlya',
        'LapgQ',
        'rwk02',
        'OZZ1S',
        'cb3w4',
        'Rm3fZ',
        '831XA',
        'KsyLz',
        'WVcc5',
        'tWdaP',
        'V3tnA',
        'BcmFt',
        'Q8uRZ',
        'hBTkm',
        'wOkTF',
        'tDg82',
        'en0jJ',
        '51qyS',
        'Obxrx',
        'oREzT',
        'w6TB5',
        'pf7XZ',
        'N3QjU',
        'nLmEY',
        '26KQW',
        'YrGV3',
        '323GX',
        'cBYpb',
        'k78ok',
        'eX0tb',
        'bWXu5',
        'A5wyI',
        'mT1qj',
        'wIWVv',
        '9VjWW',
        'Dug8D',
        'GoKHn',
        'OkceN',
        'pgTP3',
        'RBKdk',
        'Blllw',
        'ZBZC9',
        'JoKgn',
        'VbXK2',
        'xoe8h',
        'FAIlr',
        '1yYGv',
        'YvlKv',
        'DWEMr',
        'daoI7',
        '1Ssp1',
        '9ZqEh',
        'ECHDm',
        '0uHl3',
        'KCjrf',
        't6X6j',
        'QS4j9',
        'MBm0F',
        'eI41r',
        'muQMA',
        '1OQqJ',
        'zGtvU',
        '4VRkt',
        'cYTC0',
        '9XbOG',
        'U8NkG',
        'FUA9J',
        '1AvvN',
        'NL7aK',
        'qbZgl',
        '207Qo',
        'mnSZJ',
        'FcTtA',
        'rXX4b',
        'PSBm8',
        'KnTxw',
        'hFQDt',
        'kp7GR',
        'Ji31S',
        'LZD16',
        'NmD98',
        'ZgQuV',
        'CXzBF',
        'bd5CO',
        'heLCW',
        'hsezX',
        '2Oatu',
        'ZXbLR',
        'nInjM',
        'orOAf',
        '3LLzr',
        'fc5PU',
        '848lL',
        'eOb4c',
        '4M7os',
        'EyDGt',
        'muhkz',
        'biuVc',
        'tstOP',
        'E04Fp',
        '22mAm',
        'wJMXi',
        'MW65m',
        '9dpu9',
        'gsdWi',
        'dz1CA',
        'Sbbav',
        'nkcQr',
        'BLpHi',
        'lwO0I',
        'N2KEO',
        'AZrM7',
        'FtkVa',
        'LRz7n',
        '2dQ4g',
        'eqd1h',
        '2Ph6X',
        'KGKOs',
        'HkzzV',
        'SheQU',
        'KTyjD',
        '61nXL',
        'afXCn',
        'B9KJG',
        'ddeLx',
        'VXI7M',
        'JSHfP',
        'nT5fX',
        'bTJnY',
        'LV2PV',
        'tRwof',
        'xJWDq',
        'VhUbo',
        'VfGfj',
        'KajZl',
        'PlTfh',
        'W1yCP',
        'alVCs',
        'qhAdB',
        'aeA4J',
        'h0P9i',
        '0fpLZ',
        'jmHG2',
        'TtAkZ',
        '6zxPg',
        'L0ZMS',
        'Goijc',
        'rQ56e',
        'U9DBg',
        'AmRG2',
        '6dJMG',
        '15Ow2',
        'J5ssq',
        '9i3GO',
        'F7gPy',
        'kuuYd',
        'wLL9S',
        'gQ1Lk',
        'EF5vg',
        'qeMDF',
        'oUQ9K',
        'yAMz5',
        'b7Iu0',
        'XXx69',
        'STYeM',
        'cS0LS',
        'IHn3F',
        'XqD1w',
        'IfMTK',
        'rIuD0',
        'xm1eB',
        'kV5OZ',
        'zqmzb',
        '2VtEw',
        'dRBwC',
        'wa8E6',
        'NGvop',
        'lT2td',
        'tyV6D',
        'ATyDJ',
        '01jeW',
        'vqwPU',
        'eOe0X',
        'lU0Wn',
        'lh3tU',
        'RDovL',
        'Ekso5',
        'oWLPx',
        'FM1yi',
        'DgY0p',
        'X55OY',
        'zNAlR',
        'HcsWa',
        '9StDj',
        'Kl2dp',
        'cgGrl',
        'liS6U',
        'kk0zi',
        'Ynepu',
        'aI8uW',
        'LCmqJ',
        'o40tj',
        'MbrXF',
        'GBAaN',
        '0J71b',
        '5yHJp',
        'udbgX',
        '7yWdU',
        'PLsP4',
        'jNEO8',
        'df3UR',
        'IZF8L',
        'BR5De',
        'uq66H',
        'b73ZT',
        'prIZC',
        '9YSoC',
        'Ay61t',
        'L5kWP',
        'ZQvpI',
        '0S66i',
      ];
      let tickets = await this.collection.aggregate([
        {
          '$match': {
            clientID: { $in: ticketIDs }
            // "visitor.email": /no-reply/,
            // group: {
            //     $eq: ''
            // }
          }
        },
        // {
        //     '$addFields': {
        //         "month" : {
        //             $month: {
        //                 date: {
        //                     $dateFromString: {
        //                         dateString: '$datetime'
        //                     }
        //                 },
        //                 timezone: 'Asia/Karachi'
        //             }
        //         }
        //     }
        // },
        // {
        //     '$match': {
        //         month: 3
        //     }
        // },
        {
          '$project': {
            _id: 1,
            clientID: 1,
            group: 1,
            datetime: 1,
            assigned_to: 1
          }
        },
        {
          '$sort': {
            datetime: 1
          }
        }
      ]).toArray();
      console.log('Tickets to Process: ' + tickets.length);
      // let TIDs = tickets.map(t => new ObjectId(t._id));
      // console.log('Ticket IDs converted to ObjectIds');
      // console.log('Fetching messages...');
      var i, j, temparray, chunk = 10000;
      for (i = 0, j = tickets.length; i < j; i += chunk) {
        console.log('Fetching messages for tickets ' + i + ' - ' + (i + chunk));
        temparray = tickets.slice(i, i + chunk);
        let TIDs = temparray.map(t => new ObjectId(t._id));
        // do whatever
        let tempMessages = await this.db.collection('ticketMessages').find({ tid: { $in: TIDs } }).toArray();
        // DBMessages = DBMessages.concat(tempMessages);
        console.log('Messages to process: ' + tempMessages.length);
        temparray.map((ticket, index) => {
          if (!ticket.assigned_to) ticket.assigned_to = '';
          ticket.customerDetails = [];
          let messages = tempMessages.filter(m => m.tid[0].toString() == ticket._id);
          let cmDetail = '';
          let customerPhone = '';
          messages.forEach((message, mIndex) => {
            // console.log(message.message);
            console.log('processing ticket#' + (index + 1) + ' (' + ticket.clientID + ')' + ' message #' + (mIndex + 1) + ' ' + message._id.toString());
            let $ = cheerio.load(message.message);
            let blockquote = $('blockquote').find('span h3');
            let p = $('body h3');
            if (blockquote.length) {
              if (($(blockquote[0]) as any).html() && ($(blockquote[0]) as any).html().split(':').length == 2) cmDetail += 'Customer ID: ' + ($(blockquote[0]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[1]) as any).html() && ($(blockquote[1]) as any).html().split(':').length == 2) cmDetail += 'Customer Email: ' + ($(blockquote[1]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[2]) as any).html() && ($(blockquote[2]) as any).html().split(':').length == 2) cmDetail += 'Customer Phone: ' + ($(blockquote[2]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[2]) as any).html() && ($(blockquote[2]) as any).html().split(':').length == 2) customerPhone += ($(blockquote[2]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[3]) as any).html() && ($(blockquote[3]) as any).html().split(':').length == 2) cmDetail += 'Country Name: ' + ($(blockquote[3]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[4]) as any).html() && ($(blockquote[4]) as any).html().split(':').length == 2) cmDetail += 'City Name: ' + ($(blockquote[4]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(blockquote[5]) as any).html() && ($(blockquote[5]) as any).html().split(':').length == 2) cmDetail += 'Sales Person: ' + ($(blockquote[5]) as any).html().replace('<', '').split(':')[1].trim() + '\n\n';
            }
            else if (p.length) {
              if (($(p[0]) as any).html() && ($(p[0]) as any).html().split(':').length == 2) cmDetail += 'Customer ID: ' + ($(p[0]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[1]) as any).html() && ($(p[1]) as any).html().split(':').length == 2) cmDetail += 'Customer Email: ' + ($(p[1]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[2]) as any).html() && ($(p[2]) as any).html().split(':').length == 2) cmDetail += 'Customer Phone: ' + ($(p[2]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[2]) as any).html() && ($(p[2]) as any).html().split(':').length == 2) customerPhone += ($(p[2]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[3]) as any).html() && ($(p[3]) as any).html().split(':').length == 2) cmDetail += 'Country Name: ' + ($(p[3]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[4]) as any).html() && ($(p[4]) as any).html().split(':').length == 2) cmDetail += 'City Name: ' + ($(p[4]) as any).html().replace('<', '').split(':')[1].trim() + '\n';
              if (($(p[5]) as any).html() && ($(p[5]) as any).html().split(':').length == 2) cmDetail += 'Sales Person: ' + ($(p[5]) as any).html().replace('<', '').split(':')[1].trim() + '\n\n';
            }
          });
          ticket.customerDetails.push(cmDetail);
          ticket.customerPhone = customerPhone
        });
        var xls = json2xls(temparray);
        console.log('Writing File for tickets ' + i + ' - ' + (i + chunk));
        fs.writeFileSync('D:\\SBT\\TicketsData\\Tickets_#' + i + '-' + (i + chunk) + '.xlsx', xls, 'binary');
        console.log('Done!');
      }
    } catch (err) {
      console.log(err);
    }
  }

  public static async RevertScenario(tids, nsp, ticketlog) {
    let objectIdArray = tids.map(s => new ObjectId(s));
    let ticket = await this.collection.find({ _id: objectIdArray[0], nsp: nsp }).project({ previousTicketState: 1 }).limit(1).toArray();
    ticket[0].previousTicketState.ticketlog.push(ticketlog);
    return await this.collection.findOneAndReplace(
      { _id: objectIdArray[0], nsp: nsp }, (ticket[0].previousTicketState), { upsert: false, returnOriginal: false });
  }

    public static async getAllTickets(nsp, dateFrom, dateTo) {

        try {
            let result = await this.collection.aggregate([
                {
                    "$match": {
                        "nsp": nsp,
                        "datetime": {
                            "$gte": dateFrom,
                            "$lt": dateTo
                        }
                    }
                },
                {
                    "$project":
                    {
                        "data": { $substr: ["$datetime", 0, 10] }
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

}


        // let temp = await this.collection.updateMany({ _id: { $in: objectIdArray } },
        //     {
        //         $push: { ticketlog: ticketlog }
        //     },
        //     { $set: { obj : obj } }, { upsert: false });