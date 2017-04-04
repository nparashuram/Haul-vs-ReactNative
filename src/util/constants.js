import path from 'path';

const tmp = path.join(__dirname, '../..', 'tmp');
const testAppSrc = path.join(__dirname, '../..', 'testApp');
const testAppBin = path.join(tmp, 'react_native_app');

export const dirs = { tmp, testAppBin, testAppSrc };

export const TEST_CHILD_COUNT = 5;
export const TEST_CHILD_TREE_COUNT = 3;