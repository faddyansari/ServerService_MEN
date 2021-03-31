import { Db, Collection, ObjectID } from "mongodb";
import { synonymsSchema } from "../../schemas/chatbot/synonyms";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";
export class synonymModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('synonyms')
            console.log(this.collection.collectionName);
            synonymModel.initialized = true;
            return synonymModel.initialized;
        } catch (error) {
            console.log('error in Initializing Synonym Model');
            throw new Error(error);
        }
    }

    public static async GetSynonyms(nsp){
        return this.collection.find({nsp:nsp,del: false}).toArray();
    }


    public static async AddSynEntValue(nsp: string, entity_value: string) {
        try {
            let data : synonymsSchema = {
                nsp : nsp as string,
                entity_value: entity_value,
                synonyms : [],
                del : false
            }
            let synValue = await this.collection.find({ nsp: nsp, entity_value: entity_value, del: false }).limit(1).toArray()
            if (!synValue.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Value already exist... !!!');
                
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Synonym Value');
            console.log(error);
        }
    }

    

    public static async DeleteSynValue(nsp : string, id : ObjectID) {
        try {
            return await this.collection.findOneAndUpdate({nsp: nsp,  _id : new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        
        } catch (error) {
            console.log('error in Deleting Synonym');
            console.log(error);
        }
    }


    public static async AddSynonym(id: ObjectID, value: string, nsp){
    try{
        return await this.collection.findOneAndUpdate({nsp:nsp,_id: new ObjectID(id), del: false} ,{$push:{synonyms: value}},{returnOriginal:false});
    }
    catch(error){
        console.log('error');
    }
    }


    public static async delSynonym(id:ObjectID, syn_index: number, nsp){
        try {
         //  console.log(syn_index, id);

            // //return await this.collection.findOneAndUpdate({nsp:nsp, _id : new ObjectID(id)},{$pull:{[synonyms + syn_index]: syn_index}}, {returnOriginal : false});
            await this.collection.update({ _id: new ObjectID(id), nsp: nsp }, { $unset: {['synonyms.'+ syn_index] : 1 }});
            return await this.collection.update({ _id: new ObjectID(id), nsp: nsp }, { $pull: { "synonyms": null } });
            // return await this.collection.find({ _id: new ObjectID(id), nsp: nsp }).toArray();

        } catch (error) {
            console.log('error in deleting synonym');
            console.log(error);
        }
    }
}