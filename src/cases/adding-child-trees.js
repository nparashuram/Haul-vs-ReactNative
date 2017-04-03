import { createComponent, addChildComponent } from './../util/component';

import debug from 'debug';
const log = debug('hvrn:test:case');

import { testCase, defaultCleanup, defaultSetup } from './../testRunner';
import { HighResolutionTimer } from './../profiler';
import { sleep } from './../util/promisify';

export default testCase('Adding One Component at a time', (setup, test, cleanup) => {

  setup(defaultSetup(HighResolutionTimer));

  test(async (packager, addResult) => {
    let hrtimer = new HighResolutionTimer();
    hrtimer.record(packager);

    await packager.fetchBundle();
    sleep(20000);
    addResult(0, hrtimer.results[0]);

    for (var i = 1; i < 30; i++) {
      await sleep(5000);
      await createComponent(`Component${i}`);
      for (var j = 0; j < 20; j++) {
        await createComponent(`ComponentTree_${i}_${j}`);
        await addChildComponent(`Component${i}`, `ComponentTree_${i}_${j}`);
      }
      await addChildComponent(`Component${i - 1}`, `Component${i}`);
      log('Added ComponentTree ', i);
      await sleep(5000);
      await packager.fetchBundle();
      addResult(i, hrtimer.results[i]);
    }
  });

});

