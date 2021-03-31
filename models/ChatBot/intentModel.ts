import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { IntentSchema } from "../../schemas/chatbot/intents";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class intentModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('intents')
            console.log(this.collection.collectionName);
            intentModel.initialized = true;
            return intentModel.initialized;
        } catch (error) {
            console.log('error in Initializing Intent Model');
            throw new Error(error);
        }
    }
    
    
    public static async GetIntents(nsp: string){
        return this.collection.find({nsp:nsp,del: false}).toArray();
    }

    public static async AddIntent(intent_name: string, nsp: string) {
        try {
            let data : IntentSchema = {
                nsp : nsp as string,
                name: intent_name,
                del : false
            }
            let intent = await this.collection.find({ nsp: nsp, name: intent_name, del:false }).limit(1).toArray()
            if (!intent.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Intent already exist... !!!');
                return undefined;
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Intent');
            console.log(error);
        }
    }



    public static async DeleteIntent(nsp : string,id : ObjectID) {
        try {
            return await this.collection.findOneAndUpdate({nsp: nsp, _id :new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        
        } catch (error) {
            console.log('error in Deleting Intent');
            console.log(error);
        }
    }


    public static async UpdateIntent(nsp: string, id, intent_name: string) {
        try {
            let intent = await this.collection.find({ nsp: nsp, name: intent_name, del:false }).limit(1).toArray();
            if(!intent.length){
                return await this.collection.findOneAndUpdate({ nsp: nsp , _id: new ObjectID(id), del:false}, {$set: {name : intent_name}}, {returnOriginal : false});
            }else{
                return undefined;
            }
      } catch (error) {
            console.log(error);
        }
    }

}