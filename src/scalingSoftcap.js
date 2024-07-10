"use strict";

const SCALE_ATTR = [
    { name: "Scaled",        color: `#3080FF` },
    { name: "Superscaled",   color: `#dfb600` },
    { name: "Hyper",         color: `#FF0060` },
    { name: "Atomic",        color: `#20BF3A` },
    { name: "Supercritical", color: `#8636FF` },
    { name: "Meta",          color: `#00C7F3` },
    { name: "Exotic",        color: `#FF8000` },
    { name: "Instant",       color: `#D0D0D0` },
    { name: "WTF",           get color() { return colorChange("#ffffff", Math.sin(otherGameStuffIg.sessionTime) ** 2, 1) } },
    { name: "Ultimate",      get color() { return gRC(otherGameStuffIg.sessionTime, 1, 1) } }
]

const SOFT_ATTR = [
    { name: "Softcap",         color: `#FF4040` },
    { name: "Super Softcap",   color: `#efc600` },
    { name: "Hyper Softcap",   color: `#6040FF` },
]

function updateScaling(type) {
    tmp.value.scaleList = [[], [], [], []];
    tmp.value.softList = [[], [], [], []];
    if (tmp.value.scaling === undefined) { tmp.value.scaling = {}; };
    switch (type) {
        case "upg1":
            if (tmp.value.scaling.upg1 === undefined) { tmp.value.scaling.upg1 = [] };
            tmp.value.scaling.upg1[0] = { res: player.value.generators.upgrades[0].bought, start: c.d20,  strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg1[1] = { res: player.value.generators.upgrades[0].bought, start: c.e2,   strength: c.d1, bp: c.d3, type: 0 };
            tmp.value.scaling.upg1[2] = { res: player.value.generators.upgrades[0].bought, start: c.d250, strength: c.d1, bp: c.d4, type: 1 };
            if (player.value.achievements.includes(3)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d2_5);
            }
            if (player.value.achievements.includes(7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(ACHIEVEMENT_DATA[7].eff);
            }
            if (Decimal.gte(player.value.generators.pr2.amount, c.d7)) {
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(c.d10div9);
            }

            tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.div(tmp.value.kuaEffects.upg1Scaling);

            if (Decimal.gte(player.value.generators.pr2.amount, c.d25) && Decimal.gte(player.value.kua.amount, c.d10)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d15);
                tmp.value.scaling.upg1[1].start = tmp.value.scaling.upg1[1].start.add(c.d15);
            }

            if (getKuaUpgrade("s", 4)) {
                tmp.value.scaling.upg1[0].start = tmp.value.scaling.upg1[0].start.add(c.d5);
                tmp.value.scaling.upg1[0].strength = tmp.value.scaling.upg1[0].strength.mul(c.d0_9);
                tmp.value.scaling.upg1[1].start = tmp.value.scaling.upg1[1].start.add(c.d2);
                tmp.value.scaling.upg1[1].strength = tmp.value.scaling.upg1[1].strength.mul(c.d0_95);
            }

            tmp.value.scaling.upg1[1].strength = tmp.value.scaling.upg1[1].strength.div(tmp.value.kuaEffects.upg1SuperScaling);

            if (getKuaUpgrade("p", 9)) {
                tmp.value.scaling.upg1[2].strength = tmp.value.scaling.upg1[2].strength.div(KUA_UPGRADES.KPower[8].eff);
            }
            break;
        case "upg2":
            if (tmp.value.scaling.upg2 === undefined) { tmp.value.scaling.upg2 = [] };
            tmp.value.scaling.upg2[0] = { res: player.value.generators.upgrades[1].bought, start: c.d15,  strength: c.d1, bp: c.d2, type: 0 };
            tmp.value.scaling.upg2[1] = { res: player.value.generators.upgrades[1].bought, start: c.e2,   strength: c.d1, bp: c.d3, type: 0 };
            tmp.value.scaling.upg2[2] = { res: player.value.generators.upgrades[1].bought, start: c.d500, strength: c.d1, bp: c.d4, type: 1 };

            if (Decimal.gte(player.value.generators.pr2.amount, c.d15)) {
                tmp.value.scaling.upg2[1].strength = tmp.value.scaling.upg2[1].strength.mul(c.d0_875);
            }

            if (Decimal.gte(player.value.generators.pr2.amount, c.d25) && Decimal.gte(player.value.kua.amount, c.d10)) {
                tmp.value.scaling.upg2[0].start = tmp.value.scaling.upg2[0].start.add(c.d15);
                tmp.value.scaling.upg2[1].start = tmp.value.scaling.upg2[1].start.add(c.d15);
            }

            if (getKuaUpgrade("s", 3)) {
                tmp.value.scaling.upg2[0].strength = tmp.value.scaling.upg2[0].strength.div(KUA_UPGRADES.KShards[2].eff)
            }

            if (Decimal.gte(player.value.generators.pr2.amount, c.d15)) {
                tmp.value.scaling.upg2[1].strength = tmp.value.scaling.upg2[1].strength.mul(c.d0_875);
            }

            if (getKuaUpgrade("s", 6)) {
                tmp.value.scaling.upg2[1].strength = tmp.value.scaling.upg2[1].strength.div(c.d1_5);
            }

            if (getKuaUpgrade("p", 9)) {
                tmp.value.scaling.upg2[2].strength = tmp.value.scaling.upg2[2].strength.div(KUA_UPGRADES.KPower[8].eff);
            }
            break;
        case "upg3":
            if (tmp.value.scaling.upg3 === undefined) { tmp.value.scaling.upg3 = [] };
            tmp.value.scaling.upg3[0] = { res: player.value.generators.upgrades[2].bought, start: c.d50, strength: c.d1, bp: c.d2, type: 0 };
            break;
        case "upg4":
            if (tmp.value.scaling.upg4 === undefined) { tmp.value.scaling.upg4 = [] };
            tmp.value.scaling.upg4[0] = { res: player.value.generators.upgrades[3].bought, start: c.e4, strength: c.d1, bp: c.d2, type: 2 };
            break;
        case "upg5":
            if (tmp.value.scaling.upg5 === undefined) { tmp.value.scaling.upg5 = [] };
            tmp.value.scaling.upg5[0] = { res: player.value.generators.upgrades[4].bought, start: c.e4, strength: c.d1, bp: c.d2, type: 2 };
            break;       
        case "upg6":
            if (tmp.value.scaling.upg6 === undefined) { tmp.value.scaling.upg6 = [] };
            tmp.value.scaling.upg6[0] = { res: player.value.generators.upgrades[5].bought, start: c.e4, strength: c.d1, bp: c.d2, type: 2 };
            break;
        case "pr2":
            if (tmp.value.scaling.pr2 === undefined) { tmp.value.scaling.pr2 = [] };
            tmp.value.scaling.pr2[0] = { res: player.value.generators.pr2.amount, start: c.d10, strength: c.d1, bp: c.d1_5, type: 0 };
            tmp.value.scaling.pr2[1] = { res: player.value.generators.pr2.amount, start: c.d20, strength: c.d1, bp: c.d3,   type: 0 };
            tmp.value.scaling.pr2[2] = { res: player.value.generators.pr2.amount, start: c.e2,  strength: c.d1, bp: c.d1_1, type: 1.3 };
            break;
        default:
            throw new Error(`updateScaling ${type} does not exist`);
    }
}

