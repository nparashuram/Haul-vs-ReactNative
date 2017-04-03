import fs from 'fs';
import path from 'path';

import debug from 'debug';
const log = debug('hvrn:patch');

import { dirs } from './constants';
import promisify from './promisify';

export default async function (name, patches) {
  let fileName = path.join(dirs.testAppBin, name);
  let data = await promisify(fs.readFile, fs, fileName, 'utf-8');
  patches.forEach(({ pattern, code }) => {
    if (data.indexOf(code) !== -1) {
      log(`Looks like code already injected in ${name} for ${pattern}`);
    } else {
      data = data.replace(pattern, `${code}${pattern}`);
    }
  });
  return await promisify(fs.writeFile, fs, fileName, data, 'utf-8');
}
