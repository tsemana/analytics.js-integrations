
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var alias = require('alias');

/**
 * Expose `Heap` integration.
 */

var Heap = module.exports = integration('Heap')
  .global('heap')
  .option('appId', '')
  .tag('<script src="//cdn.heapanalytics.com/js/heap-{{ appId }}.js">');

/**
 * Initialize.
 *
 * https://heapanalytics.com/docs/installation#web
 *
 * @param {Object} page
 */

Heap.prototype.initialize = function(page){
  window.heap=window.heap||[],window.heap.load=function(t,e){window.heap.appid=t,window.heap.config=e;for (var o=function(t){return function(){heap.push([t].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
  window.heap.load(this.options.appId);
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Heap.prototype.loaded = function(){
  return (window.heap && window.heap.appid);
};

/**
 * Identify.
 *
 * https://heapanalytics.com/docs#identify
 *
 * @param {Identify} identify
 */

Heap.prototype.identify = function(identify){
  var traits = identify.traits();
  var id = identify.userId();
  if (traits.email) delete traits.email
  if (id) traits.handle = id;
  window.heap.identify(traits);
};

/**
 * Track.
 *
 * https://heapanalytics.com/docs#track
 *
 * @param {Track} track
 */

Heap.prototype.track = function(track){
  window.heap.track(track.event(), track.properties());
};
