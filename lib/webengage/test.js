
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('WebEngage', function(){
  var WebEngage = plugin.Integration;
  var webengage;
  var analytics;
  var options = {
    licenseCode: '~2024c003'
  };

  beforeEach(function(){
    analytics = new Analytics;
    webengage = new WebEngage(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(webengage);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    webengage.reset();
  });

  it('should store the correct settings', function(){
    analytics.validate(WebEngage, integration('WebEngage')
      .assumesPageview()
      .readyOnLoad()
      .global('webengage')
      .global('_weq')
      .option('widgetVersion', '4.0')
      .option('licenseCode', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(webengage, 'load');
    });

    afterEach(function(){
      webengage.reset();
    });

    describe('#loaded', function(){
      it('should test window.webengage', function(){
        analytics.assert(!webengage.loaded());
        window.webengage = {};
        analytics.assert(webengage.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(webengage, done);
    });
  });
});