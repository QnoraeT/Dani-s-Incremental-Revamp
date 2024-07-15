"use strict";

function getTaxUpgrade(id) {
    // return player.value.tax.upgrades[id] ?? c.d0;
}

const TAX_UPGRADES = [
    {
        type: 0,
        implemented: false,
        cost: c.d1,
        desc: `Increase PRai's gain exponent from ^${format(c.d0_35, 3)} to ^${format(c.d0_36, 3)}`,
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d2,
        desc: `Weaken Upgrade 1's softcap by ${format(c.d10, 1)}% and delay it's hyper scaling by +${format(c.e2, 0)}.`,
        show: true
    },
    {
        type: 1,
        implemented: false,
        cost(level) {
            let cost = expQuadCostGrowth(level, 1.01, 2, 5, 0, false);
            return cost;
        },
        target(amount) {
            let target = expQuadCostGrowth(amount, 1.01, 2, 5, 0, true);
            return target;
        },
        effect(level) {
            let effect = Decimal.mul(level, c.d0_025);
            return effect;
        },
        desc: `Increase PR2's reward exponent from ${format(c.d1_1, 3)}^ to ${format(/* for some reasons THIS SHIT DOES NOT WORK ?????? this.effect(getTaxUpgrade(2)).add(c.d1_1) */ 0, 3)}^.`,
        show: true
    },
    {
        type: 1,
        implemented: false,
        cost(level) {
            let cost = expQuadCostGrowth(level, 1.01, 2, 5, 0, false);
            return cost;
        },
        target(amount) {
            let target = expQuadCostGrowth(amount, 1.01, 2, 5, 0, true);
            return target;
        },
        effect(level) {
            let effect = Decimal.pow(c.d1_25, level);
            return effect;
        },
        desc: `Increase Kuaraniai, KShards, and KPower gain by x${format(/* for some reasons THIS SHIT DOES NOT WORK ?????? this.effect(getTaxUpgrade(3))*/ 0, 2)}.`,
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d2,
        desc: `Boost Upgrade 3's base by +${format(c.d0_0025, 4)} and decrease it's linear scaling from ${format(c.d2, 1)} to ${format(c.d1_5, 1)}`,
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d1,
        desc: `Unlock the next Colosseum challenge, and delay Upgrade 3's scaling by +${format(c.d25)}.`,
        show: true
    },
]

function updateAllTax(delta) {
    updateTax("tax", delta);
}

function updateTax(type, delta) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "tax":
            for (let i = 0; i < TAX_UPGRADES.length; i++) {
                if (player.value.tax.upgrades[i] === undefined) { player.value.tax.upgrades[i] = c.d0; }
            }

            tmp.value.taxReq = c.inf;
            tmp.value.taxCan = Decimal.gte(player.value.totalPointsInTax, c.inf);
            tmp.value.taxPending = tmp.value.taxCan ? Decimal.pow(c.e3, Decimal.log(player.value.totalPointsInTax, c.inf).pow(c.d0_75).sub(c.d1)) : c.d0;

            tmp.value.taxPtsEff = Decimal.max(player.value.tax.taxed, 0).add(c.d1).pow(c.d2);
            break;
        default:
            throw new Error(`Taxation area of the game does not contain ${type}`);
    }
}