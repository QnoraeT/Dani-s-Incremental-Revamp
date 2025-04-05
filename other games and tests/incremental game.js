"use strict";
// ! Ultimate Goal:
// ! Make inflation hard to do -- To test all currencies, try dilating them by 2 to see what happens, it should stay stable


// START UTILS FUNCTIONS


function rand(min, max) {
  return Math.random() * (max - min) + min;
}


function inverseFact(x) {
    if (Decimal.gte(x, "eee18")) {
        return Decimal.log10(x);
    }
    if (Decimal.gte(x, "eee4")) {
        return Decimal.log10(x).div(Decimal.log10(x).log10());
    }
    return Decimal.div(x, 2.5066282746310002).ln().div(Math.E).lambertw().add(1).exp().sub(0.5);
};


class Element {
    constructor(el) {
        this.id = typeof el == "string" ? el : el.id;
        this.el = document.getElementById(this.id);
        if (this.el === null) {
            throw new Error(`${el} could not be found in the DOM!`)
        }
    }
    get style() {
        return this.el.style;
    }
    setTxt(txt) {
        if (this.el.textContent === txt) { return; }
        this.el.textContent = txt;
    }
    static setTxt(id, txt) {
        new Element(id).setTxt(txt);
    }
    setHTML(html) {
        if (this.el.innerHTML === html) { return; }
        this.el.innerHTML = html;
    }
    static setHTML(id, html) {
        new Element(id).setHTML(html);
    }
    addHTML(html) {
        this.el.innerHTML += html;
    }
    static addHTML(id, html) {
        new Element(id).addHTML(html);
    }
    setDisplay(bool) {
        this.el.style.display = bool ? "" : "none";
    }
    static setDisplay(id, bool) {
        new Element(id).setDisplay(bool);
    }
    addClass(name) {
        this.el.classList.add(name);
    }
    static addClass(id, name) {
        new Element(id).addClass(name);
    }
    removeClass(name) {
        this.el.classList.remove(name);
    }
    static removeClass(id, name) {
        new Element(id).removeClass(name);
    }
    clearClasses() {
        this.el.className = "";
    }
    static clearClasses(id) {
        new Element(id).clearClasses();
    }
    setClasses(data) {
        this.clearClasses();
        let list = Object.keys(data).filter(x => data[x]);
        for (let i = 0; i < list.length; i++) this.addClass(list[i]);
    }
    static setClasses(id, data) {
        new Element(id).setClasses(data);
    }
    setVisible(bool) {
        var s = this.el.style
        s.visibility = bool ? "visible" : "hidden";
        s.opacity = bool ? 1 : 0
        s.pointerEvents = bool ? "all" : "none"
    }
    static setVisible(id, bool) {
        new Element(id).setVisible(bool);
    }
    setOpacity(value) {
        this.el.style.opacity = value;
    }
    static setOpacity(id, value) {
        new Element(id).setOpacity(value);
    }
    changeStyle(type, input) {
        this.el.style[type] = input;
    }
    static changeStyle(id, type, input) {
        new Element(id).changeStyle(type, input);
    }
    isChecked() {
        return this.el.checked;
    }
    static isChecked(id) {
        return new Element(id).isChecked();
    }
    static allFromClass(name) {
        return Array.from(document.getElementsByClassName(name)).map(x => new Element(x.id));
    }
    setAttr(name, input) {
        this.el.setAttribute(name, input);
    }
    static setAttr(id, name, input) {
        new Element(id).setAttribute(name, input);
    }
    setTooltip(input) {
        this.setAttr("tooltip-html", input);
    }
    static setTooltip(id, input) {
        new Element(id).setAttr("tooltip-html", input);
    }
    setSize(h, w) {
        this.el.style["min-height"] = h + "px";
        this.el.style["min-width"] = w + "px";
    }
    static setSize(id, h, w) {
        new Element(id).setSize(h, w);
    }
}


let el = x => document.getElementById(x);
const toHTMLvar = x => html[x] = new Element(x)


function D(x) { return new Decimal(x) }


function lerp(t, s, e, type, p) {
    if (isNaN(t)) {
        throw new Error(`malformed input [LERP]: ${t}, expecting f64`)
    }
    t = clamp(t, 0, 1);
    if (t === 0) {
        return s;
    }
    if (t === 1) {
        return e;
    }
    switch (type) {
        case "QuadIn":
            t = t * t;
            break;
        case "QuadOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t));
            break;
        case "CubeIn":
            t = t * t * t;
            break;
        case "CubeOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t) * (1.0 - t));
            break;
        case "Smooth":
            t = 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
            break;
        case "ExpSCurve":
            t = (Math.tanh(p * Math.tan((t + 1.5 - ((t - 0.5) / 1e9)) * Math.PI)) + 1) / 2;
            break;
        case "Sine":
            t = Math.sin(t * Math.PI / 2) ** 2;
            break;
        case "Expo":
            if (p > 0) {
                t = Math.coth(p / 2) * Math.tanh(p * t / 2);
            } else if (p < 0) {
                t = 1.0 - Math.coth(p / 2) * Math.tanh(p * (1.0 - t) / 2);
            }
            break;
        default:
            break;
    }
    return (s * (1 - t)) + (e * t);
}


function clamp(num, min, max) { // why isn't this built in
    return Math.min(Math.max(num, min), max);
}


const abbSuffixes = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc","UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDc","NoDc","Vg"];
const letter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];


const timeList = [
    { name: "pt",  stop: true,  amt: 5.39e-44 },
    { name: "qs",  stop: true,  amt: 1 / 1e30 },
    { name: "rs",  stop: true,  amt: 1 / 1e27 },
    { name: "ys",  stop: true,  amt: 1 / 1e24 },
    { name: "zs",  stop: true,  amt: 1 / 1e21 },
    { name: "as",  stop: true,  amt: 1 / 1e18 },
    { name: "fs",  stop: true,  amt: 1 / 1e15 },
    { name: "ps",  stop: true,  amt: 1 / 1e12 },
    { name: "ns",  stop: true,  amt: 1 / 1e9 },
    { name: "µs",  stop: true,  amt: 1 / 1e6 },
    { name: "ms",  stop: true,  amt: 1 / 1e3 },
    { name: "s",   stop: true,  amt: 1 },
    { name: "m",   stop: false, amt: 60 },
    { name: "h",   stop: false, amt: 3600 },
    { name: "d",   stop: false, amt: 86400 },
    { name: "mo",  stop: false, amt: 2592000 },
    { name: "y",   stop: false, amt: 3.1536e7 },
    { name: "mil", stop: false, amt: 3.1536e10 },
    { name: "uni", stop: false, amt: 4.320432e17 }
];


const abbExp = D(1e66);


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


function formatLetter(remainingLogNumber, string = ``) {
    if (Decimal.gte(remainingLogNumber, 1e12)) {
        console.error(
            `formatLetter is taking in numbers greater than ee12! This *will* freeze the game!`
        );
        return ``;
    }
    if (Decimal.lt(remainingLogNumber, letter.length)) {
        return `${letter[new Decimal(remainingLogNumber).toNumber()]}${string}`;
    }
    return formatLetter(
        Decimal.div(remainingLogNumber, letter.length).sub(1).floor(),
        `${letter[new Decimal(remainingLogNumber).mod(letter.length).toNumber()]}${string}`
    );
}


function format(number, dec = 0, expdec = 3, notation = 0) {
    if (Decimal.lt(number, 0)) return `-${format(Decimal.negate(number), dec, expdec)}`;
    if (Decimal.eq(number, 0)) return (0).toFixed(dec);
    if (Decimal.isNaN(number)) return "NaN";
    if (!Decimal.isFinite(number)) return "Infinity";
    try {
        switch (notation) {
            case 0: // mixed
                if (Decimal.gte(number, 1e8) && Decimal.lt(number, abbExp)) {
                    const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
                    return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${abbSuffixes[abb.toNumber()]}`;
                }
                return format(number, dec, expdec, 1);
            case 1: // sci
                if (Decimal.lt(number, "e-1e8")) {
                    return `e${format(Decimal.log10(number), 0, expdec)}`;
                } else if (Decimal.lt(number, 0.001)) {
                    const exp = Decimal.log10(number).mul(1.00000000001).floor();
                    return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
                } else if (Decimal.lt(number, 1e8)) {
                    return numberWithCommas(new Decimal(number).toNumber().toFixed(dec));
                } else if (Decimal.lt(number, 'ee8')) {
                    const exp = Decimal.log10(number).mul(1.00000000001).floor();
                    return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
                } else if (Decimal.lt(number, "10^^7")) {
                    return `e${format(Decimal.log10(number), dec, expdec)}`;
                } else {
                    return `F${format(Decimal.slog(number), Math.max(dec, 3), expdec)}`;
                }
            case 2: // letters
                if (Decimal.gte(number, 1e3) && Decimal.lt(number, 'ee8')) {
                    const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
                    return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${formatLetter(abb.sub(1), "")}`;
                }
                return format(number, dec, expdec, 1);
            case 3:
                if (Decimal.gte(number, "10^^7")) {
                    return `IM^${format(Decimal.slog(number).sub(2.0221273333), Math.max(dec, 3), expdec, 0)}`;
                }
                if (Decimal.gte(number, Number.MAX_VALUE)) {
                    if (Decimal.lt(number, "2.8e95173")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).pow10(), expdec, expdec, 0)} ᴵᴾ`;
                    } else if (Decimal.lt(number, "e542945439")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).pow_base(5), expdec, expdec, 0)} ᴱᴾ`;
                    } else if (Decimal.lt(number, "e181502546658")) {
                        return `${format(Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).mul(0.6989700043360187).div(4000).sub(1).pow_base(1000), expdec, expdec, 0)} ᴿᴹ`;
                    } else {
                        const rm = Decimal.log10(number).div(308).sub(0.75).div(308).sub(0.7).mul(0.6989700043360187).div(4000).sub(1).mul(3);
                        return `${format(rm.sub(1000).pow(2).mul(rm.sub(100000).max(1).pow(0.2)), expdec, expdec, Decimal.lt(number, "ee148.37336") ? 0 : 3)} ᴵᴹ`;
                    }
                }
                return format(number, dec, expdec, 1);
            case 4:
                return `Rank ${format(Decimal.max(number, 10).div(10).log(2).sqrt().add(1), dec, expdec, 1)}`;
            default:
                throw new Error(`${player.value.settings.notation} is not a valid notation index!`);
        }
    } catch(e) {
        console.warn(
            `There was an error trying to get player.settings.notation! Falling back to Mixed Scientific...\n\nIf you have an object that has an item that uses format() without it being a get or function, this will occurr on load!`
        );
        console.warn(e);
        if (Decimal.lt(number, "e-1e8")) {
            return `e${format(Decimal.log10(number), 0, expdec)}`;
        } else if (Decimal.lt(number, 0.001)) {
            const exp = Decimal.log10(number).mul(1.00000000001).floor();
            return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
        } else if (Decimal.lt(number, 1e8)) {
            return numberWithCommas(new Decimal(number).toNumber().toFixed(dec));
        } else if (Decimal.lt(number, abbExp)) {
            const abb = Decimal.log10(number).mul(0.33333333336666665).floor();
            return `${Decimal.div(number, abb.mul(3).pow10()).toNumber().toFixed(expdec)} ${abbSuffixes[abb.toNumber()]}`;
        } else if (Decimal.lt(number, 'ee8')) {
            const exp = Decimal.log10(number).mul(1.00000000001).floor();
            return `${Decimal.div(number, exp.pow10()).toNumber().toFixed(expdec)}e${format(exp, 0, expdec)}`;
        } else if (Decimal.lt(number, "10^^7")) {
            return `e${format(Decimal.log10(number), dec, expdec)}`;
        } else {
            return `F${format(Decimal.slog(number), Math.max(dec, 3), expdec)}`;
        }
    }
};


function formatPerc(number, dec = 3, expdec = 3) {
    if (Decimal.gte(number, 1000)) {
        return `${format(number, dec, expdec)}x`;
    } else {
        return `${format(Decimal.sub(100, Decimal.div(100, number)), dec, expdec)}%`;
    }
};


function formatTime(number, dec = 0, expdec = 3, limit = 2) {
    if (Decimal.lt(number, 0)) return `-${formatTime(Decimal.negate(number), dec, expdec)}`;
    if (Decimal.eq(number, 0)) return `${(0).toFixed(dec)}s`;
    if (Decimal.isNaN(number)) return "NaN";
    if (!Decimal.isFinite(number)) return "Infinity";
    let lim = 0;
    let str = "";
    let end = false;
    let prevNumber;
    for (let i = timeList.length - 1; i >= 0; i--) {
        if (lim >= limit) {
            break;
        }
        if (Decimal.gte(number, timeList[i].amt)) {
            end = lim + 1 >= limit || timeList[i].stop;
            prevNumber = Decimal.div(number, timeList[i].amt);
            str = `${str} ${format(prevNumber.sub(end ? 0 : 0.5), end ? dec : 0, expdec)}${timeList[i].name}`;
            number = Decimal.sub(number, prevNumber.floor().mul(timeList[i].amt));
            lim++;
            if (timeList[i].stop || prevNumber.gte(1e8)) {
                break;
            }
        } else {
            if (i === 0) {
                return `${str} ${format(number, dec, expdec)}s`.slice(1);
            }
        }
    }
    return str.slice(1);
};


function cheatDilateBoost(x, inv) {
    if (!player.cheats.dilate) {
        return x
    }
    let result = Decimal.add(x, 1)
    for (let i = 0; i < player.cheats.dilateStage; i++) {
        result = result.log10().add(1)
    }
    result = inv
        ? result.root(player.cheats.dilateValue)
        : result.pow(player.cheats.dilateValue)
    for (let i = 0; i < player.cheats.dilateStage; i++) {
        result = result.sub(1).pow10()
    }
    result = result.sub(1)
    return result
}


