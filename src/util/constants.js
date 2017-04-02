import path from 'path';

const tmp = path.join(__dirname, '../..', 'tmp');
const testAppSrc = path.join(__dirname, '../..', 'testApp');
const testAppBin = path.join(tmp, 'react_native_app');

export const dirs = { tmp, testAppBin, testAppSrc };