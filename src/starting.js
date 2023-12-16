// NOTE: ALL INFORMATION USED BY OTHER EFFECTS MUST BE STORED IN THE PLAYER VARIABLE!! LEAVING IT IN TMP WILL BREAK THINGS BECAUSE THEY OULD BE LEFT UNDEFINED!
// NOTE: Do not test updateProgression(x) because sometimes that could cause infinite loops

const PR2_EFF = {

}

function updateAllStart() {
    updateStart("pr2")
    updateStart("prai")
    updateStart("upg2")
    updateStart("upg1")
}

function updateStart(type) {
    let scal, pow, sta, i;
    switch (type) {
        case "upg1":
            updateScaling("upg1");
            player.generators.upg1.costBase = D(1.55);
            tmp.upg1CostDiv = D(1);
            
            tmp.upg1CostDiv = tmp.upg1CostDiv.mul(player.generators.upg2.effect);

            scal = player.generators.upg1.bought;
            scal = doAllScaling(scal, tmp.scaling.upg1, false)
            player.generators.upg1.cost = Decimal.pow(player.generators.upg1.costBase, scal).div(tmp.upg1CostDiv).mul(5);

            scal = player.points.div(5).mul(tmp.upg1CostDiv).log(player.generators.upg1.costBase);
            scal = doAllScaling(scal, tmp.scaling.upg1, true)
            player.generators.upg1.target = scal;

            player.generators.upg1.effectBase = D(1.5);

            i = player.generators.upg1.bought
            i = i.add(player.generators.upg1.freeExtra)
            player.generators.upg1.effect = Decimal.pow(player.generators.upg1.effectBase, i);

            tmp.upg1CanBuy = player.points.gte(player.generators.upg1.cost);
            player.generators.upg1.best = player.generators.upg1.best.max(player.generators.upg1.bought)
            break;
        case "upg2":
            updateScaling("upg2");
            updateSoftcap("upg2");
            player.generators.upg2.costBase = D(1.25);
            tmp.upg2CostDiv = D(1);

            scal = player.generators.upg2.bought;
            scal = doAllScaling(scal, tmp.scaling.upg2, false)
            player.generators.upg2.cost = Decimal.pow(player.generators.upg2.costBase, scal).div(tmp.upg2CostDiv).mul(1000);

            scal = player.points.div(1000).mul(tmp.upg2CostDiv).log(player.generators.upg2.costBase);
            scal = doAllScaling(scal, tmp.scaling.upg2, true)
            player.generators.upg2.target = scal;

            player.generators.upg2.effectBase = D(1.2);

            i = player.generators.upg2.bought
            i = i.add(player.generators.upg2.freeExtra)
            i = Decimal.pow(player.generators.upg2.effectBase, i);

            sta = tmp.softcap.upg2[0].start;
            pow = tmp.softcap.upg2[0].strength;
            i = scale(i, 0, false, sta, pow, D(0.5));

            player.generators.upg2.effect = i;

            tmp.upg2CanBuy = player.points.gte(player.generators.upg2.cost);
            break;
        case "prai":
            tmp.praiReq = D(1e6)
            tmp.praiExp = D(0.25)

            if (player.generators.pr2.amount.gte(1)) {
                i = player.totalPointsInPRai;
                i = i.max(0).div(tmp.praiReq).root(tmp.praiExp).sub(1).mul(tmp.praiExp).add(1);
                i = i.mul(player.generators.pr2.effect)
                tmp.praiPending = i.floor();
    
                i = tmp.praiPending.add(1).floor();
                i = i.div(player.generators.pr2.effect)
                i = i.sub(1).div(tmp.praiExp).add(1).pow(tmp.praiExp).mul(tmp.praiReq);
                tmp.praiNext = i;
            } else {
                tmp.praiPending = dOne;
                tmp.praiNext = tmp.praiReq.sub(player.totalPointsInPRai).div(player.pps);
            }

            i = player.generators.prai.amount;
            i = i.mul(4).add(1);
            player.generators.prai.effect = i;

            i = player.generators.prai.amount.add(tmp.praiPending);
            i = i.mul(4).add(1);
            tmp.praiNextEffect = i;

            tmp.praiCanDo = player.points.gte(tmp.praiReq)
            break;
        case "pr2":
            updateScaling("pr2");
            i = player.generators.pr2.amount;
            i = i.add(player.generators.pr2.freeExtra)
            i = i.max(1).pow(1.25);
            player.generators.pr2.effect = i;

            tmp.pr2CostDiv = D(1);

            scal = player.generators.pr2.amount;
            scal = doAllScaling(scal, tmp.scaling.pr2, false)
            player.generators.pr2.cost = scal.pow(2).mul(10).div(tmp.pr2CostDiv);

            scal = player.generators.prai.amount.mul(tmp.pr2CostDiv).div(10).root(2);
            scal = doAllScaling(scal, tmp.scaling.pr2, true)
            player.generators.pr2.target = scal;
            break;
        default:
            throw new Error(`Starting area of the game does not contain ${type}`);
    }
}
