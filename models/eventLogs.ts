import { Db, Collection } from "mongodb";
import { ObjectId } from "bson";
import { ArchivingDB } from "../globals/config/databses/Analytics-Logs-DB";
export class EventLogs {


    static db: Db;
    static collection: Collection;
    static initialized = true;

    static async Initialize(): Promise<boolean> {

        try {
            this.db = await ArchivingDB.connect();
            this.collection = await this.db.createCollection('eventLogs')
            EventLogs.initialized = true;
            //console.log(this.collection.collectionName);
            return EventLogs.initialized;
        } catch (error) {
            console.log('error in Initializing Visitor Event Logging Model');
            throw new Error(error);
        }
        // Database Connection For Events Logging of Visitor Session


    }

    public static async createLog(data: any) {
        try {
            // console.log("createLog");
            // console.log(data);
            return await this.collection.insertOne(data);
        } catch (error) {
            console.log('Error in Create Conversation');
            console.log(error);
        }
    }

    public static async getLogs(visitorId: any) {
        try {
            return await this.collection.find({ sessionid: new ObjectId(visitorId) }).toArray();
        } catch (error) {
            console.log(error);
            throw new Error("Can't Find Agent In Exists");
        }
    }

}