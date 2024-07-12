"use strict";

function updateAllTax(delta) {
    updateTax("tax", delta);
}

function updateTax(type, delta) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "tax":
            tmp.value.taxReq = c.inf;
            tmp.value.taxCan = Decimal.gte(player.value.pointsInTax, c.inf);
            tmp.value.taxPending = tmp.value.taxCan ? Decimal.pow(c.e3, Decimal.log(player.value.totalPointsInTax, c.inf).pow(c.d0_75).sub(c.d1)) : c.d0;
            tmp.value.taxNext = tmp.value.taxCan ? tmp.value.taxPending.add(c.d1).floor().log(c.e3).add(c.d1).root(c.d0_75).pow_base(c.inf) : tmp.value.taxReq;
            break;
        default:
            throw new Error(`Taxation area of the game does not contain ${type}`);
    }

}