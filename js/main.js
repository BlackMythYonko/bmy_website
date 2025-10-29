// ########################################### VARIABLES ##########################################

window.App = window.App || {};
App.itemActionMenuID = null;

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

    // Add click event: close item action menu
    window.addEventListener("click", (event) => {
        const menu = document.getElementById("#item-action-menu");
        const btn = event.target.closest(".action-btn");
        if (!btn && !menu.contains(event.target)) {
            App.closeItemActionMenu();
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
    const searchInput = document.querySelector("#item-search-filter");
    if (searchInput) {
        App.itemFilters.name = searchInput.value.trim();
        App.updateFilteredItems();
        App.renderItems();
    }
}

App.onCategoryFilterChanged = function()
{
    const categoryFilter = document.querySelector("#category-filter");
    if (categoryFilter) {
        App.itemFilters.category = categoryFilter.value;
        App.updateFilteredItems();
        App.renderItems();
    }
}

App.onRarityFilterChanged = function()
{
    const rarityFilter = document.querySelector("#rarity-filter");
    if (rarityFilter) {
        App.itemFilters.rarity = rarityFilter.value;
        App.updateFilteredItems();
        App.renderItems();
    }
}

App.toggleItemActionMenu = function(button, itemID)
{
    // Variables
    const container = document.getElementById("#item-action-menu-container");
    const menu = document.getElementById("#item-action-menu");
    
    // Close all other menus
    document.querySelectorAll(".item-action-menu.show").forEach(openMenu => {
        if (openMenu !== menu) {
            openMenu.classList.remove("show");
        }
    });

    // Clear all active cards
    App.clearActiveItemsCards();

    // Handle show menu
    if (container.classList.toggle("show")) {
        App.itemActionMenuID = itemID

        // Active item card
        const itemCard = button.closest(".item-card");
        itemCard.classList.add("active");

        // Set menu pos
        const rect = button.getBoundingClientRect();
        menu.style.top = `${rect.bottom - button.offsetHeight + window.scrollY}px`;
        menu.style.left = `${rect.right + window.scrollX + 5}px`;
    }
    // Handle hide menu
    else {
        App.itemActionMenuID = null
    }
}

App.closeItemActionMenu = function() {
    App.clearActiveItemsCards();
    document.getElementById("#item-action-menu-container").classList.remove("show");
    currentItemId = null;
}

App.clearActiveItemsCards = function() {
    document.querySelectorAll(".item-card.active").forEach(el => {
    el.classList.remove("active");
    });
}

App.renderItems = function() 
{
    // Variables
    const list = document.getElementById("itemsList");
    const reversedItems = App.filteredItems.slice().reverse();

    // Loop on each item and add item-card
    list.innerHTML = reversedItems.map((item, reversedIndex) => `
        <div class="item-card" data-rarity="${item.rarity}" onclick="App.openPopupItemForm(${App.items.length - 1 - reversedIndex})">
            <div class="icon">${item.icon}</div>
            <div class="name">${item.name}</div>
            <div class="category">${item.category}</div>
            <button class="action-item-btn" onclick="event.stopPropagation(); App.toggleItemActionMenu(this, ${App.items.length - 1 - reversedIndex})">⁝</button>
        </div>
    `).join("");
}
