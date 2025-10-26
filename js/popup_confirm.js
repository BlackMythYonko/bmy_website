// Variables
window.App = window.App || {};

// Class: PopupConfirm
App.PopupConfirm = class 
{
    // ######################################## CONSTRUCTOR #######################################

    constructor(popupID, text, buttonClass, buttonText, onConfirmCallback)
    {
        this.popupID = popupID;
        this.text = text;
        this.buttonClass = buttonClass;
        this.buttonText = buttonText;
        this.onConfirmCallback = onConfirmCallback;
        this.popup = null;
    }

    // ###################################### PUBLIC METHODS ######################################

    open() 
    {
        // Create popup-container
        this.popup = document.createElement("div");
        this.popup.className = "popup-container";

        // Add popup content
        this.popup.innerHTML = `
            <div class="popup" id="${this.popupID}">
                <div class="popup-title">Confirm</div>
                <p>${this.text}</p>
                <div class="popup-buttons">
                    <button id="cancel-btn">Cancel</button>
                    <button class="${this.buttonClass}" id="confirm-btn">${this.buttonText}</button>
                </div>
            </div>
        `;

        // Add popup to body
        document.body.appendChild(this.popup);

        // Attach listeners
        this.#attachListeners();
    }

    // ###################################### PRIVATE METHODS #####################################

    #attachListeners() 
    {
        // Add Cancel Button listener
        this.popup.querySelector("#cancel-btn").addEventListener("click", () => {
            this.popup.remove();
        });

        // Add Confirm Button listener
        this.popup.querySelector("#confirm-btn").addEventListener("click", () => {
            if (typeof this.onConfirmCallback === "function") {
                this.onConfirmCallback();
            }
            this.popup.remove();
        });
    }
}

// Class: PopupConfirmDeleteItem
App.PopupConfirmDeleteItem = class extends App.PopupConfirm
{
    // ######################################## CONSTRUCTOR #######################################

    constructor(items, itemIndex)
    {
        const item = items[itemIndex];
        super(
            "popup-confirm-delete-item",
            `Are you sure you want to delete the item <strong>"${item.name} ${item.icon}"</strong> ?
            This Action is irreversible.`,
            "delete-btn",
            "Delete",
            () => {App.deleteItem(itemIndex);}
        );
    }
};

// Class: PopupConfirmDeleteAllItems
App.PopupConfirmDeleteAllItems = class extends App.PopupConfirm
{
    // ######################################## CONSTRUCTOR #######################################

    constructor()
    {
        super(
            "popup-confirm-delete-item",
            `Are you sure you want to delete all items ?<br>
            This Action is irreversible.</br>`,
            "delete-btn",
            "Delete All",
            () => {App.deleteAllItems();}
        );
    }
}
