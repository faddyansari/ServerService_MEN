//Typescript Version 
// Date : 23-11-2019
// Created By Saad Ismail Shaikh

// load aws sdk
import * as aws from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { bucketName } from '../../globals/config/constants';

// load aws config
//aws.config.loadFromPath('config.json');
aws.config.setPromisesDependency(null)

export abstract class __BizzC_S3 {
    private static s3 = new aws.S3({ apiVersion: 'latest' });

    private static BucketName = bucketName


    public static async PutObject(filename: string, data: any, bucketname?: string): Promise<PromiseResult<aws.S3.DeleteObjectOutput, aws.AWSError> | undefined> {
        try {
            
            // let base64Data = new Buffer(JSON.stringify(data), 'binary')
            let bucketParams: aws.S3.PutObjectRequest = {
                Bucket: (bucketname) ? bucketname : this.BucketName,
                Key: filename,
                Body: JSON.stringify(data),
                ContentType: 'application/json; charset=utf-8',
                ACL: 'public-read',
            }
            //console.log(bucketParams);
            
            let object = await this.s3.putObject(bucketParams).promise();
            if (!object.$response.error) return object;
            else {
                console.log(object.$response.error);
                console.log('error in Putting Object AWS ERROR RESPONSE');
                return undefined;
            }

        } catch (error) {
            console.log(error);
            console.log('error in  Putting Object');
            return undefined
        }

    }



    public static async GetObject(filename: string, bucketname?: string): Promise<PromiseResult<aws.S3.GetObjectOutput, aws.AWSError> | undefined> {
        try {
            let bucketParams: aws.S3.GetObjectAclRequest = {
                Bucket: (bucketname) ? bucketname : this.BucketName,
                Key: filename
            }
            let object = await this.s3.getObject(bucketParams).promise();
            if (!object.$response.error) return object;
            else {
                console.log(object.$response.error);
                console.log('error in getting Object AWS ERROR RESPONSE');
                return undefined;
            }
        } catch (error) {
            console.log(error);
            console.log('error in getting Object from s3');
            return undefined


        }
    }

    public static async DeleteObject(filename: string, bucketname?: string): Promise<PromiseResult<aws.S3.DeleteObjectOutput, aws.AWSError> | undefined> {
        try {
            let bucketParams: aws.S3.DeleteObjectRequest = {
                Bucket: (bucketname) ? bucketname : this.BucketName,
                Key: filename
            }

            let object = await this.s3.deleteObject(bucketParams).promise();
            if (!object.$response.error) return object;
            else {
                console.log(object.$response.error);
                console.log('error in deleting Object AWS ERROR RESPONSE');
                return undefined;
            }

        } catch (error) {
            console.log(error);
            console.log('error in deleting Object');
            return undefined
        }

    }


}

