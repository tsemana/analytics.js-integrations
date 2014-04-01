
/**
 * Module dependencies.
 */

var integrations = require('fs').readdirSync(__dirname + '/../lib');
var component = require('../component.json');
var slugs = require('../lib/slugs.json');
var assert = require('assert');

/**
 * tests
 */

integrations.forEach(function(filename){
  if ('slugs.json' == filename) return;

  describe(filename, function(){
    it('should be in component.json', function(){
      assert(~component.scripts.indexOf('lib/' + filename), 'expected ' + filename + ' to be in component.json');
    });

    it('should be in slugs.json', function(){
      var slug = filename.split('.')[0];
      assert(~slugs.indexOf(slug), 'expected ' + slug + ' to be in slugs.json');
    });
  })
});
