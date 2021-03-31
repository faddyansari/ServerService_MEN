import { Db, Collection } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";

export class EmailActivations {
    static db: Db | undefined;
    static collection: Collection | undefined;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('emailActivations');
            console.log(this.collection.collectionName);
            EmailActivations.initialized = true;
            return EmailActivations.initialized;
        } catch (error) {
            console.log('error in Initializing emailActivations');
            throw new Error(error);
        }

    }

    static Destroy() {

        // Database Connection For Session Storage.
        this.db = undefined;
        this.collection = undefined;
    }

    public static async insertEmail(email) {
        try {
            if (this.collection) {
                let check = await this.checkEmail(email);
                if (check && !check.length) {
                    let insertion =  await this.collection.insertOne({
                        createdAt: new Date(),
                        email: email,
                        sent: true,
                        verified: false
                    });
                    if(insertion.insertedCount > 0) return { inserted: true, alreadyExists: false}
                }else{
                    return {inserted: false, alreadyExists: true}
                }
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);

        }
    }


    public static async updateSentStatus(email, status){
        try {
            if (this.collection) {         
                return await this.collection.updateOne({email: email}, {$set: {sent: status}});
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);

        }
    }
    public static async updateVerifiedStatus(email, status){
        try {
            if (this.collection) {         
                return await this.collection.updateOne({email: email}, {$set: {verified: status}});
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);

        }
    }

    public static async removeEmail(email) {
        try {
            if (this.collection) {
                return await this.collection.deleteOne({
                    email: email
                });
            }
        } catch (err) {
            console.log(err);

        }
    }

    public static async getUnverifiedEmails() {
        try {
            if (this.collection) {
                let emails = await this.collection.find({
                    sent: true,
                    verified: false
                }).toArray();
                if(emails && emails.length){
                    return emails.map(e => e.email);
                }else{
                    return [];
                }
            } else {
                return [];
            }
        } catch (err) {
            console.log(err);
            return [];
        }
    }
    public static async checkEmail(email) {
        try {
            if (this.collection) {
                return await this.collection.find({
                    email: email
                }).limit(1).toArray();
            } else {
                return [];
            }
        } catch (err) {
            console.log(err);

        }
    }
    public static async checkEmailIfAlreadySent(email) {
        try {
            if (this.collection) {
                return await this.collection.find({
                    email: email,
                    sent:true
                }).limit(1).toArray();
            } else {
                return [];
            }
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    public static async checkEmails(emails) {
        try {
            // console.log('Emails given: ');
            // console.log(emails);
            if(!Array.isArray(emails)) emails = [emails];
            
            console.log('Checking blacklisted emails!');
            
            if (this.collection) {
                let activeEmails : any = [];
                let emailsFromDb = await this.collection.find({
                    email: { $in: emails }
                }).toArray();
                if(emailsFromDb && emailsFromDb.length){
                    emails.forEach(email => {
                        if(!emailsFromDb.filter(e => e.email == email).length){
                            activeEmails.push(email);
                        }
                    });                    
                }else{
                    activeEmails = emails;
                    // return activeEmails;
                }
                // console.log('Active emails:');
                
                // console.log(activeEmails);
                
                return activeEmails
            } else {
                return emails;
            }
        } catch (err) {
            console.log(err);
        }
    }


}