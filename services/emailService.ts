
// Created By Saad Ismail Shaikh
// Date : 03-05-18

//Note: This Is A MicroService Listening Endpoint. (Based On Sockets).
//This Is an Experimental Method For Forwarding Emails to Live Clients And Maintiang Email Thread.
import { TicketMessageSchema } from '../schemas/ticketMessageSchema';
import { Tickets } from '../models/ticketsModel';
import { ObjectID, ObjectId } from 'mongodb';
import { TicketLogSchema } from '../schemas/ticketLogSchema';
import { rand, ticketEmail } from "../globals/config/constants";
/**
 * @Note The Following Module is used to Implement Retrtying Logic.
 * Retrying Logic is Inspired by Following Microsoft Retrying Design Pattern.
 * https://docs.microsoft.com/en-us/previous-versions/msp-n-p/dn589788(v=pandp.10) 
 */
import * as retry from 'async-retry';
import { CustomDispatcher } from "../actions/TicketAbstractions/TicketDispatcher";
import { SessionManager } from "../globals/server/sessionsManager";
import { RuleSetDescriptor } from "../actions/TicketAbstractions/RuleSetExecutor";
import { TicketSchema } from "../schemas/ticketSchema";
import { TicketGroupsModel } from "../models/TicketgroupModel";
import { __BizzC_S3 } from "../actions/aws/aws-s3";
import uuid = require("uuid");
import { __biZZC_SQS } from "../actions/aws/aws-sqs";
import { TeamsModel } from "../models/teamsModel";
import { SQSPacket } from '../schemas/sqsPacketSchema';


export class EmailService {
    private static emailServiceAddress = (process.env.NODE_ENV != 'production') ? 'http://localhost:5000' : 'http://ec2-52-10-106-243.us-west-2.compute.amazonaws.com:8000';

    constructor() { }

    public static async getEmailServiceAddress() {
        return EmailService.emailServiceAddress
    }
    
    public static async SendActivationEmail(data: any, retryAttempt = 0) {
        
        console.log('Sending Activation Email');
        return __biZZC_SQS.SendMessage({ action: 'sendActivationEmail', data });


    }
    public static async SendNoReplyEmail(data: SQSPacket, s3: boolean) {
        // console.log('Sending No Reply Email');

        return retry(async async => {
            // console.log('Retrying');

            if (s3) {
                return await __BizzC_S3.PutObject(uuid.v4().toString(), data);
            } else {
                return await __biZZC_SQS.SendMessage(data);
            }

        }, { retries: 5 })
    }

    public static async SendSupportEmail(data: SQSPacket, retryAttempt = 0, s3: boolean) {

        console.log('Sending Support Email');
        return retry(async async => {
            if (s3) {
                return await __BizzC_S3.PutObject(uuid.v4().toString(), data);
            } else {
                return await __biZZC_SQS.SendMessage(data);
            }

        }, { retries: 5 })



    }

    public static async SendEmail(data: SQSPacket, retryAttempt = 0, s3: boolean) {
        return retry(async async => {
            // console.log('Retrying');

            if (s3) {
                return await __BizzC_S3.PutObject(uuid.v4().toString(), data);
            } else {
                return await __biZZC_SQS.SendMessage(data);
            }

        }, { retries: 5, factor: 3, randomize: true })

    }
     /**
    * 
    * @param data { message : string , to : string , subject } 
    */
    public static async NotifyAgentForTicket(data: any) {
        try {
            // console.log(data);
            return __biZZC_SQS.SendMessage({ action: 'sendEmailToAgent', data });


        } catch (error) {
            console.log(error);
            console.log('error in NotifyingAgent For Ticket');
        }



    }


}

