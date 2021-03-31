/// <reference path="../../node_modules/@types/mongodb/index.d.ts" />
// Created By Saad Ismail Shaikh
// Date : 29-10-18

import { Db, Collection, ObjectID } from "mongodb";
import { CaseSchema } from "../../schemas/chatbot/case";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";

export class CaseModel {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('cases')
            console.log(this.collection.collectionName);
            CaseModel.initialized = true;
            return CaseModel.initialized;
        } catch (error) {
            console.log('error in Initializing Cases Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }

    public static async AddCase(value: any) {
        try {

            return this.collection.insertOne(value);

        } catch (error) {
            console.log('error in Adding Case');
            console.log(error);
        }
    }

    public static async FindOne(id: string, nsp: string) {
        try {
            return await this.collection.find(
                {
                    $and: [
                        { _id: new ObjectID(id) },
                        { nsp: nsp as string },
                    ]
                },
            ).limit(1).toArray();
        } catch (error) {
            console.log('error in Finding Case');
            console.log(error);
        }
    }


    public static async ReferenceCase(caseId: string, machineId: string, nsp: string) {
        try {
            let Case = await CaseModel.FindOne(caseId, nsp);
            if (Case) {
                let found = false;
                Case[0].assignedTo = Case[0].assignedTo.map(item => {
                    if (item.mid == machineId) {
                        item.referenceCount += 1;
                        found = true;
                    }
                    return item;
                });
                if (!found) {
                    Case[0].assignedTo.push({ mid: machineId, referenceCount: 1 });
                }
                return await this.collection.findOneAndUpdate(
                    { _id: new ObjectID(caseId) },
                    { $set: { assignedTo: Case[0].assignedTo } },
                )
            }
            throw new Error('Case Not Found');
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public static async DeReferenceCase(caseId: string, machineId: string, nsp: string) {
        try {
            let Case = await CaseModel.FindOne(caseId, nsp);
            if (Case) {
                Case[0].assignedTo = Case[0].assignedTo.filter(item => {
                    if (item.mid == machineId && item.referenceCount > 1) {
                        item.referenceCount -= 1;
                        return item.mid == machineId;
                    } else {
                        return item.mid != machineId;
                    }
                });
                return await this.collection.findOneAndUpdate(
                    { _id: new ObjectID(caseId) },
                    { $set: { assignedTo: Case[0].assignedTo } },
                    { returnOriginal: false }
                )
            }
            throw new Error('Case Not Found');
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    public static async Delete(id: string, nsp: string) {
        try {
            return await this.collection.deleteOne(
                {
                    $and: [
                        { _id: new ObjectID(id) },
                        { nsp: nsp as string },
                    ]
                },
            )
        } catch (error) {
            console.log('error in Deleting Case');
            console.log(error);
        }
    }

    public static async Edit(id: string, data: CaseSchema, nsp: string) {
        try {

            return await this.collection.findOneAndUpdate
                ({ _id: new ObjectID(id) },
                { $set: { criteria: data.criteria, matchingCriteria: data.matchingCriteria, expression: data.expression } },
                { returnOriginal: false }
                );

        } catch (error) {
            console.log('error in Editing Case');
            console.log(error);
        }
    }

    public static async GetCases(nsp: string, id?: string) {
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
            console.log('error in Getting Cases');
            console.log(error);
        }
    }


    public static async GetCaseByTagName(nsp: string, tagName: string) {
        return await this.collection.find({ nsp: nsp, tagName: tagName }).toArray();
    }

    public static async GetCaseById(nsp: string, id: string) {
        return await this.collection.find({ nsp: nsp, _id: new ObjectID(id) }).toArray();
    }


}