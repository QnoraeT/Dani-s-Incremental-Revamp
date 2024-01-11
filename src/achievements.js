const ACH_DEF_COLORS = {
    points: {
        unable: "#ff3333",
        canComplete: "#aaaaaa",
        complete: "#19ff33"
    },
    kua: {
        unable: "#1f0099",
        canComplete: "#5a0099",
        complete: "#a019ff"
    },
    col: {
        unable: "#8a0037",
        canComplete: "#a73000",
        complete: "#ff2300"
    }
}

const ACHIEVEMENT_DATA = {
    0: {
        name() { return `Starting off?`; },
        desc() { return `Get 1 UP1.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        if() { return true }
    },
    1: {
        name() { return `Let me show you how cruel I was with this...`; },
        desc() { return `Get 15 UP1.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        if() { return true }
    },
    2: {
        name() { return `Not my progress!`; },
        desc() { return `Do your first PRai reset.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return true },
        if() { return true }
    },
    3: {
        name() { return `Are you rich now?`; },
        desc() { return `Have at least 10 PRai.`; },
        type() { return `points`; },
        reward() { return `You unlock a new prestige layer, and UP1's scaling starts 2.5 later.`; },
        show() { return true },
        if() { return true }
    },
    4: {
        name() { return `Oddly named 2nd prestige layer.`; },
        desc() { return `Do a PR2 reset once.`; },
        type() { return `points`; },
        reward() { return `Increase your number generation by 200%.`; },
        show() { return true },
        if() { return true }
    },
    5: {
        name() { return `No! Not again! This is not Distance Incremental!`; },
        desc() { return `Get your first softcap.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.generators.pr2.best.gte(1); },
        if() { return true }
    },
    6: {
        name() { return `All that time wasted...`; },
        desc() { return `Have ${format(D(1e10))} points without doing a PRai reset.`; },
        type() { return `points`; },
        reward() { return `Your PRai's multiplier goes from 4x -> 10x.`; },
        show() { return true },
        if() { return true }
    },
    7: {
        name() { return `This cannot be endgame.`; },
        desc() { return `Do a PR2 reset twice.`; },
        type() { return `points`; },
        reward() { return `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(ACHIEVEMENT_DATA[7].eff(), 3)} weaker.`; },
        eff() { return player.generators.prai.amount.max(10).log10().root(3) },
        show() { return player.generators.prai.best.gte(10); },
        if() { return true }
    },
    8: {
        name() { return `Instant gratification.`; },
        desc() { return `Recieve 10 PRai in a single PRai reset.`; },
        type() { return `points`; },
        reward() { return `PR2 requirement is reduced by ${formatPerc(1.5)}.`; },
        show() { return true },
        if() { return true }
    },
    9: {
        name() { return `What once was part of a bygone era...`; },
        desc() { return `Do a PR2 reset 4 times in total.`; },
        type() { return `points`; },
        reward() { return ``; },
        show() { return player.generators.prai.best.gte(10); },
        if() { return true }
    },
    10: {
        name() { return `This really is a clone of Distance Incremental!`; },
        desc() { return `Have at least 40 UP1.`; },
        type() { return `points`; },
        reward() { return `PRai effect is increased by 200%.`; },
        show() { return true },
        if() { return true }
    },
    11: {
        name() { return `What even is this thing? Why do I have so little of it?`; },
        desc() { return `Convert all of your PRai to Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Your number generation is increased by 200%, and you start at 5 PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`; },
        show() { return true },
        if() { return true }
    },
    12: {
        name() { return `Stockpiler`; },
        desc() { return `Save up 2,000 PRai on a Kuaraniai run.`; },
        type() { return `kua`; },
        reward() { return `UP2 also boosts number gain at a reduced rate. Currently: ${format(ACHIEVEMENT_DATA[12].eff(), 2)}x`; },
        eff() { 
            let pow = D(0.2);
            let eff = player.generators.upg2.eff;
            eff = eff.pow(pow);
            return eff;
        },
        show() { return player.generators.pr2.best.gte(10); },
        if() { return true }
    },
    13: {
        name() { return `You like making progress, don't you?`; },
        desc() { return `Have ${format(10)} Kuaraniai.`; },
        type() { return `kua`; },
        reward() { return `Kuaraniai gain is increased by 50%, and KShards boost number generation. Currently: ${format(ACHIEVEMENT_DATA[13].eff(), 2)}x`; },
        eff() { return player.kua.kshards.amount.root(3).max(1); },
        show() { return player.generators.pr2.best.gte(10); },
        if() { return true }
    },
    14: {
        name() { return `Does every incremental game need to have a challenge like this? Probably.`; },
        desc() { return `Complete Colosseum Challenge 'No UP2.'`; },
        type() { return `col`; },
        reward() { return ``; },
        show() { return player.kua.kpower.upgrades >= 2 && player.kua.amount.gte(100); },
        if() { return true }
    },
}

function setAchievement(id, bool) {
    if (!player.achievements[id] && bool) {
        player.achievements[id] = true
        // notify("Achievement", `You gained Achievement `)
    }
}