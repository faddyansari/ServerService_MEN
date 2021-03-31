import { Db, Collection } from "mongodb";
import { AssignmentRuleSchema } from "../schemas/assignmentRuleSchema"
import { ObjectID } from "bson";
import { ChatsDB } from "../globals/config/databses/ChatsDB";
export class AssignmentRules {


    static db: Db;
    static collection: Collection;
    static initialized = true;

    static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('assignmentRules')
            AssignmentRules.initialized = true;
            console.log(this.collection.collectionName);
            return AssignmentRules.initialized;
        } catch (error) {
            console.log('error in Initializing Assignment Rules Model');
            throw new Error(error);
        }
        // Database Connection For Events Logging of Visitor Session


    }

    public static async createRule(data: any) {
        try {
            // console.log("createLog");
            // console.log(data);
            return await this.collection.insertOne(data);
        } catch (error) {
            console.log('Error in Create Assignment Rule');
            console.log(error);
        }
    }

    public static async getRules(nsp, id?) {
        try {
            if (id) {
                return await this.collection.find(
                    {
                        nsp: nsp,
                        _id: { $gt: new ObjectID(id) }
                    }).sort({ _id: -1 }).toArray();
            }
            else {
                return await this.collection.find({ nsp: nsp }).sort({ _id: -1 }).toArray();
            }

        } catch (error) {
            console.log(error);
            throw new Error("Can't Find Assignment Rule In Exists");
        }
    }

    public static async getRuleSets(nsp) {
        try {

            return await this.db.collection('assignmentRuleSet').find({ nsp: nsp, isActive: true }).sort({ _id: -1 }).toArray();

        } catch (error) {
            console.log(error);
            throw new Error("Can't Find Assignment Rule In Exists");
        }
    }

    public static async Edit(id: string, data: AssignmentRuleSchema, nsp: string) {
        try {

            return await this.collection.findOneAndUpdate
                ({ _id: new ObjectID(id), nsp: nsp },
                    { $set: { key: data.key, value: data.value, type: data.type, operator: data.operator } },
                    { returnOriginal: false }
                );

        } catch (error) {
            console.log('error in Editing Case');
            console.log(error);
        }
    }

    public static async DeleteRule(id: string, nsp: string) {
        try {
            return await this.collection.deleteOne(
                {
                    $and: [
                        { _id: new ObjectID(id) },
                        { nsp: nsp as string },
                    ]
                },
            )
        } catch (error) {
            console.log('error in Deleting Case');
            console.log(error);
        }
    }

    public static async getCollectionsFromFilter(filter: any) {
        try {



            return await this.db.listCollections().toArray()
            // let matched = await (a as any).filter(collection => {
            //     return collection.name
            // })
        } catch (error) {
            console.log('error in Fetching Filtered Results');
            console.log(error);
        }
    }

    public static async getFilteredResultKeys(filterResults: Array<any>, nsp) {
        try {

            /**
             * @Note Wrong Code
             * Review Thoroughly
             */
            let mapping: any = {};
            // let updatedList = filterResults.map(async key => {
            //     //console.log(key);

            //     mapping[key] = (await this.db.collection(key).find({
            //         $or: [
            //             { nsp: nsp },
            //             { name: nsp },
            //         ]
            //     }).limit(1).toArray())[0];
            //    // console.log(mapping.key);
            //     return key

            // })
            // await Promise.all(updatedList);

            return mapping
            // let matched = await (a as any).filter(collection => {
            //     return collection.name
            // })
        } catch (error) {
            console.log('error in Fetching Filtered Results Keys');
            console.log(error);
        }

    }

}