let groupName = 'SBT UAE';
let nsp = '/hrm.sbtjapan.com';
let createdBY = 'saadisheikh9705@sbtjapan.com';

let members: Array<any> = [
    , 'fahhmed9813@sbtjapan.com'
    , 'talahmed9877@sbtjapan.com'
    , 'umsaeed9391@sbtjapan.com'
    , 'waleedasif9800@sbtjapan.com'
    , 'waqrasul9591@sbtjapan.com'
    , 'wsaleem9253@sbtjapan.com'
    , 'yousuf9333@sbtjapan.com'
]

var groupAdminName: Array<string> = [
    'saleem9204@sbtjapann.com',
    'kzafar9320@sbtjapann.com',
];
declare const db;
declare const print;

if (!groupName) { throw new Error('Group Name Error : Not Set'); process.exit(1); }
if (!nsp) { throw new Error("Namespace Error : Not set"); process.exit(1); }
if (!createdBY) { throw new Error("Creator Error : Not defined"); process.exit(1); }


let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let failedAgents: Array<any> = [];

let temp = {
    type: 'group',
    group_name: groupName,
    members: [] as any,
    createdBy: createdBY,
    createdOn: new Date().toISOString(),
    LastUpdated: new Date().toISOString(),
    nsp: nsp,
    messages: [] as any,
    LastSeen: [] as any

}
const rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];


async function createGroup() {
    members = members.map(agent => {
        let replaced = agent;
        if (agent.indexOf('@globalintltd.com') != -1) replaced = (replaced as string).replace('@globalintltd.com', '@globalintltdd.com');
        if (agent.indexOf('@blauda.com') != -1) replaced = (replaced as string).replace('@blauda.com', '@blaudaa.com')
        if (agent.indexOf('@sbtjapan.com') != -1) replaced = (replaced as string).replace('@sbtjapan.com', '@sbtjapann.com')

        return replaced;
    });
    groupAdminName.map(admin => {
        if (!members.includes(admin)) { members.push(admin); }
    })
    members.map(agent => {

        let valid = emailPattern.test(agent);
        let randomColor = rand[Math.floor(Math.random() * rand.length)];

        if (!valid) {
            print(`Invalid Email : ${agent}`);
            failedAgents.push({ email: agent, reason: 'Invalid Email' });
            return;
        }
        else {
            // print(agent);

            let member = {
                email: agent,
                isAdmin: ((groupAdminName.includes(agent)) ? true : false),
                viewColor: randomColor,
            }
            temp.members.push(member);

        }

    });
    let result = await db.agentConversations.insertOne(temp);
    if (result && result.acknowledged && result.insertedId) {
        print('Inserted Conversation now Inserting Members : ', result.insertedId);
        let insertedConversation = await db.agentConversations.find({ _id: result.insertedId }).limit(1).toArray();
        if (insertedConversation && insertedConversation.length) {

            let promises = await Promise.all(insertedConversation[0].members.forEach(async member => {
                print('Email : ', member.email);
                temp.members.forEach(member => {
                    temp.LastSeen.push({
                        email: member.email,
                        messageReadCount: 0,
                        DateTime: new Date().toISOString()
                    });
                });
                await db.agentConversations.findOneAndUpdate(
                    { _id: result.insertedId },
                    {
                        $push: {
                            "LastSeen": {
                                email: member.email,
                                messageReadCount: 0,
                                DateTime: new Date().toISOString()
                            }
                        }
                    })
                return createConversation(result.insertedId, member.email);
            }));
            await promises
            print('Successfully Inserted : ' + temp.group_name);
        }
    }
}

async function createConversation(cid, email) {
    try {
        let obj = {
            cid: cid,
            email: email,
            deleted: false,
            exited: false,
            removed: false
        }
        db.agentConversationsStatus.insertOne(obj);
    } catch (error) {
        console.log('Error in Create Agent Conversation');
        console.log(error);
    }
}

createGroup().then(data => {
    print('Insertion Finished');
    print('Duplicate Agents : ', failedAgents.length);
    if (failedAgents.length) {
        print('----     Failed Agents List and Reasons     ----');
        failedAgents.map(function (temp) { print(" Email : " + temp.email + ", Reason : " + temp.reason + " "); });
    }
}).catch(err => { print(err); print('error in inserting Agent') });
