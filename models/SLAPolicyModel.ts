import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class SLAPolicyModel {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('slaPolicy');
            SLAPolicyModel.initialized = true;
            return SLAPolicyModel.initialized;
        } catch (error) {
            console.log('error in Initializing SLA Policy Model Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }
    public static async getPoliciesByNSP(nsp: any) {
        try {
            return await this.collection.find({ nsp: nsp }).sort({ 'order': 1 }).toArray()
        } catch (error) {
            console.log('Error in getting policies');
            console.log(error);
        }
    }
    public static async getPoliciesCount(nsp: any) {
        try {
            return await this.collection.aggregate([
                { "$match": { "nsp": nsp } },
                { "$group": { "_id": null, "count": { $sum: 1 } } },
            ]).toArray();
        } catch (error) {
            console.log('Error in getting policies');
            console.log(error);
        }
    }

    public static async getActivatedPolicies() {
        try {
            return await this.collection.find({ activated: true }).sort({ 'order': 1 }).toArray();
        } catch (error) {
            console.log('Error in getting activated policies');
            console.log(error);
        }
    }

    public static async reOrder(callerid, calleeorder, calleeid, callerorder, nsp) {
        try {
            await this.collection.findOneAndUpdate({ nsp: nsp, _id: new ObjectID(callerid) }, { $set: { order: calleeorder } }, { returnOriginal: false, upsert: false });
            return await this.collection.findOneAndUpdate({ nsp: nsp, _id: new ObjectID(calleeid) }, { $set: { order: callerorder } }, { returnOriginal: false, upsert: false });

        } catch (error) {
            console.log('Error in getting activated policies');
            console.log(error);
        }
    }

    public static async activatePolicy(id, activated, nsp, lastModified) {

        try {

            return await this.collection.update(
                {
                    _id: new ObjectID(id), nsp: nsp
                },
                {
                    $set: {
                        activated: activated, lastModified: lastModified
                    }
                }
            );
        } catch (error) {
            console.log('Error in activating policy');
            console.log(error);
        }
    }

    public static async UpdatePolicy(id, policy, nsp) {
        try {
            return await this.collection.findOneAndReplace({ _id: new ObjectID(id), nsp: nsp }, (policy), { upsert: false, returnOriginal: false });

        } catch (error) {
            console.log('Error in updating policy');
            console.log(error);
        }
    }

    public static async AddPolicy(obj: any) {
        try {
            return await this.collection.insert(obj);
        } catch (error) {
            console.log('Error in inserting SLA policy');
            console.log(error);
        }
    }

    public static async DeletePolicy(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular policy');
            console.log(error);
        }
    }

}