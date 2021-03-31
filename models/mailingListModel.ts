
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { Db, Collection } from "mongodb";
import * as _ from "lodash";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";

export class MailingList {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('mailingList')
            console.log(this.collection.collectionName);
            MailingList.initialized = true;
            return MailingList.initialized;
        } catch (error) {
            console.log('error in Initializing mailing List');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }

    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases 
    //--------------------------------x---------------------------------------------------x ||

    public static async addToMailingList(email) {
        try {
            let mailingList = await this.collection.find().limit(1).toArray();
            if (mailingList && mailingList.length) {
                if (!mailingList[0].email.includes(email)) {
                    return await this.collection.update({ _id: mailingList[0]._id }, { $push: { email: email } });
                } else {
                    console.log('Email already exists in mailing List');
                }
            } else {
                return await this.collection.insert({ email: [email] });
            }
        } catch (err) {
            console.log(err);
            console.log('Error in adding to mailing list');
        }

    }

    public static async getMailingList() {
        return this.collection.find().toArray();
    }

}

