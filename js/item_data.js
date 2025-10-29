// ########################################### VARIABLES ##########################################

window.App = window.App || {};
App.items = JSON.parse(localStorage.getItem("items")) || [];
App.filteredItems = App.items.slice();
App.itemFilters = {
    name: "",
    category: "",
    rarity: ""
};

// ######################################## PUBLIC METHODS ########################################

App.addDefaultItem = function() 
{
    // Create default item
    const defaultItem = App.createDefaultItem();

    // Validate item
    const result = App.validateSchema(defaultItem)
    if (!result.success) {
        alert(`❌ Error: ${result.message} !`);
        return;
    }

    // Add Item
    App.items.push(defaultItem);
    App.filteredItems.push(defaultItem);
    App.saveItems();
    App.renderItems();
}

App.importItems = function() 
{
    // Create file input
    const fileInput = document.querySelector('#fileInputImportItems');

    // Check file input is valid
    if (fileInput) {
        fileInput.value = '';
        fileInput.click();
    } else {
        console.error("Input file element '#fileInputImportItems' not found");
    }
}

App.importItemsFromFile = function(file) 
{
    // Variables
    const reader = new FileReader();

    // Try to load json file
    reader.onload = (event) => {
        try {

            // Handle Error: Data is not an array
            const importedItems = JSON.parse(event.target.result);
            if (!Array.isArray(importedItems)) {
                alert("❌ Error: The JSON file must contain an array of items");
                return;
            }

            // Handle Error in item
            const validItems = [];
            for (const item of importedItems) {
                const result = App.validateSchema(item, true);
                if (result.success) {
                    validItems.push(item);
                } else {
                    alert(`❌ Erreur in item "${item.name || 'unkown'}": ${result.message}`);
                    return;
                }
            }

            // Save items
            if (validItems.length > 0) {
                App.items.push(...validItems);
                App.filteredItems.push(...validItems);
                App.saveItems();
                App.renderItems();
                alert(`✅ ${validItems.length} item(s) successfully imported`);
            }
            // Handle: No valid items were imported 
            else {
                alert("❌ No valid items were imported");
                return;
            }

        // Handle invalid json file
        } catch (e) {
            alert(`❌ Error: Invalid JSON file: ${e}`);
            return;
        }
    };
    reader.readAsText(file);
}

App.exportItems = function() 
{
    // Variables
    const dataStr = JSON.stringify(App.items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Create file
    link.href = url;
    link.download = "items.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

App.exportItem = function(itemIndex) 
{
    // Variables
    const item = App.items[itemIndex];
    const dataStr = JSON.stringify(item, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Create file
    link.href = url;
    link.download = "item.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

App.createDefaultItem = function() 
{
    // Create default item
    return {

        // IDENTITY
        id: crypto.randomUUID(),
        name: App.schema.items.properties.name.default,
        icon: App.schema.items.properties.icon.default,
        category: App.schema.items.properties.category.default,
        rarity: App.schema.items.properties.rarity.default,

        // DETAILS
        image: App.schema.items.properties.image.default,
        description: App.schema.items.properties.description.default,

        // POSSESS SETTINGS
        is_unique: App.schema.items.properties.is_unique.default,
        max_stack: App.schema.items.properties.max_stack.default,

        // USE SETTINGS
        usable: App.schema.items.properties.usable.default,
        auto_use: App.schema.items.properties.auto_use.default,
        allow_multiple_use: App.schema.items.properties.allow_multiple_use.default,
        is_consumable: App.schema.items.properties.is_consumable.default,
        
        // EFFECTS
        effects: App.schema.items.properties.effects.default,

        // ENABLED
        enabled: App.schema.items.properties.enabled.default,
    };
}

App.saveItems = function() 
{
    localStorage.setItem("items", JSON.stringify(App.items));
}

App.deleteItem = function(itemIndex) 
{
    const item = App.items[itemIndex];
    App.items.splice(itemIndex, 1);
    App.removeItemFromFilter(item);
    App.saveItems();
    App.renderItems();
}

App.deleteAllItems = function()
{
    App.items.length = 0;
    App.filteredItems.length = 0;
    localStorage.removeItem("items");
    App.renderItems();
}

App.updateItem = function(itemIndex, updatedItem) 
{
    App.items[itemIndex] = updatedItem;
    App.updateItemInFilter(itemIndex, updatedItem);
    App.saveItems();
    App.renderItems();
}

App.duplicateItem = function(itemIndex)
{
    // Generate item copy
    const duplicatedItem = JSON.parse(JSON.stringify(App.items[itemIndex]));
    duplicatedItem.id = crypto.randomUUID();
    duplicatedItem.name = `${duplicatedItem.name} Copy`;

    // Validate new item
    const result = App.validateSchema(duplicatedItem, true);
    if (!result.success) {
        alert(`❌ Error in duplicate: ${result.message}`);
        return;
    }

    // Insert after original
    App.items.splice(itemIndex + 1, 0, duplicatedItem);
    App.filteredItems.splice(itemIndex + 1, 0, duplicatedItem);

    // Save items and refresh
    App.saveItems();
    App.renderItems();
}

App.updateItemInFilter = function(itemIndex, updatedItem)
{
    const filteredIndex = App.filteredItems.findIndex(item => item.id === App.items[itemIndex].id);
    if (filteredIndex !== -1) {
        App.filteredItems[filteredIndex] = updatedItem;
    }
}

App.removeItemFromFilter = function(item)
{
    const filteredIndex = App.filteredItems.indexOf(item);
    if (filteredIndex !== -1) {
        App.filteredItems.splice(filteredIndex, 1);
    }
}

App.updateFilteredItems = function()
{
    App.filteredItems = App.items.filter(item => {
        const matchesName = item.name.toLowerCase().includes(App.itemFilters.name.toLowerCase());
        const matchesCategory = !App.itemFilters.category || item.category === App.itemFilters.category;
        const matchesRarity = !App.itemFilters.rarity || item.rarity === App.itemFilters.rarity;
        return matchesName && matchesCategory && matchesRarity;
    });
}
