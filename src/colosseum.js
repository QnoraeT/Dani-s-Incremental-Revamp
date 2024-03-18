"use strict";
/**
 * type
 * 0 = One-Time only
 * 1 = Can complete multiple times (Decimal)
 * 2 = Continouous (Decimal, best)
 */
const COL_CHALLENGES = {
    sd: {
        type: 0,
        num: 1,
        get name() { return `No Kuaraniai`; },
        get goal() { return c.e25; },
        get goalDesc() { return `Reach ${format(this.goal)} Points.`; },
        get desc() { return `All Kuaraniai resources and upgrades are disabled.`; },
        get reward() { return `Unlock another tab in this, and every KPower Upgrade above 10 unlocks a new challenge.`; },
        get cap() { return c.d1; },
        get show() { return true; }
    }
}

function updateAllCol() {
    updateCol("col");
}

function updateCol(type) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "col":
            tmp.value.colPow = c.d0_4;

            i = player.value.kua.best.max(c.e2).div(c.e2).pow(tmp.value.colPow)
            tmp.value.colosseumPowerGeneration = i

            i = player.value.col.power.max(c.e2).log10().mul(c.d20)
            player.value.col.maxTime = i
            break;
        default:
            throw new Error(`Colosseum area of the game does not contain ${type}`);
    }
}