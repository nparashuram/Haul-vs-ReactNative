import fs from 'fs-extra';
import path from 'path';

import promisify from './promisify';
import patch from './patch';
import { dirs } from './constants';

export async function createComponent(componentName) {
  let componentBlueprint = await promisify(fs.readFile, fs, path.join(dirs.testAppSrc, 'Component0.js'), 'utf-8');
  componentBlueprint = componentBlueprint.replace('__ID__', componentName).replace('__RAND__', '' + Math.random() + new Date());
  await promisify(fs.writeFile, fs, path.join(dirs.testAppBin, `${componentName}.js`), componentBlueprint, 'utf-8');
}

export async function addChildComponent(component, child) {
  await patch(`${component}.js`, [{
    pattern: '//Import:End',
    code: `import ${child} from './${child}.js'
    `
  }, {
    pattern: '{/*Child_Components:End*/}',
    code: `<${child}/>
    `
  }]);
}
