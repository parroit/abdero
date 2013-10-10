'use strict';

var eventBus = require('../lib/EventBus.js');
var expect = require('chai').expect;
require('chai').should();


describe('EventBus',function(){
    describe("module",function() {
        it("should load",function(){
            expect(eventBus).not.to.be.equal(null);
            expect(eventBus).to.be.a('object');

        })
    });

    describe("on",function() {
        it("should throw on falsy event name",function(){
            (function () {
                eventBus.on('','','');
            }).should.throw(Error);
        });

        it("should throw on non string event name",function(){
            (function () {
                eventBus.on(null,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(undefined,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(true,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(/ /,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(42,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on({},'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(function(){},'','');
            }).should.throw(Error);

        });


        it("should throw on non regex event name",function(){
            (function () {
                eventBus.on('someEvent',null,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',undefined,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',true,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent','filter?','');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',42,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',{},'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',function(){},'');
            }).should.throw(Error);

        });

        it("should throw on non function listener",function(){
            (function () {
                eventBus.on('someEvent',/./,null);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,undefined);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,true);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,'filter?');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,42);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,{});
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,/./);
            }).should.throw(Error);

        });

        it("should not throw on correct argument types",function(){
            eventBus.on('someEvent',/ /,function(){

            });
        });

    });
});