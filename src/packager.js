import fs from 'fs-extra';
import path from 'path';
import child_process from 'child_process';
import readline from 'readline';

import request from 'request';

import { dirs } from './util/constants';
import promisify, { TimedPromise } from './util/promisify';


import debug from 'debug';
const log = debug('hvrn:packager');
const childLog = debug('hvrn:RN');

async function waitForPackager(cmd, args, opts, triggerLine) {
  log('Starting packager ', cmd, args);
  return TimedPromise((resolve, reject) => {
    let child = child_process.fork(cmd, args, { ...opts, silent: false, stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

    const rl = readline.createInterface({ input: child.stdout });
    rl.on('line', line => {
      childLog(line);
      if (line.indexOf(triggerLine) >= 0) {
        log('Packager ready', cmd);
        resolve(child);
      }
    });
  }, 30000);
}

async function haulPackager(shouldResetCache = true, dev = true, minify = false, platform = 'ios') {
  if (shouldResetCache) {
    await promisify(fs.remove, fs, path.join(dirs.testAppBin, '.happypack'));
  }
  let packager = await waitForPackager(
    'node_modules/haul-cli/bin/cli',
    ['start', `--platform=${platform}`, `--dev=${dev}`, `--minify=${minify}`],
    { cwd: dirs.testAppBin },
    'Haul is now bundling your React Native app, starting from:'
  );
  packager.fetchBundle = async () => promisify(request, null, `http://localhost:8081/index.${platform}.bundle?platform=${platform}&dev=${dev}&hot=false&minify=${minify}`);
  return packager;
}

async function reactNativePackager(shouldResetCache = true, dev = true, minify = false, platform = 'ios') {
  let packager = await waitForPackager(
    'node_modules/react-native/local-cli/cli.js',
    ['start', shouldResetCache ? '--reset-cache' : ''],
    { cwd: dirs.testAppBin },
    'Loading dependency graph, done.'
  );
  packager.fetchBundle = async () => promisify(request, null, `http://localhost:8081/index.${platform}.bundle?platform=${platform}&dev=${dev}&hot=false&minify=${minify}`);
  return packager;
}

export default {
  haul: { start: haulPackager },
  reactNative: { start: reactNativePackager }
}