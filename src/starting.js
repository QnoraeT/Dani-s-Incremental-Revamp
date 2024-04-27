"use strict";
// NOTE: ALL INFORMATION USED BY OTHER EFFECTS MUST BE STORED IN THE PLAYER VARIABLE!! LEAVING IT IN TMP WILL BREAK THINGS BECAUSE THEY OULD BE LEFT UNDEFINED!
// NOTE: Do not test updateProgression(x) because sometimes that could cause infinite loops

const PR2_EFF = [
    {
        show: true,
        when: c.d1,
        get text() { return `you gain a new upgrade and make PRai resets unforced.` }
    },
    {
        show: true,
        when: c.d2,
        get text() { return `unlock the Upgrade 1 Autobuyer.` }
    },
    {
        show: true,
        when: c.d4,
        get text() { return `unlock the Upgrade 2 Autobuyer and increase the Upgrade 2 base from ${format(c.d1_2, 3)}x -> ${format(c.d1_3, 3)}x.`}
    },
    {
        show: true,
        when: c.d5,
        get text() { return `unlock Upgrade 3.`}
    },
    {
        show: true,
        when: c.d7,
        get text() { return `weaken the Upgrade 1 scaling by ${formatPerc(c.d10div9, 3)}`}
    },
    {
        show: true,
        when: c.d10,
        get text() { return `unlock a new layer`}
    },
    {
        show: true,
        when: c.d11,
        get text() { return `slow down Upgrade 3 cost by ${formatPerc(c.d10div9, 3)}`}
    },
    {
        show: true,
        when: c.d12,
        get text() { return `unlock the Upgrade 1 B-Side autobuyer.`}
    },
    {
        show: true,
        when: c.d14,
        get text() { return `unlock the Upgrade 2 B-Side autobuyer.`}
    },
    {
        show: true,
        when: c.d15,
        get text() { return `decrease Upgrade 2's superscaling strength by ${formatPerc(c.d8div7, 3)}`}
    },
    {
        show: true,
        when: c.d18,
        get text() { return `unlock the Upgrade 3 B-Side autobuyer.`}
    },
    {
        show: true,
        when: c.d20,
        get text() { return `weaken Upgrade 1's cost scaling by ${format(c.d10, 3)}%`}
    },
    {
        get show() { return Decimal.gte(player.value.kua.amount, c.d10); },
        when: c.d25,
        get text() { return `makes upgrade 1 and 2's scaling and super scaling start ${format(c.d15, 1)} later`}
    },
    {
        get show() { return getKuaUpgrade("s", 11) },
        when: c.d31,
        get text() { return `boosts Kuaraniai effects based on how much PR2 you have`}
    },
]

function buyGenUPG(id){
    if (Decimal.gte(player.value.points, tmp.value.upgrades[id].cost)) {
        player.value.points = Decimal.sub(player.value.points, tmp.value.upgrades[id].cost);
        player.value.generators.upgrades[id].bought = Decimal.add(player.value.generators.upgrades[id].bought, c.d1);
    }
}

function updateAllStart() {
    if (tmp.value.upgrades === undefined) { 
        tmp.value.upgrades = [] 
        for (let i = player.value.generators.upgrades.length - 1; i >= 0; i--) {
            tmp.value.upgrades.push({})
        }
    };

    updateStart("pr2");
    updateStart("prai");
    for (let i = player.value.generators.upgrades.length - 1; i >= 0; i--) {
        updateStart(i);
    }
}