// DATA
const PRESTIGE_UPGRADES = [
    {
        cost: D(1),
        desc: "Point gain is boosted. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let eff = D(2)
            if (player.prestigeUpgrades.includes(13) && player.prestigeChallenge !== 5) {
                eff = eff.pow(PRESTIGE_UPGRADES[13].eff);
            }
            return eff
        }
    },
    {
        cost: D(1),
        desc: "Point gain is boosted based off of points. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return player.points.max(1).log10().div(5).add(1)
        }
    },
    {
        cost: D(1),
        desc: "Point gain is boosted based off of total prestige points. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return player.prestige.max(0).div(2).add(1)
        }
    },
    {
        cost: D(5),
        desc: "Buyables give a free level to all previous buyables instead of only the previous upgrade.",
    },
    {
        cost: D(5),
        desc: "Total amount of buyables gives an extra boost to points. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let total = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i])
            }
            return total.mul(0.01).add(1)
        }
    },
    {
        cost: D(5),
        desc: "Buy. 4's effect base increases by +×0.002 per Buy. 4 bought. Currently: +×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(0)
            }
            return Decimal.mul(player.buyables[3], 0.002)
        }
    },
    {
        cost: D(8),
        desc: "Point gain is increased based off of the amount of prestige upgrades. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return Decimal.pow(32, player.prestigeUpgrades.length / 10)
        }
    },
    {
        cost: D(8),
        desc: "Prestige upgrades and total buyables bought give a boost to points. Currently: ×",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            let total = D(0)
            for (let i = 0; i < player.buyables.length; i++) {
                total = total.add(player.buyables[i])
            }
            return total.mul(player.prestigeUpgrades.length / 400).add(1)
        }
    },
    {
        cost: D(8),
        desc: "Prestige upgrades increase Buyable 1's effect base. Currently: +",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(0)
            }
            return Decimal.mul(player.prestigeUpgrades.length, 0.5)
        }
    },
    {
        cost: D(15),
        desc: "Raise Point gain by ^",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return D(1.1)
        }
    },
    {
        cost: D(15),
        desc: "Raise Generator speed by ^",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return D(1.2)
        }
    },
    {
        cost: D(15),
        desc: "Raise Point and Generator speed by ^",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return D(1.075)
        }
    },
    {
        cost: D(25),
        desc: "Increase Generator effects from +10%/level to +25%/level.",
    },
    {
        cost: D(25),
        desc: "Prestige Upgrade (1, 1) is raised to the ^",
        get eff() {
            if (player.prestigeChallenge === 5) {
                return D(1)
            }
            return D(5)
        }
    },
    {
        cost: D(25),
        desc: "Prestige Point effect from PC4 is increased from +20%/point to +50%/point.",
    },
]


const PRESTIGE_CHALLENGES = [
    {
        get goal() {
            let goal = D(1e8)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Nerfed Upgrades",
        desc: "Buyables' effect bases are halved.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyables generate a resource that boost themselves."
    },
    {
        get goal() {
            let goal = D(251188643.1509582)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Accelerated Spending",
        desc: "Buyable' scaling intervals are decreased to every 5 levels, but don't give any boost.",
        eff: "Increase the cap of prestige upgrades by 1, and unlock Buyable 5."
    },
    {
        get goal() {
            let goal = D(1e11)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "No Influencing",
        desc: "Buyables do not give any free levels.",
        eff: "Increase the cap of prestige upgrades by 1, and bought buyables are 50% stronger."
    },
    {
        get goal() {
            let goal = D(1e16)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Stacking Interest",
        desc: "Buyables 2+ do not multiply point gain, but instead add to the effect base of the previous buyable. However, scaling intervals happen twice as often and don't give any boosts.",
        eff: "Increase the cap of prestige upgrades by 1, and prestige points give a passive boost to points."
    },
    {
        get goal() {
            let goal = D(1e10)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Intense Synergy",
        desc: "Apply Prestige Challenges 1-4.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give triple the effect instead of double."
    },
    {
        get goal() {
            let goal = D(1e12)
            if (player.inSetback) {
                goal = goal.pow(tmp.setbackEffects[2])
            }
            return goal
        },
        name: "Black Out",
        desc: "Buyable 1 and Prestige Upgrades are disabled.",
        eff: "Increase the cap of prestige upgrades by 1, and Buyable scaling intervals give quadruple the effect instead of triple."
    }
]


const ASCENSION_UPGRADES = [
    {
        get cap() {
            return D(Infinity)
        },
        req: true,
        get cost() {
            let interval = D(10)
            let costGrowth = D(2)


            let cost = D(player.ascendUpgrades[0])
            let x = cost.div(interval).floor()
            let m = cost.sub(x.mul(interval))
            cost = m.mul(costGrowth.pow(x)).add(costGrowth.pow(x).sub(1).div(costGrowth.sub(1)).mul(interval))


            cost = cost.pow_base(2).mul(10)
            return cost
        },
        get target() {
            let interval = D(10)
            let costGrowth = D(2)


            let target = Decimal.div(player.ascendGems, 10).max(1).log2()
            let h = target.mul(costGrowth.sub(1)).div(interval).add(1).log(costGrowth).floor()
            target = target.add(interval.div(costGrowth.sub(1))).div(costGrowth.pow(h)).add(h.sub(costGrowth.sub(1).recip()).mul(interval))


            return target
        },
        get eff() {
            return Decimal.pow(1.122, player.ascendUpgrades[0])
        },
        get desc() {
            return `Multiply point gain by 12.2%. Currently: ×${format(this.eff, 2)}`
        } 
    },
    {
        get cap() {
            return D(Infinity)
        },
        req: true,
        get cost() {
            let interval = D(10)
            let costGrowth = D(2)


            let cost = D(player.ascendUpgrades[1])
            let x = cost.div(interval).floor()
            let m = cost.sub(x.mul(interval))
            cost = m.mul(costGrowth.pow(x)).add(costGrowth.pow(x).sub(1).div(costGrowth.sub(1)).mul(interval))


            cost = cost.pow_base(3).mul(50)
            return cost
        },
        get target() {
            let interval = D(10)
            let costGrowth = D(2)


            let target = Decimal.div(player.ascendGems, 50).max(1).log(3)
            let h = target.mul(costGrowth.sub(1)).div(interval).add(1).log(costGrowth).floor()
            target = target.add(interval.div(costGrowth.sub(1))).div(costGrowth.pow(h)).add(h.sub(costGrowth.sub(1).recip()).mul(interval))


            return target
        },
        get eff() {
            return Decimal.pow(1.25, player.ascendUpgrades[1])
        },
        get desc() {
            return `Multiply generator gain by 25%. Currently: ×${format(this.eff, 2)}`
        } 
    },
    {
        get cap() {
            return D(5)
        },
        req: true,
        get cost() {
            let cost = D(player.ascendUpgrades[2]).pow_base(40).mul(250)
            return cost
        },
        get target() {
            let target = Decimal.div(player.ascendGems, 250).max(1).log(40)
            return target
        },
        get eff() {
            return D(1.1)
        },
        get desc() {
            return Decimal.eq(player.ascendUpgrades[2], 0)
                ? `Buyable 1's effect is raised to the ^${format(this.eff, 2)} Currently: None`
                : Decimal.eq(player.ascendUpgrades[2], 1)
                    ? `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Buyable 1`
                    : `Buyable ${format(Decimal.add(player.ascendUpgrades[2], 1))}'s effect is raised to the ^${format(this.eff, 2)} Currently: Upgrades 1-${format(player.ascendUpgrades[2])}`
        } 
    },
    {
        get cap() {
            return D(Infinity)
        },
        req: true,
        get cost() {
            let interval = D(10)
            let costGrowth = D(2)


            let cost = D(player.ascendUpgrades[3])
            let x = cost.div(interval).floor()
            let m = cost.sub(x.mul(interval))
            cost = m.mul(costGrowth.pow(x)).add(costGrowth.pow(x).sub(1).div(costGrowth.sub(1)).mul(interval))


            cost = cost.pow10().mul(10)
            return cost
        },
        get target() {
            let interval = D(10)
            let costGrowth = D(2)


            let target = Decimal.div(player.ascendGems, 10).max(1).log10()
            let h = target.mul(costGrowth.sub(1)).div(interval).add(1).log(costGrowth).floor()
            target = target.add(interval.div(costGrowth.sub(1))).div(costGrowth.pow(h)).add(h.sub(costGrowth.sub(1).recip()).mul(interval))


            return target
        },
        get eff() {
            return Decimal.pow(Decimal.max(player.ascend, 1).log10().add(2), player.ascendUpgrades[3])
        },
        get desc() {
            return `Ascension Gem gain is increased based off of your Ascension Points. Currently: ×${format(this.eff, 2)}`
        } 
    },
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                get cap() {
                    return D(8)
                },
                req: true,
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 4])
                    cost = cost.pow(2).mul(2).pow_base(i + 2).mul(100 * (2 ** i))
                    return cost
                },
                get target() {
                    let target = D(player.ascendGems)
                    target = target.div(100 * (2 ** i)).max(100 * (2 ** i)).log(i + 2).div(2).root(2)
                    return target
                },
                get eff() {
                    return Decimal.eq(player.ascendUpgrades[i + 4], 0) ? D(0) : Decimal.add(player.ascendUpgrades[i + 4], 1).pow_base(2)
                },
                get desc() {
                    return `Automate Buyable ${i+1}. This autobuyer can buy up to ${format(this.eff)}/s.`
                } 
            })
        }
        return arr
    })(),
    ...(() => {
        let arr = []
        for (let i = 0; i < 4; i++) {
            arr.push({
                get cap() {
                    return D(5)
                },
                get req() {
                    return Decimal.lte(player.buyables[i], 0) && Decimal.gte(player.points, Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))
                },
                get reqDesc() {
                    return `You must not buy Buyable ${i+1} and you must reach ${format(Decimal.pow(player.ascendUpgrades[i + 8], 2).pow_base(1e3 * (10 ** i)).mul(1e20 * (1e3 ** i)))} points.`
                },
                get cost() {
                    let cost = D(player.ascendUpgrades[i + 8])
                    cost = cost.add(1).pow_base(1000 * (2 ** i))
                    return cost
                },
                get target() {
                    if (Decimal.gt(player.buyables[i], 0)) {
                        return D(0)
                    }
                    let target1 = D(player.ascendGems)
                    target1 = target1.max(1000 * (2 ** i)).log(1000 * (2 ** i)).sub(1)
                    let target2 = D(player.points)
                    target2 = target2.div(1e20 * (1e3 ** i)).max(1).log(1e3 * (10 ** i)).root(2)
                    return Decimal.min(target1, target2)
                },
                get eff() {
                    return Decimal.mul(0.1, player.ascendUpgrades[i + 8])
                },
                get desc() {
                    return `Buyable ${i+1}'s cost scaling is 10% slower. Currently: -${format(this.eff.mul(100), 2)}%`
                } 
            })
        }
        return arr
    })(),
    {
        get cap() {
            return D(2)
        },
        get req() {
            return player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension
        },
        reqDesc: `You must not buy any Prestige Upgrades in the current Ascension while completing 5 Prestige Challenges.`,
        get cost() {
            let cost = D(player.ascendUpgrades[12])
            cost = cost.add(1).pow_base(1e6)
            return cost
        },
        get target() {
            if (!(player.prestigeChallengeCompleted.length >= 5 && !player.prestigeUpgradesInCurrentAscension)) {
                return D(0)
            }
            let target = Decimal.max(player.ascendGems, 1e6).log(1e6).sub(1)
            return target
        },
        get eff() {
            return player.ascendUpgrades[12]
        },
        get desc() {
            return `Unlock 1 more row of Prestige Upgrades. Currently: +${format(this.eff)} rows`
        } 
    },
    {
        get cap() {
            return D(1)
        },
        get req() {
            return player.prestigeChallengeCompleted.length === 0 && Decimal.gte(player.prestige, Decimal.add(player.ascendUpgrades[13], 1).pow10())
        },
        get reqDesc() {
            return `You must not complete any Prestige Challenges while having ${format(Decimal.add(player.ascendUpgrades[13], 1).pow10())} total prestige points.`
        },
        get cost() {
            let cost = D(player.ascendUpgrades[13])
            cost = cost.add(1).pow(1.25).pow_base(1e6).div(100)
            return cost
        },
        get target() {
            if (player.prestigeChallengeCompleted.length !== 0) {
                return D(0)
            }
            let target1 = Decimal.max(player.ascendGems, 1e4).mul(100).log(1e6).root(1.25).sub(1)
            let target2 = Decimal.max(player.prestige, 10).log10().sub(1)
            return Decimal.min(target1, target2)
        },
        get eff() {
            return player.ascendUpgrades[13]
        },
        get desc() {
            return `Unlock 1 more Prestige Challenge. Currently: +${format(this.eff)} challenges`
        } 
    },
]


