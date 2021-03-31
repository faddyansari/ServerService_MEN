
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { Db, Collection, DeleteWriteOpResultObject } from "mongodb";

import { encrypt, decrypt } from '../globals/config/constants';
import { CompaniesDB } from "../globals/config/databses/Companies-DB";

export class Tokens {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    // Current Visitor Array
    private static AgentsList: any = {};


    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('tokens')
            console.log(this.collection.collectionName);
            Tokens.initialized = true;
            return Tokens.initialized;
        } catch (error) {
            console.log('error in Initializing Tokens Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }
    static Destroy(){
        (this.db as any) = undefined;
        (this.collection as any) = undefined;
    }
  

    public static async inserToken(token: Tokens) {
        try {
            return this.collection.insertOne(token);
        } catch (error) {
            console.log(error);
            console.log('error in Insert Token');
        }
    }


    public static async FindToken(token: string) {

        try {

            return this.collection.find({ id: token, type: 'emailActivation' }).limit(1).toArray();
        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            Promise.resolve(undefined);
        }

    }

    public static async validateToken(token: string): Promise<any> {
        try {
            let expireDate = decrypt(token);
            if (new Date(expireDate) > new Date(new Date().toISOString())) {
                return this.collection.find({ id: token }).limit(1).toArray();
            } else {
                return Promise.resolve(undefined);
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            Promise.resolve(undefined);
        }
    }


    public static async validateResellerToken(token: string): Promise<any> {
        try {
            let expireDate = decrypt(token);
            if (new Date(expireDate) > new Date(new Date().toISOString())) {
                return this.collection.find({ id: token, isReseller: true }).limit(1).toArray();
            } else {
                return Promise.resolve(undefined);
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            Promise.resolve(undefined);
        }
    }



    public static async VerifyToken(token: string, email: string): Promise<any> {
        try {
            let expireDate = decrypt(token);
            if (new Date(expireDate) > new Date(new Date().toISOString())) {
                return this.collection.find({ id: token, email: email }).limit(1).toArray();
            } else {
                return Promise.resolve(undefined);
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            Promise.resolve(undefined);
        }
    }

    public static async VerifyResellerToken(token: string, email: string): Promise<any> {
        try {
            let expireDate = decrypt(token);
            if (new Date(expireDate) > new Date(new Date().toISOString())) {
                return this.collection.find({ id: token, email: email, isReseller: true }).limit(1).toArray();
            } else {
                return Promise.resolve(undefined);
            }

        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            Promise.resolve(undefined);
        }
    }


    public static async DeleteExpiredTokens(): Promise<DeleteWriteOpResultObject | undefined> {
        try {
            return this.collection.deleteMany({ expireDate: { $lte: new Date().toISOString() } });


        } catch (error) {
            console.log(error);
            console.log('error in Validate Token');
            return undefined
        }
    }
}

