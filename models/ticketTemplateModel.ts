import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class TicketTemplateModel {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('ticketTemplate');
            TicketTemplateModel.initialized = true;
            return TicketTemplateModel.initialized;
        } catch (error) {
            console.log('error in Initializing TicketTemplate Model');
            throw new Error(error);
        }

    }
    public static async getTicketTemplatesByNSP(nsp: any) {
        try {
            return await this.collection.find({ nsp: nsp }).sort({ '_id': -1 }).toArray()
        } catch (error) {
            console.log('Error in getting TicketTemplate');
            console.log(error);
        }
    }

    // public static async getTemplates(agent: string, nsp: string) {
    //     try {
    //         return await this.collection.find({ nsp: nsp }).toArray()
    //     } catch (error) {
    //         console.log('Error in getting Template');
    //         console.log(error);
    //     }
    // }

   

    public static async UpdateTicketTemplate(id, template, nsp) {
        try {
            return await this.collection.findOneAndReplace({ _id: new ObjectID(id), nsp: nsp }, (template), { upsert: false, returnOriginal: false });

        } catch (error) {
            console.log('Error in updating TicketTemplate');
            console.log(error);
        }
    }

    public static async AddTicketTemplate(template: any) {
        try {
            return await this.collection.insertOne(template);
        } catch (error) {
            console.log('Error in inserting TicketTemplate');
            console.log(error);
        }
    }
    public static async TemplatesCount(nsp) {
        try {
            return await this.collection.aggregate([
                { "$match": { "nsp": nsp } },
                { "$group": { "_id": null, "count": { $sum: 1 } } },
            ]).toArray();
        } catch (error) {
            console.log('Error in inserting TicketTemplate');
            console.log(error);
        }
    }

    public static async DeleteTicketTemplate(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular TicketTemplate');
            console.log(error);
        }
    }

}