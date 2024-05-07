"use strict";

// calc
// https://github.com/QnoraeT/Dani-s-Incremental-Revamp/blob/main/src/utils/break_eternity.js
const el = id => document.getElementById(id);

function fixedMod(x, d) {
    return ((x % d) + d) % d;
}

Decimal.prototype.clone = function() {
    return this;
}

Decimal.prototype.dilate = function(power) {
    if (this.lt(1)) { this.clone() }
    return this.clone().log10().pow(power).pow10();
}

function D(x) { return new Decimal(x); }

function scale(num, type, inverse = false, start, str, powScale) {
    if (num.lte(start)) { return num; }
    str = Decimal.pow(powScale, str);
    switch (type) {
        // Polynomial
        case 0:
        case 0.1:
        case "P":
        case "P1":
            return inverse
                    ? num.sub(start).mul(str).div(start).add(1).root(str).mul(start)
                    : num.div(start).pow(str).sub(1).mul(start).div(str).add(start)
        case 0.2: // alemaninc
        case "P2":
            return inverse
                    ? num.div(start).root(str).sub(1).mul(str).add(1).mul(start)
                    : num.div(start).sub(1).div(str).add(1).pow(str).mul(start)
        // Exponential
        case 1:
        case 1.1:
        case "E":
        case "E1":
            return inverse 
                    ? Decimal.min(num, num.div(start).log(str).add(1).mul(start))
                    : Decimal.max(num, Decimal.pow(str, num.div(start).sub(1)).mul(start))
        case 1.2:
        case "E2":
            return inverse
                    ? num.mul(str).mul(str.ln()).div(start).lambertw().mul(start).div(str.ln())
                    : Decimal.pow(str, num.div(start).sub(1)).mul(num)
        case 1.3: // alemaninc
        case "E3":
            return inverse // poly exponential scaling
                    ? num.div(start).ln().mul(str.sub(1)).add(1).root(str.sub(1)).mul(start)
                    : num.div(start).pow(str.sub(1)).sub(1).div(str.sub(1)).exp().mul(start)
        // Semi-exponential
        case 2: 
        case 2.1:
        case "SE":
        case "SE1":
            return inverse // steep scaling
                    ? Decimal.pow(start, num.sub(start).mul(str).add(start).log(start).root(str))
                    : Decimal.pow(start, num.log(start).pow(str)).sub(start).div(str).add(start)
        case 2.2:
        case "SE2": // very shallow scaling
            return inverse
                    ? Decimal.pow(start, num.log(start).sub(1).mul(str).add(1).root(str))
                    : Decimal.pow(start, num.log(start).pow(str).sub(1).div(str).add(1))
        // convergent
        case 3: // alemaninc
        case 3.1:
        case "C":
        case "C1":
            return inverse
                    ? str.mul(num).add(start.pow(2)).sub(start.mul(num).mul(2)).div(str.sub(num))
                    : str.mul(num).sub(start.pow(2)).div(p.sub(start.mul(2)).add(num));
        default:
            throw new Error(`Scaling type ${type} doesn't exist`);
    }
}

/**
 * e ^ (((x + s) ^ p / (p * s ^ (p - 1))) - s / p)
 * @param {Decimal} x 
 * @param {Decimal} exp 
 * @param {Decimal} poly 
 * @param {Decimal} start 
 * @param {Boolean} inverse
 * if exp = 1, then theres no exp term
 */
function expPoly(x, exp, poly, start, inverse) {
    x = D(x);
    exp = D(exp);
    poly = D(poly);
    start = D(start);

    if (exp.eq(1)) {
        return inverse
        ? x.add(start.div(poly)).mul(poly.mul(start.pow(poly.sub(1)))).root(poly).sub(start)
        : x.add(start).pow(poly).div(poly.mul(start.pow(poly.sub(1)))).sub(start.div(poly))
    } else {
        return inverse
        ? x.log(exp).add(start.div(poly)).mul(poly.mul(start.pow(poly.sub(1)))).root(poly).sub(start)
        : exp.pow(x.add(start).pow(poly).div(poly.mul(start.pow(poly.sub(1)))).sub(start.div(poly)))
    }

}

// format
const abbSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
                    "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];