function updateSoftcap(type) {
    if (tmp.value.softcap === undefined) { tmp.value.softcap = {}; };
    switch (type) {
        case "points":
            if (tmp.value.softcap.points === undefined) { tmp.value.softcap.points = [] };
            tmp.value.softcap.points[0] = { red: "", res: Decimal.pow(player.value.points ?? c.d0, c.d1_23301886).log10(), start: c.logInf, strength: c.d1 };
            break;
        case "upg1":
            if (tmp.value.softcap.upg1 === undefined) { tmp.value.softcap.upg1 = [] };
            tmp.value.softcap.upg1[0] = { red: "", res: Decimal.pow(tmp.value.upgrades[0].effect ?? c.d0, c.d2), start: c.e100, strength: c.d1 };
            break;
        case "upg2":
            if (tmp.value.softcap.upg2 === undefined) { tmp.value.softcap.upg2 = [] };
            tmp.value.softcap.upg2[0] = { red: "", res: Decimal.pow(tmp.value.upgrades[1].effect ?? c.d0, c.d2), start: c.d10, strength: c.d1 };

            if (getKuaUpgrade("p", 4)) {
                tmp.value.softcap.upg2[0].start = tmp.value.softcap.upg2[0].start.mul(KUA_UPGRADES.KPower[3].eff);
                tmp.value.softcap.upg2[0].strength = tmp.value.softcap.upg2[0].strength.mul(c.d0_6);
            }

            if (getKuaUpgrade("s", 6)) {
                tmp.value.softcap.upg2[0].strength = tmp.value.softcap.upg2[0].strength.div(c.d1_5);
            }

            if (player.value.achievements.includes(18)) {
                tmp.value.softcap.upg2[0].strength = tmp.value.softcap.upg2[0].strength.mul(c.d0_95);
            }

            tmp.value.softcap.upg2[0].start = tmp.value.softcap.upg2[0].start.mul(tmp.value.kuaEffects.upg2Softcap);
            tmp.value.softcap.upg2[1] = { red: "", res: Decimal.pow(tmp.value.upgrades[1].effect ?? c.d0, c.d2), start: c.e2500, strength: c.d1 };
            break;
        case "upg3":
            if (tmp.value.softcap.upg3 === undefined) { tmp.value.softcap.upg3 = [] };
            tmp.value.softcap.upg3[0] = { red: "", res: Decimal.mul(tmp.value.upgrades[2].effect ?? c.d0, c.d2), start: c.d8_5, strength: c.d1 };
            break;
        case "upg4":
            if (tmp.value.softcap.upg4 === undefined) { tmp.value.softcap.upg4 = [] };
            tmp.value.softcap.upg4[0] = { red: "", res: Decimal.pow(tmp.value.upgrades[3].effect ?? c.d0, c.d2), start: c.e100, strength: c.d1 };
            break;
        case "upg5":
            if (tmp.value.softcap.upg5 === undefined) { tmp.value.softcap.upg5 = [] };
            tmp.value.softcap.upg5[0] = { red: "", res: Decimal.pow(tmp.value.upgrades[4].effect ?? c.d0, c.d2), start: c.ee3, strength: c.d1 };
            break;
        case "upg6":
            if (tmp.value.softcap.upg6 === undefined) { tmp.value.softcap.upg6 = [] };
            tmp.value.softcap.upg6[0] = { red: "", res: Decimal.mul(tmp.value.upgrades[5].effect ?? c.d0, c.d2), start: c.d2, strength: c.d1 };
            break;
        default:
            throw new Error(`updateSoftcap ${type} does not exist`);
    }
}