
'use strict';



var fs = require("fs");

var messageParser = require('../../message-parser');

messageParser.run('messageFetched',/(.*)/);
messageParser.stop();


var bus = require("corriera");
var called = false;
var listener = function (messageObject) {
    called=true;
};
bus.once('messageParsed', /(.*)/, listener);

setTimeout(function(){
    console.log(called);
    bus.removeListener('messageParsed', listener);

},1000);


var messageStream = fs.createReadStream("./expected.msg");

bus.emit('messageFetched',"any",messageStream);