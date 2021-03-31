
// Created By Saad Ismail Shaikh
// Date : 22-1-18
import { Db, Collection } from "mongodb";
import { CompaniesDB } from "../globals/config/databses/Companies-DB";


export class Reseller {


    static db: Db;
    static collection: Collection;
    static collectionAppToken: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await CompaniesDB.connect();
            this.collection = await this.db.createCollection('resellers')
            console.log(this.collection.collectionName);
            Reseller.initialized = true;
            return Reseller.initialized;
        } catch (error) {
            console.log('error in Initializing Reseller Model');
            throw new Error(error);
        }

    }

    public static CheckReseller(email): Promise<any[]> {
        try {
            console.log(email);

            return this.collection
                .find({ "personalInfo.email": email })
                .limit(1)
                .toArray();
        } catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    }


    public static async AuthenticateReseller(email: string, password: string) {
        try {

            // { nsp: '/admin' },
            // { isAdmin: { $exists: true }}
            return (await this.collection
                .find(
                    {
                        $and: [
                            { "personalInfo.email": email },
                            { "personalInfo.password": password },
                            { verified: true }
                        ]
                    })
                .limit(1)
                .toArray());
        } catch (error) {
            console.log('Error in Authenticating Admin');
            console.log(error);
        }
    }


    public static async VerifyReseller(email, value, admin) {
        try {
            if (email) {
                return this.collection.findOneAndUpdate(
                    // { personalInfo: { email: email } },
                    { "personalInfo.email": email },
                    {
                        $set:
                        {
                            verified: value,
                            DisprovedOrApprovedBy: {
                                date: new Date().toISOString(),
                                by: admin,
                            }
                        }
                    }, { returnOriginal: false, upsert: false },

                );

            }
        } catch (err) {
            console.log(err);
        }

    }


    public static async ResellerResetPassword(email, password) {
        try {
            if (email) {
                return this.collection.findOneAndUpdate(
                    // { personalInfo: { email: email } },
                    { "personalInfo.email": email },
                    {
                        $set:
                        {
                            "personalInfo.password": password
                        }
                    }, { returnOriginal: false, upsert: false },

                );

            }
        } catch (err) {
            console.log(err);
        }

    }
    public static async ChangePassword(password, email) {
        console.log(password);
        console.log(email);
        try {
            return this.collection.findOneAndUpdate({ "personalInfo.email": email }, {
                $set: {
                    "personalInfo.password": password
                }
            }, { returnOriginal: false, upsert: false })
        } catch (error) {
            console.log(error);
            console.log('error in Change Password');
        }
    }

    public static async ResellerExists(userEmail: string): Promise<boolean> {
        // //console.log(this.collection);
        try {
            return !!(await this.collection
                .find({ "personalInfo.email": userEmail })
                .limit(1)
                .toArray()).length;
        } catch (error) {
            console.log(error);
            throw new Error("Can't Find Agent In Exists");
        }

    }


    


    public static async RegisterReseller(reseller) {
        try {


            let createdDate = (new Date()).valueOf().toString();
            reseller.createdDate = createdDate;
            reseller.verified = false;

            let inserted = await this.collection.insertOne(reseller);

            console.log('inserted');
            console.log(inserted);

            if (inserted.insertedCount) return inserted;
            else return undefined
        } catch (error) {
            console.log('Error in Registering company');
            console.log(error);
            return undefined;
        }

    }

    public static async GetResellerByEmail(emaiil) {
        return this.collection.find({ "personalInfo.email": emaiil }).limit(1).toArray();
    }


    public static verifylicenseMobile(license) {
        return this.collection.find(
            {
                license: license
            }, {
                fields:
                {
                    company_info: 1,
                    name: 1,
                    // ['settings.chatSettings.allowFileSharing.forVisitors']: 1,
                    // ['settings.displaySettings']: 1
                }
            })
            .limit(1).toArray();

    }

    public static getScript(nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1 } }).toArray();
    }

    public static GetCompanyInfo(nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1, company_info: 1 } }).toArray();
    }

    public static async GetResellers() {
        return this.collection.find().toArray();
    }

    public static getSettings(nsp: string) {
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.chatSettings': 1,
                }
            })
            .limit(1).toArray();
    }

    // public static GetVerificationStatus(nsp: string) {
    //     return this.collection.find(
    //         { name: nsp },
    //         {
    //             fields: {
    //                 _id: 0,
    //                 'settings.verified': 1,
    //                 'createdAt': 1,
    //                 'expiry': 1

    //             }
    //         })
    //         .limit(1).toArray();
    // }

    public static getWebHooks(nsp: string) {
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.customScript': 1,
                }
            })
            .limit(1).toArray();
    }

    public static getTagsAutomationSettings(nsp: string) {
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.tagsAutomation': 1,
                }
            })
            .limit(1).toArray();
    }


    public static getDisplaySettings(nsp: string) {
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.displaySettings': 1
                }
            })
            .limit(1).toArray();
    }

    public static getAdminSettings(nsp: string) {
        //console.log(nsp);
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.chatSettings': 1,
                    'settings.callSettings': 1,
                    'settings.contactSettings': 1,
                    'settings.widgetMarketingSettings': 1
                }
            })
            .limit(1).toArray();
    }


    public static GetTicketSettings(nsp: string) {
        //console.log(nsp);
        return this.collection.find(
            { name: nsp },
            {
                fields: {
                    _id: 0,
                    'settings.ticketSettings': 1
                }
            })
            .limit(1).toArray();
    }


    //#region Update Settings

    public static updateNSPChatSettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.chatSettings." + data.settingsName]: data.settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }
    public static updateNSPCallSettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.callSettings"]: data.settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }
    public static updateNSPContactSettings(nsp: string, type, settings: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.contactSettings." + type]: settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }
    public static updateNSPWMSettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.widgetMarketingSettings"]: data.settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }


    public static UpdateTicketSettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.ticketSettings"]: data
                }
            }, { returnOriginal: false, upsert: false }
        );
    }


    public static updateNSPDisplaySettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.displaySettings.barEnabled"]: data.barEnabled,
                    ["settings.displaySettings.avatarColor"]: data.avatarColor,
                    ["settings.displaySettings.settings." + data.settingsName]: data.settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }

    public static UpdateBackGroundImage(nsp: string, data: any, remove: boolean) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.displaySettings.settings.chatwindow.themeSettings.bgImage"]: (remove) ? {} : data
                }
            }, { returnOriginal: false, upsert: false }
        );
    }

    public static updateChatWindowFormSettings(nsp: string, data: any) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.displaySettings.settings.chatwindow." + data.settingsName]: data.settings
                }
            }, { returnOriginal: false, upsert: false }
        );
    }


    public static SetCustomScript(nsp: string, script: string) {
        return this.collection.findOneAndUpdate(
            { name: nsp },
            {
                $set: {
                    ["settings.customScript.userFetching"]: script
                }
            }, { returnOriginal: false, upsert: false }
        )
    }

    //#endregion

    // public static async RegisterCompany(companiprofile) {
    //     try {
    //         let current_date = (new Date()).valueOf().toString();
    //         let hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
    //         companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
    //         companiprofile.rooms = {
    //             DF: {
    //                 isActive: true,
    //                 Agents: []
    //             }
    //         };
    //         companiprofile.license = hash;
    //         companiprofile.script = Company.generateScript(hash);
    //         companiprofile.settings = defaultSettings;

    //         let inserted = await this.collection.insertOne(companiprofile);
    //         (inserted.insertedCount) ? NameSpaces.RegisterNameSpace({
    //             name: companiprofile.name,
    //             rooms: companiprofile.rooms,
    //             settings: defaultSettings
    //         }) : undefined;


    //         if (inserted.insertedCount) {

    //             //#region Inserting Agent
    //             let agent = await Agents.RegisterAgent({
    //                 first_name: companiprofile.full_name,
    //                 last_name: '',
    //                 phone_no: companiprofile.phone_no,
    //                 nickname: companiprofile.username,
    //                 username: companiprofile.username,
    //                 password: companiprofile.password,
    //                 email: companiprofile.email,
    //                 role: 'admin',
    //                 gender: '',
    //                 nsp: companiprofile.name,
    //                 created_date: current_date,
    //                 created_by: 'self',
    //                 group: 'DF',
    //                 location: companiprofile.country,
    //                 editsettings: {
    //                     editprofilepic: true,
    //                     editname: true,
    //                     editnickname: true,
    //                     editpassword: true
    //                 },
    //                 communicationAccess: {
    //                     chat: true,
    //                     voicecall: false,
    //                     videocall: false
    //                 },
    //                 settings: {
    //                     simchats: 20
    //                 }
    //             });
    //             //#endregion
    //             return inserted;
    //         }

    //         else return undefined
    //     } catch (error) {
    //         console.log('Error in Registering company');
    //         console.log(error);
    //         return undefined;
    //     }

    // }

    public static async getCompany(nsp) {
        return this.collection.find({ name: nsp }).limit(1).toArray();
    }




    //#region Group Functions  
    public static getGroups(nsp) {
        return this.db.collection('companies').find({ name: nsp }, { fields: { _id: 0, rooms: 1 } }).toArray();
    }

    public static AddGroup(nsp, groupName) {
        return this.db.collection('companies').findOneAndUpdate(
            { name: nsp, ["rooms." + groupName]: { $exists: false } },
            {
                $set: { ["rooms." + groupName]: { isActive: false, Agents: [] } }
            }, { returnOriginal: false, upsert: false });
    }

    public static AddAgentToGroup(nsp, groupName, agentEmail) {
        return this.db.collection('companies').findOneAndUpdate(
            {
                name: nsp,
                ["rooms." + groupName]: { $exists: true },
                ["rooms." + groupName + ".Agents"]: { $nin: [agentEmail] }
            },
            {
                $addToSet: { ["rooms." + groupName + ".Agents"]: agentEmail }
            }, { returnOriginal: false, upsert: false, });
    }

    public static GetGroupByName(nsp, groupName) {
        return this.db.collection('companies').find(
            {
                name: nsp,
                ["rooms." + groupName]: { $exists: true }
            }).limit(1).toArray();
    }

    public static async GetActiveGroups(nsp: string, groups: Array<string>) {
        return await this.collection.aggregate([
            { "$match": { "name": nsp } },
            { "$project": { 'locations': { '$objectToArray': '$rooms' } } }
        ]).limit(1).toArray();

    }

    public static RemoveAgentFromGroup(nsp, groupName, agentEmail) {
        return this.db.collection('companies').findOneAndUpdate(
            {
                name: nsp,
                ["rooms." + groupName]: { $exists: true },
                ["rooms." + groupName + ".Agents"]: { $in: [agentEmail] }
            },
            {
                $pull: { ["rooms." + groupName + ".Agents"]: agentEmail }
            }, { returnOriginal: false, upsert: false, });
    }

    public static UpdateGroup(nsp, groupName, isActive: boolean) {
        if (!isActive) {
            return this.db.collection('companies').findOneAndUpdate(
                {
                    name: nsp,
                    ["rooms." + groupName]: { $exists: true },
                    ["rooms." + groupName + ".Agents"]: { $gt: [] }
                },
                {
                    $set: { ["rooms." + groupName + ".isActive"]: isActive }
                }, { returnOriginal: false, upsert: false });
        } else {
            return this.db.collection('companies').findOneAndUpdate(
                {
                    name: nsp,
                    ["rooms." + groupName]: { $exists: true },
                    ["rooms." + groupName + ".Agents"]: { $gt: [] }
                },
                {
                    $set: { ["rooms." + groupName + ".isActive"]: isActive }
                }, { returnOriginal: false, upsert: false });
        }

    }

    public static async UpdateCompany(company) {
        try {
            console.log(company)
            let CompnpanyInfo: any = {
                company_website: company.company_info.company_website,
                company_type: company.company_info.company_type,
                company_size: company.company_info.company_size,


            }
            if (company.name) {

                return this.collection.findOneAndUpdate(
                    { name: company.name },
                    {
                        $set:
                        {
                            email: company.email,
                            username: company.username,
                            full_name: company.full_name,
                            password: company.password,
                            country: company.country,
                            phone_no: company.phone_no,
                            company_info: CompnpanyInfo,
                            settings: company.settings,
                        }
                    }, { returnOriginal: false, upsert: false },

                );

            }
            else return undefined
        } catch (error) {
            console.log('Error in Registering company');
            console.log(error);
            return undefined;
        }

    }

    public static async DeleteCompany(nsp) {
        try {
            return await this.collection.deleteOne({ name: nsp });
            // return await this.collection.find({nsp: nsp}).toArray();
        } catch (err) {
            console.log(err);
        }

    }

    //#endregion






    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases 
    //--------------------------------x---------------------------------------------------x ||




    //-------------------------------x-------------------------------------------------------x ||
    //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
    //--------------------------------x------------------------------------------------------- ||


    //Admin PAnel

    public static async GetCompaniesByResellerEmail(user) {

        try {



           return await this.db.collection('companies').find({ name: { '$in': user.companiesRegistered } }).toArray();




        }
        catch (err) {
            console.log(err);
        }
    }


    public static async UpdateResellerCompanies(name, email) {
        console.log(name);
        console.log(email);

        try {

            return this.collection.findOneAndUpdate(
                {
                    "personalInfo.email": email,
                },
                {
                    $addToSet: { companiesRegistered: name }
                }, { returnOriginal: false, upsert: false, });

        }
        catch (err) {
            console.log(err);
        }
    }


}

