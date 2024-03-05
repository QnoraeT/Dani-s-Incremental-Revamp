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
        when() { return c.d4 },
        text() { return `unlock the Upgrade 2 Autobuyer and increase the Upgrade 2 base from ${format(1.2, 3)}x -> ${format(c.d4div3, 3)}x.`}
    },
    {
        shown() { return true; },
        when() { return c.d5 },
        text() { return `unlock Upgrade 3.`}
    },
    {
        shown() { return true; },
        when() { return c.d7 },
        text() { return `weaken the Upgrade 1 scaling by ${formatPerc(c.d10div9, 3)}`}
    },
    {
        shown() { return true; },
        when() { return c.d11 },
        text() { return `slow down Upgrade 3 cost by ${formatPerc(c.d10div9, 3)}`}
    },
    {
        shown() { return true; },
        when() { return c.d15 },
        text() { return `decrease Upgrade 2's superscaling strength by ${formatPerc(c.d8div7, 3)}`}
    },
]

function buyGenUPG(id){
    switch (id) {
        case 1:
            if (player.value.points.gte(player.value.generators.upg1.cost)) {
                player.value.points = player.value.points.sub(player.value.generators.upg1.cost);
                player.value.generators.upg1.bought = player.value.generators.upg1.bought.add(c.d1);
                updateStart("upg1");
            }
            break;
        case 2:
            if (player.value.points.gte(player.value.generators.upg2.cost)) {
                player.value.points = player.value.points.sub(player.value.generators.upg2.cost);
                player.value.generators.upg2.bought = player.value.generators.upg2.bought.add(c.d1);
                updateStart("upg2");
            }
            break;
        case 3:
            if (player.value.points.gte(player.value.generators.upg3.cost)) {
                player.value.points = player.value.points.sub(player.value.generators.upg3.cost);
                player.value.generators.upg3.bought = player.value.generators.upg3.bought.add(c.d1);
                updateStart("upg3");
            }
            break;
        default:
            throw new Error(`Generator upgrade ${id} is not something you can buy... >_>`);
    }
}

function updateAllStart() {
    updateStart("pr2");
    updateStart("prai");
    updateStart("upg3");
    updateStart("upg2");
    updateStart("upg1");
}

