
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var date = require('load-date');
var plugin = require('./');

describe('Pingdom', function(){
  var Pingdom = plugin.Integration;
  var pingdom;
  var analytics;
  var options = {
    id: '5168f8c6abe53db732000000'
  };

  beforeEach(function(){
    analytics = new Analytics;
    pingdom = new Pingdom(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(pingdom);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    pingdom.reset();
  });

  it('should have the right settings', function(){
    analytics.compare(Pingdom, integration('Pingdom')
      .assumesPageview()
      .readyOnLoad()
      .global('_prum')
      .option('id', ''));
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(pingdom, 'load');
    });

    afterEach(function(){
      pingdom.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(pingdom.load);
      });

      it('should push the id onto window._prum', function(){
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window._prum[0], ['id', options.id]);
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(pingdom, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    it('should mark the first byte', function(){
      analytics.assert(date.getTime() == window.PRUM_EPISODES.marks.firstbyte);
    });
  });
});