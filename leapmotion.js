const {ipcMain} = require('electron')
const Leap  = require('leapjs')
 var jsonfile = require('jsonfile');
let controller = new Leap.Controller();

const LeapTrainer = require('./leaptrainer.js')
var trainer = new LeapTrainer.Controller({controller: controller});

const low = require('lowdb')
const db = low('gestures.json')
db.defaults({gestures : []})
const gestures = db.get('gestures').value();
trainer.fromArray(gestures)

for(var i=0; i<gestures.length; i++){
  trainer.on(gestures[i].name, function(eventName){   
    console.log(eventName + " detected");
    var file = 'data.json'
    var obj = {name: eventName}
 
     jsonfile.writeFile(file, obj, function (err) {
     console.error(err)
    })

    var https = require('https');
    var fs = require('fs');

    var file = fs.createWriteStream("data.json");

    var request = https.get("https://doc-0g-4s-docs.googleusercontent.com/docs/securesc/45krjvhffbf3u7u0gqtl3f256s8v33fu/mh5qbu0ibr81s9p8dsk83d6lnk3k4fd6/1468310400000/16030217653915647735/16030217653915647735/0B_4zaFrsLHAANEczaE5zNVA3c3M?e=download&nonce=jdb7i52e3bln8&user=16030217653915647735&hash=n7p6pmtdgfcftamgnm310h1u4jiqa0sb", function(response) {
    //var request = https.get("https://github.com/SudarAbisheck/leapfrog/blob/master/gestures.json", function(response) {
    response.pipe(file);
    });

  })
}

/* ipc messages begin */
ipcMain.on('connect-to-leap',function(event, args){
  controller.connect();
  console.log("\nWaiting for device to connect...");
  if(controller.connect) event.returnValue = true;
  else event.returnValue = false;
})

ipcMain.on('disconnect-from-leap', function(event, args){
  controller.disconnect();
  if(controller.disconnect) event.returnValue = true;
  else event.returnValue = false;
})

/*ipc messages end*/

// Leap Motion state loggers
controller.on('ready', function() {
    console.log("ready");
});
controller.on('connect', function() {
    console.log("connected");
});
controller.on('disconnect', function() {
    console.log("disconnect");
});
controller.on('focus', function() {
    console.log("focus");
});
controller.on('blur', function() {
    console.log("blur");
});
controller.on('streamingStarted', function() {
    console.log("deviceConnected");
});
controller.on('streamingStopped', function() {
    console.log("deviceDisconnected");
});