const timeList = [
    { name: "pt",  stop: true,  amt: 5.39e-44    },
    { name: "qs",  stop: true,  amt: 1 / 1e30    },
    { name: "rs",  stop: true,  amt: 1 / 1e27    },
    { name: "ys",  stop: true,  amt: 1 / 1e24    },
    { name: "zs",  stop: true,  amt: 1 / 1e21    },
    { name: "as",  stop: true,  amt: 1 / 1e18    },
    { name: "fs",  stop: true,  amt: 1 / 1e15    },
    { name: "ps",  stop: true,  amt: 1 / 1e12    },
    { name: "ns",  stop: true,  amt: 1 / 1e9     },
    { name: "µs",  stop: true,  amt: 1 / 1e6     },
    { name: "ms",  stop: true,  amt: 1 / 1e3     },
    { name: "s",   stop: true,  amt: 1           },
    { name: "m",   stop: false, amt: 60          },
    { name: "h",   stop: false, amt: 3600        },
    { name: "d",   stop: false, amt: 86400       },
    { name: "mo",  stop: false, amt: 2592000     },
    { name: "y",   stop: false, amt: 3.1536e7    },
    { name: "mil", stop: false, amt: 3.1536e10   },
    { name: "uni", stop: false, amt: 4.320432e17 },
];

const abbExp = 1e66;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function format(number, dec = 0, expdec = 3) {
    let n = new Decimal(number);
    if (n.lt(0)) return "-" + format(n.negate(), dec, expdec);
    if (n.eq(0)) return (0).toFixed(dec);
    if (Number.isNaN(n.mag)) return "NaN";
    if (!Number.isFinite(n.mag)) return "Infinity";
    if (n.lt(0.001)) {
        return "1 / " + format(n.recip(), dec, expdec);
    } else if (n.lt(1e6)) {
        return numberWithCommas(n.toNumber().toFixed(dec));
    } else if (n.lt(abbExp)) {
        let abb = n.log10().mul(0.33333333336666665).floor();
        return n.div(abb.mul(3).pow10()).toNumber().toFixed(expdec) + " " + abbSuffixes[abb];
    } else if (n.lt("e1e6")) {
        let exp = n.log10().mul(1.0000000001).floor();
        return n.div(exp.pow10()).toNumber().toFixed(expdec) + "e" + format(exp, 0, expdec);
    } else if (n.lt("10^^7")) {
        return "e" + format(n.log10(), dec, expdec);
    } else {
        return "F" + format(n.slog(10), dec, expdec);
    }
}

function formatPerc(number, dec = 3, expdec = 3) {
    let n = new Decimal(number);
    if (n.gte(1000)) {
        return format(n, dec, expdec) + "x";
    } else {
        return format(Decimal.sub(100, Decimal.div(100, n)), dec, expdec) + "%";
    }
}

function formatTime(number, dec = 0, expdec = 3, limit = 2) {
    let n = new Decimal(number);
    if (n.lt(0)) return "-" + formatTime(n.negate(), dec, expdec);
    if (n.eq(0)) return (0).toFixed(dec);
    if (Number.isNaN(n.mag)) return "I don't know?";
    if (!Number.isFinite(n.mag)) return "Forever";
    let lim = 0;
    let str = "";
    let end = false;
    for (let i = timeList.length - 1; i >= 0; i--) {
        if (lim >= limit) {
            break;
        }
        if (n.gte(timeList[i].amt)) {
            end = lim + 1 >= limit || timeList[i].stop;
            str = str + " " + format(n.div(timeList[i].amt).sub(end ? 0 : 0.5), end ? dec : 0, expdec) + " " + timeList[i].name;
            n = n.sub(n.div(timeList[i].amt).floor().mul(timeList[i].amt));
            lim++;
            if (timeList[i].stop) {
                break;
            }
        } else {
            if (i === 0) {
                return (str + " " + format(n, dec, expdec) + " s").slice(1);
            }
        }
    }
    return str.slice(1);
}

// game
let tmp = {}
let gameStart = false;

const TICKRATE = 33;

try {
    clearInterval(INTERVALYUM);
} catch {
    console.log(`cannot clear intervalyum`);
}

