
var push = require('global-queue')('_curebitq');
var integration = require('integration');
var Track = require('facade').Track;
var load = require('load-script');
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
  .option('server', '');

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
 * Checked out
 *
 * https://www.curebit.com/docs/ecommerce/custom
 *
 * @param {Track} track
 * @api private
 */

Curebit.prototype.checkedOut = function(track){
  var transactionId = track.transactionId();
  var products = track.products() || [];
  var props = track.properties();
  var traits = user.traits();
  var items = [];

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
    order_number: transactionId,
    coupon_code: track.coupon(),
    order_date: props.date,
    subtotal: track.total(),
    customer_id: user.id(),
    email: traits.email,
    items: items
  });
};
