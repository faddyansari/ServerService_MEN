

// Created By Saad Ismail Shaikh
// Date : 05-03-18
import { ArchivingDB } from "../globals/config/databses/Analytics-Logs-DB";
import { Db, Collection, ObjectId } from "mongodb";
import * as _ from 'lodash';
import { Visitor } from "./visitorModel";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { ARCHIVINGQUEUE, AnalytcisNewQueue } from "../globals/config/constants";

export class visitorSessions {


  static db: Db;
  static collection: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await ArchivingDB.connect();
      this.collection = await this.db.createCollection('visitorSessions')
      console.log(this.collection.collectionName);
      visitorSessions.initialized = true;
      return visitorSessions.initialized;
    } catch (error) {
      console.log('error in Initializing Visitor Session Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections


  }
  static Destroy() {
    (this.db as any) = undefined;
    (this.collection as any) = undefined;
  }



  public static async InsertVisitorSession(session, id?) {

    try {

      if (id && !session._id) {
        session._id = id;
      }
      session.endingDate = new Date();
      await Visitor.InsertLeftVisitor(session.nsp, session);
      //return await this.collection.insertOne(session);
      return await __biZZC_SQS.SendMessage({ action: 'visitorSessionEnded', session: session }, AnalytcisNewQueue);


    } catch (error) {
      console.log('error in Inserting Visitor Session');
      // console.log(session);
    }

  }

  public static async getVisitorSession(sessionid) {
    return await this.collection.find({ _id: new ObjectId(sessionid) }).limit(1).toArray();
  }
  public static async getVisitorSessions(IDs: Array<string>) {
    let data: Array<ObjectId> = [];
    IDs.forEach(id => {
      data.push(new ObjectId(id));
    });
    return await this.collection.find({ _id: { '$in': data } }).toArray();
  }

  public static async getVisitorSessionsBySessionIds(IDs: Array<string>) {
    return await this.collection.find({ id: { '$in': IDs } }).toArray();
  }

  public static async getVisitorSessionByIDs(sessionids, data, token, nsp, filters, chunk = undefined) {


    let search: any = {}

    search.nsp = nsp
    search[token] = data

    if (filters) {
      if (filters.daterange) {
        search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }]
      }
    }
    else {
      sessionids = (sessionids as Array<any>).map(id => {
        id = new ObjectId(id)
        return id;
      })
      search._id = {
        $in: sessionids
      }
    }



    if (chunk) search.$lt = { _id: new ObjectId(chunk) };
    let obj = {};

    if (token == 'email') obj = {
      $not: /unregistered/gi
    }
    else obj = {
      $exists: true
    }
    if ((search as Object).hasOwnProperty(token)) {
      if (!search.$and) {
        search.$and = [];
        search.$and[0] = {}
        search.$and[0][token] = obj
      }
      else {
        search.$and.push({ token: obj })
      }


    }
    else search[token] = obj

    //console.log(search);
    return await this.collection.find(search).sort({ _id: -1 }).toArray();
  }


  public static async GetSourcesForCustomer(filters, token, nsp) {


    let search: any = {}
    search.nsp = nsp
    search[token] = filters;
    search.referrer = { $exists: true }
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
    //console.log(search);
    return await this.collection.aggregate([
      {
        $match: search
      },
      {
        "$group": {
          "_id": "$referrer",
          "count": { "$sum": 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      // {
      //     $limit: 10
      // }
    ]).toArray();
  }

  public static async GetAgentsForCustomer(filters, token, nsp) {

    let search: any = {}
    search.nsp = nsp
    search[token] = filters;

    search["agent.id"] = { $ne: '' };
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
    //console.log(search);
    return await this.collection.aggregate(
      [
        {
          $match: search
        },
        {
          $group:
          {
            // `$` + `${token.toString()}` + ``
            '_id': "$agent.name",
            sessions: {
              $addToSet: {
                agent: "$agent",
                sessionid: "$id"
              }
            },
            // "agents": { "$first": { "agent": { "$addToSet": "$agent" }, "sessionid": { "$first": '$id' } } },
            "count": { "$sum": 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
      ]
    ).toArray()
  }

  public static async GetSessionCountsPeriodically(nsp, data, sessionids, token, filters: any = {}) {
    let search: any = {}

    search.nsp = nsp
    search[token] = data

    // search['sessions.0'] = { $exists: true };


    // sessionids = (sessionids as Array<any>).map(id => {
    //     id = new ObjectId(id)
    //     return id;
    // })

    // if sessionid is needed(docs already contain device ID so no ned to include session ids)
    // search.id = {
    //     $in: sessionids
    // }

    if (filters) {
      if (filters.daterange) {
        search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }]
      }
      if (filters.country && filters.country.length) search.country = { $in: filters.country }
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
    // console.log(filters);
    // console.log('search');
    // console.log(search);
    // console.log(sessionids.length);
    let query1 = [
      {
        "$match": search
      },
      {
        "$project": {
          "creationDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$creationDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": filters.timezone
            }
          },
          // "endingDate": {
          //     "$dateToString": {
          //         "date": {
          //             "$dateFromString": {
          //                 "dateString": "$endingDate"
          //             }
          //         },
          //         "format": "%Y-%m-%dT%H:%M:%S.%LZ",
          //         "timezone": filters.timezone
          //     }
          // },
        }
      },
      {
        "$match": {
          "$or": [
            {
              "creationDate": {
                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
              }
            },
            // {
            //     "endingDate": {
            //         "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
            //         "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
            //     }
            // }
          ]

        }
      },
      {
        "$project": {
          "y": { $substr: ["$creationDate", 0, 4] },
          "m": { $substr: ["$creationDate", 5, 2] },
          "d": { $substr: ["$creationDate", 8, 2] },
          "h": { $substr: ["$creationDate", 11, 2] },

          // "y": { "$year": "$creationDate" },
          // "m": { "$month": "$creationDate" },
          // "d": { "$dayOfMonth": "$creationDate" },
          // "h": { "$hour": "$creationDate" },

        }
      },
      {
        "$group": {
          "_id": { "year": "$y", "month": "$m", "day": "$d", "hour": "$h" },
          "count": { $sum: 1 }
        }
      }]

    let query = [
      {
        "$match": search
      },
      {
        "$project": {
          "creationDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$creationDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": filters.timezone
            }
          },
          "endingDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$endingDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": filters.timezone
            }
          },
        }
      },
      {
        "$match": {
          "$or": [
            {
              "createdDate": {
                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
              }
            },
            {
              "endingDate": {
                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
              }
            }
          ]

        }
      },
      {
        "$project": {
          "email": 1.0,
          "createdDate": {
            "$dateFromString": {
              "dateString": "$createdDate"
            }
          },
          "endingDate": {
            "$dateFromString": {
              "dateString": "$endingDate"
            }
          },

        }
      },
      // {
      //     "$unwind": {
      //         "path": "$idlePeriod",
      //         "preserveNullAndEmptyArrays": true
      //     }
      // },
      // {
      //     "$addFields": {
      // "idleStart": {
      //     "$dateFromString": {
      //         "dateString": {
      //             "$dateToString": {
      //                 "date": {
      //                     "$dateFromString": {
      //                         "dateString": "$idlePeriod.startTime"
      //                     }
      //                 },
      //                 "format": "%Y-%m-%dT%H:%M:%S.%LZ",
      //                 "timezone": filters.timezone
      //             }
      //         }
      //     }
      // },
      // "idleEnd": {
      //     "$dateFromString": {
      //         "dateString": {
      //             "$dateToString": {
      //                 "date": {
      //                     "$dateFromString": {
      //                         "dateString": "$idlePeriod.endTime"
      //                     }
      //                 },
      //                 "format": "%Y-%m-%dT%H:%M:%S.%LZ",
      //                 "timezone": filters.timezone
      //             }
      //         }
      //     }
      // }
      // }
      // },
      {
        "$project": {
          "email": 1.0,

          "createdDate": {
            "$dateToString": {
              "date": "$createdDate",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          },
          "endingDate": {
            "$dateToString": {
              "date": "$endingDate",
              "format": "%Y-%m-%dT%H:%M:%S"
            }
          },
          // "idleStart": {
          //     "$dateToString": {
          //         "date": "$idleStart",
          //         "format": "%Y-%m-%dT%H:%M:%S"
          //     }
          // },
          // "idleEnd": {
          //     "$dateToString": {
          //         "date": "$idleEnd",
          //         "format": "%Y-%m-%dT%H:%M:%S"
          //     }
          // }
        }
      },
      {
        "$sort": {
          "email": 1.0,
          "createdDate": 1.0,
        }
      }
    ];

    // return await this.collection.aggregate([
    //     {
    //         $match: search
    //     },
    //     { $group: { _id: `$` + `${token.toString()}` + ``, count: { $sum: { $size: "$sessions" } } } },

    //     // {
    //     //     $project: {
    //     //         count: {
    //     //             "$size": { "$ifNull": ["$sessions", []] }
    //     //         }
    //     //     }
    //     // },
    //     {
    //         $sort: {
    //             count: -1
    //         }
    //     },
    //     // {
    //     //     $limit: 10
    //     // }
    // ]).toArray();

    return await this.collection.aggregate(query1).toArray()
  }


  public static async GetReferrerCountsPeriodically(nsp, data, sessionids, token, filters: any = {}) {
    let search: any = {}

    search.nsp = nsp
    search[token] = data
    // if sessionid is needed(docs already contain device ID so no ned to include session ids)
    // search.id = {
    //     $in: sessionids
    // }

    if (filters) {
      if (filters.daterange) {
        search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }]
      }
      if (filters.country && filters.country.length) search.country = { $in: filters.country }
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
    // console.log(filters);
    // console.log('search');
    //console.log(search);
    // console.log(search.$and);

    let query1 = [
      {
        "$match": search
      },
      {
        "$project": {
          "creationDate": {
            "$dateToString": {
              "date": {
                "$dateFromString": {
                  "dateString": "$creationDate"
                }
              },
              "format": "%Y-%m-%dT%H:%M:%S.%LZ",
              "timezone": filters.timezone
            }
          },
          'referrer': "$referrer"

        }
      },
      {
        "$match": {
          "$or": [
            {
              "creationDate": {
                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
              }
            },
          ]
        }
      },
      {
        "$project": {
          "y": { $substr: ["$creationDate", 0, 4] },
          "m": { $substr: ["$creationDate", 5, 2] },
          "d": { $substr: ["$creationDate", 8, 2] },
          "h": { $substr: ["$creationDate", 11, 2] },
          "source": '$referrer'
        }
      },
      {
        "$group": {
          "_id": { "year": "$y", "month": "$m", "day": "$d", "hour": "$h", "source": '$source' },
          // "types": { "$addToSet": "$source" },
          'types': { $first: '$source' },
          "count": { $sum: 1 }
        }
      }]

    return await this.collection.aggregate(query1).toArray()
  }
  public static async getMaxUrlsByDate(nsp, dateFrom, dateTo) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "creationDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            }
          }
        },
        {
          "$project":
          {
            url: "$url",
            date: { $substr: ["$creationDate", 0, 10] }
          }
        },
        {
          "$group": { _id: { data: "$date" }, count: { $sum: 1 } }
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

  public static async getAvgTimeSpent(nsp, dateFrom, dateTo) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "creationDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            }
          }
        },
        {
          "$project":
          {
            "date": { $substr: ["$creationDate", 0, 10] },
            "startingDate": {
              $dateFromString: {
                dateString: "$creationDate"
              }
            },
            "endingDate": {
              $dateFromString: {
                dateString: "$endingDate"
              }
            }
          }
        },
        {
          "$group": {
            _id: { data: "$date" },
            time: { $sum: { $subtract: ["$endingDate", "$startingDate"] } }
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

  public static async getRefferers(nsp, dateFrom, dateTo) {

    try {
      let result = await this.collection.aggregate([
        {
          "$match": {
            "nsp": nsp,
            "creationDate": {
              "$gte": dateFrom,
              "$lt": dateTo
            }
          }
        },
        {
          "$project":
          {
            "data": { $substr: ["$creationDate", 0, 10] },
            "referrer": "$referrer"
          }
        },
        {
          "$group": {
            _id: { data: "$referrer" },
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