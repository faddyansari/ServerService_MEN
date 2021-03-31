import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { RespFuncSchema } from "../../schemas/chatbot/respFunc";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class respFuncModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('respFunc')
            console.log(this.collection.collectionName);
            respFuncModel.initialized = true;
            return respFuncModel.initialized;
        } catch (error) {
            console.log('error in Initializing Response Function Model');
            throw new Error(error);
        }
    }
    
    
    public static async GetRespFunc(nsp: string){
        return this.collection.find({nsp:nsp,del: false}).toArray();
    }

    public static async AddRespFunc(resp_func_name: string, nsp: string) {
        try {
            let data : RespFuncSchema = {
                nsp : nsp as string,
                func_name: "utter_"+resp_func_name,
                response: [],
                del : false
            }
            let resp_func = await this.collection.find({ nsp: nsp, func_name: "utter_"+resp_func_name, del:false }).limit(1).toArray()
            if (!resp_func.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Function already exist... !!!');
                return undefined;
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding function');
            console.log(error);
        }
    }



    public static async updateRespFunc(nsp: string, id, func_name: string) {
        try {

            let respFunc = await this.collection.find({ nsp: nsp, func_name: (!func_name.includes('utter_')) ? "utter_"+func_name : func_name, del:false }).limit(1).toArray();
            if(!respFunc.length){
                return await this.collection.findOneAndUpdate({ nsp: nsp , _id: new ObjectID(id), del:false}, {$set: {func_name :(!func_name.includes('utter_')) ? "utter_"+func_name : func_name}}, {returnOriginal : false});
            }else{
                return undefined;
            }
      } catch (error) {
            console.log(error);
        }
    }



    public static async deleteRespFunc(nsp : string,id : ObjectID) {
        try {
            return await this.collection.findOneAndUpdate({nsp: nsp, _id :new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        
        } catch (error) {
            console.log('error in Deleting Function');
            console.log(error);
        }
    }


}