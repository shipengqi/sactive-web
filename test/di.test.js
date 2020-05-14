const Di = require('../lib/di');
const {expect} = require('chai');

class Router {
  constructor($logger) {
    this.logger = $logger;
  }
  test() {
    return 'router test';
  }
}

class Logger {
  test() {
    return 'log test';
  }
}

class Utils {
  constructor($logger, $router, $async) {
    this.logger = $logger;
    this.router = $router;
    this.$async = $async;
  }
  logTest() {
    return this.logger.test();
  }
  routerTest() {
    return this.router.test();
  }
  test() {
    return 'utils test';
  }
}

function unInjectFunc(unknown) {
  return unknown;
}

function testFunc($logger) {
  return $logger.test() + ' function test';
}

async function asyncFunc($logger) {
  return $logger.test() + ' async function test';
}

const arrowFunc = $logger => {
  return $logger.test() + ' arrow function test';
};

let person = {
  name: 'pooky',
  age: 18,
  address: {
    city: 'shanghai'
  }
};

let name = 'pooky';

describe('Dependency injector tests', function() {
  beforeEach(function() {
    this.injector = new Di();
    this.injector.bindAny('person', person);
    this.injector.bindAny('name', name);
    this.injector.bindClass('util', Utils);
    this.injector.bindClass('router', Router);
    this.injector.bindClass('logger', Logger);
    this.injector.bindFunction('test', testFunc);
    this.injector.bindFunction('async', asyncFunc);
    this.injector.bindFunction('arrow', arrowFunc);
    this.injector.bindFunction('unInject', unInjectFunc);
  });
  afterEach(function() {
    this.injector.reset();
  });
  it('BindFunction error with string', function() {
    try {
      this.injector.bindFunction('func', 'func');
    } catch (e) {
      expect(e.message).to.eql('instance must be a function!');
    }
  });
  it('Bind error with object name', function() {
    try {
      this.injector.bindAny({}, 'object');
    } catch (e) {
      expect(e.message).to.eql('instance name must be a string.');
    }
  });
  it('Bind error with null', function() {
    try {
      this.injector.bindAny('nullobject', null);
    } catch (e) {
      expect(e.message).to.eql('instance cannot be null.');
    }
  });
  it('Repeat binding error', function() {
    try {
      this.injector.bindAny('test', 'test');
      this.injector.bindAny('test', 'test');
    } catch (e) {
      expect(e.message).to.eql(`instance: test has already bound.`);
    }
  });
  it('Inject object test', function() {
    expect(this.injector.getInstance('$person')).to.eql(person);
  });
  it('Inject string test', function() {
    expect(this.injector.getInstance('$name')).to.eql(name);
  });
  it('Inject function test', function() {
    expect(this.injector.getInstance('$test')).to.eql('log test function test');
  });
  it('Inject async function test', function(done) {
    this.injector.getInstance('$async').then(function(got) {
      expect(got).to.eql('log test async function test');
      done();
    });
  });
  it('Inject arrow function test', function() {
    expect(this.injector.getInstance('$arrow')).to.eql('log test arrow function test');
  });
  it('Inject class test', function(done) {
    let util = this.injector.getInstance('$util');
    expect(util.test()).to.eql('utils test');
    expect(util.logTest()).to.eql('log test');
    expect(util.routerTest()).to.eql('router test');
    util.$async.then(function(res) {
      expect(res).to.eql('log test async function test');
      done();
    });
  });
  it('Get instances test', function(done) {
    let res = this.injector.getInstances(['$async', '$test']);
    expect(res[1]).to.eql('log test function test');
    res[0].then(function (got) {
      expect(got).to.eql('log test async function test');
      done();
    });
  });
  it('Get instances null without $', function() {
    let got = this.injector.getInstance('unInject');
    expect(got).to.eql(null);
  });
  it('Get instances error with object', function() {
    try {
      this.injector.getInstances({});
    } catch (e) {
      expect(e.message).to.eql('instance names must be an array.');
    }
  });
  it('Get instances map error with object', function() {
    try {
      this.injector.getInstancesMap({});
    } catch (e) {
      expect(e.message).to.eql('instance names must be an array.');
    }
  });
  it('Get instances map test', function() {
    let got = this.injector.getInstancesMap(['$name', '$person']);
    expect(got.$name).to.eql(name);
    expect(got.$person).to.eql(person);
  });
  it('Delete instance test', function() {
    this.injector.deleteInstance('$async');
    expect(this.injector.getInstance('$async')).to.eql(null);
  });
  it('Delete instance error with object', function() {
    try {
      this.injector.deleteInstance({});
    } catch (e) {
      expect(e.message).to.eql('instance name must be a string.');
    }
  });
  it('Delete instances test', function() {
    this.injector.deleteInstances(['$async', '$test', '']);
    expect(this.injector.getInstance('$async')).to.eql(null);
    expect(this.injector.getInstance('$test')).to.eql(null);
  });
  it('Delete instances error', function() {
    try {
      this.injector.deleteInstances('test');
    } catch (e) {
      expect(e.message).to.eql('instance names must be an array.');
    }
  });
  it('Reset test', function() {
    this.injector.reset();
    expect(this.injector.getInstance('$async')).to.eql(null);
    expect(this.injector.getInstance('$test')).to.eql(null);
  });
});