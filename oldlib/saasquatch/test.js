
var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var tester = require('analytics.js-integration-tester');
var plugin = require('./');
var sandbox = require('clear-env');

describe('SaaSquatch', function(){
  var SaaSquatch = plugin;
  var saasquatch;
  var analytics;
  var options = {
    tenantAlias: 'baz',
    accountId: 'foo'
  };

  beforeEach(function(){
    analytics = new Analytics;
    saasquatch = new SaaSquatch(options);
    analytics.use(plugin);
    analytics.use(tester);
    analytics.add(saasquatch);
  });

  afterEach(function(){
    analytics.restore();
    analytics.reset();
    saasquatch.reset();
    sandbox();
  });

  it('should have the correct settings', function(){
    analytics.compare(SaaSquatch, integration('SaaSquatch')
      .option('tenantAlias', '')
      .global('_sqh'));
  });

  describe('loading', function(){
    it('should load', function(done){
      analytics.on('ready', done);
      analytics.initialize();
      analytics.page();
      analytics.identify('my-id');
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
        analytics.stub(window._sqh, 'push');
      });

      it('should not send if userId or email are missing', function(){
        analytics.identify();
        analytics.didNotCall(window._sqh.push);
      });

      it('should send if userId is given', function(){
        analytics.identify('id');
        analytics.called(window._sqh.push, ['init', {
          user_id: 'id',
          tenant_alias: 'baz',
          email: undefined,
          first_name: undefined,
          last_name: undefined,
          user_image: undefined
        }]);
      });

      it('should send if email is given', function(){
        analytics.identify({ email: 'self@example.com' });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined
        }]);
      });

      it('should pass checksum', function(){
        analytics.identify({ email: 'self@example.com' }, { SaaSquatch: { checksum: 'wee' } });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          checksum: 'wee'
        }]);
      });

      it('should pass accountId', function(){
        analytics.identify({ email: 'self@example.com', accountId: 123 });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          account_id: 123
        }]);
      });

      it('should pass paymentProviderId', function(){
        analytics.identify({ email: 'self@example.com', paymentProviderId: 421 });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          payment_provider_id: 421
        }]);
      });

      it('should pass accountStatus', function(){
        analytics.identify({ email: 'self@example.com', accountStatus: 'active' });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          account_status: 'active'
        }]);
      });

      it('should pass referralCode', function(){
        analytics.identify({ email: 'self@example.com', referralCode: 789 });
        analytics.called(window._sqh.push, ['init', {
          user_id: null,
          tenant_alias: 'baz',
          email: 'self@example.com',
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          referral_code: 789
        }]);
      });

      it('should pass referral image', function(){
        analytics.identify(1, { referralImage: 'img' });
        analytics.called(window._sqh.push, ['init', {
          user_id: 1,
          tenant_alias: 'baz',
          email: undefined,
          first_name: undefined,
          last_name: undefined,
          user_image: undefined,
          fb_share_image: 'img'
        }]);
      });

      it('should send only once', function(){
        analytics.identify('id');
        analytics.identify('id');
        analytics.calledOnce(window._sqh.push);
      });
    });

    describe('#group', function(){
      beforeEach(function(){
        analytics.stub(window._sqh, 'push');
      });

      it('should pass groupId as accountId', function(){
        analytics.group('id');
        analytics.called(window._sqh.push, ['init', {
          tenant_alias: 'baz',
          account_id: 'id'
        }]);
      });

      it('should pass checksum', function(){
        analytics.group(1, {}, { SaaSquatch: { checksum: 'wee' } });
        analytics.called(window._sqh.push, ['init', {
          tenant_alias: 'baz',
          account_id: 1,
          checksum: 'wee'
        }]);
      });

      it('should pass referral image', function(){
        analytics.group(1, { referralImage: 'img' });
        analytics.called(window._sqh.push, ['init', {
          tenant_alias: 'baz',
          account_id: 1,
          fb_share_image: 'img'
        }]);
      });

      it('should send only once', function(){
        analytics.group('id');
        analytics.group('id');
        analytics.calledOnce(window._sqh.push);
      });
    });
  });
});