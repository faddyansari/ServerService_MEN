/// <reference path="../../node_modules/@types/mongodb/index.d.ts" />
// Created By Saad Ismail Shaikh
// Date : 03-11-18


import { Db, Collection, ObjectID } from "mongodb";
import { FindOneAndReplaceOption } from "mongodb";
import { WorkFlowElement } from "../../schemas/chatbot/workFlowElement";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";


//Temporary Typings Errors Conflict Fix
interface FindOneAndUpdateOption extends FindOneAndReplaceOption {
    arrayFilters?: Object[];
}


export class WorkFlowsModel {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('workFlows');
            WorkFlowsModel.initialized = true;
            console.log(this.collection.collectionName);
            return WorkFlowsModel.initialized;
        } catch (error) {
            console.log('error in Initializing Workflows Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
   


    public static async AddWorkFlow(value: any) {
        try {

            return this.collection.insertOne(value);

        } catch (error) {
            console.log('error in Adding WorkFlow');
            console.log(error);
        }
    }

    public static async GetWorkFlows(nsp: string, id?: string) {
        try {
            if (id) {
                return await this.collection.find(
                    {
                        nsp: nsp,
                        _id: { $gt: new ObjectID(id) }
                    }).sort({ _id: -1 }).toArray();
            }
            else {
                return await this.collection.find({ nsp: nsp }).sort({ _id: -1 }).toArray();
            }
        } catch (error) {
            console.log('error in Getting WorkFlows');
            console.log(error);
        }
    }

    public static async GetWorkFlowById(nsp: string, id: string) {
        try {
            if (id) {
                return await this.collection.find(
                    {
                        $and: [
                            { nsp: nsp },
                            { _id: new ObjectID(id) }
                        ]
                    }
                ).limit(1).toArray();
            }
        } catch (error) {
            console.log('error in Getting WorkFlows');
            console.log(error);
        }
    }

    public static async GetPrimaryWorkFlow(nsp: string) {
        try {
            return await this.collection.find(
                {
                    $and: [
                        { nsp: nsp },
                        { primary: true }
                    ]
                }
            ).limit(1).toArray();
        } catch (error) {
            console.log('error in Getting WorkFlows');
            console.log(error);
        }
    }

    public static async SetPrimaryWorkFlow(nsp: string, _id: string) {
        try {
            //console.log('setting Primary');
            return await this.collection.findOneAndUpdate(
                {
                    $and: [
                        { nsp: nsp },
                        { _id: new ObjectID(_id) }
                    ]
                },
                { $set: { primary: true } },
                { returnOriginal: false }
            );
        } catch (error) {
            console.log('error in Getting WorkFlows');
            console.log(error);
        }
    }


    public static async UnSetPrimaryWorkFlow(nsp: string) {
        try {
            
            console.log('unsetting Primary');
            return await this.collection.findOneAndUpdate(
                {
                    $and: [
                        { nsp: nsp },
                        { primary: true },
                    ]
                },
                { $set: { primary: false } },
            );
        } catch (error) {
            console.log('error in Getting WorkFlows');
            console.log(error);
        }
    }

    public static async SubmitWorkFlow(nsp: string, form: Array<WorkFlowElement>, _id: string, formHTML: string) {
        try {
            console.log('SubmitWorkFlow MOdel');
            return await this.collection.findOneAndUpdate(
                {
                    $and: [
                        { _id: new ObjectID(_id) },
                        { nsp: nsp }
                    ]
                },
                { $set: { form: form, formHTML: formHTML } }
            )

        } catch (error) {
            console.log(error);
        }
    }



}