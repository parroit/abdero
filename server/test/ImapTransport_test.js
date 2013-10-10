'use strict';

var imap = require('../lib/imapTransport');

var ImapTransport = imap.ImapTransport;

var expect = require('chai').expect;
require('chai').should();


describe('imapTransport',function(){
    describe("module",function() {
        it("should load",function(){
            expect(imap).not.to.be.equal(null);
            expect(imap).to.be.a('object');

        })
    });

    describe("ImapTransport",function() {
        var config = require("./config");
        var transport = new ImapTransport(config);

        it("should be instantiable with config",function(){
            expect(transport).not.to.be.null;
        });
        describe("status",function(){


            it("should be disconnected at start",function(){
                expect(transport.status).to.be.equal(imap.Status.disconnected);

            });

            it("go to connected upon connection",function(done){
                this.timeout(5000);
                transport.connect(function(){
                    expect(transport.status).to.be.equal(imap.Status.connected);
                    transport.disconnect(function(){
                        done();
                    });

                });


            });

            it("go to disconnected upon disconnection",function(done){
                this.timeout(5000);
                transport.connect(function(){

                    transport.disconnect(function(){
                        expect(transport.status).to.be.equal(imap.Status.disconnected);
                        done();
                    });
                });


            });

        });
        describe("fetch",function(){


            it("broadcast events on message received",function(done){
                this.timeout(5000);
                var bus = require("../lib/eventBus");
                bus.once('messageFetched',/.*/,function(messageStream,messageInfo){
                    expect(messageStream).to.be.not.null;
                    transport.disconnect(function(){
                        done();
                    });

                });
                transport.connect(function(){
                    transport.fetch("INBOX",'1:1');
                });


            });

            it("broadcasted message stream contains full message body",function(done){
                this.timeout(25000);
                var bus = require("../lib/eventBus");
                bus.once('messageFetched',/.*/,function(messageStream,messageInfo){
                    var buffer = '';
                    messageStream.on('data', function(chunk) {
                        buffer += chunk.toString('utf8');
                    });
                    messageStream.once('end', function() {
                        expect(buffer).to.be.equal("prova");
                        transport.disconnect(function(){
                            done();
                        });
                    });


                });
                transport.connect(function(){
                    transport.fetch("INBOX.test",'1:1');
                });


            });
        });
    });
});