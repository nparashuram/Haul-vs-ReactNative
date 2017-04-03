import "babel-polyfill";
import "babel-core/register";

import testcases from './cases';

async function run() {
  let results = {};
  for (var key in testcases) {
    results[key] = await testcases[key]();
  }
  return results;
}

run().then((...a) => console.log('Success', ...a), (...a) => console.log('Error', ...a));