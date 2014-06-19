
/**
 * Module dependencies.
 */

var indexOf = require('indexof');
var assert = require('assert');
var merge = require('merge');
var each = require('each');
var keys = require('keys');
var fmt = require('fmt');
var spy = require('spy');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Integration testing plugin.
 *
 * @param {Analytics} analytics
 */

function plugin(analytics) {
  analytics.spies = [];
  merge(analytics, proto);
};

/**
 * Prototype.
 */

var proto = {};

/**
 * Spy on a `method` of host `object`.
 *
 * @param {Object} object
 * @param {String} method
 * @return {Analytics}
 */

proto.spy = function(object, method){
  var s = spy(object, method);
  this.spies.push(s);
  return this;
};

/**
 * Assert that a `spy` was called with `args...`
 *
 * @param {Spy} spy
 * @param {Mixed} args... (optional)
 * @return {Analytics}
 */

proto.called = function(spy){
  assert(
    ~indexOf(this.spies, spy), 
    'You must call `.spy(object, method)` prior to calling `.called()`.'
  );
  assert(spy.called, fmt('Expected "%s" to have been called.', spy.name));

  var args = [].slice.call(arguments, 1);
  if (!args.length) return this;

  assert(
    spy.got.apply(spy, args), fmt(''
    + 'Expected "%s" to be called with "%o", '
    + 'but it was called with "%o".'
    , spy.name
    , args
    , spy.args[0])
  );

  return this;
};

/**
 * Call `reset` on the integration.
 *
 * @return {Analytics}
 */

proto.reset = function(){
  // reset spies
  each(this.spies, function(s){ s.restore(); });
  this.spies = [];

  // reset integrations
  for (var name in this._integrations) {
    this._integrations[name].reset();
  }

  // reset stores
  this.user().reset();
  // this.group().reset();
  return this;
};

/**
 * TODO: add to analytics.js
 *
 * @param {String} name
 */

proto.integration = function(name){
  return this._integrations[name];
};

/**
 * Assert a `value` is truthy.
 *
 * @param {Mixed} value
 * @return {Tester}
 */

proto.assert = function(value){
  assert(value);
  return this;
};

/**
 * Expose all of the methods own `assert`.
 *
 * @param {Mixed} args...
 * @return {Tester}
 */

each(keys(assert), function(key){
  proto[key] = function(){
    var args = [].slice.call(arguments);
    assert[key].apply(assert, args);
    return this;
  };
});