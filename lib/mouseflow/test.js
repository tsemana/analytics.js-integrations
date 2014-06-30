
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var plugin = require('./');

describe('Mouseflow', function(){
  var Mouseflow = plugin.Integration;
  var mouseflow;
  var analytics;
  var options = {
    apiKey: '08e34483-70c7-42de-a67e-0a49711d43dc'
  };

  beforeEach(function(){
    analytics = new Analytics;
    mouseflow = new Mouseflow(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(mouseflow);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    mouseflow.reset();
  });
  
  it('should have the correct settings', function(){
    var Test = integration('Mouseflow')
      .assumesPageview()
      .readyOnLoad()
      .global('mouseflow')
      .global('_mfq')
      .option('apiKey', '')
      .option('mouseflowHtmlDelay', 0);

    analytics.validate(Mouseflow, Test);
  });

  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(mouseflow, 'load');
    });

    afterEach(function(){
      mouseflow.reset();
    });

    describe('#initialize', function(){
      it('should call #load', function(){
        analytics.didNotCall(mouseflow.load);
        analytics.initialize();
        analytics.page();
        analytics.called(mouseflow.load);
      });
    });

    describe('#loaded', function(){
      it('should test _mfq.push', function(){
        window._mfq = [];
        analytics.assert(!mouseflow.loaded());
        window._mfq.push = function(){};
        analytics.assert(mouseflow.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(mouseflow, done);
    });
  });

  describe('after loading', function(){
    beforeEach(function(done){
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    it('should set window.mouseflowHtmlDelay', function(){
      analytics.assert(0 == window.mouseflowHtmlDelay);
    });

    describe('#page', function(){
      beforeEach(function(){
        analytics.stub(window.mouseflow, 'newPageView');
      });

      it('should call mouseflow.newPageView', function(){
        analytics.page();
        analytics.called(window.mouseflow.newPageView);
      });

      it('should not throw if its not a function', function(){
        window.mouseflow.newPageView = null;
        analytics.page();
      });

      it('should not throw if window.mouseflow is not an object', function(){
        window.mouseflow = null;
        analytics.page();
      });
    });

    describe('#identify', function(){
      beforeEach(function(){
        analytics.stub(window._mfq, 'push');
      });

      it('should send id', function(){
        analytics.identify(123);
        analytics.called(window._mfq.push, ['setVariable', 'id', 123]);
      });

      it('should send traits', function(){
        analytics.identify(null, { a: 1 });
        analytics.called(window._mfq.push, ['setVariable', 'a', 1]);
      });

      it('should send id and traits', function(){
        analytics.identify(123, { a: 1 });
        analytics.called(window._mfq.push, ['setVariable', 'id', 123]);
        analytics.called(window._mfq.push, ['setVariable', 'a', 1]);
      });
    });

    describe('#track', function(){
      beforeEach(function(){
        analytics.stub(window._mfq, 'push');
      });

      it('should send event', function(){
        analytics.track('event-name');
        analytics.called(window._mfq.push, ['setVariable', 'event', 'event-name']);
      });

      it('should send props', function(){
        analytics.track('event-name', { a: 1 });
        analytics.called(window._mfq.push, ['setVariable', 'event', 'event-name']);
        analytics.called(window._mfq.push, ['setVariable', 'a', 1]);
      });
    });
  });
});