import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class TicketScenariosModel {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('ticketScenarios');
            TicketScenariosModel.initialized = true;
            return TicketScenariosModel.initialized;
        } catch (error) {
            console.log('error in Initializing Scenario Automation Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }
    public static async getScenariosByNSP(nsp: any) {
        try {
            return await this.collection.find({ nsp: nsp }).sort({ '_id': -1 }).toArray()
        } catch (error) {
            console.log('Error in getting scenarios');
            console.log(error);
        }
    }
    public static async getScenariosCount(nsp: any) {
        try {
            return await this.collection.aggregate([
                { "$match": { "nsp": nsp } },
                { "$group": { "_id": null, "count": { $sum: 1 } } },
            ]).toArray();
        } catch (error) {
            console.log('Error in getting scenarios');
            console.log(error);
        }
    }

    public static async UpdateScenario(id, scenario, nsp) {
        try {
            return await this.collection.findOneAndReplace({ _id: new ObjectID(id), nsp: nsp }, (scenario), { upsert: false, returnOriginal: false });

        } catch (error) {
            console.log('Error in updating scenario');
            console.log(error);
        }
    }

    public static async AddScenario(obj: any) {
        try {
            return await this.collection.insert(obj);
        } catch (error) {
            console.log('Error in inserting Scenario');
            console.log(error);
        }
    }

    public static async DeleteScenario(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular scenario');
            console.log(error);
        }
    }

}