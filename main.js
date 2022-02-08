const { handleAddItem, checkFormValues, updateItemList, handleUndo, handlePopstate, handleAddCounter } = require("./domController");
const { data } = require("./inventoryController");

const form = document.getElementById("add-item-form");
form.addEventListener("submit", handleAddItem);
form.addEventListener("input", checkFormValues);
const undoButton = document.getElementById("undo-button");
undoButton.addEventListener("click", handleUndo);


const buttonCounter = document.getElementById("button-plus");
buttonCounter.addEventListener("click", handleAddCounter);
const buttonMinus = document.getElementById("button-minus");
buttonMinus.addEventListener("click", handleUndo);

checkFormValues();


window.addEventListener("popstate", handlePopstate);

const storedInventory = JSON.parse(localStorage.getItem("inventory"));

if(storedInventory) {
    data.inventory = storedInventory;
    updateItemList(data.inventory);
}
