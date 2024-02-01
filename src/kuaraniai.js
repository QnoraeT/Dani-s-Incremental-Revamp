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
            player.kua.best = Decimal.max(player.kua.amount, player.kua.best);
            player.kua.kshards.best = Decimal.max(player.kua.kshards.amount, player.kua.kshards.best);
            player.kua.kpower.best = Decimal.max(player.kua.kpower.amount, player.kua.kpower.best);
            
            tmp.kuaReq = c.e10;
            tmp.kuaMul = c.em4;
            tmp.kuaExp = c.d0_2;
            tmp.kuaDilate = c.d0_75;

            tmp.effectivePrai = player.generators.prai.totalInKua.add(tmp.praiPending);
            tmp.kuaCanDo = tmp.effectivePrai.gte(tmp.kuaReq) && player.nerf.kuaActive.gain;
            tmp.kuaPending = tmp.kuaCanDo ? tmp.effectivePrai.div(tmp.kuaReq).mul(tmp.kuaMul).add(1).pow(tmp.kuaExp).log10().add(1).pow(tmp.kuaDilate).sub(1).pow10().sub(1) : c.d0;

            i = c.d0;
            if (player.nerf.kuaActive.kshards.gain) {
                i = player.kua.amount;
            }
            tmp.kuaShardGeneration = i;

            i = c.d0;
            if (player.nerf.kuaActive.kpower.gain) {
                i = player.kua.kshards.amount;
            }
            tmp.kuaPowerGeneration = i;

            tmp.kuaEffects = {};

            i = c.d1;
            if (player.nerf.kuaActive.effects) {
                i = i.mul(player.points.max(0).add(1).log10().pow(0.5).div(100).mul(player.kua.amount.max(0).pow(0.75)).add(1).log10().add(1));
            }
            tmp.kuaEffects.upg1Scaling = i;
            break;
        default:
            throw new Error(`Kuaraniai area of the game does not contain ${type}`);
    }
}