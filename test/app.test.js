const SactiveWeb = require('..');
const request = require('supertest');
const {expect} = require('chai');

describe('Application tests', function() {

  describe('App.route tests', function() {
    it('Should get response: {name: xiaoming}, url: /demo1/route1', function(done) {
      const app = new SactiveWeb();
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          ctx.response.body = {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route1')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({'name': 'xiaoming'});
          done();
        });
    });
    it('Should get response with enabletransform, url: /demo1/route1', function(done) {
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
    it('Should get response failed with enabletransform, url: /demo1/route1', function(done) {
      const app = new SactiveWeb({enableTransform: true});
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          throw new Error('test');
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
            code: 500,
            msg: 'test'
          });
          done();
        });
    });
    it('Should get response html, url: /demo1/route1', (done) => {
      const app = new SactiveWeb();
      app.route({
        name: 'demo1-route1',
        method: 'get',
        path: '/demo1/route1',
        handler: function(ctx, next) {
          ctx.response.body = '<h1>Hello demo1-route1 !!!</h1>';
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route1')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({});
          done();
        });
    });
  });
  describe('App.load tests', function() {
    it('Should get response html, url: /array/route', done => {
      const app = new SactiveWeb();
      app.loadFile(`${__dirname}/mock`, `routers.js`);
      app.init();
      const server = app.listen();

      request(server)
        .get('/array/route')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({});
          done();
        });
    });
    it('Should get response, url: /func/route/:id', done => {
      const app = new SactiveWeb();
      app.load(`${__dirname}/mock`);
      app.init();
      const server = app.listen();

      request(server)
        .post('/func/route/2')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({
            code: '200',
            data: {
              id: '2'
            },
            msg: `Hello /func/route: 2 !!!`
          });
          done();
        });
    });
  });
});