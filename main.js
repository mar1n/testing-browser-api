const { handleAddItem, checkFormValues, updateItemList } = require("./domController");
const { data } = require("./inventoryController");

const form = document.getElementById("add-item-form");
form.addEventListener("submit", handleAddItem);
form.addEventListener("input", checkFormValues);

checkFormValues();

const storedInventory = JSON.parse(localStorage.getItem("inventory"));

if(storedInventory) {
    data.inventory = storedInventory;
    updateItemList(data.inventory);
}
