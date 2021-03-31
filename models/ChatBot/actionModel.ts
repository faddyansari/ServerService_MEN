import { Db, Collection, ObjectID } from "mongodb";
import { ActionSchema} from "../../schemas/chatbot/actions";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class actionModel{

    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('actions')
            console.log(this.collection.collectionName);
            actionModel.initialized = true;
            return actionModel.initialized;
        } catch (error) {
            console.log('error in Initializing Actions Model');
            throw new Error(error);
        }
    }

   public static async AddAction(action_name: string, nsp:string, endpoint_url:string, template: string){
    try {
       
        
        let data : ActionSchema = {
            nsp : nsp as string,
            action_name : "action_"+action_name.split(' ').join('_'),
            endpoint_url:endpoint_url,
            template : template,
            del : false
        }
        let action = await this.collection.find({ nsp: nsp, action_name: "action_"+action_name.split(' ').join('_'), del:false, endpoint_url: endpoint_url }).limit(1).toArray()
        if (!action.length) {
            return await this.collection.insertOne(data);
        } else {
            //console.log('Action already exist... !!!');
            return undefined;
        }
        // return this.collection.insertOne(data);
    } catch (error) {
        console.log('error in Adding Actions');
        console.log(error);
    }
   }




   public static async GetActions(nsp: string){
    return this.collection.find({nsp:nsp,del: false}).toArray();
}



public static async deleteAction(nsp:string, id:ObjectID){
    try {
        return await this.collection.findOneAndUpdate({nsp: nsp, _id :new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
    
    } catch (error) {
        console.log('error in Deleting action');
        console.log(error);
    }
}

}