

//Created By Saad Ismail Shaikh
//Date : 30-1-2020

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
let dbName = (process.env.NODE_ENV == 'production') ? 'local' : "ticketsDB";
// let dbName = 'local';

// Singleton Class
// Global database Class which will be used throughout the api of the application.
export class TicketsDB {
    private dataBase: any;

    // Single Object instance of this class
    private static Instance: TicketsDB;

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
            if (!TicketsDB.Instance) {
                TicketsDB.Instance = new TicketsDB();
                let mongoClient = await TicketsDB.Instance.connectDatabase(prodURI);
                TicketsDB.Instance.dataBase = mongoClient.db(dbName);
                TicketsDB.Instance.onClose(TicketsDB.Instance.dataBase, prodURI);

                console.log("connected to Database ");
                console.log("Database Name : " + TicketsDB.Instance.dataBase.databaseName);
                return TicketsDB.Instance.dataBase;
            } else return TicketsDB.Instance.dataBase

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
                TicketsDB.Instance.dataBase.removeAllListeners();
                let mongoClient = await TicketsDB.Instance.connectDatabase(prodURI);
                TicketsDB.Instance.dataBase = mongoClient.db(dbName);
                console.log("connected to Database ");
                this.SendEmail('up');
                TicketsDB.Instance.reconnect()
                TicketsDB.Instance.onClose(TicketsDB.Instance.dataBase, prodURI);
            } catch (err) {
                console.log(err);
                console.log('Reconnection Error!');
            }
        });
    }


    public async connectDatabase(prodURI) {
        try {
            console.log('Connecting to Tickets Database');

            let client = await MongoClient.connect(prodURI, { useNewUrlParser: true, useUnifiedTopology: false, reconnectTries: 60, reconnectInterval: 60000, autoReconnect: true });
            // client.db(dbName);
            // let database = client.db(dbName);
            return client;
        } catch (error) {
            console.log('error in connecting Database');
            let client = await TicketsDB.Instance.connectDatabase(prodURI)
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
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks Tickets database server is down!' : 'TEST EMAIL: Beelinks Tickets database server is down!',
                        message: 'The Tickets database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        html: 'The Tickets database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                        type: 'none'
                    }
                    break;
                case 'up':
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                        subject: (process.env.NODE_ENV == 'production') ? 'Beelinks Tickets database server is up!' : 'TEST EMAIL: Beelinks Tickets database server is up!',
                        message: 'The Tickets database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                        html: 'The Tickets database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
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
        if (TicketsDB.Instance && TicketsDB.Instance.dataBase) {
            TicketsDB.Instance.dataBase.close();
        }
        else {
            //console.log('No Database Initialized');
        }
    }
}
