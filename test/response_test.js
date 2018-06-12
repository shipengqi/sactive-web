const SactiveWeb = require('..');
const request = require('supertest');
const {expect} = require('chai');

describe('Response tests', function () {

  describe('Html response tests', function () {

    it('Should render successfully', function (done) {
      const app = new SactiveWeb({viewPath: `${__dirname}/template`});
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
        .end(function (err, res) {
          done();
        });
    });

    it('Should get 404', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'demo1-404',
        method: 'get',
        path: '/demo1/route4',
        handler: function(ctx, next) {
          return {'name': 'xiaoming'};
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo1/route4')
        .expect(404)
        .end(function (err, res) {
          expect(res.body).to.eql({
            'code': 404,
            'msg': 'Not Found: Template undefined not existed'
          });
          done();
        });
    });
  });

  describe('Json response tests', function () {

    it('Should get json response', function (done) {
      const app = new SactiveWeb();
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
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 200,
            data: {'name': 'xiaoming'},
            msg: 'success.'
          });
          done();
        });
    });

    it('Should get json error response', function (done) {
      const app = new SactiveWeb();
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
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 504,
            msg: 'test'
          });
          done();
        });
    });
  });
});