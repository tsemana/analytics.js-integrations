
/**
 * Module dependencies.
 */

var query = require('component/query');
var each = require('component/each');
var indexOf = require('component/indexof');

/**
 * Initial scripts.
 */

var initialScripts = query.all('script');

module.exports = function(){
  var finalScripts = query.all('script');
  each(finalScripts, function(script){
    if (-1 === indexOf(initialScripts, script)) {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  });
};