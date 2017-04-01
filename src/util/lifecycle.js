import fs from 'fs-extra';
import path from 'path';
import child_process from 'child_process';

import debug from 'debug';

import promisify from './promisify';
import { dirs } from './constants';

const log = debug('hvrn:lifecycle');

export async function cleanup() {
  log('Removing Directory', dirs.tmp);
  return await promisify(fs.remove, fs, dirs.tmp);
}

export async function setup() {
  log('Creating Directory', dirs.tmp);
  return await promisify(fs.emptyDir, fs, dirs.tmp);
}

export async function createReactNativeApp() {
  log('Bootstrapping React Native in', dirs.testAppBin);

  await promisify(fs.copy, fs, dirs.testAppSrc, dirs.testAppBin);
  await promisify(child_process.exec, child_process, 'npm install', { cwd: dirs.testAppBin });
  await promisify(child_process.exec, child_process, 'node_modules/.bin/react-native eject', { cwd: dirs.testAppBin });
  await addInstrumentation();
}
