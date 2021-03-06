import { createComponent, addChildComponent } from './../util/component';

import debug from 'debug';
const log = debug('hvrn:test:case');

import { testCase, defaultCleanup, defaultSetup } from './../testRunner';
import { HighResolutionTimer } from './../profiler';
import { sleep } from './../util/promisify';
import { TEST_CHILD_COUNT } from './../util/constants';

export default testCase('Adding One Component at a time', (setup, test, cleanup) => {

  setup(defaultSetup(HighResolutionTimer));

  test(async (packager, addResult) => {
    let hrtimer = new HighResolutionTimer();
    hrtimer.record(packager);

    await packager.fetchBundle();
    sleep(20000);
    addResult(0, hrtimer.results[0]);

    for (var i = 1; i < TEST_CHILD_COUNT; i++) {
      await sleep(5000);
      await createComponent(`Component${i}`);
      await addChildComponent(`Component${i - 1}`, `Component${i}`);
      log('Added Component ', i);
      await sleep(5000);
      await packager.fetchBundle();
      addResult(i, hrtimer.results[i]);
    }
  });

});
