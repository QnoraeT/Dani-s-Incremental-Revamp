"use strict";

/**
 * type
 * 0 = One-Time only
 * 1 = Can complete multiple times (Decimal)
 * 2 = Continouous (Decimal, best)
 * 
 * layer
 * 0 = kua
 */
const COL_CHALLENGES = {
    nk: {
        type: 0,
        num: 1,
        id: 'nk',
        layer: 0,
        name: `No Kuaraniai`,
        goal: c.e25,
        get goalDesc() { return `Reach ${format(this.goal)} Points.`},
        desc: `All Kuaraniai resources and upgrades are disabled.`,
        reward: `Unlock another tab in Colosseum.`,
        cap: c.d1,
        show: true,
        get canComplete() { return Decimal.gte(player.value.bestPointsInCol, this.goal); },
        get progress() { return Decimal.max(player.value.bestPointsInCol, c.d1).log10().div(this.goal.log10()).min(c.d1); },
        get progDisplay() { return `${format(player.value.bestPointsInCol)} / ${format(this.goal)} (${format(this.progress.mul(c.e2), 3)}%)`; }
    }
}

function getColResLevel(id) {
    return COL_RESEARCH[id].scoreToLevel(player.value.col.research.xpTotal[id]);
}

function getColResEffect(id) {
    return COL_RESEARCH[id].effect(getColResLevel(id).floor());
}

function allocColResearch(id) {
    if (player.value.col.research.enabled[id]) {
        tmp.value.colResearchesAllocated -= 1;
        player.value.col.research.enabled[id] = false;
    } else {
        if (tmp.value.colResearchesAllocated < tmp.value.colResearchesAtOnce) {
            tmp.value.colResearchesAllocated += 1;
            player.value.col.research.enabled[id] = true;
        }
    }
}

const COL_RESEARCH = [
    {
        unlocked: true,
        name: "Dotgenous",
        effectDesc(level) { return `Multiply point gain by ${format(this.effect(level), 2)}x.`; },
        effectDescLevel(level) { return `Multiply point gain by ${format(this.effect(Decimal.add(level, 1)).div(this.effect(level)), 3)}x for this level.`; },
        scoreReq: c.d2,
        effect(level) {
            let effect = Decimal.sqrt(level).pow10();
            return effect;
        },
        scoreToLevel(score) {
            if (Decimal.lt(score, this.scoreReq)) { return c.d0; }
            let level = linearAdd(score, this.scoreReq, this.scoreReq, true);
            return level;
        },
        levelToScore(level) {
            let score = linearAdd(level, this.scoreReq, this.scoreReq, false);
            return score;
        }
    },
    {
        unlocked: true,
        name: "Firsterious",
        effectDesc(level) { return `Multiply PRai gain by ${format(this.effect(level), 2)}x.`; },
        effectDescLevel(level) { return `Multiply PRai gain by ${format(this.effect(Decimal.add(level, 1)).div(this.effect(level)), 3)}x for this level.`; },
        scoreReq: c.d10,
        effect(level) {
            let effect = Decimal.cbrt(level).pow_base(4);
            return effect;
        },
        scoreToLevel(score) {
            if (Decimal.lt(score, this.scoreReq)) { return c.d0; }
            let level = linearAdd(score, this.scoreReq, this.scoreReq, true);
            return level;
        },
        levelToScore(level) {
            let score = linearAdd(level, this.scoreReq, this.scoreReq, false);
            return score;
        }
    },
    {
        unlocked: true,
        name: "Kyston",
        effectDesc(level) { return `Increase Kuaraniai gain exponent by +${format(this.effect(level), 3)}.`; },
        effectDescLevel(level) { return `+${format(this.effect(Decimal.add(level, 1)).sub(this.effect(level)), 4)} Kuaraniai gain exponent for this level.`; },
        scoreReq: c.e2,
        effect(level) {
            let effect = sumHarmonicSeries(level).div(100);
            return effect;
        },
        scoreToLevel(score) {
            if (Decimal.lt(score, this.scoreReq)) { return c.d0; }
            let level = linearAdd(score, this.scoreReq, this.scoreReq, true);
            return level;
        },
        levelToScore(level) {
            let score = linearAdd(level, this.scoreReq, this.scoreReq, false);
            return score;
        }
    },
]

function timesCompleted(id) {
    if (player.value.col.completed[id] === undefined) { return false; }
    return player.value.col.completed[id];
}

