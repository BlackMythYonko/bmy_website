// ########################################### VARIABLES ##########################################

window.App = window.App || {};
App.schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "array",
    "items": {
        "type": "object",
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
                "enum": ["Consommable", "Skin"],
                "default": "Consommable"
            },
            "image": { 
                "type": ["string", "null"], 
                "minLength": 1,
                "default": null
            },
            "description": { 
                "type": ["string", "null"], 
                "minLength": 1,
                "default": null
            },
            "is_unique": { 
                "type": "boolean",
                "default": false
            },
            "auto_use": { 
                "type": "boolean",
                "default": false
            },
            "is_consumable": { 
                "type": "boolean",
                "default": false 
            },
            "effects": {
                "type": ["array", "null"],
                "items": {
                    "type": "object",
                    "properties": {
                        "type": { 
                            "type": "string", 
                            "enum": ["equip_wallet_skin", "manage_role"]
                        },
                        "params": { 
                            "type": ["object", "null" ]
                        }
                    },
                    "required": ["type"],
                    "oneOf": [
                        {
                            "properties": {
                                "type": { "const": "equip_wallet_skin" },
                                "params": {
                                    "type": "object",
                                    "properties": {
                                        "wallet_name": {
                                            "type": "string",
                                            "minLength": 1
                                        }
                                    },
                                    "required": ["wallet_name"],
                                    "additionalProperties": false
                                }
                            },
                            "required": ["params"],
                            "additionalProperties": false
                        },
                        {
                            "properties": {
                                "type": { "const": "manage_role" },
                                "params": {
                                    "type": "object",
                                    "properties": {
                                        "action": {
                                            "type": "string",
                                            "enum": ["add", "remove"],
                                            "default": "add"
                                        },
                                        "id": {
                                            "type": "integer"
                                        }
                                    },
                                    "required": ["action", "id"],
                                    "additionalProperties": false
                                }
                            },
                            "required": ["params"],
                            "additionalProperties": false
                        }
                    ]
                },
                "default": null
            }
        },
        "required": ["id", "name", "icon", "category", "is_unique", "auto_use", "is_consumable"]
    }
}

// ######################################## PUBLIC METHODS ########################################

App.validateSchema = function(item, checkIsUniqueId = false) 
{
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

    console.log(item);
    return { success: true, message: "OK" };
}
