
var integrations = require('./lib/slugs');
var each = require('each');

/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(integrations, function (slug) {
  var plugin = require('./lib/' + slug);
  var name = plugin.Integration.prototype.name;
  exports[name] = plugin;
});
