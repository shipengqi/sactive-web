const SactiveWeb = require('..');
const request = require('supertest');
const {expect} = require('chai');


describe('Route tests', function () {

  describe('Route validate tests', function () {
    it('Should validate params failed with hander and required false', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/validate/:id',
        handler: async function(ctx, next) {
          return ctx.body = `Hello.`;
        },
        paramValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/validate/666')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 400,
            msg: 'Validate failed, reason: Key: id, value: 666.'
          });
          done();
        });
    });

    it('Should validate query failed with hander and required false', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/validate',
        handler: async function(ctx, next) {
          return ctx.body = `Hello.`;
        },
        queryValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/validate')
        .query({ id: 'edit'})
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 400,
            msg: 'Validate failed, reason: Key: id, value: edit.'
          });
          done();
        });
    });

    it('Should validate data failed with hander and required false', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'post',
        path: '/demo/validate',
        handler: async function(ctx, next) {
          return ctx.body = `Hello.`;
        },
        dataValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .post('/demo/validate')
        .send({id: 'edit'})
        .set('accept', 'json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 400,
            msg: 'Validate failed, reason: Key: id, value: edit.'
          });
          done();
        });
    });
  });
  describe('Route nomarlize tests', function () {
    it('Should validate params successfully with nomarlization', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/validate/:id',
        handler: async function(ctx, next) {
          return ctx.body = `Hello.`;
        },
        paramNormalizations: {
          id: function(value) {
            return Number(value);
          }
        },
        paramValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/validate/666')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({code: 200, msg: 'success.', data: 'Hello.'});
          done();
        });
    });

    it('Should validate query successfully with nomarlization', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/validate',
        handler: async function(ctx, next) {
          return ctx.body = `Hello.`;
        },
        queryNormalizations: {
          id: function(value) {
            return Number(value);
          }
        },
        queryValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/validate')
        .query({ id: 666})
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({code: 200, msg: 'success.', data: 'Hello.'});
          done();
        });
    });

    it('Should validate data successfully with hander and required false', function (done) {
      const app = new SactiveWeb();
      app.route({
        name: 'hello',
        method: 'post',
        path: '/demo/validate',
        handler: async function(ctx, next) {
          return ctx.body = {name: 'xiaoming'};
        },
        dataNormalizations: {
          id: function(value) {
            return Number(value);
          }
        },
        dataValidations: {
          id: {
            required: false,
            handler: function(value) {
              if (typeof (value) === 'string') {
                return false;
              }
              return true;
            }
          }
        }
      });
      app.init();
      const server = app.listen();

      request(server)
        .post('/demo/validate')
        .send({id: 'edit'})
        .set('accept', 'json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({code: 200, msg: 'success.', data: {name: 'xiaoming'}});
          done();
        });
    });
  });
  describe('Route dependency tests', function () {
    it('Add route with object dependency', function (done) {
      const app = new SactiveWeb();
      app.bindInstance('test1', {name: 'xiaoming'});
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/dependency',
        handler: async function(ctx, next) {
          return ctx.body = `Hello, ${this.$$test1.name}!!!`;
        },
        dependencies: ['$$test1']
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/dependency')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 200,
            data:  `Hello, xiaoming!!!`,
            msg: 'success.'
          });
          done();
        });
    });

    it('Add route with class dependency', function (done) {
      class Student {
        constructor($$test1) {
          this.name = 'xiaoqiang';
          this.$$test1 = $$test1;
        }
      }
      const app = new SactiveWeb();
      app.bindClass('student', Student);
      app.bindInstance('test1', {name: 'xiaoming'});
      app.route({
        name: 'hello',
        method: 'get',
        path: '/demo/dependency',
        handler: async function(ctx, next) {
          return ctx.body = [this.$$test1.name, this.$$student.name];
        },
        dependencies: ['$$student', '$$test1']
      });
      app.init();
      const server = app.listen();

      request(server)
        .get('/demo/dependency')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.eql({
            code: 200,
            data:  ['xiaoming', 'xiaoqiang'],
            msg: 'success.'
          });
          done();
        });
    })
  });
});