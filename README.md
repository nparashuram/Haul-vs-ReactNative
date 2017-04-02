# React Native packager or Haul ? 

An experiment to determine the performance characteristics of the stock React Native packages vs Webpack based [Haul](https://github.com/callstack-io/haul/). 

## Manual Profiling

1. Download this repo
2. Install node dependencies using `npm install`
3. Run `npm test`
4. Run `cd tmp/react_native_app`
5. To get the transform time for React Native app, run `react-native start --resetCache`.
6. To see transform time for Haul, run `haul start --platform ios`. 

These show the first transform times for each packager. To see how they react to changes, change `App.js` file. Note that for React Native packager to trigger a re-transform, you may need to fetch the bundle again using `curl http://localhost:8081/index.ios.bundle`

## Automated testing

Running these test automatically, multiple times is work in progress, and the reason why this project is being built. Checkout `src/cases` for the various test cases.
The goal is to run the transform multiple times, with and without the cache, adding multiple modules, etc. 