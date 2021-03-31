
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { Db, Collection} from "mongodb";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";

interface KnowledgeBaseSchema {
    year: string,
    month: string,
    filename: string,
    url: string,
    nsp: string,
    type: string,
    uploadedBy: string,
    uploadedDate: Date,
    group?: string,
    subGroup?: string,

}

export class KnowledgeBaseModel {



    static db: Db;
    static collection: Collection;
    static initialized = false;

    // Current Visitor Array
    private static AgentsList: any = {};


    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await MarketingDB.connect();
            this.collection = await this.db.createCollection('knowledgebase')
            console.log(this.collection.collectionName);
            KnowledgeBaseModel.initialized = true;
            return KnowledgeBaseModel.initialized;
        } catch (error) {
            console.log('error in Initializing Tokens Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
   

    public static async addKnowledgeBase(data: any) {
        try {
            // if(data.type == 'faq'){
            //     await this.collection.updateMany({ nsp: data.nsp, type: data.type }, { $set: { 'active': false} });
            //     return this.collection.insertOne(data);
            // }else{
            //     return this.collection.insertOne(data);
            // }
            return this.collection.insertOne(data);
           
        } catch (error) {
            console.log(error);
            console.log('error in Insert Token');
        }
    }

    public static async GetKnowledgeBase(type: string, nsp: string, limit = 0) {
        try {
            if (!limit) {
                return this.collection.find(
                    { nsp: nsp, type: type }
                ).sort({ _id: -1 }).toArray();
            } else {
                return this.collection.find(
                    { nsp: nsp, type: type }
                ).sort({ _id: -1 }).limit(1).toArray();
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
        }
    }
    public static async GetKnowledgeBaseDocuments(nsp: string, limit = 0) {
        try {
            if (!limit) {
                return this.collection.aggregate(
                    [
                        {
                          '$match': {
                            'nsp': nsp, 
                            '$or': [
                              {
                                'type': 'news'
                              }, {
                                'type': 'sla'
                              }, {
                                'type': 'itp'
                              }
                            ]
                          }
                        }, {
                          '$sort': {
                            '_id': -1
                          }
                        }
                      ]
                ).toArray();
            } else {
                return this.collection.aggregate(
                    [
                        {
                          '$match': {
                            'nsp': nsp, 
                            '$or': [
                              {
                                'type': 'news'
                              }, {
                                'type': 'sla'
                              }, {
                                'type': 'itp'
                              }
                            ]
                          }
                        }, {
                          '$sort': {
                            '_id': -1
                          }
                        }
                      ]
                ).limit(1).toArray();
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
        }
    }

    public static async removeKnowledgeBase(type: string, nsp: string, filename: string) {
        try {           
            await  this.collection.deleteOne({nsp: nsp, type: type, fileName: filename});
            return await this.collection.find({nsp: nsp, type: type}).toArray();
            
        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
        }
    }
    public static async ToggleKnowledgeBase(type: string, nsp: string, filename: string, active) {
        try {  
            // if(type == 'faq'){
            //     await this.collection.updateMany({ nsp: nsp, type: type }, { $set: { 'active': false} });
            //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': true} });
            //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();   
            // }else{
            //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': active} });
            //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();  
            // }             
            await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': active} });
            return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();  
              
        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
        }
    }

    public static async GetKnowledgeBaseByFileName(type: string, nsp: string, filename: string) {
      try {
        let knowledgebase = await this.collection.find({type: type, nsp: nsp, fileName: filename}).limit(1).toArray();
        if(knowledgebase.length){
          return knowledgebase[0];
        }else{
          return undefined;
        }

      } catch (error) {
          console.log(error);
          console.log('error in Validate Token');
      }
  }

}

