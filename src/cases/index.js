const cases = {};
[
  require('./adding-one-component'),
  require('./adding-child-trees')
].forEach(c => cases[c.default.name] = c.default.fn);

export default cases;