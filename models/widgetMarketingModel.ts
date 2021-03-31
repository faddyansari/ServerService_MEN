import { Db, Collection, ObjectID, ObjectId } from "mongodb";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";


export interface News {
  _id: ObjectID;
  title: string;
  desc: string;
  link?: string;
  image?: any;
  background?: any;
  nsp: any;
  active: boolean;
  createdOn: string;
}
export interface Promotion {
  _id: ObjectID;
  title?: string;
  desc?: string;
  link?: string;
  image?: any;
  type: string;
  background?: any;
  price?: number;
  nsp: any;
  active: boolean;
  createdOn: string;
  currency?: any;
}
export interface Faq {
  _id: ObjectID;
  question: string;
  answer: string;
  feedback?: string;
  nsp: any;
  createdOn: string;
  createdBy: boolean;
}


export class WidgetMarketingModel {
  static db: Db;
  static collection: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await MarketingDB.connect();
      this.collection = await this.db.createCollection('widgetMarketing')
      await this.db.createCollection('news');
      await this.db.createCollection('promotions');
      await this.db.createCollection('faqs');
      await this.db.createCollection('ICONNOtherPorts');
      // await this.db.createCollection('addressBook');
      await this.db.collection('faqs').createIndex({ question: "text" });
      console.log(this.collection.collectionName);
      WidgetMarketingModel.initialized = true;
      return WidgetMarketingModel.initialized;
    } catch (error) {
      console.log('error in Initializing widgetMarketing Model');
      throw new Error(error);
    }
    // Database Connection For Visitors Based Operation on Visitor Collections
  }

  public static async addNews(nsp, news: News) {
    try {
      let newsList = await this.db.collection('news').find({ nsp: nsp, active: true }).toArray();
      if (!newsList.length || newsList.length < 5) {
        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { news: news._id } }, { returnOriginal: false, upsert: true });
        return await this.db.collection('news').insertOne(news);
      } else {
        news.active = false;
        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { news: news._id } }, { returnOriginal: false, upsert: true });
        return await this.db.collection('news').insertOne(news);
      }
    } catch (error) {
      console.log('Error in adding News');
      console.log(error);
    }
  }
  public static async addPromotion(nsp, promotion: Promotion) {
    try {
      this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { promotions: promotion._id } }, { returnOriginal: false, upsert: true });
      return await this.db.collection('promotions').insertOne(promotion);
    } catch (error) {
      console.log('Error in adding Promotions');
      console.log(error);
    }
  }
  public static async addFaq(nsp, faq: Faq) {
    try {
      this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { faqs: faq._id } }, { returnOriginal: false, upsert: true });
      return await this.db.collection('faqs').insertOne(faq);
    } catch (error) {
      console.log('Error in adding FAQ');
      console.log(error);
    }
  }
  public static async UpdateFaq(nsp, faq: Faq) {
    try {
      return await this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, question: faq.question }, { $set: { answer: faq.answer } }, { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log('Error in adding FAQ');
      console.log(error);
    }
  }

  public static async deleteNews(newsId, nsp) {
    try {
      this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { news: new ObjectId(newsId) } }, { returnOriginal: false, upsert: false });
      return await this.db.collection('news').deleteOne({ _id: new ObjectId(newsId) });
    } catch (error) {
      console.log('Error in adding News');
      console.log(error);
    }
  }
  public static async deletePromotion(pId, nsp) {
    try {
      this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { promotions: new ObjectId(pId) } }, { returnOriginal: false, upsert: false });
      return await this.db.collection('promotions').deleteOne({ _id: new ObjectId(pId) });
    } catch (error) {
      console.log('Error in adding News');
      console.log(error);
    }
  }
  public static async deleteFaq(fId, nsp) {
    try {
      this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { faqs: new ObjectId(fId) } }, { returnOriginal: false, upsert: false });
      return await this.db.collection('faqs').deleteOne({ _id: new ObjectId(fId) });
    } catch (error) {
      console.log('Error in adding News');
      console.log(error);
    }
  }

  public static async getWidgetMarketing(nsp) {
    try {
      return await this.collection.aggregate([
        { $match: { nsp: nsp } },
        {
          $project:
          {
            _id: 1,
            nsp: 1,
            news: { $ifNull: [{ $slice: ['$news', -20, 20] }, []] },
            promotions: { $ifNull: [{ $slice: ['$promotions', -20, 20] }, []] },
            faqs: { $ifNull: [{ $slice: ['$faqs', -20, 20] }, []] }
          }
        }
      ]).limit(1).toArray();
    } catch (err) {
      console.log('Error in Get Widget Marketing');
      console.log(err);
    }
  }

  public static async getOtherPorts() {
    try {
      return await this.db.collection('ICONNOtherPorts').find({}).toArray();
    } catch (err) {
      console.log('Error in Get other ports');
      console.log(err);
    }
  }

  public static async LikeOnPost(nsp, _id, likes, alreadyLiked = false) {

    try {
      //    if (session) {
      if (!alreadyLiked) return await this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(_id), type: 'post' }, { $addToSet: { likes: likes } }, { returnOriginal: false, upsert: false });

      else return await this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(_id), type: 'post' }, { $pull: { likes: { visitorEmail: likes.visitorEmail } } }, { returnOriginal: false, upsert: false });
      // } else {
      //     return undefined
      // }
    } catch (err) {
      console.log('error in liking post');
      console.log(err);
    }

  }

  public static async ViewOnProduct(_id, views) {

    try {
      // if (session) {
      return await this.db.collection('promotions').findOneAndUpdate({ _id: new ObjectId(_id), type: 'product' }, { $push: { views: views } }, { returnOriginal: false, upsert: false });

      // } else {
      //     return undefined
      // }
    } catch (err) {
      console.log('Error in Views on Product');
      console.log(err);
    }

  }
  public static async ReviewOnPost(nsp, _id, reviews) {

    try {
      // if (session) {
      return await this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(_id), type: 'post' }, { $push: { reviews: reviews }, $inc: { count: 1 } }, { returnOriginal: false, upsert: false });

      // } else {
      //     return undefined
      // }
    } catch (err) {
      console.log('Error in Review post');
      console.log(err);
    }

  }

  public static async DeleteReviewOnPost(reviews, _id) {

    try {


      return await this.db.collection('promotions').findOneAndUpdate({ _id: new ObjectId(_id), type: 'post' }, { $pull: { reviews: reviews }, $inc: { count: -1 } }, { returnOriginal: false, upsert: false });

    } catch (err) {
      console.log('Error in Delete Review');
      console.log(err);
    }
  }

  public static async getMoreReviews(promoid, date = '') {

    //new ObjectID()
    try {

      if (date) {
        // console.log('in date')
        // console.log(date)
        let reviews = await this.db.collection('promotions').aggregate([
          {
            '$match': {
              '_id': new ObjectId(promoid)
            }
          }, {
            '$unwind': {
              'path': '$reviews'
            }
          },
          {
            '$project': {
              '_id': 0,
              'reviews': 1
            }
          }, {
            '$sort': {
              'reviews.createdOn': -1

            }
          },
          {
            $match: {
              'reviews.createdOn': {
                $lt: date
              }
            }
          }
        ]).limit(5).toArray();
        console.log(reviews)
        return reviews.map(r => r.reviews);
      }
      else {
        let reviews = await this.db.collection('promotions').aggregate([
          {
            '$match': {
              '_id': new ObjectId(promoid)
            }
          }, {
            '$unwind': {
              'path': '$reviews'
            }
          }, {
            '$project': {
              '_id': 0,
              'reviews': 1
            }
          }, {
            '$sort': {
              'reviews.createdOn': -1
            }
          }
        ]).limit(5).toArray();
        return reviews.map(r => r.reviews);
      }
    }
    catch (error) {
      console.log('Error in Get Reviews');
      console.log(error);
      return [];
    }

  }
  public static async ToggleNews(nsp, newsId, check: boolean) {
    try {
      if (check) {
        let news = await this.db.collection('news').find({ nsp: nsp, active: true }).toArray();
        if (news.length < 5) {
          return await this.db.collection('news').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(newsId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false });
        } else {
          return undefined;
        }
      } else {
        return await this.db.collection('news').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(newsId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false });
      }

    } catch (err) {
      console.log('Error in Toggle News');
      console.log(err);
    }
  }

  public static async getNews(objIDList: Array<any>) {
    try {
      return await this.db.collection('news').find({ _id: { $in: objIDList } }).toArray();
    } catch (err) {
      console.log('Error in Get News');
      console.log(err);
    }
  }

  public static async getMoreNews(nsp, lastObjectID = '0') {
    try {
      return await this.db.collection('news').aggregate([
        { "$sort": { "createdOn": -1 } },
        { "$match": { nsp: nsp, "_id": { "$lt": new ObjectID(lastObjectID) } } },
        { "$limit": 20 }
      ]).toArray();
    } catch (err) {
      console.log('Error in Get More News');
      console.log(err);
    }

  }

  public static async getActiveNews(nsp) {
    try {
      return await this.db.collection('news').find({ nsp: nsp, active: true }).sort({ _id: -1 }).limit(8).toArray();
    } catch (err) {
      console.log('Error in Get Active News');
      console.log(err);
      return [];
    }
  }

  public static async getMoreActiveNews(_id, nsp) {
    try {
      return await this.db.collection('news').find({ nsp: nsp, active: true, _id: { $lt: new ObjectId(_id) } }).sort({ _id: -1 }).limit(5).toArray();
    } catch (err) {
      console.log('Error in Get Active News');
      console.log(err);
      return [];
    }
  }


  public static async getActiveNewsByDate(datefrom, dateto, nsp) {
    try {

      let obj: any = {
        nsp: nsp,
        active: true
      };

      let $and: Array<any> = [];
      if (datefrom) $and.push({ createdOn: { $gte: datefrom } })
      if (dateto) $and.push({ createdOn: { $lte: dateto } })
      obj.$and = $and;

      // console.log(obj);

      return await this.db.collection('news').find(obj).toArray();
    } catch (err) {
      console.log('Error in Get Active News');
      console.log(err);
      return [];
    }
  }

  public static async TogglePromotion(nsp, pId, check: boolean) {
    try {
      if (check) {
        let news = await this.db.collection('promotions').find({ nsp: nsp, active: true }).toArray();
        if (news.length < 5) {
          return await this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(pId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false });
        } else {
          return undefined;
        }
      } else {
        return await this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(pId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false });
      }

    } catch (err) {
      console.log('Error in Toggle Promotions');
      console.log(err);
    }
  }

  public static async getPromotions(objIDList: Array<any>) {
    try {
      return await this.db.collection('promotions').find({ _id: { $in: objIDList } }).toArray();
    } catch (err) {
      console.log('Error in Get Promotions');
      console.log(err);
    }
  }

  public static async getMorePromotions(nsp, lastObjectID = '0') {
    try {
      return await this.db.collection('promotions').aggregate([
        { "$sort": { "createdOn": -1 } },
        { "$match": { nsp: nsp, "_id": { "$lt": new ObjectID(lastObjectID) } } },
        { "$limit": 20 }
      ]).toArray();
    } catch (err) {
      console.log('Error in Get More News');
      console.log(err);
    }

  }

  public static async getActivePromotions(nsp) {
    try {
      return await this.db.collection('promotions').aggregate([
        {
          '$match': {
            'nsp': nsp,
            'active': true
          }
        }, {
          '$project': {
            '_id': 1,
            'desc': 1,
            'title': 1,
            'nsp': 1,
            'type': 1,
            'active': 1,
            'price': 1,
            'currency': 1,
            'image': 1,
            'background': 1,
            'link': 1,
            'likes': 1,
            'views': 1,
            'count': 1,
            'reviews': {
              '$ifNull': [
                {
                  '$slice': [
                    '$reviews', -5, 5
                  ]
                }, []
              ]
            },

          }
        }, {
          '$unwind': {
            'path': '$reviews',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$sort': {
            'reviews.createdOn': -1
          }
        }, {
          '$group': {
            '_id': '$_id',
            'desc': {
              '$first': '$desc'
            },
            'title': {
              '$first': '$title'
            },
            'price': {
              '$first': '$price'
            },
            'nsp': {
              '$first': '$nsp'
            },
            'type': {
              '$first': '$type'
            },
            'active': {
              '$first': '$active'
            },
            'image': {
              '$first': '$image'
            },
            'currency': {
              '$first': '$currency'
            },
            'link': {
              '$first': '$link'
            },
            'background': {
              '$first': '$background'
            },
            'createdOn': {
              '$first': '$createdOn'
            },
            'likes': {
              '$first': '$likes'
            },
            'views': {
              '$first': '$views'
            },
            'count': {
              '$first': '$count'
            },
            'reviews': {
              '$push': '$reviews'
            }
          }
        }
      ]).sort({ _id: 1 }).toArray();
      //  return promotions.map(p => p.promotions);
      // return await this.db.collection('promotions').find({ nsp: nsp, active: true }, {
      //     fields: {
      //        reviews: 0

      //     }
      // }).toArray();
    } catch (err) {
      console.log('Error in Get Active Promotions');
      console.log(err);
      return []
    }
  }

  public static async ToggleFaq(nsp, fId, check: boolean) {
    try {
      if (check) {
        let news = await this.db.collection('faqs').find({ nsp: nsp, active: true }).toArray();
        if (news.length < 5) {
          return await this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(fId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false });
        } else {
          return undefined;
        }
      } else {
        return await this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, _id: new ObjectId(fId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false });
      }

    } catch (err) {
      console.log('Error in Toggle Faqs');
      console.log(err);
    }
  }

  public static async getFaqs(objIDList: Array<any>) {
    try {
      return await this.db.collection('faqs').find({ _id: { $in: objIDList } }).toArray();
    } catch (err) {
      console.log('Error in Get Faqs');
      console.log(err);
    }
  }
  public static async getFaqsForVisitor(nsp: any) {
    try {
      return await this.db.collection('faqs').find({ nsp: nsp }).sort({ _id: -1 }).limit(12).toArray();
    } catch (err) {
      console.log('Error in Get Faqs');
      console.log(err);
    }
  }

  public static async getFaqsByQuestion(text, nsp) {
    try {
      return await this.db.collection('faqs').find({
        nsp: nsp,
        $text: {
          $search: text.trim()
        }
      }, {
        fields: {
          question: 1,
          answer: 1
        }
      }).toArray();
    } catch (err) {
      console.log('Error in Get Faqs');
      console.log(err);
      return [];
    }
  }


  public static async getMoreFaqs(lastObjectID = '0', nsp) {
    try {
      return await this.db.collection('faqs').aggregate([
        { "$sort": { "_id": -1 } },
        { "$match": { nsp: nsp, "_id": { "$lt": new ObjectID(lastObjectID) } } },
        { "$limit": 5 }
      ]).toArray();
    } catch (err) {
      console.log('Error in Get More Faqs');
      console.log(err);
    }

  }
}