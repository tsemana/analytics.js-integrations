#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var write = fs.writeFileSync;
var readdir = fs.readdirSync;

/**
 * Get all slugs
 */

var slugs = readdir(__dirname + '/../lib');

/**
 * Build requires for tests
 */

var requires = slugs.map(function(slug, i){
  return 'require(\'../lib/' +  slug + '/test.js\');\n'
});

/**
 * Write `test/tests.js`
 */

var js = requires.join('') + '\n';
write(__dirname + '/../test/tests.js', js);
