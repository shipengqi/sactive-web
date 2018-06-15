const SactiveWeb = require('..');
const request = require('supertest');
const {expect} = require('chai');
const constants = require('../lib/response_formatter/constants');
const CONSTANTS_MOCK = {
  DOWNLOAD_ACCEPT: 'application/x-download',
  ERROR_CODE: {
    UNIFIED: 500,
    NOT_FOUNF: 404,
    VALIFATE_FAIL: 400
  },
  SUCCESS_CODE: {
    UNIFIED: 200
  }
};

describe('Response tests', function() {
  describe('Constants tests', function() {
    it('All constant test', function() {
      expect(CONSTANTS_MOCK).to.eql(constants);
    });
  });
  describe('Html response tests', function() {
    it('Should render successfully', function(done) {
      const app = new SactiveWeb({view: {path: `${__dirname}/template`}, enableTransform: true});
      app.route({
        name: 'demo-render',
        method: 'get',
        path: '/demo/render',
        template: `test.pug`,
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/render')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    });

    it('Should get 404 with error template', function(done) {
      const app = new SactiveWeb({view: {path: `${__dirname}/template`}, enableTransform: true});
      app.route({
        name: 'demo1-404',
        method: 'get',
        path: '/demo1/route4',
        template: `notfound.pug`,
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route4')
        .set('Accept', 'text/html')
        .expect(404)
        .end(function(err, res) {
          expect(res.body).to.eql({
            'code': 404,
            'msg': 'Not Found: Template notfound.pug not existed'
          });
          done();
        });
    });
    it('Should get 500 without tempalte', function(done) {
      const app = new SactiveWeb({enableTransform: true});
      app.route({
        name: 'demo1-500',
        method: 'get',
        path: '/demo1/route4',
        template: `notfound.pug`,
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route4')
        .set('Accept', 'text/html')
        .expect(500)
        .end(function(err, res) {
          expect(res.body).to.eql({
            'code': 500,
            'msg': 'Internal server error, reason: Render failed, config view option first.'
          });
          done();
        });
    });

    it('Should render html successfully', function(done) {
      const app = new SactiveWeb({view: {path: `${__dirname}/template`}, enableTransform: true});
      app.route({
        name: 'demo-render',
        method: 'get',
        path: '/demo/render',
        template: `test.pug`,
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/render')
        .expect(200)
        .end(function(err, res) {
          done();
        });
    });
  });

  describe('Json response tests', function() {
    it('Should get json response', function(done) {
      const app = new SactiveWeb({enableTransform: true});
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route1')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({
            code: 200,
            data: {'name': 'xiaoming'},
            msg: 'success.'
          });
          done();
        });
    });

    it('Should get json error response', function(done) {
      const app = new SactiveWeb({enableTransform: true});
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          let e = new Error('test');
          e.status = 504;
          throw e;
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route1')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({
            code: 504,
            msg: 'test'
          });
          done();
        });
    });
    it('Should get json response without enableTransform', function(done) {
      const app = new SactiveWeb();
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          return 'test without enableTransform'
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route1')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({});
          done();
        });
    });
  });
});