import { Db, Collection, ObjectId } from "mongodb";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";



export class EmailDesignTemplates {


    static db: Db;
    static collection: Collection;
    static collectionLayouts: Collection;
    static collectionEmailRecipients: Collection;
    static initialized = false;



    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await MarketingDB.connect();
            this.collection = await this.db.createCollection('emailDesignTemplates');
            this.collectionLayouts = await this.db.createCollection('emailLayouts');
            EmailDesignTemplates.initialized = true;
            return EmailDesignTemplates.initialized;
        } catch (error) {
            console.log('error in Initializing Tickets Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }

    public static async getAllTemplatesByNsp(nsp: any) {
        try {

            return await this.collection.find({ nsp: nsp }).sort({ '_id': -1 }).toArray()
        } catch (error) {
            console.log('Error in getting particular template');
            console.log(error);
            return [];
        }
    }

    public static async getLayoutByName(nsp: string, templateName: string) {
        try {
            return await this.collectionLayouts.find({ nsp: nsp, templateName: templateName }).limit(1).toArray()
        } catch (error) {
            console.log('Error in getting particular layout');
            console.log(error);
            return [];
        }
    }


    public static async getTemplateByID(nsp: any, id) {
        try {

            return await this.collection.find({ _id: new ObjectId(id), nsp: nsp }).sort({ 'createdDate': -1 }).limit(1).toArray()
        } catch (error) {
            console.log('Error in getting particular template');
            console.log(error);
            return [];
        }
    }


    public static async EditTemplate(id, template, nsp, email) {
        try {
            if (template.sourceType == 'importTemplate') {
                return await this.collection.findOneAndUpdate(
                    { _id: new ObjectId(id), nsp: nsp },
                    {
                        $set: { html: template.html, file: template.file, templateName: template.templateName, lastModified: { date: new Date().toISOString(), email: email } }
                    },

                    { returnOriginal: false, upsert: false });
            }
            else if (template.sourceType == 'htmlEditor') {

                return await this.collection.findOneAndUpdate(
                    { _id: new ObjectId(id), nsp: nsp },
                    {
                        $set: { html: template.html, templateName: template.templateName, lastModified: { date: new Date().toISOString(), email: email } }
                    },

                    { returnOriginal: false, upsert: false });
            }
            else {

                return await this.collection.findOneAndUpdate(
                    { _id: new ObjectId(id), nsp: nsp },
                    {
                        $set: { html: template.html, createdElements: template.createdElements, templateName: template.templateName, lastModified: { date: new Date().toISOString(), email: email } }
                    },

                    { returnOriginal: false, upsert: false });
            }


        } catch (error) {
            console.log('Error in editing template');
            console.log(error);
        }
    }

    public static async AddTemplate(data: any) {
        try {
            return await this.collection.insertOne(JSON.parse(JSON.stringify(data)));
        } catch (error) {
            console.log('Error in Creating Email Template');
            console.log(error);
        }
    }

    public static async DeleteTemplate(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular template');
            console.log(error);
        }
    }

}