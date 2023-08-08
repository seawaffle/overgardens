import { Entity } from "../components";

export let Rat: Entity = {
    "name": "Rat",
    "renderable": {
        "glyph": {
            "character": "r",
            "fg": "white"
        },
        "renderOrder": 1
    },
    "blocksTile": true,
    "mobile": true,
    "viewshed": {
        "range": 5,
        "dirty": true
    },
    "initiative": 2,
}