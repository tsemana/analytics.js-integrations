
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var timeouts = require('clear-timeouts');
var intervals = require('clear-intervals');
var plugin = require('./');

describe('LiveChat', function(){
  var LiveChat = plugin.Integration;
  var livechat;
  var analytics;
  var options = {
    license: '4293371'
  };

  beforeEach(function(){
    analytics = new Analytics;
    livechat = new LiveChat(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(livechat);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    timeouts();
    intervals();
  });

  after(function(){
    livechat.reset();
  });

  it('should have the right settings', function(){
    var Test = integration('LiveChat')
      .assumesPageview()
      .global('__lc')
      .global('LC_API')
      .global('LC_Invite')
      .global('__lc_inited')
      .option('license', '');

    analytics.compare(LiveChat, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(livechat, 'load');
    });

    afterEach(function(){
      livechat.reset();
    });

    describe('#initialize', function(){
      it('should create window.__lc', function(){
        analytics.assert(!window.__lc);
        analytics.initialize();
        analytics.page();
        analytics.deepEqual(window.__lc, { license: options.license, group: 0 });
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(livechat, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#identify', function(){
      beforeEach(function(){
        analytics.stub(window.LC_API, 'set_custom_variables');
      });

      it('should send an id', function(){
        analytics.identify('id');
        analytics.called(window.LC_API.set_custom_variables, [
          { name: 'id', value: 'id' },
          { name: 'User ID', value: 'id' }
        ]);
      });

      it('should send traits', function(){
        analytics.identify({ trait: true });
        analytics.called(window.LC_API.set_custom_variables, [
          { name: 'trait', value: true }
        ]);
      });

      it('should send an id and traits', function(){
        analytics.identify('id', { trait: true });
        analytics.called(window.LC_API.set_custom_variables, [
          { name: 'trait', value: true },
          { name: 'id', value: 'id' },
          { name: 'User ID', value: 'id' }
        ]);
      });
    });
  });
});