import fs from 'fs-extra';
import path from 'path';

import debug from 'debug';
const log = debug('hvrn:instrument');

import promisify from './promisify';
import { dirs } from './constants';

export async function createComponent(componentName) {
  log('Creating Component', componentName);
  let componentBlueprint = await promisify(fs.readFile, fs, path.join(dirs.testAppSrc, 'App.js'), 'utf-8');
  componentBlueprint = componentBlueprint.replace('__ID__', componentName);
  await promisify(fs.writeFile, fs, path.join(dirs.testAppBin, `${componentName}.js`), componentBlueprint, 'utf-8');
}

export async function addChildComponent(component, children) {
  if (typeof children === 'string') {
    children = [children];
  }
  log(`Adding ${JSON.stringify(children)} to ${component}`);
  let componentFileName = path.join(dirs.testAppBin, `${component}.js`);
  let componentContent = await promisify(fs.readFile, fs, componentFileName, 'utf-8');

  children.forEach(child => {
    componentContent = componentContent
      .replace('//Import:Start', `//Import:Start\nimport ${child} from './${child}.js'`)
      .replace('{/*Child_Components:Start*/}', `{/*Child_Components:Start*/}\n<${child}/>`);
  });

  await promisify(fs.writeFile, fs, componentFileName, componentContent, 'utf-8');
}