const SETBACK_UPGRADES = [
    [
        ...(() => {
            let arr = []
            for (let i = 0; i < 5; i++) {
                arr.push(        {
                    id: `r${i+1}`,
                    cost: D(1e4 * 100 ** i),
                    get desc() {
                        return `Points are multiplied by +0.01% for each Buyable ${i+1}. Currently: ×${format(this.eff, 2)} (Caps at ×${format(1e3)})`
                    },
                    get eff() {
                        return tmp.buyables[i].effective.pow_base(1.0001).min(1e3)
                    }
                },)
            }
            return arr
        })(),
        {
            id: "r6",
            cost: D(1e15),
            get desc() {
                return `Ascension Points boost all Red Dimensions' mult. Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascend, 1).root(8)
            }
        },
        {
            id: "r7",
            cost: D(1e18),
            get desc() {
                return `Ascension Gems give a sparse but powerful boost to points. Next at ${format(Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().add(3).pow_base(2).pow10())} AGs, Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1e4).log10().log2().sub(2).floor().pow10()
            }
        },
        {
            id: "r8",
            cost: D(1e21),
            get desc() {
                return `Point gain slowly increases over time, capping at ×100.00. Currently: ×${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.timeInPrestige, 0).mul(0.1).add(1).min(100)
            }
        },
        {
            id: "r9",
            cost: D(1e25),
            get desc() {
                return `Ascension's requirement is decreased by /${format(100)}. (This boosts Ascension Point gain!)`
            },
            get eff() {
                return D(100)
            }
        },
        {
            id: "r10",
            cost: D(1e30),
            get desc() {
                return `Unlock the generator booster. (Subtab in Main)`
            },
        },
    ],
    [
        ...(() => {
            let arr = []
            for (let i = 0; i < 5; i++) {
                arr.push(        {
                    id: `g${i+1}`,
                    cost: D(1e4 * 100 ** i),
                    get desc() {
                        return `Total buyables excluding Buyable ${i+1} multiply point gain. Currently: ×${format(this.eff, 2)} (Caps at ×${format(1e3)})`
                    },
                    get eff() {
                        let total = D(0)
                        for (let j = 0; j < player.buyables.length; j++) {
                            if (i === j) {
                                continue;
                            }
                            total = total.add(player.buyables[j])
                        }
                        return total.pow_base(1.00025).min(1e3)
                    }
                },)
            }
            return arr
        })(),
        {
            id: "g6",
            cost: D(1e15),
            get desc() {
                return `Buyable Generators also boost Green Dims.' respective mult.`
            },
        },
        {
            id: "g7",
            cost: D(1e18),
            get desc() {
                return `Every 1,000 total upgrades bought, buyable boost per interval increases by +0.10×. Currently: +${format(this.eff, 2)}×`
            },
            get eff() {
                let total = D(0)
                for (let j = 0; j < player.buyables.length; j++) {
                    total = total.add(player.buyables[j])
                }
                return total.div(1000).floor().mul(0.1)
            }
        },
        {
            id: "g8",
            cost: D(1e21),
            get desc() {
                return `Every level of each generator divides the cost of that buyable by /10.`
            },
            get eff() {
                return D(10)
            }
        },
        {
            id: "g9",
            cost: D(1e25),
            get desc() {
                return `All buyables' base costs are set to 1 and their cost scaling is -25% slower.`
            },
            get eff() {
                return D(0.75)
            }
        },
        {
            id: "g10",
            cost: D(1e30),
            get desc() {
                return `Unlock the autobuyer for Buyable 5 and and unlock Buyable 6.`
            },
        },
    ],
    [
        {
            id: "b1",
            cost: D(1e4),
            get desc() {
                return `Unlock Prestige Essence, You can now freely do a prestige reset even if you won't gain any prestige points.`
            }
            // gain: points.log(1e6).log2().pow_base(1000) (1e6 = 1, 1e12 = 1e3, 1e24 = 1e6, 1e48 = 1e9, 1e96 = 1e12)
            // effect: multiplies points by x
        },
        {
            id: "b2",
            cost: D(1e9),
            get desc() {
                return `Prestige Upgrades are rebuyable but their costs scale very fast.`
                // (BaseCost * 10^(2^x))
            }
        },
        {
            id: "b3",
            cost: D(1e15),
            get desc() {
                return `Black Out is repeatable up to 4 times.`
            }
            // goal: custom
            // (you do this by making like 4 other challenges but completing one hides the other and shows the next or smth lmao)
            // effect: Buyable 1 (1-2) (1-3) (1-4) and Prestige Upgrades are disabled
            // Scaling effects quad from tri (quin from quad) (sextuple from quintuple) (septuple from sextuple)
            // all add 1 more prestige upgrade
        },
        {
            id: "b4",
            cost: D(1e22),
            get desc() {
                return `Prestige Upgrade 3 and Stacking Interest gain one free level, and Ascension Gems boost their effects. Currently: ^${format(this.eff, 2)}`
            },
            get eff() {
                return Decimal.max(player.ascendGems, 1).log10().div(100).add(1).ln().add(1)
            }
        },
        {
            id: "b4",
            cost: D(1e30),
            get desc() {
                return `Prestige Upgrade 3 and Stacking Interest gain one free level, and Ascension Gems boost their effects. Currently: ^${format(this.eff, 2)}`
            }
        },
    ]
]


// upgrade/study ideas
// .
// 100 levels
// UP1: +1x,    ^1.5   = 100 -> 1,000
// UP2: +0.5x,  ^1.75  = 50  -> 1,000
// UP3: +0.25x, ^2.125 = 25  -> 1,000
// UP4: +0.1x,  ^2.9   = 10  -> 1,000
// UP5: +0.05x, ^3.9   = 5   -> 1,000
// UP6: +0.01x, ^10    = 2   -> 1,000 (base cost: 1.000 B, but due to g9, is 1)


// START GAME LOGIC
function initPlayer() {
    const obj = {
        cheats: {
            autobuyUnlock: false,
            autobuyBulk: false,
            autoPrestige: false,
            autoAscend: false,
            autoAscendUpgrades: false,
            autoDim: false,
            dilate: false,
            dilateStage: 0,
            dilateValue: D(1)
        },
        lastTick: new Date().valueOf(),
        lastTick2: new Date().valueOf(),
        tab: 0,
        points: D(0),
        bestPointsInPrestige: D(0),
        bestPointsInAscend: D(0),
        buyables: [D(0), D(0), D(0), D(0), D(0)],
        upgradeAuto: [false, false, false, false, false],
        upgradePoints: [D(0), D(0), D(0), D(0), D(0)],
        buyableIntermediate: [D(0), D(0), D(0), D(0), D(0)],
        prestige: D(0),
        timeInPrestige: D(0),
        prestigeUpgrades: [],
        prestigeChallenge: null,
        prestigeChallengeCompleted: [],
        prestigeUpgradesInCurrentAscension: false,
        ascend: D(0),
        timeInAscend: D(0),
        ascendGems: D(0),
        ascendUpgrades: [],
        setbackTab: 0,
        setbackDimTab: 0,
        setback: [D(0), D(0), D(0)],
        currentSetback: null,
        setbackLoadout: [],
        inSetback: false,
        setbackQuarks: [D(0), D(0), D(0)],
        setbackEnergy: [D(0), D(0), D(0)],
        quarkDimsBought: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsIntermediate: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        quarkDimsAuto: [
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false]
        ],
        quarkDimsAccumulated: [
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)],
            [D(0), D(0), D(0), D(0), D(0), D(0), D(0), D(0)]
        ],
        setbackUpgradeSelected: null,
        setbackUpgrades: []
    }


    return obj
}


const tmp = initTmp()
function initTmp() {
    const obj = {
        fps: [],
        lastFPSTick: 0,
        offlineTime: {
            active: false,
            tickRemaining: 0,
            tickMax: 0,
            tickLength: 0.05,
            returnTime: 0,
        },
        pointGen: D(1),
        buyables: [],
        bybBoostInterval: D(100),
        bybBoostEffect: D(2),
        bybBoostCost: D(2),
        prestigeAmount: D(0),
        prestigeNext: D(0),
        prestigeUsed: D(0),
        prestigeUpgradeCap: 0,
        prestigePointEffect: D(1),
        ascendAmount: D(0),
        ascendNext: D(0),
        ascendPointEffect: D(0),
        setbackEffects: [D(1), D(1), D(1)],
        predictedQuarkGain: [D(0), D(0), D(0)],
        predictedQuarkTotal: D(0),
        trueQuarkGain: [D(0), D(0), D(0)],
        trueQuarkTotal: D(0),
        quarkDim: [[], [], []],
        quarkMultPer: D(2),
        quarkBoostInterval: D(100),
        quarkBoostEffect: D(1),
        quarkBoostCost: D(2),
        quarkEffs: [D(1), D(1), D(1)],
        energyEffs: [D(1), D(1), D(1)],
        quarkColorLookup: [
            {
                border: {
                    canBuy: 'FF0000',
                    cannotBuy: '800000'
                },
                fill: {
                    canBuy: '800000',
                    cannotBuy: '400000'
                }
            },
            {
                border: {
                    canBuy: '00FF00',
                    cannotBuy: '008000'
                },
                fill: {
                    canBuy: '008000',
                    cannotBuy: '004000'
                }
            },
            {
                border: {
                    canBuy: '0000FF',
                    cannotBuy: '000080'
                },
                fill: {
                    canBuy: '000080',
                    cannotBuy: '000040'
                }
            },
            
        ]
    }


    return obj
}


let player = initPlayer()


