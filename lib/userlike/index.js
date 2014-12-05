
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');

/**
 * Expose Userlike integration.
 */

var Userlike = module.exports = integration('Userlike')
  .assumesPageview()
  .global('userlikeConfig')
  .global('userlikeData')
  .option('secretKey', '')
  .tag('<script src="//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/{{ secretKey }}.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */
Userlike.prototype.initialize = function(page){
  var self = this;
  window.userlikeData = {
    custom:{

    }
  }

  this.load(function(){
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Userlike.prototype.loaded = function(){
  return !! (window.userlikeConfig && window.userlikeData);
};
