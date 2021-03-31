import { Db, Collection, ObjectId, UpdateWriteOpResult } from "mongodb";
import { TicketsDB } from "../globals/config/databses/TicketsDB";
import { SessionManager } from "../globals/server/sessionsManager";

export class TeamsModel {
    static db: Db;
    static collection: Collection;
    static initialized = false;

    public static async Initialize(): Promise<boolean> {

        try {
            this.db = await TicketsDB.connect();
            this.collection = await this.db.createCollection('teams')
            console.log(this.collection.collectionName);
            TeamsModel.initialized = true;
            return TeamsModel.initialized;
        } catch (error) {
            console.log('error in Initializing Teams Model');
            throw new Error(error);
        }
        // Database Connection For Visitors Based Operation on Visitor Collections


    }

    public static async getTeams(nsp) {
        try {
            return await this.collection.find({ nsp: nsp }).toArray();
        } catch (err) {
            console.log('Error in getting teams');
            console.log(err);
        }
    }
    public static async getTeamsCount(nsp) {
        try {
            return await this.collection.aggregate([
                { "$match": { "nsp": nsp } },
                { "$group": { "_id": null, "count": { $sum: 1 } } },
            ]).toArray();
        } catch (err) {
            console.log('Error in getting teams');
            console.log(err);
        }
    }

    public static async insertTeam(team) {
        try {
            return await this.collection.insertOne(team);
        } catch (err) {
            console.log('Error in inserting team');
            console.log(err);
        }
    }
    public static async deleteTeam(id, nsp) {
        try {
            let deletion = await this.collection.deleteOne({ _id: new ObjectId(id) });
            if (deletion && deletion.deletedCount != 0) {
                let teams = await this.collection.find({ nsp: nsp }).toArray();
                return (teams && teams.length) ? teams : [];
            } else {
                return [];
            }
        } catch (err) {
            console.log('Error in deleting team');
            console.log(err);
        }
    }
    public static async updateTeam(id, team_name) {
        try {
            return await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { team_name: team_name } }, { returnOriginal: false, upsert: false });
        } catch (err) {
            console.log('Error in inserting team');
            console.log(err);
        }
    }

    public static async addAgents(id, emails) {
        try {
            // console.log(emails);
            let emailsObj: any = [];
            emails.forEach(email => {
                emailsObj.push({ email: email, excluded: false })
            });
            let teams = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $addToSet: { agents: { $each: emailsObj } } }, { returnOriginal: false, upsert: false });
            if (teams && teams.value) {
                await SessionManager.updateSessions(emails, teams.value.team_name);
                return teams;
            }
        } catch (err) {
            console.log('Error in adding agent for team');
            console.log(err);
        }
    }

    public static async toggleExclude(nsp, team_name, email, value) {
        try {
            let team = await this.collection.find({ nsp: nsp, team_name: team_name }).limit(1).toArray();
            if (team && team.length) {
                team[0].agents.filter(a => a.email == email)[0].excluded = value;
                this.collection.save(team[0]);
            }
            return (team && team.length) ? team[0] : undefined;
        } catch (err) {
            console.log(err);
        }
    }


    public static async removeAgent(id, email) {
        try {
            // console.log(id, email);
            let teams = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $pull: { agents: { email: email } } }, { returnOriginal: false, upsert: false });
            if (teams && teams.value) {
                await SessionManager.updateSessions([email], teams.value.team_name, '$pull');
                return teams;
            }
        } catch (err) {
            console.log('Error in adding agent for team');
            console.log(err);
        }
    }

    public static async getTeamsAgainstAgent(nsp, email) {
        try {
            let teams: any = [];
            let teamsFromDb = await this.collection.find({
                nsp: nsp,
                'agents.email': email
            }).toArray();
            if (teamsFromDb && teamsFromDb.length) {
                teams = teamsFromDb.map(t => t.team_name);
            }
            return teams;
        } catch (err) {
            console.log('Error in getting team against agent');
            console.log(err);

        }
    }



    public static async getTeamMembersAgainstAgent(nsp, email) {
        try {
            let agents: any = [];
            let dataFromDB = await this.collection.aggregate([
                {
                    '$match': {
                        'nsp': nsp,
                        'agents.email': email
                    }
                }, {
                    '$unwind': {
                        'path': '$agents',
                        'includeArrayIndex': '0',
                        'preserveNullAndEmptyArrays': false
                    }
                }, {
                    '$group': {
                        '_id': '$nsp',
                        'agents': {
                            '$addToSet': '$agents.email'
                        }
                    }
                }
            ]).toArray();
            if (dataFromDB && dataFromDB.length) {
                agents = dataFromDB[0].agents;
            }
            return agents;
        } catch (err) {
            console.log('Error in getting agents against team');
            console.log(err);
            return [];
        }
    }

    public static async getTeamsMembersAgainstTeams(nsp, teams) {
        try {
            let agents: any = [];
            let dataFromDB = await this.collection.aggregate([
                {
                    '$match': {
                        'nsp': nsp,
                        'team_name': { $in: teams }
                    }
                }, {
                    '$unwind': {
                        'path': '$agents',
                        'includeArrayIndex': '0',
                        'preserveNullAndEmptyArrays': false
                    }
                }, {
                    '$group': {
                        '_id': '$nsp',
                        'agents': {
                            '$addToSet': '$agents'
                        }
                    }
                }
            ]).toArray();
            if (dataFromDB && dataFromDB.length) {
                agents = dataFromDB[0].agents;
            }
            return agents;
        } catch (err) {
            console.log('Error in getting agents against team');
            console.log(err);
        }
    }
}