import { REDISURL, REDISMQURL, REDISQUEUENAME } from "../globals/config/constants";
import * as RSMQ from "rsmq";
//Created By Saad Ismail Shaikh
//03-02-2020


/**
 * @Note
 * 1. Initialize
 * 2. Reconnection Logic
 * 3. PublishMessage
 */

export class REDISPUBSUB {

    serverIP = REDISURL
    redis_queue!: RSMQ;
    QUEUENAME = REDISQUEUENAME;
    static instance: REDISPUBSUB;
    connected = false;

    host: any;
    port: any;

    private constructor(host, port) {
        console.log(host, port )
        console.log(this.QUEUENAME)
        console.log(process.env.NODE_ENV)
        this.host = host;
        this.port = port;


    }


    public ConnectQueue(): Promise<any> {
        return new Promise((resolve, reject) => {
            let found = false;
            this.redis_queue = new RSMQ({ host: this.host, port: this.port, ns: '__BIZZC_REST' });
            this.redis_queue.setQueueAttributes({ qname: this.QUEUENAME, maxsize: -1}, function (err, resp) {
                if (err) {
                    console.error(err)
                    return
                }
            });
            this.redis_queue.listQueues((err, data) => {
                if (err) { reject(err); return; }
                data.map(queuename => { (queuename == this.QUEUENAME) ? found = true : undefined });
                if (found) {
                    resolve({});
                    return;
                }
                else {
                    this.redis_queue.createQueue({ qname: this.QUEUENAME }, (err, data) => {
                        if (err) {
                            reject(err)
                            console.log('Error in Creating Queue : ', err);
                        }
                        else {
                            resolve({});
                            console.log('Data : ', data)
                        }
                    })
                }
            });
        })

    }



    public static async CreateQueue(host, port): Promise<REDISPUBSUB> {
        console.log('Creating QUeue');
        if (!REDISPUBSUB.instance) {
            console.log('Returning New Instance')
            REDISPUBSUB.instance = new REDISPUBSUB(host, port);
            await REDISPUBSUB.instance.ConnectQueue();
            return REDISPUBSUB.instance
        }
        else {
            console.log('Returning Old INstance');
            return REDISPUBSUB.instance;
        }
    }

    public static CreateQueuePromise(host, port): Promise<REDISPUBSUB> {
        return new Promise((resolve, reject) => {

        })
    }


    public SendMessage(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.redis_queue.sendMessage({ qname: this.QUEUENAME, message: JSON.stringify(data) }, (err, data) => {
                if (err) { console.log('error in sending Message to Redis', err); reject(err); }
                else { resolve(data); }
            });
        })
    }


    public DeleteMessage(Messageid): Promise<any> {
        return new Promise((resolve, reject) => {

            this.redis_queue.deleteMessage({ qname: this.QUEUENAME, id: Messageid }, (err, data) => {
                if (err) { console.log('error in Deleting Message to Redis'); return false; }
                else { return data; }
            });
        })
    }

    public QuitConnection() {
        try {
            this.redis_queue.quit();
            // resolve(true)

        } catch (error) {
            console.log('error in Quitting Connection RSMQ');
            // resolve(false);
        }
    }
}

