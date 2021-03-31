import { Db, Collection } from "mongodb";
import { v4 } from 'uuid';
import { AppTokenSchema } from "../schemas/appTokenSchema";
import { CustomError } from "../helpers/customError";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";


export class Webhooks {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    static Initialize() {

        // Database Connection For Visitors Based Operation on Visitor Collections
        CompaniesDB.connect()
            .then((db) => {
                this.db = db;

                this.db.createCollection('appTokens')
                    .then((collection) => {
                        console.log(collection.collectionName);
                        this.collection = collection;
                    })
                    .catch((err) => {
                        //console.log(err);
                    });

                Webhooks.initialized = true;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public static async setAppToken(nsp) {

        let findResp: Array<any>;
        let uuid: string;

        do {
            uuid = v4();
            findResp = await this.collection.find({ key: uuid }).toArray();
        }
        // check if such an identifier exists
        while (findResp.length > 0)

        let appTokenObj: AppTokenSchema = {
            key: uuid,
            nsp: nsp,
            valid: true,
            userGetValidated: false
        };

        let bulkOpResp: any = await this.collection.bulkWrite([
            { updateMany: { filter: { valid: true }, update: { $set: { valid: false } } } },
            { insertOne: { document: appTokenObj } }
        ]);

        // success
        if (bulkOpResp && bulkOpResp.result && bulkOpResp.result.ok && bulkOpResp.insertedCount == 1) {
            // return uuid
            return {
                key: uuid,
                userGetValidated: false
            };
        }
        else {
            throw new CustomError("UnsuccessfulAppTokenGeneration", 9, "Incorrect DB operations for app token generation.")
        }
    }

    public static async getValidAppToken(nsp) {
        // console.log('getValidAppToken')
        let findArray = await this.collection.find({ nsp: nsp, valid: true }).toArray();
        // console.log('findArray')
        // console.log(findArray)
        if (findArray.length > 1) {
            throw new CustomError("InvalidStateInAppToken", 10, "More than 1 valid app tokens have been returned for one company: invalid operation")
        }
        else if (findArray.length == 0) {
            return {
                key: '', userGetValidated: "unknown"
            }
        }
        else {
            let appToken = findArray[0];
            return {
                key: appToken.key,
                userGetValidated: appToken.userGetValidated
            }
        }
    }

    public static async GETValidateAppToken(token, nsp) {
        let findArray = await this.collection.find({ nsp: nsp, valid: true, key: token }).toArray();

        // console.log('findArray')
        // console.log(findArray)

        if (findArray.length == 1) {
            await this.collection.update({ key: token }, { $set: { userGetValidated: true } });
        }
        else if (findArray.length == 0) {
            throw new CustomError("IncorrectVerificationAppTokenValues", 12, "The values passed into for app token verification do not correspond to any valid app token.");
        }
        // negative or above 1 returned from db
        else {
            throw new CustomError("InvalidStateInAppToken", 13, "More than 1 valid app tokens have been returned for one company: invalid operation");
        }
    }

    public static async isGETValidatedAppToken(token, nsp) {
        let findArray = await this.collection.find({ nsp: nsp, valid: true, key: token, userGetValidated: true }).toArray();

        if (findArray.length == 1) {
            console.log("validated")
            return;
        }
        else if (findArray.length == 0) {
            throw new CustomError("IncorrectVerifiedAppTokenValues", 14, "The values passed into checking for app token verified do not correspond to any valid app token.");
        }
        // negative or above 1 returned from db
        else {
            throw new CustomError("InvalidStateInAppToken", 15, "More than 1 valid app tokens have been returned for one company: invalid operation");
        }
    }
}