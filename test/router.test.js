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
  describe('Router multiple middleware tests', () => {
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
          $next();
        }, ($ctx, $next, $name5) => {
          $ctx.body.name4 = $ctx.name4;
          $ctx.body.name5 = $name5;
        });
      app.bindAny('name3', CONSTANT_MOCK.INJECT_NAME + 3);
      app.bindAny('name4', CONSTANT_MOCK.INJECT_NAME + 4);
      app.bindAny('name5', CONSTANT_MOCK.INJECT_NAME + 5);
      server = app.listen(CONSTANT_MOCK.PORT + 2);
    });
    it('get response: {name: xiaoming, name1: pooky1, name2: pooky1 ...}', done => {
      request(server)
        .get('/v1/users/xiaoming')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.eql({'name': 'xiaoming', 'name1': 'pooky1', 'name2': 'pooky2', 'name3': 'pooky3', 'name4': 'pooky4', 'name5': 'pooky5'});
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
    it('get response: {code: 200, data: {...}, msg: ok}', done => {
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
    it('get response: {code: 500, data: {...}, msg: pooky}', done => {
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
    it('get response: {code: 500, data: {...}, msg: xiaoming}', done => {
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
    it('get response: {code: 200, data: {...}, msg: ok}', done => {
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
    it('get response: {code: 500, data: {...}, msg: pooky}', done => {
      request(server)
        .get('/v1/users/pooky')
        .expect(200)
        .end((err, res) => {
          expect(unhandledRejection).to.eql(CONSTANT_MOCK.INJECT_NAME);
          done();
        });
    });
    it('get response: {code: 500, data: {...}, msg: xiaoming}', done => {
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