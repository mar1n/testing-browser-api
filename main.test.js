const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, fireEvent } = require("@testing-library/dom");
const { clearHistoryHook, detachPopstateHandlers } = require("./testUtils");

beforeEach(clearHistoryHook);

beforeEach(() => localStorage.clear());

beforeEach(() => {
  document.body.innerHTML = initialHtml;
  jest.resetModules();
  require("./main");
  jest.spyOn(window, "addEventListener");
});

afterEach(detachPopstateHandlers);

test("persists items between sessions", () => {
  const itemField = screen.getByPlaceholderText("Item name");
  fireEvent.input(itemField, {
    target: { value: "cheesecake" },
    bubbles: true,
  });

  const quantityField = screen.getByPlaceholderText("Quantity");
  fireEvent.input(quantityField, { target: { value: "6" }, bubbles: true });

  const submitBtn = screen.getByText("Add to inventory");
  fireEvent.click(submitBtn);

  const itemListBefore = document.getElementById("item-list");
  expect(itemListBefore.childNodes).toHaveLength(1);

  expect(
    getByText(itemListBefore, "cheesecake - Quantity: 6")
  ).toBeInTheDocument();

  document.body.innerHTML = initialHtml;
  jest.resetModules();
  require("./main");

  const itemListAfter = document.getElementById("item-list");
  expect(itemListAfter.childNodes).toHaveLength(1);
  expect(
    getByText(itemListAfter, "cheesecake - Quantity: 6")
  ).toBeInTheDocument();
});

describe("counter", () => {
  test("undo counter ", (done) => {
    const counterInput = screen.getByPlaceholderText("input-counter");
    const buttonCounter = document.getElementById("button-plus")
    fireEvent.input(counterInput, {
      target: { value: 1 },
      bubbles: true,
    });

    fireEvent.click(buttonCounter);

    expect(history.state).toEqual({ counter: 1});
    window.addEventListener("popstate", () => {
      const counterField = document.getElementById("counter-value");
      expect(counterField.innerHTML).toEqual("0");
      done();
    });

    fireEvent.click(document.getElementById("button-minus"));
  });
});

// describe("adding items", () => {

//   test("undo to empty list", () => {
//     const itemField = screen.getByPlaceholderText("Item name");
//     const submitBtn = screen.getByText("Add to inventory");
//     fireEvent.input(itemField, {
//       target: { value: "cheesecake" },
//       bubbles: true,
//     });

//     const quantityField = screen.getByPlaceholderText("Quantity");
//     fireEvent.input(quantityField, {
//       target: { value: "6" },
//       bubbles: true,
//     });

//     fireEvent.click(submitBtn);

//     expect(history.state).toEqual({ inventory: { cheesecake: 6 } });
//     window.addEventListener("popstate", () => {
//       const itemList = document.getElementById("item-list");
//       expect(itemList).toBeEmptyDOMElement();
//       done();
//     });
//     fireEvent.click(screen.getByText("Undo"));
//   });

//   test("undo to one item", (done) => {
//     const itemField = screen.getByPlaceholderText("Item name");
//     const quantityField = screen.getByPlaceholderText("Quantity");
//     const submitBtn = screen.getByText("Add to inventory");

//     fireEvent.input(itemField, {
//       target: { value: "cheesecake" },
//       bubbles: true,
//     });
//     fireEvent.input(quantityField, {
//       target: { value: "6" },
//       bubbles: true,
//     });
//     fireEvent.click(submitBtn);

//     fireEvent.input(itemField, {
//       target: { value: "carrot cake" },
//       bubbles: true,
//     });
//     fireEvent.input(quantityField, {
//       target: { value: "5" },
//       bubbles: true,
//     });
//     fireEvent.click(submitBtn);
//     window.addEventListener("popstate", () => {
//       const itemList = document.getElementById("item-list");
//       expect(itemList.children).toHaveLength(1);
//       expect(
//         getByText(itemList, "cheesecake - Quantity: 6")
//       ).toBeInTheDocument();
//       done();
//     });
//     fireEvent.click(screen.getByText("Undo"));
//   });
// });

test("adding items through the form", () => {
  screen.getByPlaceholderText("Item name").value = "cheesecake";
  screen.getByPlaceholderText("Quantity").value = "6";

  const event = new Event("submit");
  const form = document.getElementById("add-item-form");
  form.dispatchEvent(event);

  const itemList = document.getElementById("item-list");
  expect(getByText(itemList, "cheesecake - Quantity: 6")).toBeInTheDocument();
});

describe("item name validation", () => {
  test("entering valid item names", () => {
    const itemField = screen.getByPlaceholderText("Item name");
    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });

    expect(screen.getByText("cheesecake is valid!")).toBeInTheDocument();
  });
  test("entering wrong item names", () => {
    const itemField = screen.getByPlaceholderText("Item name");
    fireEvent.input(itemField, {
      target: { value: "carrot" },
      bubbles: true,
    });

    expect(screen.getByText("carrot is not a valid item.")).toBeInTheDocument();
  });
  test("entering valid item names fireEvent", () => {
    const itemField = screen.getByPlaceholderText("Item name");

    fireEvent.input(itemField, {
      target: { value: "cheesecake" },
      bubbles: true,
    });

    expect(screen.getByText("cheesecake is valid!")).toBeInTheDocument();
  });
});
