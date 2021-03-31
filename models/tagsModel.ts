import { Db, Collection } from "mongodb";
import { TagSchema, TagInfoSchema, AgentListInfo } from "../schemas/tagSchema";
import { ChatsDB } from "../globals/config/databses/ChatsDB";

export class TagsModel {
    static db: Db;
    static collection: Collection;
    static initialized = false;
    
    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('tags')
            console.log(this.collection.collectionName);
            TagsModel.initialized = true;
            return TagsModel.initialized;
        } catch (error) {
            console.log('error in Initializing Tags Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }


    public static async InsertTag(tag_name: any, nsp) {
        try {

            let tagInfo: TagInfoSchema = {
                tag: tag_name,
                agent_list: []
            }
            let tags: TagSchema = {
                nsp: nsp,
                tags: [tagInfo]
            };
            let tag = await this.collection.findOne({ nsp: nsp })
            if (!tag) {
                return await this.collection.insertOne(JSON.parse(JSON.stringify(tags)));
            } else {
                return await this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { tags: tagInfo } }, { returnOriginal: false, upsert: false });
            }

        } catch (error) {
            console.log('Error in Inserting Tag');
            console.log(error);
        }
    }

    public static async DeleteTag(tag_name: any, nsp) {
        try {
            return await this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { tags: { tag: tag_name } } }, { returnOriginal: false, upsert: false });

        } catch (error) {
            console.log('Error in Deleting Tag');
            console.log(error);
        }
    }

    public static async AssignAgent(agent_email: any, tag_name: string, nsp) {
        try {
            let agent_list: AgentListInfo = {
                email: agent_email,
                count: 0,
                isAdmin : false,
                excluded: false
            }
            return await this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $push: { 'tags.$.agent_list': agent_list } }, { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in AssignAgent');
            console.log(error);
        }
    }

    public static async addTagKeyword(keyword: any, tag_name: string, nsp) {
        try {
            return await this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $push: { 'tags.$.tag_keywords': keyword } }, { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in AssignAgent');
            console.log(error);
        }
    }

    public static async deleteTagKeyword(keyword: any, tag_name: string, nsp) {
        try {
            return await this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $pull: { 'tags.$.tag_keywords': keyword } }, { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in AssignAgent');
            console.log(error);
        }
    }

    public static async UnAssignAgent(agent_email: any, tag_name: string, nsp) {
        try {
            let agent_list: AgentListInfo = {
                email: agent_email,
                count: 0,
                isAdmin : false,
                excluded: false
            }
            // console.log(agent_email);
            return await this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $pull: { 'tags.$.agent_list': { email: agent_email } } }, { returnOriginal: false, upsert: false });

        } catch (error) {
            console.log('Error in UnAssignAgent');
            console.log(error);
        }
    }

    public static async UpdateAgentTicketCount(agent_email: string, tag_name: string, nsp: string, increment = true) {
        try {
            // console.log(agent_email, tag_name, nsp);
            let tags = await this.collection.findOne({ nsp: nsp });
            // console.log(tags.tags);
            for (let t of tags.tags) {
                if (t.tag == tag_name) {
                    for (let agent of t.agent_list) {
                        if (agent.email == agent_email) {
                            // console.log("agent found!");
                            if(increment){
                                agent.count += 1;
                            }else{
                                if(agent.count != 0){
                                    agent.count -= 1;
                                }                             
                            }
                            
                        }
                    }
                }
            }
            this.collection.updateOne({ nsp: nsp }, { $set: { tags: tags.tags } }, { upsert: false });
        } catch (error) {
            console.log(error);
        }
    }

    public static async GetTagDetailsByNSP(nsp) {
        try {
            let tag = await this.collection.findOne({ nsp: nsp });
            return tag;
        } catch (error) {
            console.log(error);
        }
    }
}