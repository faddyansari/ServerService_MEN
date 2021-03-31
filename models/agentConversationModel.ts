import { Db, Collection, InsertOneWriteOpResult, Cursor, Timestamp, ObjectID } from "mongodb";
import { ObjectId } from "bson";
import { rand } from "../globals/config/constants";
import { MessageSchema } from "../schemas/messageSchema";
import { AgentConversationStatus } from "./AgentConversationStatus";
import { AgentsDB } from "../globals/config/databses/AgentsDB";

export class AgentConversations {
    static db: Db;
    static collection: Collection;
    static initialized = true;

    static async Initialize(): Promise<boolean> {

        try {
            this.db = await AgentsDB.connect();
            this.collection = await this.db.createCollection('agentConversations')
            AgentConversations.initialized = true;
            console.log(this.collection.collectionName);
            return AgentConversations.initialized;
        } catch (error) {
            console.log('error in Initializing Agent Conversations Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
   

    public static async createConversation(data: any, nsp) {
        try {
            // let conversation: AgentConversationSchema = {
            //     to: data.toAgent,
            //     from: data.fromAgent,
            //     createdOn: new Date().toISOString(),
            //     LastUpdated: new Date().toISOString(),
            //     nsp: nsp,
            //     messages: [],
            //     LastSeen: [
            //         { id: data.toAgent, messageReadCount: 0, DateTime: '' },
            //         { id: data.fromAgent, messageReadCount: 0, DateTime: new Date().toISOString() }
            //     ]
            // };
            //console.log(data);

            return await this.collection.insertOne(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            console.log('Error in Create Agent Conversation');
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
    public static async getConversation(members, nsp) {
        // console.log();

        let conversation = await this.collection.findOne(
            {
                nsp: nsp,
                type: 'single',
                $or: [
                    {
                        'members.email': { $all: [members[0], members[1]] }
                    },
                    {
                        'members.email': { $all: [members[1], members[0]] }
                    }
                ]
            }
        );
        // console.log(conversation);
        return conversation;
    }

    public static async getConversationByCid(cid) {
        return await this.collection.find({ _id: new ObjectId(cid) }).limit(1).toArray();

    }
    public static async getAllConversations(email, nsp) {
        let conversationIds: any = [];
        conversationIds = await AgentConversationStatus.getConversationIDs(email);
        // console.log(conversationIds);

        // conversationIds.map(m => m = new ObjectID(m));
        let conversations = await this.collection.find({ nsp: nsp, _id: { $in: conversationIds } }).toArray();
        await this.collection.aggregate([
            {
                '$match':{
                    nsp: nsp,
                    _id: {$in: conversationIds}
                }
            },
            {
                '$sort':{
                    LastUpdated: -1
                }
            }
        ])
        return conversations;
    }
    public static async updateMessageReadCount(cid: string, userId: string, seen = false) {
        try {
            return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid), 'LastSeen.email': userId }, { $set: { 'LastSeen.$.messageReadCount': 0, 'LastSeen.$.DateTime': new Date().toISOString() } }, { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in Update Message By Count');
            console.log(error);
        }
    }
    public static getMessages(cid) {
        return this.db.collection('messages').find({ cid: new ObjectId(cid.toString()) }).toArray();
    }

    public static async getMessagesAsync(cid: any, visibleTo, chunk: string = '0') {
        try {
            if (chunk == "0") {
                return await this.db.collection('messages').aggregate([
                    { "$match": { "cid": new ObjectID(cid), visibleTo: { "$in": [visibleTo] } } },
                    { "$sort": { "date": -1 } },
                    { "$limit": 20 },
                    { "$sort": { "date": 1 } }

                ]).toArray();

            } else {
                return await this.db.collection('messages').aggregate([
                    { "$match": { "cid": new ObjectID(cid), visibleTo: { "$in": [visibleTo] }, "_id": { "$lt": new ObjectID(chunk) } } },
                    { "$sort": { "date": -1 } },
                    { "$limit": 20 }
                ]).toArray();
            }

        } catch (error) {
            console.log(error);
            console.log('error in Get Archives');
            return [];
        }
    }

    public static async insertMessage(message) {

        // this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.email': {$in: message.to} }, { $inc: { 'LastSeen.$[].messageReadCount': 1 } }, { returnOriginal: false, upsert: false });
        // this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.email': message.from }, { $set: {'LastSeen.$.DateTime' : new Date().toISOString(),'LastSeen.$.messageReadCount' : 0,'LastUpdated' : new Date().toISOString()} }, { returnOriginal: false, upsert: false });

        return await this.db.collection('messages').insertOne(message);
    }
    public static async insertLastMessage(cid: string, lastMessage) {
        let conversation = await this.collection.find({ _id: new ObjectID(lastMessage.cid) }).limit(1).toArray();
        let activeParticipants = await AgentConversationStatus.getActiveParticipants(lastMessage.cid);
        if (conversation && conversation.length) {
            conversation[0].messages = [
                lastMessage
            ];
            conversation[0].LastSeen.forEach(element => {
                if (element.email != lastMessage.from) {
                    if (activeParticipants.includes(element.email)) {
                        element.messageReadCount += 1;
                    }
                } else {
                    element.messageReadCount = 0;
                    element.DateTime = new Date().toISOString();
                }
            });
            conversation[0].LastUpdated = new Date().toISOString();
        }
        await this.collection.save(conversation[0]);
        return conversation[0];
        // return await this.collection.findOneAndUpdate({_id : new ObjectID(cid)}, {$set: {'messages.0': lastMessage} }, {returnOriginal : false, upsert : false});
    }

    public static async getLastMessage(cid: string) {
        return await this.db.collection('messages').aggregate([
            { "$match": { "cid": new ObjectID(cid) } },
            { "$sort": { "date": -1 } },
            { "$limit": 1 },
            { "$sort": { "date": 1 } }
        ]).toArray();
    }

    public static async AddMember(cid: string, email) {
        try {
            let randomColor = rand[Math.floor(Math.random() * rand.length)];
            let member = {
                email: email,
                isAdmin: false,
                viewColor: randomColor
            }
            let LastSeen = {
                email: email,
                messageReadCount: 0,
                DateTime: new Date().toISOString()
            }
            let status = {
                email: email,
                added: false
            }
            let check = await this.collection.find({ _id: new ObjectID(cid), 'members.email': email }).limit(1).toArray();
            if (check && check.length) {
                status.added = false;
            } else {
                let addNew = await this.collection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $push: { members: member, LastSeen: LastSeen } }, { upsert: false, returnOriginal: false });
                if (addNew && addNew.value) {
                    status.added = true;
                }
            }
            return status;
        } catch (err) {
            console.log(err);
            console.log('Error in add member');
            return undefined;
        }
    }
    public static async RemoveMember(cid: string, email) {
        try {
            console.log(cid, email);

            return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid) }, { $pull: { members: { email: email }, LastSeen: { email: email } } });
        } catch (err) {
            console.log(err);
            console.log('Error in remove member');
            return undefined;
        }
    }
    public static async toggleAdmin(cid: string, email, value) {
        try {
            console.log(cid, email);

            return await this.collection.findOneAndUpdate({ _id: new ObjectID(cid), 'members.email': email }, { $set: { 'members.$.isAdmin': value } })
        } catch (err) {
            console.log(err);
            console.log('Error in remove member');
            return undefined;
        }
    }

    public static async InsertEventMessage(cid, members, msg) {
        let message: MessageSchema = {
            _id: new ObjectID(),
            from: 'System',
            to: members,
            body: msg,
            viewColor: '',
            cid: new ObjectId(cid),
            date: new Date().toISOString(),
            type: 'Event',
            attachment: false,
            visibleTo: members
            // filename: (data.message.attachment) ? data.message.filename : undefined

        }
        return await this.db.collection('messages').insertOne(message);
    }
}