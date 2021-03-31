import { Db, Collection, ObjectID } from "mongodb";
import { tPhraseSchema } from "../../schemas/chatbot/t_phrase";
import { tpEntitiesSchema } from "../../schemas/chatbot/tpEntities";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class tPhraseModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    static tpEntID = 0;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('tPhrase')
            console.log(this.collection.collectionName);
            tPhraseModel.initialized = true;
            return tPhraseModel.initialized;
        } catch (error) {
            console.log('error in Initializing Training Phrase Model');
            throw new Error(error);
        }
    }

    public static async GetTPhrase(nsp){
        return this.collection.find({del: false, nsp:nsp}).toArray();
    }
    public static async AddTPhrase(intent_id: ObjectID, nsp: string, text: string) {
        try {
            let data : tPhraseSchema = {
                nsp : nsp as string,
                intent_id: intent_id,
                entities: [],
                text: text,
                del : false
            }
            let tPhrase = await this.collection.find({ nsp:nsp, intent_id: intent_id, text:text, del: false }).limit(1).toArray()
            if (!tPhrase.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Training Phrase already exist... !!!');     
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Training Phrases');
            console.log(error);
        }
    }


    public static async DeleteTPhrase(nsp : string, id : ObjectID, intent_id: ObjectID) {
        try {
            return await this.collection.findOneAndUpdate({nsp: nsp, intent_id: intent_id, _id : new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        } catch (error) {
            console.log('error in Deleting Training Phrase');
            console.log(error);
        }
    }
    
    
    public static async MarkEntities(tPhraseId:ObjectID, start, end, text, nsp){
        try{
            let entities = await this.collection.find({nsp:nsp, _id: new ObjectID(tPhraseId),'entities': {$elemMatch:{value:text, entity_del: false } } }).limit(1).toArray();
           
            let data :tpEntitiesSchema = {
                id : new ObjectID(),
                start : start,
                end : end,
                value : text,
                entity : "",
                entity_del : false
            }
            if(!entities.length){
                // this.tpEntID = this.tpEntID+1;
               
                return await this.collection.findOneAndUpdate({ nsp:nsp,_id: new ObjectID(tPhraseId)}, {$push:{entities : data}}, {returnOriginal : false});
            }
        }
        catch(error){
            console.log('error');   
        }
    }



    public static async SelectEntity(id: ObjectID, entity_id: ObjectID ,entity: string, nsp){
        try{
            return await this.collection.findOneAndUpdate({nsp:nsp,_id: new ObjectID(id), 'entities':{$elemMatch:{id:new ObjectID(entity_id)}} },{$set:{'entities.$.entity': entity}},{returnOriginal:false});
        }
        catch(error){
            console.log('error');
        }
    }



    public static async delEntity(id:ObjectID, entity_id:ObjectID, nsp){
        try {
            return await this.collection.findOneAndUpdate({ nsp:nsp,_id : new ObjectID(id), 'entities':{$elemMatch:{id:  new ObjectID(entity_id)}}},{$set: {'entities.$.entity_del':true, 'entities.$.entity': ""}}, {returnOriginal : false});
        
        } catch (error) {
            console.log('error in deleting entity of Training Phrase');
            console.log(error);
        }
    }
    
}