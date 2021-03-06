const { addItem, data } = require("./inventoryController");
const { counterValue, addValue } = require("./counterController");

const updateCounter = (counterValue) => {
  const counterField = window.document.getElementById("counter-view");
  
  counterField.innerHTML = "";
  
  const p = window.document.createElement("p");
  p.setAttribute("id", "counter-value")
  p.innerHTML = `${counterValue}`;
  counterField.appendChild(p);
};

const handleAddCounter = (event) => {
  // const { counter } = event.target.element;
  const valuCounter = document.getElementById("input-counter").value;

  addValue(parseInt(valuCounter, 10));
  history.pushState({ counter: counterValue.counter }, "counter");
  updateCounter(counterValue.counter);
};

const updateItemList = (inventory) => {
  if (!inventory === null) return;

  localStorage.setItem("inventory", JSON.stringify(inventory));

  const inventoryList = window.document.getElementById("item-list");

  inventoryList.innerHTML = "";

  Object.entries(inventory).forEach(([itemName, quantity]) => {
    const listItem = window.document.createElement("li");
    listItem.innerHTML = `${itemName} - Quantity: ${quantity}`;

    if (quantity < 5) {
      listItem.className = "almost-soldout";
    }

    inventoryList.appendChild(listItem);
  });

  const inventoryContents = JSON.stringify(inventory);
  const p = window.document.createElement("p");
  p.innerHTML = `The inventory has been updated - ${inventoryContents}`;

  window.document.body.appendChild(p);
};

const handleUndo = () => {
  if (history.state === null) return;
  console.log('test');
  history.back();
};
const handleRedo = () => {
  if (history.state === null) return;
  history.forward();
};

const handleAddItem = (event) => {
  event.preventDefault();

  const { name, quantity } = event.target.elements;
  addItem(name.value, parseInt(quantity.value, 10));

  history.pushState({ inventory: { ...data.inventory } }, document.title);

  updateItemList(data.inventory);
};

const validItems = ["cheesecake", "apple pie", "carrot cake"];
const checkFormValues = () => {
  const itemName = document.querySelector(`input[name="name"]`).value;
  const quantity = document.querySelector(`input[name="quantity"]`).value;

  const itemNameIsEmpty = itemName === "";
  const itemNameIsInvalid = !validItems.includes(itemName);
  const quantityIsEmpty = quantity === "";

  const errorMsg = window.document.getElementById("error-msg");
  if (itemNameIsEmpty) {
    errorMsg.innerHTML = "";
  } else if (itemNameIsInvalid) {
    errorMsg.innerHTML = `${itemName} is not a valid item.`;
  } else {
    errorMsg.innerHTML = `${itemName} is valid!`;
  }

  const submitButton = document.querySelector(`button[type="submit"]`);
  if (itemNameIsEmpty || itemNameIsInvalid || quantityIsEmpty) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};
const handlePopstate = () => {
  //data.inventory = history.state ? history.state.inventory : {};
  counterValue.counter = history.state ? history.state.counter : 0;
  updateCounter(counterValue.counter)
  //updateItemList(data.inventory);
};

module.exports = {
  updateItemList,
  handleAddItem,
  checkFormValues,
  handleUndo,
  handleRedo,
  handlePopstate,
  updateCounter,
  handleAddCounter,
};
