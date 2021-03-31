import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class FeedBackSurveyModel {


    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('feedbackSurvey');
            FeedBackSurveyModel.initialized = true;
            return FeedBackSurveyModel.initialized;
        } catch (error) {
            console.log('error in Initializing Feedback Survey Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections

    }

    public static async getSurveysByNSP(nsp: any) {
        try {
            return await this.collection.find({ nsp: nsp }).sort({ '_id': -1 }).toArray()
        } catch (error) {
            console.log('Error in getting surveys');
            console.log(error);
        }
    }
    public static async checkInTicket(id: any, nsp: any) {
        try {
            return await this.db.collection('tickets').find({ 'surveyId': new ObjectID(id), nsp: nsp }).project({ SubmittedSurveyData: 1 }).sort({ 'lastModified.date': -1 }).toArray()
        } catch (error) {
            console.log('Error in getting surveys');
            console.log(error);
        }
    }


    public static async getActivatedSurvey() {
        try {
            return await this.collection.find({ activated: true }).limit(1).toArray();
        } catch (error) {
            console.log('Error in getting activated survey');
            console.log(error);
        }
    }

    public static async toggleActivation(id, activated, nsp, lastModified) {

        try {
            await this.collection.findOneAndUpdate(
                { activated: true, nsp: nsp },
                {
                    $set: { activated: activated,lastModified:lastModified },
                },
                { returnOriginal: false, upsert: false });

            return await this.collection.findOneAndUpdate(
                { _id: new ObjectID(id), nsp: nsp },
                {
                    $set: { activated: activated, lastModified: lastModified },
                },
                { returnOriginal: false, upsert: false });
        } catch (error) {
            console.log('Error in activating surveys');
            console.log(error);
        }
    }

    public static async UpdateSurvey(id, survey, nsp) {
        try {
            return await this.collection.findOneAndReplace({ _id: new ObjectID(id), nsp: nsp }, (survey), { upsert: false, returnOriginal: false });

        } catch (error) {
            console.log('Error in updating survey');
            console.log(error);
        }
    }

    public static async AddSurvey(obj: any) {
        try {
            return await this.collection.insert(obj);
        } catch (error) {
            console.log('Error in Creating feedback survey');
            console.log(error);
        }
    }

    public static async DeleteSurvey(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular survey');
            console.log(error);
        }
    }

}