"use strict";
const KUA_UPGRADES = {
    KShards: [
        { // 1
            desc() {
                return `Gain ${format(c.em2, 3)}% of your pending PRai per second, and Kuaraniai Gain is multiplied by ${format(c.d1_5, 2)}x`;
            },
            cost() {
                return c.d0_1;
            },
            show() {
                return true;
            }
        },
        { // 2
            desc() {
                return `KShards boost PRai's effect. Currently: ${format(this.eff(), 2)}x`;
            },
            eff() {
                let i = player.value.kua.kshards.amount.max(c.d0);
                i = i.add(i.mul(c.d4)).add(i.pow(c.d2).mul(c.d4)).add(c.d1)
                if (i.gte(c.d1)) { i = i.log10().pow(c.d0_85).pow10() }
                if (player.value.kua.kshards.upgrades >= 10) {
                    i = i.pow(tmp.value.kuaEffects.kshardPrai);
                }
                return i;
            },
            cost() {
                return c.d1;
            },
            show() {
                return true;
            }
        },
        { // 3
            desc() {
                return `UP1's effect reduces UP2's scaling strength. Currently: ${formatPerc(this.eff())}`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.generators.upg1.effect.max(c.e10).log10().div(c.d10).sqrt().sub(c.d1).div(c.d5).add(c.d1);
                return i;
            },
            cost() {
                return c.d4;
            },
            show() {
                return true;
            }
        },
        { // 4
            desc() {
                return `UP1's scaling starts ${format(c.d5)} later and is ${format(c.d10, 3)}% weaker, and superscaling starts ${format(c.d2)} later and is ${format(c.d5, 3)}% weaker.`;
            },
            cost() {
                return c.d10;
            },
            show() {
                return true;
            }
        },
        { // 5
            desc() {
                return `PR2's effect exponent increases twice as fast, and UP2's base is increased from ${format(c.d4div3, 3)} to ${format(c.d1_5, 3)}.`;
            },
            cost() {
                return c.d400;
            },
            show() {
                return true;
            }
        },
        { // 6
            desc() {
                return `UP2's superscaling and softcap are ${format(c.d1div3.mul(c.e2), 3)}% weaker.`;
            },
            cost() {
                return c.d2500;
            },
            show() {
                return true;
            }
        },
        { // 7
            desc() {
                return `Upgrade 1's cost base is decreased by -${format(c.d0_05, 2)}, and unlock Upgrade 3's autobuyer.`;
            },
            cost() {
                return c.e5;
            },
            show() {
                return true;
            }
        },
        { // 8
            desc() {
                return `KPower's PRai effect has a better formula, and KShards increase PRai gain. Currently: ${format(this.eff(), 2)}x`;
            },
            eff() {
                let i = player.value.kua.kshards.amount.max(c.d1);
                i = i.pow(c.d0_75).log10().pow(c.d0_95).pow10();
                return i;
            },
            cost() {
                return c.e6;
            },
            show() {
                return true;
            },
        },
        { // 9
            desc() {
                return `KShards delay Upgrade 2's scaling. Currently: +${format(this.eff(), 2)} purchases`;
            },
            eff() {
                let i = player.value.kua.kshards.amount.max(c.d10);
                i = i.log10().add(c.d1).pow(c.d5).div(c.d32).ln().div(c.d20).add(c.d1).pow(c.d20);
                return i;
            },
            cost() {
                return c.d2e7;
            },
            show() {
                return true;
            },
        },
        { // 10
            desc() {
                return `Kuaraniai buffs KShard's PRai effect and increases KPower gain.`;
            },
            cost() {
                return c.e9;
            },
            show() {
                return true;
            },
        },
        { // 11
            desc() {
                return `PR2 above ${format(c.d30)} boosts Kuaraniai effects. Currently: ^${format(this.eff(), 4)}`;
            },
            eff() {
                let i = player.value.generators.pr2.amount.max(c.d30).sub(c.d30);
                i = i.mul(c.d0_025).add(c.d1).ln().add(c.d1);
                return i;
            },
            cost() {
                return c.e10;
            },
            show() {
                return true;
            },
        },
    ],
    KPower: [
        { // 1
            desc() {
                return `Multiply KShard gain by ${format(c.d2_5)}x, and KPower buffs Upgrade 2's base. Currently: +${format(this.eff(), 4)}`;
            },
            eff() {
                let i = c.d0;
                    i = player.value.kua.kpower.amount.max(c.d0).add(c.d1).log10().add(c.d1).log10().add(c.d1).pow(c.d2).sub(c.d1).div(c.d20);
                return i;
            },
            cost() {
                return c.d1;
            },
            show() {
                return true;
            }
        },
        { // 2
            desc() {
                return `Be able to unlock a new feature at ${format(c.e2)} Kuaraniai, and KPower increases UP3's effectiveness. Currently: +${format(this.eff().sub(1).mul(100), 3)}%`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.kua.kpower.amount.max(c.d0).add(c.d1).log10().add(c.d1).root(c.d4).sub(c.d1).div(c.d20).add(c.d1);
                return i;
            },
            cost() {
                return c.d10;
            },
            show() {
                return true;
            }
        },
        { // 3
            desc() {
                return `Kuaraniai's effect on UP1's scaling uses a better formula, and add another effect.`;
            },
            cost() {
                return c.e3;
            },
            show() {
                return true;
            }
        },
        { // 4
            desc() {
                return `UP2's softcap is ${format(c.d40, 3)}% weaker and starts later based off of your KPower. Currently: ${format(this.eff(), 2)}x`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.kua.kpower.amount.max(c.d0).add(c.d1).log10().pow(c.d1_05).pow10().pow(c.d0_75);
                return i;
            },
            cost() {
                return c.d8500;
            },
            show() {
                return true;
            }
        },
        { // 5
            desc() {
                return `PRai's effect is more powerful based off of your KPower. Currently: ^${format(this.eff(), 4)}`;
            },
            eff() {
                let i = player.value.kua.kpower.amount.max(c.d1);
                let res = i.log10().add(c.d1).log2().div(c.d20).add(c.d1); // 1 = ^1, 10 = ^1.05, 1,000 = ^1.1, 1e7 = ^1.15, 1e15 = ^1.2, 1e31 = ^1.25
                if (player.value.kua.kshards.upgrades >= 8) {
                    res = i.log10().add(c.d1).sqrt().sub(c.d1).div(c.d10).add(c.d1).max(res); // 1 = ^1, 1,000 = ^1.1, 1e8 = ^1.2, 1e15 = ^1.3, 1e24 = ^1.4, 1e35 = ^1.5
                }
                return res;
            },
            cost() {
                return c.d5e4;
            },
            show() {
                return true;
            }
        },
        { // 6
            desc() {
                return `Kuaraniai also delays Upgrade 2's softcap, and it's effect of Upgrade 1's scaling also apply to superscaling at a reduced rate.`;
            },
            cost() {
                return c.e6;
            },
            show() {
                return true;
            },
        },
        { // 7
            desc() {
                return `Upgrade 2's effect is cubed, but it's other effects are not boosted.`;
            },
            cost() {
                return c.e8;
            },
            show() {
                return true;
            },
        },
        { // 8
            desc() {
                return `Upgrade 1 is dilated by ^${format(c.d1_01, 2)}, and PR2's effect uses a better formula.`;
            },
            cost() {
                return c.e10;
            },
            show() {
                return true;
            },
        },
        { // 9
            desc() {
                return `PR2 slightly weakens UP1 and UP2's hyper scaling. Currently: ${formatPerc(this.eff())}`;
            },
            eff() {
                if (player.value.generators.pr2.amount.lt(c.d25)) { return c.d1 }
                let eff = player.value.generators.pr2.amount.sub(c.d25);
                eff = eff.div(eff.add(c.d20)).mul(c.d0_25).add(c.d1);
                return eff;
            },
            cost() {
                return c.e12;
            },
            show() {
                return true;
            },
        },
        { // 10
            desc() {
                return `UP1 and UP2's cost scaling is overall reduced based off of your points. Currently: ${formatPerc(this.eff())}`;
            },
            eff() {
                let eff = player.value.points.max(c.e10);
                eff = eff.log10().div(c.d10).sqrt().sub(c.d1).div(c.d4).add(c.d1);
                return eff;
            },
            cost() {
                return c.e15;
            },
            show() {
                return true;
            },
        },
    ]
}

