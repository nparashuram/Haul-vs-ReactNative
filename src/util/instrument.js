import fs from 'fs-extra';
import path from 'path';

import debug from 'debug';
const log = debug('hvrn:instrument');

import { dirs } from './constants';
import promisify from './promisify';

export default async function () {
  await patch('node_modules/react-native/packager/src/Server/index.js', [
    {
      pattern: `debug('Getting bundle for request');`,
      code: `
        var __start_time__ = process.hrtime();
      `
    }, {
      pattern: `if (requestType === 'bundle')`,
      code: `
        var diff = process.hrtime(__start_time__);
        console.log("======", (diff[0] * 1e9 + diff[1])/1e9);
        `
    }]
  );

  await patch('node_modules/haul-cli/src/utils/makeReactNativeConfig.js', [
    {
      pattern: `const webpack = require('webpack');`,
      code: `var __start_time__ = null`
    },
    {
      pattern: 'new ProgressBarPlugin({',
      code: `
        new webpack.ProgressPlugin(function (percent, msg) {
          if (__start_time__ === null) {__start_time__ = process.hrtime();}
          if (percent === 1) {
            var diff = process.hrtime(__start_time__);
            console.log("======", (diff[0] * 1e9 + diff[1])/1e9);
            __start_time__ = null;
          }
        }),
      `
    }
  ]);
}


async function patch(name, patches) {
  let fileName = path.join(dirs.testAppBin, name);
  log('Updating file ', fileName);

  let data = await promisify(fs.readFile, fs, fileName, 'utf-8');
  patches.forEach(({ pattern, code }) => {
    if (data.indexOf(code) !== -1) {
      log(`Looks like code already injected in ${name} for ${pattern}`);
    }
    data = data.replace(pattern, `${code}${pattern}`);
  });
  return await promisify(fs.writeFile, fs, fileName, data, 'utf-8');
}