"use strict";

function updateAllTax(delta) {
    updateTax("tax", delta);
}

function updateTax(type, delta) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "tax":

            break;
        default:
            throw new Error(`Taxation area of the game does not contain ${type}`);
    }

}