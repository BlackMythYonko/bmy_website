// ########################################### VARIABLES ##########################################

window.App = window.App || {};

// ########################################### FUNCTIONS ##########################################

App.attachListeners = function() 
{
    // Variables
    const fileInputImportItems = document.querySelector('#fileInputImportItems');

    // Add File Input Import Items listener
    fileInputImportItems.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            App.importItemsFromFile(file);
            fileInputImportItems.value = "";
        }
    });
}

App.openPopupConfirmDeletAllItems = function() 
{
    // Create popup with delete item callback
    const popup = new App.PopupConfirmDeleteAllItems();
    popup.open();
}

App.openPopupConfirmDeleteItem = function(itemIndex) 
{
    // Create popup with delete item callback
    const popup = new App.PopupConfirmDeleteItem(App.items, itemIndex);
    popup.open();
}

App.openPopupItemForm = function(itemIndex) 
{
    // Create popup with update item callback
    const popup = new App.PopupItemForm(App.items, itemIndex,
        (i, updatedItem) => {App.updateItem(i, updatedItem);}
    )
    popup.open();
}

App.onInputSearchItemChanged = function()
{
    const searchInput = document.querySelector('#item-search');
    if (searchInput) {
        App.itemFilters.name = searchInput.value.trim();
        App.updateFilteredItems();
        App.renderItems();
    }
}

App.renderItems = function() 
{
    // Variables
    const list = document.getElementById("itemsList");
    const reversedItems = App.filteredItems.slice().reverse();

    // Loop on each item and add item-card
    list.innerHTML = reversedItems.map((item, reversedIndex) => `
        <div class="item-card" onclick="App.openPopupItemForm(${App.items.length - 1 - reversedIndex})">
            <div class="icon">${item.icon}</div>
            <div class="name">${item.name}</div>
            <div class="category">${item.category}</div>
            <button class="delete-item-btn" onclick="event.stopPropagation(); App.openPopupConfirmDeleteItem(${App.items.length - 1 - reversedIndex})">🗑️</button>
        </div>
    `).join("");
}