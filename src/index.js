import "babel-polyfill";
import "babel-core/register";

import fs from 'fs-extra';

import testcases from './cases';

async function run() {
  let results = {};
  for (var key in testcases) {
    results[key] = await testcases[key]();
  }
  return results;
}

run().then(res => {
  // Merge results into a file
  let data;
  try { data = JSON.parse(fs.readFileSync('_results.json'), 'utf-8'); } catch (e) { data = {} }
  for (var key in res) {
    data[key] = data[key] || {};
    for (var packager in res[key]) {
      data[key][packager] = data[key][packager] || {};
      for (var column in res[key][packager]) {
        data[key][packager][column] = data[key][packager][column] || [];
        data[key][packager][column].push(res[key][packager][column]);
      }
    }
  }

  fs.writeFileSync('_results.json', JSON.stringify(data, null, 2), 'utf-8');
}, (...a) => console.log('Error', ...a));


