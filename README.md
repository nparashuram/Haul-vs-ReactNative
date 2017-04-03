# React Native packager or Haul ? 

An experiment to determine the performance characteristics of the stock React Native packages vs Webpack based [Haul](https://github.com/callstack-io/haul/). 

## Automated testing

To run all the test cases under `src/cases`, clone this repo, run `npm install` and then `npm test`. To view detailed logs for the tests, ensure that you set an environment variable `export DEBUG='hvrn:*'`.

The results are available in `_results.json`. The tests can be run multiple times to aggregate the results in the json file. 


## Manual Profiling

1. Download this repo
2. Install node dependencies using `npm install`
3. Run `npm test`
4. Run `cd tmp/react_native_app`
5. To get the transform time for React Native app, run `react-native start --resetCache`.
6. To see transform time for Haul, run `haul start --platform ios`. 

These show the first transform times for each packager. To see how they react to changes, change `App.js` file. Note that for React Native packager to trigger a re-transform, you may need to fetch the bundle again using `curl http://localhost:8081/index.ios.bundle`

