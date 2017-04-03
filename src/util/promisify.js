export default (fn, context, ...args) => {
  return new Promise((resolve, reject) => {
    fn.apply(context, [...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    }]);
  });
}

export function TimedPromise(fn, timeout) {
  return new Promise((resolve, reject) => {
    fn(resolve, reject);
    setTimeout(() => {
      reject(null);
    }, 30000);
  });
}

export const sleep = (timeout) => new Promise((resolve, reject) => setTimeout(() => resolve(), timeout));