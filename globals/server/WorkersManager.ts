
import { __biZZC_SQS } from "../../actions/aws/aws-sqs";
import { __BIZZ_REST_REDIS_PUB, __BIZZC_REDIS } from "../__biZZCMiddleWare";
import { TIMEOUTKEYNAME } from "../config/constants";
import * as CP from 'child_process';
import * as path from 'path';




export class WorkerManager {


  private static stop = true;
  private startedOnce = false;
  private static FixCount = false;

  constructor() {
  }


  public async StartVisitorsWorker() {

    setInterval(async () => {
      try {
        if (WorkerManager.stop) {
          console.log('Timeout Stopped');
          return;
        } else {
          if (await __BIZZC_REDIS.Exists(TIMEOUTKEYNAME)) {
            // console.log('Timeout In Progress');
            return;
          } else {
            await __BIZZC_REDIS.SetID(TIMEOUTKEYNAME, 0.17)
            // console.log('PATH : ', path.dirname(__dirname + '../') + '/Timeoutworker.js');
            let env: any = {
              NODE_ENV: process.env.NODE_ENV,
              FIXCOUNT: WorkerManager.FixCount,
              PATH: process.env.PATH
            };
            if (process.env.NODE_ENV == 'development') env.QUEUENAME = 'socket_event_bus_dev';
            let cp = CP.spawn('node', [path.dirname(__dirname + '../') + '/Timeoutworker.js'], { detached: true, env: env });
            cp.stdout.on('close', (signal) => {
              // console.log('Worker Closed : !!!');
            });
            cp.stdout.on('data', (data) => {
              //console.log('Data : ', data.toString())
            });
            cp.stdout.on('error', (data) => {
              //console.log('Error : ', data.toString())
            })
            cp.unref();
          }
        }

      } catch (error) {
        console.log('error in Starting Visitors Interval');
        console.log(error);
      }
    }, 5000)
  }



  public static set StopTimeoutWorker(value) {
    WorkerManager.stop = value;
  }

  public static set StartTimeoutWorker(value) {
    WorkerManager.stop = value;
  }

  public static get StopTimeoutWorker() {
    return WorkerManager.stop;
  }

  public static get StartTimeoutWorker() {
    return WorkerManager.stop;
  }

  public static set SetFixCount(value) {
    WorkerManager.FixCount = value;
  }

  public static get GetFixCount() {
    return WorkerManager.FixCount;
  }




}