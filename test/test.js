
let t = require('lodash');
let i = [];
let hello = () => {
  return 'hello';
};
async function test(i) {
  let result = await hello();
  console.log(result);
}

test();