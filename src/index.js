import "babel-polyfill";
import "babel-core/register";

import testcases from './cases';

async function run() {
  for (var key in testcases) {
    await testcases[key]();
  }
}

run().then((...a) => console.log('Success', ...a), (...a) => console.log('Error', ...a));