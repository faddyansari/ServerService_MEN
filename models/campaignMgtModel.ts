import { Db, Collection, ObjectId, UpdateWriteOpResult } from "mongodb";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";

export class CampaignManagementModel {
  static db: Db;
  static collection: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await MarketingDB.connect();
      this.collection = await this.db.createCollection('campaignMgt');
      CampaignManagementModel.initialized = true;
      return CampaignManagementModel.initialized;
    } catch (error) {
      console.log('error in Initializing campaign mgt Model');
      throw new Error(error);
    }

  }

  public static async getCampaigns(nsp) {
    try {
      return await this.collection.find({ nsp: nsp }).toArray();
    } catch (err) {
      console.log('Error in getting campaigns');
      console.log(err);
    }
  }

  public static async insertCampaign(campaign) {
    try {
      return await this.collection.insertOne(campaign);
    } catch (err) {
      console.log('Error in inserting campaign');
      console.log(err);
    }
  }
  public static async deleteCampaign(id, nsp) {
    try {
      let deletion = await this.collection.deleteOne({ _id: new ObjectId(id), nsp: nsp });
      if (deletion && deletion.deletedCount != 0) {
        let owners = await this.collection.find({ nsp: nsp }).toArray();
        return (owners && owners.length) ? owners : [];
      } else {
        return [];
      }
    } catch (err) {
      console.log('Error in deleting campaign');
      console.log(err);
    }
  }
  public static async updateCampaign(id, nsp, ownerObj) {
    try {
      return await this.collection.findOneAndReplace({ _id: new ObjectId(id), nsp: nsp }, (ownerObj), { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log('Error in updating campaign');
      console.log(err);
    }
  }


  public static async toggleCampaign(flag, id, nsp, by, type) {
    try {
      if (type == 'activation') {
        return await this.collection.findOneAndUpdate(
          { nsp: nsp, _id: new ObjectId(id) },
          { $set: { activated: flag, ['lastModified.at']: new Date().toISOString(), ['lastModified.by']: by } },
          { returnOriginal: false, upsert: false });
      } else {
        return await this.collection.findOneAndUpdate(
          { nsp: nsp, _id: new ObjectId(id) },
          { $set: { archieved: flag, ['lastModified.at']: new Date().toISOString(), ['lastModified.by']: by } },
          { returnOriginal: false, upsert: false });
      }
    } catch (error) {
      console.log("error in toggle campaign");
    }
  }

}