"use strict";
const ACH_DEF_COLORS = {
    points: {
        unable() { return "#ff3333"; },
        canComplete() { return "#aaaaaa"; },
        complete() { return "#19ff33"; }
    },
    kua: {
        unable() { return "#1f0099"; },
        canComplete() { return "#400077"; },
        complete() { return "#a019ff"; }
    },
    col: {
        unable() { return "#8a0037"; },
        canComplete() { return "#992000"; },
        complete() { return "#ff2300"; }
    },
    kb: {
        unable() { return "#2e3b32"; },
        canComplete() { return "#366d46"; },
        complete() { return "#7fffa3"; }
    }
}

const ACHIEVEMENT_DATA = {
    rows: 4,
    cols: 8,
    // status() = if its "canComplete" (true) or "unable" (anything else, this uses the description of why it can't be c.d1), if the achievement is already in player then it will be always marked as "complete"
    0: {
        name() { return `Starting off?`; },
        desc() { return `Get ${format(c.d1)} UP1.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        status() { return true }
    },
    1: {
        name() { return `Let me show you how cruel I was with this...`; },
        desc() { return `Get ${format(c.d20)} UP1.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        status() { return true }
    },
    2: {
        name() { return `Not my progress!`; },
        desc() { return `Do your first PRai reset.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        status() { return true }
    },
    3: {
        name() { return `Are you rich now?`; },
        desc() { return `Have at least ${format(c.d10)} PRai.`; },
        type() { return `points`; },
        reward() { return `You unlock a new prestige layer, and UP1's scaling starts 2.5 later.`; },
        show() { return true },
        status() { return true }
    },
    4: {
        name() { return `this is stupid cuz its redundant lol`; },
        desc() { return `Do a PR2 reset once.`; },
        type() { return `points`; },
        reward() { return `Increase your number generation by ${format(c.d200)}%.`; },
        show() { return true },
        status() { return true }
    },
    5: {
        name() { return `No! Not again! This is not Distance Incremental!`; },
        desc() { return `Get your first softcap.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        status() { return true }
    },
    6: {
        name() { return `All that time wasted...`; },
        desc() { return `Have ${format(c.e18)} points without doing a PRai reset.`; },
        type() { return `points`; },
        reward() { return `Your PRai's multiplier goes from 4x -> 10x.`; },
        show() { return true },
        status() { return true }
    },
    7: {
        name() { return `This cannot be endgame.`; },
        desc() { return `Do a PR2 reset twice.`; },
        type() { return `points`; },
        reward() { return `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(this.eff(), 3)} weaker.`; },
        eff() { return player.value.generators.prai.amount.max(c.d10).log10().root(c.d3).sub(c.d1).div(c.d4).add(c.d1) },
        show() { return true },
        status() { return true }
    },
    8: {
        name() { return `Instant gratification.`; },
        desc() { return `Receive ${format(c.e3)} PRai in a single PRai reset.`; },
        type() { return `points`; },
        reward() { return `PR2 requirement is reduced by ${formatPerc(1.5)}.`; },
        show() { return true },
        status() { return tmp.value.praiPending.gte(c.e3) ? true : `${format(tmp.value.praiPending)} / ${format(c.e3)} PRai pending` }
    },
    9: {
        name() { return `What once was part of a bygone era...`; },
        desc() { return `Do a PR2 reset ${format(c.d4)} times in total.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.value.generators.prai.best.gte(c.d10); },
        status() { return true }
    },
    10: {
        name() { return `This really is a clone of Distance Incremental!`; },
        desc() { return `Have at least ${format(c.e2)} UP1.`; },
        type() { return `points`; },
        reward() { return `PRai effect is increased by ${format(c.d200)}%.`; },
        show() { return true },
        status() { return true }
    },
    11: {
        name() { return `What even is this thing? Why do I have so little of it?`; },
        desc() { return `Convert all of your PRai to Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Your number generation is increased by ${format(c.d200)}%, and you start at ${format(c.d10)} PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    12: {
        name() { return `Stockpiler`; },
        desc() { return `Save up ${format(c.e25)} PRai on a Kuaraniai run.`; },
        type() { return `kua`; },
        reward() { return `UP2 also boosts number gain at a reduced rate. Currently: ${format(this.eff(), 2)}x`; },
        eff() { 
            let pow = c.d0_2;
            if (player.value.achievements.includes(24)) {
                pow = pow.add(c.d0_1);
            }
            if (player.value.achievements.includes(30)) {
                pow = pow.add(c.d0_05);
            }
            let eff = player.value.generators.upg2.effect;
            eff = eff.pow(pow);
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    13: {
        name() { return `You like making progress, don't you?`; },
        desc() { return `Have ${format(c.d25)} Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Kuaraniai gain is increased by ${format(c.d50)}%, and KShards boost number generation. Currently: ${format(this.eff(), 2)}x`; },
        eff() { return player.value.kua.kshards.amount.root(c.d3).max(c.d1); },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    14: { // ! Unable 
        name() { return `Does every incremental game need to have a challenge like this? Probably.`; },
        desc() { return `Complete Colosseum Challenge 'No UP2.'`; },
        type() { return `col`; },
        reward() { return ``; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        status() { return true }
    },
    15: { 
        name() { return `This upgrade was unnecessary`; },
        desc() { return `Have ${format(c.e80)} points without Upgrade 3.`; },
        type() { return `points`; },
        reward() { return `Upgrade 3 gets a slight ${format(c.d2, 2)}% boost to effectiveness.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    16: { 
        name() { return `Quite interesting`; },
        desc() { return `Get ${format(c.d200)} Upgrade 1 without having over ${format(c.d10)} PRai.`; },
        type() { return `points`; },
        reward() { return `Upgrade 1's effectiveness is slightly increased based off of your PRai. Currently: ${format(this.eff().sub(c.d1).mul(c.e2), 3)}%`; },
        eff() { 
            let eff = player.value.generators.prai.amount
            eff = eff.max(c.d10).log10().cbrt().sub(c.d1).div(c.d200).add(c.d1)
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    17: { 
        name() { return `Actually, these are useless!`; },
        desc() { return `Reach ${format(c.e24)} Points without any upgrade.`; },
        type() { return `points`; },
        reward() { return `All upgrades' cost scaling is slightly slowed down based off of your time in this PRai reset. Currently: ${formatPerc(this.eff(), 3)} slower`; },
        eff() { 
            let eff = player.value.generators.prai.timeInPRai.div(c.d60);
            eff = eff.div(eff.mul(c.d9).add(c.d1)).add(c.d1)
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    18: { 
        name() { return `This softcap won't hurt me!`; },
        desc() { return `Upgrade 2's effect must reach /${format(c.e50)}.`; },
        type() { return `points`; },
        reward() { return `Upgrade 2's softcap is ${format(c.d5)}% weaker.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    19: {
        name() { return `Make this obsolete, I dare you. >:3`; },
        desc() { return `Gain ${format(c.d2_5, 2)} Kuaraniai without doing a single PRai reset.`; },
        type() { return `kua`; },
        reward() { return `Increase PRai's gain exponent from ^${format(c.d0_25, 3)} to ^${format(c.d0_26, 3)}`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    20: { // ! Unable
        name() { return `Screw it, we don't need the new mechanics.`; },
        desc() { return `Buy a total of 20 Kuaraniai upgrades while having no Colosseum Power and no completed challenges.`; },
        type() { return `col`; },
        reward() { return `PRai gain is multiplied by ${format(c.d10)}x.`; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        status() { return true }
    },
    21: { 
        name() { return `oh we might make this obsolete`; },
        desc() { return `Have ${format(c.d300)} Upgrade 1 without any PRai.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    22: {
        name() { return `\"End-game\" pass filter`; },
        desc() { return `Reach ${format(c.e80)} points without buying any upgrade.`; },
        type() { return `points`; },
        reward() { return `Every upgrades' base is increased by ${format(c.d2_5, 2)}%.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    23: { 
        name() { return `I don't think this does much`; },
        desc() { return `Reach ${format(c.d300)} Upgrade 1 without Upgrade 2.`; },
        type() { return `points`; },
        reward() { return `Upgrade 2 also boosts PRai gain at a drastically reduced rate. Currently: ${format(this.eff(), 2)}x`; },
        eff() {
            let eff = player.value.generators.upg2.effect.max(c.e10);
            eff = eff.div(c.e10).pow(c.d0_03);
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    24: { 
        name() { return `What if the upgrades didn't chain boost each other and instead also directly boosted the thing`; },
        desc() { return `Get ${format(c.e90)} points without Upgrades 1 and 2.`; },
        type() { return `points`; },
        reward() { return `Achievement \"Stockpiler\" is boosted.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    25: { // TODO: Get, Effect
        name() { return `speedrun? :o`; },
        desc() { return `Reach ${format(c.e140)} points in the first ${format(c.d5, 2)} seconds in a Kuaraniai run.`; },
        type() { return `points`; },
        reward() { return `Point gain is boosted but it decays over the next ${format(c.d60, 2)} seconds. Currently: ${format(this.eff(), 2)}x`; },
        eff() {
            let eff = player.value.generators.prai.timeInPRai.max(c.d5).min(c.d60);
            eff = Decimal.pow(c.e5, c.d55.sub(eff.sub(c.d5)).div(c.d0_55).div(c.e2).pow(c.d2)).mul(c.e2);
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    26: { 
        name() { return `imagine PR3 as \"tiers\" if PR2 is \"ranks\"`; },
        desc() { return `Reach ${format(c.d25)} PR2.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    27: { // ! Unable
        name() { return `this challenge is only gonna get more difficult`; },
        desc() { return `Complete \"Sabotaged Upgrades\" 5 times.`; },
        type() { return `col`; },
        reward() { return ``; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        status() { return true }
    },
    28: { // TODO: Get, Effect, Eff
        name() { return `Ruining the point`; },
        desc() { return `Complete \"Sabotaged Upgrades\" on difficulty 1 without buying any upgrade.`; },
        type() { return `col`; },
        reward() { return `Colosseum Power buffs Upgrade 1's base. Currently: `; },
        eff() {
            let eff = c.d1;
            return eff;
        },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        status() { return true }
    },
    29: { 
        name() { return `:softcapkisser:`; },
        desc() { return `Get ${format(c.e7)} Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return ``; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    30: { 
        name() { return `Stockpiler 2`; },
        desc() { return `Save up ${format(c.e60)} PRai on a Kuaraniai run.`; },
        type() { return `points`; },
        reward() { return `Achievement \"Stockpiler\" is boosted again.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    31: { // ! Unable
        name() { return `Heaven`; },
        desc() { return `Unlock Kuaraniai Blessings.`; },
        type() { return `kb`; },
        reward() { return ``; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(c.e2); },
        status() { return true }
    },
}

function setAchievement(id, bool) {
    if (!player.value.achievements.includes(id) && bool) {
        console.log(`Gained Achievement ${id}!`)
        player.value.achievements.push(id)
        // notify("Achievement", `You gained Achievement `)
    }
}