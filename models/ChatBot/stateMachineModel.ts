/// <reference path="../../node_modules/@types/mongodb/index.d.ts" />
// Created By Saad Ismail Shaikh
// Date : 29-10-18

import { Db, Collection, ObjectID } from "mongodb";
import { StateSchema } from "../../schemas/chatbot/state";
import { Handler } from "../../schemas/chatbot/handlers";
import { FindOneAndReplaceOption } from "mongodb";
import { StateMachineSchema } from "../../schemas/chatbot/stateMachine";
import { CaseModel } from "./caseModel";
import { CaseSchema } from "../../schemas/chatbot/case";
import { ChatsDB } from "../../globals/config/databses/ChatsDB";


//Temporary Typings Errors Conflict Fix
interface FindOneAndUpdateOption extends FindOneAndReplaceOption {
    arrayFilters?: Object[];
}


export class StateMachineModel {
    static db: Db;
    static collection: Collection;
    static initialized = false;

   public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ChatsDB.connect();
            this.collection = await this.db.createCollection('stateMachines')
            StateMachineModel.initialized = true;
            console.log(this.collection.collectionName);
            return StateMachineModel.initialized;
        } catch (error) {
            console.log('error in Initializing StateMachines Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }

    

    public static async AddMachine(value: any) {
        try {

            return this.collection.insertOne(value);

        } catch (error) {
            console.log('error in Adding Statemachin');
            console.log(error);
        }
    }

    public static async FindByName(nsp: string, name: string) {
        return await this.collection.find({ nsp: nsp, name: name }).toArray();
    }

    public static async FindOneById(id: string, nsp: string) {
        try {
            return await this.collection.find(
                {
                    $and: [
                        { _id: new ObjectID(id) },
                        { nsp: nsp },
                    ]
                },
            ).limit(1).toArray();
        } catch (error) {
            console.log('error in Finding Case');
            console.log(error);
        }
    }

    public static async FindOne(name: string, nsp: string) {
        try {
            return await this.collection.find(
                {
                    $and: [
                        { name: name },
                        { nsp: nsp },
                    ]
                },
            ).limit(1).toArray();
        } catch (error) {
            console.log('error in Finding Case');
            console.log(error);
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

    public static async GetMachines(nsp: string, id?: string) {
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
            console.log('error in Getting Machines');
            console.log(error);
        }
    }


    public static async MatchState(machineId: string, stateName: string) {
        try {
            return await this.collection.find(
                {
                    $and: [
                        { _id: new ObjectID(machineId) },
                        { states: { $elemMatch: { name: stateName } } }
                    ]
                }

            ).toArray();
        } catch (error) {
            console.log(error);
            console.log('error in Match State');
        }

    }

    public static async AddState(machineId: string, state: StateSchema) {
        return await this.collection.updateOne(
            { _id: new ObjectID(machineId) },
            { $push: { states: state } },
        )
    }

    public static async AddHandler(machineId: string, stateName: string, handler: Handler) {
        return await this.collection.findOneAndUpdate(
            { _id: new ObjectID(machineId) },
            { $push: { "states.$[t].handlers": handler } },
            { arrayFilters: [{ "t.name": stateName }] } as FindOneAndUpdateOption
        )
    }

    public static async UpdateMachine(machineId: string, nsp: string, key: string, stateMachine: StateMachineSchema) {
        return await this.collection.findOneAndUpdate(
            { _id: new ObjectID(machineId) },
            { $set: { [key]: stateMachine[key] } },
            { returnOriginal: false }
        );
    }

    public static async DeleteHandler(machineId: string, caseId: string, handlerIndex: string, stateName: string, nsp: string) {
        let stateMachine = await this.FindOneById(machineId, nsp);
        if (stateMachine && stateMachine.length) {
            for (let index = 0; index < stateMachine[0].states.length; index++) {
                if (stateMachine[0].states[index].name == stateName) {
                    stateMachine[0].states[index].handlers.splice(parseInt(handlerIndex), 1);
                    break;
                }
            }
            return await this.collection.findOneAndUpdate(
                { _id: new ObjectID(machineId) },
                { $set: { states: stateMachine[0].states } },
                { returnOriginal: false }
            );
        } else {
            return undefined;
        }
    }


    //#region Engine Functions


    public static async CreateMachine(machineId: string, nsp: string) {

        try {
            // console.log(machineId, nsp);
            let stateMachine: StateMachineSchema[] = (await this.FindOneById(machineId, nsp) as StateMachineSchema[]);
            let temp = {};
            if (stateMachine && stateMachine.length) {
                for (let i = 0; i < stateMachine[0].states.length; i++) {
                    let item = stateMachine[0].states[i]
                    if (!temp[item.name]) {
                        temp[item.name] = {} as any;
                        temp[item.name].handlers = [];
                    }
                    for (let index = 0; index < item.handlers.length; index++) {
                        let Case: CaseSchema[] = (await CaseModel.GetCaseById(nsp, item.handlers[index].caseId as string) as CaseSchema[]);
                        if (Case) {
                            temp[item.name].handlers.push({
                                action: item.handlers[index].action,
                                expression: new RegExp(Case[0].expression),
                                responseText: Case[0].responseText,
                                transition: item.handlers[index].transition
                            });
                        }
                    }
                }
                return { name: stateMachine[0].name, stateMachine: temp };
            } else {
                throw new Error('StateMachine Not Found');
            }
        } catch (error) {
            console.log(error);
            console.log('error in Creating Machine');
        }

    }

    //#endregion


}