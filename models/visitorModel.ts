
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection, InsertOneWriteOpResult, Timestamp, ObjectID, ObjectId } from "mongodb";
import { VisitorSchema } from '../schemas/visitorSchema';
import * as _ from 'lodash';
import { VisitorSessionSchema } from "../schemas/VisitorSessionSchema";
import { ArchivingDB } from "../globals/config/databses/Analytics-Logs-DB";
import { TicketSchema } from "../schemas/ticketSchema";

export class Visitor {


  static db: Db;
  static collection: Collection;
  static leftVisitor: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await ArchivingDB.connect();
      this.collection = await this.db.createCollection('visitors')
      this.leftVisitor = await this.db.createCollection('leftVisitors')
      console.log(this.collection.collectionName);
      console.log(this.leftVisitor.collectionName);

      Visitor.initialized = true;
      return Visitor.initialized;
    } catch (error) {
      console.log('error in Initializing Visitor Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections


  }






  // -------------------------------x---------------------------------------------------x ||
  //                              Functions operatiing on Databases
  //--------------------------------x---------------------------------------------------x ||

  public static getVisitorsByID(): number {
    return 0;
  }
  public static async getVisitorsByName(name: string) {
    try {
      return await this.collection
        .find({ username: name })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public static async getVisitorsByEmail(email: string) {
    try {
      return await this.collection
        .find({ userEmail: email })
        .limit(1)
        .toArray();
    } catch (error) {
      console.log(error);
      throw new Error("Can't Find Agent In Exists");
    }
  }

  public static async visitorExists(nsp, userEmail: string): Promise<boolean> {
    // //console.log(this.collection);
    try {
      return !!(await this.collection
        .find({ nsp: nsp, email: userEmail })
        .limit(1)
        .toArray()).length;
    } catch (error) {

      throw new Error("Can't Find Visitor In Exists");
    }
  }
  public static async insertVisitor(params: any, nsp?: string): Promise<InsertOneWriteOpResult<any>> {
    try {
      let visitor: VisitorSchema = {
        "username": params.username,
        "email": params.email,
        "createdDate": new Date().toISOString(),
        "location": params.location,
        "count": 1,
        "ipAddress": params.ipAddress,
        "deviceID": params.deviceID,
        "sessions": [],
        "nsp": nsp,
        "phone": params.phone
      }
      return await this.collection.insertOne(JSON.parse(JSON.stringify(visitor)));
    }
    catch (error) {
      throw new Error("Can't Insert Visitor");
    }

  }

  public static async visitorDeviceIDExists(userDeviceID: string): Promise<boolean> {
    // //console.log(this.collection);
    try {
      return !!(await this.collection
        .find({ deviceID: userDeviceID })
        .limit(1)
        .toArray()).length;
    } catch (error) {

      throw new Error("Can't Find Visitor Device ID In Exists");
    }

  }

  //Addtoset method doesn't add if exists while push add the value whether it exists or not

  // public static UpdateVisitorSessionByDeviceID(userDeviceID, sessionid) {
  //     try {
  //         return this.collection.findOneAndUpdate({ deviceID: userDeviceID }, {
  //             $push: {
  //                 sessions: sessionid
  //             }
  //         }, { returnOriginal: false, upsert: true });
  //     } catch (error) {
  //         console.log(error);
  //         console.log('error in Insert Automated Message');
  //     }
  // }

  public static UpdateVisitorSessionByDeviceID(userDeviceID, sessionid) {
    try {
      return this.collection.findOneAndUpdate(
        {
          deviceID: userDeviceID,
        },
        {
          $addToSet: { sessions: sessionid }
        }, { returnOriginal: false, upsert: false, });
    } catch (error) {
      console.log('Error in Updating Sessions');
      console.log(error);
    }
  }

  public static async getVisitorSessionsByDeviceID(userDeviceID) {

    try {
      return this.collection.find(
        {
          deviceID: userDeviceID
        },
        {
          fields: {
            sessions: 1
          }
        })
        .toArray();
    } catch (error) {
      console.log('Error in Getting Sessions');
      console.log(error);
    }
  }

  public static async getVisitorByDeviceID(userDeviceID) {

    try {
      return this.collection.find({ deviceID: userDeviceID }).limit(1).toArray();
    } catch (error) {
      console.log('Error in Getting Sessions');
      console.log(error);
    }
  }




  public static async UpdateVisitor(userDeviceID, visitor) {
    let obj: any = {};
    Object.assign(obj, visitor);
    // console.log("Update Visitor");
    // console.log(visitor);
    delete obj._id;
    let updatedVisitor = await this.collection.update(
      { deviceID: userDeviceID },
      { $set: JSON.parse(JSON.stringify(obj)) },
      {
        upsert: false,
        multi: false
      }
    );
    if (updatedVisitor && updatedVisitor.result) return updatedVisitor.result;
    else return undefined;
  }


  public static async UpdateVisitorInfoByDeviceID(userDeviceID, data) {
    try {

      //console.log('updating visitor info');

      if (data.phone) return this.collection.findOneAndUpdate(
        { deviceID: userDeviceID },
        {
          $set: {
            username: data.username,
            phone: data.phone,
            email: data.email
          }
        }, { returnOriginal: false, upsert: false });

      else return this.collection.findOneAndUpdate(
        { deviceID: userDeviceID },
        {
          $set: {
            username: data.username,
            email: data.email
          }
        }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Update Visitor Conversation by Device ID');

    }
  }

  public static async UpdateVisitorInfoById(id, data) {
    try {
      return this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            username: data.username,
            phone: data.phone,
            email: data.email,
            location: data.location
          }
        }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Update Visitor Conversation by Device ID');

    }
  }

  public static async UpdateContactDetailsByDeviceID(userDeviceID, username, phone, email) {
    try {
      return this.collection.findOneAndUpdate(
        { deviceID: userDeviceID },
        {
          $set: {
            username: username,
            phone: phone,
            email: email
          }
        }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
      console.log('Error in Update Visitor Conversation by Device ID');

    }
  }

  //-------------------------------x-------------------------------------------------------x ||
  //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
  //--------------------------------x------------------------------------------------------- ||

  public static NotifyAll(session): string {
    return 'Visitors' + session.location;
  }

  public static async DeleteVisitor(id) {

    try {
      return await this.collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.log('Error in deleting customer');
      console.log(error);
    }
  }

  public static BraodcastToVisitors(): string {
    return 'Visitors';
  }

  public static NotifyOne(session: VisitorSessionSchema): string {
    try {
      switch (session.type) {
        case 'Visitors':
          return (session._id as string) || (session.id as string);
        default:
          return '';
      }
    } catch (error) {
      console.log('Error in Notify One Visitors');
      // console.log;
      return '';
    }
  }

  //CRM Events

  public static async getAllVisitors(nsp, exclude?: string) {
    try {
      // console.log(session)
      let visitorList = await this.collection.find({ nsp: nsp }).sort({ _id: -1 }).limit(20).toArray();
      if (visitorList.length) return visitorList
      else return [];

    } catch (error) {
      console.log('Error in Sending Visitors List');
      console.log(error);
    }
  }

  public static async getMoreCustomersByCid(session, id) {

    //new ObjectID()
    try {
      return await this.collection.aggregate([
        { "$match": { "nsp": session.nsp } },
        { "$sort": { _id: -1 } },
        { "$match": { "_id": { $lt: new ObjectID(id) } } },
        { "$limit": 15 }
      ]).toArray();
      // return await this.collection.find({ nsp: session.nsp, _id: { $lt: new ObjectID(id) } }).sort({ _id: -1 }).limit(15).toArray();
    }
    catch (error) {
      console.log('Error in Getting more customers');
      console.log(error);
      return [];
    }
  }

  public static async getFilteredVisitors(nsp, dateFrom, dateTo, location, source, group, chunk = '') {
    try {
      let visitorList: any[] = [];
      let match: any = {};
      let groups: any = {};
      let project = {
        _id: '$id',
        username: '$username',
        email: '$email',
        createdDate: '$createdDate',
        location: '$location',
        count: '$count',
        deviceID: '$deviceID',
        sessions: '$sessions',
        nsp: '$nsp',
        phone: '$phone'
      };
      if (chunk != '') {
        match._id = {
          "$lt": new ObjectId(chunk)
        };
      }
      if (nsp) {
        match.nsp = nsp;
      }
      if (dateFrom && dateTo) {
        match.createdDate = {
          "$gte": dateFrom,
          "$lt": dateTo
        };
      }
      if (location) {
        match.location = { "$in": location };
      }
      if (source == 'Email') {
        match.deviceID = { $exists: false };
      } else if (source == 'Device') {
        match.deviceID = { $exists: true };
      }
      if (group == 'Email') {
        groups._id = '$email';
        groups.id = { $first: '$_id' },
          groups.username = { $first: '$username' },
          groups.email = { $first: '$email' },
          groups.createdDate = { $first: '$createdDate' },
          groups.location = { $first: '$location' },
          groups.count = { $first: '$count' },
          groups.deviceID = { $first: '$deviceID' },
          groups.sessions = { $first: '$sessions' },
          groups.nsp = { $first: '$nsp' },
          groups.phone = { $first: '$phone' }
      } else if (group == 'Device') {
        groups._id = '$deviceID',
          groups.id = { $first: '$_id' },
          groups.username = { $first: '$username' },
          groups.email = { $first: '$email' },
          groups.createdDate = { $first: '$createdDate' },
          groups.location = { $first: '$location' },
          groups.count = { $first: '$count' },
          groups.deviceID = { $first: '$deviceID' },
          groups.sessions = { $first: '$sessions' },
          groups.nsp = { $first: '$nsp' },
          groups.phone = { $first: '$phone' }
      }

      let query: any = [];
      if (Object.keys(match).length != 0 && Object.keys(groups).length != 0) {
        query = [
          { '$match': match },
          { '$group': groups },
          { '$project': project }
        ]
      } else if (Object.keys(match).length != 0 && Object.keys(groups).length == 0) {
        query = [
          { '$match': match }
        ]
      } else if (Object.keys(match).length == 0 && Object.keys(groups).length != 0) {
        query = [
          { '$group': groups },
          { '$project': project }
        ]
      }
      visitorList = await this.collection.aggregate(query).sort({ _id: -1 }).limit(20).toArray();
      visitorList.map(visitor => {
        visitor.id = visitor._id;
      })
      if (visitorList.length) return visitorList
      else return [];
    } catch (error) {
      console.log(error);
      console.log('error in getting filtered visitors');
    }
  }


  public static async InsertLeftVisitor(nsp, session) {
    try {

      let updated = await this.leftVisitor.findOneAndUpdate(
        { nsp: nsp },
        {
          $push: { "session": { $each: [session], $slice: -30 } },
        },
        { returnOriginal: false, upsert: true })
      // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
      return updated;

    } catch (error) {
      console.log(error);
      console.log('error in inserting LeftVisitor');
    }
  }

  public static async GetLeftVisitors(nsp) {
    try {

      let leftVisitors = await this.leftVisitor.find({ nsp: nsp }).limit(1).toArray();
      if (leftVisitors.length) return leftVisitors[0].session
      else return [];

    } catch (error) {
      console.log(error);
      console.log('error in Getting LeftVisitor');
      return [];
    }
  }

  public static async GetBannedVisitorByDeviceID(nsp, userDeviceID) {

    try {
      return this.collection.find({
        nsp: nsp,
        deviceID: userDeviceID, $and: [
          { banned: { $exists: true } },
          { banned: true }
        ]
      }).limit(1).toArray();
    } catch (error) {
      console.log('Error in Getting Sessions');
      console.log(error);
    }
  }

  public static async GetBannedVisitors(nsp) {
    try {


      let bannedtVisitors = await this.collection.find({ nsp: nsp, banned: true }).sort({ _id: -1 }).toArray();
      if (bannedtVisitors.length) return bannedtVisitors
      else return [];

    } catch (error) {
      console.log(error);
      console.log('error in Getting Banned VIsitor');
      return [];
    }
  }

  public static async searchCustomers(nsp, keyword, chunk = '0') {

    try {
      if (chunk == '0') {
        return await this.collection.find({
          nsp: nsp,
          '$or': [
            { username: new RegExp(keyword, 'i') },
            { email: new RegExp(keyword, 'i') },

          ]

        }).sort({ _id: -1 }).limit(20).toArray();
      } else {
        return await this.collection.aggregate([
          {
            "$match": {
              "nsp": nsp,
              '$or': [
                { username: new RegExp(keyword, 'i') },
                { email: new RegExp(keyword, 'i') },

              ]
            }
          },
          { "$sort": { _id: -1 } },
          { "$match": { "_id": { $lt: new ObjectID(chunk) } } },
          { "$limit": 20 }
        ]).toArray();
      }
    } catch (err) {
      console.log('Error in Search Contacts');
      console.log(err);
      return [];
    }
  }

  public static async BanVisitor(visitor, value, hours: number) {
    try {
      if (visitor.deviceID) {

        return this.collection.findOneAndUpdate(
          { nsp: visitor.nsp, deviceID: visitor.deviceID },
          {
            $set:
            {
              banned: value,
              banSpan: hours,
              bannedOn: new Date().toISOString()
            }
          }, { returnOriginal: false, upsert: false },

        );

      }
    } catch (err) {
      console.log(err);
    }

  }

  public static async UnbanVisitor(deviceID, nsp) {
    try {

      if (deviceID) {

        return this.collection.findOneAndUpdate(
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

  public static async GetContactsForCompaign(nsp: any, country: any) {
    try {

      let visitorSessions = this.db.collection('visitorSessions');
      return visitorSessions.find({ nsp: nsp, fullCountryName: { $in: country } }).project({ email: 1 }).toArray();

    } catch (error) {
      console.log('Error in getting email data');
      console.log(error);
    }
  }

  public static async MatchLocation(ticket: TicketSchema, operator: any, value: any) {
    let locationFromDB = await this.db.collection('visitorSessions').find({ nsp: ticket.nsp }).project({ fullCountryName: 1 })
    let regexLocation: Array<any> = [];
    regexLocation.push({
      operator: operator,
      locations: value

    });
    let countMatchedLocation = 0;
    let matched_location: Array<any> = [];
    regexLocation.map(element => {
      countMatchedLocation = 0;
      element.locations.map(location => {

        if (element.operator == "IS" && locationFromDB && locationFromDB == location) {
          return countMatchedLocation++;
        }
        else if (element.operator == "ISNOT" && locationFromDB && locationFromDB != location) {
          return countMatchedLocation++;
        }

        else {
          return countMatchedLocation;
        }
      });
      return matched_location.push({
        operator: element.operator,
        count: countMatchedLocation
      });
    })
    return ({ matchedLocationCount: matched_location, matchedboolean: (countMatchedLocation > 0) ? true : false })
  }


  public static async getAllVisitorsByToken(nsp, token, chunk = undefined, filters = '') {
    try {
      // console.log(chunk)
      //  console.log(filters)
      let search: any = {}
      search.nsp = nsp
      if (filters) {
        Object.keys(filters).map(key => {

          // console.log(key);
          switch (key) {
            case 'location':
              search.location = { $in: filters[key] }
            case 'daterange':
              search.$and = [];
              search.$and.push({
                createdDate: {
                  $gte: filters[key].from
                }
              })
              search.$and.push({
                createdDate: {
                  $lte: filters[key].to
                }
              })
          }

        })
      }

      if (chunk) search._id = {
        $lt: new ObjectId(chunk)
      }

      // console.log(search)

      let visitorList = await this.collection.aggregate([
        {
          $match: search
        },

        {
          $group: {
            "_id": `$` + `${token.toString()}` + ``,
            "id": { "$first": "$_id" },
            "username": { "$first": "$username" },
            "email": { "$first": "$email" },
            "sessions": { "$first": "$sessions" },
            "deviceID": { "$first": "$deviceID" },
            "createdDate": { "$first": "$createdDate" },
            "nsp": { "$first": "$nsp" },
            "phone": { "$first": "$phone" },
            "location": { "$first": "$location" },
            // "total": { "$sum": 1 }
            // visitor: { "$first": "$$CURRENT" }
          }
        },

        // {
        //     '$project': {
        //         _id: 0,
        //         email: 1
        //     }
        // }
        // { '$replaceRoot': { 'newRoot': '$visitor' } },
        // { "$sort": { "visitor._id": -1 } },
        {
          $sort: {
            id: -1
          }
        },
        {
          $limit: 20
        },


      ]).toArray();
      if (visitorList && visitorList.length) return visitorList
      else return [];

    } catch (error) {
      console.log('Error in Sending Visitors List');
      console.log(error);
    }
  }

  public static async searchCustomersTokenBased(nsp, keyword, token, chunk = '') {

    try {


      let search: any = {}

      search.nsp = nsp
      if (chunk) search._id = {
        $lt: new ObjectId(chunk)
      }



      if (keyword) {
        search.$or = [
          { username: new RegExp(keyword, 'i') },
          { email: new RegExp(keyword, 'i') },
          { deviceID: new RegExp(keyword, 'i') },
        ]
      }
      let obj = {};

      if (token == 'email') obj = {
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
      //
      // console.log(search);


      return await this.collection.aggregate([
        {
          "$match": search
        },
        {
          $group: {
            "_id": `$` + `${token.toString()}` + ``,
            "id": { "$first": "$_id" },
            "username": { "$first": "$username" },
            "email": { "$first": "$email" },
            "sessions": { "$first": "$sessions" },
            "deviceID": { "$first": "$deviceID" },
            "createdDate": { "$first": "$createdDate" },
            "nsp": { "$first": "$nsp" },
          }
        },
        { "$sort": { id: -1 } },
        { "$limit": 20 }
      ]).toArray();


    } catch (err) {
      console.log('Error in Search Contacts');
      console.log(err);
      return [];
    }
  }

  public static async getVisitorsCountByNsp(nsp, dateFrom, dateTo) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "createdDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            }
          }
        },
        {
          "$project":
          {
            addedDate: { $substr: ["$createdDate", 0, 10] }
            //addedDate: { $split: ["$createdDate", "T"] }
            //addedDate: "$createdDate".split("T")[0] ,
          }
        },
        {
          "$group": { _id: { data: "$addedDate" }, count: { $sum: 1 } }
        }

      ]).toArray();
      if (result.length) return result
      else return [];
    } catch (err) {
      console.log('Error in getting customer count');
      console.log(err);
      return [];
    }
  }

  public static async getDeviceIDs(nsp, chunk) {
    try {
      let match: any = {};
      if (chunk != '') {
        match._id = {
          "$lt": new ObjectId(chunk)
        };
      }
      match.nsp = nsp;
      match.deviceID = { $exists: true };
      let result = await this.collection.aggregate([
        {
          "$match": match
        },
        {
          "$project":
          {
            "_id": "$_id",
            "deviceID": "$deviceID"
          }
        }
      ]).sort({ _id: -1 }).limit(20).toArray();
      if (result.length) return result
      else return [];
    } catch (err) {
      console.log('Error in getting data');
      console.log(err);
      return [];
    }
  }

  public static async trafficFilterByDeviceId(nsp, dateFrom, dateTo, deviceID) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "createdDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            },
            "deviceID": deviceID
          }
        },
        {
          "$project":
          {
            addedDate: { $substr: ["$createdDate", 0, 10] }
          }
        },
        {
          "$group": { _id: { data: "$addedDate" }, count: { $sum: 1 } }
        }

      ]).toArray();
      if (result.length) return result
      else return [];
    } catch (err) {
      console.log('Error in getting customer count');
      console.log(err);
      return [];
    }
  }

  public static async getTraffic(nsp, dateFrom, dateTo) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "createdDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            }
          }
        },
        {
          "$project":
          {
            country: "$location"
          }
        },
        {
          "$group": { _id: { data: "$country" }, count: { $sum: 1 } }
        }

      ]).toArray();
      if (result.length) return result
      else return [];
    } catch (err) {
      console.log('Error in getting traffic');
      console.log(err);
      return [];
    }
  }
}




