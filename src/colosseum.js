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
        show: true
    }
}

function updateAllCol() {
    updateCol("col");
}

function updateCol(type) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "col":
            tmp.value.colPow = c.d0_4;

            i = player.value.kua.best.max(c.e2).div(c.e2).pow(tmp.value.colPow);
            tmp.value.colosseumPowerGeneration = i;

            i = player.value.col.power.max(c.e2).log10().mul(c.d20);
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
    if (player.value.inChallenge[id] === undefined || (!player.value.inChallenge[id].entered ?? false)) {
        console.log(`entered challenge ${id}`);
        player.value.inChallenge[id] = {
            name: COL_CHALLENGES[id].name,
            goal: COL_CHALLENGES[id].goalDesc,
            entered: true
        }

        // unsure of the order to do resave the data
        // ideas
        // saveID = 0 for the first in challenge
        // pushes the challenge id to "player.value.col.challengeOrder"
        // ['sg']
        // being in a nested challenge increases saveID by 1
        // Scaled Generation (Blessing layer, 0) -> No Kua (Kua layer, 1)
        // ['sg', 'nk']
        // if exit Scaled Generation, exit No Kua and load the save (but maybe don't do this as it'll get replaced instantly), then Scaled Generation then load that data
        // ['sg', 'nk'] -> ['sg'] -> []
        // if exit No Kua, exit No Kua and load the save
        // ['sg', 'nk'] -> ['sg'] 
        /**
         * example 2:
         * Eternity (l3) + Infinity (l3) + Scaled Gen (l2) + Nerfed PRai (l2) + No Kua (l1)
         * ['etrn', 'inf', 'sg', 'npr', 'nk']
         * toggle 'hf' (l1)
         * cannot find hf, so you're not in that challenge, maybe add it and save the data to 'nk'?
         * ['etrn', 'inf', 'sg', 'npr', 'nk', 'hf']
         * toggle npr
         * exit hf, nk, and npr
         * load npr's save data
         * ['etrn', 'inf', 'sg']
         * toggle nf and nk
         * 
         */

        // i couldn't find a good way to do this, also structuredClone() didn't work for some reason
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
            auto: {
                prai: player.value.auto.prai,
                upg3: player.value.auto.upg3,
                upg2: player.value.auto.upg2,
                upg1: player.value.auto.upg1
            }
        }
        player.value.col.saved[id] = obj;
        player.value.col.challengeOrder.push({name: COL_CHALLENGES[id].id, layer: COL_CHALLENGES[id].layer})

        reset("col", true)
    } else {
        console.log(`exited challenge ${id}`);
        player.value.inChallenge.entered = false;
        player.value.generators.pr2 = player.value.col.saved[id].pr2;
        player.value.kua = player.value.col.saved[id].kua;
        player.value.auto.upg1 = player.value.col.saved[id].auto.upg1;
        player.value.auto.upg2 = player.value.col.saved[id].auto.upg2;
        player.value.auto.upg3 = player.value.col.saved[id].auto.upg3;
        player.value.auto.prai = player.value.col.saved[id].auto.prai;
    }
    updateAllCol()
}