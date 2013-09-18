var assert = require("assert")
  , sinon = require('sinon')
  , clock
  , tickFunction
  , callbackFunction
  , abortFunction;

Countdown = require("../lib/countdown");

describe("countdown.js", function() {
  beforeEach(function() {
    clock = sinon.useFakeTimers();
    tickFunction = sinon.spy();
    callbackFunction = sinon.spy();
    abortFunction = sinon.spy();
  });

  afterEach(function() {
    clock.restore();
  });

  describe("Countdown.start", function() {
    it("executes onTick while countdown is running", function() {
      new Countdown(5, tickFunction, callbackFunction);
      assert(tickFunction.callCount == 1);
      clock.tick(1000);
      assert(tickFunction.callCount == 2);
      clock.tick(1000);
      assert(tickFunction.callCount == 3);
      clock.tick(1000);
      assert(tickFunction.callCount == 4);
      clock.tick(1000);
      assert(tickFunction.callCount == 5);
      clock.tick(1000);
      assert(tickFunction.callCount == 5);
    });

    it("executes onComplete", function() {
      new Countdown(5, tickFunction, callbackFunction);
      clock.tick(4000);
      assert(callbackFunction.callCount == 0);
      clock.tick(5000);
      assert(callbackFunction.callCount == 1);
    });
  });

  describe("aborting countdown", function() {
    var countdown;

    beforeEach(function() {
      countdown = new Countdown(5, tickFunction, callbackFunction, abortFunction);
    });

    it("calls onTick the correct number of times", function() {
      assert(tickFunction.callCount == 1);
      clock.tick(1000);
      assert(tickFunction.callCount == 2);
      countdown.abort();
      clock.tick(1000);
      assert(tickFunction.callCount == 2);
    });

    it("does not call onComplete", function() {
      countdown.abort();
      clock.tick(5000);
      assert(callbackFunction.callCount == 0);
    });

    it("calls onAbort after aborting", function() {
      countdown.abort();
      //clock.tick(5000);
      assert(abortFunction.callCount === 1);
    });
  });
});
