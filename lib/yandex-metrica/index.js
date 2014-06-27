
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var load = require('load-script');
var tick = require('next-tick');
var bind = require('bind');
var when = require('when');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Yandex);
};

/**
 * Expose `Yandex` integration.
 */

var Yandex = exports.Integration = integration('Yandex Metrica')
  .assumesPageview()
  .readyOnLoad()
  .global('yandex_metrika_callbacks')
  .global('Ya')
  .option('counterId', null);

/**
 * Initialize.
 *
 * http://api.yandex.com/metrika/
 * https://metrica.yandex.com/22522351?step=2#tab=code
 *
 * @param {Object} page
 */

Yandex.prototype.initialize = function(page){
  var id = this.options.counterId;

  push(function(){
    window['yaCounter' + id] = new window.Ya.Metrika({ id: id });
  });

  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Yandex.prototype.loaded = function(){
  return !! (window.Ya && window.Ya.Metrika);
};

/**
 * Load.
 *
 * @param {Function} fn
 */

Yandex.prototype.load = function(fn){
  var loaded = bind(this, this.loaded);
  load('//mc.yandex.ru/metrika/watch.js', function(){
    when(loaded, function(){
      tick(fn);
    });
  });
};

/**
 * Push a new callback on the global Yandex queue.
 *
 * @param {Function} callback
 */

function push(callback){
  window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || [];
  window.yandex_metrika_callbacks.push(callback);
}
