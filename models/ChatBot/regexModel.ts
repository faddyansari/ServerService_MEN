import { Db, Collection, ObjectID } from "mongodb";
import { regexSchema } from "../../schemas/chatbot/regex";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";
export class regexModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('regex')
            console.log(this.collection.collectionName);
            regexModel.initialized = true;
            return regexModel.initialized;
        } catch (error) {
            console.log('error in Initializing Regex Model');
            throw new Error(error);
        }
    }

    public static async GetRegex(nsp){
        return this.collection.find({nsp:nsp,del: false}).toArray();
    }


    public static async AddRegexValue(nsp: string, reg_value: string) {
        try {
            let data : regexSchema = {
                nsp : nsp as string,
                regex_value: reg_value,
                regex : [],
                del : false
            }
            let regValue = await this.collection.find({ nsp: nsp, regex_value: reg_value, del: false }).limit(1).toArray()
            if (!regValue.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Value already exist... !!!');
                
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Regex Value');
            console.log(error);
        }
    }


    public static async DeleteRegexValue(nsp : string, id : ObjectID) {
        try {
            return await this.collection.findOneAndUpdate({nsp: nsp,  _id : new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        
        } catch (error) {
            console.log('error in Deleting Regex Value');
            console.log(error);
        }
    }



    public static async AddRegex(id: ObjectID, value: string, nsp){
        try{
            
            return await this.collection.findOneAndUpdate({nsp:nsp,_id: new ObjectID(id), del: false} ,{$push:{regex: value}},{returnOriginal:false});
        }
        catch(error){
            console.log('error');
        }
        }
    
    
    
        public static async delRegex(id:ObjectID,reg_index, nsp){
            try {
                await this.collection.update({ _id: new ObjectID(id), nsp: nsp }, { $unset: {['regex.'+ reg_index] : 1 }});
                return await this.collection.update({ _id: new ObjectID(id), nsp: nsp }, { $pull: { "regex": null } });
               
                //return await this.collection.findOneAndUpdate({nsp:nsp, _id : new ObjectID(id)},{$pull:{regex: reg_value}}, {returnOriginal : false});
            } catch (error) {
                console.log('error in deleting regex');
                console.log(error);
            }
        }
}