//Typescript Version
// Date : 23-11-2019
// Created By Saad Ismail Shaikh

/**
 * @SQS AWS Sending/RECIEVING Standards and Tutorial
 * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples.html
 * https://aws.amazon.com/sqs/faqs/
 */


// load aws sdk
import * as  aws from 'aws-sdk';

import { SQS } from "aws-sdk";

import { SQSURL, ARCHIVINGQUEUE, AGENTSOLRQUEUE, SQSSOLRURL, SQSChatsSOLRURL } from '../../globals/config/constants';
import { EventLogSchema } from '../../schemas/EventLogsSchema';
import { SQSPacket } from '../../schemas/sqsPacketSchema';
import { ObjectId } from 'mongodb';




// load aws config
//aws.config.loadFromPath('config.json');

aws.config.update({ region: 'us-west-2' });
aws.config.setPromisesDependency(null);

export class __biZZC_SQS {

    static sqs = new aws.SQS({ apiVersion: 'latest' });
    static queueUrl = SQSURL;
    static archiveQueueURL = ARCHIVINGQUEUE;
    static solrQueueURL = AGENTSOLRQUEUE;
    static poll = false;

    static Receivingparams: SQS.ReceiveMessageRequest = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: __biZZC_SQS.queueUrl,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 30
    };


    //#region For Fetching Use Following Api

    public static async FetchQueue(params = this.Receivingparams) {

        try {
            let startTime = new Date();
            let response = this.sqs.receiveMessage(params).promise();
            let result = await response;
            let endTime = new Date();

            console.log('Start Time : ', startTime)
            console.log('End Time : ', endTime)
            // console.log(result);

            return result;

        } catch (error) {
            console.log('error in Starting POlling SQS');
            console.log(error)
        }
    }
    //#endregion




    public static async DeleteMessage(receiptHandle: string) {

        try {
            let params: SQS.DeleteMessageRequest = {
                QueueUrl: this.queueUrl,
                ReceiptHandle: receiptHandle
            };

            await this.sqs.deleteMessage(params).promise()

        } catch (error) {
            console.log(error);
            console.log('error in deleting Message');
        }

    }



    public static async SendMessage(body: SQSPacket, queueUrl?: string) {

        try {
            // console.log("SQSPacket",body);

            if (!body.action) throw new Error('Invalid Publishing Event');
            let params: SQS.SendMessageRequest = {
                QueueUrl: (queueUrl) ? queueUrl : this.queueUrl,
                MessageBody: JSON.stringify(body),
            };

            let result = await this.sqs.sendMessage(params).promise()
            // console.log('SQS RESULT : ', result);
            return result;
        } catch (error) {
            console.log(error);
            console.log('error in Sending SQS Message');
        }

    }

    public static async SendMessageToSOLR(packet: SQSPacket, url) {

        try {
            let sqsUrl = '';
            switch (url) {
                case 'ticket':
                    sqsUrl = SQSSOLRURL
                    break;
                case 'chat':
                    sqsUrl = SQSChatsSOLRURL
                    break;
                case 'agent':
                    sqsUrl = AGENTSOLRQUEUE
                    break;
                default:
                    break;
            }


            if (!packet.action || !sqsUrl) throw new Error('Invalid Publishing Event');

            let params: SQS.SendMessageRequest = {
                QueueUrl: '',
                MessageGroupId: '',
                MessageDeduplicationId: '',
                MessageBody: ''
            };
            params = {
                QueueUrl: sqsUrl,
                MessageGroupId: new ObjectId().toHexString(),
                MessageDeduplicationId: new ObjectId().toHexString(),
                MessageBody: JSON.stringify(packet),
            };

            let result = await this.sqs.sendMessage(params).promise()
            // console.log('SQS RESULT : ', result);
            return result;
        } catch (error) {
            console.log(error);
            console.log('error in Sending SQS Message');
        }

    }


    public static async SendEventLog(data: string, id: any, queueUrl?: string): Promise<any | undefined> {
        try {
            let log: EventLogSchema = {
                sessionid: id,
                event: data,
                time_stamp: new Date().toISOString()
            };

            let params: SQS.SendMessageRequest = {
                QueueUrl: (queueUrl) ? queueUrl : this.archiveQueueURL,
                MessageBody: JSON.stringify({ action: 'eventLog', log: log }),
            };

            let result = await this.sqs.sendMessage(params).promise();
            // console.log('SQS RESULT : ', result);

            //let logged: any;
            // if (this.db && this.collection) {
            //     logged = await EventLogs.createLog(log);
            // }

            // // console.log("logged in create");
            // // console.log(logged);
            if (result && result.MessageId) return log
            else return undefined

        } catch (error) {
            console.log(error);
            console.log('error in Logging Event');
            return undefined;
        }
    }


}


