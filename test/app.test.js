const App = require('..');
const request = require('supertest');
const {expect} = require('chai');

let server = null;
describe('Application tests', function() {
  describe('Router tests', function () {
    before(function () {
      const app = new App();
      app.bindAny('age', 18);
      app.use(($age, $ctx, $next) => {
        console.log('app middleware1');
        console.log('age' + $age);
        $next();
      });
      app.use(($ctx, $age, $next, $address) => {
        console.log('app middleware2');
        console.log('age' + $age);
        console.log('address', $address);
        $next();
      });
      app.get('/users/:name', function($ctx, $next) {
        if ($ctx.params.name === 'xiaoming') {
          $ctx.response.body = {'name': 'xiaoming'};
          return
        }
        $ctx.response.body = {'name': 'unknown'};
      });
      app.use(($address, $ctx, $next, $age, $getAddress) => {
        console.log('app middleware3');
        console.log('age' + $age);
        console.log('address', $address);
        console.log('getAddress', $getAddress);
        $next();
      });
      app.bindAny('address', 'shanghai');
      app.bindFunction('getAddress', $address => {
        return $address;
      });
      server = app.listen(9000);
    })
    it('Should get response: {name: xiaoming}, url: /users/xiaoming', function(done) {
      request(server)
        .get('/users/xiaoming')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({'name': 'xiaoming'});
          done();
        });
    });
    it('Should get response: {name: unknown}, url: /users/xiaoqiang', function(done) {
      request(server)
        .get('/users/xiaoqiang')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({'name': 'unknown'});
          done();
        });
    });
  })
});