
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection, ObjectID } from "mongodb";
import { Agents } from "./agentModel";
import { defaultSettings } from "../globals/config/constants";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { __BIZZ_REST_REDIS_PUB } from "../globals/__biZZCMiddleWare";


export class Orders {


    static db: Db;
    static collection: Collection;
    static collectionPrices: Collection;

    static collectionAppToken: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('orders');
            this.collectionPrices = await this.db.createCollection('pricing');
            console.log(this.collection.collectionName);
            Orders.initialized = true;
            return Orders.initialized;
        } catch (error) {
            console.log('error in Initializing Orders Model');
            throw new Error(error);
        }

    }

    public static async GetOrders(nsp: string) {

        try {

            return await this.collection.find({ nsp: nsp }).sort({ date: -1 }).limit(20).toArray();

        } catch (error) {
            console.log(error);
            console.log('error in Getting Orders');
        }

    }

    public static async InsertInvoice(order) {

        try {

            return await this.collection.insertOne(JSON.parse(JSON.stringify(order)));

        } catch (error) {
            console.log(error);
            console.log('error in Inserting Orders');
        }

    }

    public static async GetPricing() {

        try {

            return await this.collectionPrices.find({}).limit(1).toArray();

        } catch (error) {
            console.log(error);
            console.log('error in Getting Orders');
        }

    }

    public static async GetMoreOrders(nsp: string, lastInvDate) {

        try {
            // console.log('nsp :', nsp);
            // console.log('last Inv Date : ', lastInvDate);
            return await this.collection.find({ nsp: nsp, date: { $lt: lastInvDate } }).sort({ date: -1 }).limit(20).toArray();

        } catch (error) {
            console.log(error);
            console.log('error in Getting Orders');
        }

    }

}

