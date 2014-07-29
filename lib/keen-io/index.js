
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');

/**
 * Expose `Keen IO` integration.
 */

var Keen = module.exports = integration('Keen IO')
  .global('Keen')
  .option('projectId', '')
  .option('readKey', '')
  .option('writeKey', '')
  .option('trackNamedPages', true)
  .option('trackAllPages', false)
  .option('trackCategorizedPages', true)
  .tag('<script src="//d26b395fwzu5fz.cloudfront.net/3.0.5/keen.js">');

/**
 * Initialize.
 *
 * https://keen.io/docs/
 */

Keen.prototype.initialize = function(){
  var options = this.options;
  !function(a,b){if(void 0===b[a]){b["_"+a]={},b[a]=function(c){b["_"+a].clients=b["_"+a].clients||{},b["_"+a].clients[c.projectId]=this,this._config=c},b[a].ready=function(c){b["_"+a].ready=b["_"+a].ready||[],b["_"+a].ready.push(c)};for(var c=["addEvent","setGlobalProperties","trackExternalLink","on"],d=0;d<c.length;d++){var e=c[d],f=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};b[a].prototype[e]=f(e)}}}("Keen",window);
  this.client = new window.Keen({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Keen.prototype.loaded = function(){
  return !!(window.Keen && window.Keen.prototype.configure);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Keen.prototype.page = function(page){
  var category = page.category();
  var props = page.properties();
  var name = page.fullName();
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track(page.track());
  }

  // named pages
  if (name && opts.trackNamedPages) {
    this.track(page.track(name));
  }

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track(page.track(category));
  }
};

/**
 * Identify.
 *
 * TODO: migrate from old `userId` to simpler `id`
 *
 * @param {Identify} identify
 */

Keen.prototype.identify = function(identify){
  var traits = identify.traits();
  var id = identify.userId();
  var user = {};
  if (id) user.userId = id;
  if (traits) user.traits = traits;
  this.client.setGlobalProperties(function(){
    return { user: user };
  });
};

/**
 * Track.
 *
 * @param {Track} track
 */

Keen.prototype.track = function(track){
  this.client.addEvent(track.event(), track.properties());
};
