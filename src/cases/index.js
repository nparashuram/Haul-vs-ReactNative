const cases = {};
[
  require('./adding-one-component')
].forEach(c => cases[c.default.name] = c.default.fn);

export default cases;