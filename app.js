var http = require('http')
var createHandler = require('travisci-webhook-handler')
var fetchUrl = require("fetch").fetchUrl;
// var handler = createHandler({ path: '/webhook', public_key: 'travisPublicKey' })
var handler;

fetchUrl("https://api.travis-ci.org/config", function(error, meta, body){
  if(error) console.log("Cannot create webhooks handler")
  console.log(body.toString())
  handler = createHandler({
    path: '/webhook',
    public_key: JSON.parse(body).config.notifications.webhook.public_key
  })

  http.createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(8080)

  handler.on('error', function (err) {
    console.error('Error:', err.message)
  })

  handler.on('success', function (event) {
    console.log('Build %s success for %s branch %s',
      event.payload.number,
      event.payload.repository.name,
      event.payload.branch)
  })

  handler.on('failure', function (event) {
      console.log('Build failed!')
  })

  handler.on('start', function (event) {
      console.log('Build started!')
  })

});
