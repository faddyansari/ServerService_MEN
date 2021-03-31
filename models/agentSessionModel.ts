

// Created By Saad Ismail Shaikh
// Date : 05-03-18
import { ArchivingDB } from "../globals/config/databses/Analytics-Logs-DB";
import { Db, Collection } from "mongodb";
import * as _ from 'lodash';
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { ARCHIVINGQUEUE } from "../globals/config/constants";
export class agentSessions {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await ArchivingDB.connect();
            this.collection = await this.db.createCollection('agentSessions')
            console.log(this.collection.collectionName);
            agentSessions.initialized = true;
            return agentSessions.initialized;
        } catch (error) {
            console.log('error in Initializing AgentSessions Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }
    static Destroy() {
        (this.db as any) = undefined;
        (this.collection as any) = undefined;
    }
   
    public static async InserAgentSession(session, id?) {
        //console.log('Inserting Agent Sessio nArchive');
        try {

            if (id && !session._id) {
                session._id = id;
            }
            if (session) {
                session.endingDate = new Date();
                 //Code to test by murtaza
                 if(session.idlePeriod && session.idlePeriod.length && session.idlePeriod[0].endTime == null){
                    session.idlePeriod[0].endTime = session.endingDate;
                }
                //Code to test end by murtaza
                return await __biZZC_SQS.SendMessage({ action: 'agentSessionEnded', session: session }, ARCHIVINGQUEUE);
                // return await this.collection.insertOne(session);
            } else {
                return undefined;
            }

        } catch (error) {
            console.log('Error in Inserting Agent Session');
            console.log(error);
        }

    }


}