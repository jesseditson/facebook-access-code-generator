// Config Loader
// Loads in a config object using config.js, or from an environment variable if config is not available
// (for instance, if running on heroku)
// If run as a command-line utility (for instance, from a pre-commit hook), will stringify the config file and drop it in the expected env variable.

// Dependencies
// ----
var exec = require('child_process').exec

// Helpers
// ---
var hasArg = function(arg){
  return ~process.argv.indexOf(arg)
}
var fromCwd = function(command){
  // execute command in cwd
  return "cd " + process.cwd() + " && " + command
}

// Save Methods
// ---

// Save heroku method
var saveHeroku = function(){
  var moveRuntime = "mv config/runtime.json _runtime.json && mv heroku.json runtime.json",
      unMoveRuntime = "mv runtime.json heroku.json && mv _runtime.json config/runtime.json"
  exec(fromCwd(moveRuntime),function(err,stdout,stderr){
    if(err){
      console.error("Error moving runtime: ",err)
      process.exit(0)
    }
    var envConfig = JSON.stringify(require('config')),
        command = "heroku config:add APP_CONFIG=\""+encodeURIComponent(envConfig)+"\""
    console.log('saving heroku config: '+command)
    command = fromCwd(command) + " && " + unMoveRuntime
    exec(command,function(err,stdout,stderr){
      if(!err && !stderr){
        console.log("Successfuly saved: ",stdout)
      } else {
        console.error("Failed saving with error: ",err,stderr)
      }
      process.exit(0)
    })
  })
}

// Check if we're running from the command line
if(hasArg('save')){
  if(hasArg('heroku')){
    saveHeroku()
  } else {
    // we don't know how to save this. don't do anything, just whine about it.
    console.error("I don't know how to save to anything but heroku.")
    process.exit(1)
  }
} else {
  var config = require('config')
  // not running from command line. Just load in the config.
  // figure out what environment we are in
  if(process.env.APP_CONFIG){
    // in heroku or somewhere that we've set an app config.
    var config = JSON.parse(decodeURIComponent(process.env.APP_CONFIG))
    console.info("Config Loaded",config)
    module.exports = config
  }
  module.exports = config
}