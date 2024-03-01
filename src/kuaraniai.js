"use strict";
const KUA_UPGRADES = {
    KShards: [
        {
            desc() {
                return "Unlock UP2's autobuyer and Kuaraniai Gain is multiplied by 3x";
            },
            cost() {
                return dTen;
            },
            show() {
                return true;
            }
        }
    ],
    KPower: [
        {
            desc() {
                return "";
            },
            cost() {
                return D(1000);
            },
            show() {
                return true;
            }
        }
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
            tmp.value.kuaPending = tmp.value.kuaCanDo ? tmp.value.effectivePrai.div(tmp.value.kuaReq).mul(tmp.value.kuaMul).add(1).pow(tmp.value.kuaExp).log10().add(1).pow(tmp.value.kuaDilate).sub(1).pow10().sub(1) : c.d0;

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