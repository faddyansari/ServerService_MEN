

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
let dbName = (process.env.NODE_ENV == 'production') ? 'marketingDB' : "marketingDB";

// Singleton Class
// Global database Class which will be used throughout the api of the application.
export class MarketingDB {
    private dataBase: any;

    // Single Object instance of this class
    private static Instance: MarketingDB;

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
            if (!MarketingDB.Instance) {
                MarketingDB.Instance = new MarketingDB();
                let mongoClient = await MarketingDB.Instance.connectDatabase(prodURI);
                MarketingDB.Instance.dataBase = mongoClient.db(dbName);
                MarketingDB.Instance.onClose(MarketingDB.Instance.dataBase, prodURI);

                console.log("connected to Database ");
                console.log("Database Name : " + MarketingDB.Instance.dataBase.databaseName);
                return MarketingDB.Instance.dataBase;
            } else return MarketingDB.Instance.dataBase

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
                MarketingDB.Instance.dataBase.removeAllListeners();
                let mongoClient = await MarketingDB.Instance.connectDatabase(prodURI);
                MarketingDB.Instance.dataBase = mongoClient.db(dbName);
                console.log("connected to Database ");
                this.SendEmail('up');
                MarketingDB.Instance.reconnect()
                MarketingDB.Instance.onClose(MarketingDB.Instance.dataBase, prodURI);
            } catch (err) {
                console.log(err);
                console.log('Reconnection Error!');
            }
        });
    }


    public async connectDatabase(prodURI) {
        try {
            console.log('Connecting to Chats Database');

            let client = await MongoClient.connect(prodURI, { useNewUrlParser: true, useUnifiedTopology: true, reconnectTries: 60, reconnectInterval: 60000, autoReconnect: true });
            // client.db(dbName);
            // let database = client.db(dbName);
            return client;
        } catch (error) {
            console.log('error in connecting Database');
            let client = await MarketingDB.Instance.connectDatabase(prodURI)
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
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks Marketing database server is down!' : 'TEST EMAIL: Beelinks Marketing database server is down!',
                        message: 'The Marketing database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        html: 'The Marketing database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        type: 'none'
                    }
                    break;
                case 'up':
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks Marketing database server is up!' : 'TEST EMAIL: Beelinks Marketing database server is up!',
                        message: 'The Marketing database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                        html: 'The Marketing database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
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
        if (MarketingDB.Instance && MarketingDB.Instance.dataBase) {
            MarketingDB.Instance.dataBase.close();
        }
        else {
            //console.log('No Database Initialized');
        }
    }
}
