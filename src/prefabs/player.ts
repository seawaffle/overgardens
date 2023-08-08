import { Entity } from "../components";

export const Player: Entity = {
    "name": "Player",
    "renderable": {
        "glyph": {
            "character": "@",
            "fg": "yellow"
        },
        "renderOrder": 1
    },
    "blocksTile": true,
    "player": true,
    "mobile": true,
    "viewshed": {
        "range": 7,
        "dirty": true
    },
    "initiative": 0
}