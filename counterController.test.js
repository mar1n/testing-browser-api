const { counterValue, addValue } = require("./counterController.js");

beforeEach(() => counterValue.counter = 0);

describe("Counter", () => {
  test("add value", () => {
      addValue(2);
      expect(counterValue.counter).toEqual(2);
  });
  test("add multiple times", () => {
      addValue(2);
      addValue(4);
      addValue(4);
      expect(counterValue.counter).toEqual(10);
  });
});