function completedChallenge(id) {
    if (player.value.col.completed[id] === undefined) { return false; }
    return Decimal.gte(player.value.col.completed[id], COL_CHALLENGES[id].cap);
}

function inChallenge(id) {
    if (player.value.inChallenge[id] === undefined) { return false; }
    return player.value.inChallenge[id].entered;
}

function challengeDepth(id) {
    return player.value.inChallenge[id].depth;
}

function exitChallenge(id) {
    let chalIdCheck = player.value.col.challengeOrder.chalID.pop();
    if (chalIdCheck !== id) { 
        player.value.col.challengeOrder.chalID.push(chalIdCheck);
        throw new Error("major error! check player.value.col.challengeOrder because challenge order is wrong!!");
    }
    player.value.col.challengeOrder.layer.pop();
    player.value.inChallenge[id].entered = false;

    let savedColData = player.value.col.saved[id]
    player.value.bestPointsInCol = savedColData.main.bestPointsInCol
    player.value.kua = savedColData.kua;
    player.value.generators.pr2 = savedColData.pr2;
    player.value.generators.prai = savedColData.prai;
    player.value.auto.prai = savedColData.auto.prai;
    for (let i = 0; i < 6; i++) {
        player.value.auto.upgrades[i] = savedColData.auto.upgrades[i];
        player.value.generators.upgrades[i].bought = savedColData.main.upgrades[i].bought;
        player.value.generators.upgrades[i].best = savedColData.main.upgrades[i].best;
    }
}

function updateAllCol(delta) {
    updateCol("research", delta);
    updateCol("col", delta);
}

function updateCol(type, delta) {
    let scal, pow, sta, i, j, generate;
    switch (type) {
        case "research":
            // no reason for this to be a Decimal, there should not be >1.797e308 researches
            tmp.value.colResearchesAtOnce = 1;
            tmp.value.colResearchesAllocated = 0;
            tmp.value.colResearchSpeed = c.d1;

            for (let i = 0; i < COL_RESEARCH.length; i++) {
                if (player.value.col.research.enabled[i] === undefined) { player.value.col.research.enabled[i] = false; }
                if (player.value.col.research.xpTotal[i] === undefined) { player.value.col.research.xpTotal[i] = c.d0; }

                if (player.value.col.research.enabled[i]) {
                    tmp.value.colResearchesAllocated++;
                    generate = tmp.value.colResearchSpeed.mul(delta);
                    player.value.col.research.xpTotal[i] = Decimal.add(player.value.col.research.xpTotal[i], generate)
                }
            }
            break;

        case "col":
            if (Decimal.lte(player.value.col.time, 0) && player.value.col.inAChallenge) {
                for (let i = player.value.col.challengeOrder.chalID.length - 1; i >= 0; i--) {
                    exitChallenge(player.value.col.challengeOrder.chalID[i]);
                }
            }

            tmp.value.colPow = c.d0_4;

            i = Decimal.max(player.value.kua.best, c.e2).div(c.e2).pow(tmp.value.colPow);
            tmp.value.colosseumPowerGeneration = i;

            generate = tmp.value.colosseumPowerGeneration.mul(delta);
            player.value.col.power = Decimal.add(player.value.col.power, generate);
            player.value.col.totalPower = Decimal.add(player.value.col.totalPower, generate);
            player.value.col.bestPower = Decimal.max(player.value.col.bestPower, player.value.col.power);

            i = Decimal.max(player.value.col.power, c.e2).log10().mul(c.d20);
            player.value.col.maxTime = i;

            player.value.col.inAChallenge = false;
            let k = 0;
            let l = 0;
            for (i in player.value.inChallenge) {
                j = false;
                player.value.inChallenge[i].trapped = j;

                j = false;
                if (player.value.inChallenge[i].entered || player.value.inChallenge[i].trapped) { j = true; }

                if (j) { 
                    if (COL_CHALLENGES[i].canComplete) { k++; }
                    l++;
                    player.value.col.inAChallenge = true; 
                }
                player.value.inChallenge[i].overall = j;
                
                j = c.d0;
                if (player.value.inChallenge[i].entered || player.value.inChallenge[i].trapped) { j = c.d1; }
                player.value.inChallenge[i].depth = j;
            }

            player.value.col.completedAll = k === l && player.value.col.inAChallenge;

            if (player.value.col.inAChallenge) {
                if (!player.value.col.completedAll) { player.value.col.time = player.value.col.time.sub(delta); }
            } else {
                player.value.col.time = player.value.col.maxTime;
            }

            setAchievement(14, Decimal.gte(timesCompleted("nk"), c.d1));
            break;
        default:
            throw new Error(`Colosseum area of the game does not contain ${type}`);
    }
}

