
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('segmentio/analytics.js-integration-tester@1.3.0');
var tick = require('next-tick');
var plugin = require('./');

describe('Yandex', function(){
  var Yandex = plugin.Integration;
  var yandex;
  var analytics;
  var options = {
    counterId: 22522351
  };

  beforeEach(function(){
    analytics = new Analytics;
    yandex = new Yandex(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(yandex);
    window['yaCounter' + options.counterId] = undefined;
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
  });

  after(function(){
    yandex.reset();
  });

  it('should have the right settings', function(){
    var Test = integration('Yandex Metrica')
      .assumesPageview()
      .readyOnLoad()
      .global('yandex_metrika_callbacks')
      .global('Ya')
      .option('counterId', null);

    analytics.validate(Yandex, Test);
  });
  
  describe('before loading', function(){
    beforeEach(function(){
      analytics.stub(yandex, 'load');
    });

    afterEach(function(){
      yandex.reset();
    });

    describe('#initialize', function(){
      it('should push onto the yandex_metrica_callbacks', function(){
        analytics.assert(!window.yandex_metrika_callbacks);
        analytics.initialize();
        analytics.page();
        analytics.assert(window.yandex_metrika_callbacks.length === 1);
      });

      it('should call #load', function(){
        analytics.initialize();
        analytics.page();
        analytics.called(yandex.load);
      });
    });

    describe('#loaded', function(){
      it('should test window.Ya.Metrika', function(){
        window.Ya = {};
        analytics.assert(!yandex.loaded());
        window.Ya.Metrika = {};
        analytics.assert(yandex.loaded());
      });
    });
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.load(yandex, done);
    });
  });

  describe('after loading', function(){
    it('should create a yaCounter object', function(){
      tick(function(){
        analytics.assert(window['yaCounter' + yandex.options.counterId]);
      });
    });
  });
});