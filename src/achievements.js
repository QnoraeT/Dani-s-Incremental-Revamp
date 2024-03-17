"use strict";
const ACH_DEF_COLORS = {
    points: {
        get unable() { return "#ff3333"; },
        get canComplete() { return "#aaaaaa"; },
        get complete() { return "#19ff33"; }
    },
    kua: {
        get unable() { return "#1f0099"; },
        get canComplete() { return "#400077"; },
        get complete() { return "#a019ff"; }
    },
    col: {
        get unable() { return "#8a0037"; },
        get canComplete() { return "#992000"; },
        get complete() { return "#ff2300"; }
    },
    kb: {
        get unable() { return "#2e3b32"; },
        get canComplete() { return "#366d46"; },
        get complete() { return "#7fffa3"; }
    }
}

const ACHIEVEMENT_DATA = {
    rows: 4,
    cols: 8,
    // get status() = if its "canComplete" (true) or "unable" (anything else, this uses the description of why it can't be c.d1), if the achievement is already in player then it will be always marked as "complete"
    0: {
        get name() { return `Starting off?`; },
        get desc() { return `Get ${format(c.d1)} UP1.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return true },
        get status() { return true }
    },
    1: {
        get name() { return `Let me show you how cruel I was with this...`; },
        get desc() { return `Get ${format(c.d20)} UP1.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return true },
        get status() { return true }
    },
    2: {
        get name() { return `Not my progress!`; },
        get desc() { return `Do your first PRai reset.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return true },
        get status() { return true }
    },
    3: {
        get name() { return `Are you rich now?`; },
        get desc() { return `Have at least ${format(c.d10)} PRai.`; },
        get type() { return `points`; },
        get reward() { return `You unlock a new prestige layer, and UP1's scaling starts 2.5 later.`; },
        get show() { return true },
        get status() { return true }
    },
    4: {
        get name() { return `this is stupid cuz its redundant lol`; },
        get desc() { return `Do a PR2 reset once.`; },
        get type() { return `points`; },
        get reward() { return `Increase your number generation by ${format(c.d200)}%.`; },
        get show() { return true },
        get status() { return true }
    },
    5: {
        get name() { return `No! Not again! This is not Distance Incremental!`; },
        get desc() { return `Get your first softcap.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return true },
        get status() { return true }
    },
    6: {
        get name() { return `All that time wasted...`; },
        get desc() { return `Have ${format(c.e18)} points without doing a PRai reset.`; },
        get type() { return `points`; },
        get reward() { return `Your PRai's multiplier goes from 4x -> 10x.`; },
        get show() { return true },
        get status() { return true }
    },
    7: {
        get name() { return `This cannot be endgame.`; },
        get desc() { return `Do a PR2 reset twice.`; },
        get type() { return `points`; },
        get reward() { return `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(this.eff, 3)} weaker.`; },
        get eff() { return player.value.generators.prai.amount.max(c.d10).log10().root(c.d3).sub(c.d1).div(c.d4).add(c.d1) },
        get show() { return true },
        get status() { return true }
    },
    8: {
        get name() { return `Instant gratification.`; },
        get desc() { return `Receive ${format(c.e3)} PRai in a single PRai reset.`; },
        get type() { return `points`; },
        get reward() { return `PR2 requirement is reduced by ${formatPerc(1.5)}.`; },
        get show() { return true },
        get status() { return tmp.value.praiPending.gte(c.e3) ? true : `${format(tmp.value.praiPending)} / ${format(c.e3)} PRai pending` }
    },
    9: {
        get name() { return `What once was part of a bygone era...`; },
        get desc() { return `Do a PR2 reset ${format(c.d4)} times in total.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return player.value.generators.prai.best.gte(c.d10); },
        get status() { return true }
    },
    10: {
        get name() { return `This really is a clone of Distance Incremental!`; },
        get desc() { return `Have at least ${format(c.e2)} UP1.`; },
        get type() { return `points`; },
        get reward() { return `PRai effect is increased by ${format(c.d200)}%.`; },
        get show() { return true },
        get status() { return true }
    },
    11: {
        get name() { return `What even is this thing? Why do I have so little of it?`; },
        get desc() { return `Convert all of your PRai to Kuaraniai.`; },
        get type() { return `kua`; },
        get reward() { return `Your number generation is increased by ${format(c.d200)}%, and you start at ${format(c.d10)} PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    12: {
        get name() { return `Stockpiler`; },
        get desc() { return `Save up ${format(c.e25)} PRai on a Kuaraniai run.`; },
        get type() { return `kua`; },
        get reward() { return `UP2 also boosts number gain at a reduced rate. Currently: ${format(this.eff, 2)}x`; },
        get eff() { 
            let pow = c.d0_2;
            if (player.value.achievements.includes(24)) {
                pow = pow.add(c.d0_1);
            }
            if (player.value.achievements.includes(30)) {
                pow = pow.add(c.d0_05);
            }
            let eff = player.value.generators.upg2.effect.max(c.d1);
            if (player.value.kua.kpower.upgrades >= 7) {
                eff = eff.root(c.d3);
            }
            eff = eff.pow(pow);
            return eff;
        },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    13: {
        get name() { return `You like making progress, don't you?`; },
        get desc() { return `Have ${format(c.d25)} Kuaraniai.`; },
        get type() { return `kua`; },
        get reward() { return `Kuaraniai gain is increased by ${format(c.d50)}%, and KShards boost number generation. Currently: ${format(this.eff, 2)}x`; },
        get eff() { return player.value.kua.kshards.amount.root(c.d3).max(c.d1); },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    14: { // ! Unable 
        get name() { return `Does every incremental game need to have a challenge like this? Probably.`; },
        get desc() { return `Complete Colosseum Challenge 'No Kuaraniai.'`; },
        get type() { return `col`; },
        get reward() { return ``; },
        get show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        get status() { return true }
    },
    15: { 
        get name() { return `This upgrade was unnecessary`; },
        get desc() { return `Have ${format(c.e80)} points without Upgrade 3.`; },
        get type() { return `points`; },
        get reward() { return `Upgrade 3 gets a slight ${format(c.d2, 2)}% boost to effectiveness.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    16: { 
        get name() { return `Quite interesting`; },
        get desc() { return `Get ${format(c.d200)} Upgrade 1 without having over ${format(c.d10)} PRai.`; },
        get type() { return `points`; },
        get reward() { return `Upgrade 1's effectiveness is slightly increased based off of your PRai. Currently: ${format(this.eff.sub(c.d1).mul(c.e2), 3)}%`; },
        get eff() { 
            let eff = player.value.generators.prai.amount
            eff = eff.max(c.d10).log10().cbrt().sub(c.d1).div(c.d200).add(c.d1)
            return eff;
        },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    17: { 
        get name() { return `Actually, these are useless!`; },
        get desc() { return `Reach ${format(c.e24)} Points without any upgrade.`; },
        get type() { return `points`; },
        get reward() { return `All upgrades' cost scaling is slightly slowed down based off of your time in this PRai reset. Currently: ${formatPerc(this.eff, 3)} slower`; },
        get eff() { 
            let eff = player.value.generators.prai.timeInPRai.div(c.d60);
            eff = eff.div(eff.mul(c.d9).add(c.d1)).add(c.d1)
            return eff;
        },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    18: { 
        get name() { return `This softcap won't hurt me!`; },
        get desc() { return `Upgrade 2's effect must reach /${format(c.e50)}.`; },
        get type() { return `points`; },
        get reward() { return `Upgrade 2's softcap is ${format(c.d5)}% weaker.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    19: {
        get name() { return `Make this obsolete, I dare you. >:3`; },
        get desc() { return `Gain ${format(c.d2_5, 2)} Kuaraniai without doing a single PRai reset.`; },
        get type() { return `kua`; },
        get reward() { return `Increase PRai's gain exponent from ^${format(c.d0_25, 3)} to ^${format(c.d0_26, 3)}`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    20: { // ! Unable
        get name() { return `Screw it, we don't need the new mechanics.`; },
        get desc() { return `Buy a total of 20 Kuaraniai upgrades while having no Colosseum Power and no completed challenges.`; },
        get type() { return `col`; },
        get reward() { return `PRai gain is multiplied by ${format(c.d10)}x.`; },
        get show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        get status() { return true }
    },
    21: { 
        get name() { return `oh we might make this obsolete`; },
        get desc() { return `Have ${format(c.d300)} Upgrade 1 without any PRai.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    22: {
        get name() { return `\"End-game\" pass filter`; },
        get desc() { return `Reach ${format(c.e80)} points without buying any upgrade.`; },
        get type() { return `points`; },
        get reward() { return `Every upgrades' base is increased by ${format(c.d2_5, 2)}%.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    23: { 
        get name() { return `I don't think this does much`; },
        get desc() { return `Reach ${format(c.d300)} Upgrade 1 without Upgrade 2.`; },
        get type() { return `points`; },
        get reward() { return `Upgrade 2 also boosts PRai gain at a drastically reduced rate. Currently: ${format(this.eff, 2)}x`; },
        get eff() {
            let eff = player.value.generators.upg2.effect.max(c.e10);
            if (player.value.kua.kpower.upgrades >= 7) {
                eff = eff.root(c.d3).max(c.e10);
            }
            eff = eff.div(c.e10).pow(c.d0_03);
            return eff;
        },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    24: { 
        get name() { return `What if the upgrades didn't chain boost each other and instead also directly boosted the thing`; },
        get desc() { return `Get ${format(c.e90)} points without Upgrades 1 and 2.`; },
        get type() { return `points`; },
        get reward() { return `Achievement \"Stockpiler\" is boosted.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    25: { // TODO: Get, Effect
        get name() { return `speedrun? :o`; },
        get desc() { return `Reach ${format(c.e260)} points in the first ${format(c.d5, 2)} seconds in a Kuaraniai run.`; },
        get type() { return `points`; },
        get reward() { return `Point gain is boosted but it decays over the next ${format(c.d60, 2)} seconds. Currently: ${format(this.eff, 2)}x`; },
        get eff() {
            let eff = player.value.generators.prai.timeInPRai.max(c.d5).min(c.d60);
            eff = Decimal.pow(c.e5, c.d55.sub(eff.sub(c.d5)).div(c.d0_55).div(c.e2).pow(c.d2)).mul(c.e2);
            return eff;
        },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    26: { 
        get name() { return `imagine PR3 as \"tiers\" if PR2 is \"ranks\"`; },
        get desc() { return `Reach ${format(c.d25)} PR2.`; },
        get type() { return `points`; },
        get reward() { return ``; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    27: { // ! Unable
        get name() { return `this challenge is only gonna get more difficult`; },
        get desc() { return `Complete \"Sabotaged Upgrades\" 5 times.`; },
        get type() { return `col`; },
        get reward() { return ``; },
        get show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        get status() { return true }
    },
    28: { // TODO: Get, Effect, Eff
        get name() { return `Ruining the point`; },
        get desc() { return `Complete \"Sabotaged Upgrades\" on difficulty 1 without buying any upgrade.`; },
        get type() { return `col`; },
        get reward() { return `Colosseum Power buffs Upgrade 1's base. Currently: `; },
        get eff() {
            let eff = c.d1;
            return eff;
        },
        get show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        get status() { return true }
    },
    29: { 
        get name() { return `:softcapkisser:`; },
        get desc() { return `Get ${format(c.e7)} Kuaraniai.`; },
        get type() { return `kua`; },
        get reward() { return ``; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    30: { 
        get name() { return `Stockpiler 2`; },
        get desc() { return `Save up ${format(c.e85)} PRai on a Kuaraniai run.`; },
        get type() { return `points`; },
        get reward() { return `Achievement \"Stockpiler\" is boosted again.`; },
        get show() { return player.value.generators.pr2.best.gte(c.d10); },
        get status() { return true }
    },
    31: { // ! Unable
        get name() { return `Heaven`; },
        get desc() { return `Unlock Kuaraniai Blessings.`; },
        get type() { return `kb`; },
        get reward() { return ``; },
        get show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        get status() { return true }
    },
}

function setAchievement(id, bool) {
    if (!player.value.achievements.includes(id) && bool) {
        console.log(`Gained Achievement ${id}!`)
        player.value.achievements.push(id)
        // notify("Achievement", `You gained Achievement `)
    }
}