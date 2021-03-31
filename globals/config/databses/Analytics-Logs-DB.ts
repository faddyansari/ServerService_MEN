

//Created By Saad Ismail Shaikh
//Date : 24-1-2020

//Note : Its Main Database Config File Which Later can be used
// to configure production and Development Environment.

//MongoDB Client Object from Node_modules MongoDB.
import { MongoClient, Db } from "mongodb";
import { __biZZC_Core } from "../../__biZZCMiddleWare";
import { EmailService } from "../../../services/emailService";


// For Development Environment 
// Host : localhost or 127.0.0.1
// Port : 27017 which is Default port of MongoDB;
let devURI = 'mongodb://localhost:27017/';
// let dbName = "local";

// let devURI = 'mongodb://192.168.20.92:27017/';
let dbName = (process.env.NODE_ENV == 'production') ? 'local' : "archivingDB";

// Singleton Class
// Global database Class which will be used throughout the api of the application.
export class ArchivingDB {
    private dataBase: any;

    // Single Object instance of this class
    private static Instance: ArchivingDB;

    // Contructor is private  means the object can't be initialized directly.
    private constructor(prodURI?: string) {
        this.dataBase = undefined;
    }

    // Connect initialize database connection upon application start in index.js
    public static async connect(prodURI?: string): Promise<Db> {
        if (!prodURI) {
            prodURI = devURI;
        }

        try {
            if (!ArchivingDB.Instance) {
                ArchivingDB.Instance = new ArchivingDB();
                let mongoClient = await ArchivingDB.Instance.connectDatabase(prodURI);
                ArchivingDB.Instance.dataBase = mongoClient.db(dbName);
                ArchivingDB.Instance.onClose(ArchivingDB.Instance.dataBase, prodURI);

                console.log("connected to Database ");
                console.log("Database Name : " + ArchivingDB.Instance.dataBase.databaseName);
                return ArchivingDB.Instance.dataBase;
            } else return ArchivingDB.Instance.dataBase

        } catch (error) {
            console.log(error);
            console.log('error in Connecting To Database');
            console.log(process.env.NODE_ENV);
            console.log(process.env.DB_ADDRESS);
            throw new Error(error);
        }
    }

    public async reconnect() {
        __biZZC_Core.InitCollections(true);
    }

    public async onClose(db, prodURI) {
        db.on('close', async (response) => {
            console.log('db closed!');
            try {
                //Send Email Logic
                this.SendEmail('down');
                __biZZC_Core.destroyCollections();
                ArchivingDB.Instance.dataBase.removeAllListeners();
                let mongoClient = await ArchivingDB.Instance.connectDatabase(prodURI);
                ArchivingDB.Instance.dataBase = mongoClient.db(dbName);
                console.log("connected to Database ");
                this.SendEmail('up');
                ArchivingDB.Instance.reconnect()
                ArchivingDB.Instance.onClose(ArchivingDB.Instance.dataBase, prodURI);
            } catch (err) {
                console.log(err);
                console.log('Reconnection Error!');
            }
        });
    }


    public async connectDatabase(prodURI) {
        try {
            console.log('Connecting to Analytics Database');

            let client = await MongoClient.connect(prodURI, { useNewUrlParser: true, useUnifiedTopology: true, reconnectTries: 60, reconnectInterval: 60000, autoReconnect: true });
            // client.db(dbName);
            // let database = client.db(dbName);
            return client;
        } catch (error) {
            console.log('error in connecting Database');
            let client = await ArchivingDB.Instance.connectDatabase(prodURI)
            return client;
        }
    }

    public async SendEmail(type) {
        if (process.env.NODE_ENV == 'production') {
            let obj: any = {}
            switch (type) {
                case 'down':
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks analytics database server is down!' : 'TEST EMAIL: Beelinks analytics database server is down!',
                        message: 'The analytics database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        html: 'The analytics database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        type: 'none'
                    }
                    break;
                case 'up':
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks analytics database server is up!' : 'TEST EMAIL: Beelinks analytics database server is up!',
                        message: 'The analytics database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                        html: 'The analytics database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                        type: 'none'
                    }
                    break;
                default:
                    break;
            }
            // await EmailService.SendNoReplyEmail(obj, false);
        }
    }

    // In Case if you want to connect to another database in between application 
    // First call disconnect and then connect to ur URI
    public disconnect(): void {
        if (ArchivingDB.Instance && ArchivingDB.Instance.dataBase) {
            ArchivingDB.Instance.dataBase.close();
        }
        else {
            //console.log('No Database Initialized');
        }
    }
}
