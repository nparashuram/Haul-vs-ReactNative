import readline from 'readline';

import patch from './util/patch';
import debug from 'debug';
const log = debug('hvrn:profiler');

async function noClear() {
  await patch('node_modules/haul-cli/src/commands/start.js', [{
    pattern: `const clear = require('clear');`,
    code: `const clear=function(){};//`
  }]);
}

export class HighResolutionTimer {
  results = []
  static triggerLine = '<<< ===== Bundle Time ====='

  record(packager) {
    const rl = readline.createInterface({ input: packager.stdout });
    rl.on('line', line => {
      if (line.indexOf(HighResolutionTimer.triggerLine) >= 0) {
        this.results.push(parseFloat(line.replace(HighResolutionTimer.triggerLine, '')));
      }
    });
  }

  static async instrument() {
    log('Adding High Resolution timer to React Native');
    await patch('node_modules/react-native/packager/src/Server/index.js', [
      {
        pattern: `debug('Getting bundle for request');`,
        code: `
        var  __start_time__ = process.hrtime();
      `
      }, {
        pattern: `if (requestType === 'bundle')`,
        code: `
        var diff = process.hrtime(__start_time__);
        console.log("${HighResolutionTimer.triggerLine}", (diff[0] * 1e9 + diff[1])/1e9);
        __start_time__ = null;
        `
      }]
    );

    log('Adding High Resolution timer to Haul');
    await noClear();
    await patch('node_modules/haul-cli/src/utils/makeReactNativeConfig.js', [
      {
        pattern: `const webpack = require('webpack');`,
        code: `
      var __start_time__ = null;
      `
      },
      {
        pattern: 'new ProgressBarPlugin({',
        code: `
        new webpack.ProgressPlugin(function (percent, msg) {
          if (__start_time__ === null) {__start_time__ = process.hrtime();}
          if (percent === 1) {
            var diff = process.hrtime(__start_time__);
            console.log("${HighResolutionTimer.triggerLine}", (diff[0] * 1e9 + diff[1])/1e9);
            __start_time__ = null;
          }
        }),
      `
      }
    ]);
  }
}