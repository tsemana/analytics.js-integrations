
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');

/**
 * Expose Userlike integration.
 */

var Userlike = module.exports = integration('Userlike')
  .assumesPageview()
  //.global('_atrk_opts')
  .global('userlikeConfig')
  //.option('account', null)
  //.option('domain', '')
  //.option('dynamic', true)
  .option('secretKey', '')
  //.tag('<script src="//d31qbv1cthcecs.cloudfront.net/atrk.js">');
  .tag('<script src="//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/{{ secretKey }}.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */
Userlike.prototype.initialize = function(page){
  var self = this;
  /*window._atrk_opts = {
    atrk_acct: this.options.account,
    domain: this.options.domain,
    dynamic: this.options.dynamic
  };*/
  this.load(function(){
    //window.atrk();
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Userlike.prototype.loaded = function(){
  //console.log("foo: ", userlikeConfig, window.userlikeConfig);
  return !! window.userlikeConfig;
};
