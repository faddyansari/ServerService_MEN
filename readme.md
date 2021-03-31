
##Server Ecosystem for pm2
module.exports = {
  apps : [{
    name   : "MAIN APP",
    script : "/home/ec2-user/SBT-CHAT/SBT CHAT SERVER/build/index.js",
   env : { "NODE_ENV":"production" , "DB_ADDRESS":"xxx.xxx.xxx.xxx"  }
  }]
}


##FOR LOCAL SERVER TUNNELLING USE FOLLOWING COMMAND
ssh -R 80:localhost:3000 serveo.net

## OR INSTALL NGROK
https://dashboard.ngrok.com/get-started/setup