const App = require('..');
const koaBody = require('koa-body');
const request = require('supertest');
const {expect} = require('chai');

let server = null;
describe('Application tests', () => {
  before(() => {
    const app = new App();
    app.bindAny('age', 18);
    app.USE(koaBody());
    app.use(($age, $ctx, $next) => {
      $next();
    });
    app.use(($ctx, $age, $next, $address) => {
      $next();
    });
    app.get('/users/:name', ($ctx, $next) => {
      if ($ctx.params.name === 'xiaoming') {
        $ctx.response.body = {'name': 'xiaoming'};
        return;
      }
      $ctx.response.body = {'name': 'unknown'};
    });
    app.group('/v1')
      .get('/users/:name', ($ctx, $next) => {
        if ($ctx.params.name === 'xiaoming') {
          $ctx.response.body = {'name': 'xiaoming'};
          return;
        }
        $ctx.response.body = {'name': 'unknown'};
      });
    app.use(($address, $ctx, $next, $age, $getAddress) => {
      $next();
    });
    app.GET('/apps/:name', (ctx, next) => {
      ctx.body = ctx.params.name;
    });
    app.POST('/apps/:name', (ctx, next) => {
      ctx.testbody = ctx.request.body;
      next();
    }, (ctx, next) => {
      ctx.body = {name: ctx.params.name, testbody: ctx.testbody};
    });
    app.DEL('/apps/:name', (ctx, next) => {
      ctx.body = 'ok';
    });
    app.DELETE('/users/:name', (ctx, next) => {
      ctx.body = 'ok';
    });
    app.bindAny('address', 'shanghai');
    app.bindFunction('getAddress', $address => {
      return $address;
    });
    server = app.listen(9000);
  });
  it('Should get response: {name: xiaoming}, url: /users/xiaoming', done => {
    request(server)
      .get('/users/xiaoming')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql({'name': 'xiaoming'});
        done();
      });
  });
  it('Should get response: {name: unknown}, url: /users/xiaoqiang', done => {
    request(server)
      .get('/users/xiaoqiang')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql({'name': 'unknown'});
        done();
      });
  });
  it('Should get response: {name: xiaoming}, url: /v1/users/xiaoming', done => {
    request(server)
      .get('/v1/users/xiaoming')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql({'name': 'xiaoming'});
        done();
      });
  });
  it('Should get response: pooky, url: /apps/pooky', done => {
    request(server)
      .get('/apps/pooky')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.eql('pooky');
        done();
      });
  });
  it('Should get response: ok, url: /apps/pooky', done => {
    request(server)
      .del('/apps/pooky')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.eql('ok');
        done();
      });
  });
  it('Should get response: {name: pooky, testbody: {name: koa-body}}, url: /apps/pooky', done => {
    request(server)
      .post('/apps/pooky')
      .send({name: 'koa-body'})
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql({name: 'pooky', testbody: {name: 'koa-body'}});
        done();
      });
  });
});