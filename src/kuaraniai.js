"use strict";
const KUA_UPGRADES = {
    KShards: [
        {
            desc() {
                return `Gain ${format(c.em2, 3)}% of your pending PRai per second, and Kuaraniai Gain is multiplied by ${format(c.d3)}x`;
            },
            cost() {
                return c.d0_1;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `KShards boost PRai's effect. Currently: ${format(this.eff(), 2)}x`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.kua.kshards.amount.max(c.d0).add(c.d1).pow(2).sub(1).div(2).add(c.d1);
                return i;
            },
            cost() {
                return c.d0_5;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP1's effect reduces UP2's scaling strength. Currently: ${formatPerc(this.eff())}`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.generators.upg1.effect.max(1e10).log10().div(c.d10).root(2).sub(1).div(5).add(c.d1);
                return i;
            },
            cost() {
                return c.d40;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP1's scaling starts ${format(c.d10)} later and is ${format(c.d20, 3)}% weaker, and superscaling starts ${format(c.d5)} later and is ${format(c.d10, 3)}% weaker.`;
            },
            cost() {
                return c.e2;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `PR2's effect exponent increases twice as fast, and UP2's base is increased from ${format(c.d4div3, 3)} to ${format(c.d1_5, 3)}.`;
            },
            cost() {
                return c.d250;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP2's superscaling and softcap are ${format(c.d1div3.mul(c.e2), 3)}% weaker.`;
            },
            cost() {
                return c.d1200;
            },
            show() {
                return true;
            }
        },
    ],
    KPower: [
        {
            desc() {
                return `Multiply KShard gain by ${format(c.d5)}x, and KPower buffs Upgrade 2's base. Currently: +${format(this.eff(), 4)}`;
            },
            eff() {
                let i = c.d0;
                    i = player.value.kua.kpower.amount.max(c.d0).add(c.d1).mul(10).log10().log10().add(c.d1).pow(2).sub(1).div(20);
                return i;
            },
            cost() {
                return c.d1;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `Be able to unlock a new feature at ${format(c.e2)} Kuaraniai, and KPower increases UP3's effectiveness. Currently: +${format(this.eff().sub(1).mul(100), 3)}%`;
            },
            eff() {
                let i = c.d1;
                    i = player.value.kua.kpower.amount.max(c.d0).add(c.d1).log10().add(c.d1).root(3).sub(1).div(8).add(c.d1);
                return i;
            },
            cost() {
                return c.d10;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `Kuaraniai's effect on UP1's scaling uses a better formula, and add another effect.`;
            },
            cost() {
                return c.e2;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP2's softcap is ${formatPerc(D(5/3))} weaker and starts later based off of your KPower. Currently: `;
            },
            eff() {
                let i = c.d1;
                return i;
            },
            cost() {
                return c.d300;
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `PRai's effect is more powerful based off of your KPower. Currently: ^`;
            },
            eff() {
                let i = c.d1
                return i
            },
            cost() {
                return c.e3;
            },
            show() {
                return true;
            }
        },
    ]
}

function updateAllKua() {
    updateKua("kua");
}

function updateKua(type) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "kua":
            player.value.kua.best = Decimal.max(player.value.kua.amount, player.value.kua.best);
            player.value.kua.kshards.best = Decimal.max(player.value.kua.kshards.amount, player.value.kua.kshards.best);
            player.value.kua.kpower.best = Decimal.max(player.value.kua.kpower.amount, player.value.kua.kpower.best);
            
            tmp.value.kuaReq = c.e10;
            tmp.value.kuaMul = c.em4;
            tmp.value.kuaExp = c.d0_15;
            tmp.value.kuaDilate = c.d0_75;

            tmp.value.effectivePrai = player.value.generators.prai.totalInKua.add(tmp.value.praiPending);
            tmp.value.kuaCanDo = tmp.value.effectivePrai.gte(tmp.value.kuaReq) && player.value.nerf.kuaActive.gain;
            tmp.value.kuaPending = tmp.value.kuaCanDo ? tmp.value.effectivePrai.div(tmp.value.kuaReq).mul(tmp.value.kuaMul).add(c.d1).pow(tmp.value.kuaExp).log10().add(c.d1).pow(tmp.value.kuaDilate).sub(1).pow10().sub(1).div(1.5) : c.d0;

            i = c.d0;
            if (player.value.nerf.kuaActive.kshards.gain) {
                i = player.value.kua.amount;
            }
            tmp.value.kuaShardGeneration = i;

            i = c.d0;
            if (player.value.nerf.kuaActive.kpower.gain) {
                i = player.value.kua.kshards.amount;
            }
            tmp.value.kuaPowerGeneration = i;

            tmp.value.kuaEffects = {};

            i = c.d1;
            if (player.value.nerf.kuaActive.effects) {
                j = player.value.points.max(c.d0).add(c.d1).log10().pow(c.d0_6).div(200).mul(player.value.kua.amount.max(c.d0).mul(c.e4).add(c.d1).pow(c.d2div3).sub(1)).add(c.d1).log10().add(c.d1);

                if (player.value.kua.kpower.upgrades >= 3) {
                    j = Decimal.max(j, player.value.points.max(c.d0).add(c.d1).pow(c.d0_02).mul(player.value.kua.amount.max(c.d0).mul(c.e3).add(c.d1).pow(c.d0_75).sub(1)).add(c.d1).log10().add(c.d1));
                } 
                
                i = i.mul(j);
            }
            tmp.value.kuaEffects.upg1Scaling = i;

            i = c.d1;
            if (player.value.nerf.kuaActive.effects && player.value.kua.kpower.upgrades >= 3) {
                j = player.value.kua.amount.max(c.d1).log2().sqrt().mul(c.d0_02).add(c.d1); // 1 = ^1, 2 = ^1.02, 16 = ^1.04, 256 = ^1.06, 65,536 = ^1.08 ...

                i = i.mul(j);
            }
            tmp.value.kuaEffects.ptPower = i;
            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}

function buyKShardUpg(id) {

}

function buyKPowerUpg(id) {

}