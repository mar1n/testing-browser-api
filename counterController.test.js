const { counterValue, addValue } = require("./counterController.js");

describe('Counter', () => {
  test('add value', () => {
      addValue();
      expect(counterValue).toEqual(1);
  });
});
