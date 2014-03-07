
var push = require('global-queue')('_curebitq');
var Identify = require('facade').Identify;
var integration = require('integration');
var Track = require('facade').Track;
var iso = require('to-iso-string');
var load = require('load-script');
var extend = require('extend');
var clone = require('clone');
var each = require('each');

/**
 * User reference
 */

var user;

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Curebit);
  user = analytics.user();
};

/**
 * Expose `Curebit` integration
 */

var Curebit = exports.Integration = integration('Curebit')
  .readyOnInitialize()
  .global('_curebitq')
  .global('curebit')
  .option('siteId', '')
  .option('iframeWidth', 0)
  .option('iframeHeight', 0)
  .option('iframeBorder', 0)
  .option('iframeId', '')
  .option('responsive', true)
  .option('device', '')
  .option('server', 'https://www.curebit.com');

/**
 * Initialize
 *
 * @param {Object} page
 */

Curebit.prototype.initialize = function(){
  push('init', {
    site_id: this.options.siteId,
    server: this.options.server
  });
  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Curebit.prototype.loaded = function(){
  return !! window.curebit;
};

/**
 * Load
 *
 * @param {Function} fn
 * @api private
 */

Curebit.prototype.load = function(fn){
  load('//d2jjzw81hqbuqv.cloudfront.net/assets/api/all-0.6.js', fn);
};

/**
 * Identify.
 *
 * http://www.curebit.com/docs/affiliate/registration
 *
 * @param {Identify} identify
 * @api public
 */

Curebit.prototype.identify = function(identify){
  push('register_affiliate', {
    responsive: this.options.responsive,
    device: this.options.device,
    iframe: {
      width: this.options.iframeWidth,
      height: this.options.iframeHeight,
      id: this.options.iframeId,
      frameborder: this.options.iframeBorder
    },
    affiliate_member: {
      email: identify.email(),
      first_name: identify.firstName(),
      last_name: identify.lastName(),
      customer_id: identify.userId()
    }
  });
};

/**
 * Completed order
 *
 * https://www.curebit.com/docs/ecommerce/custom
 *
 * @param {Track} track
 * @api private
 */

Curebit.prototype.completedOrder = function(track){
  var orderId = track.orderId();
  var products = track.products();
  var props = track.properties();
  var items = [];

  // identify
  var identify = new Identify({
    traits: user.traits(),
    userId: user.id()
  });

  // items
  each(products, function(product){
    var track = new Track({ properties: product });
    items.push({
      product_id: track.id() || track.sku(),
      quantity: track.quantity(),
      image_url: product.image,
      price: track.price(),
      title: track.name(),
      url: product.url,
    });
  });

  // transaction
  push('register_purchase', {
    order_date: iso(props.date || new Date),
    order_number: orderId,
    coupon_code: track.coupon(),
    subtotal: track.total(),
    customer_id: identify.userId(),
    first_name: identify.firstName(),
    last_name: identify.lastName(),
    email: identify.email(),
    items: items
  });
};
