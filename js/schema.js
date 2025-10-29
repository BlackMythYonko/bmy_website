// ########################################### VARIABLES ##########################################

window.App = window.App || {};
App.schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "array",
    "items": {
        "type": "object",
        "required": [
            "id", 
            "name", 
            "icon", 
            "category", 
            "rarity", 
            "image", 
            "description", 
            "is_unique", 
            "max_stack", 
            "usable", 
            "auto_use", 
            "allow_multiple_use", 
            "is_consumable",
            "effects",
            "enabled"
        ],
        "properties": {

            "id": { 
                "type": "string", 
                "minLength": 1,
                "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
            },
            "name": { 
                "type": "string", 
                "minLength": 1,
                "default": "New Item"
            },
            "icon": { 
                "type": "string", 
                "minLength": 1,
                "default": "📦"
            },
            "category": { 
                "type": "string", 
                "enum": ["Consommable", "Pet", "Skin"],
                "default": "Consommable"
            },
            "rarity": { 
                "type": "string", 
                "enum": ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Divine"],
                "default": "Common"
            },

            "image": { 
                "type": ["string", "null"], 
                "default": ""
            },
            "description": { 
                "type": ["string", "null"], 
                "default": ""
            },

            "is_unique": { 
                "type": "boolean",
                "default": false
            },
            "max_stack": {
                "type": "integer",
                "minimum": 0,
                "default": 0
            },

            "usable": { 
                "type": "boolean",
                "default": true
            },
            "auto_use": { 
                "type": "boolean",
                "default": false
            },
            "allow_multiple_use": { 
                "type": "boolean",
                "default": true
            },
            "is_consumable": { 
                "type": "boolean",
                "default": true 
            },

            "effects": {
                "type": ["array", "null"],
                "items": {
                    "type": "object",
                    "required": ["type", "params"],
                    "additionalProperties": false,
                    "properties": {
                        "type": { 
                            "type": "string", 
                            "enum": ["equip_wallet_skin", "manage_role"],
                            "default": "equip_wallet_skin"
                        },
                        "params": { 
                            "type": ["object", "null" ]
                        }
                    },
                    "oneOf": [
                        {
                            "properties": {
                                "type": { "const": "equip_wallet_skin" },
                                "params": {
                                    "type": "object",
                                    "required": ["wallet_name"],
                                    "additionalProperties": false,
                                    "properties": {
                                        "wallet_name": {
                                            "type": "string",
                                            "minLength": 1,
                                            "default": ""
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "properties": {
                                "type": { "const": "manage_role" },
                                "params": {
                                    "type": "object",
                                    "required": ["action", "id"],
                                    "additionalProperties": false,
                                    "properties": {
                                        "action": {
                                            "type": "string",
                                            "enum": ["add", "remove"],
                                            "default": "add"
                                        },
                                        "id": {
                                            "type": "integer",
                                            "default": 0
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "default": []
            },

            "enabled": { 
                "type": "boolean",
                "default": true 
            }
        }
    }
}

// ######################################## PUBLIC METHODS ########################################

App.validateSchema = function(item, checkIsUniqueId = false) 
{
    // Log item
    console.log(item);
    
    // Check required fields
    const required = App.schema.items.required;
    if (!required.every(field => item[field] !== undefined))
        return { success: false, message: "Missing required fields" };

    // Check id validation
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(item.id)) 
        return { success: false, message: "Invalid ID" };

    // Check id uniqueness
    if (checkIsUniqueId && App.items.some(existingItem => existingItem.id === item.id))
        return { success: false, message: "ID already exists" };

    return { success: true, message: "OK" };
}

App.copyJsonSchema = function()
{
    // Get schema text
    const schemaText = JSON.stringify(App.schema, null, 2);

    // Copy text
    navigator.clipboard.writeText(schemaText)
    .then(() => {
        alert("✅ Json schema copied !");
    })
    .catch(error => {
        alert("❌ Error during copying !");
        console.error("Error during copying: ", error);
    });
}