const html = []
initHTML()
function initHTML() {
    document.body.style.backgroundColor = "#000000"
    document.body.style.margin = "0px"
    document.body.style.padding = "0px"
    document.body.innerHTML = `
        <canvas id="draw" style="height: 100vh; width: 100vw; position: absolute; top: 0px; left: 0px; z-index: -2;"></canvas>
        <div style="height: 100vh; width: 100vw; margin: 0px; padding: 0px;">
            <div id="offlineTime">
                <div style="display: flex; flex-direction: column; align-items: center">
                    <span style="color: #ffffff; font-family: Verdana; font-size: 12px">You are in offline time.</span>
                    <span style="color: #ffffff; font-family: Verdana; font-size: 12px" id="offlineTimeDisplay"></span>
                    <div id="offlineTimeProgress" style="height: 20px; width: 800px; position: relative; margin: 2px">
                        <div id="offlineTimeProgressBarBase" style="background-color: #ff0000; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                        <div id="offlineTimeProgressBar" style="background-color: #00ff00;position: absolute; top: 0; left: 0; height: 100%"></div>
                    </div>
                </div>
            </div>
            <div id="inGame">
                <div style="display: flex; flex-direction: column; align-items: center">
                    <span style="font-family: Verdana; font-size: 24px; color: #ffffff" id="points"></span><span style="font-family: Verdana; font-size: 12px; color: #ffffff">points</span><span style="font-family: Verdana; font-size: 12px; color: #ffffff" id="pointsPerSecond"></span><br>
                    <div style="display: flex; justify-content: center" id="tabList">
                        <button onclick="player.tab = 0" id="mainTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                            Main
                        </button>
                        <button onclick="player.tab = 1" id="prestigeTabButton" style="color: #ffffff; background-color: #00408080; border: 3px solid #0080ff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                            Prestige
                        </button>
                        <button onclick="player.tab = 2" id="prestigeChallengeTabButton" style="color: #ffffff; background-color: #00408080; border: 3px solid #0080ff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                            P. Challenges
                        </button>
                        <button onclick="player.tab = 3" id="ascendTabButton" style="color: #ffffff; background-color: #00800080; border: 3px solid #00ff00; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                            Ascension
                        </button>
                        <button onclick="player.tab = 4" id="setbackTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                            Setback
                        </button>
                    </div>
                </div>
                <div id="mainTab">
                    <div style="display: flex; flex-direction: column; align-items: center">
                        <span style="color: #ffffff; font-family: Verdana; font-size: 12px" id="upgradeInSetback"></span>
                        <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Every <b><span id="upgradeScalingInterval"></span></b> purchases of a buyable, the buyable's effect<span id="upgradeScalingPC1"></span> is boosted by <b><span id="upgradeScalingBoost"></span>×</b> but the buyable scales <b><span id="upgradeScalingSpeed"></span>×</b> faster.</span>
                        <span style="color: #ffffff; font-family: Verdana; font-size: 12px" id="upgradePC1Desc">Every generator level increases the buyable's effect by <b>+0.10×</b>.</span>
                        <div style="display: flex; flex-direction: row; justify-content: center" id="upgradeList"></div><br>
                        <button onclick="doPrestigeReset()" id="prestige" style="color: #ffffff; background-color: #00408080; border: 3px solid #0080ff; font-family: Verdana; height: 70px; width: 325px; font-size: 12px; margin: 2px">
                            Prestige for <b><span id="prestigeAmount"></span></b> prestige points.<br>
                            Next prestige point at <span id="prestigeNext"></span> points.
                        </button>
                        <button onclick="toggleCurrentPrestigeChallenge()" id="prestigeChallengeButton" style="color: #ffffff; background-color: #00408080; border: 3px solid #0080ff; font-family: Verdana; height: 70px; width: 325px; font-size: 12px; margin: 2px">
                            You are in <b><span id="prestigeChallengeName"></span></b>.<br>
                            You need <span id="prestigeChallengeRequirement"></span> points.
                        </button>
                        <button onclick="doAscendReset()" id="ascend" style="color: #ffffff; background-color: #00800080; border: 3px solid #00ff00; font-family: Verdana; height: 70px; width: 325px; font-size: 12px; margin: 2px">
                            Ascend for <b><span id="ascendAmount"></span></b> ascension points.<br>
                            Next ascension point at <span id="ascendNext"></span> points.
                        </button>
                    </div>
                </div>
                <div id="prestigeTab">
                    <div style="display: flex; flex-direction: column; align-items: center">
                        <span style="font-family: Verdana; font-size: 24px; color: #0080ff" id="prestigePoints"></span><span style="font-family: Verdana; font-size: 12px; color: #0080ff">prestige points</span>
                        <span style="font-family: Verdana; font-size: 12px; color: #0080ff" id="prestigePointEffect"></span>
                        <div style="display: flex; flex-direction: row; align-items: center">
                            <button onclick="respecPrestigeUpgrades()" id="prestigeRespec" style="color: #ffffff; font-family: Verdana; height: 70px; width: 175px; font-size: 10px; margin: 2px; background-color: #00408080; border: 3px solid #0080ff">
                                Respec all prestige buyables and do a prestige reset.
                            </button>
                            <button onclick="doPrestigeReset(true)" style="color: #ffffff; font-family: Verdana; height: 70px; width: 175px; font-size: 10px; margin: 2px; background-color: #00408080; border: 3px solid #0080ff">
                                Do a prestige reset.
                            </button>
                        </div>
                        <span style="font-family: Verdana; font-size: 16px; color: #0080ff">You can only have <b><span id="prestigeUpgradeCap"></span></b> prestige buyables bought!</span>
                        <div style="display: flex; flex-direction: row; justify-content: center; width: 560px; flex-wrap: wrap" id="prestigeUpgradeList"></div><br>
                    </div>
                </div>
                <div id="prestigeChallengeTab">
                    <div style="display: flex; flex-direction: column; align-items: center">
                        <div style="display: flex; flex-direction: row; justify-content: center; width: 720px; flex-wrap: wrap" id="prestigeChallengeList"></div><br>
                    </div>
                </div>
                <div id="ascendTab">
                    <div style="display: flex; flex-direction: column; align-items: center">
                        <div style="display: flex; flex-direction: row; justify-content: center">
                            <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                <span style="font-family: Verdana; font-size: 24px; color: #00ff00" id="ascendPoints"></span><span style="font-family: Verdana; font-size: 12px; color: #00ff00">ascension points</span>
                            </div>
                            <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                <span style="font-family: Verdana; font-size: 24px; color: #00ff00" id="ascendGems"></span><span style="font-family: Verdana; font-size: 12px; color: #00ff00">ascension gems</span>
                            </div>
                        </div>
                        <span style="font-family: Verdana; font-size: 12px; color: #00ff00" id="ascendPointEffect"></span>
                        <div style="display: flex; flex-direction: row; justify-content: center; width: 1050px; flex-wrap: wrap" id="ascendUpgradeList"></div><br>
                    </div>
                </div>
                <div id="setbackTab">
                    <div style="display: flex; flex-direction: column; align-items: center">
                        <div style="display: flex; flex-direction: row; justify-content: center">
                            <button onclick="player.setbackTab = 0" id="setSBTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                Settings
                            </button>
                            <button onclick="player.setbackTab = 1" id="loadSBTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                Loadouts
                            </button>
                            <button onclick="player.setbackTab = 2" id="dimSBTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                Dimensions
                            </button>
                            <button onclick="player.setbackTab = 4" id="upgSBTabButton" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                Upgrades
                            </button>
                        </div>
                        <div id="setbackTabSettings">
                            <div style="display: flex; flex-direction: column; align-items: center">
                                <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Set your setbacks here. The higher these values are and the higher the total of these settings, the more quarks you will produce.</span>
                                <br>
                                <span style="color: #ff4040; font-family: Verdana; font-size: 12px">Your red setback is at difficulty <b><span id="setbackRedValue"></span></b>, which raises point gain to the <b>^<span id="setbackRedEffect"></span></b>, but will produce <b><span id="setbackRedGenerate"></span></b> red quarks per second.</span>
                                <span style="color: #40ff40; font-family: Verdana; font-size: 12px">Your green setback is at difficulty <b><span id="setbackGreenValue"></span></b>, which makes buyables scale <b><span id="setbackGreenEffect"></span>×</b> faster, but will produce <b><span id="setbackGreenGenerate"></span></b> green quarks per second.</span>
                                <span style="color: #4040ff; font-family: Verdana; font-size: 12px">Your blue setback is at difficulty <b><span id="setbackBlueValue"></span></b>, which increases the prestige challenge and ascension reqs. by <b>^<span id="setbackBlueEffect"></span></b>, but will produce <b><span id="setbackBlueGenerate"></span></b> blue quarks per second.</span>
                                <br>
                                <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Upon a successful ascension with these setbacks, you will be able to generate quarks in the Loadout.</span>
                                <br>
                                <input type="range" min="0" max="10" value="0" style="width: 400px" id="setbackSliderRed">
                                <input type="range" min="0" max="10" value="0" style="width: 400px" id="setbackSliderGreen">
                                <input type="range" min="0" max="10" value="0" style="width: 400px" id="setbackSliderBlue">
                                <br>
                                <button onclick="toggleSetback()" id="setbackToggle" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 70px; width: 325px; font-size: 12px; margin: 2px">
                                    Toggle setback. This will do an ascension reset.<br>
                                    Use the normal ascend button to complete the setback, but click this to exit the setback early.
                                </button>
                            </div>
                        </div>
                        <div id="setbackTabLoadout">
                            <div style="display: flex; flex-direction: column; align-items: center">
                                <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Upon completing an ascension with a setback, you will be able to access their quark generation here.</span>
                                <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Changing loadouts requires an ascension reset!</span>
                                <br>
                                <div style="display: flex; flex-direction: column; align-items: center" id="setbackLoadoutList"></div>
                            </div>
                        </div>
                        <div id="setbackTabDims">
                            <div style="display: flex; flex-direction: column; align-items: center">
                                <div style="display: flex; flex-direction: row; justify-content: center">
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #ff4040" id="redQuarks"></span><span style="font-family: Verdana; font-size: 12px; color: #ff4040">red quarks</span>
                                    </div>
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #ff4040" id="redEnergy"></span><span style="font-family: Verdana; font-size: 12px; color: #ff4040">red energy</span>
                                    </div>
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #40ff40" id="greenQuarks"></span><span style="font-family: Verdana; font-size: 12px; color: #40ff40">green quarks</span>
                                    </div>
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #40ff40" id="greenEnergy"></span><span style="font-family: Verdana; font-size: 12px; color: #40ff40">green energy</span>
                                    </div>
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #4040ff" id="blueQuarks"></span><span style="font-family: Verdana; font-size: 12px; color: #4040ff">blue quarks</span>
                                    </div>
                                    <div style="margin: 4px; display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 24px; color: #4040ff" id="blueEnergy"></span><span style="font-family: Verdana; font-size: 12px; color: #4040ff">blue energy</span>
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: row; justify-content: center">
                                    <button onclick="player.setbackDimTab = 0" id="SBDimRedTabButton" style="color: #ff4040; background-color: #80202080; border: 3px solid #ff4040; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                        Red
                                    </button>
                                    <button onclick="player.setbackDimTab = 1" id="SBDimGreenTabButton" style="color: #40ff40; background-color: #20802080; border: 3px solid #40ff40; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                        Green
                                    </button>
                                    <button onclick="player.setbackDimTab = 2" id="SBDimBlueTabButton" style="color: #4040ff; background-color: #20208080; border: 3px solid #4040ff; font-family: Verdana; height: 35px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                                        Blue
                                    </button>
                                </div>
                                <span style="color: #ffffff; font-family: Verdana; font-size: 12px">Every <b><span id="dimScalingInterval"></span></b> purchases of a dimension, the dimension's multiplier per purchase is boosted by <b>+<span id="dimScalingBoost"></span>×</b> but the dimension scales <b><span id="dimScalingSpeed"></span>×</b> faster.</span>
                                <div id="setbackDimRed">
                                    <div style="display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 12px; color: #ff4040">You have <b><span id="redQuarkAmt"></span></b> Red Quarks, which boosts Red Energy gain by ×<b><span id="redQuarkEff"></span></b>.</span>
                                        <span style="font-family: Verdana; font-size: 12px; color: #ff4040">You have <b><span id="redEnergyAmt"></span></b> Red Energy, which boosts point gain by ×<b><span id="redEnergyEff"></span></b>.</span>
                                        <div id="setbackRedDimList" style="display: flex; flex-direction: column; align-items: center"></div>
                                    </div>
                                </div>
                                <div id="setbackDimGreen">
                                    <div style="display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 12px; color: #40ff40">You have <b><span id="greenQuarkAmt"></span></b> Green Quarks, which boosts Green Energy gain by ×<b><span id="greenQuarkEff"></span></b>.</span>
                                        <span style="font-family: Verdana; font-size: 12px; color: #40ff40">You have <b><span id="greenEnergyAmt"></span></b> Green Energy, which raises buyable cost to ^<b><span id="greenEnergyEff"></span></b>.</span>
                                        <div id="setbackGreenDimList" style="display: flex; flex-direction: column; align-items: center"></div>
                                    </div>
                                </div>
                                <div id="setbackDimBlue">
                                    <div style="display: flex; flex-direction: column; align-items: center">
                                        <span style="font-family: Verdana; font-size: 12px; color: #4040ff">You have <b><span id="blueQuarkAmt"></span></b> Blue Quarks, which boosts Blue Energy gain by ×<b><span id="blueQuarkEff"></span></b>.</span>
                                        <span style="font-family: Verdana; font-size: 12px; color: #4040ff">You have <b><span id="blueEnergyAmt"></span></b> Blue Energy, which increases prestige point gain by ×<b><span id="blueEnergyEff"></span></b>.</span>
                                        <div id="setbackBlueDimList" style="display: flex; flex-direction: column; align-items: center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="setbackTabUpgs">
                            <div style="display: flex; flex-direction: column; align-items: center">


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    toHTMLvar('offlineTime')
    toHTMLvar('inGame')
    toHTMLvar('offlineTimeProgress')
    toHTMLvar('offlineTimeProgressBar')
    toHTMLvar('offlineTimeProgressBarBase')
    toHTMLvar('offlineTimeDisplay')


    html['inGame'].setDisplay(false)
    html['offlineTime'].setDisplay(false)


    toHTMLvar('mainTab')
    toHTMLvar('prestigeTab')
    toHTMLvar('prestigeChallengeTab')
    toHTMLvar('ascendTab')
    toHTMLvar('setbackTab')


    toHTMLvar('mainTabButton')
    toHTMLvar('prestigeTabButton')
    toHTMLvar('prestigeChallengeTabButton')
    toHTMLvar('ascendTabButton')
    toHTMLvar('setbackTabButton')


    html['mainTab'].setDisplay(false)
    html['prestigeTab'].setDisplay(false)
    html['prestigeChallengeTab'].setDisplay(false)
    html['ascendTab'].setDisplay(false)
    html['setbackTab'].setDisplay(false)


    html['mainTabButton'].setDisplay(false)
    html['prestigeTabButton'].setDisplay(false)
    html['prestigeChallengeTabButton'].setDisplay(false)
    html['ascendTabButton'].setDisplay(false)
    html['setbackTabButton'].setDisplay(false)


    toHTMLvar('points')
    toHTMLvar('pointsPerSecond')


    toHTMLvar('upgradeScalingInterval')
    toHTMLvar('upgradeScalingBoost')
    toHTMLvar('upgradeScalingSpeed')
    toHTMLvar('upgradeScalingPC1')
    toHTMLvar('upgradePC1Desc')
    toHTMLvar('upgradeInSetback')
    toHTMLvar('upgradeList')


    let txt = ``
    for (let i = 0; i < player.buyables.length; i++) {
        txt += `
            <div id="upgrade${i}all" style="width: 175px; margin: 2px">
                <button onclick="toggleUpgradeAutobuy(${i})" id="upgrade${i}auto" style="color: #ffffff; font-family: Verdana; height: 20px; width: 175px; font-size: 10px; margin: 2px">
                    Autobuyer: <span id="upgrade${i}autoStatus"></span>
                </button>
                <button onclick="buyUpgrade(${i})" id="upgrade${i}" style="color: #ffffff; font-family: Verdana; height: 70px; width: 175px; font-size: 10px; margin: 2px">
                    Buyable ${i+1} ×<span id="upgrade${i}amount"></span><br>
                    <br>
                    Effect: <span id="upgrade${i}eff"></span><br>
                    Cost: <span id="upgrade${i}cost"></span> points
                </button>
                <div id="upgrade${i}generators" style="height: 10px; width: 175px; position: relative; margin: 2px">
                    <div id="upgrade${i}generatorProgressBarBase" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
                    <div id="upgrade${i}generatorProgressBar" style="position: absolute; top: 0; left: 0; height: 100%"></div>
                </div>
                <span id="upgrade${i}generatorProgressNumber" style="color: #ffffff; font-family: Verdana; font-size: 10px; text-align: center"></span>
            </div>
        `
    }
    html['upgradeList'].setHTML(txt)
    for (let i = 0; i < player.buyables.length; i++) {
        toHTMLvar(`upgrade${i}all`)
        toHTMLvar(`upgrade${i}`)
        toHTMLvar(`upgrade${i}auto`)
        toHTMLvar(`upgrade${i}autoStatus`)
        toHTMLvar(`upgrade${i}amount`)
        toHTMLvar(`upgrade${i}eff`)
        toHTMLvar(`upgrade${i}cost`)
        toHTMLvar(`upgrade${i}generators`)
        toHTMLvar(`upgrade${i}generatorProgressBarBase`)
        toHTMLvar(`upgrade${i}generatorProgressBar`)
        toHTMLvar(`upgrade${i}generatorProgressNumber`)
    }


    toHTMLvar('prestige')
    toHTMLvar('prestigeAmount')
    toHTMLvar('prestigeNext')
    toHTMLvar('prestigePoints')
    toHTMLvar('prestigeUpgradeList')
    toHTMLvar('prestigeUpgradeCap')
    toHTMLvar('prestigeChallengeList')
    toHTMLvar('prestigeChallengeButton')
    toHTMLvar('prestigeChallengeName')
    toHTMLvar('prestigeChallengeRequirement')
    toHTMLvar('prestigePointEffect')


    txt = ``
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyPrestigeUpgrade(${i})" id="prestigeUpgrade${i}" style="color: #ffffff; font-family: Verdana; height: 70px; width: 175px; font-size: 10px; margin: 2px">
                <span id="prestigeUpgrade${i}eff"></span><br><br>
                <span id="prestigeUpgrade${i}cost"></span>
            </button>
        `
    }
    html['prestigeUpgradeList'].setHTML(txt)
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        toHTMLvar(`prestigeUpgrade${i}`)
        toHTMLvar(`prestigeUpgrade${i}eff`)
        toHTMLvar(`prestigeUpgrade${i}cost`)
    }


    txt = ``
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        txt += `
        <button onclick="togglePrestigeChallenge(${i})" id="prestigeChallenge${i}" style="color: #ffffff; font-family: Verdana; height: 160px; width: 320px; font-size: 12px; margin: 2px">
            <b><span id="prestigeChallenge${i}name"></span></b><br><br>
            <span id="prestigeChallenge${i}desc"></span><br>
            Goal: <span id="prestigeChallenge${i}goal"></span> points<br>
            Reward: <span id="prestigeChallenge${i}reward"></span>
        </button>
        `
    }


    html['prestigeChallengeList'].setHTML(txt)
    for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
        toHTMLvar(`prestigeChallenge${i}`)
        toHTMLvar(`prestigeChallenge${i}name`)
        toHTMLvar(`prestigeChallenge${i}desc`)
        toHTMLvar(`prestigeChallenge${i}goal`)
        toHTMLvar(`prestigeChallenge${i}reward`)
    }


    toHTMLvar('ascend')
    toHTMLvar('ascendAmount')
    toHTMLvar('ascendNext')
    toHTMLvar('ascendPoints')
    toHTMLvar('ascendPointEffect')
    toHTMLvar('ascendUpgradeList')
    toHTMLvar('ascendGems')


    txt = ``
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        txt += `
            <button onclick="buyAscendUpgrade(${i})" id="ascendUpgrade${i}" style="color: #ffffff; font-family: Verdana; height: 125px; width: 250px; font-size: 10px; margin: 2px">
                <span id="ascendUpgrade${i}amount"></span><br>
                <span id="ascendUpgrade${i}eff"></span><br><br>
                <span id="ascendUpgrade${i}req"></span><br>
                <span id="ascendUpgrade${i}cost"></span>
            </button>
        `
    }
    html['ascendUpgradeList'].setHTML(txt)
    for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
        toHTMLvar(`ascendUpgrade${i}`)
        toHTMLvar(`ascendUpgrade${i}eff`)
        toHTMLvar(`ascendUpgrade${i}cost`)
        toHTMLvar(`ascendUpgrade${i}req`)
        toHTMLvar(`ascendUpgrade${i}amount`)
    }


    toHTMLvar('setbackToggle')
    toHTMLvar('setSBTabButton')
    toHTMLvar('loadSBTabButton')
    toHTMLvar('dimSBTabButton')
    toHTMLvar('upgSBTabButton')
    toHTMLvar('setbackTabSettings')
    toHTMLvar('setbackTabLoadout')
    toHTMLvar('setbackTabDims')
    toHTMLvar('setbackLoadoutList')
    toHTMLvar('dimScalingInterval')
    toHTMLvar('dimScalingBoost')
    toHTMLvar('dimScalingSpeed')


    html['setSBTabButton'].setDisplay(false)
    html['loadSBTabButton'].setDisplay(false)
    html['dimSBTabButton'].setDisplay(false)
    html['upgSBTabButton'].setDisplay(false)


    for (let i = 0; i < 3; i++) {
        let color = ['red', 'green', 'blue'][i]
        let capsColor = ['Red', 'Green', 'Blue'][i]


        toHTMLvar(`${color}Quarks`)
        toHTMLvar(`${color}Energy`)
        toHTMLvar(`${color}QuarkAmt`)
        toHTMLvar(`${color}EnergyAmt`)
        toHTMLvar(`${color}QuarkEff`)
        toHTMLvar(`${color}EnergyEff`)
        
        toHTMLvar(`setback${capsColor}DimList`)
        toHTMLvar(`setback${capsColor}Value`)
        toHTMLvar(`setback${capsColor}Effect`)
        toHTMLvar(`setback${capsColor}Generate`)
        toHTMLvar(`setbackSlider${capsColor}`)
        toHTMLvar(`SBDim${capsColor}TabButton`)
        toHTMLvar(`setbackDim${capsColor}`)


        txt = ``
        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            txt += `
                <button onclick="buySBDim(${i}, ${j})" id="${capsColor}Dim${j}" style="color: #ffffff; font-family: Verdana; height: 50px; width: 300px; font-size: 10px; margin: 2px">
                    ${capsColor} Dimension ${j + 1}: ×<span id="${capsColor}Dim${j}amount"></span><br>
                    Mult: ×<span id="${capsColor}Dim${j}mult"></span><br>
                    Cost: <span id="${capsColor}Dim${j}cost"></span>
                </button>
            `
        }
        html[`setback${capsColor}DimList`].setHTML(txt)


        for (let j = 0; j < player.quarkDimsBought[i].length; j++) {
            toHTMLvar(`${capsColor}Dim${j}`)
            toHTMLvar(`${capsColor}Dim${j}amount`)
            toHTMLvar(`${capsColor}Dim${j}mult`)
            toHTMLvar(`${capsColor}Dim${j}cost`)
        }
    }
}


