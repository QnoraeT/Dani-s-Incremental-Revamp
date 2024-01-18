function updateScaling(type) {
    if (tmp.scaling === undefined) { tmp.scaling = {}; };
    switch (type) {
        case "upg1":
            if (tmp.scaling.upg1 === undefined) { tmp.scaling.upg1 = [] };
            tmp.scaling.upg1[0] = { start: D(20),  strength: D(1), bp: D(2), type: 0 };
            tmp.scaling.upg1[1] = { start: D(100),  strength: D(1), bp: D(3), type: 0 };
            // tmp.scaling.upg1[2] = { start: D(200), strength: D(1), bp: D(4), type: 1 };
            if (player.achievements.includes(3)) {
                tmp.scaling.upg1[0].start = tmp.scaling.upg1[0].start.add(2.5);
            }
            if (player.achievements.includes(7)) {
                tmp.scaling.upg1[0].strength = tmp.scaling.upg1[0].strength.div(ACHIEVEMENT_DATA[7].eff());
            }
            break;
        case "upg2":
            if (tmp.scaling.upg2 === undefined) { tmp.scaling.upg2 = [] };
            tmp.scaling.upg2[0] = { start: D(15), strength: D(1), bp: D(2), type: 0 };
            // tmp.scaling.upg2[1] = { start: D(30), strength: D(1), bp: D(3), type: 0 };
            break;
        case "upg3":
            if (tmp.scaling.upg3 === undefined) { tmp.scaling.upg3 = [] };
            tmp.scaling.upg3[0] = { start: D(25), strength: D(1), bp: D(2), type: 0 };
            break;
        case "pr2":
            if (tmp.scaling.pr2 === undefined) { tmp.scaling.pr2 = [] };
            tmp.scaling.pr2[0] = { start: D(10), strength: D(1), bp: D(2), type: 0 };
            // tmp.scaling.pr2[1] = { start: D(20), strength: D(1), bp: D(3), type: 0 };
            // tmp.scaling.pr2[2] = { start: D(45), strength: D(1), bp: D(4), type: 1 };
            break;
        default:
            throw new Error(`updateScaling ${type} does not exist`);
    }
}

function updateSoftcap(type) {
    if (tmp.softcap === undefined) { tmp.softcap = {}; };
    switch (type) {
        case "upg2":
            if (tmp.softcap.upg2 === undefined) { tmp.softcap.upg2 = [] };
            tmp.softcap.upg2[0] = { start: D(10), strength: D(1) };
            break;
        case "upg3":
            if (tmp.softcap.upg3 === undefined) { tmp.softcap.upg3 = [] };
            tmp.softcap.upg3[0] = { start: D(8.5), strength: D(1) };
            break;
        default:
            throw new Error(`updateSoftcap ${type} does not exist`);
    }
}