function updateStart(type) {
    let scal, pow, sta, i, j;
    switch (type) {
        case "upg1":
            updateScaling("upg1");

            player.value.generators.upg1.costBase = c.d1_55;
            tmp.value.upg1CostDiv = c.d1;
            
            tmp.value.upg1CostDiv = tmp.value.upg1CostDiv.mul(player.value.generators.upg2.effect);

            scal = player.value.generators.upg1.bought;
            scal = doAllScaling(scal, tmp.value.scaling.upg1, false);
            player.value.generators.upg1.cost = Decimal.pow(player.value.generators.upg1.costBase, scal).div(tmp.value.upg1CostDiv).mul(5);

            if (player.value.points.mul(tmp.value.upg1CostDiv).gte(c.d5)) {
                scal = player.value.points.div(c.d5).mul(tmp.value.upg1CostDiv).log(player.value.generators.upg1.costBase);
                scal = doAllScaling(scal, tmp.value.scaling.upg1, true);
                player.value.generators.upg1.target = scal;
            } else {
                player.value.generators.upg1.target = c.d0;
            }

            i = c.d1_5
            i = i.add(player.value.generators.upg3.effect);
            player.value.generators.upg1.effectBase = i;

            i = c.d0;
            player.value.generators.upg1.freeExtra = i;

            i = player.value.generators.upg1.bought;
            i = i.add(player.value.generators.upg1.freeExtra);
            player.value.generators.upg1.effective = i;

            i = Decimal.pow(player.value.generators.upg1.effectBase, player.value.generators.upg1.effective)
            player.value.generators.upg1.effect = i;

            i = Decimal.pow(player.value.generators.upg1.effectBase, player.value.generators.upg1.effective.add(c.d1))
            player.value.generators.upg1.calculatedEB = i.div(player.value.generators.upg1.effect);

            tmp.value.upg1CanBuy = player.value.points.gte(player.value.generators.upg1.cost);
            player.value.generators.upg1.best = player.value.generators.upg1.best.max(player.value.generators.upg1.bought);

            tmp.value.up1ScalingColor = `#FFFFFF`
            for (let i = tmp.value.scaling.upg1.length - 1; i >= 0; i--) {
                if (player.value.generators.upg1.bought.gte(tmp.value.scaling.upg1[i].start)) {
                    tmp.value.up1ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            if (player.value.auto.upg1) {
                player.value.generators.upg1.bought = Decimal.max(player.value.generators.upg1.bought, player.value.generators.upg1.target.add(c.d1).floor())
            }

            setAchievement(0, player.value.generators.upg1.bought.gte(c.d1));
            setAchievement(1, player.value.generators.upg1.bought.gte(c.d20));
            setAchievement(10, player.value.generators.upg1.bought.gte(c.e2));
            break;
        case "upg2":
            updateScaling("upg2");
            updateSoftcap("upg2");

            player.value.generators.upg2.costBase = c.d1_25;
            tmp.value.upg2CostDiv = c.d1;

            scal = player.value.generators.upg2.bought;
            scal = doAllScaling(scal, tmp.value.scaling.upg2, false);
            player.value.generators.upg2.cost = Decimal.pow(player.value.generators.upg2.costBase, scal).div(tmp.value.upg2CostDiv).mul(1000);

            if (player.value.points.mul(tmp.value.upg2CostDiv).gte(c.e3)) {
                scal = player.value.points.div(c.e3).mul(tmp.value.upg2CostDiv).log(player.value.generators.upg2.costBase);
                scal = doAllScaling(scal, tmp.value.scaling.upg2, true);
                player.value.generators.upg2.target = scal;
            } else {
                player.value.generators.upg2.target = c.d0;
            }

            i = c.d1_2;
            if (player.value.generators.pr2.amount.gte(c.d4)) {
                i = i.mul(c.d10div9);
            }
            player.value.generators.upg2.effectBase = i;

            i = c.d0;
            player.value.generators.upg2.freeExtra = i;

            i = player.value.generators.upg2.bought;
            i = i.add(player.value.generators.upg2.freeExtra);
            player.value.generators.upg2.effective = i;

            i = Decimal.pow(player.value.generators.upg2.effectBase, player.value.generators.upg2.effective);
            setAchievement(5, i.gte(tmp.value.softcap.upg2[0].start));
            sta = tmp.value.softcap.upg2[0].start;
            pow = tmp.value.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.value.generators.upg2.effect = i;

            i = Decimal.pow(player.value.generators.upg2.effectBase, player.value.generators.upg2.effective.add(c.d1));
            sta = tmp.value.softcap.upg2[0].start;
            pow = tmp.value.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.value.generators.upg2.calculatedEB = i.div(player.value.generators.upg2.effect);

            tmp.value.upg2CanBuy = player.value.points.gte(player.value.generators.upg2.cost);

            tmp.value.up2ScalingColor = `#FFFFFF`
            for (let i = tmp.value.scaling.upg2.length - 1; i >= 0; i--) {
                if (player.value.generators.upg2.bought.gte(tmp.value.scaling.upg2[i].start)) {
                    tmp.value.up2ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            if (player.value.auto.upg2) {
                player.value.generators.upg2.bought = Decimal.max(player.value.generators.upg2.bought, player.value.generators.upg2.target.add(c.d1).floor())
            }

            break;
        case "upg3":
            updateScaling("upg3");
            updateSoftcap("upg3");

            tmp.value.upg3CostDiv = c.d1;

            scal = player.value.generators.upg3.bought;
            if (player.value.generators.pr2.amount.gte(c.d11)) {
                scal = scal.div(c.d10div9);
            }
            scal = doAllScaling(scal, tmp.value.scaling.upg3, false);
            player.value.generators.upg3.cost = Decimal.pow(c.d1_05, scal.pow(c.d2)).mul(Decimal.pow(c.e2, scal)).mul(c.e10).div(tmp.value.upg3CostDiv);

            if (player.value.points.mul(tmp.value.upg3CostDiv).gte(c.e10)) {
                scal = player.value.points.mul(tmp.value.upg3CostDiv).log10().mul(c.dlog1_05).sub(c.d10log1_05).add(1).sqrt().sub(1).div(c.dlog1_05)
                scal = doAllScaling(scal, tmp.value.scaling.upg3, true);
                if (player.value.generators.pr2.amount.gte(c.d11)) {
                    scal = scal.mul(c.d10div9);
                }
                player.value.generators.upg3.target = scal;
            } else {
                player.value.generators.upg3.target = c.d0;
            }

            i = c.d0_01;
            player.value.generators.upg3.effectBase = i;

            i = c.d0;
            player.value.generators.upg3.freeExtra = i;

            i = player.value.generators.upg3.bought;
            i = i.add(player.value.generators.upg3.freeExtra);
            player.value.generators.upg3.effective = i;

            i = player.value.generators.upg3.effectBase.mul(player.value.generators.upg3.effective);
            sta = tmp.value.softcap.upg3[0].start;
            pow = tmp.value.softcap.upg3[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.value.generators.upg3.effect = i;

            i = player.value.generators.upg3.effectBase.mul(player.value.generators.upg3.effective.add(c.d1));
            sta = tmp.value.softcap.upg3[0].start;
            pow = tmp.value.softcap.upg3[0].strength;
            i = scale(i, 0, false, sta, pow, c.d0_5);
            player.value.generators.upg3.calculatedEB = i.sub(player.value.generators.upg3.effect);

            tmp.value.upg3CanBuy = player.value.points.gte(player.value.generators.upg3.cost);

            tmp.value.up3ScalingColor = `#FFFFFF`
            for (let i = tmp.value.scaling.upg3.length - 1; i >= 0; i--) {
                if (player.value.generators.upg3.bought.gte(tmp.value.scaling.upg3[i].start)) {
                    tmp.value.up3ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            if (player.value.auto.upg3) {
                player.value.generators.upg3.bought = Decimal.max(player.value.generators.upg3.bought, player.value.generators.upg3.target.add(c.d1).floor())
            }

            break;
        case "prai":
            tmp.value.praiReq = c.e6;
            tmp.value.praiExp = c.d0_25;

            if (player.value.generators.pr2.amount.gte(c.d1) && player.value.totalPointsInPRai.gte(tmp.value.praiReq)) {
                i = player.value.totalPointsInPRai;
                i = i.max(0).div(tmp.value.praiReq).pow(tmp.value.praiExp).sub(c.d1).mul(tmp.value.praiExp).add(c.d1);
                i = i.mul(player.value.generators.pr2.effect);
                tmp.value.praiPending = i.floor();

                i = tmp.value.praiPending.add(c.d1).floor();
                i = i.div(player.value.generators.pr2.effect);
                i = i.sub(c.d1).div(tmp.value.praiExp).add(c.d1).root(tmp.value.praiExp).mul(tmp.value.praiReq);
                tmp.value.praiNext = i.sub(player.value.totalPointsInPRai);
            } else {
                tmp.value.praiPending = c.d1;
                tmp.value.praiNext = tmp.value.praiReq.sub(player.value.totalPointsInPRai).div(player.value.pps);
            }

            let j = c.d4;
            if (player.value.achievements.includes(6)) {
                j = j.mul(2.5);
            }

            i = player.value.generators.prai.amount;
            i = i.mul(j).add(c.d1);
            if (player.value.achievements.includes(10)) {
                i = i.mul(c.d3);
            }
            player.value.generators.prai.effect = i;

            i = player.value.generators.prai.amount.add(tmp.value.praiPending);
            i = i.mul(j).add(c.d1);
            if (player.value.achievements.includes(10)) {
                i = i.mul(c.d3);
            }
            tmp.value.praiNextEffect = i;

            player.value.generators.prai.best = Decimal.max(player.value.generators.prai.best, player.value.generators.prai.amount);
            player.value.generators.prai.bestInPR2 = Decimal.max(player.value.generators.prai.bestInPR2, player.value.generators.prai.amount);
            tmp.value.praiCanDo = player.value.totalPointsInPRai.gte(tmp.value.praiReq);

            setAchievement(2, player.value.generators.prai.best.gte(c.d1));
            setAchievement(3, player.value.generators.prai.best.gte(c.d10));
            setAchievement(6, player.value.totalPointsInPRai.gte(1e18));
            break;
        case "pr2":
            updateScaling("pr2");
            i = c.d0;
            player.value.generators.pr2.freeExtra = i;

            i = player.value.generators.pr2.amount;
            i = i.add(player.value.generators.pr2.freeExtra);
            i = i.max(0).add(c.d1).pow(i.mul(0.05).add(c.d1).ln().add(c.d1));
            player.value.generators.pr2.effect = i;

            tmp.value.pr2CostDiv = c.d1;
            if (player.value.achievements.includes(8)) {
                tmp.value.pr2CostDiv = tmp.value.pr2CostDiv.mul(c.d1_5);
            }

            scal = player.value.generators.pr2.amount;
            scal = doAllScaling(scal, tmp.value.scaling.pr2, false);
            player.value.generators.pr2.cost = scal.add(c.d4).factorial().mul(c.d5div3).div(tmp.value.pr2CostDiv);

            if (player.value.generators.prai.amount.gte(c.d10)) {
                scal = inverseFact(player.value.generators.prai.amount.mul(tmp.value.pr2CostDiv).div(c.d5div3)).sub(c.d4);
                scal = doAllScaling(scal, tmp.value.scaling.pr2, true);
                player.value.generators.pr2.target = scal;
            } else {
                player.value.generators.pr2.target = c.d0;
            }

            player.value.generators.pr2.best = Decimal.max(player.value.generators.pr2.best, player.value.generators.pr2.amount);

            tmp.value.pr2CanDo = player.value.generators.prai.amount.gte(player.value.generators.pr2.cost);

            tmp.value.pr2ScalingColor = `#FFFFFF`
            for (let i = tmp.value.scaling.pr2.length - 1; i >= 0; i--) {
                if (player.value.generators.pr2.amount.gte(tmp.value.scaling.pr2[i].start)) {
                    tmp.value.pr2ScalingColor = DEFAULT_SCALE[i].color();
                    break;
                }
            }

            tmp.value.pr2Text = "";
            if (player.value.generators.pr2.amount.lte(PR2_EFF[PR2_EFF.length - 1].when())) {
                for (i in PR2_EFF) {
                    // console.log(`${format(player.value.generators.pr2.amount)} / ${PR2_EFF[i].when()}`)
                    if (player.value.generators.pr2.amount.lt(PR2_EFF[i].when()) && PR2_EFF[i].shown()) {
                        tmp.value.pr2Text = {info: PR2_EFF[i].when(), txt: PR2_EFF[i].text()};
                        break;
                    }
                }
            }

            setAchievement(4, player.value.generators.pr2.best.gte(c.d1));
            setAchievement(7, player.value.generators.pr2.best.gte(c.d2));
            setAchievement(9, player.value.generators.pr2.best.gte(c.d4));
            break;
        default:
            throw new Error(`Starting area of the game does not contain ${type}`);
    }
}
