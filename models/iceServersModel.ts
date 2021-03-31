import { Db ,Collection} from "mongodb";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";

export class iceServersModel {
    static db: Db;
    static collection: Collection;
    static initialized = false;
    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('iceServers')
            console.log(this.collection.collectionName);
            iceServersModel.initialized = true;
            return iceServersModel.initialized;
        } catch (error) {
            console.log('error in Initializing Agent Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }

    public static async getICEServers(){
        try{
            return await this.collection.aggregate([
                {
                    "$match": { 
                        $or: [
                            {type: 'stun',enabled: true},
                            {type:'turn', enabled: true}
                        ]}
                    },
                {
                    "$group": {
                        _id: "$identifier",
                        "servers": {
                        "$push" : "$servers"
                        }
                    }
                },
                {
                    "$project":{
                        _id: 0,
                        "iceServers": {
                            "$reduce": {
                                "input": "$servers",
                                "initialValue": [],
                                "in": { "$setUnion": ["$$value", "$$this"] }
                            }
                        }
                    }
                }
            ]).toArray();
        } catch (err){
            console.log('Error in getting ice servers');
            console.log(err);
        } 
    }
}