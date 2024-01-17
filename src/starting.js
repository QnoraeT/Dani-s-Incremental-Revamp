// NOTE: ALL INFORMATION USED BY OTHER EFFECTS MUST BE STORED IN THE PLAYER VARIABLE!! LEAVING IT IN TMP WILL BREAK THINGS BECAUSE THEY OULD BE LEFT UNDEFINED!
// NOTE: Do not test updateProgression(x) because sometimes that could cause infinite loops
"use strict";

const PR2_EFF = [
    {
        shown() { return true; },
        when() { return c.d1 },
        text() { return `you gain a new upgrade and make PRai resets unforced.` }
    },
    {
        shown() { return true; },
        when() { return c.d2 },
        text() { return `unlock the Upgrade 1 Autobuyer.` }
    },
    {
        shown() { return true; },
        when() { return D(5) },
        text() { return `weaken the Upgrade 2 softcap by ${formatPerc(3, 3)} and delay it from ${format(10)} -> ${format(30)}`}
    }
]

function buyGenUPG(id){
    switch (id) {
        case 1:
            if (player.points.gte(player.generators.upg1.cost)) {
                player.points = player.points.sub(player.generators.upg1.cost);
                player.generators.upg1.bought = player.generators.upg1.bought.add(1);
                updateStart("upg1");
            }
            break;
        case 2:
            if (player.points.gte(player.generators.upg2.cost)) {
                player.points = player.points.sub(player.generators.upg2.cost);
                player.generators.upg2.bought = player.generators.upg2.bought.add(1);
                updateStart("upg2");
            }
            break;
        default:
            throw new Error(`Generator upgrade ${id} is not something you can buy... >_>`);
    }
}

function updateAllStart() {
    updateStart("pr2");
    updateStart("prai");
    updateStart("upg2");
    updateStart("upg1");
}

