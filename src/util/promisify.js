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