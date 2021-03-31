import { Db, Collection, ObjectId, UpdateWriteOpResult } from "mongodb";
import { SessionManager } from "../globals/server/sessionsManager";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";

export class EmailOwnerModel {
  static db: Db;
  static collection: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await MarketingDB.connect();
      this.collection = await this.db.createCollection('emailOwners');
      EmailOwnerModel.initialized = true;
      return EmailOwnerModel.initialized;
    } catch (error) {
      console.log('error in Initializing Email Owner Model');
      throw new Error(error);
    }

  }

  public static async getOwnersList(nsp) {
    try {
      return await this.collection.find({ nsp: nsp }).toArray();
    } catch (err) {
      console.log('Error in getting owners');
      console.log(err);
    }
  }

  public static async insertEmailOwner(owner) {
    try {
      return await this.collection.insertOne(owner);
    } catch (err) {
      console.log('Error in inserting Owner');
      console.log(err);
    }
  }
  public static async deleteEmailOwner(id, nsp) {
    try {
      let deletion = await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });
      if (deletion && deletion.deletedCount != 0) {
        let owners = await this.collection.find({ nsp: nsp }).toArray();
        return (owners && owners.length) ? owners : [];
      } else {
        return [];
      }
    } catch (err) {
      console.log('Error in deleting email owner');
      console.log(err);
    }
  }
  public static async updateEmailOwner(id, nsp, ownerObj) {
    try {
      return await this.collection.findOneAndReplace({ _id: new ObjectId(id), nsp: nsp }, (ownerObj), { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log('Error in updating Address Book');
      console.log(err);
    }
  }

  public static async toggleActivation(flag, id, nsp, by: string) {
    try {
      return await this.collection.findOneAndUpdate(
        { nsp: nsp, _id: new ObjectId(id) },
        { $set: { activated: flag, lastModifiedBy: by, lastModifiedDate: new Date().toISOString() } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
    }
  }

}