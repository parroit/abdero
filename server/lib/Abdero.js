/*
 * Abdero
 * https://github.com/parroit/abdero
 *
 * Copyright (c) 2013 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';



var Imap = require('imap'),
    //inspect = require('util').inspect,
    fs = require('fs');

var imap = new Imap(require("./config.js"));

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    //noinspection JSUnusedLocalSymbols
    openInbox(function(err/*, box*/) {
        if (err) {
            throw err;
        }
        var f = imap.seq.fetch('1:*', {
            bodies: ''
        });
        var total=0;
        f.on('message', function(msg, seqno) {

            //var prefix = '(#' + seqno + ') ';
            //noinspection JSUnusedLocalSymbols
            msg.on('body', function(stream, info) {
                total += info.size/(1024*1024);
                console.log('Message #%d: total %s MB', seqno,total.toFixed(2));
                stream.pipe(fs.createWriteStream('storage/msg-' + seqno + '-body.txt'));
            });
            msg.once('attributes', function(/*attrs*/) {
                //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
                //console.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect();