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
        reward: `Unlock another tab in this tab, and every KPower Upgrade above 10 unlocks a new challenge.`,
        cap: c.d1,
        show: true,
        get canComplete() { return Decimal.gte(player.value.points, this.goal) },
        get progress() { return Decimal.min(c.d1, player.value.points.max(c.d1).log10().div(this.goal.log10())) },
        get progDisplay() { return `${format(player.value.points)} / ${format(this.goal)} (${format(this.progress.mul(c.e2), 3)}%)` }
    },

}

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
    if (!inChallenge(id)) { return c.d0; }
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
    player.value.generators.pr2 = player.value.col.saved[id].pr2;
    player.value.generators.prai = player.value.col.saved[id].prai;
    player.value.kua = player.value.col.saved[id].kua;
    player.value.auto.upg1 = player.value.col.saved[id].auto.upg1;
    player.value.auto.upg2 = player.value.col.saved[id].auto.upg2;
    player.value.auto.upg3 = player.value.col.saved[id].auto.upg3;
    player.value.auto.prai = player.value.col.saved[id].auto.prai;
}

function updateAllCol() {
    updateCol("col");
}

function updateCol(type) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "col":
            if (Decimal.lte(player.value.col.time, 0) && player.value.col.inAChallenge) {
                for (let i = player.value.col.challengeOrder.chalID.length - 1; i >= 0; i--) {
                    exitChallenge(player.value.col.challengeOrder.chalID[i]);
                }
            }

            tmp.value.colPow = c.d0_4;

            i = Decimal.max(player.value.kua.best, c.e2).div(c.e2).pow(tmp.value.colPow);
            tmp.value.colosseumPowerGeneration = i;

            i = Decimal.max(player.value.col.power, c.e2).log10().mul(c.d20);
            player.value.col.maxTime = i;

            player.value.col.inAChallenge = false;
            for (i in player.value.inChallenge) {
                j = false;
                player.value.inChallenge[i].trapped = j;

                j = false;
                if (player.value.inChallenge[i].entered || player.value.inChallenge[i].trapped) { j = true; }
                if (j) { player.value.col.inAChallenge = true; }
                player.value.inChallenge[i].overall = j;
                
                j = c.d0;
                if (player.value.inChallenge[i].entered || player.value.inChallenge[i].trapped) { j = c.d1; }
                player.value.inChallenge[i].depth = j;
            }

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
            kua: {
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
                upg3: player.value.auto.upg3,
                upg2: player.value.auto.upg2,
                upg1: player.value.auto.upg1
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
            player.value.col.completed[id] = player.value.col.completed[id].add(c.d1);
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