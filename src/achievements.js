"use strict";
const ACH_DEF_COLORS = {
    points: {
        unable() { return "#ff3333"; },
        canComplete() { return "#aaaaaa"; },
        complete() { return "#19ff33"; }
    },
    kua: {
        unable() { return "#1f0099"; },
        canComplete() { return "#5a0099"; },
        complete() { return "#a019ff"; }
    },
    col: {
        unable() { return "#8a0037"; },
        canComplete() { return "#a73000"; },
        complete() { return "#ff2300"; }
    }
}

const ACHIEVEMENT_DATA = {
    rows: 2,
    cols: 10,
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
        desc() { return `Get ${format(20)} UP1.`; },
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
        reward() { return `Increase your number generation by 200%.`; },
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
        desc() { return `Have ${format(1e18)} points without doing a PRai reset.`; },
        type() { return `points`; },
        reward() { return `Your PRai's multiplier goes from 4x -> 10x.`; },
        show() { return true },
        status() { return true }
    },
    7: {
        name() { return `This cannot be endgame.`; },
        desc() { return `Do a PR2 reset twice.`; },
        type() { return `points`; },
        reward() { return `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(ACHIEVEMENT_DATA[7].eff(), 3)} weaker.`; },
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
        status() { return tmp.value.praiPending.gte(1000) ? true : `${format(tmp.value.praiPending)} / ${format(c.e3)} PRai pending` }
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
        desc() { return `Save up ${format(c.e6)} PRai on a Kuaraniai run.`; },
        type() { return `kua`; },
        reward() { return `UP2 also boosts number gain at a reduced rate. Currently: ${format(ACHIEVEMENT_DATA[12].eff(), 2)}x`; },
        eff() { 
            let pow = D(0.2);
            let eff = player.value.generators.upg2.effect;
            eff = eff.pow(pow);
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    13: {
        name() { return `You like making progress, don't you?`; },
        desc() { return `Have ${format(c.d10)} Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Kuaraniai gain is increased by 50%, and KShards boost number generation. Currently: ${format(ACHIEVEMENT_DATA[13].eff(), 2)}x`; },
        eff() { return player.value.kua.kshards.amount.root(c.d3).max(c.d1); },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    14: {
        name() { return `Does every incremental game need to have a challenge like this? Probably.`; },
        desc() { return `Complete Colosseum Challenge 'No UP2.'`; },
        type() { return `col`; },
        reward() { return ``; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(100); },
        status() { return true }
    },
    15: {
        name() { return `This upgrade was unnecessary`; },
        desc() { return `Have ${format(1e30)} points without Upgrade 3.`; },
        type() { return `points`; },
        reward() { return `Upgrade 3 gets a slight ${format(5, 2)}% boost to effectiveness.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    16: {
        name() { return `Quite interesting`; },
        desc() { return `Get ${format(40)} Upgrade 1 without doing a single PRai reset.`; },
        type() { return `points`; },
        reward() { return `Upgrade 1's effectiveness is slightly increased based off of your PRai. Currently: ${format(ACHIEVEMENT_DATA[16].eff().sub(1).mul(100), 3)}%`; },
        eff() { 
            let eff = player.value.generators.prai.amount
            eff = eff.max(10).log10().sqrt().sub(1).div(100).add(1)
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    17: {
        name() { return `Actually, these are useless!`; },
        desc() { return `Reach ${format(1e25)} Points without any upgrade.`; },
        type() { return `points`; },
        reward() { return `All upgrades' cost scaling is slightly slowed down based off of your time in this PRai reset. Currently: ${formatPerc(ACHIEVEMENT_DATA[17].eff(), 3)} slower`; },
        eff() { 
            let eff = player.value.generators.prai.timeInPRai;
            eff = eff.div(60).add(1).cbrt().sub(1).mul(3).div(15.5).add(1);
            return eff;
        },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    18: {
        name() { return `This softcap won't hurt me!`; },
        desc() { return `Upgrade 2's effect must reach /${format(1e24)}.`; },
        type() { return `points`; },
        reward() { return `Upgrade 2's softcap is ${format(5)}% weaker.`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    19: {
        name() { return `Make this obsolete, I dare you. >:3`; },
        desc() { return `Gain Kuaraniai without doing a single PRai reset.`; },
        type() { return `kua`; },
        reward() { return `Increase PRai's gain exponent from ^${format(0.25, 3)} to ^${format(0.275, 3)}`; },
        show() { return player.value.generators.pr2.best.gte(c.d10); },
        status() { return true }
    },
    20: {
        name() { return `Screw it, we don't need the new mechanics.`; },
        desc() { return `Buy a total of 20 Kuaraniai upgrades while having no Colosseum Power and no completed challenges.`; },
        type() { return `col`; },
        reward() { return `PRai gain is multiplied by ${format(10)}x.`; },
        show() { return player.value.kua.kpower.upgrades >= 2 && player.value.kua.amount.gte(100); },
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