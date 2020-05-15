const App = require('..');
const request = require('supertest');
const {expect} = require('chai');

let server = null;
describe('Application tests', () => {
  before(() => {
    const app = new App();
    app.bindAny('age', 18);
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
});