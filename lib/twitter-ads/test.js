
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');

describe('Twitter Ads', function(){
  var Twitter = plugin.Integration;
  var twitter;
  var analytics;
  var options = {
    events: {
      signup: 'c36462a3',
      login: '6137ab24',
      play: 'e3196de1'
    }
  };

  beforeEach(function(){
    analytics = new Analytics;
    twitter = new Twitter(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(twitter);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    twitter.reset();
  });

  it('should have the correct settings', function(){
    analytics.compare(Twitter, integration('Twitter Ads')
      .readyOnLoad()
      .option('events', {}));
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.spy(twitter, 'track');
      });

      it('should not send if event is not defined', function(){
        analytics.track('toString', {});
        var img = twitter.track.returns[0];
        analytics.assert(img == null);
      });

      it('should send correctly', function(){
        analytics.track('play');
        var img = twitter.track.returns[0];
        analytics.assert(img);
        analytics.assert(img.src == 'http://analytics.twitter.com/i/adsct?txn_id=e3196de1&p_id=Twitter');
      });
    });
  });
});