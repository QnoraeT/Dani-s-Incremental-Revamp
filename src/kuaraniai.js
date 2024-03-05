"use strict";
const KUA_UPGRADES = {
    KShards: [
        {
            desc() {
                return `Unlock UP2's autobuyer and Kuaraniai Gain is multiplied by ${format(c.d3)}x`;
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
                return `KShards boost PRai's effect. Currently: `;
            },
            eff() {
                let i = c.d1
                return i
            },
            cost() {
                return D(50);
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP1's effect reduces UP2's scaling strength. Currently: `;
            },
            eff() {
                let i = c.d1
                return i
            },
            cost() {
                return D(400);
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP1's scaling starts ${format(10)} later and is ${formatPerc(5/4)} weaker, and superscaling starts ${format(5)} later and is ${formatPerc(10/9)} weaker.`;
            },
            cost() {
                return D(1000);
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
                return D(2500);
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `UP2's superscaling and softcap are ${formatPerc(3/2)} weaker.`;
            },
            cost() {
                return D(12000);
            },
            show() {
                return true;
            }
        },
    ],
    KPower: [
        {
            desc() {
                return `Multiply KShard gain by ${format(5)}x, and KPower buffs Achievement 'Stockpiler'. Currently: `;
            },
            eff() {
                let i = c.d1
                return i
            },
            cost() {
                return D(1000);
            },
            show() {
                return true;
            }
        },
        {
            desc() {
                return `Be able to unlock a new feature at ${format(100)} Kuaraniai, and KPower increases UP2's effectiveness. Currently: `;
            },
            eff() {
                let i = c.d1
                return i
            },
            cost() {
                return D(10000);
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
                return D(40000);
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
                let i = c.d1
                return i
            },
            cost() {
                return D(100000);
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
                return D(250000);
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
            tmp.value.kuaExp = c.d0_2;
            tmp.value.kuaDilate = c.d0_75;

            tmp.value.effectivePrai = player.value.generators.prai.totalInKua.add(tmp.value.praiPending);
            tmp.value.kuaCanDo = tmp.value.effectivePrai.gte(tmp.value.kuaReq) && player.value.nerf.kuaActive.gain;
            tmp.value.kuaPending = tmp.value.kuaCanDo ? tmp.value.effectivePrai.div(tmp.value.kuaReq).mul(tmp.value.kuaMul).add(1).pow(tmp.value.kuaExp).log10().add(1).pow(tmp.value.kuaDilate).sub(1).pow10().sub(1).div(1.5) : c.d0;

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
                i = i.mul(player.value.points.max(0).add(1).log10().pow(0.5).div(100).mul(player.value.kua.amount.max(0).pow(0.75)).add(1).log10().add(1));
            }
            tmp.value.kuaEffects.upg1Scaling = i;
            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}