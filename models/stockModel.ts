

import { Db, Collection, ObjectID } from "mongodb";
import { MessageSchema } from '../schemas/messageSchema';
import { ObjectId } from "bson";

import { ChatsDB } from "../globals/config/databses/ChatsDB";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";


export class Stock {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('stockdata')
            console.log(this.collection.collectionName);
            Stock.initialized = true;
            return Stock.initialized;
        } catch (error) {
            console.log('error in Initializing stock Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
    static Destroy() {
        (this.db as any) = undefined;
        (this.collection as any) = undefined;
    }

    public static async InsertStockData(cid,nsp, email,make,car,model,type,dealerStock,country,location ) {
        try {
            return await this.collection.insert({nsp:nsp,cid:cid,email:email,make:make,car:car,model:model,type:type,dealerstock:dealerStock,country:country,location:location });
        } catch (error) {
            console.log('Error in Insert Stock Data');
            console.log(error);
        }
    }

}
