import { Db, Collection, ObjectId, UpdateWriteOpResult } from "mongodb";
import { SessionManager } from "../globals/server/sessionsManager";
import { MarketingDB } from "../globals/config/databses/Marketing-DB";

export class AddressBookModel {
  static db: Db;
  static collection: Collection;
  static initialized = false;

  public static async Initialize(): Promise<boolean> {

    try {
      this.db = await MarketingDB.connect();
      this.collection = await this.db.createCollection('addressBooks')
      console.log(this.collection.collectionName);
      AddressBookModel.initialized = true;
      return AddressBookModel.initialized;
    } catch (error) {
      console.log('error in Initializing Address Book Model');
      throw new Error(error);
    }

  }

  public static async getAddressBooks(nsp) {
    try {
      return await this.collection.find({ nsp: nsp }).toArray();
    } catch (err) {
      console.log('Error in getting Address Books');
      console.log(err);
    }
  }

  public static async insertAddressBook(addressBooks) {
    try {
      return await this.collection.insertOne(addressBooks);
    } catch (err) {
      console.log('Error in inserting Address Books');
      console.log(err);
    }
  }
  public static async deleteAddressBook(id, nsp) {
    try {
      let deletion = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (deletion && deletion.deletedCount != 0) {
        let addressBook = await this.collection.find({ nsp: nsp }).toArray();
        return (addressBook && addressBook.length) ? addressBook : [];
      } else {
        return [];
      }
    } catch (err) {
      console.log('Error in deleting Address Book');
      console.log(err);
    }
  }
  public static async updateAddressBook(id, addressBook) {
    try {
      return await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: addressBook.name, desc: addressBook.desc } }, { returnOriginal: false, upsert: false });
    } catch (err) {
      console.log('Error in updating Address Book');
      console.log(err);
    }
  }

  public static async addCustomers(id, customers) {
    try {
      let Obj: any = [];
      customers.forEach(email => {
        Obj.push({ email: email, excluded: false })
      });
      let addressBook = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $addToSet: { customers: { $each: Obj } } }, { returnOriginal: false, upsert: false });
      if (addressBook && addressBook.value) {

        return addressBook;
      }
    } catch (err) {
      console.log('Error in adding customer for Address Book');
      console.log(err);
    }
  }

  public static async toggleExclude(nsp, name, email, value) {
    try {
      let addressBook = await this.collection.find({ nsp: nsp, name: name }).limit(1).toArray();
      if (addressBook && addressBook.length) {
        addressBook[0].customers.filter(a => a.email == email)[0].excluded = value;
        this.collection.save(addressBook[0]);
      }
      return (addressBook && addressBook.length) ? addressBook[0] : undefined;
    } catch (err) {
      console.log(err);
    }
  }


  public static async removeCustomer(id, email) {
    try {
      // console.log(id, email);
      let addressBook = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $pull: { customers: { email: email } } }, { returnOriginal: false, upsert: false });
      if (addressBook && addressBook.value) {

        return addressBook;
      }
    } catch (err) {
      console.log('Error in adding customer for address book');
      console.log(err);
    }
  }

  public static async getAddressBooksAgainstCustomers(nsp, email) {
    try {
      let addressBooks: any = [];
      let addressBooksFromDb = await this.collection.find({
        nsp: nsp,
        'customers.email': email
      }).toArray();
      if (addressBooksFromDb && addressBooksFromDb.length) {
        addressBooks = addressBooksFromDb.map(t => t.name);
      }
      return addressBooks;
    } catch (err) {
      console.log('Error in getting address Books against customers');
      console.log(err);

    }
  }


  public static async ToggleActivation(nsp, flag, id, by: string) {
    try {
      return await this.collection.findOneAndUpdate(
        { nsp: nsp, _id: new ObjectId(id) },
        { $set: { isActive: flag, lastmodified: { date: new Date().toISOString(), by: by } } },
        { returnOriginal: false, upsert: false });
    } catch (error) {
      console.log(error);
    }
  }

}