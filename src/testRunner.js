import debug from 'debug';
const log = debug('hvrn:testRunner');

export function testCase(name, fn) {
  let methods = { setup: () => { }, cleanup: () => { }, test: () => { } };
  let setFn = type => cb => methods[type] = (typeof cb === 'function' ? cb : () => { })

  fn(setFn('setup'), setFn('test'), setFn('cleanup'));
  let { setup, test, cleanup } = methods;

  return {
    name,
    fn: async function () {
      log('Running Case', name);
      await setup();
      await test();
      await cleanup();
    }
  }
}