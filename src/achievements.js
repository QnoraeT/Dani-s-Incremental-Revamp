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
        name: `Starting off?`,
        desc: `Get 1 UP1.`,
        type: `points`,
        reward: ``,
        show() { return true },
        if: true
    },
    1: {
        name: `Let me show you how cruel I was with this...`,
        desc: `Get 15 UP1.`,
        type: `points`,
        reward: ``,
        show() { return true },
        if: true
    },
    2: {
        name: `Not my progress!`,
        desc: `Do your first PRai reset.`,
        type: `points`,
        reward: ``,
        show() { return true },
        if: true
    },
    3: {
        name: `Are you rich now?`,
        desc: `Have at least 10 PRai.`,
        type: `points`,
        reward: `You unlock a new prestige layer, and UP1's scaling starts 2.5 later.`,
        show() { return true },
        if: true
    },
    4: {
        name: `Oddly named 2nd prestige layer.`,
        desc: `Do a PR2 reset once.`,
        type: `points`,
        reward: `Increase your number generation by 200%.`,
        show() { return true },
        if: true
    },
    5: {
        name: `No! Not again! This is not Distance Incremental!`,
        desc: `Get your first softcap.`,
        type: `points`,
        reward: ``,
        show() { return player.generators.pr2.best.gte(1); },
        if: true
    },
    6: {
        name: `All that time wasted...`,
        desc: `Have ${format(D(1e10))} points without doing a PRai reset.`,
        type: `points`,
        reward: `Your PRai's multiplier goes from 4x -> 10x.`,
        show() { return true },
        if: true
    },
    7: {
        name: `This cannot be endgame.`,
        desc: `Do a PR2 reset twice.`,
        type: `points`,
        reward: `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(ACHIEVEMENT_DATA[7].eff(), 3)} weaker.`,
        eff() { return player.generators.prai.amount.max(10).log10().root(3) },
        show() { return player.generators.prai.best.gte(10); },
        if: true
    },
    8: {
        name: `Instant gratification.`,
        desc: `Recieve 10 PRai in a single PRai reset.`,
        type: `points`,
        reward: `PR2 requirement is reduced by 33.333%.`,
        show() { return true },
        if: true
    },
    9: {
        name: `What once was part of a bygone era...`,
        desc: `Do a PR2 reset 4 times in total.`,
        type: `points`,
        reward: ``,
        show() { return player.generators.prai.best.gte(10); },
        if: true
    },
    10: {
        name: `This really is a clone of Distance Incremental!`,
        desc: `Have at least 40 UP1.`,
        type: `points`,
        reward: `PRai effect is increased by 200%.`,
        show() { return true },
        if: true
    },
    11: {
        name: `What even is this thing? Why do I have so little of it?`,
        desc: `Convert all of your PRai to Kuaraniai.`,
        type: `kua`,
        reward: `Your number generation is increased by 200%, and you start at 5 PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`,
        show() { return true },
        if: true
    },
    12: {
        name: `Stockpiler`,
        desc: `Save up 2,000 PRai on a Kuaraniai run.`,
        type: `kua`,
        reward: `UP2 also boosts number gain at a reduced rate. Currently: ${format(ACHIEVEMENT_DATA[12].eff(), 2)}x`,
        eff() { 
            let pow = D(0.2);
            let eff = player.generators.upg2.eff ;
            eff = eff.pow(pow);
            return eff;
        },
        show() { return player.generators.pr2.best.gte(10); },
        if: true
    },
    13: {
        name: `You like making progress, don't you?`,
        desc: `Have ${format(10)} Kuaraniai.`,
        type: `kua`,
        reward: `Kuaraniai gain is increased by 50%, and KShards boost number generation. Currently: ${format(ACHIEVEMENT_DATA[13].eff(), 2)}x`,
        eff() { return player.kua.kshards.amount.root(3).max(1); },
        show() { return player.generators.pr2.best.gte(10); },
        if: true
    },
    14: {
        name: `Does every incremental game need to have a challenge like this? Probably.`,
        desc: `Complete Colosseum Challenge 'No UP2.'`,
        type: `col`,
        reward: ``,
        show() { return player.kua.kpower.upgrades >= 2 && player.kua.amount.gte(100); },
        if: true
    },
}

function setAchievement(id, bool) {
    if (!player.achievements[id] && bool) {
        player.achievements[id] = true
        // notify("Achievement", `You gained Achievement `)
    }
}