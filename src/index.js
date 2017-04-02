import "babel-polyfill";
import "babel-core/register";

import { setup, cleanup, createReactNativeApp } from './util/lifecycle.js';
import { add_v8Profiler, add_hrtime } from './util/profiler';
import testcases from './cases';

async function run() {
  await cleanup();
  await setup();
  await createReactNativeApp();
  await add_hrtime();

  for (var key in testcases) {
    await testcases[key]();
  }
}

run().then(console.log.bind(console), console.log.bind(console));