function challengeToggle(id) {
    if (!inChallenge(id)) {
        if (player.value.col.challengeOrder.layer[player.value.col.challengeOrder.layer.length - 1] <= COL_CHALLENGES[id].layer) {
            return;
        }

        player.value.inChallenge[id] = {
            name: COL_CHALLENGES[id].name,
            goal: COL_CHALLENGES[id].goalDesc,
            entered: true
        }

        let obj = {
            main: {
                bestPointsInCol: player.value.bestPointsInCol,
                upgrades: [
                    { 
                        best: player.value.generators.upgrades[0].best,
                        bought: player.value.generators.upgrades[0].bought
                    },
                    { 
                        best: player.value.generators.upgrades[1].best,
                        bought: player.value.generators.upgrades[1].bought
                    },
                    { 
                        best: player.value.generators.upgrades[2].best,
                        bought: player.value.generators.upgrades[2].bought
                    },
                    { 
                        best: player.value.generators.upgrades[3].best,
                        bought: player.value.generators.upgrades[3].bought
                    },
                    { 
                        best: player.value.generators.upgrades[4].best,
                        bought: player.value.generators.upgrades[4].bought
                    },
                    { 
                        best: player.value.generators.upgrades[5].best,
                        bought: player.value.generators.upgrades[5].bought
                    },
                ]
            },
            kua: {
                unlocked: player.value.kua.unlocked,
                amount: player.value.kua.amount,
                best: player.value.kua.best,
                timeInKua: player.value.kua.timeInKua,
                times: player.value.kua.times,
                total: player.value.kua.total,
                kshards: {
                    amount: player.value.kua.kshards.amount,
                    best: player.value.kua.kshards.best,
                    total: player.value.kua.kshards.total,
                    upgrades: player.value.kua.kshards.upgrades
                },
                kpower: {
                    amount: player.value.kua.kpower.amount,
                    best: player.value.kua.kpower.best,
                    total: player.value.kua.kpower.total,
                    upgrades: player.value.kua.kpower.upgrades
                }
            },
            pr2: {
                amount: player.value.generators.pr2.amount,
                best: player.value.generators.pr2.best,
                cost: player.value.generators.pr2.cost,
                effect: player.value.generators.pr2.effect,
                freeExtra: player.value.generators.pr2.freeExtra,
                target: player.value.generators.pr2.target
            },
            prai: {
                amount: player.value.generators.prai.amount,
                best: player.value.generators.prai.best,
                bestInPR2: player.value.generators.prai.bestInPR2,
                effect: player.value.generators.prai.effect,
                timeInPRai: player.value.generators.prai.timeInPRai,
                times: player.value.generators.prai.times,
                total: player.value.generators.prai.total,
                totalInKua: player.value.generators.prai.totalInKua,
                totalInPR2: player.value.generators.prai.totalInPR2,
            },
            auto: {
                prai: player.value.auto.prai,
                upgrades: [player.value.auto.upgrades[0], player.value.auto.upgrades[1], player.value.auto.upgrades[2], player.value.auto.upgrades[3], player.value.auto.upgrades[4], player.value.auto.upgrades[5], player.value.auto.upgrades[6]]
            }
        }

        player.value.col.saved[id] = obj;
        player.value.col.challengeOrder.chalID.push(COL_CHALLENGES[id].id);
        player.value.col.challengeOrder.layer.push(COL_CHALLENGES[id].layer);
        reset("col", true)
    } else {
        if (COL_CHALLENGES[id].canComplete) {
            if (player.value.col.completed[id] === undefined) {
                player.value.col.completed[id] = c.d0;
            }
            player.value.col.completed[id] = Decimal.add(player.value.col.completed[id], c.d1).min(COL_CHALLENGES[id].cap);
            setAchievement(20, Decimal.lte(player.value.col.time, c.d10));
        }

        let layerExited = player.value.col.challengeOrder.layer[player.value.col.challengeOrder.chalID.indexOf(id)];
        for (let i = player.value.col.challengeOrder.chalID.length - 1; i >= 0; i--) {
            if (player.value.col.challengeOrder.layer[i] > layerExited) {
                break;
            }
            exitChallenge(player.value.col.challengeOrder.chalID[i]);
        }
    }
}