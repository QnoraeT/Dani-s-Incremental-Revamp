"use strict";

// use get show if it can change in the mean time, currently unused as a placeholder
// costs will get the same treatment later

function getKuaUpgrade(sp, id) {
    if (sp === 's') {
        return player.value.kua.kshards.upgrades >= id && player.value.nerf.kuaActive.kshards.upgrades && player.value.nerf.kuaActive.spUpgrades;
    }
    if (sp === 'p') {
        return player.value.kua.kpower.upgrades >= id && player.value.nerf.kuaActive.kpower.upgrades && player.value.nerf.kuaActive.spUpgrades;
    }
}

const KUA_UPGRADES = {
    KShards: [
        { // 1
            get desc() {
                return `Gain ${format(c.em2, 3)}% of your pending PRai per second, and Kuaraniai Gain is multiplied by ${format(c.d1_5, 2)}x`;
            },
            get cost() {
                return c.d0_1;
            },
            show: true
        },
        { // 2
            get desc() {
                return `KShards boost PRai's effect. Currently: ${format(this.eff, 2)}x`;
            },
            get eff() {
                let i = c.d1;
                if (player.value.nerf.kuaActive.kshards.effects) {
                    i = Decimal.max(player.value.kua.kshards.total, c.d0);
                    i = i.add(i.mul(c.d4)).add(i.pow(c.d2).mul(c.d4)).add(c.d1).log10().pow(c.d0_85).pow10()
                    if (getKuaUpgrade("s", 10)) {
                        i = i.pow(tmp.value.kuaEffects.kshardPrai);
                    }
                }
                return i;
            },
            get cost() {
                return c.d1;
            },
            show: true
        },
        { // 3
            get desc() {
                return `UP1's effect reduces UP2's scaling strength. Currently: ${formatPerc(this.eff)}`;
            },
            get eff() {
                let i = c.d1;
                    i = Decimal.max(tmp.value.upgrades[0].effect, c.e10).log10().div(c.d10).sqrt().sub(c.d1).div(c.d5).add(c.d1);
                return i;
            },
            get cost() {
                return c.d2;
            },
            show: true
        },
        { // 4
            get desc() {
                return `UP1's scaling starts ${format(c.d5)} later and is ${format(c.d10, 3)}% weaker, and superscaling starts ${format(c.d2)} later and is ${format(c.d5, 3)}% weaker.`;
            },
            get cost() {
                return c.d10;
            },
            show: true
        },
        { // 5
            get desc() {
                return `PR2's effect exponent increases twice as fast, UP2's base is increased from ${format(c.d4div3, 3)} to ${format(c.d1_5, 3)}, and unlock UP3's autobuyer.`;
            },
            get cost() {
                return c.d400;
            },
            show: true
        },
        { // 6
            get desc() {
                return `UP2's superscaling and softcap are ${format(c.d1div3.mul(c.e2), 3)}% weaker.`;
            },
            get cost() {
                return c.d2500;
            },
            show: true
        },
        { // 7
            get desc() {
                return `Upgrade 1's cost base is decreased by -${format(c.d0_05, 2)}, and Point gain is boosted by Kuaraniai, which increases over time in PRai.`;
            },
            get cost() {
                return c.e7;
            },
            show: true
        },
        { // 8
            get desc() {
                return `KPower's UP2 effect has a better formula, and KShards increase PRai gain. Currently: ${format(this.eff, 2)}x`;
            },
            get eff() {
                let i = c.d1;
                if (player.value.nerf.kuaActive.kshards.effects) {
                    i = Decimal.max(player.value.kua.kshards.total, c.d1);
                    i = i.pow(c.d0_5).dilate(c.d0_95);
                }
                return i;
            },
            get cost() {
                return c.e9;
            },
            show: true,
        },
        { // 9
            get desc() {
                return `KShards delay Upgrade 2's cost growth (after scaling). Currently: +${format(this.eff, 2)} purchases`;
            },
            get eff() {
                let i = Decimal.max(player.value.kua.kshards.total, c.d10);
                i = i.log10().add(c.d1).pow(c.d5).div(c.d32).ln().div(c.d20).add(c.d1).pow(c.d20);
                return i;
            },
            get cost() {
                return c.d2e11;
            },
            show: true,
        },
        { // 10
            get desc() {
                return `Kuaraniai buffs KShard's PRai effect boost and increases KPower gain.`;
            },
            get cost() {
                return c.e13;
            },
            show: true,
        },
        { // 11
            get desc() {
                return `PR2 above ${format(c.d30)} boosts Kuaraniai effects. Currently: ^${format(this.eff, 4)}`;
            },
            get eff() {
                let i = Decimal.max(player.value.generators.pr2.amount, c.d30).sub(c.d30);
                i = i.mul(c.d0_025).add(c.d1).sqrt().sub(c.d1).mul(c.d2).add(c.d1);
                return i;
            },
            get cost() {
                return c.e15;
            },
            show: true,
        },
    ],
    KPower: [
        { // 1
            get desc() {
                return `Multiply KShard gain by ${format(c.d2_5)}x, and KPower buffs Upgrade 2's base. Currently: +${format(this.eff, 4)}`;
            },
            get eff() {
                let i = c.d0;
                if (player.value.nerf.kuaActive.kpower.effects) {
                    i = Decimal.max(player.value.kua.kpower.total, c.d0).add(c.d1).log10().add(c.d1).log10().add(c.d1).pow(c.d2).sub(c.d1).div(c.d20);
                    if (getKuaUpgrade("s", 8)) {
                        i = Decimal.max(player.value.kua.kpower.total, c.d0).add(c.d1).log10().div(c.d30).max(i);
                    }
                }
                return i;
            },
            get cost() {
                return c.d1;
            },
            show: true
        },
        { // 2
            get desc() {
                return `Be able to unlock a new feature at ${format(c.e2)} Kuaraniai, and KPower increases UP3's effectiveness. Currently: +${format(this.eff.sub(1).mul(100), 3)}%`;
            },
            get eff() {
                let i = c.d1;
                if (player.value.nerf.kuaActive.kpower.effects) {
                    i = Decimal.max(player.value.kua.kpower.total, c.d0).add(c.d1).log10().add(c.d1).root(c.d4).sub(c.d1).div(c.d20).add(c.d1);
                }
                return i;
            },
            get cost() {
                return c.e2;
            },
            show: true
        },
        { // 3
            get desc() {
                return `Kuaraniai's effect on UP1's scaling uses a better formula, and add another effect.`;
            },
            get cost() {
                return c.e3;
            },
            show: true
        },
        { // 4
            get desc() {
                return `UP2's softcap is ${format(c.d40, 3)}% weaker and starts later based off of your KPower. Currently: ${format(this.eff, 2)}x`;
            },
            get eff() {
                let i = c.d1;
                if (player.value.nerf.kuaActive.kpower.effects) {
                    i = Decimal.max(player.value.kua.kpower.total, c.d0).add(c.d1).log10().pow(c.d1_05).pow10().pow(c.d0_75);
                }
                return i;
            },
            get cost() {
                return c.d8500;
            },
            show: true
        },
        { // 5
            get desc() {
                return `PRai's effect is more powerful based off of your KPower. Currently: ^${format(this.eff, 4)}`;
            },
            get eff() {
                let i = Decimal.max(player.value.kua.kpower.total, c.d1);
                let res = c.d1;
                if (player.value.nerf.kuaActive.kpower.effects) {
                    res = i.log10().add(c.d1).log2().div(c.d50).add(c.d1); // 1 = ^1, 10 = ^1.02, 1,000 = ^1.04, 1e7 = ^1.06, 1e15 = ^1.08, 1e31 = ^1.1
                }
                return res;
            },
            get cost() {
                return c.d5e4;
            },
            show: true
        },
        { // 6
            get desc() {
                return `Kuaraniai also delays Upgrade 2's softcap, and it's effect of Upgrade 1's scaling also apply to superscaling at a reduced rate.`;
            },
            get cost() {
                return c.e6;
            },
            show: true,
        },
        { // 7
            get desc() {
                return `Upgrade 2's effect is cubed after it's softcap, but it's other effects are not boosted.`;
            },
            get cost() {
                return c.e8;
            },
            show: true,
        },
        { // 8
            get desc() {
                return `Upgrade 1 is dilated by ^${format(c.d1_01, 2)}, and PR2's effect uses a better formula.`;
            },
            get cost() {
                return c.e12;
            },
            show: true,
        },
        { // 9
            get desc() {
                return `PR2 slightly weakens UP1 and UP2's hyper scaling. Currently: ${formatPerc(this.eff)}`;
            },
            get eff() {
                if (Decimal.lt(player.value.generators.pr2.amount, c.d25)) { return c.d1 }
                let eff = Decimal.sub(player.value.generators.pr2.amount, c.d25);
                eff = eff.div(eff.add(c.d20)).mul(c.d0_25).add(c.d1);
                return eff;
            },
            get cost() {
                return c.e15;
            },
            show: true,
        },
        { // 10
            get desc() {
                return `UP1 and UP2's cost scaling is overall reduced based off of your points. Currently: ${formatPerc(this.eff)}`;
            },
            get eff() {
                let eff = Decimal.max(player.value.points, c.e10);
                eff = eff.log10().div(c.d10).sqrt().sub(c.d1).div(c.d4).add(c.d1);
                return eff;
            },
            get cost() {
                return c.e18;
            },
            show: true,
        },
    ]
}

