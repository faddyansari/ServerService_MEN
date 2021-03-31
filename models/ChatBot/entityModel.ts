import { Db, Collection, ObjectID } from "mongodb";
import { EntitySchema } from "../../schemas/chatbot/entities";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class entityModel{
    static db : Db;
    static collection : Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('entities')
            console.log(this.collection.collectionName);
            entityModel.initialized = true;
            return entityModel.initialized;
        } catch (error) {
            console.log('error in Initializing Entity Model');
            throw new Error(error);
        }
    }
    


    public static async GetEntities(nsp){
        return this.collection.find({nsp:nsp,del: false}).toArray();
    }

    public static async AddEntity(entity_name: string, slot_type: string,color:string, nsp: string) {
        try {
            let data : EntitySchema = {
                nsp : nsp as string,
                entity_name: entity_name,
                slot_type : slot_type,
                color:color,
                del : false
            }
            let entity = await this.collection.find({ nsp: nsp, entity_name: entity_name }).limit(1).toArray()
            if (!entity.length) {
                return await this.collection.insertOne(data);
            } else {
                console.log('Entity already exist... !!!');
                
            }
            // return this.collection.insertOne(data);
        } catch (error) {
            console.log('error in Adding Entity');
            console.log(error);
        }
    }


    public static async DeleteEntity(nsp : string, id : ObjectID) {
        try {  
            return await this.collection.findOneAndUpdate({nsp: nsp, _id : new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
        } catch (error) {
            console.log('error in Deleting Entity');
            console.log(error);
        }
    }


    public static async UpdateEntity(nsp: string, id: ObjectID, entity_name: string) {
    try {
        
        let entity= await this.collection.find({nsp:nsp, entity_name:entity_name, del: false}).limit(1).toArray();

        if(!entity.length){
            return await this.collection.findOneAndUpdate({ nsp: nsp , _id: new ObjectID(id), del:false}, {$set: {entity_name : entity_name}}, {returnOriginal : false});
        }else{
            return undefined;
        }
            // return await this.collection.findOneAndUpdate({ nsp: nsp , _id: id}, {$set: {entity_name : entity_name}}, {returnOriginal : false});
      }catch (error){
            console.log(error);
        }
    }


    public static async UpdateSlotType(nsp: string, id: ObjectID, entity_name: string, slot_type : string) {
        try {
            return await this.collection.findOneAndUpdate({ nsp: nsp , _id: new ObjectID(id), entity_name: entity_name}, {$set: {slot_type : slot_type}}, {returnOriginal : false});
      } catch (error) {
            console.log(error);
        }
    }
}