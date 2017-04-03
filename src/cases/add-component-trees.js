import { createComponent, addChildComponent, requestBundle } from './../util/component';

import debug from 'debug';
const log = debug('hvrn:test:add-one-component');

import { testCase } from './../testRunner';
import { HighResolutionTimer } from './../profiler';
import packager from './../packager';
import { sleep } from './../util/promisify';

import * as lifecycle from './../util/lifecycle'

export default testCase('Adding One Component at a time', (setup, test, cleanup) => {
  let myPackager;

  let hrtimer = new HighResolutionTimer();

  setup(async () => {
    await lifecycle.cleanup();
    await lifecycle.setup();
    await lifecycle.createReactNativeApp();
    await hrtimer.instrument();
  });

  test(async () => {
    myPackager = await packager.reactNative.start();
    hrtimer.record(myPackager);

    await myPackager.fetchBundle();
    sleep(20000);

    for (var i = 1; i < 10; i++) {
      log('Adding Component ', i);
      await createComponent(`Component${i}`);
      await addChildComponent(`Component${i - 1}`, `Component${i}`);
      await sleep(15000);
      await myPackager.fetchBundle();
      await sleep(5000);
    }

    console.log(hrtimer.results);
  });

  cleanup(async () => {
    myPackager.kill();
    await cleanup();
  });
});
