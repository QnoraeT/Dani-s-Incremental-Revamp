"use strict";
const ACH_DEF_COLORS = {
    points: {
        unable: "#ff3333",
        canComplete: "#aaaaaa",
        complete: "#19ff33"
    },
    kua: {
        unable: "#1f0099",
        canComplete: "#400077",
        complete: "#a019ff"
    },
    col: {
        unable: "#8a0037",
        canComplete: "#992000",
        complete: "#ff2300"
    },
    tax: {
        unable: "#807000",
        canComplete: "#a06500",
        complete: "#d5c000"
    },
    kb: {
        unable: "#2e3b32",
        canComplete: "#366d46",
        complete: "#7fffa3"
    }
}

const ACHIEVEMENT_DATA = {
    rows: 4,
    cols: 8,
    // get status() = if its "canComplete" (true) or "unable" (anything else, this uses the description of why it can't be 1), if the achievement is already in player then it will be always marked as "complete"
    list: [
        {
            internal: 0,
            get name() { return `Starting off?`; },
            get desc() { return `Get ${format(c.d1)} UP1.`; },
            type: `points`,
            reward: ``,
            show: true,
            status: true
        },
        {
            internal: 1,
            get name() { return `Let me show you how cruel I was with this...`; },
            get desc() { return `Get ${format(c.d20)} UP1.`; },
            type: `points`,
            reward: ``,
            show: true,
            status: true
        },
        {
            internal: 2,
            get name() { return `Not my progress!`; },
            get desc() { return `Do your first PRai reset.`; },
            type: `points`,
            reward: ``,
            show: true,
            status: true
        },
        {
            internal: 3,
            get name() { return `Are you rich now?`; },
            get desc() { return `Have at least ${format(c.d10)} PRai.`; },
            type: `points`,
            get reward() { return `You unlock a new prestige layer, and UP1's scaling starts ${c.d2_5} later.`; },
            show: true,
            status: true
        },
        {
            internal: 4,
            get name() { return `this is stupid cuz its redundant lol`; },
            get desc() { return `Do a PR2 reset once.`; },
            type: `points`,
            get reward() { return `Increase your number generation by ${format(c.e2)}%.`; },
            show: true,
            status: true
        },
        {
            internal: 5,
            get name() { return `No! Not again! This is not Distance Incremental!`; },
            get desc() { return `Get your first softcap.`; },
            type: `points`,
            reward: ``,
            show: true,
            status: true
        },
        {
            internal: 6,
            get name() { return `All that time wasted...`; },
            get desc() { return `Have ${format(c.e18)} points without doing a PRai reset.`; },
            type: `points`,
            get reward() { return `Your PRai's multiplier goes from ${format(c.d4)}x -> ${format(c.d10)}x.`; },
            show: true,
            status: true
        },
        {
            internal: 7,
            get name() { return `This cannot be endgame.`; },
            get desc() { return `Do a PR2 reset twice.`; },
            type: `points`,
            get reward() { return `UP1's scaling is weakened based off of PRai. Currently: ${formatPerc(this.eff, 3)} weaker.`; },
            get eff() { return Decimal.max(player.value.generators.prai.amount, c.d10).log10().root(c.d3).sub(c.d1).div(c.d4).add(c.d1) },
            show: true,
            status: true
        },
        {
            internal: 8,
            get name() { return `Instant gratification.`; },
            get desc() { return `Receive ${format(c.e3)} PRai in a single PRai reset.`; },
            type: `points`,
            get reward() { return `PR2 requirement is reduced by ${formatPerc(c.d1_5)}.`; },
            show: true,
            get status() { return tmp.value.praiPending.gte(c.e3) ? true : `${format(tmp.value.praiPending)} / ${format(c.e3)} PRai pending` }
        },
        {
            internal: 10,
            get name() { return `This really is a clone of Distance Incremental!`; },
            get desc() { return `Have at least ${format(c.e2)} UP1.`; },
            type: `points`,
            get reward() { return `PRai effect is increased by ${format(c.e2)}%.`; },
            show: true,
            status: true
        },
        {
            internal: 9,
            get name() { return `What once was part of a bygone era...`; },
            get desc() { return `Do a PR2 reset ${format(c.d4)} times in total.`; },
            type: `points`,
            reward: ``,
            get show() { return Decimal.gte(player.value.generators.prai.best, c.d10); },
            status: true
        },
        {
            internal: 11,
            get name() { return `What even is this thing? Why do I have so little of it?`; },
            get desc() { return `Convert all of your PRai to Kuaraniai.`; },
            get type() { return `kua`; },
            get reward() { return `Your number generation is increased by ${format(c.e2)}%, and you start at ${format(c.d10)} PRai every Kuaraniai reset, but the starting PRai doesn't count for Kuaraniai gain.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        {
            internal: 12,
            get name() { return `Stockpiler`; },
            get desc() { return `Save up ${format(c.e12)} PRai on a Kuaraniai run.`; },
            get type() { return `kua`; },
            get reward() { return `UP2 also boosts number gain at a reduced rate. Currently: ${format(this.eff, 2)}x`; },
            get eff() { 
                let pow = c.d0_2;
                if (ifAchievement(24)) {
                    pow = pow.add(c.d0_05);
                }
                if (ifAchievement(30)) {
                    pow = pow.add(c.d0_05);
                }
    
                let eff = Decimal.max(tmp.value.upgrades[1].effect, c.d1);
                if (getKuaUpgrade("p", 7)) {
                    eff = eff.root(c.d3);
                }
                eff = eff.pow(pow);
                return eff;
            },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 34,
            get name() { return `Gathering Pieces Together`; },
            get desc() { return `Have ${format(c.em2, 3)} Kuaraniai.`; },
            get type() { return `kua`; },
            get reward() { return `KShard and KPower now passively boost points and PRai.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        {
            internal: 13,
            get name() { return `You like making progress, don't you?`; },
            get desc() { return `Have ${format(c.d0_1, 2)} Kuaraniai.`; },
            get type() { return `kua`; },
            get reward() { return `Kuaraniai gain is increased by ${format(c.d50)}%, and KShards produce another point multiplier. Currently: ${format(this.eff, 2)}x`; },
            get eff() { return Decimal.max(player.value.kua.kshards.total, c.d0).add(c.d1).mul(c.d8).sqrt().sub(c.d1).div(c.d2); },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 15,
            get name() { return `This upgrade was unnecessary`; },
            get desc() { return `Have ${format(c.e80)} points without Upgrade 3.`; },
            type: `points`,
            get reward() { return `Upgrade 3 gets a small ${format(c.d1, 2)}% boost to effectiveness.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 16,
            get name() { return `Quite interesting`; },
            get desc() { return `Get ${format(c.e2)} Upgrade 1 without having over ${format(c.d10)} PRai.`; },
            type: `points`,
            get reward() { return `Upgrade 1's effectiveness is slightly increased based off of your PRai. Currently: ${format(this.eff.sub(c.d1).mul(c.e2), 3)}%`; },
            get eff() { 
                let eff = D(player.value.generators.prai.amount)
                eff = eff.max(c.d10).log10().cbrt().sub(c.d1).div(c.d200).add(c.d1)
                return eff;
            },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 17,
            get name() { return `Actually, these are useless!`; },
            get desc() { return `Reach ${format(c.e24)} Points without any upgrade.`; },
            type: `points`,
            get reward() { return `All upgrades' cost scaling is slightly slowed down based off of your time in this PRai reset. Currently: ${formatPerc(this.eff, 3)} slower`; },
            get eff() { 
                let eff = Decimal.div(player.value.generators.prai.timeInPRai, c.d60);
                eff = eff.div(eff.mul(c.d9).add(c.d1)).add(c.d1)
                return eff;
            },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 18,
            get name() { return `This softcap won't hurt me!`; },
            get desc() { return `Upgrade 2's effect must reach /${format(c.e17)}.`; },
            type: `points`,
            get reward() { return `Upgrade 2's softcap is ${format(c.d5)}% weaker.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        {
            internal: 19,
            get name() { return `Make this obsolete, I dare you. >:3`; },
            get desc() { return `Gain ${format(c.d2_5, 2)} Kuaraniai without doing a single PRai reset.`; },
            get type() { return `kua`; },
            get reward() { return `Increase PRai's gain exponent from ^${format(c.d1div3, 3)} to ^${format(c.d0_35, 3)}`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 21,
            get name() { return `oh we might make this obsolete`; },
            get desc() { return `Have ${format(c.d300)} Upgrade 1 without any PRai.`; },
            type: `points`,
            reward: ``,
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        {
            internal: 22,
            get name() { return `\"End-game\" pass filter`; },
            get desc() { return `Reach ${format(c.e80)} points without buying any upgrade.`; },
            type: `points`,
            get reward() { return `Every upgrades' base is increased by ${format(c.d1, 2)}%.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 23,
            get name() { return `I don't think this does much`; },
            get desc() { return `Reach ${format(c.d300)} Upgrade 1 without Upgrade 2.`; },
            type: `points`,
            get reward() { return `Upgrade 2 also boosts PRai gain at a drastically reduced rate. Currently: ${format(this.eff, 2)}x`; },
            get eff() {
                let eff = Decimal.max(tmp.value.upgrades[1].effect, c.e10);
                if (getKuaUpgrade("p", 7)) {
                    eff = eff.root(c.d3).max(c.e10);
                }
                eff = eff.div(c.e10).pow(c.d0_015);
                return eff;
            },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 24,
            get name() { return `What if the upgrades didn't chain boost each other and instead also directly boosted the thing`; },
            get desc() { return `Get ${format(c.e35)} points without Upgrades 1 and 2.`; },
            type: `points`,
            get reward() { return `Achievement \"Stockpiler\" is boosted.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 25,
            get name() { return `speedrun? :o`; },
            get desc() { return `Reach ${format(c.e260)} points in the first ${format(c.d5, 2)} seconds in a Kuaraniai run.`; },
            type: `points`,
            get reward() { return `Point gain is boosted but it decays over the next ${format(c.d60, 2)} seconds. Currently: ${format(this.eff, 2)}x`; },
            get eff() {
                let eff = Decimal.max(player.value.generators.prai.timeInPRai, c.d5).min(c.d60);
                eff = Decimal.pow(c.e2, c.d55.sub(eff.sub(c.d5)).div(c.d0_55).div(c.e2).pow(c.d2));
                return eff;
            },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 26,
            get name() { return `imagine PR3 as \"tiers\" if PR2 is \"ranks\"`; },
            get desc() { return `Reach ${format(c.d25)} PR2.`; },
            type: `points`,
            reward: ``,
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { 
            internal: 30,
            get name() { return `Stockpiler 2`; },
            get desc() { return `Save up ${format(c.e85)} PRai on a Kuaraniai run.`; },
            type: `points`,
            get reward() { return `Achievement \"Stockpiler\" is boosted again.`; },
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        {
            internal: 14,
            get name() { return `Does every incremental game need to have a challenge like this? Probably.`; },
            get desc() { return `Complete Colosseum Challenge 'No Kuaraniai.'`; },
            get type() { return `col`; },
            reward: ``,
            get show() { return player.value.col.unlocked; },
            status: true
        },
        {
            internal: 20,
            get name() { return `In a time crunch.`; },
            get desc() { return `Fully complete a challenge with less than ${formatTime(c.d10)} to spare.`; },
            get type() { return `col`; },
            get reward() { return `PRai gain is multiplied by ${format(c.d5)}x.`; },
            get show() { return player.value.col.unlocked; },
            status: true
        },
        { // ! Unable
            internal: 27,
            get name() { return `this challenge is only gonna get more difficult`; },
            get desc() { return `Complete \"Sabotaged Upgrades\" 5 times.`; },
            get type() { return `col`; },
            reward: ``,
            get show() { return player.value.col.unlocked; },
            status: true
        },
        { // ! Unable
            internal: 28,
            get name() { return `Ruining the point`; },
            get desc() { return `Complete \"Sabotaged Upgrades\" on difficulty 1 without buying any upgrade.`; },
            get type() { return `col`; },
            get reward() { return `Colosseum Power buffs Upgrade 1's base. Currently: `; },
            get eff() {
                let eff = c.d1;
                return eff;
            },
            get show() { return player.value.col.unlocked; },
            status: true
        },
        { 
            internal: 29,
            get name() { return `:softcapkisser:`; },
            get desc() { return `Get ${format(c.e7)} Kuaraniai.`; },
            get type() { return `kua`; },
            reward: ``,
            get show() { return player.value.kua.unlocked; },
            status: true
        },
        { // ! Unable
            internal: 31,
            get name() { return `Heaven ...?`; },
            get desc() { return `Unlock Kuaraniai Blessings.`; },
            get type() { return `kb`; },
            reward: ``,
            get show() { return player.value.col.unlocked; },
            status: true
        },
        { 
            internal: 32,
            get name() { return `There wasn't any point in doing that.`; },
            get desc() { return `Reach ${format(c.e100)} points in No Kuaraniai.`; },
            get type() { return `col`; },
            reward: ``,
            get show() { return player.value.tax.unlocked; },
            status: true
        },
        { 
            internal: 33,
            get name() { return `smort`; },
            get desc() { return `Reach Level ${format(c.e2)} in Dotgenous.`; },
            get type() { return `col`; },
            reward: ``,
            get show() { return player.value.tax.unlocked; },
            status: true
        },
    ]
}

function setAchievement(id, bool) {
    if (!ifAchievement(id) && bool) {
        console.log(`Gained Achievement ${id + 1}!`)
        player.value.achievements.push(tmp.value.achievementList[id])
        // notify("Achievement", `You gained Achievement `)
    }
}

function fixAchievements() {
    let failure = false;
    tmp.value.achievementList = []
    for (let i = 0; i < ACHIEVEMENT_DATA.list.length; i++) {
        failure = true;
        for (let j = 0; j < ACHIEVEMENT_DATA.list.length; j++) {
            if (ACHIEVEMENT_DATA.list[j].internal === i) {
                tmp.value.achievementList.push(j);
                failure = false;
                break;
            }
        }
        if (failure) { console.warn(`Achievement with internal ID ${i} was not found!!`); }
    }
}

function getAchievementEffect(id) {
    return ACHIEVEMENT_DATA.list[tmp.value.achievementList[id]].eff
}

function getAchievementData(id) {
    return ACHIEVEMENT_DATA.list[tmp.value.achievementList[id]]
}

function ifAchievement(id) {
    return player.value.achievements.includes(tmp.value.achievementList[id])
}