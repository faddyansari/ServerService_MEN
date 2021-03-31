
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection } from "mongodb";
import { Referer } from "../schemas/reportsSchema";
import { ArchivingDB } from "../globals/config/databses/Analytics-Logs-DB";

export class ReportsModel {


  static db: Db;
  static referers: Collection;
  static get_password_logs: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await ArchivingDB.connect();
      this.referers = await this.db.createCollection('warehouse_referers')
      this.get_password_logs = await this.db.createCollection('get_password_logs')
      console.log(this.referers.collectionName);
      ReportsModel.initialized = true;
      return ReportsModel.initialized;
    } catch (error) {
      console.log('error in Initializing ReportsModel');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections
  }

  public static async InsertOrUpdateTopVisitedLink(referer: Referer) {
    referer.date = this.customDate(referer.date);
    let data = await this.referers.find({ date: new Date(this.customDate(referer.date)), nsp: referer.nsp }).limit(1).toArray();
    if (data && data.length) {
      data[0].urls.forEach(element => {
        if (element.url == referer.urls[0].url) {
          element.count += 1;
        } else {
          data[0].urls.push(referer.urls[0]);
        }
      });
      await this.referers.updateOne({ date: new Date(this.customDate(referer.date)), nsp: referer.nsp }, { $set: { urls: data[0].urls } });
    } else {
      referer.date = new Date(referer.date)
      this.referers.insertOne(referer);
    }

  }
  public static async insertPasswordLog(email, detailsfor, responseText, status, public_ip) {
    try {
      let obj = {
        requested_by: email,
        detailsfor: detailsfor,
        responseText: responseText,
        datetime: new Date().toISOString(),
        status: status,
        ip_public: public_ip
      }
      this.get_password_logs.insertOne(obj);
    } catch (err) {
      console.log('Error in inserting password log');
      console.log(err);
    }
  }
  public static customDate(d) {
    return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
  }
}

