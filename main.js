const { handleAddItem, checkFormValues, updateItemList, handleUndo, handlePopstate } = require("./domController");
const { data } = require("./inventoryController");

const form = document.getElementById("add-item-form");
form.addEventListener("submit", handleAddItem);
form.addEventListener("input", checkFormValues);

checkFormValues();

const undoButton = document.getElementById("undo-button");
undoButton.addEventListener("click", handleUndo);

window.addEventListener("popstate", handlePopstate);

const storedInventory = JSON.parse(localStorage.getItem("inventory"));

if(storedInventory) {
    data.inventory = storedInventory;
    updateItemList(data.inventory);
}