const draw = document.getElementById('draw');
const pen = draw.getContext("2d");
let dots = [];
initDots()


let gameStopped = false


let sessionTime = 0
let delta = 0


function initDots() {
    for (let i = 0; i < 32; i++) {
        dots.push([0, rand(-10000, 10000), rand(-10000, 10000), rand(0.1, 0.4), rand(-0.02, 0.02), rand(-0.02, 0.02)]);
    }
    for (let i = 0; i < 128; i++) {
        dots.push([1, rand(-10000, 10000), rand(-10000, 10000), rand(1.1, 3), rand(-0.1, 0.1), rand(-0.1, 0.1)]);
    }
}


const drawing = () => {
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
    for (let i = 0; i < dots.length; i++) {
        dots[i][4] += Math.random() - 0.5;
        dots[i][5] += Math.random() - 0.5;
        dots[i][4] = lerp(1 - (0.9 ** delta), dots[i][4], 0);
        dots[i][5] = lerp(1 - (0.9 ** delta), dots[i][5], 0);
        dots[i][1] += dots[i][3] * delta * dots[i][4];
        dots[i][2] += dots[i][3] * delta * dots[i][5];


        pen.beginPath();
        let alpha;
        if (dots[i][0] === 0) {
            alpha = 20 + (4 * Math.cos((sessionTime + 11 * i) / 50));
        } else {
            alpha = 160 + (64 * Math.cos((sessionTime + 11 * i) / 50));
        }
        pen.fillStyle = `hsla(${sessionTime + (i * (dots[i][0] === 0 ? 1 : 0.1))}, 100%, 50%, ${alpha / 255})`;
        let j = Math.cos((sessionTime * dots[i][3] + i) / (2 * Math.PI));
        pen.arc((Math.abs(dots[i][1] % 3800) - 700),
            (Math.abs(dots[i][2] % 2400) - 700),
            dots[i][0] == 0 ? (300 + 100 * j) : (10 + 4 * j),
            0,
            2 * Math.PI);
        pen.fill();
    }
}


function doOfflineTime() {
    for (let i = 0; i < Math.min(tmp.offlineTime.tickRemaining, 100); i++) {
        gameLoop()
        tmp.offlineTime.tickRemaining -= 1
    }


    html['inGame'].setDisplay(false)
    html['offlineTime'].setDisplay(true)


    html['offlineTimeDisplay'].setTxt(`Ticks: ${format(tmp.offlineTime.tickRemaining)} / ${format(tmp.offlineTime.tickMax)}`)
    html['offlineTimeProgressBar'].changeStyle('width', `${100 * (1 - (tmp.offlineTime.tickRemaining / tmp.offlineTime.tickMax))}%`)


    if (tmp.offlineTime.tickRemaining > 0) {
        window.setTimeout(doOfflineTime, 0)
    } else {
        tmp.offlineTime.active = false
        gameLoop()
    }
} 


function gameLoop() {
    if (gameStopped) {
        return;
    }


    delta = (new Date().valueOf() - player.lastTick) / 1000
    if (!tmp.offlineTime.active) {
        player.lastTick = new Date().valueOf()
        if (delta >= 10) {
            tmp.offlineTime.active = true
            tmp.offlineTime.tickMax = Math.floor(delta / tmp.offlineTime.tickLength)
            if (tmp.offlineTime.tickMax > 10000) {
                tmp.offlineTime.tickLength = tmp.offlineTime.tickLength * (tmp.offlineTime.tickMax / 10000)
                tmp.offlineTime.tickMax = tmp.offlineTime.tickMax / (tmp.offlineTime.tickMax / 10000)
            }
            tmp.offlineTime.tickRemaining = tmp.offlineTime.tickMax
            tmp.offlineTime.returnTime = sessionTime + (tmp.offlineTime.tickLength * 10)
            doOfflineTime()
            return;
        }
    } else {
        delta = tmp.offlineTime.tickLength
        // tmp.offlineTime.tickRemaining -= 1
        // if (tmp.offlineTime.tickRemaining < 0) {
        //     tmp.offlineTime.active = false
        //     return;
        // }
    }
    sessionTime += delta


    // tick game
    setbackGL()
    ascendGL()
    prestigeGL()
    mainGL()


    if (!tmp.offlineTime.active) {
        html['inGame'].setDisplay(true)
        html['offlineTime'].setDisplay(false)


        updateHTML()
        drawing()


        window.setTimeout(gameLoop, 50 - (new Date().valueOf() - player.lastTick2))
        player.lastTick2 = new Date().valueOf()
    } else {
        // if (sessionTime < tmp.offlineTime.returnTime) {
        //     gameLoop()
        // } else {
        //     html['inGame'].setDisplay(false)
        //     html['offlineTime'].setDisplay(true)


        //     html['offlineTimeDisplay'].setTxt(`Ticks: ${format(tmp.offlineTime.tickRemaining)} / ${format(tmp.offlineTime.tickMax)}`)
        //     html['offlineTimeProgressBar'].changeStyle('width', `${100 * (1 - (tmp.offlineTime.tickRemaining / tmp.offlineTime.tickMax))}%`)


        //     tmp.offlineTime.returnTime = sessionTime + (tmp.offlineTime.tickLength * 10)
        // }
    }


    // tmp.fps.push(new Date().valueOf() - player.lastTick2)
    // if (sessionTime > tmp.lastFPSTick) {
    //     tmp.lastFPSTick += 1
    //     let fps = 0
    //     for (let i = 0; i < tmp.fps.length; i++) {
    //         fps += tmp.fps[i]
    //     }
    //     fps = (1000 * tmp.fps.length) / fps
    //     tmp.fps = []
    //     console.log(`fps: ${fps.toFixed(1)}`)
    // }
}


function setbackGL() {
    tmp.quarkEffs[0] = Decimal.max(player.setbackQuarks[0], 0)
    tmp.quarkEffs[1] = Decimal.max(player.setbackQuarks[1], 0)
    tmp.quarkEffs[2] = Decimal.max(player.setbackQuarks[2], 0)


    tmp.energyEffs[0] = Decimal.max(player.setbackEnergy[0], 0).add(1).log10().add(1)
    tmp.energyEffs[1] = Decimal.max(player.setbackEnergy[1], 0).add(1).log10().div(20).add(1).log10().add(1).recip()
    tmp.energyEffs[2] = Decimal.max(player.setbackEnergy[2], 0).add(1).log10().pow(2).div(200).add(1)


    if (!player.inSetback) {
        player.setback = [D(html['setbackSliderRed'].el.value), D(html['setbackSliderGreen'].el.value), D(html['setbackSliderBlue'].el.value)]
    }


    tmp.setbackEffects[0] = player.setback[0].div(10).pow_base(0.2)
    tmp.setbackEffects[1] = player.setback[1].mul(4 / 3).add(1)
    tmp.setbackEffects[2] = player.setback[2].div(10).pow_base(16)


    tmp.trueQuarkTotal = D(0)
    tmp.predictedQuarkTotal = D(0)
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = player.currentSetback === null ? D(0) : player.setbackLoadout[player.currentSetback][i]
        tmp.predictedQuarkGain[i] = player.setback[i]
        
        tmp.trueQuarkTotal = tmp.trueQuarkTotal.add(tmp.trueQuarkGain[i])
        tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.add(tmp.predictedQuarkGain[i])
    }


    tmp.trueQuarkTotal = tmp.trueQuarkTotal.pow(2);
    tmp.predictedQuarkTotal = tmp.predictedQuarkTotal.pow(2);
    
    for (let i = 0; i < player.setback.length; i++) {
        tmp.trueQuarkGain[i] = Decimal.pow(tmp.trueQuarkGain[i], 2).mul(tmp.trueQuarkTotal)
        tmp.predictedQuarkGain[i] = Decimal.pow(tmp.predictedQuarkGain[i], 2).mul(tmp.predictedQuarkTotal)


        player.setbackQuarks[i] = Decimal.add(player.setbackQuarks[i], cheatDilateBoost(tmp.trueQuarkGain[i].mul(delta)))
    }


    for (let i = 0; i < player.setback.length; i++) {
        player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], cheatDilateBoost(Decimal.mul(tmp.quarkEffs[i], delta)))
    }


    tmp.quarkBoostInterval = D(100)
    tmp.quarkBoostEffect = D(1)
    tmp.quarkBoostCost = D(2)


    for (let i = 0; i < player.setback.length; i++) {
        for (let j = player.quarkDimsBought[i].length - 1; j >= 0; j--) {
            if (tmp.quarkDim[i][j] === undefined) {
                tmp.quarkDim[i][j] = {
                    mult: D(1),
                    cost: D(1),
                    target: D(0)
                }
            }


            tmp.quarkDim[i][j].target = Decimal.max(player.setbackEnergy[i], 1).log10()
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.sub(Decimal.pow(j + 1, 2)).div(j + 3)


            let h = tmp.quarkDim[i][j].target.mul(tmp.quarkBoostCost.sub(1)).div(tmp.quarkBoostInterval).add(1).log(tmp.quarkBoostCost).floor()
            tmp.quarkDim[i][j].target = tmp.quarkDim[i][j].target.add(tmp.quarkBoostInterval.div(tmp.quarkBoostCost.sub(1))).div(tmp.quarkBoostCost.pow(h)).add(h.sub(tmp.quarkBoostCost.sub(1).recip()).mul(tmp.quarkBoostInterval))


            if (player.quarkDimsAuto[i][j] || player.cheats.autoDim) {
                let spd = D(4)


                if (player.cheats.autoDim) {
                    spd = spd.add(Infinity)
                }


                player.quarkDimsIntermediate[i][j] = Decimal.add(player.quarkDimsIntermediate[i][j], spd.mul(delta)).min(tmp.quarkDim[i][j].target).max(player.quarkDimsBought[i][j])
                player.quarkDimsBought[i][j] = player.quarkDimsIntermediate[i][j].add(0.99999999).floor()
            }


            tmp.quarkDim[i][j].cost = D(player.quarkDimsBought[i][j])
            let x = tmp.quarkDim[i][j].cost.div(tmp.quarkBoostInterval).floor()
            let m = tmp.quarkDim[i][j].cost.sub(x.mul(tmp.quarkBoostInterval))
            tmp.quarkDim[i][j].cost = m.mul(tmp.quarkBoostCost.pow(x)).add(tmp.quarkBoostCost.pow(x).sub(1).div(tmp.quarkBoostCost.sub(1)).mul(tmp.quarkBoostInterval))


            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.mul(j + 3).add(Decimal.pow(j + 1, 2))
            tmp.quarkDim[i][j].cost = tmp.quarkDim[i][j].cost.pow10()


            let baseMultBoost = D(2)
            baseMultBoost = baseMultBoost.add(Decimal.div(player.quarkDimsBought[i][j], tmp.quarkBoostInterval).floor().mul(tmp.quarkBoostEffect))
            // cheat
            // baseMultBoost = baseMultBoost.pow(8)
            // end cheat


            tmp.quarkDim[i][j].mult = D(1)
            tmp.quarkDim[i][j].mult = tmp.quarkDim[i][j].mult.mul(Decimal.pow(baseMultBoost, player.quarkDimsBought[i][j]))


            let gen = tmp.quarkDim[i][j].mult.mul(Decimal.add(player.quarkDimsAccumulated[i][j], player.quarkDimsBought[i][j]))
            if (j === 0) {
                gen = gen.mul(tmp.quarkEffs[i])
                gen = cheatDilateBoost(gen)
            } 
            gen = gen.mul(delta)


            if (j === 0) {
                player.setbackEnergy[i] = Decimal.add(player.setbackEnergy[i], gen)
            } else {
                player.quarkDimsAccumulated[i][j - 1] = Decimal.add(player.quarkDimsAccumulated[i][j - 1], gen)
            }
        }
    }
}


