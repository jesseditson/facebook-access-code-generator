var express = require('express'),
    config = require('config'),
    everyauth = require('everyauth')

var app = express.createServer()

// don't throw errors
app.use(express.errorHandler({
  dumpExceptions:false,
  showStack:false
}))

// facebook auth
everyauth.facebook
  .scope(config.facebook.scope)
  .appId(config.facebook.appid)
  .appSecret(config.facebook.appsecret)
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    session.user = session.user || {}
    session.user.facebook = {
        token : accessToken,
        extra : accessTokExtra,
        meta : fbUserMetadata,
        picture : 'http://graph.facebook.com/' + fbUserMetadata.id + '/picture'
      }
    session.save()
    return session.user
  })
  .redirectPath('/token')
// all auths
everyauth.everymodule.logoutPath('/bye');

// set up express app config
app.configure(function() {
    app.use(express.methodOverride())
    app.use(express.bodyParser())
    app.use(express.cookieParser())
    app.use(express.session({
      secret: config.sessionSecret,
      maxAge: 24 * 60 * 60 * 1000,
      key: config.sessionKey
    }))
    app.use(everyauth.middleware())
    app.use(app.router)
    everyauth.helpExpress(app)
})

app.all('/token',function(req,res){
  res.send(JSON.stringify(req.session.user.facebook.token))
})

// all requests
app.all('/',function(req,res){
  res.send('<a href="/auth/facebook">generate code</a>')
})

app.listen(process.env['PORT'] || config.port || 8080)