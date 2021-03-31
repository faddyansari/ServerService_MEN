
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { Db, Collection } from "mongodb";
import * as _ from "lodash";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";

export class PackagesModel {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('packages')
            console.log(this.collection.collectionName);
            PackagesModel.initialized = true;
            return PackagesModel.initialized;
        } catch (error) {
            console.log('error in Initializing packages');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }

    public static async GetPackageByName(name) {

        try {

            return await this.collection.find({ name: name }).limit(1).toArray();

        } catch (error) {
            console.log(error);
            console.log('Error in Get Packages By Name')
        }

    }



}