const BASIC_UPGS = [
    {
        get freeExtra() {
            let i = c.d0;
            return i;
        },
        get effectBase() {
            let i = c.d1_5;
            i = i.add(tmp.value.upgrades[2].effect ?? c.d0);
            i = i.add(tmp.value.upgrades[5].effect ?? c.d0);
            if (player.value.achievements.includes(22)) {
                i = i.mul(c.d1_01);
            }
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            if (player.value.achievements.includes(16)) {
                i = i.mul(ACHIEVEMENT_DATA[16].eff);
            }
            return i;
        },
        effect(x = player.value.generators.upgrades[0].bought) {
            let i = this.effective(x), j, sta, pow;

            i = this.effectBase.pow(i);
            if (getKuaUpgrade("p", 8)) {
                i = i.max(c.d1).dilate(c.d1_01);
            }
            j = i;
            sta = tmp.value.softcap.upg1[0].start;
            pow = tmp.value.softcap.upg1[0].strength;
            i = scale(i, 2.1, false, sta, pow, c.d0_5);
            tmp.value.softcap.upg1[0].red = `^${format(i.log(j), 3)}`;
            return i;
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[0].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[0].bought, c.d1)).div(this.effect());
            }
        },
        shown: true,
        get auto() {
            return Decimal.gte(player.value.generators.pr2.best, c.d2);
        },
        get display() {
            return `Increase point gain by ${format(this.calcEB, 2)}x`;
        },
        get totalDisp() {
            return `Total: ${format(this.effect(), 2)}x to point gain`;
        }
    },
    {
        get freeExtra() {
            let i = c.d0;
            return i;
        },
        get effectBase() {
            let i = c.d1_2;
            if (Decimal.gte(player.value.generators.pr2.amount, c.d4)) {
                i = i.add(c.d0_1);
            }
            if (getKuaUpgrade("s", 5)) {
                i = i.mul(c.d1_125);
            }
            if (getKuaUpgrade("p", 1)) {
                i = i.add(KUA_UPGRADES.KPower[0].eff);
            }
            if (player.value.achievements.includes(22)) {
                i = i.mul(c.d1_01);
            }
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            return i;
        },
        effect(x = player.value.generators.upgrades[1].bought) {
            let i = this.effective(x), j, sta, pow;

            i = this.effectBase.pow(i);
            j = i;
            sta = tmp.value.softcap.upg2[0].start;
            pow = tmp.value.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            tmp.value.softcap.upg2[0].red = `/${format(j.div(i), 2)}`;
            if (getKuaUpgrade("p", 7)) {
                i = i.pow(c.d3);
            }
            return i;
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[1].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[1].bought, c.d1)).div(this.effect());
            }
        },
        get shown() {
            return Decimal.gte(player.value.generators.pr2.best, c.d1);
        },
        get auto() {
            return Decimal.gte(player.value.generators.pr2.best, c.d4);
        },
        get display() {
            return `Decreases Upgrade 1's cost by ${format(this.calcEB, 2)}x`;
        },
        get totalDisp() {
            return `Total: /${format(this.effect(), 2)} to Upgrade 1's cost`;
        }
    },
    {
        get freeExtra() {
            let i = c.d0;
            return i;
        },
        get effectBase() {
            let i = c.em2;
            if (player.value.achievements.includes(22)) {
                i = i.mul(c.d1_01);
            }
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            if (getKuaUpgrade("p", 2)) {
                i = i.mul(KUA_UPGRADES.KPower[1].eff);
            }
            if (player.value.achievements.includes(15)) {
                i = i.mul(c.d1_01);
            }
            return i;
        },
        effect(x = player.value.generators.upgrades[2].bought) {
            let i = this.effective(x), j, sta, pow;

            i = this.effectBase.mul(i);
            j = i;
            sta = tmp.value.softcap.upg3[0].start;
            pow = tmp.value.softcap.upg3[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            tmp.value.softcap.upg3[0].red = `/${format(j.div(i), 2)}`;
            return i;
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[2].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[2].bought, c.d1)).sub(this.effect());
            }
        },
        get shown() {
            return Decimal.gte(player.value.generators.pr2.best, c.d5);
        },
        get auto() {
            return getKuaUpgrade('s', 5);
        },
        get display() {
            return `Increases Upgrade 1's base by +${format(this.calcEB, 2)}`;
        },
        get totalDisp() {
            return `Total: +${format(this.effect(), 2)} to Upgrade 1's base`;
        }
    },
    {
        get freeExtra() {
            let i = c.d0;
            return i;
        },
        get effectBase() {
            let i = tmp.value.kuaEffects.up4;
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            return i;
        },
        effect(x = player.value.generators.upgrades[3].bought) {
            let i = this.effective(x);

            i = this.effectBase.pow(i);
            return i;
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[3].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[3].bought, c.d1)).div(this.effect());
            }
        },
        get shown() {
            return Decimal.gt(player.value.kua.amount, c.d0);
        },
        get auto() {
            return Decimal.gte(player.value.generators.pr2.best, c.d12);
        },
        get display() {
            return `Increase point gain by ${format(this.calcEB, 2)}x`;
        },
        get totalDisp() {
            return `Total: ${format(this.effect(), 2)}x to point gain`;
        }
    },
    {
        get freeExtra() {
            let i = c.d0;
            return i;
        },
        get effectBase() {
            let i = tmp.value.kuaEffects.up5;
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            return i;
        },
        effect(x = player.value.generators.upgrades[4].bought) {
            let i = this.effective(x);

            i = this.effectBase.pow(i);
            return i;
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[4].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[4].bought, c.d1)).div(this.effect());
            }
        },
        get shown() {
            return Decimal.gte(player.value.kua.kshards.amount, c.em2);
        },
        get auto() {
            return Decimal.gte(player.value.generators.pr2.best, c.d14);
        },
        get display() {
            return `Decreases Upgrade 1's cost by ${format(this.calcEB, 2)}x`;
        },
        get totalDisp() {
            return `Total: /${format(this.effect(), 2)} to Upgrade 1's cost`;
        }
    },
    {
        get freeExtra() {
            let i = c.d0;
            return i
        },
        get effectBase() {
            let i = tmp.value.kuaEffects.up6;
            return i;
        },
        effective(x) {
            let i = D(x);
            i = i.add(this.freeExtra);
            return i
        },
        effect(x = player.value.generators.upgrades[5].bought) {
            let i = this.effective(x);

            i = this.effectBase.mul(i);
            return i
        },
        get calcEB() {
            if (Decimal.gte(this.effective(player.value.generators.upgrades[5].bought), c.e10)) {
                return this.effectBase;
            } else {
                return this.effect(Decimal.add(player.value.generators.upgrades[5].bought, c.d1)).sub(this.effect());
            }
        },
        get shown() {
            return Decimal.gte(player.value.kua.kpower.amount, c.d1);
        },
        get auto() {
            return Decimal.gte(player.value.generators.pr2.best, c.d18);
        },
        get display() {
            return `Increases Upgrade 1's base by +${format(this.calcEB, 2)}`;
        },
        get totalDisp() {
            return `Total: +${format(this.effect(), 2)} to Upgrade 1's base`;
        }
    },
]
/**
 * this is expected to be ran from 5 -> 4 -> 3 -> ... !
 * @param {*} staID 
 */