// player.value.kua.enhancers.sources = [c.d0, c.d0, c.d0],
// player.value.kua.enhancers.enhancers = [c.d0, c.d0, c.d0, c.d0, c.d0, c.d0, c.d0],
// player.value.kua.enhancers.enhanceXP = [c.d0, c.d0, c.d0, c.d0, c.d0, c.d0, c.d0],
// player.value.kua.enhancers.enhancePow = [c.d0, c.d0, c.d0, c.d0, c.d0, c.d0, c.d0],
// player.value.kua.enhancers.xpSpread = c.d1,
// player.value.kua.enhancers.inExtraction = 0,
// player.value.kua.enhancers.extractionXP = [c.d0, c.d0, c.d0],
// player.value.kua.enhancers.upgrades = []

const KUA_ENHANCERS = {
    sources: [
        {
            get source() { return player.value.points; },
            sourceName: 'points',
            cost(level) {
                let cost = Decimal.pow(1e12, smoothExp(Decimal.max(level, 0), 1.25, false)).mul(1e24)
                return cost
            },
            target(amount) {
                let levels = smoothExp(Decimal.max(amount, 1e24).div(1e24).log(1e12), 1.25, true)
                return levels
            }
        },
        {
            get source() { return player.value.generators.prai.amount; },
            sourceName: 'PRai',
            cost(level) {
                let cost = Decimal.pow(1e6, smoothExp(Decimal.max(level, 0), 1.1, false)).mul(1e12)
                return cost
            },
            target(amount) {
                let levels = smoothExp(Decimal.max(amount, 1e12).div(1e12).log(1e6), 1.1, true)
                return levels
            }
        },
        {
            get source() { return player.value.kua.amount; },
            sourceName: 'Kuaraniai',
            cost(level) {
                let cost = Decimal.pow(10, smoothPoly(Decimal.max(level, 0), 2, 50, false)).mul(0.01)
                return cost
            },
            target(amount) {
                let levels = smoothPoly(Decimal.max(amount, 0.01).div(0.01).log10(), 2, 50, true)
                return levels
            }
        },
    ],
    enhances: [
        {
            color: "#ffffff",
            get desc() { return `Increase UP1's base by +${format(this.effect(), 4)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[0], pow = player.value.kua.enhancers.enhancePow[0]) {
                let effect = Decimal.max(xp, 0).mul(0.01).add(1).ln().mul(0.1).add(1).pow(pow).sub(1)
                return effect;
            }
        },
        {
            color: "#ffffff",
            get desc() { return `Increase UP2's base by +${format(this.effect(), 4)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[1], pow = player.value.kua.enhancers.enhancePow[1]) {
                let effect = Decimal.max(xp, 0).mul(0.00025).add(1).root(10).sub(1).mul(10).mul(pow)
                return effect;
            }
        },
        {
            color: "#ffffff",
            get desc() { return `Increase UP3's base by +${format(this.effect(), 4)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[2], pow = player.value.kua.enhancers.enhancePow[2]) {
                let effect = Decimal.max(xp, 0).mul(0.01).add(1).ln().mul(0.01).add(1).pow(pow).sub(1)
                return effect;
            }
        },
        {
            color: "#8000ff",
            get desc() { return `Weaken UP4's cost growth (after scaling) by ${formatPerc(this.effect(), 3)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[3], pow = player.value.kua.enhancers.enhancePow[3]) {
                let effect = Decimal.max(xp, 0).mul(0.01).add(1).ln().mul(0.1).mul(pow).add(1)
                return effect;
            }
        },
        {
            color: "#8000ff",
            get desc() { return `Weaken UP5's cost growth (after scaling) by ${formatPerc(this.effect(), 3)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[4], pow = player.value.kua.enhancers.enhancePow[4]) {
                let effect = Decimal.max(xp, 0).mul(0.01).add(1).ln().mul(0.1).mul(pow).add(1)
                return effect;
            }
        },
        {
            color: "#8000ff",
            get desc() { return `Weaken UP6's cost growth (after scaling) by ${formatPerc(this.effect(), 3)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[5], pow = player.value.kua.enhancers.enhancePow[5]) {
                let effect = Decimal.max(xp, 0).mul(0.01).add(1).ln().mul(0.1).mul(pow).add(1)
                return effect;
            }
        },
        {
            color: "#c0d0e0",
            get desc() { return `Weaken PR2's cost growth (before scaling) by ${formatPerc(this.effect(), 3)}`; },
            effect(xp = player.value.kua.enhancers.enhanceXP[6], pow = player.value.kua.enhancers.enhancePow[6]) {
                let effect = Decimal.max(xp, 0).mul(0.005).add(1).ln().mul(0.05).mul(pow).add(1)
                return effect;
            }
        },
    ]
}