function updateAllKua() {
    updateKua("kua");
}

function updateKua(type) {
    let scal, pow, sta, i, j, k;
    switch (type) {
        case "kua":
            player.value.kua.best = Decimal.max(player.value.kua.amount, player.value.kua.best);
            player.value.kua.kshards.best = Decimal.max(player.value.kua.kshards.amount, player.value.kua.kshards.best);
            player.value.kua.kpower.best = Decimal.max(player.value.kua.kpower.amount, player.value.kua.kpower.best);
            
            tmp.value.kuaReq = c.e10;
            tmp.value.kuaMul = c.em4;
            tmp.value.kuaExp = c.d0_25;
            tmp.value.kuaDilate = c.d0_75;

            if (player.value.kua.kshards.upgrades >= 1) {
                tmp.value.kuaMul = tmp.value.kuaMul.mul(c.d1_5);
            }
            if (player.value.achievements.includes(13)) {
                tmp.value.kuaMul = tmp.value.kuaMul.mul(c.d1_5);
            }

            tmp.value.effectivePrai = player.value.generators.prai.totalInKua.add(tmp.value.praiPending);
            tmp.value.kuaCanDo = tmp.value.effectivePrai.gte(tmp.value.kuaReq) && player.value.nerf.kuaActive.gain;
            tmp.value.kuaPending = tmp.value.kuaCanDo ? tmp.value.effectivePrai.div(tmp.value.kuaReq).pow(tmp.value.kuaExp).log10().add(c.d1).pow(tmp.value.kuaDilate).sub(c.d1).pow10().sub(c.d1).mul(tmp.value.kuaMul) : c.d0;
            if (tmp.value.kuaPending.gte(c.e2)) {
                tmp.value.kuaPending = scale(tmp.value.kuaPending, 0.2, false, c.e2, c.d1, c.d1div3);
            }

            tmp.value.kuaEffects = { upg1Scaling: c.d1, upg1SuperScaling: c.d1, ptPower: c.d1, upg2Softcap: c.d1, kshardPrai: c.d1, kpower: c.d1 };

            player.value.kua.best = Decimal.max(player.value.kua.best, player.value.kua.amount);

            k = player.value.kua.amount;
            if (player.value.kua.kshards.upgrades >= 11) {
                k = k.max(c.d1).pow(KUA_UPGRADES.KShards[10].eff());
            }

            if (player.value.nerf.kuaActive.effects) {
                i = c.d1;

                j = player.value.points.max(c.d0).add(c.d1).log10().pow(c.d0_6).div(c.d200).mul(k.max(c.d0).mul(c.e4).add(c.d1).pow(c.d2div3).sub(c.d1)).add(c.d1).log10().add(c.d1);
                if (player.value.kua.kpower.upgrades >= 3) {
                    j = Decimal.max(j, player.value.points.max(c.d0).add(c.d1).pow(c.d0_022).mul(k.max(c.d0).mul(c.d10).add(c.d1).pow(c.d0_75).sub(c.d1)).add(c.d1).log10().add(c.d1));
                } 
                
                i = i.mul(j);
                tmp.value.kuaEffects.upg1Scaling = i;

                if (player.value.kua.kpower.upgrades >= 6) {
                    tmp.value.kuaEffects.upg1SuperScaling = tmp.value.kuaEffects.upg1Scaling.sqrt().sub(c.d1).div(c.d16).add(c.d1);
                }

                i = c.d1;
                if (player.value.kua.kpower.upgrades >= 3) {
                    j = k.max(c.d0).add(c.d1).log2().sqrt().mul(c.d0_02).add(c.d1); // 1 = ^1, 2 = ^1.02, 16 = ^1.04, 256 = ^1.06, 65,536 = ^1.08 ...
    
                    i = i.mul(j);
                }
                tmp.value.kuaEffects.ptPower = i;

                i = c.d1;
                if (player.value.kua.kpower.upgrades >= 6) {
                    j = k.max(c.e2).div(c.e2).pow(c.d7);
    
                    i = i.mul(j);
                }
                tmp.value.kuaEffects.upg2Softcap = i;

                i = c.d1;
                if (player.value.kua.kshards.upgrades >= 10) {
                    j = k.max(c.d10).log10().log10().div(c.d4).add(c.d1).pow(c.d2_5);
    
                    i = i.mul(j);
                }
                tmp.value.kuaEffects.kshardPrai = i;

                i = c.d1;
                if (player.value.kua.kshards.upgrades >= 10) {
                    j = k.max(c.d10).log10().sub(c.d1).div(c.d4).pow(c.d1_1).pow10();
    
                    i = i.mul(j);
                }
                tmp.value.kuaEffects.kpower = i;
            }

            i = c.d0;
            if (player.value.nerf.kuaActive.kshards.gain) {
                i = player.value.kua.amount;
                if (player.value.kua.kpower.upgrades >= 1) {
                    i = i.mul(c.d2_5);
                }
            }
            tmp.value.kuaShardGeneration = i;

            i = c.d0;
            if (player.value.nerf.kuaActive.kpower.gain) {
                i = player.value.kua.kshards.amount;
                if (player.value.kua.kshards.upgrades >= 10) {
                    i = i.mul(tmp.value.kuaEffects.kpower);
                }
            }
            tmp.value.kuaPowerGeneration = i;

            setAchievement(12, player.value.generators.prai.totalInKua.gte(c.e25));
            setAchievement(13, player.value.kua.amount.gte(c.d25));
            setAchievement(19, tmp.value.kuaPending.gte(c.d2_5) && player.value.generators.prai.times.eq(c.d0));
            setAchievement(29, player.value.kua.amount.gte(c.e7));
            setAchievement(30, player.value.generators.prai.totalInKua.gte(c.e90));
            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}

function buyKShardUpg(id) {
    if (id === player.value.kua.kshards.upgrades) {
        if (player.value.kua.kshards.amount.gte(KUA_UPGRADES.KShards[id].cost())) {
            player.value.kua.kshards.upgrades++;
            player.value.kua.kshards.amount = player.value.kua.kshards.amount.sub(KUA_UPGRADES.KShards[id].cost());
        }
    }
}

function buyKPowerUpg(id) {
    if (id === player.value.kua.kpower.upgrades) {
        if (player.value.kua.kpower.amount.gte(KUA_UPGRADES.KPower[id].cost())) {
            player.value.kua.kpower.upgrades++;
            player.value.kua.kpower.amount = player.value.kua.kpower.amount.sub(KUA_UPGRADES.KPower[id].cost());
        }
    }
}