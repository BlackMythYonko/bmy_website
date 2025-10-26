// Variables
window.App = window.App || {};

// Class
App.PopupConfirmDeleteItem = class 
{
    // ######################################## CONSTRUCTOR #######################################

    constructor(items, itemIndex, onDeleteCallback)
    {
        this.items = items;
        this.itemIndex = itemIndex;
        this.onDeleteCallback = onDeleteCallback;
        this.popup = null;
    }

    // ###################################### PUBLIC METHODS ######################################

    open() 
    {
        // Variables
        const item = this.items[this.itemIndex];

        // Create popup-container
        this.popup = document.createElement("div");
        this.popup.className = "popup-container";

        // Add popup content
        this.popup.innerHTML = `
            <div class="popup" id="popup-confirm-delete">
                <div class="popup-title">Confirm</div>
                <p>
                    Are you sure you want to delete the item <strong>"${item.name} ${item.icon}"</strong> ?
                    This Action is irreversible.
                </p>
                <div class="popup-buttons">
                    <button class="cancel-btn">Cancel</button>
                    <button class="delete-btn">Delete</button>
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
        this.popup.querySelector(".cancel-btn").addEventListener("click", () => {
            this.popup.remove();
        });

        // Add Delete Button listener
        this.popup.querySelector(".delete-btn").addEventListener("click", () => {
            if (typeof this.onDeleteCallback === "function") {
                this.onDeleteCallback(this.itemIndex);
            }
            this.popup.remove();
        });
    }
};