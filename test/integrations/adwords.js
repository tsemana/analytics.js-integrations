
describe('AdWords', function(){

  var AdWords = require('integrations/lib/adwords');
  var test = require('integration-tester');
  var analytics = require('analytics');
  var assert = require('assert');
  var sinon = require('sinon');

  var settings = {
    conversionId: 978352801,
    events: {
      signup: '-kGkCJ_TsgcQofXB0gM',
      login: 'QbThCM_zogcQofXB0gM',
      play: 'b91fc77f'
    }
  };

  beforeEach(function(){
    analytics.use(AdWords);
    adwords = new AdWords.Integration(settings);
  })

  it('should have the correct settings', function(){
    test(adwords)
      .name('AdWords')
      .readyOnLoad()
      .option('events', {});
  })

  describe('#load', function(){
    it('should load', function(done){
      adwords.load(function(){ done(); });
    })
  })

  describe('#track', function(){
    beforeEach(function(done){
      remove('iframe');
      adwords.on('ready', done);
      adwords.initialize();
    })

    it('should not send if event is not defined', function(){
      test(adwords).track('toString', {});
      assert(0 == get('iframe').length);
    })

    it('should insert an iframe', function(){
      test(adwords).track('signup');
      var iframe = get('iframe')[0];
      var scripts = iframe.contentDocument.getElementsByTagName('script');
      assert(iframe.parentNode);
      assert(2 == scripts.length);
      assert(scripts[0].textContent);
      assert(scripts[0].textContent.match(settings.events.signup));
      assert('http://www.googleadservices.com/pagead/conversion.js' == scripts[1].src);
      assert(scripts[0].textContent.match(settings.conversionId));
    })

    it('should send revenue', function(){
      test(adwords).track('login', { revenue: 1234 });
      var iframe = get('iframe')[0];
      var scripts = iframe.contentDocument.getElementsByTagName('script');
      assert(scripts[0].textContent.match(/1234/));
    })
  })

  function get(sel){
    return document.getElementsByTagName(sel);
  }

  function remove(sel){
    var els = get(sel);
    for (var i = 0; i < els.length; ++i) {
      if (!els[i].parentNode) continue;
      els[i].parentNode.removeChild(els[i]);
    }
  }
})
