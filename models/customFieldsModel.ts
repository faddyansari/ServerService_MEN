
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection } from "mongodb";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";


export class CustomFields {


    static db: Db;
    static collection: Collection;
    static collectionAppToken: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('companies')
            CustomFields.initialized = true;
            return CustomFields.initialized;
        } catch (error) {
            console.log('error in Initializing Company Model');
            throw new Error(error);
        }

    }

    public static async GetTicketsFields(nsp): Promise<any> {
        try {
            let doc = await this.collection.find({ name: nsp }, {
                fields: {
                    ['settings.schemas.ticket.fields']: 1
                }
            }).toArray()
            return (doc && doc.length) ? doc[0].settings.schemas.ticket.fields : [];

        } catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    }

    public static async  UpdateFields(nsp, data): Promise<any> {
        try {
            let doc = await this.collection.findOneAndUpdate(
                { name: nsp },
                {
                    $set: { ['settings.schemas.ticket.fields']: data }
                }, { upsert: false, returnOriginal: false }
            )
            if (doc && doc.ok && doc.value) return doc.value;
            else return undefined

        } catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    }



}

