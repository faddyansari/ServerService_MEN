module.exports = {
  apps : [{
    name   : "agentservice",
    script : "./build/index.js",
    env : { "NODE_ENV":"production" , "PORT":8000 }
  }]
}