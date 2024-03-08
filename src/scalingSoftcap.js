"use strict";

function updateScaling(type) {
    tmp.value.scaleList = [[], [], [], []];
    if (tmp.value.scaling === undefined) { tmp.value.scaling = {}; };
    switch (type) {
        case "upg1":
            if (tmp.value.scaling.upg1 === undefined) { tmp.value.scaling.upg1 = [] };
            tmp.value.scaling.upg1[0] = { res: player.value.generators.upg1.bought, start: c.d20,  strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg1[1] = { res: player.value.generators.upg1.bought, start: c.e2,   strength: c.d1, bp: c.d3, type: 0 };
            tmp.value.scaling.upg1[2] = { res: player.value.generators.upg1.bought, start: c.d250, strength: c.d1, bp: c.d4, type: 1 };
            if (player.value.achievements.includes(3)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d2_5);
            }
            if (player.value.achievements.includes(7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(ACHIEVEMENT_DATA[7].eff());
            }
            if (player.value.generators.pr2.amount.gte(c.d7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(c.d10div9);
            }

            tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(tmp.value.kuaEffects.upg1Scaling);

            if (player.value.generators.pr2.amount.gte(c.d25) && player.value.kua.amount.gte(c.d10)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d15);
                tmp.value.scaling.upg1[1].start = tmp.value.scaling.upg1[1].start.add(c.d15);
            }

            if (player.value.kua.kshards.upgrades >= 4) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d10);
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.mul(c.d0_8);
                tmp.value.scaling.upg1[1].start = tmp.value.scaling.upg1[1].start.add(c.d5);
                tmp.value.scaling.upg1[1].strength = tmp.value.scaling.upg1[1].strength.mul(c.d0_9);
            }
            break;
        case "upg2":
            if (tmp.value.scaling.upg2 === undefined) { tmp.value.scaling.upg2 = [] };
            tmp.value.scaling.upg2[0] = { res: player.value.generators.upg2.bought, start: c.d15, strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg2[1] = { res: player.value.generators.upg2.bought, start: c.e2, strength: c.d1, bp: c.d3, type: 0 };

            if (player.value.generators.pr2.amount.gte(c.d15)) {
                tmp.value.scaling.upg2[1].strength = tmp.value.scaling.upg2[1].strength.mul(c.d0_875);
            }

            if (player.value.generators.pr2.amount.gte(c.d25) && player.value.kua.amount.gte(c.d10)) {
                tmp.value.scaling.upg2[0].start = tmp.value.scaling.upg2[0].start.add(c.d15);
                tmp.value.scaling.upg2[1].start = tmp.value.scaling.upg2[1].start.add(c.d15);
            }
            break;
        case "upg3":
            if (tmp.value.scaling.upg3 === undefined) { tmp.value.scaling.upg3 = [] };
            tmp.value.scaling.upg3[0] = { res: player.value.generators.upg3.bought, start: c.d50, strength: c.d1, bp: c.d2, type: 0 };
            break;
        case "pr2":
            if (tmp.value.scaling.pr2 === undefined) { tmp.value.scaling.pr2 = [] };
            tmp.value.scaling.pr2[0] = { res: player.value.generators.pr2.amount, start: c.d10, strength: c.d1, bp: c.d2, type: 0 };
            // tmp.value.scaling.pr2[1] = { start: c.d20, strength: c.d1, bp: c.d3, type: 0 };
            // tmp.value.scaling.pr2[2] = { start: D(45), strength: c.d1, bp: c.d4, type: 1 };
            break;
        default:
            throw new Error(`updateScaling ${type} does not exist`);
    }

    // TODO: apparently this fucks the performance but its too interesting for me to remove :c
    let k = { upg1: "Upgrade 1", upg2: "Upgrade 2", upg3: "Upgrade 3", pr2: "PR2" }
    for (let i in tmp.value.scaling) {
        for (let j in tmp.value.scaling[i]) {
            if (tmp.value.scaling[i][j].res.gte(tmp.value.scaling[i][j].start)) {
                tmp.value.scaleList[j].push(`${k[i]} - ${format(tmp.value.scaling[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.scaling[i][j].start, 3)}`)
            }
        }
    }
}

function updateSoftcap(type) {
    if (tmp.value.softcap === undefined) { tmp.value.softcap = {}; };
    switch (type) {
        case "upg2":
            if (tmp.value.softcap.upg2 === undefined) { tmp.value.softcap.upg2 = [] };
            tmp.value.softcap.upg2[0] = { start: c.d10, strength: c.d1 };

            if (tmp.value.softcap.upg2 === undefined) { tmp.value.softcap.upg2 = [] };
            tmp.value.softcap.upg2[0] = { start: c.d10, strength: c.d1 };
            if (player.value.kua.kpower.upgrades >= 4) {
                tmp.value.softcap.upg2[0].start = tmp.value.softcap.upg2[0].start.mul(KUA_UPGRADES.KPower[3].eff());
                tmp.value.softcap.upg2[0].strength = tmp.value.softcap.upg2[0].strength.mul(c.d0_6);
            }
            break;
        case "upg3":
            if (tmp.value.softcap.upg3 === undefined) { tmp.value.softcap.upg3 = [] };
            tmp.value.softcap.upg3[0] = { start: c.d8_5, strength: c.d1 };
            break;
        default:
            throw new Error(`updateSoftcap ${type} does not exist`);
    }
}