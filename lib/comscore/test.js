
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('comScore', function(){
  var Comscore = plugin.Integration;
  var comscore;
  var analytics;
  var options = {
    c2: 'x'
  };

  beforeEach(function(){
    analytics = new Analytics;
    comscore = new Comscore(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(comscore);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    comscore.reset();
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(comscore, 'load');
    });

    afterEach(function(){
      comscore.reset();
    });

    it('should have the right settings', function(){
      analytics.validate(Comscore, integration('comScore')
        .assumesPageview()
        .readyOnLoad()
        .global('_comscore')
        .option('c1', '2')
        .option('c2', ''));
    });

    describe('#initialize', function(){
      it('should create window._comscore', function(){
        analytics.assert(!window._comscore);
        analytics.initialize();
        analytics.page();
        analytics.assert(window._comscore instanceof Array);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(comscore.load);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(comscore, done);
    });
  });
});
