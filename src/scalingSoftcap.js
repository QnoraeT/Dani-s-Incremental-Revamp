"use strict";

function updateScaling(type) {
    tmp.value.scaleList = [[], [], [], []];
    if (tmp.value.scaling === undefined) { tmp.value.scaling = {}; };
    switch (type) {
        case "upg1":
            if (tmp.value.scaling.upg1 === undefined) { tmp.value.scaling.upg1 = [] };
            tmp.value.scaling.upg1[0] = { res: player.value.generators.upg1.bought, start: c.d20,  strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg1[1] = { res: player.value.generators.upg1.bought, start: c.e2,  strength: c.d1, bp: c.d3, type: 0 };
            // tmp.value.scaling.upg1[2] = { start: D(200), strength: c.d1, bp: c.d4, type: 1 };
            if (player.value.achievements.includes(3)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(2.5);
            }
            if (player.value.achievements.includes(7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(ACHIEVEMENT_DATA[7].eff());
            }
            if (player.value.generators.pr2.amount.gte(7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(c.d10div9);
            }
            break;
        case "upg2":
            if (tmp.value.scaling.upg2 === undefined) { tmp.value.scaling.upg2 = [] };
            tmp.value.scaling.upg2[0] = { res: player.value.generators.upg2.bought, start: c.d15, strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg2[1] = { res: player.value.generators.upg2.bought, start: c.e2, strength: c.d1, bp: c.d3, type: 0 };
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

    for (let i in tmp.value.scaling) {
        for (let j in tmp.value.scaling[i]) {
            if (tmp.value.scaling[i][j].res.gte(tmp.value.scaling[i][j].start)) {
                let k = { upg1: "Upgrade 1", upg2: "Upgrade 2", upg3: "Upgrade 3", pr2: "PR2" }[i]
                tmp.value.scaleList[j].push(`${k} - ${format(tmp.value.scaling[i][j].strength.mul(c.e2), 3)}% starting at ${format(tmp.value.scaling[i][j].start, 3)}`)
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
            break;
        case "upg3":
            if (tmp.value.softcap.upg3 === undefined) { tmp.value.softcap.upg3 = [] };
            tmp.value.softcap.upg3[0] = { start: D(8.5), strength: c.d1 };
            break;
        default:
            throw new Error(`updateSoftcap ${type} does not exist`);
    }
}