import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { ActionsUrls } from "./../globals/config/constants"
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class FormDesignerModel {
    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('formDesigner');
            FormDesignerModel.initialized = true;
            return FormDesignerModel.initialized;
        } catch (error) {
            console.log('error in Initializing Form Designer Model');
            throw new Error(error);
        }
    }
    static Destroy() {
        (this.db as any) = undefined;
        (this.collection as any) = undefined;
    }

    public static async InsertForm(cannedForm: any) {
        try {
            return await this.collection.insert(cannedForm);
        } catch (error) {
            console.log('Error in Inserting Form designed');
            console.log(error);
        }
    }

    public static async GetActionUrl(actionType: string) {
        let actionUrl;
        if (ActionsUrls && ActionsUrls.length)
            if (actionType) ActionsUrls.map((url: any) => {

                if (actionType == url.actionType) actionUrl = url.actionUrl
            })
        return actionUrl
    }

    public static async GetActionsUrls() {
        return ActionsUrls
    }

    public static async updateForm(id: string, updatedForm: any, email: string) {
        try {
            return await this.collection.findOneAndUpdate(
                {
                    _id: new ObjectID(id),
                },
                {
                    $set: { formFields: updatedForm.formFields, formName: updatedForm.formName, formHeader: updatedForm.formHeader, formFooter: updatedForm.formFooter, actionUrl: updatedForm.actionUrl, 'lastModified.date': new Date().toISOString(), 'lastModified.by': email }
                }, { returnOriginal: false, upsert: false });

        }
        catch (err) {
            console.log(err);
        }
    }

    public static async GetForms(nsp) {
        try {
            let formsFromDB = await this.collection.find({ nsp: nsp }).sort({ 'lastModified.date': -1 }).toArray();
            return formsFromDB;
        } catch (error) {
            console.log(error);
        }
    }
    public static async GetFormsCount(nsp) {
        try {
            return await this.collection.aggregate([
                { "$match": { "nsp": nsp } },
                { "$group": { "_id": null, "count": { $sum: 1 } } },
            ]).toArray();
        } catch (error) {
            console.log(error);
        }
    }

    public static async GetFormsByID(id: any) {
        try {
            let temp = id;
            return this.collection.find({ _id: new ObjectID(id) }).limit(1).toArray();
        } catch (error) {
            console.log(error);
            console.log('Error in Getting Form by ID ');
        }
    }

    public static async GetFormsByName(name: any) {
        try {

            return this.collection.find({ formName: name }).limit(1).toArray();
        } catch (error) {
            console.log(error);
            console.log('Error in Get Form by name');
        }
    }

   


    public static async deleteForm(id, nsp) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });

        } catch (error) {
            console.log('Error in deleting particular form');
            console.log(error);
        }
    }
}