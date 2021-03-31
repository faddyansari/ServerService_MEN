// Created By Saad Ismail Shaikh
// Date : 01-03-18

import { Db, Collection, ObjectID } from "mongodb";
import { DataBaseConfig } from "../config/database";
import { InsertOneWriteOpResult } from "mongodb";
import { ContactSessionSchema } from "../../schemas/contactSessionSchema";
import { AgentsDB } from "../config/databses/AgentsDB";

//const session = require("express-session");


const { ObjectId } = require('mongodb');

export class ContactSessionManager {

    static db: Db;
    static collection: Collection;


    static Initialize() {

        // Database Connection For Session Storage.
        AgentsDB.connect()
            .then((db) => {
                this.db = db;
                console.log('Contact Session MAnager Initialized');
                this.db.createCollection('contactSessions')
                    .then(async (collection) => {
                        console.log(collection.collectionName);
                        this.collection = collection;
                        await this.collection.updateMany({}, { $set: { callingState: { socketid: '', state: false, agent: '' } } });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    static Destroy() {
        (this.db as any) = undefined;
        (this.collection as any) = undefined;
    }

    //#region contact Functions MongoDb
    public static async getContact(session, sessionID?): Promise<ContactSessionSchema | undefined> {
        try {
            let contact = await this.collection.find({
                _id: new ObjectId((sessionID) ? sessionID : (session.id || session._id))
            }).limit(1).toArray();

            if (contact.length) return contact[0];
            else return undefined;
        } catch (error) {
            console.log('Error in Get contacts Old');
            console.log(error);
        }
    }

    public static async GetContactByID(sessionID): Promise<ContactSessionSchema | undefined> {
        try {
            let contact = await this.collection.find({
                _id: new ObjectId(sessionID)
            }).limit(1).toArray();

            if (contact.length) return contact[0];
            else return undefined;
        } catch (error) {
            console.log('Error in Get contacts');
            console.log(error);
        }
    }

    public static async UpdateDeviceToken(sessionID, token: string): Promise<ContactSessionSchema | undefined> {
        try {
            let contact = await this.collection.findOneAndUpdate(
                {
                    _id: new ObjectId(sessionID)
                },
                {
                    $set: { deviceID: token }
                },
                { returnOriginal: false, upsert: false }
            );

            if (contact && contact.value) return contact.value;
            else return undefined;
        } catch (error) {
            console.log('Error in Get Device Token');
            console.log(error);
        }
    }

    //#endregion


    //#region Generic SESSION FUNCTIONS Mongodb

    public static async insertSession(session: any): Promise<InsertOneWriteOpResult<any> | undefined> {
        try {
            let _id = new ObjectID();
            session._id = _id;
            session.id = _id;
            //session.creationDate = new Date(session.creationDate);
            return await this.collection.insertOne(session);
        } catch (error) {
            console.log('Error in Inserting Session');
            console.log(error);
        }
    }
    public static async getSession(sessionID: any) {
        try {
            if (!sessionID || sessionID == 'undefined' || sessionID == 'null') return undefined;
            return this.collection.findOneAndUpdate(
                {
                    _id: new ObjectID(sessionID)
                },
                {
                    $unset: { expiry: 1 },
                }, { returnOriginal: false, upsert: false }
            )
        } catch (error) {
            console.log('Error in Inserting Session');
            console.log(error);
        }
    }

    public static async UpdateSession(sid, session) {
        let obj: any = {};
        Object.assign(obj, session);
        // console.log("Update Session");
        // console.log(session);
        delete obj._id;
        let updatedSession = await this.collection.update(
            { _id: new ObjectId(sid) },
            { $set: JSON.parse(JSON.stringify(obj)) },
            {
                upsert: false,
                multi: false
            }
        );
        if (updatedSession && updatedSession.result) return updatedSession.result;
        else return undefined;
    }

    public static async DeleteSession(sid) {
        return await this.collection.findOneAndDelete({ _id: new ObjectId(sid) });
    }

    public static async RemoveContactSession(nsp, email) {
        try {
            return await this.collection.findOneAndDelete({ nsp: nsp, email: email, type: 'Contact' });
        } catch (error) {
            console.log('Error in Remove Contact Session');
            console.log(error);
        }
    }

    //#endregion

    //#region NEW AGENT FUNCTIONS OPERATION ON DB
    public static async UpdateCallingState(email, obj) {
        //console.log('Sid');
        //console.log(sid);

        return await this.collection.findOneAndUpdate({ email: email }, {
            $set: {
                callingState: obj
            }
        }, { returnOriginal: false, upsert: false });

    }
    public static async UpdateCallingStateAgent(email, agent) {
        //console.log('Sid');
        //console.log(sid);

        return await this.collection.findOneAndUpdate({ email: email }, {
            $set: {
                'callingState.agent': agent
            }
        }, { returnOriginal: false, upsert: false });

    }

    public static Exists_contact(email) {
        try {
            return this.collection.findOneAndUpdate(
                {
                    type: 'Contact',
                    email: email
                },
                {
                    $set: { newUser: false }
                }, { returnOriginal: false, upsert: false }
            )
        } catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    }

    //#region Contact Operations
    public static async GetSessionByEmailFromDatabase(email, nsp): Promise<ContactSessionSchema | undefined> {
        try {
            let contact = await this.collection.find(
                {
                    email: email,
                    nsp: nsp,
                    type: 'Contact'
                }).limit(1).toArray();
            if (contact.length) return contact[0];
            else return undefined
        } catch (err) {
            console.log(err);

        }
    }

    public static async GetAllSessionByEmailFromDatabase(email, nsp): Promise<ContactSessionSchema[] | undefined> {
        try {
            let contacts = await this.collection.find(
                {
                    email: email,
                    nsp: nsp
                }).toArray();
            if (contacts.length) return contacts;
            else return undefined
        } catch (err) {
            console.log(err);

        }
    }
    //#endregion
}