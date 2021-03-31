import { Db, Collection, ObjectID } from "mongodb";
import { IntentSchema } from "../../schemas/chatbot/intents"
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class responseModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    static id = 0;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.collection('respFunc')
            console.log(this.collection.collectionName);
            responseModel.initialized = true;
            return responseModel.initialized;
        } catch (error) {
            console.log('error in Initializing Response Model');
            throw new Error(error);
        }
    }

    public static async GetResponse(nsp, id){
        let responseFunc = await this.collection.find({del: false, nsp:nsp, _id: new ObjectID(id)}).limit(1).toArray();
        if(responseFunc.length){
            return responseFunc[0].response;
        }else{
            return undefined;
        }
    }

    public static async AddResponse(resp_func_id: ObjectID, nsp: string, text: string) {
        try {
            let check = await this.collection.find({nsp:nsp, _id: new ObjectID(resp_func_id) } ).limit(1).toArray();
            let data = 
            {
                id: (check.length && check[0].response.length) ? check[0].response.length + 1 : 1,
                text: text,
                resp_del: false
            }
            let resp_func = await this.collection.find({nsp:nsp, _id: new ObjectID(resp_func_id),'response': {$elemMatch:{text:text, resp_del: false } } }).limit(1).toArray();
            
            if (!resp_func.length) {
                return await this.collection.findOneAndUpdate({ nsp:nsp,_id: new ObjectID(resp_func_id)}, {$push:{response : data}}, {returnOriginal : false});
            } else {
                console.log('Response already exist... !!!');     
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Responses');
            console.log(error);
        }
    }


    public static async UpdateResponse(nsp: string, id: number, resp_name: string, intent_id: ObjectID) {
        try {
      // console.log(resp_name);
            
            let response= await this.collection.find({nsp:nsp, intent_id:intent_id, del: false, 'response': {$elemMatch:{id:id, text:resp_name, resp_del: false } } }).limit(1).toArray();
    
            if(!response.length){
                return await this.collection.findOneAndUpdate({ nsp: nsp , _id: new ObjectID(intent_id), del:false, 'response': {$elemMatch:{id:id} }},{$set:{'response.$.text': resp_name}}, {returnOriginal : false});
            }else{
                return undefined;
            }
                // return await this.collection.findOneAndUpdate({ nsp: nsp , _id: id}, {$set: {entity_name : entity_name}}, {returnOriginal : false});
          }catch (error){
                console.log(error);
            }
        }
    


        public static async deleteResponse(nsp : string, resp_id : number, intent_id:ObjectID) {
            try {  
                return await this.collection.findOneAndUpdate({nsp: nsp,_id : new ObjectID(intent_id), 'response': {$elemMatch:{id:resp_id} }},{$set:{'response.$.resp_del': true}}, {returnOriginal : false});
            } catch (error) {
                console.log('error in Deleting Entity');
                console.log(error);
            }
        }
    
    

}