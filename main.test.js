const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, fireEvent } = require("@testing-library/dom");

beforeEach(() => localStorage.clear());

beforeEach(() => {
  document.body.innerHTML = initialHtml;

  jest.resetModules();
  require("./main");
});


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