function updateStart(staID) { 
    let scal, pow, sta, i, j;
    switch (staID) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            updateScaling(`upg${staID + 1}`);
            updateSoftcap(`upg${staID + 1}`);

            tmp.value.upgrades[staID].costBase = [
                {exp: 0, scale: [c.d5,   c.d1_55,  c.d1]},
                {exp: 0, scale: [c.e3,   c.d1_25,  c.d1]},
                {exp: 0, scale: [c.e10,  c.e2,     c.d1_05]},
                {exp: 0, scale: [c.e13,  c.d1_05,  c.d1_0005]},
                {exp: 0, scale: [c.e20,  c.d1_075, c.d1_0004]},
                {exp: 0, scale: [c.e33,  c.d2,     c.d1_025]},
            ][staID];

            if (staID === 0) {
                if (getKuaUpgrade("s", 7)) {
                    tmp.value.upgrades[staID].costBase.scale[0] = tmp.value.upgrades[staID].costBase.scale[0].sub(c.d0_05);
                }
            }
            scal = D(player.value.generators.upgrades[staID].bought);
            if (staID === 2) {
                if (getKuaUpgrade("s", 7)) {
                    scal = scal.div(c.d10div9);
                }
            }
            scal = doAllScaling(scal, tmp.value.scaling[`upg${staID + 1}`], false);
            if (staID === 0) {
                if (player.value.achievements.includes(17)) {
                    scal = scal.div(ACHIEVEMENT_DATA[17].eff);
                }
                if (getKuaUpgrade("p", 10)) {
                    scal = scal.div(KUA_UPGRADES.KPower[9].eff)
                }
            }
            if (staID === 1) {
                if (player.value.achievements.includes(17)) {
                    scal = scal.div(ACHIEVEMENT_DATA[17].eff);
                }
                if (getKuaUpgrade("s", 9)) {
                    scal = scal.sub(KUA_UPGRADES.KShards[8].eff);
                }
                if (getKuaUpgrade("p", 10)) {
                    scal = scal.div(KUA_UPGRADES.KPower[9].eff)
                }
            }
            if (staID === 2) {
                if (player.value.achievements.includes(17)) {
                    scal = scal.div(ACHIEVEMENT_DATA[17].eff);
                }
            }

            tmp.value.upgrades[staID].cost = Decimal.pow(tmp.value.upgrades[staID].costBase.scale[2], scal.pow(c.d2)).mul(Decimal.pow(tmp.value.upgrades[staID].costBase.scale[1], scal)).mul(tmp.value.upgrades[staID].costBase.scale[0]).layeradd10(tmp.value.upgrades[staID].costBase.exp);

            if (staID === 0) {
                tmp.value.upgrades[staID].cost = tmp.value.upgrades[staID].cost.div(tmp.value.upgrades[1].effect ?? c.d1);
                tmp.value.upgrades[staID].cost = tmp.value.upgrades[staID].cost.div(tmp.value.upgrades[4].effect ?? c.d1);
            }

            tmp.value.upgrades[staID].target = c.d0;
            if (Decimal.gte(player.value.points, tmp.value.upgrades[staID].costBase.scale[0])) {
                i = D(player.value.points);
                if (staID === 0) {
                    i = i.mul(tmp.value.upgrades[4].effect ?? c.d1);
                    i = i.mul(tmp.value.upgrades[1].effect ?? c.d1);
                }

                scal = inverseQuad(i.layeradd10(-tmp.value.upgrades[staID].costBase.exp).log10(), tmp.value.upgrades[staID].costBase.scale[2].log10(), tmp.value.upgrades[staID].costBase.scale[1].log10(), tmp.value.upgrades[staID].costBase.scale[0].log10());

                if (staID === 2) {
                    if (player.value.achievements.includes(17)) {
                        scal = scal.mul(ACHIEVEMENT_DATA[17].eff);
                    }
                }
                if (staID === 1) {
                    if (getKuaUpgrade("p", 10)) {
                        scal = scal.mul(KUA_UPGRADES.KPower[9].eff)
                    }
                    if (getKuaUpgrade("s", 9)) {
                        scal = scal.add(KUA_UPGRADES.KShards[8].eff);
                    }
                    if (player.value.achievements.includes(17)) {
                        scal = scal.mul(ACHIEVEMENT_DATA[17].eff);
                    }
                }
                if (staID === 0) {
                    if (getKuaUpgrade("p", 10)) {
                        scal = scal.mul(KUA_UPGRADES.KPower[9].eff)
                    }
                    if (player.value.achievements.includes(17)) {
                        scal = scal.mul(ACHIEVEMENT_DATA[17].eff);
                    }
                }
                scal = doAllScaling(scal, tmp.value.scaling[`upg${staID + 1}`], true);
                if (staID === 2) {
                    if (getKuaUpgrade("s", 7)) {
                        scal = scal.mul(c.d10div9);
                    }
                }
                tmp.value.upgrades[staID].target = scal;
            }

            tmp.value.upgrades[staID].effect = BASIC_UPGS[staID].effect();
            tmp.value.upgrades[staID].freeExtra = BASIC_UPGS[staID].freeExtra;
            tmp.value.upgrades[staID].effectBase = BASIC_UPGS[staID].effectBase;
            tmp.value.upgrades[staID].calculatedEB = BASIC_UPGS[staID].calcEB;

            tmp.value.upgrades[staID].effectColor = `#FFFFFF`
            for (let i = tmp.value.softcap[`upg${staID + 1}`].length - 1; i >= 0; i--) {
                if (Decimal.gte(tmp.value.upgrades[staID].effect, tmp.value.softcap[`upg${staID + 1}`][i].start)) {
                    tmp.value.upgrades[staID].effectColor = SOFT_ATTR[i].color;
                    break;
                }
            }

            tmp.value.upgrades[staID].costColor = `#FFFFFF`
            for (let i = tmp.value.scaling[`upg${staID + 1}`].length - 1; i >= 0; i--) {
                if (Decimal.gte(player.value.generators.upgrades[staID].bought, tmp.value.scaling[`upg${staID + 1}`][i].start)) {
                    tmp.value.upgrades[staID].costColor = SCALE_ATTR[i].color;
                    break;
                }
            }

            if (player.value.auto.upgrades[staID]) {
                player.value.generators.upgrades[staID].bought = Decimal.max(player.value.generators.upgrades[staID].bought, tmp.value.upgrades[staID].target.add(c.d1).floor());
            }

            tmp.value.upgrades[staID].canBuy = Decimal.gte(player.value.points, tmp.value.upgrades[staID].cost);
            player.value.generators.upgrades[staID].best = Decimal.max(player.value.generators.upgrades[staID].best, player.value.generators.upgrades[staID].bought);

            setAchievement(0,  Decimal.gte(player.value.generators.upgrades[0].bought, c.d1));
            setAchievement(1,  Decimal.gte(player.value.generators.upgrades[0].bought, c.d20));
            setAchievement(10, Decimal.gte(player.value.generators.upgrades[0].bought, c.e2));
            setAchievement(16, Decimal.gte(player.value.generators.upgrades[0].bought, c.e2)   && Decimal.eq(player.value.generators.prai.totalInKua, c.d0));
            setAchievement(21, Decimal.gte(player.value.generators.upgrades[0].bought, c.d300) && Decimal.eq(player.value.generators.prai.totalInKua, c.d0));
            setAchievement(23, Decimal.gte(player.value.generators.upgrades[0].bought, c.d300) && Decimal.eq(player.value.generators.upgrades[1].bought, c.d0));
            setAchievement(5,  Decimal.gte(tmp.value.upgrades[1].effect, c.d15));
            setAchievement(18, Decimal.gte(tmp.value.upgrades[1].effect, c.e17));
            setAchievement(15, Decimal.gte(player.value.points, c.e80) && Decimal.eq(player.value.generators.upgrades[2].bought, c.d0));
            break;
        case "prai":
            tmp.value.praiReq = c.e6;
            tmp.value.praiExp = c.d1div3;
            if (player.value.achievements.includes(19)) {
                tmp.value.praiExp = c.d0_35;
            }
            tmp.value.praiDil = c.d0_9;

            if (Decimal.gte(player.value.generators.pr2.amount, c.d1) && Decimal.gte(player.value.totalPointsInPRai, tmp.value.praiReq)) {
                i = D(player.value.totalPointsInPRai);
                i = i.max(c.d0).div(tmp.value.praiReq).pow(tmp.value.praiExp).sub(c.d1).mul(tmp.value.praiExp).add(c.d1).dilate(tmp.value.praiDil);
                i = i.mul(player.value.generators.pr2.effect);
                if (player.value.achievements.includes(23)) {
                    i = i.mul(ACHIEVEMENT_DATA[23].eff);
                }
                if (getKuaUpgrade("s", 8)) {
                    i = i.mul(KUA_UPGRADES.KShards[7].eff);
                }
                tmp.value.praiPending = i.floor();

                i = tmp.value.praiPending.add(c.d1).floor();
                i = i.div(player.value.generators.pr2.effect);
                i = i.log10().root(tmp.value.praiDil).pow10().sub(c.d1).div(tmp.value.praiExp).add(c.d1).root(tmp.value.praiExp).mul(tmp.value.praiReq);
                tmp.value.praiNext = i.sub(player.value.totalPointsInPRai);
            } else {
                tmp.value.praiPending = c.d1;
                tmp.value.praiNext = tmp.value.praiReq.sub(player.value.totalPointsInPRai).div(player.value.pps);
            }

            j = c.d4;
            if (player.value.achievements.includes(6)) {
                j = j.mul(c.d2_5);
            }

            tmp.value.praiEffDil = c.d0_975;
            i = D(player.value.generators.prai.amount);
            i = i.mul(j).add(c.d1).dilate(tmp.value.praiEffDil);
            if (player.value.achievements.includes(10)) {
                i = i.mul(c.d2);
            }
            if (getKuaUpgrade("p", 2)) {
                i = i.mul(KUA_UPGRADES.KShards[1].eff);
            } 
            if (getKuaUpgrade("p", 5)) {
                i = i.pow(KUA_UPGRADES.KPower[4].eff);
            }
            player.value.generators.prai.effect = i;

            i = Decimal.add(player.value.generators.prai.amount, tmp.value.praiPending);
            i = i.mul(j).add(c.d1).dilate(tmp.value.praiEffDil);
            if (player.value.achievements.includes(10)) {
                i = i.mul(c.d2);
            }
            if (getKuaUpgrade("p", 2)) {
                i = i.mul(KUA_UPGRADES.KShards[1].eff);
            } 
            if (getKuaUpgrade("p", 5)) {
                i = i.pow(KUA_UPGRADES.KPower[4].eff);
            }
            tmp.value.praiNextEffect = i;

            player.value.generators.prai.best = Decimal.max(player.value.generators.prai.best, player.value.generators.prai.amount);
            player.value.generators.prai.bestInPR2 = Decimal.max(player.value.generators.prai.bestInPR2, player.value.generators.prai.amount);
            tmp.value.praiCanDo = Decimal.gte(player.value.totalPointsInPRai, tmp.value.praiReq);

            setAchievement(2, Decimal.gte(player.value.generators.prai.best, c.d1));
            setAchievement(3, Decimal.gte(player.value.generators.prai.best, c.d10));
            setAchievement(6, Decimal.gte(player.value.totalPointsInPRai, c.e18));
            break;
        case "pr2":
            updateScaling("pr2");
            i = c.d0;
            player.value.generators.pr2.freeExtra = i;

            i = D(player.value.generators.pr2.amount);
            i = i.add(player.value.generators.pr2.freeExtra);
            tmp.value.pr2Effective = i

            j = D(c.d0_05);
            if (getKuaUpgrade("s", 5)) {
                j = j.mul(c.d2);
            }

            i = tmp.value.pr2Effective.max(c.d0).add(c.d1).pow(tmp.value.pr2Effective.mul(j).add(c.d1).ln().add(c.d1));
            if (getKuaUpgrade("p", 8)) {
                i = Decimal.pow(j.add(c.d1).pow(c.d5), tmp.value.pr2Effective).max(i)
            }
            player.value.generators.pr2.effect = i;

            tmp.value.pr2CostDiv = c.d1;
            if (player.value.achievements.includes(8)) {
                tmp.value.pr2CostDiv = tmp.value.pr2CostDiv.mul(c.d1_5);
            }

            scal = D(player.value.generators.pr2.amount);
            scal = doAllScaling(scal, tmp.value.scaling.pr2, false);
            player.value.generators.pr2.cost = scal.add(c.d4).factorial().mul(c.d5div12).div(tmp.value.pr2CostDiv);

            if (Decimal.gte(player.value.generators.prai.amount, c.d10)) {
                scal = inverseFact(Decimal.mul(player.value.generators.prai.amount, tmp.value.pr2CostDiv).div(c.d5div12)).sub(c.d4);
                scal = doAllScaling(scal, tmp.value.scaling.pr2, true);
                player.value.generators.pr2.target = scal;
            } else {
                player.value.generators.pr2.target = c.d0;
            }

            player.value.generators.pr2.best = Decimal.max(player.value.generators.pr2.best, player.value.generators.pr2.amount);

            tmp.value.pr2CanDo = Decimal.gte(player.value.generators.prai.amount, player.value.generators.pr2.cost);

            tmp.value.pr2ScalingColor = `#FFFFFF`
            for (let i = tmp.value.scaling.pr2.length - 1; i >= 0; i--) {
                if (Decimal.gte(player.value.generators.pr2.amount, tmp.value.scaling.pr2[i].start)) {
                    tmp.value.pr2ScalingColor = SCALE_ATTR[i].color;
                    break;
                }
            }

            tmp.value.pr2Text = "";
            if (Decimal.lte(player.value.generators.pr2.amount, PR2_EFF[PR2_EFF.length - 1].when)) {
                for (i in PR2_EFF) {
                    // console.log(`${format(player.value.generators.pr2.amount)} < ${PR2_EFF[i].when} & ${PR2_EFF[i].show}`)
                    if (Decimal.lt(player.value.generators.pr2.amount, PR2_EFF[i].when) && PR2_EFF[i].show) {
                        tmp.value.pr2Text = {info: PR2_EFF[i].when, txt: PR2_EFF[i].text};
                        break;
                    }
                }
            }

            if (player.value.auto.pr2) {
                player.value.generators.pr2.amount = Decimal.max(player.value.generators.pr2.amount, player.value.generators.pr2.target.add(c.d1).floor());
            }

            setAchievement(4, Decimal.gte(player.value.generators.pr2.best, c.d1));
            setAchievement(7, Decimal.gte(player.value.generators.pr2.best, c.d2));
            setAchievement(9, Decimal.gte(player.value.generators.pr2.best, c.d4));
            setAchievement(26, Decimal.gte(player.value.generators.pr2.best, c.d25));
            break;
        default:
            throw new Error(`Starting area of the game does not contain ${staID}`);
    }
}