let INTERVALYUM;

try {
    INTERVALYUM = setInterval(tickGame, TICKRATE);
} catch {
    console.log(`cannot set intervalyum`);
}

try {
    if (player.fabi === undefined) {
        var player = {};
    }
} catch {
    var player = {};

}
initGame();

function initGame() {
    player = {
        story: [0, 0],
        inStory: true,
        name: "",
        gender: 0, // 0 = they/them, 1 = he/him, 2 = she/her
        tab: ["fabi"],
        fabi: {
            pats: D(0),
        }
    }
    tmp = {
        fabiPPS: D(1),
        fabiLevel: D(1),
        fabiXP: D(0),
        fabiNextXP: D(0)
    }

    document.body.style['background-color'] = '#000';
    document.body.innerHTML = `
    <div style="display: flex; justify-content: center; flex-direction: column;">
        <div id="story" style="display: flex; justify-content: center; flex-direction: column;">
            <button id="nextStory" style="width: 13.5vw; height: 4vw; font-family: Tinos; color: #fff; background-color: #222; font-size: 2vw; border: 0.4vw solid #444" onclick="nextStory()">Next</button>
            <div id="storyThing"></div>
        </div>
        <div id="gameplay" style="display: flex; justify-content: center; flex-direction: column; align-items: center">
            <div id="fabi" style="display: flex; flex-direction: column; align-items: center; color: #4aadd4; font-size: 2vw; border: 0.4vw solid #4aadd4; background-color: #204d5f;">
                <span id="fabiPatAll">You have pet FABI <b><span id="fabiPat" style="font-size: 2.5vw;"></span></b> times.</span>
                <span id="fabiLvAll">You are level <b><span id="fabiLv" style="font-size: 2.5vw"></span></b>. (<span id="fabiXPr"></span> / <span id="fabiMaxXP"></span>)</span>
                <button onclick="petFABI()" style="font-family: Tinos; color: #6fbfdf; font-size: 2vw; border: 0.4vw solid #4aadd4; background-color: #204d5f;">
                    Pet FABI <b><span id="fabiPatAmt"></span></b>.
                </button>
            </div>
        </div>
    </div>
    `

    gameStart = true;
}

const STORIES = [
    {
        get story() {
            return [
                `<span style="color: #4aadd4; font-family: Tinos;"><b>FABI: </b>nom. you a vee ?</span>`
            ]
        }
    }
]

function tickGame() {
    tmp.fabiPPS = D(1)
    tmp.fabiLevelBase = D(20)
    tmp.fabiLevel = calcFabiLevel(player.fabi.pats, true).floor()
    tmp.fabiXP = player.fabi.pats.sub(calcFabiLevel(tmp.fabiLevel))
    tmp.fabiNextXP = calcFabiLevel(tmp.fabiLevel.add(1)).sub(calcFabiLevel(tmp.fabiLevel))

    el("story").style.display = (player.inStory) ? "flex" : "none";
    el("gameplay").style.display = (!player.inStory) ? "flex" : "none";
    if (player.inStory) {
        el("storyThing").innerHTML = STORIES[player.story[0]].story[player.story[1]]
    } else {
        el("fabiPat").innerText = format(player.fabi.pats)
        el("fabiLv").innerText = format(tmp.fabiLevel)
        el("fabiXPr").innerText = format(tmp.fabiXP)
        el("fabiMaxXP").innerText = format(tmp.fabiNextXP)
        el("fabiPatAmt").innerText = format(tmp.fabiPPS) + (tmp.fabiPPS.eq(1) ? " time" : " times")
    }
}

function calcFabiLevel(x, inv = false) {
    if (inv) {
        return expPoly(x.add(0.2).div(tmp.fabiLevelBase).add(1).log2().add(100.5).log(1.01).sub(463.316), 1, 2, 1000, true).add(1)
    } else {
        return expPoly(x.sub(1), 1, 2, 1000, false).add(463.316).pow_base(1.01).sub(100.5).pow_base(2).sub(1).mul(tmp.fabiLevelBase).sub(0.2)
    }
}

function petFABI() {
    player.fabi.pats = player.fabi.pats.add(tmp.fabiPPS)
}