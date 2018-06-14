const SactiveWeb = require('..');
const request = require('supertest');
const {expect} = require('chai');
let TEST_ROUTE = {
  name: 'test-route',
  method: 'get',
  path: '/test/route',
  handler: function(ctx, next) {
    ctx.response.body = {'name': 'xiaoming'};
  }
};

describe('Application tests', function() {
  afterEach(function () {
    TEST_ROUTE = {
      name: 'test-route',
      method: 'get',
      path: '/test/route',
      handler: function(ctx, next) {
        ctx.response.body = {'name': 'xiaoming'};
      }
    };
  });
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
      app.loadFile(`${__dirname}/mock`, `route.json`);
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
  describe('App init tests', function() {
    it('Should throw an error: ResponseTransform must be a function', () => {
      try {
        const app = new SactiveWeb({responseTransform: 'test'});
      } catch (e) {
        expect(e.message).to.eql('ResponseTransform must be a function.');
      }
    });
    it('Should throw an error: test-route has been registered', () => {
      try {
        const app = new SactiveWeb();
        app.route(TEST_ROUTE);
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router name: test-route has been registered.');
      }
    });
    it('Should throw an error: Router name must be a string.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.name = null;
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router name must be a string.');
      }
    });
    it('Should throw an error: Router method must be a string.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.method = null;
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router method must be a string.');
      }
    });
    it('Should throw an error: Router path must be a string.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.path = null;
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router path must be a string.');
      }
    });
    it('Should throw an error: Router handler must be a function.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.handler = {test: 666};
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router handler must be a function.');
      }
    });
    it('Should throw an error: Router handler cannot be arrow function.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.handler = () => {
          return 'test';
        };
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Router handler cannot be arrow function.');
      }
    });
    it('Should throw an error: Dependencies must be an array.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.dependencies = {};
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Dependencies must be an array.');
      }
    });
    it('Should throw an error: Validations must be plain object.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.paramValidations = [];
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Validations must be plain object.');
      }
    });
    it('Should throw an error: Normalizations must be plain object.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.paramNormalizations = [];
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Normalizations must be plain object.');
      }
    });
    it('Should throw an error: Validation must be plain object.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.paramValidations = {
          id: null
        };
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Validation must be plain object.');
      }
    });
    it('Should throw an error: Validation handler must be a function.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.paramValidations = {
          id: {
            required: false,
            handler: 'test'
          }
        };
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Validation handler must be a function.');
      }
    });
    it('Should throw an error: Normalization handler must be a function.', () => {
      try {
        const app = new SactiveWeb();
        TEST_ROUTE.paramNormalizations = {
          id: 'test'
        };
        app.route(TEST_ROUTE);
      } catch (e) {
        expect(e.message).to.eql('Normalization handler must be a function.');
      }
    });
  });
});