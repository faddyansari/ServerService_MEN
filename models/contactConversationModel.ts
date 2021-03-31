import { DataBaseConfig } from "../globals/config/database"
import { Db, Collection, InsertOneWriteOpResult, Cursor, Timestamp, ObjectID } from "mongodb";
import { ContactConversationSchema } from '../schemas/contactConversationSchema';
import { MessageSchema } from '../schemas/messageSchema';
import { ObjectId } from "bson";
import { AgentsDB } from "../globals/config/databses/AgentsDB";

export class ContactConversations {
    static db: Db;
    static collection: Collection;
    static initialized = true;

    static async Initialize(): Promise<boolean> {

        try {
            this.db = await AgentsDB.connect();
            this.collection = await this.db.createCollection('contactConversations')
            ContactConversations.initialized = true;
            console.log(this.collection.collectionName);
            return ContactConversations.initialized;
        } catch (error) {
            console.log('error in Initializing Contact Conversations Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
    public static async createConversation(data: any, nsp) {
        try {
            let conversation: ContactConversationSchema = {
                to: data.toContact,
                to_name : data.toName,
                from: data.fromContact,
                from_name : data.fromName,
                createdOn: new Date().toISOString(),
                LastUpdated: new Date().toISOString(),
                nsp: nsp,
                messages: [],
                LastSeen: [
                    { id: data.toContact, messageReadCount: 0, DateTime: new Date().toISOString() },
                    { id: data.fromContact, messageReadCount: 0, DateTime: new Date().toISOString() }
                ]
            };
            // console.log(conversation);
            return await this.collection.insertOne(JSON.parse(JSON.stringify(conversation)));
        } catch (error) {
            console.log('Error in Create Contact Conversation');
            console.log(error);
        }
    }
    public static async getMessagesByTime(cid, date) {
        try {
            return await this.db.collection('messages').find({ cid: new ObjectID(cid), date: { $gt: new Date(date).toISOString() } }).toArray();
        } catch (error) {
            console.log('Error in Get Messag By Time');
            console.log(error);
        }
    }
    public static async getMessagesByCid(cid) {
        try {
            return await this.db.collection('messages').find({ cid: new ObjectID(cid) }).toArray();
        } catch (error) {
            console.log('Error in Get Message By Cid');
            console.log(error);
        }
    }

    public static async getConversation(email1, email2,nsp) {
        try{
            let conversation = await this.collection.findOne({ nsp: nsp, $and: [{ $or: [{ to: email1 }, { from: email1 }] }, { $or: [{ to: email2 }, { from: email2 }] }] });
            // console.log(conversation);
            return conversation;
        }catch(error){
            console.log('Error in getConversation');
            console.log(error);
        }    
    }
    public static async removeConversation(email1, email2,nsp) {
        try{
            await this.collection.findOneAndDelete({ nsp: nsp, $and: [{ $or: [{ to: email1 }, { from: email1 }] }, { $or: [{ to: email2 }, { from: email2 }] }] });
            // console.log(conversation);
        }catch(error){
            console.log('Error in getConversation');
            console.log(error);
        }    
    }

    public static async getThreadList(email, nsp) {
        try{
            let conversations = await this.collection.find({  nsp: nsp, $or: [{ to: email }, { from: email }] }).toArray();
            // console.log(conversation);
            return conversations;
        }catch(error){
            console.log('Error in getThreadList');
            console.log(error);
        } 
    }

    public static async getConversationByCid(cid) {
        return await this.collection.find({ _id: new ObjectId(cid) }).limit(1).toArray();
    }
    public static async getAllConversations(nsp) {
        let conversations = await this.collection.find({nsp: nsp}).toArray();
        return conversations; 
    }
    public static async getAllConversationsByNsp(nsp, chunk = '0') {
        try {
            if (chunk == "0") {
                return await this.collection.aggregate([
                    { "$match": { "nsp": nsp } },
                    { "$sort": { "LastUpdated": -1 } },
                    { "$limit": 20 },
                    { "$sort": { "LastUpdated": 1 } }
                ]).toArray();

            } else {
                return await this.collection.aggregate([
                    { "$match": { "nsp": nsp, "_id": { "$lt": new ObjectID(chunk) } } },
                    { "$sort": { "LastUpdated": -1 } },
                    { "$limit": 20 },
                    { "$sort": { "LastUpdated": 1 } }

                ]).toArray();
            }

        } catch (error) {
            console.log(error);
            console.log('error in Get Conversations');
        }
    }
    public static async updateMessageReadCount(cid: string, userId: string, seen = false) {
        try {
            // console.log('Conv details');
            // console.log(cid, userId,seen);
            
            return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid), 'LastSeen.id': userId }, { $set: { 'LastSeen.$.messageReadCount': 0, 'LastSeen.$.DateTime': new Date().toISOString() } }, { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in Update Message By Count');
            console.log(error);
        }
    }
    
    public static getMessages(cid) {
        return this.db.collection('messages').find({ cid: new ObjectId(cid.toString()) }).toArray();
    }

    public static async getMessagesAsync(cid: string, chunk: string = '0') {
        try {
            if (chunk == "0") {
                return await this.db.collection('messages').aggregate([
                    { "$match": { "cid": new ObjectID(cid) } },
                    { "$sort": { "date": -1 } },
                    { "$limit": 20 },
                    { "$sort": { "date": 1 } }

                ]).toArray();

            } else {
                return await this.db.collection('messages').aggregate([
                    { "$match": { "cid": new ObjectID(cid), "_id": { "$lt": new ObjectID(chunk) } } },
                    { "$sort": { "date": -1 } },
                    { "$limit": 20 }
                ]).toArray();
            }

        } catch (error) {
            console.log(error);
            console.log('error in Get Messages');
        }
    }

    public static async insertLastMessage(cid: string, lastMessage){
        return await this.collection.findOneAndUpdate({_id : new ObjectID(cid)}, {$set: {'messages.0': lastMessage} }, {returnOriginal : false, upsert : false});
    }

    public static async getLastMessage(cid: string) {
        return await this.db.collection('messages').aggregate([
            { "$match": { "cid": new ObjectID(cid) } },
            { "$sort": { "date": -1 } },
            { "$limit": 1 },
            { "$sort": { "date": 1 } }
        ]).toArray();
    }

    public static async insertMessage(message) {
        
        this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.id': message.to }, { $inc: { 'LastSeen.$.messageReadCount': 1 } }, { returnOriginal: false, upsert: false });
        this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.id': message.from }, { $set: {'LastSeen.$.DateTime' : new Date().toISOString(),'LastSeen.$.messageReadCount' : 0,'LastUpdated' : new Date().toISOString()} }, { returnOriginal: false, upsert: false });

        return await this.db.collection('messages').insertOne(message);
    }
}