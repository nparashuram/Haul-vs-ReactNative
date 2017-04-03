import packager from './packager';
import * as lifecycle from './util/lifecycle'

import debug from 'debug';
const log = debug('hvrn:testRunner');

export function testCase(name, fn) {
  let methods = { setup: () => { }, cleanup: () => { }, test: () => { } };
  let setFn = type => cb => methods[type] = (typeof cb === 'function' ? cb : () => { })

  let result = { 'Haul': {}, 'ReactNative': {} }
  let addResult = (packagerName) => (column, value) => result[packagerName][column] = value;

  fn(setFn('setup'), setFn('test'), setFn('cleanup'));

  return {
    name,
    fn: async function () {

      log(`Running on Haul for << ${name} >> `);
      await methods.setup();
      let haulPackager = await packager.haul.start();
      await methods.test(haulPackager, addResult('Haul'));
      haulPackager.kill();
      await methods.cleanup();

      log(`Running on React Native for << ${name} >> `);
      await methods.setup();
      let reactNativePackager = await packager.reactNative.start();
      await methods.test(reactNativePackager, addResult('ReactNative'));
      reactNativePackager.kill();
      await methods.cleanup();

      return result;
    }
  }
}

export const defaultSetup = (profiler) => async () => {
  await lifecycle.cleanup();
  await lifecycle.setup();
  await lifecycle.createReactNativeApp();
  await profiler.instrument();
}