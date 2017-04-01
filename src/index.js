import "babel-polyfill";
import "babel-core/register";

import { dirs } from './util/constants';

import { setup, cleanup, createReactNativeApp } from './util/lifecycle.js';
import instrument from './util/instrument';

async function run() {
  await instrument();
}

run().then((res) => console.log(res), err => console.log(err));