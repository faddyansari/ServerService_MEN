
// Created By Saad Ismail Shaikh
// Date : 22-1-18

import { DataBaseConfig } from "../globals/config/database"
import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { ContactSchemaWithID } from '../schemas/contactSchemaWithID';
import { CustomError } from '../helpers/customError';
import { AgentsDB } from "../globals/config/databses/AgentsDB";

export class Contacts {

    static db: Db;
    static collection: Collection;
    static initialized = false;

    static emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static numberPattern = /[0-9\-]+/;

    // Changed to ASYNC AWAIT
    public static async Initialize(): Promise<boolean> {
        try {
            this.db = await AgentsDB.connect();
            this.collection = await this.db.createCollection('contacts')
            // await this.db.collection('contacts').createIndex({ name: "text" });
            await this.db.collection('contacts').createIndex({ email: "text" });
            console.log(this.collection.collectionName);
            Contacts.initialized = true;
            return Contacts.initialized;
        } catch (error) {
            console.log('error in Initializing Contacts Model');
            console.log(error);
            throw new Error(error);
        }
    }

    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases 
    //--------------------------------x---------------------------------------------------x ||

    // returns the created contact
    public static async createContacts(contact, namespace) {
        contact['nsp'] = namespace;
        contact['created_date'] = (new Date()).toISOString();
        contact['status'] = false;

        // validate the data according to schema
        let contactToCreate: ContactSchemaWithID = this.cleanContactInputFields(contact);   

        let writeResult = await this.collection.find({email : contact.email, nsp: namespace}).limit(1).toArray();
        if(!writeResult.length){
            this.collection.insertOne(contactToCreate);           
        }else{
            this.collection.updateOne({email : contact.email, nsp: namespace}, {$set : contactToCreate}, {upsert: false});
        }

        // console.log('writeResult: ');
        // console.log(writeResult);
        if (writeResult.length) {
            // console.log('contactToCreate: ');
            // console.log(contactToCreate);
            return writeResult[0];
        }
        else {
           return contactToCreate;
        }
    }
    public static async searchContacts(nsp,keyword, chunk = '0'){
        // console.log('Searching Contact!');
        // console.log(nsp);
        // console.log(keyword);
        try {
            if(chunk == '0'){
                return await this.collection.find({
                    nsp: nsp,
                    '$or':[
                        {name : new RegExp(keyword)},
                        {email: new RegExp(keyword)   }
                    ]
                                          
                }).sort({name: 1}).limit(20).toArray();
            }else{
                return await this.collection.aggregate([
                    { "$match": { "nsp": nsp, 
                                    '$or':[
                                        {name : new RegExp(keyword)},
                                        {email: new RegExp(keyword)   }
                                    ]
                    }},
                    { "$sort" : {name : 1}},
                    { "$match": {"name": { "$gt": chunk } } },   
                    { "$limit": 20 }
                ]).toArray();
            }       
        } catch (err) {
            console.log('Error in Search Contacts');
            console.log(err);
            return [];
        }
    }
    public static async retrieveContacts(nsp) {
        try {
            return await this.collection.find({ nsp: nsp }).sort({name: 1}).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async retrieveContactsByGroups(nsp, group) {
        try {
            return await this.collection.find({ nsp: nsp, group: group }).sort({name: 1}).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async contactsCountsWithStatus(nsp) {
        try {
            return await this.collection.find({ nsp: nsp }).project({_id: 1, email: 1, status: 1}).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async retrieveContactsAsync(nsp,type, chunk = '0') {
        try {
            switch(type){
                case 'ONLINE':
                    if(chunk == '0'){
                        return await this.collection.find({ nsp: nsp, status: true }).sort({name : 1}).limit(20).toArray();
                    }else{
                        return await this.collection.aggregate([
                            { "$match": { "nsp": nsp, status: true}},
                            { "$sort" : {name : 1}},
                            { "$match": {"name": { "$gt": chunk } } },                      
                            { "$limit": 20 }
                        ]).toArray();
                    }
                case 'OFFLINE':
                    if(chunk == '0'){
                        return await this.collection.find({ nsp: nsp, status: false }).sort({name : 1}).limit(20).toArray();
                    }else{
                        return await this.collection.aggregate([
                            { "$match": { "nsp": nsp, status: false}},
                            { "$sort" : {name : 1}},
                            { "$match": { "name" : {"$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray();
                    }
                default:
                    if(chunk == '0'){
                        return await this.collection.find({ nsp: nsp }).sort({name : 1}).limit(20).toArray();
                    }else{
                        return await this.collection.aggregate([
                            { "$match": { "nsp": nsp}},
                            { "$sort" : {name : 1}},
                            { "$match": { "name" : {"$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray();
                    }
            }                 
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async retrieveContactsByDept(nsp,group, department) {
        try {
            return await this.collection.find({ nsp: nsp, group: group,department: department}).sort({name : 1}).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async retrieveContactsByLevel(nsp, level = 0) {
        try {
            return await this.collection.find({ nsp: nsp, level: {'$gte': level}}).sort({name : 1}).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }

    public static async retrieveContactsByEmail(nsp,email) {
        try {
            return await this.collection.find({ nsp: nsp , email: email}).limit(1).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }
    public static async retrieveContactsByID(nsp,id) {
        try {
            return await this.collection.find({ nsp: nsp , _id: new ObjectId(id)}).limit(1).toArray();
        } catch (err) {
            console.log('Error in Retriveing Contacts');
            console.log(err);
        }
    }

    public static async updateStatus(email,nsp,status){
        // console.log(email,nsp,status);
        return await this.collection.findOneAndUpdate({email: email, nsp: nsp}, {$set : {status : status}});
    }

    public static async editContact(contact) {
        //console.log("in edit contact model");
        //console.log(contact)
        // maintian 2 vars for update:
        // contact - will be returned
        // contactToUpdate - will be sent to db (must omit _id for successful update)
        let id: ObjectID = new ObjectID(contact._id);

        // Verifictaion
        let contactToUpdate: ContactSchemaWithID = this.cleanContactInputFields(contact);
        if (!this.numberPattern.test(contactToUpdate['phone_no'])) {
            throw new CustomError("InvalidPhoneNumberOnContactCreation", 1, "Contact phone number is invalid on contact creation");
        }
        else if (!this.emailPattern.test(contactToUpdate['email'])) {
            throw new CustomError("InvalidEmailOnContactCreation", 2, "Email is invalid on contact creation");
        }

        //console.log(contactToUpdate);
        // deep clone contact 
        contact = JSON.parse(JSON.stringify(contactToUpdate));
        delete contactToUpdate._id;

        let updateRes: any = await this.collection.updateOne({ _id: id }, { $set: contactToUpdate });
        if (updateRes && updateRes.result && updateRes.result.nModified === 1) {
            return contact;
        }
        else {
            throw new CustomError("UnsuccessfulContactEdit", 5, "Update of edited contact operation is unsuccessful.")
        }
    }

    public static async DeleteContact(id, nsp){
        try{
            return await this.collection.deleteOne({_id: new ObjectID(id)});
            // return await this.collection.find({nsp: nsp}).toArray();
        }catch(err){
            console.log(err);
        }
        
    }

    public static async ImportContacts(contactList, nsp){
        for(let i = 0; i< contactList.length; i++){
            if(contactList[i].name && contactList[i].email){
                let records = await this.collection.find({ email: contactList[i].email, nsp: nsp }).toArray();
                if(records && !records.length){               
                    await this.collection.insertOne(contactList[i]);
               }
            }       
        }
        return this.collection.find({nsp: nsp}).sort({name: 1}).limit(20).toArray();
    }

    public static async ImportContactsWithUpdate(contactList, nsp){
        for(let i = 0; i< contactList.length; i++){
            if(contactList[i].name && contactList[i].email){
                let record = await this.collection.findOne({ email: contactList[i].email, nsp: nsp });
                if(record){
                    let data = contactList[i];                 
                    await this.collection.update({_id : record._id}, {$set : data} );
                }else{
                    await this.collection.insertOne(contactList[i]);
                }
            }       
        }
        return this.collection.find({nsp: nsp}).sort({name: 1}).limit(20).toArray();
    }

    // -------------------------------x---------------------------------------------------x ||
    //                              Helper Functions 
    //--------------------------------x---------------------------------------------------x ||

    private static async isEmailUnique(email, namespace) {
        // console.log('email')
        // console.log(email)
        let records = (await this.collection.find({ email: email, nsp: namespace }).toArray());
        // console.log('records')
        // console.log(records)

        // console.log('records && records.length > 0')
        // console.log(records && records.length > 0)
        if (records && records.length > 0) {
            throw new CustomError("EmailNotUnique", 3, "Email has been previously registered in the namespace db");
        }
    }

    private static cleanContactInputFields(contact) {
        contact['email'] = contact['email'].toLowerCase().trim();
        contact['name'] = contact['name'].trim();
        contact['phone_no'] = contact['phone_no'].trim();

        return contact;
    }

    public static NotifyAll(): string {
        return 'Contact';
    }
}