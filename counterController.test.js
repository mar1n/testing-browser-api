const { counterValue, addValue } = require("./counterController.js");

beforeEach(() => counterValue.counter = 0);

describe("Counter", () => {
  test("add value", () => {
      addValue();
      expect(counterValue.counter).toEqual(1);
  });
  test("add multiple times", () => {
      addValue();
      addValue();
      addValue();
      expect(counterValue.counter).toEqual(3);
  });
});
