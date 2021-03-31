import { DataBaseConfig } from "../globals/config/database"
import { Db, Collection, InsertOneWriteOpResult, Cursor, Timestamp, ObjectID } from "mongodb";
import { ObjectId } from "bson";
import { MessageSchema } from "../schemas/messageSchema";
import { AgentsDB } from "../globals/config/databses/AgentsDB";

export class AgentConversationStatus {
    static db: Db;
    static collection: Collection;
    static initialized = true;

    static async Initialize(): Promise<boolean> {

        try {
            this.db = await AgentsDB.connect();
            this.collection = await this.db.createCollection('agentConversationsStatus')
            AgentConversationStatus.initialized = true;
            console.log(this.collection.collectionName);
            return AgentConversationStatus.initialized;
        } catch (error) {
            console.log('error in Initializing Agent Conversations Status Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
   

    public static async createConversation(cid, email) {
        try {
            let obj = {
                cid: new ObjectId(cid),
                email: email,
                deleted: false,
                exited: false,
                removed: false
            }
            this.collection.insertOne(obj);
        } catch (error) {
            console.log('Error in Create Agent Conversation');
            console.log(error);
        }
    }
    public static async getConversationIDs(email) {
        // console.log('Get Conevrsation IDs');

        let conversation = await this.collection.find(
            {
                email: email,
                deleted: false,
            }
        ).toArray();
        // console.log(conversation);
        return conversation.map(m => m.cid);
    }

    //Group Chat Options
    public static async getActiveParticipants(cid: string) {
        try {
            let participants: any = [];
            let conversation = await this.collection.find({ cid: new ObjectID(cid), deleted: false, removed: false, exited: false }).toArray();
            if (conversation && conversation.length) {
                participants = conversation.map(c => c.email);
            }
            return participants;
        } catch (err) {
            console.log(err);
            console.log('Error in getting active participants');
            return [];
        }
    }
    public static async ExitConversation(cid: string, email) {
        try {
            return await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $set: { exited: true } }, { upsert: false, returnOriginal: false })
        } catch (err) {
            console.log(err);
            console.log('Error in exit conversation');
            return undefined;
        }
    }

    // public static async pushMessageId(cid, email, msgId) {
    //     try {
    //         return await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $push: { MessageIds: msgId }}, { upsert: false, returnOriginal: false })
    //     } catch (err) {
    //         console.log(err);
    //         console.log('Error in exit conversation');
    //         return undefined;
    //     }
    // }
    public static async getConversationStatus(cid, email) {
        try {
            return await this.collection.find({ cid: new ObjectID(cid), email: email }).limit(1).toArray();
        } catch (err) {
            console.log(err);
            console.log('Error in exit conversation');
            return [];
        }
    }
    public static async AddMember(cid: string, email) {
        try {
            let member = {
                cid: new ObjectID(cid),
                email: email,
                deleted: false,
                removed: false,
                exited: false
            }
            let status = {
                added: false
            }
            let check = await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $set: { removed: false } }, { upsert: false, returnOriginal: false });
            if (check && check.value) {
                status.added = true;
            } else {
                let addNew = await this.collection.insertOne(member);
                if (addNew && addNew.insertedCount > 0) {
                    status.added = true;
                }
            }
            return status;
        } catch (err) {
            console.log(err);
            console.log('Error in remove member');
            return undefined;
        }
    }
    public static async RemoveMember(cid: string, email) {
        try {
            return await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $set: { removed: true } }, { upsert: false, returnOriginal: false });
        } catch (err) {
            console.log(err);
            console.log('Error in remove member');
            return undefined;
        }
    }
    public static async DeleteConversation(cid: string, email) {
        try {
            return await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $set: { deleted: true } }, { upsert: false, returnOriginal: false });
        } catch (err) {
            console.log(err);
            console.log('Error in delete conversation');
            return undefined;
        }
    }
}