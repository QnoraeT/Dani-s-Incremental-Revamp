"use strict";

function getTaxUpgrade(id) {
    return player.value.tax.upgrades[id] ?? c.d0;
}

const TAX_UPGRADES = [
    {
        type: 0,
        implemented: false,
        cost: c.d1,
        desc: `Increase PRai's gain exponent from ^${format(c.d0_35, 3)} to ^${format(c.d0_375, 3)}.`,
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d2,
        desc: `Weaken Upgrade 1's softcap by ${format(c.d5, 1)}% and delay it's hyper scaling by +${format(c.d50, 0)}.`,
        show: true
    },
    {
        type: 1,
        implemented: false,
        cost(level = getTaxUpgrade(2)) {
            let cost = expQuadCostGrowth(level, c.d1_01, c.d2, c.d5, c.d0, false);
            return cost;
        },
        target(amount = player.value.tax.taxed) {
            let target = expQuadCostGrowth(amount, c.d1_01, c.d2, c.d5, c.d0, true);
            return target;
        },
        effect(level = getTaxUpgrade(2)) {
            let effect = Decimal.mul(level, c.d0_025);
            return effect;
        },
        get desc() { return `Increase PR2's reward exponent from ${format(c.d1_1, 3)}^ to ${format(this.effect(getTaxUpgrade(2)).add(c.d1_1), 3)}^.`; },
        show: true
    },
    {
        type: 1,
        implemented: false,
        cost(level = getTaxUpgrade(3)) {
            let cost = expQuadCostGrowth(level, c.d1_01, c.d2, c.d5, c.d0, false);
            return cost;
        },
        target(amount = player.value.tax.taxed) {
            let target = expQuadCostGrowth(amount, c.d1_01, c.d2, c.d5, c.d0, true);
            return target;
        },
        effect(level = getTaxUpgrade(3)) {
            let effect = Decimal.pow(c.d1_25, level);
            return effect;
        },
        get desc() { return `Increase Kuaraniai, KShards, and KPower gain by x${format(this.effect(getTaxUpgrade(3)), 2)}.`; },
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d2,
        desc: `Boost Upgrade 3's base by +${format(c.em3, 4)} and decrease it's linear scaling from ${format(c.e2, 1)} to ${format(c.d10, 1)}.`,
        show: true
    },
    {
        type: 0,
        implemented: false,
        cost: c.d1,
        desc: `Unlock the next Colosseum challenge, and delay Upgrade 3's scaling by +${format(c.d15)}.`,
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
            tmp.value.taxCanDo = Decimal.gte(player.value.totalPointsInTax, c.inf);
            tmp.value.taxPending = tmp.value.taxCanDo ? Decimal.pow(c.e2, Decimal.log(player.value.totalPointsInTax, c.inf).sqrt().sub(c.d1)) : c.d0;

            if (player.value.auto.tax) {
                generate = tmp.value.taxPending.mul(delta);
                player.value.tax.taxed = Decimal.add(player.value.tax.taxed, generate);
                player.value.tax.totalTax = Decimal.add(player.value.tax.totalTax, generate);
            }

            player.value.tax.bestTax = Decimal.max(player.value.tax.bestTax, player.value.tax.taxed);

            tmp.value.taxPtsEff = Decimal.max(player.value.tax.totalTax, 0).add(c.d10).dilate(c.d2).sub(c.d9).pow(c.d2);
            break;
        default:
            throw new Error(`Taxation area of the game does not contain ${type}`);
    }
}