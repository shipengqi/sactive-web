
let t = require('lodash');
let i = [];
let hello = () => {
  console.log('hello');
  return 'hello';
};
async function test(i) {
  return hello();
}

test().then(res => {
  console.log('-' + res)
})