// Variables
window.App = window.App || {};

// Class
App.PopupItemForm = class 
{
    // ######################################## CONSTRUCTOR #######################################

    constructor(items, itemIndex, onUpdateCallback)
    {
        this.items = items;
        this.itemIndex = itemIndex;
        this.onUpdateCallback = onUpdateCallback;
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
            <div class="popup" id="popup-item-form">
                <div class="popup-title">Edit Item</div>
                <div class="form-container" id="itemFormContainer"></div>
                <div class="popup-buttons">
                    <button class="cancel-btn">Cancel</button>
                    <button type="submit" form="editItemForm" class="confirm-btn">Confirm</button>
                </div>
            </div>
        `;
        
        // Add popup to body
        document.body.appendChild(this.popup);

        // Add render form
        const container = this.popup.querySelector("#itemFormContainer");
        this.#renderForm(container);

        // Attach listeners
        this.#attachListeners();
    }

    // ###################################### PRIVATE METHODS #####################################

    // ----------------------------------- General Form Methods -----------------------------------

    #renderForm(container) 
    {
        // Variables
        const item = this.items[this.itemIndex];

        // Add form content
        container.innerHTML = `
            <form id="editItemForm">

                <form-label>🪪 Identity</form-label>
                <form-group>
                    <label>ID</label>
                    <input type="text" value="${item.id}" disabled>
                </form-group>

                <form-group>
                    <label>Name</label>
                    <input type="text" id="name" value="${item.name}" required>
                </form-group>

                <form-group>
                    <label>Icon</label>
                    <input type="text" id="icon" value="${item.icon}" required>
                </form-group>

                <form-group>
                    <label>Category</label>
                    <select id="category" required>
                        <option value="Consommable" ${item.category === "Consommable" ? "selected" : ""}>Consommable</option>
                        <option value="Pet" ${item.category === "Pet" ? "selected" : ""}>Pet</option>
                        <option value="Skin" ${item.category === "Skin" ? "selected" : ""}>Skin</option>
                    </select>
                </form-group>

                <form-group>
                    <label>Rarity</label>
                    <select id="rarity" required>
                        <option value="Common" ${item.rarity === "Common" ? "selected" : ""}>⬜ Common</option>
                        <option value="Uncommon" ${item.rarity === "Uncommon" ? "selected" : ""}>🟩 Uncommon</option>
                        <option value="Rare" ${item.rarity === "Rare" ? "selected" : ""}>🟦 Rare</option>
                        <option value="Epic" ${item.rarity === "Epic" ? "selected" : ""}>🟪 Epic</option>
                        <option value="Legendary" ${item.rarity === "Legendary" ? "selected" : ""}>🟧 Legendary</option>
                        <option value="Mythic" ${item.rarity === "Mythic" ? "selected" : ""}>🟥 Mythic</option>
                        <option value="Divine" ${item.rarity === "Divine" ? "selected" : ""}>⬛ Divine</option>
                    </select>
                </form-group>


                <form-label>📝 Details</form-label>
                <form-group>
                    <label>Image <optional>(optional)</optional></label>
                    <input type="text" id="image" value="${item.image || ''}">
                </form-group>

                <form-group>
                    <label>Description <optional>(optional)</optional></label>
                    <textarea id="description">${item.description || ''}</textarea>
                </form-group>
                

                <form-label>💼 Possess Settings</form-label>
                <form-group>
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="is_unique" ${item.is_unique ? 'checked' : ''}>
                        Is Unique
                    </label>
                </form-group>

                <form-group id="max_stack_grp" style="display: ${item.is_unique ? 'none' : 'block'}">
                    <label>Max Stack <optional>(0 for no limit)</optional></label>
                    <input type="number" id="max_stack" min="0" value="${item.max_stack}" required>
                </form-group>


                <form-label>👆 Use Settings</form-label>
                <form-group>
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="usable" ${item.usable ? 'checked' : ''}>
                        Usable
                    </label>
                </form-group>

                <form-group id="auto_use_grp" style="display: ${item.usable ? 'block' : 'none'}">
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="auto_use" ${item.auto_use ? 'checked' : ''}>
                        Auto Use
                    </label>
                </form-group>

                <form-group id="allow_multiple_use_grp" style="display: ${item.usable ? 'block' : 'none'}">
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="allow_multiple_use" ${item.allow_multiple_use ? 'checked' : ''}>
                        Allow Multiple Use
                    </label>
                </form-group>

                <form-group id="is_consumable_grp" style="display: ${item.usable ? 'block' : 'none'}">
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="is_consumable" ${item.is_consumable ? 'checked' : ''}>
                        Is Consomable
                    </label>
                </form-group>


                <form-label>✨ Effects <optional>(optional)</optional></form-label>
                <form-group>
                    <div class="effects-group">
                        <button type="button" class="add-effect-btn">➕ Add Effect</button>
                        <div id="effectsList">
                            ${item.effects ? item.effects.map((effect, effectIndex) => this.#renderEffect(effectIndex, effect)).join("") : ""}
                        </div>
                    </div>
                </form-group>


                <form-group>
                    <label class="form-label-checkbox">
                        <input type="checkbox" id="enabled" ${item.enabled ? 'checked' : ''}>
                        Enabled
                    </label>
                </form-group>
            </form>
        `;
    }

    #attachListeners() 
    {
        // Variables
        const form = this.popup.querySelector("#editItemForm");

        // Add Form Submit listener
        form.addEventListener("submit", (event) => {
            this.#handleSubmitCallback(event, form);
        });

        // Add Cancel Button listener
        this.popup.querySelector(".cancel-btn").addEventListener("click", () => {
            this.popup.remove();
        });

        // Add effect button
        this.popup.querySelector(".add-effect-btn").addEventListener("click", () => {
            this.#addEffect();
        });

        // Other listerners
        this.#attachPropertiesListeners(form);
        this.#attachEffectListeners();
    }

    #attachPropertiesListeners(form)
    {
        // Variables
        const isUniqueCheckbox = form.querySelector("#is_unique");
        const usableCheckbox = form.querySelector("#usable");
        const maxStackGrp = form.querySelector("#max_stack_grp");
        const autoUseGrp = form.querySelector("#auto_use_grp");
        const allowMultipleUseGrp = form.querySelector("#allow_multiple_use_grp");
        const isConsumableGrp = form.querySelector("#is_consumable_grp");

        // Add isUniqueCheckbox changed Listener
        isUniqueCheckbox.addEventListener("change", () => {
            maxStackGrp.style.display = isUniqueCheckbox.checked ? "none" : "block";
        });

        // Add isConsumableCheckbox changed Listener
        usableCheckbox.addEventListener("change", () => {
            autoUseGrp.style.display = usableCheckbox.checked ? "block" : "none";
            allowMultipleUseGrp.style.display = usableCheckbox.checked ? "block" : "none";
            isConsumableGrp.style.display = usableCheckbox.checked ? "block" : "none";
        });
    }

    // ----------------------------------- Effects Form Methods -----------------------------------

    #renderEffect(effectIndex, effect) 
    {
        return `
            <div class="effect-item" data-effect-index="${effectIndex}">
                <form-group>
                    <label>Effect Type</label>
                    <select class="effect-type" data-effect-index="${effectIndex}">
                        <option value="equip_wallet_skin" ${effect.type === "equip_wallet_skin" ? "selected" : ""}>Equip Wallet Skin</option>
                        <option value="manage_role" ${effect.type === "manage_role" ? "selected" : ""}>Manage Role</option>
                    </select>
                </form-group>
                <div class="effect-params" id="effect-params-${effectIndex}">
                    ${this.#renderEffectFields(effect.type, effect.params || {})}
                </div>
                <button type="button" class="delete-btn" data-effect-index="${effectIndex}">🗑️</button>
            </div>
        `;
    }

    #renderEffectFields(effectType, params) 
    {
        // Switch on effect type
        switch (effectType) {

            // EQUIP WALLET SKIN
            case "equip_wallet_skin":
                return `
                    <form-group>
                        <label>Wallet Name</label>
                        <input type="text" class="effect-param-wallet_name" value="${params.wallet_name || ""}" required>
                    </form-group>
                `;

            // MANAGE ROLE
            case "manage_role":
                return `
                    <form-group>
                        <label>Action</label>
                        <select class="effect-param-action" required>
                            <option value="add" ${params.action === "add" ? "selected" : ""}>Add</option>
                            <option value="remove" ${params.action === "remove" ? "selected" : ""}>Remove</option>
                        </select>
                    </form-group>

                    <form-group>
                        <label>Role ID</label>
                        <input type="number" class="effect-param-id" value="${params.id || ""}" required>
                    </form-group>
                `;

            // DEFAULT
            default:
                return "";
        }
    }

    #addEffect() {
        const effectsList = this.popup.querySelector("#effectsList");
        const effectIndex = effectsList.querySelectorAll(".effect-item").length;
        const newEffect = { type: "equip_wallet_skin", params: { wallet_name: "" } };
        effectsList.insertAdjacentHTML("beforeend", this.#renderEffect(effectIndex, newEffect));
        this.#attachEffectListeners();
    }

    #deleteEffect(effectIndex) {
        const effectItem = this.popup.querySelector(`.effect-item[data-effect-index="${effectIndex}"]`);
        if (effectItem) {
            effectItem.remove();
            this.#reindexEffects();
            this.#attachEffectListeners();
        }
    }

    #updateEffectFields(select) {
        const effectIndex = parseInt(select.dataset.effectIndex);
        const effectType = select.value;
        const effectParamsContainer = this.popup.querySelector(`#effect-params-${effectIndex}`);
        let params = {};
        switch (effectType) {

            // EQUIP WALLET SKIN
            case "equip_wallet_skin":
                params = { wallet_name: "" };
                break;

            // MANAGE ROLE
            case "manage_role":
                params = { action: "add", id: "" };
                break;
        }
        effectParamsContainer.innerHTML = this.#renderEffectFields(effectType, params);
    }

    #reindexEffects() 
    {
        // Get all effects items
        const effectItems = this.popup.querySelectorAll(".effect-item");

        // Update index
        effectItems.forEach((item, effectIndex) => {
            item.setAttribute("data-effect-index", effectIndex);
            item.querySelector(".effect-type").setAttribute("data-effect-index", effectIndex);
            item.querySelector(".effect-params").id = `effect-params-${effectIndex}`;
            item.querySelector(".delete-btn").setAttribute("data-effect-index", effectIndex);
        });
    }

    #attachEffectListeners() 
    {
        // Add Effect Type changed listener
        const effectTypes = this.popup.querySelectorAll(".effect-type");
        effectTypes.forEach(select => {
            select.removeEventListener("change", this.#updateEffectFields);
            select.addEventListener("change", (e) => this.#updateEffectFields(e.target));
        });

        // Add Effect Delete Button listener
        const deleteButtons = this.popup.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.removeEventListener("click", this.#deleteEffect);
            button.addEventListener("click", (e) => this.#deleteEffect(parseInt(e.target.dataset.effectIndex)));
        });
    }

    // ------------------------------------ Submit Form Methods -----------------------------------

    #handleSubmitCallback(event, form)
    {
        // Prevent default
        event.preventDefault();

        // Create updated item
        const updatedItem = this.#createUpdatedItem(form);

        // Validate item
        const result = App.validateSchema(updatedItem);
        if (result.success) {
            if (typeof this.onUpdateCallback === "function") {
                this.onUpdateCallback(this.itemIndex, updatedItem);
            }
            this.popup.remove();
        }
        // Handle non valid schema 
        else {
            alert(`❌ Error: ${result.message} !`);
        }
    }

    #createUpdatedItem(form)
    {
        const effects = this.#createItemEffects(form);
        return {
            // IDENTITY
            id: this.items[this.itemIndex].id,
            name: form.querySelector("#name").value,
            icon: form.querySelector("#icon").value,
            category: form.querySelector("#category").value,
            rarity: form.querySelector("#rarity").value,

            // DETAILS
            image: form.querySelector("#image").value || null,
            description: form.querySelector("#description").value || null,

            // POSSESS SETTINGS
            is_unique: form.querySelector("#is_unique").checked,
            max_stack: parseInt(form.querySelector("#max_stack").value),

            // USE SETTINGS
            usable: form.querySelector("#usable").checked,
            auto_use: form.querySelector("#auto_use").checked,
            allow_multiple_use: form.querySelector("#allow_multiple_use").checked,
            is_consumable: form.querySelector("#is_consumable").checked,

            // EFFECTS
            effects: effects.length > 0 ? effects : [],

            // ENABLED
            enabled: form.querySelector("#enabled").checked
        };
    }

    #createItemEffects(form)
    {
        // Loop on each effect item
        const effects = [];
        const effectItems = form.querySelectorAll(".effect-item");
        effectItems.forEach((effectItem) => {
            const effectType = effectItem.querySelector(".effect-type").value;
            let params = null;

            // Switch on effect type
            switch (effectType) {

                // EQUIP WALLET SKIN
                case "equip_wallet_skin":
                    params = {
                        wallet_name: effectItem.querySelector(".effect-param-wallet_name").value
                    };
                    break;

                // MANAGE ROLE
                case "manage_role":
                    params = {
                        action: effectItem.querySelector(".effect-param-action").value,
                        id: parseInt(effectItem.querySelector(".effect-param-id").value)
                    };
                    break;
            }
            effects.push({ type: effectType, params });
        });

        return effects;
    }
};