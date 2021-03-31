import { AgentSchema } from "../schemas/agentSchema";

let password = '12345678';
let role = 'Mobile Agents';
let nsp = '/hrm.sbtjapan.com';
let createdBY = 'saadisheikh9705@sbtjapan.com';

var agents: Array<any> = [];
declare const db;
declare const print;

if (!role) { throw new Error('Role Error : Not Set'); process.exit(1); }
if (!password) { throw new Error("Password Error : Not set"); process.exit(1); }
if (!nsp) { throw new Error("Namespace Error : Not set"); process.exit(1); }
if (!createdBY) { throw new Error("Creator Error : Not defined"); process.exit(1); }

if (agents && !agents.length) { throw new Error('Agents List Empty'); process.exit(1); }

let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let failedAgents: Array<any> = [];
let successfullInserts: Array<any> = [];
let total = agents.length;
let ended = false;

async function createAgent() {
    return Promise.all(agents.map(async agent => {

        let valid = emailPattern.test(agent);
        if (!valid) {
            print(`Invalid Email : ${agent}`);
            failedAgents.push({ email: agent, reason: 'Invalid Email' });
            return;
        }
        else {
            // print(agent);
            let exist = await db.agents.find({ email: agent }).limit(1).toArray();
            if (exist && exist.length) { print('Exist : ', agent); failedAgents.push({ email: agent, reason: 'Duplicate' });; return; }
            else {
                let tempAgent = {
                    first_name: agent.split('@')[0],
                    last_name: agent.split('@')[0],
                    phone_no: +920000000000,
                    nickname: agent.split('@')[0],
                    username: agent.split('@')[0],
                    password: password,
                    group: ['DF'],
                    email: agent,
                    role: role,
                    gender: 'N/A',
                    nsp: nsp,
                    created_date: new Date(),
                    created_by: createdBY,
                    applicationSettings: {
                        acceptingChatMode: false
                    },
                    editsettings: {
                        editprofilepic: true,
                        editname: true,
                        editnickname: true,
                        editpassword: true,
                    },
                    communicationAccess: {
                        enablechat: true,
                        voicecall: true,
                        videocall: true,
                    },
                    settings: {
                        simchats: 5
                    }
                }

                let result = await db.agents.insertOne(tempAgent);
                if (result && result.insertedCount) { print('Successfully Inserted : ' + agent); }
            }
        }

    }));
}

createAgent().then(data => {
    if (successfullInserts.length) {
        print('----           Successful Agent             ----');
        successfullInserts.map(function (temp) { print('Email : ', temp); });
    }
    if (failedAgents.length) {
        print('----     Failed Agents List and Reasons     ----');
        failedAgents.map(function (temp) { print(" Email : " + temp.email + ", Reason : " + temp.reason + " "); });
    }
    print('Insertion Finished');
    print('Total Agent : ', total);
    print('Duplicate Agents : ', failedAgents.length);
    print('Successfull Agents : ', successfullInserts.length);
}).catch(err => { print('error in inserting Agent') });
