import { Db, Collection, ObjectID } from "mongodb";
import { StorySchema, intent_respFunc } from "../../schemas/chatbot/stories";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class storyModel{

    static db : Db;
    static collection : Collection;
    static initialized = false;
    static tpEntID = 0;
    
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('stories')
            console.log(this.collection.collectionName);
            storyModel.initialized = true;
            return storyModel.initialized;
        } catch (error) {
            console.log('error in Initializing Stories Model');
            throw new Error(error);
        }
    }

   public static async AddStory(story_name: string, nsp:string){
    try {
       
        
        let data : StorySchema = {
            nsp : nsp as string,
            story_name : story_name,
            intents : [],
            del : false
        }
        let stories = await this.collection.find({ nsp: nsp, story_name: story_name, del:false }).limit(1).toArray()
        if (!stories.length) {
            return await this.collection.insertOne(data);
        } else {
            console.log('Story already exist... !!!');
            return undefined;
        }
        // return this.collection.insertOne(data);
    } catch (error) {
        console.log('error in Adding Story');
        console.log(error);
    }
   }




   public static async GetStories(nsp: string){
    return this.collection.find({nsp:nsp,del: false}).toArray();
}



public static async deleteStory(nsp:string, id:ObjectID){
    try {
        return await this.collection.findOneAndUpdate({nsp: nsp, _id :new ObjectID(id)},{$set: {del: true}}, {returnOriginal : false});
    
    } catch (error) {
        console.log('error in Deleting story');
        console.log(error);
    }
}



public static async addIntentToStory(nsp:string, intent_id: ObjectID, story_id :ObjectID){
    try {
        
        let data : intent_respFunc = {
            intent_id : new ObjectID(intent_id),
            respFuncs : [],
            actions :[]
            }
        let intent = await this.collection.find({ nsp: nsp, _id: new ObjectID(story_id), 'intents': {$elemMatch:{intent_id: new ObjectID(intent_id)}} }).limit(1).toArray()
        if (!intent.length) {
            return await this.collection.findOneAndUpdate({_id: new ObjectID(story_id)},{$push:{intents:data}},{returnOriginal: false});
        } else {
            console.log('Only one intent with same name is allowed...!');
            return undefined;
        }
        // return this.collection.insertOne(data);
    } catch (error) {
        console.log('error in Adding intent to story');
        console.log(error);
    }
}



public static async addRespFuncToIntent(nsp:string, intent_id: ObjectID, story_id:ObjectID, respFuncId:ObjectID){
    try {
        let story = await this.collection.find({ nsp: nsp, _id: new ObjectID(story_id)}).limit(1).toArray()
        if(story.length){
        let intents = story[0].intents;
        if(intents.length){
            console.log(intent_id);
            
            let intent = intents.filter(i => i.intent_id == intent_id)[0];
            console.log('Intents:');
            // console.log(intent);
            if(intent){
                // console.log(intent);
                if(!intent.respFuncs.filter(r => r== respFuncId).length){
                    intent.respFuncs.push(new ObjectID(respFuncId));
                }else{
                    console.log('Response already exists');
                    return undefined;
                }
                // intent.respFunc.push(respFuncId);
            }
            else{
                console.log('No intent found with given intent id');
                return undefined;
            }    
        }
            // console.log(intents);
            return await this.collection.findOneAndUpdate({_id: new ObjectID(story_id)},{$set:{intents:intents}},{returnOriginal: false});
        }else{
            return undefined;
        }
        
        // return this.collection.insertOne(data);
    } catch (error) {
        console.log('error in Adding intent to story');
        console.log(error);
    }


}




public static async addActionToIntent(nsp:string, intent_id: ObjectID, story_id:ObjectID, actId:ObjectID){
    try {
        let story = await this.collection.find({ nsp: nsp, _id: new ObjectID(story_id)}).limit(1).toArray()
        if(story.length){
        let intents = story[0].intents;
        if(intents.length){
            
            let intent = intents.filter(i => i.intent_id == intent_id)[0];
            // console.log(intent);
            if(intent){
                if(!intent.actions.filter(r => r== actId).length){
                    intent.actions.push(new ObjectID(actId));
                }else{
                    console.log('Action already exists');
                    return undefined;
                }
                // intent.respFunc.push(respFuncId);
            }
            else{
                console.log('No intent found with given intent id');
                return undefined;
            }    
        }
            // console.log(intents);
            return await this.collection.findOneAndUpdate({_id: new ObjectID(story_id)},{$set:{intents:intents}},{returnOriginal: false});
        }else{
            return undefined;
        }
        
        // return this.collection.insertOne(data);
    } catch (error) {
        console.log('error in Adding intent to story');
        console.log(error);
    }


}
}