function ascendGL() {
    player.timeInAscend = Decimal.add(player.timeInAscend, delta)


    for (let i = ASCENSION_UPGRADES.length - 1; i >= 0; i--) {
        if (player.ascendUpgrades[i] === undefined) {
            player.ascendUpgrades[i] = D(0)
        }
        if (player.cheats.autoAscendUpgrades) {
            player.ascendUpgrades[i] = Decimal.min(ASCENSION_UPGRADES[i].target, ASCENSION_UPGRADES[i].cap).add(0.99999999).max(player.ascendUpgrades[i]).floor()
        }
    }


    tmp.ascendReq = D(1e21)
    if (player.inSetback) {
        tmp.ascendReq = tmp.ascendReq.pow(tmp.setbackEffects[2])
    }
    tmp.ascendAmount = player.bestPointsInAscend.max(1).log(tmp.ascendReq).sub(1).pow_base(1000)
    tmp.ascendAmount = cheatDilateBoost(tmp.ascendAmount)
    tmp.ascendAmount = tmp.ascendAmount.floor()


    tmp.ascendNext = tmp.ascendAmount
    tmp.ascendNext = cheatDilateBoost(tmp.ascendNext, true)
    tmp.ascendNext = tmp.ascendNext.add(1).log(1000).add(1).pow_base(tmp.ascendReq)


    if (player.cheats.autoAscend) {
        player.ascend = Decimal.add(player.ascend, tmp.ascendAmount.mul(delta))
    }


    tmp.ascendPointEffect = D(player.ascend)
    tmp.ascendPointEffect = tmp.ascendPointEffect.mul(ASCENSION_UPGRADES[3].eff)


    // tmp.ascendPointEffect = tmp.ascendPointEffect.add(1).log10().add(1).log10().add(1).pow(2).sub(1).pow10().sub(1).pow10().sub(1)


    player.ascendGems = Decimal.add(player.ascendGems, tmp.ascendPointEffect.mul(delta))
}


function prestigeGL() {
    player.timeInPrestige = Decimal.add(player.timeInPrestige, delta)


    tmp.prestigeUpgradeCap = 4
    if (player.prestigeChallengeCompleted.includes(0)) {
        tmp.prestigeUpgradeCap++
    }
    if (player.prestigeChallengeCompleted.includes(1)) {
        tmp.prestigeUpgradeCap++
    }
    if (player.prestigeChallengeCompleted.includes(2)) {
        tmp.prestigeUpgradeCap++
    }
    if (player.prestigeChallengeCompleted.includes(3)) {
        tmp.prestigeUpgradeCap++
    }
    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.prestigeUpgradeCap++
    }
    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.prestigeUpgradeCap++
    }


    tmp.prestigeUsed = D(0)
    for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
        if (player.prestigeUpgrades.includes(i)) {
            tmp.prestigeUsed = tmp.prestigeUsed.add(PRESTIGE_UPGRADES[i].cost)
        }
    }


    tmp.prestigeAmount = player.bestPointsInPrestige.max(1e5).div(1e6).log10().add(1)
    tmp.prestigeAmount = tmp.prestigeAmount.mul(tmp.energyEffs[2])
    tmp.prestigeAmount = cheatDilateBoost(tmp.prestigeAmount)
    tmp.prestigeAmount = tmp.prestigeAmount.sub(player.prestige).floor().max(0)


    tmp.prestigeNext = tmp.prestigeAmount.add(player.prestige).add(1)
    tmp.prestigeNext = cheatDilateBoost(tmp.prestigeNext, true)
    tmp.prestigeNext = tmp.prestigeNext.div(tmp.energyEffs[2])
    tmp.prestigeNext = tmp.prestigeNext.sub(1).pow10().mul(1e6)


    // auto-prestige
    if (player.cheats.autoPrestige) {
        player.prestige = player.prestige.add(tmp.prestigeAmount)
    }


    tmp.prestigePointEffect = player.prestigeChallengeCompleted.includes(3) 
        ? Decimal.div(player.prestige, 
            player.prestigeUpgrades.includes(14) && player.prestigeChallenge !== 5 
                ? 2 
                : 5
            )
            .add(1) 
        : D(1)
}


function mainGL() {
    tmp.bybBoostInterval = D(100)
    tmp.bybBoostEffect = D(2)
    tmp.bybBoostCost = D(2)


    if (player.prestigeChallengeCompleted.includes(4)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }


    if (player.prestigeChallengeCompleted.includes(5)) {
        tmp.bybBoostEffect = tmp.bybBoostEffect.add(1)
    }


    if (player.prestigeChallenge === 3) {
        tmp.bybBoostInterval = tmp.bybBoostInterval.div(2)
        tmp.bybBoostEffect = D(1)
    }


    if (player.prestigeChallenge === 1 || player.prestigeChallenge === 4) {
        tmp.bybBoostInterval = D(5)
        tmp.bybBoostEffect = D(1)
    }


    // cheat
    // tmp.bybBoostEffect = tmp.bybBoostEffect.add(player.timeInPrestige)
    // tmp.bybBoostCost = tmp.bybBoostCost.root(player.timeInPrestige.add(1))
    // end cheat


    tmp.pointGen = D(1)
    for (let i = player.buyables.length - 1; i >= 0; i--) {
        if (tmp.buyables[i] === undefined) {
            tmp.buyables[i] = {
                effective: D(0),
                effect: D(1),
                cost: D(10),
                target: D(0),
                genLevels: D(0)
            }
        }


        let enabled = true
        if (i === 0 && player.prestigeChallenge === 5) {
            enabled = false
        }
        if (i === 4 && !player.prestigeChallengeCompleted.includes(1)) {
            enabled = false
        }


        if (enabled) {
            let pow = Decimal.pow(2 + i, 0.1)
            let baseCost = [D(2), D(20), D(500), D(10000), D(1e6)][i]
            tmp.buyables[i].target = D(player.points)
            tmp.buyables[i].target = tmp.buyables[i].target.root(tmp.energyEffs[1])
            tmp.buyables[i].target = tmp.buyables[i].target.div(baseCost).max(1).mul(pow.sub(1)).add(1).log(pow).sub(1)
            if (player.inSetback) {
                tmp.buyables[i].target = tmp.buyables[i].target.div(tmp.setbackEffects[1])
            }
            if (i >= 0 && i <= 3) {
                tmp.buyables[i].target = tmp.buyables[i].target.div(Decimal.sub(1, ASCENSION_UPGRADES[i + 8].eff)) 
            }


            let h = tmp.buyables[i].target.mul(tmp.bybBoostCost.sub(1)).div(tmp.bybBoostInterval).add(1).log(tmp.bybBoostCost).floor()
            tmp.buyables[i].target = tmp.buyables[i].target.add(tmp.bybBoostInterval.div(tmp.bybBoostCost.sub(1))).div(tmp.bybBoostCost.pow(h)).add(h.sub(tmp.bybBoostCost.sub(1).recip()).mul(tmp.bybBoostInterval))


            // auto-upgrade
            if (player.upgradeAuto[i]) {
                let spd = ASCENSION_UPGRADES[i + 4].eff


                if (player.cheats.autobuyBulk) {
                    spd = spd.add(Infinity)
                }


                player.buyableIntermediate[i] = Decimal.add(player.buyableIntermediate[i], spd.mul(delta)).min(tmp.buyables[i].target.add(0.99999999)).max(player.buyables[i])
                player.buyables[i] = player.buyableIntermediate[i].floor()
            }


            tmp.buyables[i].cost = D(player.buyables[i])
            let x = tmp.buyables[i].cost.div(tmp.bybBoostInterval).floor()
            let m = tmp.buyables[i].cost.sub(x.mul(tmp.bybBoostInterval))
            tmp.buyables[i].cost = m.mul(tmp.bybBoostCost.pow(x)).add(tmp.bybBoostCost.pow(x).sub(1).div(tmp.bybBoostCost.sub(1)).mul(tmp.bybBoostInterval))


            if (i >= 0 && i <= 3) {
                tmp.buyables[i].cost = tmp.buyables[i].cost.mul(Decimal.sub(1, ASCENSION_UPGRADES[i + 8].eff))
            }
            if (player.inSetback) {
                tmp.buyables[i].cost = tmp.buyables[i].cost.mul(tmp.setbackEffects[1])
            }
            tmp.buyables[i].cost = Decimal.add(tmp.buyables[i].cost, 1).pow_base(pow).sub(1).div(pow.sub(1)).mul(baseCost)
            tmp.buyables[i].cost = tmp.buyables[i].cost.pow(tmp.energyEffs[1])


            tmp.buyables[i].effective = player.buyables[i]
            if (player.prestigeChallengeCompleted.includes(2)) {
                tmp.buyables[i].effective = tmp.buyables[i].effective.mul(1.5)
            }
            if (!(player.prestigeChallenge === 2 || player.prestigeChallenge === 4)) {
                if (player.prestigeUpgrades.includes(3) && player.prestigeChallenge !== 5) {
                    for (let j = i + 1; j < player.buyables.length; j++) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[j].effective)
                    }
                } else {
                    if (i !== player.buyables.length - 1) {
                        tmp.buyables[i].effective = tmp.buyables[i].effective.add(tmp.buyables[i + 1].effective)
                    }
                }
            }


            let upgGen = D(0)
            if (player.prestigeChallengeCompleted.includes(0)) {
                upgGen = D(player.buyables[i])
                upgGen = upgGen.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect))
                upgGen = upgGen.mul(ASCENSION_UPGRADES[1].eff)
                if (player.prestigeUpgrades.includes(10) && player.prestigeChallenge !== 5) {
                    upgGen = upgGen.pow(PRESTIGE_UPGRADES[10].eff);
                }
                if (player.prestigeUpgrades.includes(11) && player.prestigeChallenge !== 5) {
                    upgGen = upgGen.pow(PRESTIGE_UPGRADES[11].eff);
                }


                // cheat
                upgGen = cheatDilateBoost(upgGen)
                // end cheat 
            }
            player.upgradePoints[i] = player.upgradePoints[i].add(upgGen.mul(delta))


            tmp.buyables[i].genLevels = inverseFact(player.upgradePoints[i].max(1)).max(1).floor()


            tmp.buyables[i].effect = [D(1.0), D(0.5), D(0.25), D(0.1), D(0.05)][i]
            if ((player.prestigeChallenge === 3 || player.prestigeChallenge === 4) && i < player.buyables.length - 1) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.add(tmp.buyables[i+1].effect)
            }


            if (player.prestigeUpgrades.includes(5) && player.prestigeChallenge !== 5) {
                if (i === 3) {
                    tmp.buyables[i].effect = tmp.buyables[i].effect.add(PRESTIGE_UPGRADES[5].eff)
                }
            }


            if (player.prestigeUpgrades.includes(8) && player.prestigeChallenge !== 5) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.mul(PRESTIGE_UPGRADES[8].eff);
            }


            if (player.prestigeChallenge === 0 || player.prestigeChallenge === 4) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.div(2)
            }
            tmp.buyables[i].effect = tmp.buyables[i].effect.mul(tmp.buyables[i].genLevels.sub(1).div(player.prestigeUpgrades.includes(12) && player.prestigeChallenge !== 5 ? 4 : 10).add(1))
            tmp.buyables[i].effect = tmp.buyables[i].effective.mul(tmp.buyables[i].effect).add(1)


            if ((player.prestigeChallenge === 3 || player.prestigeChallenge === 4) && i !== 0) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.sub(1)
            }


            tmp.buyables[i].effect = tmp.buyables[i].effect.mul(Decimal.div(player.buyables[i], tmp.bybBoostInterval).floor().pow_base(tmp.bybBoostEffect))
            if (Decimal.lt(i, player.ascendUpgrades[2])) {
                tmp.buyables[i].effect = tmp.buyables[i].effect.pow(ASCENSION_UPGRADES[2].eff)
            }


            if (!(player.prestigeChallenge === 3 || player.prestigeChallenge === 4) || i === 0) {
                tmp.pointGen = tmp.pointGen.mul(tmp.buyables[i].effect)
            }
        }
    }
    if (player.prestigeUpgrades.includes(0) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[0].eff);
    }
    if (player.prestigeUpgrades.includes(1) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[1].eff);
    }
    if (player.prestigeUpgrades.includes(2) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[2].eff);
    }
    if (player.prestigeUpgrades.includes(4) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[4].eff);
    }
    if (player.prestigeUpgrades.includes(6) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[6].eff);
    }
    if (player.prestigeUpgrades.includes(7) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.mul(PRESTIGE_UPGRADES[7].eff);
    }
    if (player.prestigeChallengeCompleted.includes(3)) {
        tmp.pointGen = tmp.pointGen.mul(tmp.prestigePointEffect)
    }
    tmp.pointGen = tmp.pointGen.mul(ASCENSION_UPGRADES[0].eff)
    tmp.pointGen = tmp.pointGen.mul(tmp.energyEffs[0])
    if (player.prestigeUpgrades.includes(9) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.pow(PRESTIGE_UPGRADES[9].eff);
    }
    if (player.prestigeUpgrades.includes(11) && player.prestigeChallenge !== 5) {
        tmp.pointGen = tmp.pointGen.pow(PRESTIGE_UPGRADES[11].eff);
    }
    if (player.inSetback) {
        tmp.pointGen = tmp.pointGen.pow(tmp.setbackEffects[0])
    }


    // cheat
    tmp.pointGen = cheatDilateBoost(tmp.pointGen)
    // end cheat


    player.points = player.points.add(tmp.pointGen.mul(delta))
    player.bestPointsInPrestige = Decimal.max(player.points, player.bestPointsInPrestige)
    player.bestPointsInAscend = Decimal.max(player.points, player.bestPointsInAscend)
}


