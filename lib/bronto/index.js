
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var Identify = require('facade').Identify;
var Track = require('facade').Track;
var pixel = require('load-pixel')('http://app.bronto.com/public/');
var qs = require('querystring');
var each = require('each');

/**
 * User reference.
 */

var user;

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Bronto);
  user = analytics.user(); // store for later
};

/**
 * Expose `Bronto` integration.
 */

var Bronto = exports.Integration = integration('Bronto')
  .global('__bta')
  .option('siteId', '')
  .option('host', '')
  .tag('<script src="//p.bm23.com/bta.js">');

/**
 * Initialize.
 *
 * http://app.bronto.com/mail/help/help_view/?k=mail:home:api_tracking:tracking_data_store_js#addingjavascriptconversiontrackingtoyoursite
 * http://bronto.com/product-blog/features/using-conversion-tracking-private-domain#.Ut_Vk2T8KqB
 * http://bronto.com/product-blog/features/javascript-conversion-tracking-setup-and-reporting#.Ut_VhmT8KqB
 *
 * @param {Object} page
 */

Bronto.prototype.initialize = function(page){
  var self = this;
  var params = qs.parse(window.location.search);
  if (!params._bta_tid && !params._bta_c) {
    this.debug('missing tracking URL parameters `_bta_tid` and `_bta_c`.');
  }
  this.load(function(){
    var opts = self.options;
    self.bta = new window.__bta(opts.siteId);
    if (opts.host) self.bta.setHost(opts.host);
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Bronto.prototype.loaded = function(){
  return this.bta;
};

/**
 * Track.
 *
 * The JS conversion tracking toggles must be on 
 * in the application in order for you to see the data 
 * in your account, and for it to function as it should. 
 * If the toggle is not on the system will ignore 
 * any requests coming into it.
 *
 * To create a test user, create a contact in Bronto, 
 * send that contact an email, then process through your site 
 * to place a test order to hit the JS code.
 *
 * Provided you have Click Through Link Tracking enabled,
 * when a contact clicks a link contained in an email you send them via Bronto,
 * we create a tracking cookie (most commonly used for tracking conversions).
 *
 * https://app.bronto.com/mail/help/help_view/?k=mail:home:api_tracking:tracking_url_parameters
 *
 * @param {Track} event
 */

Bronto.prototype.track = function(track){
  var revenue = track.revenue();
  var event = track.event();
  var type = 'number' == typeof revenue ? '$' : 't';
  this.bta.addConversionLegacy(type, event, revenue);
};

/**
 * Completed order.
 *
 * The cookie is used to link the order being processed back to the delivery, 
 * message, and contact which makes it a conversion.
 * Passing in just the email ensures that the order itself 
 * gets linked to the contact record in Bronto even if the user 
 * does not have a tracking cookie.
 *
 * @param {Track} track
 * @api private
 */

Bronto.prototype.completedOrder = function(track){
  var products = track.products();
  var props = track.properties();
  var items = [];
  var identify = new Identify({
    userId: user.id(),
    traits: user.traits()
  });
  var email = identify.email();

  // items
  each(products, function(product){
    var track = new Track({ properties: product });
    items.push({
      item_id: track.id() || track.sku(),
      desc: product.description || track.name(),
      quantity: track.quantity(),
      amount: track.price(),
    });
  });

  // add conversion
  this.bta.addOrder({
    order_id: track.orderId(),
    email: email,
    // they recommend not putting in a date
    // because it needs to be formatted correctly
    // YYYY-MM-DDTHH:MM:SS
    items: items
  });
};
