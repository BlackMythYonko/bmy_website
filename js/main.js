// ########################################### VARIABLES ##########################################

window.App = window.App || {};

// ########################################### FUNCTIONS ##########################################

App.openPopupConfirmDeleteItem = function(index) 
{
    // Create popup with delete item callback
    const popup = new App.PopupConfirmDeleteItem(App.items, index, 
        (i) => {App.deleteItem(i);}
    );
    popup.open();
}

App.openPopupItemForm = function(index) 
{
    // Create popup with update item callback
    const popup = new App.PopupItemForm(App.items, index,
        (i, updatedItem) => {App.updateItem(i, updatedItem);}
    )
    popup.open();
}

App.renderItems = function() 
{
    // Variables
    const list = document.getElementById("itemsList");
    const reversedItems = App.items.slice().reverse();

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