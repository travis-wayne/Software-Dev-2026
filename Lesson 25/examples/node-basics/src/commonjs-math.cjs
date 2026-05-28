/**
 * 🎓 LESSON GUIDE — CommonJS Modules
 *
 * In older Node.js versions (and still very common today), 
 * files share code using the CommonJS format.
 * 
 * - We define functions.
 * - We attach them to the global `module.exports` object so other files can use them.
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Exporting multiple functions as an object
module.exports = {
  add,
  subtract
};
