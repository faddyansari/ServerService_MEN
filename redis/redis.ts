import { REDISURL, REDISMQPORT } from "../globals/config/constants";
import * as REDIS from "redis";
import { WorkerManager } from "../globals/server/WorkersManager";
import { resolve } from "bluebird";
//Created By Saad Ismail Shaikh
//08-01-2020


export class REDISCLIENT {

    serverIP = REDISURL
    redisClient: REDIS.RedisClient;
    connected = false;

    constructor() {
        this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true })
        this.redisClient.on('error', (err) => {
            console.log(this.serverIP);

            console.log('error in Redis', err);
            this.connected = false;
            WorkerManager.StopTimeoutWorker = true;
            //Notify Timeout Manager not working
            //   this.Reconnect();
        })
        this.redisClient.on('connect', (data) => {
            console.log('connected to redis');
            console.log(data);
            this.connected = true;
            WorkerManager.StopTimeoutWorker = false;
        })
    }


    Reconnect() {
        try {
            this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true })

        } catch (error) {
            setTimeout(() => {
                this.Reconnect();
            }, 5000);
        }
    }

    SetID(sid, timeInminutes = 0) {
        let result = false;
        if (!timeInminutes) result = this.redisClient.set(sid.toString(), sid.toString());
        else result = this.redisClient.SETEX(sid.toString(), Math.round(timeInminutes * 60), sid.toString());
        
        return result;
    }

    GetID(key): Promise<any> {
        return new Promise((resolve, reject) => {

            this.redisClient.GET(key, ((err, res) => {
                if (!res) resolve(false);
                else resolve(res);
            }));
        })
    }

    DeleteID(key): Promise<any> {
        return new Promise((resolve, reject) => {

            this.redisClient.DEL(key, ((err, res) => {
                if (!res) resolve(false);
                else resolve(res);
            }));
        })
    }

    Exists(sid) {
        let result = false;
        return new Promise((resolve, reject) => {
            result = this.redisClient.get(sid.toString(), (err, data) => {
                // console.log('data : ', data);
                // console.log('err : ', err);
                if (!data || err) resolve(false);
                else return resolve(true);
            });
        })
    }

    GenerateSID(nsp, sid) {
        return new Promise((resolve, reject) => {

            let result = this.redisClient.SET(`_${nsp}_${sid.toString()}`, '1', 'PX', 5000, 'NX', (err, res) => {
                if (!res) resolve(false)
                else resolve(true);
            });
        })

    }

    Increment(nsp, sid) {
        return new Promise((resolve, reject) => {
            console.log('INCREMENTING');
            let result = this.redisClient.INCR(`_${nsp}_${sid.toString()}`, (err, res) => {
                if (!res) resolve(false)
                else resolve(true);
            });
        })

    }



}