function updateAllKua(delta) {
    updateKua("enhancers", delta);
    updateKua("kua", delta);
}

function updateKua(type, delta) {
    let scal, pow, sta, i, j, k, generate;
    switch (type) {
        case "enhancers":
            if (tmp.value.kuaBaseSourceXPGen === undefined) { tmp.value.kuaBaseSourceXPGen = []; }
            if (tmp.value.kuaTrueSourceXPGen === undefined) { tmp.value.kuaTrueSourceXPGen = []; }

            tmp.value.kuaSourcesCanBuy = [false, false, false];
            tmp.value.kuaTotalEnhSources = c.d0;
            tmp.value.kuaEnhSourcesUsed = c.d0;
            tmp.value.kuaEnhShowSlow = false;

            let decayExp = c.d10;
            tmp.value.kuaEnhSlowdown = Decimal.div(decayExp, c.d10).mul(c.e2);
            for (let i = 0; i < KUA_ENHANCERS.sources.length; i++) {
                tmp.value.kuaSourcesCanBuy[i] = Decimal.gte(KUA_ENHANCERS.sources[i].source, KUA_ENHANCERS.sources[i].cost(player.value.kua.enhancers.sources[i]));
            }

            for (let i = 0; i < KUA_ENHANCERS.enhances.length; i++) {
                tmp.value.kuaTotalEnhSources = Decimal.add(tmp.value.kuaTotalEnhSources, player.value.kua.enhancers.sources[i]);
                tmp.value.kuaEnhSourcesUsed = Decimal.add(tmp.value.kuaEnhSourcesUsed, player.value.kua.enhancers.enhancers[i]);

                tmp.value.kuaBaseSourceXPGen[i] = Decimal.pow(player.value.kua.enhancers.enhancers[i], c.d1_5);

                generate = tmp.value.kuaBaseSourceXPGen[i].mul(delta);

                let lastXP = player.value.kua.enhancers.enhanceXP[i]
                player.value.kua.enhancers.enhanceXP[i] = Decimal.add(player.value.kua.enhancers.enhanceXP[i], c.d1).root(decayExp).sub(c.d1).mul(decayExp).exp().sub(c.d1).add(generate).add(c.d1).ln().div(decayExp).add(c.d1).pow(decayExp).sub(c.d1);
                tmp.value.kuaTrueSourceXPGen[i] = Decimal.sub(player.value.kua.enhancers.enhanceXP[i], lastXP).div(delta);

                tmp.value.kuaEnhShowSlow = tmp.value.kuaEnhShowSlow || Decimal.gte(player.value.kua.enhancers.enhanceXP[i], c.d10);
            }
            
            break;
        case "kua":
            player.value.kua.timeInKua = Decimal.add(player.value.kua.timeInKua, delta);

            player.value.kua.best = Decimal.max(player.value.kua.amount, player.value.kua.best);
            player.value.kua.kshards.best = Decimal.max(player.value.kua.kshards.amount, player.value.kua.kshards.best);
            player.value.kua.kpower.best = Decimal.max(player.value.kua.kpower.amount, player.value.kua.kpower.best);
            
            tmp.value.kuaReq = c.e10;
            tmp.value.kuaMul = c.em4;
            tmp.value.kuaExp = c.d3;

            tmp.value.kuaExp = tmp.value.kuaExp.add(getColResEffect(2));

            if (getKuaUpgrade("s", 1)) {
                tmp.value.kuaMul = tmp.value.kuaMul.mul(c.d1_5);
            }
            
            if (ifAchievement(13)) {
                tmp.value.kuaMul = tmp.value.kuaMul.mul(c.d1_5);
            }

            tmp.value.effectivePrai = Decimal.add(player.value.generators.prai.totalInKua, tmp.value.praiPending);
            tmp.value.kuaCanDo = tmp.value.effectivePrai.gte(tmp.value.kuaReq) && player.value.nerf.kuaActive.gain;
            tmp.value.kuaPending = tmp.value.kuaCanDo ? tmp.value.effectivePrai.log(tmp.value.kuaReq).ln().mul(c.d1_5).div(tmp.value.kuaExp).add(c.d1).pow(tmp.value.kuaExp).sub(c.d1).pow10().mul(tmp.value.kuaMul) : c.d0;

            if (player.value.auto.kua) {
                generate = tmp.value.kuaPending.mul(delta);
                player.value.kua.amount = Decimal.add(player.value.kua.amount, generate);
                player.value.kua.total = Decimal.add(player.value.kua.total, generate);
            }

            player.value.kua.best = Decimal.max(player.value.kua.best, player.value.kua.amount);

            tmp.value.kuaEffects = { 
                kshardPassive: c.d1,
                kpowerPassive: c.d1,
                up4: c.d1, 
                up5: c.d1, 
                up6: c.d0, 
                upg1Scaling: c.d1, 
                upg1SuperScaling: c.d1, 
                ptPower: c.d1, 
                upg2Softcap: c.d1, 
                kshardPrai: c.d1, 
                kpower: c.d1, 
                pts: c.d1 
            };

            k = player.value.kua.amount;
            if (getKuaUpgrade("s", 11)) {
                k = Decimal.max(k, c.d1).pow(KUA_UPGRADES.KShards[10].eff);
            }

            if (player.value.nerf.kuaActive.effects) {
                // * theres probably a better way to do this
                // no requirements for this, no need to lump them in the ones with conditionals
                tmp.value.kuaEffects.upg1Scaling     = Decimal.max(player.value.points, c.d0).add(c.d1).log10().pow(c.d0_6).div(c.d200).mul(Decimal.max(k, c.d0).mul(c.e4) .add(c.d1).pow(c.d2div3).sub(c.d1)).add(c.d1).log10().add(c.d1);
                if (getKuaUpgrade("p", 3)) {
                    tmp.value.kuaEffects.upg1Scaling = Decimal.max(player.value.points, c.d0).add(c.d1).pow(c.d0_022)                  .mul(Decimal.max(k, c.d0).mul(c.d10).add(c.d1).pow(c.d0_75) .sub(c.d1)).add(c.d1).log10().add(c.d1).max(tmp.value.kuaEffects.upg1Scaling);
                }

                let exp = c.d1;
                // don't mind me siltating these by ^0.9 :3
                tmp.value.kuaEffects.kshardPassive = Decimal.max(player.value.kua.kshards.total, c.em2).mul(c.e3).dilate(c.d2).div(c.d10).pow(c.d0_04).pow(exp).mul(c.d10).log10().mul(c.d10).dilate(c.d0_9).div(c.d10).pow10().div(c.d10);
                tmp.value.kuaEffects.kpowerPassive = Decimal.max(player.value.kua.kpower.total, c.em2).mul(c.e3).dilate(c.d2).div(c.d10).pow(c.d0_04).pow(exp).mul(c.d10).log10().mul(c.d10).dilate(c.d0_9).div(c.d10).pow10().div(c.d10);

                tmp.value.kuaEffects.up4 = Decimal.gt(k, c.d0) 
                    ? Decimal.log10(k).add(c.d4).div(c.d13).mul(c.d7).add(c.d1).cbrt().sub(c.d4).pow10().add(c.d1) 
                    : c.d1

                tmp.value.kuaEffects.up5 = Decimal.gt(player.value.kua.kshards.amount, c.d0)
                    ? Decimal.pow(c.d20, Decimal.log10(player.value.kua.kshards.amount).add(c.d2).div(c.d13)).div(c.e3).add(c.d1)
                    : c.d1

                tmp.value.kuaEffects.up6 = Decimal.gt(player.value.kua.kpower.amount, c.d1)
                    ? Decimal.log10(player.value.kua.kpower.amount).div(c.d13).mul(c.d7).add(c.d1).cbrt().sub(c.d6).pow10()
                    : c.d0
                
                tmp.value.kuaEffects.upg1SuperScaling = getKuaUpgrade("p", 6)
                    ? tmp.value.kuaEffects.upg1Scaling.sqrt().sub(c.d1).div(c.d16).add(c.d1)
                    : c.d1
                
                tmp.value.kuaEffects.ptPower = getKuaUpgrade("p", 3)
                    ? Decimal.max(k, c.d0).add(c.d1).log2().sqrt().mul(c.d0_02).add(c.d1) // 1 = ^1, 2 = ^1.02, 16 = ^1.04, 256 = ^1.06, 65,536 = ^1.08 ...
                    : c.d1

                tmp.value.kuaEffects.upg2Softcap = getKuaUpgrade("s", 6)
                    ? Decimal.max(k, c.e2).div(c.e2).pow(c.d7)
                    : c.d1
            
                tmp.value.kuaEffects.kshardPrai = getKuaUpgrade("s", 10)
                    ? Decimal.max(k, c.d10).log10().log10().div(c.d4).add(c.d1).pow(c.d2_5)
                    : c.d1

                tmp.value.kuaEffects.kpower = getKuaUpgrade("s", 10)
                    ? Decimal.max(k, c.d10).log10().sub(c.d1).div(c.d4).pow(c.d1_1).pow10()
                    : c.d1

                tmp.value.kuaEffects.pts = getKuaUpgrade("s", 7)
                    ? Decimal.max(k, c.d1).mul(c.e3).cbrt().log10().pow(c.d1_1).mul(Decimal.max(player.value.generators.prai.timeInPRai, c.d0).add(c.d1).ln().mul(c.d2).add(c.d1).sqrt()).pow10()
                    : c.d1
            }

            i = c.d0;
            if (player.value.nerf.kuaActive.kshards.gain) {
                i = D(player.value.kua.amount);
                if (getKuaUpgrade("p", 1)) {
                    i = i.mul(c.d2_5);
                }
            }
            tmp.value.kuaShardGeneration = i;

            i = c.d0;
            if (player.value.nerf.kuaActive.kpower.gain) {
                i = D(player.value.kua.kshards.amount);
                if (getKuaUpgrade("s", 10)) {
                    i = i.mul(tmp.value.kuaEffects.kpower);
                }
            }
            tmp.value.kuaPowerGeneration = i;

            generate = tmp.value.kuaShardGeneration.mul(delta);
            player.value.kua.kshards.amount = Decimal.add(player.value.kua.kshards.amount, generate);
            player.value.kua.kshards.total = Decimal.add(player.value.kua.kshards.total, generate);
            generate = tmp.value.kuaPowerGeneration.mul(delta);
            player.value.kua.kpower.amount = Decimal.add(player.value.kua.kpower.amount, generate);
            player.value.kua.kpower.total = Decimal.add(player.value.kua.kpower.total, generate);

            setAchievement(12, Decimal.gte(player.value.generators.prai.totalInKua, c.e12));
            setAchievement(13, Decimal.gte(player.value.kua.amount, c.d0_1));
            setAchievement(34, Decimal.gte(player.value.kua.amount, c.em2));
            setAchievement(19, tmp.value.kuaPending.gte(c.d2_5) && Decimal.eq(player.value.generators.prai.times, c.d0));
            setAchievement(29, Decimal.gte(player.value.kua.amount, c.e7));
            setAchievement(30, Decimal.gte(player.value.generators.prai.totalInKua, c.e90));
            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}

function buyKShardUpg(id) {
    if (id === player.value.kua.kshards.upgrades) {
        if (player.value.kua.kshards.amount.gte(KUA_UPGRADES.KShards[id].cost)) {
            player.value.kua.kshards.upgrades++;
            player.value.kua.kshards.amount = player.value.kua.kshards.amount.sub(KUA_UPGRADES.KShards[id].cost);
        }
    }
}

function buyKPowerUpg(id) {
    if (id === player.value.kua.kpower.upgrades) {
        if (player.value.kua.kpower.amount.gte(KUA_UPGRADES.KPower[id].cost)) {
            player.value.kua.kpower.upgrades++;
            player.value.kua.kpower.amount = player.value.kua.kpower.amount.sub(KUA_UPGRADES.KPower[id].cost);
        }
    }
}

function buyKuaEnhSourceUPG(i, max = false) {
    if (Decimal.gte(KUA_ENHANCERS.sources[i].source, KUA_ENHANCERS.sources[i].cost(player.value.kua.enhancers.sources[i]))) {
        if (max) {
            player.value.kua.enhancers.sources[i] = Decimal.max(player.value.kua.enhancers.sources[i], KUA_ENHANCERS.sources[i].target(KUA_ENHANCERS.sources[i].source).floor(c.d1))
        } else {
            player.value.kua.enhancers.sources[i] = Decimal.add(player.value.kua.enhancers.sources[i], c.d1)
        }
    }
}

function kuaEnh(id, amt) {
    let left = Decimal.sub(tmp.value.kuaTotalEnhSources, tmp.value.kuaEnhSourcesUsed)
    player.value.kua.enhancers.enhancers[id] = Decimal.min(Decimal.add(left, player.value.kua.enhancers.enhancers[id]), Decimal.max(c.d0, Decimal.add(player.value.kua.enhancers.enhancers[id], amt)))
}

function kuaEnhReset() {
    for (let i = 0; i < player.value.kua.enhancers.enhancers.length; i++) {
        player.value.kua.enhancers.enhancers[i] = c.d0;
    }
}