function updateHTML() {
    if (player.tab === 4) {        
        html['setSBTabButton'].setDisplay(player.setbackLoadout.length > 0)
        html['loadSBTabButton'].setDisplay(player.setbackLoadout.length > 0)
        html['dimSBTabButton'].setDisplay(player.setbackLoadout.length > 0)
        html['upgSBTabButton'].setDisplay(player.setbackLoadout.length > 0)


        html['setbackTabSettings'].setDisplay(player.setbackTab === 0)
        html['setbackTabLoadout'].setDisplay(player.setbackTab === 1)
        html['setbackTabDims'].setDisplay(player.setbackTab === 2)
        
        if (player.setbackTab === 0) {
            html['setbackSliderRed'].el.disabled = player.inSetback
            html['setbackSliderGreen'].el.disabled = player.inSetback
            html['setbackSliderBlue'].el.disabled = player.inSetback


            html['setbackRedValue'].setTxt(format(player.setback[0]))
            html['setbackGreenValue'].setTxt(format(player.setback[1]))
            html['setbackBlueValue'].setTxt(format(player.setback[2]))


            html['setbackRedEffect'].setTxt(format(tmp.setbackEffects[0], 2))
            html['setbackGreenEffect'].setTxt(format(tmp.setbackEffects[1], 1))
            html['setbackBlueEffect'].setTxt(format(tmp.setbackEffects[2], 2))


            html['setbackRedGenerate'].setTxt(format(tmp.predictedQuarkGain[0]))
            html['setbackGreenGenerate'].setTxt(format(tmp.predictedQuarkGain[1]))
            html['setbackBlueGenerate'].setTxt(format(tmp.predictedQuarkGain[2]))


            html['setbackToggle'].changeStyle(!(Decimal.eq(player.setback[0], 0) && Decimal.eq(player.setback[1], 0) && Decimal.eq(player.setback[2], 0)) ? 'pointer' : 'not-allowed')
        }


        if (player.setbackTab === 1) {
            // the displaying is done in displaySetbackCompleted() !
        }


        if (player.setbackTab === 2) {
            html['redQuarks'].setTxt(format(player.setbackQuarks[0]))
            html['greenQuarks'].setTxt(format(player.setbackQuarks[1]))
            html['blueQuarks'].setTxt(format(player.setbackQuarks[2]))
            
            html['redEnergy'].setTxt(format(player.setbackEnergy[0]))
            html['greenEnergy'].setTxt(format(player.setbackEnergy[1]))
            html['blueEnergy'].setTxt(format(player.setbackEnergy[2]))


            html['dimScalingInterval'].setTxt(format(tmp.quarkBoostInterval))
            html['dimScalingSpeed'].setTxt(format(tmp.quarkBoostCost, 2))
            html['dimScalingBoost'].setTxt(format(tmp.quarkBoostEffect, 2))


            let color = ['red', 'green', 'blue']
            let capsColor = ['Red', 'Green', "Blue"]


            for (let i = 0; i < capsColor.length; i++) {
                html[`setbackDim${capsColor[i]}`].setDisplay(i === player.setbackDimTab)
            }


            html[`${color[player.setbackDimTab]}QuarkAmt`].setTxt(format(player.setbackQuarks[player.setbackDimTab]))
            html[`${color[player.setbackDimTab]}EnergyAmt`].setTxt(format(player.setbackEnergy[player.setbackDimTab]))
            html[`${color[player.setbackDimTab]}QuarkEff`].setTxt(format(tmp.quarkEffs[player.setbackDimTab]))
            html[`${color[player.setbackDimTab]}EnergyEff`].setTxt(format(tmp.energyEffs[player.setbackDimTab], 3))


            for (let i = 0; i < player.quarkDimsBought[player.setbackDimTab].length; i++) {
                html[`${capsColor[player.setbackDimTab]}Dim${i}`].setDisplay(i === 0 ? true : Decimal.gt(player.quarkDimsBought[player.setbackDimTab][i - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[player.setbackDimTab][i - 1], 0))
                if (i === 0 ? true : Decimal.gt(player.quarkDimsBought[player.setbackDimTab][i - 1], 0) || Decimal.gt(player.quarkDimsAccumulated[player.setbackDimTab][i - 1], 0)) {
                    html[`${capsColor[player.setbackDimTab]}Dim${i}`].changeStyle('background-color', `#${Decimal.gte(player.setbackEnergy[player.setbackDimTab], tmp.quarkDim[player.setbackDimTab][i].cost) ? tmp.quarkColorLookup[player.setbackDimTab].fill.canBuy : tmp.quarkColorLookup[player.setbackDimTab].fill.cannotBuy}80`)
                    html[`${capsColor[player.setbackDimTab]}Dim${i}`].changeStyle('border', `3px solid #${Decimal.gte(player.setbackEnergy[player.setbackDimTab], tmp.quarkDim[player.setbackDimTab][i].cost) ? tmp.quarkColorLookup[player.setbackDimTab].border.canBuy : tmp.quarkColorLookup[player.setbackDimTab].border.cannotBuy}`)
                    html[`${capsColor[player.setbackDimTab]}Dim${i}`].changeStyle('cursor', Decimal.gte(player.setbackEnergy[player.setbackDimTab], tmp.quarkDim[player.setbackDimTab][i].cost) ? 'pointer' : 'not-allowed')
                    html[`${capsColor[player.setbackDimTab]}Dim${i}amount`].setTxt(`${format(player.quarkDimsBought[player.setbackDimTab][i])} (${format(player.quarkDimsAccumulated[player.setbackDimTab][i])})`)
                    html[`${capsColor[player.setbackDimTab]}Dim${i}mult`].setTxt(`${format(tmp.quarkDim[player.setbackDimTab][i].mult, 2)}`)
                    html[`${capsColor[player.setbackDimTab]}Dim${i}cost`].setTxt(`${format(tmp.quarkDim[player.setbackDimTab][i].cost)} ${capsColor[player.setbackDimTab]} Energy`)
                }
            }
        }
    }
    if (player.tab === 3) {
        let notCapped, canBuy
        for (let i = 0; i < ASCENSION_UPGRADES.length; i++) {
            notCapped = Decimal.lt(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)
            canBuy = ASCENSION_UPGRADES[i].req && Decimal.gte(player.ascendGems, ASCENSION_UPGRADES[i].cost)
            html[`ascendUpgrade${i}eff`].setTxt(ASCENSION_UPGRADES[i].desc)
            html[`ascendUpgrade${i}cost`].setTxt(`Cost: ${format(ASCENSION_UPGRADES[i].cost)} gems`)
            html[`ascendUpgrade${i}req`].setTxt(ASCENSION_UPGRADES[i].reqDesc === undefined ? 'No restriction.' : ASCENSION_UPGRADES[i].reqDesc)
            html[`ascendUpgrade${i}amount`].setTxt(`${format(player.ascendUpgrades[i])} / ${format(ASCENSION_UPGRADES[i].cap)}`)


            html[`ascendUpgrade${i}`].changeStyle('background-color', notCapped ? (canBuy ? '#00C00080' : ASCENSION_UPGRADES[i].req ? '#00800080' : '#80000080') : '#00FF0080')
            html[`ascendUpgrade${i}`].changeStyle('border', `3px solid ${notCapped ? (canBuy ? '#00C000' : ASCENSION_UPGRADES[i].req ? '#008000' : '#800000') : '#00ff00'}`)
            html[`ascendUpgrade${i}`].changeStyle('cursor', notCapped && canBuy ? 'pointer' : 'not-allowed')
        }


        html['ascendPoints'].setTxt(`${format(player.ascend)}`)
        html['ascendGems'].setTxt(`${format(player.ascendGems)}`)
        html['ascendPointEffect'].setDisplay(true)
        html['ascendPointEffect'].setTxt(`Producing ${format(tmp.ascendPointEffect, 2)} gems per second`)
    }
    if (player.tab === 2) {
        for (let i = 0; i < PRESTIGE_CHALLENGES.length; i++) {
            html[`prestigeChallenge${i}name`].setTxt(PRESTIGE_CHALLENGES[i].name)
            html[`prestigeChallenge${i}desc`].setTxt(PRESTIGE_CHALLENGES[i].desc)
            html[`prestigeChallenge${i}goal`].setTxt(format(PRESTIGE_CHALLENGES[i].goal))
            html[`prestigeChallenge${i}reward`].setTxt(PRESTIGE_CHALLENGES[i].eff)


            let shown = true
            if (i === 4) {
                shown = player.prestigeChallengeCompleted.includes(0)
                    && player.prestigeChallengeCompleted.includes(1)
                    && player.prestigeChallengeCompleted.includes(2)
                    && player.prestigeChallengeCompleted.includes(3)
            }
            if (i === 5) {
                shown = Decimal.gte(player.ascendUpgrades[13], 1)
            }


            if (shown) {
                html[`prestigeChallenge${i}`].changeStyle('background-color', !player.prestigeChallengeCompleted.includes(i) ? (player.prestigeChallenge === i ? '#00408080' : '#00008080') : '#00808080')
                html[`prestigeChallenge${i}`].changeStyle('border', `3px solid ${!player.prestigeChallengeCompleted.includes(i) ? (player.prestigeChallenge === i ? '#0080ff' : '#0000ff') : '#00ffff'}`)
                html[`prestigeChallenge${i}`].changeStyle('cursor', !player.prestigeChallengeCompleted.includes(i) ? 'pointer' : 'not-allowed')
                html[`prestigeChallenge${i}`].setDisplay(true)
            } else {
                html[`prestigeChallenge${i}`].setDisplay(false)
            }
        }
    }
    if (player.tab === 1) {
        for (let i = 0; i < PRESTIGE_UPGRADES.length; i++) {
            let show = true
            if (i >= 9 && i <= 11) {
                show = Decimal.gt(player.ascendUpgrades[12], 0)
            }
            if (i >= 12 && i <= 14) {
                show = Decimal.gt(player.ascendUpgrades[12], 1)
            }
            html[`prestigeUpgrade${i}`].setDisplay(show)
            if (show) {
                html[`prestigeUpgrade${i}eff`].setTxt(PRESTIGE_UPGRADES[i].eff === undefined ? PRESTIGE_UPGRADES[i].desc : `${PRESTIGE_UPGRADES[i].desc}${format(PRESTIGE_UPGRADES[i].eff, 2)}`)
                html[`prestigeUpgrade${i}cost`].setTxt(player.prestigeUpgrades.includes(i) ? `Bought!` : `Cost: ${format(PRESTIGE_UPGRADES[i].cost)} prestige points`)


                html[`prestigeUpgrade${i}`].changeStyle('background-color', !player.prestigeUpgrades.includes(i) ? (canBuyPrestigeUpgrade(i) ? '#00408080' : '#00008080') : '#00808080')
                html[`prestigeUpgrade${i}`].changeStyle('border', `3px solid ${!player.prestigeUpgrades.includes(i) ? (canBuyPrestigeUpgrade(i) ? '#0080ff' : '#0000ff') : '#00ffff'}`)
                html[`prestigeUpgrade${i}`].changeStyle('cursor', !player.prestigeUpgrades.includes(i) && canBuyPrestigeUpgrade(i) ? 'pointer' : 'not-allowed')
            }
        }


        html['prestigePoints'].setTxt(`${format(Decimal.sub(player.prestige, tmp.prestigeUsed))}`)
        html['prestigePointEffect'].setDisplay(player.prestigeChallengeCompleted.includes(3))
        if (player.prestigeChallengeCompleted.includes(3)) {
            html['prestigePointEffect'].setTxt(`Boosting points by ×${format(tmp.prestigePointEffect, 2)}`)
        }
        html['prestigeUpgradeCap'].setTxt(`${player.prestigeUpgrades.length} / ${tmp.prestigeUpgradeCap}`)
    }
    if (player.tab === 0) {
        html['upgradeScalingInterval'].setTxt(format(tmp.bybBoostInterval))
        html['upgradeScalingSpeed'].setTxt(format(tmp.bybBoostCost, 2))
        html['upgradeScalingBoost'].setTxt(format(tmp.bybBoostEffect, 2))
        html['upgradeScalingPC1'].setTxt(player.prestigeChallengeCompleted.includes(0) ? ' and generation' : '')
        html['upgradeInSetback'].setTxt(player.inSetback ? `You are in setback (${format(player.setback[0])}, ${format(player.setback[1])}, ${format(player.setback[2])})! Ascend to complete it or exit early in the Setback tab!` : '')
        html['upgradePC1Desc'].setDisplay(player.prestigeChallengeCompleted.includes(0))
        
        if (player.prestigeChallenge === null) {
            html['prestigeAmount'].setTxt(format(tmp.prestigeAmount))
            html['prestigeNext'].setTxt(format(tmp.prestigeNext))


            html['prestige'].changeStyle('cursor', Decimal.gt(tmp.prestigeAmount, 0) ? 'pointer' : 'not-allowed')
            html['prestige'].setDisplay(true)
            html['prestigeChallengeButton'].setDisplay(false)
        } else {
            html['prestigeChallengeName'].setTxt(PRESTIGE_CHALLENGES[player.prestigeChallenge].name)
            html['prestigeChallengeRequirement'].setTxt(format(PRESTIGE_CHALLENGES[player.prestigeChallenge].goal))
            html['prestigeChallengeButton'].changeStyle('cursor', Decimal.gte(player.points, PRESTIGE_CHALLENGES[player.prestigeChallenge].goal) ? 'pointer' : 'not-allowed')


            html['prestige'].setDisplay(false)
            html['prestigeChallengeButton'].setDisplay(true)
        }


        html['ascendAmount'].setTxt(`${format(tmp.ascendAmount)}`)
        html['ascendNext'].setTxt(`${format(tmp.ascendNext)}`)
    
        html['ascend'].changeStyle('cursor', Decimal.gt(tmp.ascendAmount, 0) ? 'pointer' : 'not-allowed')
        html['ascend'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e18) || Decimal.gt(player.ascend, 0))


        for (let i = 0; i < player.buyables.length; i++) {
            let enabled = true
            if (i === 0 && player.prestigeChallenge === 5) {
                enabled = false
            }
            if (i === 4 && !player.prestigeChallengeCompleted.includes(1)) {
                enabled = false
            }
        
            if (enabled) {
                html[`upgrade${i}`].setDisplay(true)
                html[`upgrade${i}all`].setDisplay(true)
                html[`upgrade${i}generators`].setDisplay(player.prestigeChallengeCompleted.includes(0))
                html[`upgrade${i}generatorProgressNumber`].setDisplay(player.prestigeChallengeCompleted.includes(0))
        
                if (player.prestigeChallengeCompleted.includes(0)) {
                    html[`upgrade${i}generatorProgressBarBase`].changeStyle('background-color', Decimal.gte(player.points, tmp.buyables[i].cost) ? '#008000' : '#800000')
                    html[`upgrade${i}generatorProgressBar`].changeStyle('background-color', Decimal.gte(player.points, tmp.buyables[i].cost) ? '#00FF00' : '#FF0000')
                    if (tmp.buyables[i].genLevels.gte(69)) {
                        if (tmp.buyables[i].genLevels.gte(100000)) {
                            html[`upgrade${i}generatorProgressNumber`].setTxt(`Level ${format(tmp.buyables[i].genLevels)}`)
                        } else {
                            html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.upgradePoints[i])}, Level ${format(tmp.buyables[i].genLevels)}`)
                        }
                        html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${player.upgradePoints[i].div(tmp.buyables[i].genLevels.factorial()).max(1).log(tmp.buyables[i].genLevels.add(1).factorial().div(tmp.buyables[i].genLevels.factorial())).min(1).mul(100).toNumber()}%`)
                    } else {
                        html[`upgrade${i}generatorProgressNumber`].setTxt(`${format(player.upgradePoints[i])}/${format(tmp.buyables[i].genLevels.add(1).factorial())}, Level ${format(tmp.buyables[i].genLevels)}`)
                        html[`upgrade${i}generatorProgressBar`].changeStyle('width', `${player.upgradePoints[i].div(tmp.buyables[i].genLevels.add(1).factorial()).min(1).mul(100).toNumber()}%`)
                    }
                }
        
                html[`upgrade${i}amount`].setTxt(`${format(player.buyables[i])}${tmp.buyables[i].effective.eq(player.buyables[i]) ? '' : ' (' + format(tmp.buyables[i].effective) + ')'}`)
                html[`upgrade${i}cost`].setTxt(`${format(tmp.buyables[i].cost)}`)
                if (!(player.prestigeChallenge === 3 || player.prestigeChallenge === 4) || i === 0) {
                    html[`upgrade${i}eff`].setTxt(`×${format(tmp.buyables[i].effect, 2)} point gain`)
                } else {
                    html[`upgrade${i}eff`].setTxt(`+${format(tmp.buyables[i].effect, 2)} Buyable ${i} base`)
                }
        
                html[`upgrade${i}`].changeStyle('background-color', Decimal.gte(player.points, tmp.buyables[i].cost) ? '#00400080' : '#40000080')
                html[`upgrade${i}`].changeStyle('border', `3px solid ${Decimal.gte(player.points, tmp.buyables[i].cost) ? '#00ff00' : '#ff0000'}`)
                html[`upgrade${i}`].changeStyle('cursor', Decimal.gte(player.points, tmp.buyables[i].cost) ? 'pointer' : 'not-allowed')
        
                let auto = false
                if (i >= 0 && i <= 3) {
                    auto = Decimal.gt(player.ascendUpgrades[i + 4], 0)
                }
        
                auto ||= player.cheats.autobuyUnlock
        
                if (auto) {
                    html[`upgrade${i}autoStatus`].setTxt(player.upgradeAuto[i] ? 'On' : 'Off')
                    html[`upgrade${i}auto`].changeStyle('background-color', player.upgradeAuto[i] ? '#00400080' : '#40000080')
                    html[`upgrade${i}auto`].changeStyle('border', `3px solid ${player.upgradeAuto[i] ? '#00ff00' : '#ff0000'}`)
                }
        
                html[`upgrade${i}auto`].setDisplay(auto)
            } else {
                html[`upgrade${i}`].setDisplay(false)
                html[`upgrade${i}all`].setDisplay(false)
            }
        }
    }


    html["points"].setTxt(`${format(player.points, 2)}`)
    html["pointsPerSecond"].setTxt(`${format(tmp.pointGen, 2)}/s`)


    html['mainTab'].setDisplay(player.tab === 0)
    html['prestigeTab'].setDisplay(player.tab === 1)
    html['prestigeChallengeTab'].setDisplay(player.tab === 2)
    html['ascendTab'].setDisplay(player.tab === 3)
    html['setbackTab'].setDisplay(player.tab === 4)


    html['mainTabButton'].setDisplay(Decimal.gt(player.prestige, 0) || Decimal.gt(player.ascend, 0))
    html['prestigeTabButton'].setDisplay(Decimal.gt(player.prestige, 0) || Decimal.gt(player.ascend, 0))
    html['prestigeChallengeTabButton'].setDisplay(Decimal.gte(player.prestige, 3) || Decimal.gt(player.ascend, 0))
    html['ascendTabButton'].setDisplay(Decimal.gte(player.bestPointsInAscend, 1e21) || Decimal.gt(player.ascend, 0))
    html['setbackTabButton'].setDisplay(Decimal.gte(player.ascend, 10))
}


