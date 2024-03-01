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
    cols: 7,
    // status() = if its "canComplete" (true) or "unable" (anything else, this uses the description of why it can't be c.d1), if the achievement is already in player then it will be always marked as "complete"
    0: {
        name() { return `Starting off?`; },
        desc() { return `Get ${format(1)} UP1.`; },
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
        desc() { return `Have at least ${format(10)} PRai.`; },
        type() { return `points`; },
        reward() { return `You unlock a new prestige layer, and UP1's scaling starts 2.5 later.`; },
        show() { return true },
        status() { return true }
    },
    4: {
        name() { return `Redundant Achievements: (also a weird prestige name)`; },
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
        eff() { return player.value.generators.prai.amount.max(10).log10().root(3).sub(1).div(4).add(1) },
        show() { return true },
        status() { return true }
    },
    8: {
        name() { return `Instant gratification.`; },
        desc() { return `Recieve ${format(1000)} PRai in a single PRai reset.`; },
        type() { return `points`; },
        reward() { return `PR2 requirement is reduced by ${formatPerc(1.5)}.`; },
        show() { return true },
        status() { return tmp.value.praiPending.gte(1000) ? true : `${format(tmp.value.praiPending)} / ${format(1000)} PRai pending` }
    },
    9: {
        name() { return `What once was part of a bygone era...`; },
        desc() { return `Do a PR2 reset ${format(4)} times in total.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.value.generators.prai.best.gte(10); },
        status() { return true }
    },
    10: {
        name() { return `This really is a clone of Distance Incremental!`; },
        desc() { return `Have at least ${format(100)} UP1.`; },
        type() { return `points`; },
        reward() { return `PRai effect is increased by ${format(200)}%.`; },
        show() { return true },
        status() { return true }
    },
    11: {
        name() { return `What even is this thing? Why do I have so little of it?`; },
        desc() { return `Convert all of your PRai to Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Your number generation is increased by ${format(200)}%, and you start at ${format(10)} PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`; },
        show() { return player.value.generators.pr2.best.gte(10); },
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
        show() { return player.value.generators.pr2.best.gte(10); },
        status() { return true }
    },
    13: {
        name() { return `You like making progress, don't you?`; },
        desc() { return `Have ${format(10)} Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Kuaraniai gain is increased by 50%, and KShards boost number generation. Currently: ${format(ACHIEVEMENT_DATA[13].eff(), 2)}x`; },
        eff() { return player.value.kua.kshards.amount.root(3).max(1); },
        show() { return player.value.generators.pr2.best.gte(10); },
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
}

function setAchievement(id, bool) {
    if (!player.value.achievements.includes(id) && bool) {
        player.value.achievements.push(id)
        // notify("Achievement", `You gained Achievement `)
    }
}