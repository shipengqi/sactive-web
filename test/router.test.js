const App = require('..');
const request = require('supertest');
const {expect} = require('chai');

class Person {
  constructor($name) {
    this.name = $name;
  }
  SayHello() {
    return `Hi, I'm ${this.name}`;
  }
}

const CONSTANT_MOCK = {
  PORT: 9001,
  INJECT_NAME: 'pooky',
  URL_NAME: 'xiaoming'
};
let server = null;
let unhandledRejection = '';
describe('Router tests', () => {
  describe('Bind instance tests', () => {
    it('Bind anywhere, get response: {name: pooky, namefortest: pooky, getName: pooky}', done => {
      const app = new App();
      app.bindClass('person', Person);
      app.use(($ctx, $name, $next) => {
        $ctx.namefortest = $name;
        $next();
      });
      app.bindAny('name', 'pooky');
      app.get('/users/:name', ($ctx, $name, $getName) => {
        if ($ctx.params.name === CONSTANT_MOCK.URL_NAME) {
          return $ctx.response.body = {'name': $ctx.params.name, 'namefortest': $ctx.namefortest, 'getName': $getName};
        }
      });
      app.bindFunction('getName', $name => {
        return $name;
      });
      server = app.listen(CONSTANT_MOCK.PORT);
      request(server)
        .get('/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoming', 'namefortest': 'pooky', 'getName': 'pooky'});
          done();
        });
    });
  });
  describe('Router group register tests', () => {
    it('Throw error prefix cannot be a empty', () => {
      try {
        const app = new App();
        app.group('');
      } catch (e) {
        expect(e.message).to.eql('prefix cannot be a empty!');
      }
    });
    it('Throw error prefix must be a string!', () => {
      try {
        const app = new App();
        app.group({});
      } catch (e) {
        expect(e.message).to.eql('prefix must be a string!');
      }
    });
    it('Throw error middleware must be a function', () => {
      try {
        const app = new App();
        let g = app.group('/v1');
        g.get('/test', {});
      } catch (e) {
        console.log(e.message);
        expect(e.message).to.eql('get `/test`: `middleware` must be a function, not `object`');
      }
    });
  });
  describe('Router group tests', () => {
    before(() => {
      const app = new App();
      app.bindAny('name', CONSTANT_MOCK.INJECT_NAME);
      app.use(($ctx, $name, $next) => {
        $ctx.testname1 = $name;
        $next();
      });
      app.group('v1')
        .get('/users/:name', ($ctx, $next, $name) => {
          $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
        });
      app.group('v2/')
        .get('/users/:name', ($name, $ctx, $next) => {
          $ctx.response.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
        });
      app.group('/v3/')
        .get('/users/:name', ($ctx, $name, $next) => {
          $ctx.body = {'name': $ctx.params.name, 'testname1': $ctx.testname1, 'testname2': $name};
        });
      app.allowMethods();
      server = app.listen(CONSTANT_MOCK.PORT + 1);
    });
    it('Group v1, get response: {name: xiaoming, testname1: pooky, testname2: pooky}', done => {
      request(server)
        .get('/v1/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoming', 'testname1': 'pooky', 'testname2': 'pooky'});
          done();
        });
    });
    it('Group v2, get response: {name: xiaoliang, testname1: pooky, testname2: pooky}', done => {
      request(server)
        .get('/v2/users/xiaoliang')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoliang', 'testname1': 'pooky', 'testname2': 'pooky'});
          done();
        });
    });
    it('Group v3, get response: {name: xiaoqiang, testname1: pooky, testname2: pooky}', done => {
      request(server)
        .get('/v3/users/xiaoqiang')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoqiang', 'testname1': 'pooky', 'testname2': 'pooky'});
          done();
        });
    });
  });
  describe('Router delete tests', () => {
    before(() => {
      const app = new App();
      app.bindAny('name', CONSTANT_MOCK.INJECT_NAME);
      app.use(($ctx, $name, $next) => {
        $ctx.testname1 = $name;
        $next();
      });
      app.group('/v4/')
          .del('/users/:name', ($ctx, $name, $next) => {
            $ctx.body = `v4 delete user ${$ctx.params.name}, ${$name} success`;
          })
          .delete('/products/:name', ($ctx, $name, $next) => {
            $ctx.body = `v4 delete product ${$ctx.params.name}, ${$name} success`;
          });
      app.delete('/users/:name', ($ctx, $name, $next) => {
        $ctx.body = `app delete user ${$ctx.params.name}, ${$name} success`;
      });
      app.del('/products/:name', ($ctx, $name, $next) => {
        $ctx.body = `app delete product ${$ctx.params.name}, ${$name} success`;
      });
      app.get('/users/:name', ($ctx, $name, $next) => {
        $ctx.body = $ctx.params.name;
      });
      server = app.listen(CONSTANT_MOCK.PORT + 8);
    });
    it('App router, /users get response: xiaoqiang', done => {
      request(server)
          .get('/users/xiaoqiang')
          .set('Accept', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(200)
          .end((err, res) => {
            expect(res.text).to.eql('xiaoqiang');
            done();
          });
    });
    it('Group v4, /v4/users get response: v4 delete user xiaoqiang, pooky success', done => {
      request(server)
          .delete('/v4/users/xiaoqiang')
          .expect(200)
          .set('Accept', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .end((err, res) => {
            expect(res.text).to.eql('v4 delete user xiaoqiang, pooky success');
            done();
          });
    });
    it('Group v4, /v4/products get response: v4 delete product, pooky phone success', done => {
      request(server)
          .del('/v4/products/phone')
          .set('Accept', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(200)
          .end((err, res) => {
            expect(res.text).to.eql('v4 delete product phone, pooky success');
            done();
          });
    });
    it('App router /users get response: app delete user xiaoqiang, pooky success', done => {
      request(server)
          .del('/users/xiaoqiang')
          .set('Accept', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .end((err, res) => {
            expect(res.text).to.eql('app delete user xiaoqiang, pooky success');
            done();
          });
    });
    it('App router /products get response: app delete product phone, pooky success', done => {
      request(server)
          .del('/products/phone')
          .set('Accept', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(200)
          .end((err, res) => {
            expect(res.text).to.eql('app delete product phone, pooky success');
            done();
          });
    });
  });
  describe('Router multiple middleware tests', () => {
    before(() => {
      const app = new App();
      app.bindAny('name1', CONSTANT_MOCK.INJECT_NAME + 1);
      app.use(($ctx, $name1, $next) => {
        $ctx.name1 = $name1;
        $next();
      });
      app.bindAny('name2', CONSTANT_MOCK.INJECT_NAME + 2);
      let v1Router = app.group('v1')
        .use(($name6, $ctx, $next) => {
          $ctx.testname6 = $name6;
          $next();
        })
        .get('/users/:name', ($ctx, $next, $name2) => {
          $ctx.body = {'name': $ctx.params.name, 'name1': $ctx.name1, 'name2': $name2};
          if ($ctx.params.name === 'testname6') {
            $ctx.body.name6 = $ctx.testname6;
          }
          $next();
        }, ($ctx, $next, $name3) => {
          $ctx.body.name3 = $name3;
          $next();
        }, ($ctx, $next, $name4) => {
          $ctx.name4 = $name4;
          $next();
        }, ($ctx, $next, $name5) => {
          $ctx.body.name4 = $ctx.name4;
          $ctx.body.name5 = $name5;
          if ($ctx.params.name === 'testname7') {
            $ctx.body.name7 = $ctx.testname7;
          }
        });
      v1Router.use(($ctx, $next, $name7) => {
        $ctx.testname7 = $name7;
        $next();
      });
      app.bindAny('name3', CONSTANT_MOCK.INJECT_NAME + 3);
      app.bindAny('name4', CONSTANT_MOCK.INJECT_NAME + 4);
      app.bindAny('name5', CONSTANT_MOCK.INJECT_NAME + 5);
      app.bindAny('name6', CONSTANT_MOCK.INJECT_NAME + 6);
      app.bindAny('name7', CONSTANT_MOCK.INJECT_NAME + 7);
      server = app.listen(CONSTANT_MOCK.PORT + 2);
    });
    it('Get response: {name: xiaoming, name1: pooky1, name2: pooky1 ...}', done => {
      request(server)
        .get('/v1/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoming', 'name1': 'pooky1', 'name2': 'pooky2', 'name3': 'pooky3', 'name4': 'pooky4', 'name5': 'pooky5'});
          done();
        });
    });
    it('Get response: {name: testname6, ..., name6: pooky6}', done => {
      request(server)
        .get('/v1/users/testname6')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'testname6', 'name1': 'pooky1', 'name2': 'pooky2', 'name3': 'pooky3', 'name4': 'pooky4', 'name5': 'pooky5', 'name6': 'pooky6'});
          done();
        });
    });
    it('Get response: {name: testname7, ..., name7: pooky7}', done => {
      request(server)
        .get('/v1/users/testname7')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'testname7', 'name1': 'pooky1', 'name2': 'pooky2', 'name3': 'pooky3', 'name4': 'pooky4', 'name5': 'pooky5', 'name7': 'pooky7'});
          done();
        });
    });
  });
  describe('Interceptors tests', () => {
    before(() => {
      const app = new App();
      app.bindAny('name1', CONSTANT_MOCK.INJECT_NAME + 1);
      app.use(($ctx, $name1, $next) => {
        $ctx.name1 = $name1;
        $next();
      });
      app.bindAny('name2', CONSTANT_MOCK.INJECT_NAME + 2);
      app.group('v1')
        .get('/users/:name', ($ctx, $next, $name2) => {
          $ctx.body = {'name': $ctx.params.name, 'name1': $ctx.name1, 'name2': $name2};
          $next();
        }, ($ctx, $next, $name3) => {
          $ctx.body.name3 = $name3;
          $next();
        }, ($ctx, $next, $name4) => {
          $ctx.name4 = $name4;
          if ($ctx.params.name === CONSTANT_MOCK.URL_NAME) {
            throw new Error($ctx.params.name);
          }
          $next();
        }, ($ctx, $next, $name5) => {
          $ctx.body.name4 = $ctx.name4;
          $ctx.body.name5 = $name5;
          if ($ctx.params.name === CONSTANT_MOCK.INJECT_NAME) {
            throw new Error($ctx.params.name);
          }
        });
      app.bindAny('name3', CONSTANT_MOCK.INJECT_NAME + 3);
      app.bindAny('name4', CONSTANT_MOCK.INJECT_NAME + 4);
      app.bindAny('name5', CONSTANT_MOCK.INJECT_NAME + 5);
      app.interceptors.errors.use((err, ctx) => {
        ctx.body = {
          code: 500,
          data: {},
          msg: err.message
        };
      });
      app.interceptors.response.use(ctx => {
        let data = ctx.body;
        ctx.body = {
          code: 200,
          data: data,
          msg: 'ok'
        };
      });
      server = app.listen(CONSTANT_MOCK.PORT + 3);
    });
    it('Get response: {code: 200, data: {...}, msg: ok}', done => {
      request(server)
        .get('/v1/users/xiaoqiang')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({
            code: 200,
            data: {
              name: 'xiaoqiang',
              name1: 'pooky1',
              name2: 'pooky2',
              name3: 'pooky3',
              name4: 'pooky4',
              name5: 'pooky5'
            },
            msg: 'ok'
          });
          done();
        });
    });
    it('Get response: {code: 500, data: {...}, msg: pooky}', done => {
      request(server)
        .get('/v1/users/pooky')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({
            code: 500,
            data: {},
            msg: 'pooky'
          });
          done();
        });
    });
    it('Get response: {code: 500, data: {...}, msg: xiaoming}', done => {
      request(server)
        .get('/v1/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({
            code: 500,
            data: {},
            msg: 'xiaoming'
          });
          done();
        });
    });
  });
  describe('Interceptors without errors interceptor tests', () => {
    before(() => {
      const app = new App();
      app.bindAny('name1', CONSTANT_MOCK.INJECT_NAME + 1);
      app.use(($ctx, $name1, $next) => {
        $ctx.name1 = $name1;
        $next();
      });
      app.bindAny('name2', CONSTANT_MOCK.INJECT_NAME + 2);
      app.group('v1')
        .get('/users/:name', ($ctx, $next, $name2) => {
          $ctx.body = {'name': $ctx.params.name, 'name1': $ctx.name1, 'name2': $name2};
          $next();
        }, ($ctx, $next, $name3) => {
          $ctx.body.name3 = $name3;
          $next();
        }, ($ctx, $next, $name4) => {
          $ctx.name4 = $name4;
          if ($ctx.params.name === CONSTANT_MOCK.URL_NAME) {
            throw new Error($ctx.params.name);
          }
          $next();
        }, ($ctx, $next, $name5) => {
          $ctx.body.name4 = $ctx.name4;
          $ctx.body.name5 = $name5;
          if ($ctx.params.name === CONSTANT_MOCK.INJECT_NAME) {
            throw new Error($ctx.params.name);
          }
        });
      app.bindAny('name3', CONSTANT_MOCK.INJECT_NAME + 3);
      app.bindAny('name4', CONSTANT_MOCK.INJECT_NAME + 4);
      app.bindAny('name5', CONSTANT_MOCK.INJECT_NAME + 5);
      app.interceptors.response.use(ctx => {
        let data = ctx.body;
        ctx.body = {
          code: 200,
          data: data,
          msg: 'ok'
        };
      });
      server = app.listen(CONSTANT_MOCK.PORT + 5);
      process.on('unhandledRejection', (reason, promise) => {
        unhandledRejection = reason.message;
      });
    });
    it('Get response: {code: 200, data: {...}, msg: ok}', done => {
      request(server)
        .get('/v1/users/xiaoqiang')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({
            code: 200,
            data: {
              name: 'xiaoqiang',
              name1: 'pooky1',
              name2: 'pooky2',
              name3: 'pooky3',
              name4: 'pooky4',
              name5: 'pooky5'
            },
            msg: 'ok'
          });
          done();
        });
    });
    it('Get response: {code: 500, data: {...}, msg: pooky}', done => {
      request(server)
        .get('/v1/users/pooky')
        .expect(200)
        .end((err, res) => {
          expect(unhandledRejection).to.eql(CONSTANT_MOCK.INJECT_NAME);
          done();
        });
    });
    it('Get response: {code: 500, data: {...}, msg: xiaoming}', done => {
      request(server)
        .get('/v1/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(unhandledRejection).to.eql(CONSTANT_MOCK.URL_NAME);
          done();
        });
    });
  });
});