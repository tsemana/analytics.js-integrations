
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');

describe('Awesomatic', function(){
  var Awesomatic = plugin.Integration;
  var awesomatic;
  var analytics;
  var options = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  beforeEach(function(){
    analytics = new Analytics;
    awesomatic = new Awesomatic(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(awesomatic);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    awesomatic.reset();
  });

  it('should have the right settings', function(){
    analytics.compare(Awesomatic, integration('Awesomatic')
      .assumesPageview()
      .global('Awesomatic')
      .global('AwesomaticSettings')
      .global('AwsmSetup')
      .global('AwsmTmp')
      .option('appId', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(awesomatic, 'load');
    });

    afterEach(function(){
      awesomatic.reset();
    });

    describe('#initialize', function(){
      after(function(){
        delete window.Awesomatic;
      });
      
      it('should initialize with the current user', function(){
        // need to stub out these pieces because the loading logic is complex
        window.Awesomatic = {};
        awesomatic.load = function(callback){ callback(); };
        analytics.stub(window.Awesomatic, 'initialize');

        analytics.identify('id', { trait: true });
        analytics.initialize();
        analytics.page();
        analytics.called(window.Awesomatic.initialize, {
          appId: options.appId,
          user_id: 'id',
          trait: true
        });
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(awesomatic, done);
    });
  });
});
