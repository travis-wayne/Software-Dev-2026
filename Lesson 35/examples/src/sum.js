function sum(a, b) {
  return a + b;
}

// In standard ES modules or CommonJS, we would export this.
// For the sake of this Jest test, we'll use CommonJS syntax as Jest defaults to it.
module.exports = sum;
