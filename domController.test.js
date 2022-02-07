const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { getByText, screen } = require("@testing-library/dom");

const {
  updateItemList,
  handleAddItem,
  handleUndo,
  handleRedo,
  handlePopstate,
  updateCounter
} = require("./domController");

const { clearHistoryHook, detachPopstateHandlers } = require("./testUtils");

beforeEach(() => {
  document.body.innerHTML = initialHtml;
});

describe("Counter", () => {
  test("update counter element", () => {
    const counterValue = { counter: 1 };
    
    updateCounter(counterValue);

    const counterField = document.getElementById("counter-view");
    expect(getByText(counterField, "1")).toBeInTheDocument();
  });
});

describe("updateItemList", () => {
  beforeEach(() => localStorage.clear());

  test("updates the DOM with the inventory items", () => {
    const inventory = {
      cheesecake: 5,
      "apple pie": 2,
      "carrot cake": 6,
    };
    updateItemList(inventory);

    const itemList = document.getElementById("item-list");
    expect(itemList.childNodes).toHaveLength(3);

    expect(getByText(itemList, "cheesecake - Quantity: 5")).toBeInTheDocument();
    expect(getByText(itemList, "apple pie - Quantity: 2")).toBeInTheDocument();
    expect(
      getByText(itemList, "carrot cake - Quantity: 6")
    ).toBeInTheDocument();
  });

  test("highlighting in red elements whose quantity is below five", () => {
    const inventory = { cheesecake: 5, "apple pie": 2, "carrot cake": 6 };
    updateItemList(inventory);

    expect(screen.getByText("apple pie - Quantity: 2")).toHaveStyle({
      color: "red",
    });
  });

  test("adding a paragraph indicating what was the update", () => {
    const inventory = { cheesecake: 5, "apple pie": 2 };
    updateItemList(inventory);

    expect(
      screen.getByText(
        `The inventory has been updated - ${JSON.stringify(inventory)}`
      )
    ).toBeTruthy();
  });

  test("updates the localStorage with the inventory", () => {
    const inventory = { cheesecake: 5, "apple pie": 2 };
    updateItemList(inventory);

    expect(localStorage.getItem("inventory")).toEqual(
      JSON.stringify(inventory)
    );
  });
});

describe("handleAddItem", () => {
  test("adding items to the page", () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          name: { value: "cheesecake" },
          quantity: { value: "6" },
        },
      },
    };

    handleAddItem(event);

    expect(event.preventDefault.mock.calls).toHaveLength(1);

    const itemList = document.getElementById("item-list");
    expect(getByText(itemList, "cheesecake - Quantity: 6")).toBeInTheDocument();
  });
});

describe("tests with history", () => {
  beforeEach(() => jest.spyOn(window, "addEventListener"));

  afterEach(detachPopstateHandlers);

  beforeEach(clearHistoryHook);

  describe("handleUndo", () => {
    test("going back from a non-initial state", (done) => {
      window.addEventListener("popstate", () => {
        expect(history.state).toEqual(null);
        done();
      });
      let newState = { cheesecake: 5 };
      let newState2 = { cheesecake: 5, "carrot cake": 2 };
      history.pushState({ inventory: { ...newState } }, "title");
      handleUndo();
    });
    test("going back from initial state", () => {
      jest.spyOn(history, "back");
      handleUndo();

      expect(history.back.mock.calls).toHaveLength(0);
    });
  });
  describe("handle Redo", () => {
    test("going forward", done => {
      let newState = { cheesecake: 5 };
      let newState2 = { cheesecake: 5, "carrot cake": 2 };
      history.pushState({ inventory: { ...newState } }, "title");
      history.pushState({ inventory: { ...newState2 } }, "title");
      
      handleUndo();
      handleRedo();
      
      expect(history.state).toMatchObject(expect.objectContaining({ inventory: { ...newState2 } }));
      done();
    });
    test('going forward from initial state', () => {
      jest.spyOn(history, "forward");

      handleRedo();
      expect(history.forward.mock.calls).toHaveLength(0);
    });
  });
  describe("handlePopstate", () => {
    test("updateing the item list with the current state", () => {
      history.pushState(
        { inventory: { cheesecake: 5, "carrot cake": 2 } },
        "title"
      );

      handlePopstate();
      const itemList = document.getElementById("item-list");
      expect(itemList.childNodes).toHaveLength(2);
      expect(
        getByText(itemList, "cheesecake - Quantity: 5")
      ).toBeInTheDocument();
      expect(
        getByText(itemList, "carrot cake - Quantity: 2")
      ).toBeInTheDocument();
    });
  });
});