function updateStart(type) {
    let scal, pow, sta, i;
    switch (type) {
        case "upg1":
            updateScaling("upg1");

            player.generators.upg1.costBase = c.d1_55;
            tmp.upg1CostDiv = c.d1;
            
            tmp.upg1CostDiv = tmp.upg1CostDiv.mul(player.generators.upg2.effect);

            scal = player.generators.upg1.bought;
            scal = doAllScaling(scal, tmp.scaling.upg1, false);
            player.generators.upg1.cost = Decimal.pow(player.generators.upg1.costBase, scal).div(tmp.upg1CostDiv).mul(5);

            if (player.points.mul(tmp.upg1CostDiv).gte(5)) {
                scal = player.points.div(5).mul(tmp.upg1CostDiv).log(player.generators.upg1.costBase);
                scal = doAllScaling(scal, tmp.scaling.upg1, true);
                player.generators.upg1.target = scal;
            } else {
                player.generators.upg1.target = c.d0;
            }

            player.generators.upg1.effectBase = c.d1_5;

            i = c.d0;
            player.generators.upg1.freeExtra = i;

            i = player.generators.upg1.bought;
            i = i.add(player.generators.upg1.freeExtra);
            player.generators.upg1.effective = i;

            i = Decimal.pow(player.generators.upg1.effectBase, player.generators.upg1.effective)
            player.generators.upg1.effect = i;

            i = Decimal.pow(player.generators.upg1.effectBase, player.generators.upg1.effective.add(1))
            player.generators.upg1.calculatedEB = i.div(player.generators.upg1.effect);

            tmp.upg1CanBuy = player.points.gte(player.generators.upg1.cost);
            player.generators.upg1.best = player.generators.upg1.best.max(player.generators.upg1.bought);

            tmp.up1ScalingColor = `#FFFFFF`
            for (let i = tmp.scaling.upg1.length - 1; i >= 0; i--) {
                if (player.generators.upg1.bought.gte(tmp.scaling.upg1[i].start)) {
                    tmp.up1ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            if (player.auto.upg1) {
                player.generators.upg1.bought = Decimal.max(player.generators.upg1.bought, player.generators.upg1.target.add(1).floor())
            }

            setAchievement(0, player.generators.upg1.bought.gte(1));
            setAchievement(1, player.generators.upg1.bought.gte(20));
            setAchievement(2, player.generators.upg1.bought.gte(50));
            break;
        case "upg2":
            updateScaling("upg2");
            updateSoftcap("upg2");

            player.generators.upg2.costBase = c.d1_25;
            tmp.upg2CostDiv = c.d1;

            scal = player.generators.upg2.bought;
            scal = doAllScaling(scal, tmp.scaling.upg2, false);
            player.generators.upg2.cost = Decimal.pow(player.generators.upg2.costBase, scal).div(tmp.upg2CostDiv).mul(1000);

            if (player.points.mul(tmp.upg2CostDiv).gte(1000)) {
                scal = player.points.div(1000).mul(tmp.upg2CostDiv).log(player.generators.upg2.costBase);
                scal = doAllScaling(scal, tmp.scaling.upg2, true);
                player.generators.upg2.target = scal;
            } else {
                player.generators.upg2.target = c.d0;
            }

            player.generators.upg2.effectBase = c.d1_2;

            i = c.d0;
            player.generators.upg2.freeExtra = i;

            i = player.generators.upg2.bought;
            i = i.add(player.generators.upg2.freeExtra);
            player.generators.upg2.effective = i;

            i = Decimal.pow(player.generators.upg2.effectBase, player.generators.upg2.effective);
            setAchievement(5, i.gte(tmp.softcap.upg2[0].start));
            sta = tmp.softcap.upg2[0].start;
            pow = tmp.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.generators.upg2.effect = i;

            i = Decimal.pow(player.generators.upg2.effectBase, player.generators.upg2.effective.add(1));
            sta = tmp.softcap.upg2[0].start;
            pow = tmp.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.generators.upg2.calculatedEB = i.div(player.generators.upg2.effect);

            tmp.upg2CanBuy = player.points.gte(player.generators.upg2.cost);

            player.generators.upg2.calculatedEB = player.generators.upg2.effect.root(player.generators.upg2.effective);

            tmp.up2ScalingColor = `#FFFFFF`
            for (let i = tmp.scaling.upg2.length - 1; i >= 0; i--) {
                if (player.generators.upg2.bought.gte(tmp.scaling.upg2[i].start)) {
                    tmp.up2ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            break;
        case "prai":
            tmp.praiReq = c.e6;
            tmp.praiExp = c.d1div3;

            if (player.generators.pr2.amount.gte(1) && player.totalPointsInPRai.gte(tmp.praiReq)) {
                i = player.totalPointsInPRai;
                i = i.max(0).div(tmp.praiReq).pow(tmp.praiExp).sub(1).mul(tmp.praiExp).add(1);
                i = i.mul(player.generators.pr2.effect);
                tmp.praiPending = i.floor();

                i = tmp.praiPending.add(1).floor();
                i = i.div(player.generators.pr2.effect);
                i = i.sub(1).div(tmp.praiExp).add(1).root(tmp.praiExp).mul(tmp.praiReq);
                tmp.praiNext = i.sub(player.totalPointsInPRai);
            } else {
                tmp.praiPending = c.d1;
                tmp.praiNext = tmp.praiReq.sub(player.totalPointsInPRai).div(player.pps);
            }

            i = player.generators.prai.amount;
            i = i.mul(4).add(1);
            player.generators.prai.effect = i;

            i = player.generators.prai.amount.add(tmp.praiPending);
            i = i.mul(4).add(1);
            tmp.praiNextEffect = i;

            player.generators.prai.best = Decimal.max(player.generators.prai.best, player.generators.prai.amount);
            player.generators.prai.bestInPR2 = Decimal.max(player.generators.prai.bestInPR2, player.generators.prai.amount);
            tmp.praiCanDo = player.totalPointsInPRai.gte(tmp.praiReq);
            setAchievement(2, player.generators.prai.best.gte(1));
            setAchievement(3, player.generators.prai.best.gte(10));
            setAchievement(6, player.totalPointsInPRai.gte(1e10));
            break;
        case "pr2":
            updateScaling("pr2");
            i = c.d0;
            player.generators.pr2.freeExtra = i;

            i = player.generators.pr2.amount;
            i = i.add(player.generators.pr2.freeExtra)
            i = i.max(0).add(1).pow(scale(i.pow(2).mul(0.1).add(1), 1.3, false, c.d4, c.d1, c.d2));
            player.generators.pr2.effect = i;

            tmp.pr2CostDiv = c.d1;

            scal = player.generators.pr2.amount;
            scal = doAllScaling(scal, tmp.scaling.pr2, false);
            player.generators.pr2.cost = scal.add(1).pow(3).mul(10).div(tmp.pr2CostDiv);

            if (player.generators.prai.amount.gte(10)) {
                scal = player.generators.prai.amount.mul(tmp.pr2CostDiv).div(10).root(3).sub(1);
                scal = doAllScaling(scal, tmp.scaling.pr2, true);
                player.generators.pr2.target = scal;
            } else {
                player.generators.pr2.target = c.d0;
            }

            player.generators.pr2.best = Decimal.max(player.generators.pr2.best, player.generators.pr2.amount);

            tmp.pr2CanDo = player.generators.prai.amount.gte(player.generators.pr2.cost);

            tmp.pr2ScalingColor = `#FFFFFF`
            for (let i = tmp.scaling.pr2.length - 1; i >= 0; i--) {
                if (player.generators.pr2.amount.gte(tmp.scaling.pr2[i].start)) {
                    tmp.pr2ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            tmp.pr2Text = "";
            if (player.generators.pr2.amount.lte(PR2_EFF[PR2_EFF.length - 1].when())) {
                for (i in PR2_EFF) {
                    // console.log(`${format(player.generators.pr2.amount)} / ${PR2_EFF[i].when()}`)
                    if (player.generators.pr2.amount.lt(PR2_EFF[i].when()) && PR2_EFF[i].shown()) {
                        tmp.pr2Text = {info: PR2_EFF[i].when(), txt: PR2_EFF[i].text()};
                        break;
                    }
                }
            }
            setAchievement(4, player.generators.pr2.best.gte(1));
            setAchievement(7, player.generators.pr2.best.gte(2));
            setAchievement(9, player.generators.pr2.best.gte(4));
            break;
        default:
            throw new Error(`Starting area of the game does not contain ${type}`);
    }
}
