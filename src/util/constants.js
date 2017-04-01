import path from 'path';

const tmp = path.join(__dirname, '../..', 'tmp');
const testAppSrc = path.join(__dirname, '../..', 'testApp');
const testAppBin = path.join(tmp, 'testApp');

export const dirs = { tmp, testAppBin, testAppSrc };