function doPrestigeReset(doAnyway = false) {
    if (Decimal.lte(tmp.prestigeAmount, 0) && !doAnyway) {
        return;
    }
    player.prestige = Decimal.add(player.prestige, tmp.prestigeAmount)
    player.timeInPrestige = D(0)
    player.points = D(0)
    player.bestPointsInPrestige = D(0)
    for (let i = 0; i < player.buyables.length; i++) {
        player.buyables[i] = D(0)
        player.upgradePoints[i] = D(0)
    }
    tmp.buyables = [] // we have to reset this otherwise stuff might not carry over -_-
}


function respecPrestigeUpgrades() {
    player.prestigeUpgrades = []
    doPrestigeReset(true)
}


function buyUpgrade(i) {
    if (Decimal.lt(player.points, tmp.buyables[i].cost)) {
        return;
    }
    player.points = Decimal.sub(player.points, tmp.buyables[i].cost)
    player.buyables[i] = Decimal.add(player.buyables[i], 1)
    player.buyableIntermediate[i] = Decimal.add(player.buyableIntermediate[i], 1)
    mainGL()
}


function toggleUpgradeAutobuy(i) {
    player.upgradeAuto[i] = !player.upgradeAuto[i]
}


function canBuyPrestigeUpgrade(i) {
    if (player.prestigeUpgrades.length >= tmp.prestigeUpgradeCap) {
        return false;
    }
    if (Decimal.sub(player.prestige, tmp.prestigeUsed).lt(PRESTIGE_UPGRADES[i].cost)) {
        return false;
    }
    if (player.prestigeUpgrades.includes(i) && player.prestigeChallenge !== 5) {
        return false;
    }
    return true;
}


function buyPrestigeUpgrade(i) {
    if (!canBuyPrestigeUpgrade(i)) {
        return;
    }
    player.prestigeUpgrades.push(i)
    player.prestigeUpgradesInCurrentAscension = true
}


function togglePrestigeChallenge(i) {
    if (!(player.prestigeChallenge === i || player.prestigeChallenge === null)) {
        return;
    }
    tmp.prestigeAmount = D(0)
    if (player.prestigeChallenge === null) {
        doPrestigeReset(true)
        player.prestigeChallenge = i
        return;
    }
    if (Decimal.gte(player.points, PRESTIGE_CHALLENGES[i].goal)) {
        if (!player.prestigeChallengeCompleted.includes(i)) {
            player.prestigeChallengeCompleted.push(i)
        }
    }
    doPrestigeReset(true)
    player.prestigeChallenge = null
}


function toggleCurrentPrestigeChallenge() {
    togglePrestigeChallenge(player.prestigeChallenge)
}


function doAscendReset(doAnyway = false) {
    if (!doAnyway) {
        if (tmp.ascendAmount.lte(0)) {
            return;
        }
    }


    if (player.inSetback && tmp.ascendAmount.gt(0)) {
        player.inSetback = false
        player.setbackLoadout.push(player.setback)
    }


    for (let i = 0; i < player.setback.length; i++) {
        player.setbackQuarks[i] = D(0)
        player.setbackEnergy[i] = D(0)
        for (let j = 0; j < player.quarkDimsAccumulated[i].length; j++) {
            player.quarkDimsBought[i][j] = D(0)
            player.quarkDimsAccumulated[i][j] = D(0)
        }
    }


    player.ascend = Decimal.add(player.ascend, tmp.ascendAmount)
    player.timeInAscend = D(0)
    player.prestigeUpgradesInCurrentAscension = false
    player.prestigeChallengeCompleted = []
    player.prestigeChallenge = null
    player.prestigeUpgrades = []
    player.prestige = D(0)
    player.bestPointsInAscend = D(0)
    tmp.prestigeAmount = D(0)
    tmp.prestigeNext = D(0)
    tmp.prestigeUsed = D(0)
    tmp.prestigeUpgradeCap = 0
    tmp.prestigePointEffect = D(1)
    doPrestigeReset(true)


    displaySetbackCompleted()
}


function buyAscendUpgrade(i) {
    if (!ASCENSION_UPGRADES[i].req) {
        return;
    }
    if (Decimal.gte(player.ascendUpgrades[i], ASCENSION_UPGRADES[i].cap)) {
        return;
    }
    if (Decimal.lt(player.ascendGems, ASCENSION_UPGRADES[i].cost)) {
        return;
    }
    player.ascendGems = Decimal.sub(player.ascendGems, ASCENSION_UPGRADES[i].cost)
    player.ascendUpgrades[i] = Decimal.add(player.ascendUpgrades[i], 1)
}


function toggleSetback() {
    if (Decimal.eq(player.setback[0], 0) && Decimal.eq(player.setback[1], 0) && Decimal.eq(player.setback[2], 0)) {
        return
    }
    if (player.inSetback) {
        player.inSetback = false
        doAscendReset(true)
    } else {
        doAscendReset(true)
        player.inSetback = true
    }
}


function displaySetbackCompleted() {
    let txt = ``
    for (let i = 0; i < player.setbackLoadout.length; i++) {
        txt += `
            <div style="background-color: #${player.currentSetback === i ? '006060' : '404040'}80; border: 3px solid #${player.currentSetback === i ? '00ff' : 'ffff'}ff; width: 400px; height: 160px">
                <div style="display: flex; flex-direction: column; align-items: center; font-size: 12px; font-family: Verdana">
                    <span style="color: #ffffff; font-size: 16px">Total Difficulty: <b>${format(Decimal.add(player.setbackLoadout[i][0]).add(player.setbackLoadout[i][1]).add(player.setbackLoadout[i][2]))}</b></span>
                    <span style="color: #ff0000">Red: <b>${format(player.setbackLoadout[i][0])}</b></span>
                    <span style="color: #ff0000">This will generate <b>${format(Decimal.add(player.setbackLoadout[i][0]).add(player.setbackLoadout[i][1]).add(player.setbackLoadout[i][2]).pow(2).mul(Decimal.pow(player.setbackLoadout[i][0], 2)))}</b> base red quarks per second.</span>
                    <span style="color: #00ff00">Green: <b>${format(player.setbackLoadout[i][1])}</b></span>
                    <span style="color: #00ff00">This will generate <b>${format(Decimal.add(player.setbackLoadout[i][0]).add(player.setbackLoadout[i][1]).add(player.setbackLoadout[i][2]).pow(2).mul(Decimal.pow(player.setbackLoadout[i][1], 2)))}</b> base green quarks per second.</span>
                    <span style="color: #0000ff">Blue: <b>${format(player.setbackLoadout[i][2])}</b></span>
                    <span style="color: #0000ff">This will generate <b>${format(Decimal.add(player.setbackLoadout[i][0]).add(player.setbackLoadout[i][1]).add(player.setbackLoadout[i][2]).pow(2).mul(Decimal.pow(player.setbackLoadout[i][2], 2)))}</b> base blue quarks per second.</span>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: center">
                    <button onclick="useSetback(${i})" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        ${player.currentSetback === i ? 'Unuse' : 'Use'}
                    </button>
                    <button onclick="deleteSetback(${i})" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        Delete
                    </button>
                    <button onclick="setUsingSetback(${i})" style="color: #ffffff; background-color: #80808080; border: 3px solid #ffffff; font-family: Verdana; height: 25px; width: 100px; font-size: 12px; margin: 2px; cursor: pointer">
                        Set Difficulty
                    </button>
                </div>
            </div>
        `
    }
    html['setbackLoadoutList'].setHTML(txt)
}


function useSetback(i) {
    if (player.currentSetback === i) {
        player.currentSetback = null
    } else {
        player.currentSetback = i
    }
    doAscendReset(true)
}


function deleteSetback(i) {
    if (confirm('Are you sure you want to delete this setback? You will have to do the setback with the same settings again!')) {
        if (player.currentSetback === i) {
            player.currentSetback = null
        }
        if (player.currentSetback > i) {
            player.currentSetback -= 1
        }
        player.setbackLoadout.splice(i, 1)
    }
    displaySetbackCompleted()
}


function setUsingSetback(i) {
    html['setbackSliderRed'].el.value = player.setbackLoadout[i][0]
    html['setbackSliderGreen'].el.value = player.setbackLoadout[i][1]
    html['setbackSliderBlue'].el.value = player.setbackLoadout[i][2]
    player.setback = player.setbackLoadout[i]
    displaySetbackCompleted()
}


function buySBDim(i, j) {
    if (Decimal.gte(player.setbackEnergy[i], tmp.quarkDim[i][j].cost)) {
        player.setbackEnergy[i] = player.setbackEnergy[i].sub(tmp.quarkDim[i][j].cost)
        player.quarkDimsBought[i][j] = Decimal.add(player.quarkDimsBought[i][j], 1)
        setbackGL()
    }
}


setTimeout(gameLoop, 1000)



