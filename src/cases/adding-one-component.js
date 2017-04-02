import { createComponent, addChildComponent } from './../util/component';

import { testCase } from './../testRunner';

export default testCase('Adding One Component at a time', (setup, test, cleanup) => {
  test(async (packager, results) => {
    await createComponent('Child1');
    await addChildComponent('App', 'Child1');
    //await results.add(1, await get_hrtime());

    await createComponent('Child2');
    await addChildComponent('App', 'Child2');
    //await results.add(2, await get_hrtime());

    await createComponent('Child3');
    await addChildComponent('App', 'Child3');
    //await results.add(3, await get_hrtime());
  });
});
