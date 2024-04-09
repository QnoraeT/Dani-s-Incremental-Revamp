"use strict";

const el = id => document.getElementById(id);

try {
    clearInterval(INTERVALYUM);
} catch {
    console.log(`cannot clear intervalyum`);
}

let INTERVALYUM;

try {
    INTERVALYUM = setInterval(doThing, 100);
} catch {
    console.log(`cannot set intervalyum`);
}

const abbSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];
const abbExp = 1e66;

function format(num, pv, epv) {
    if (num < 0) { return "-" + format(-num, pv, epv) }
    if (Math.abs(num) <= 1e-15) { return (0).toFixed(pv) }
    if (!Number.isFinite(num)) return "Infinity";
    if (Number.isNaN(num)) return "NaN";
    if (num < 0.001) {
        return "1 / " + format(1 / num, pv, epv);
    } else if (num < 1e6) {
        return num.toFixed(pv).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } else if (num < abbExp) {
        let abb = Math.floor(Math.log10(num) / 3.0000001)
        return num / (10 ** (3.0000001 * abb)).toFixed(epv) + " " + abbSuffixes[abb];
    }
}

let player = {
    time: 0,
    name: "Player",
    hp: 20,
    maxhp: 20,
    xp: 0,
    dispXP: 0,
    level: 1,
    atk: 3,
    def: 1,
    speed: 0.2,
    progress: 0,
    crit: [0.04, 2],
    state: 0,
    stage: 0,
    difficulty: [0],
    rewards: [0, 0, 0, 0, 0, 0]
}

function doThing() {
    update()
    document.body.style['background-color'] = '#000'
    document.body.innerHTML = `
    <div style="color: #fff; display: flex; justify-content: center;">
        <div style="background-color: #111; border: 0.4vw solid #222; width: 80vw; height: 50vw; display: flex; justify-content: center;">
            <div style="padding: 1vw; background-color: #111; border: 0.4vw solid #222; width: 35vw; height: 20vw;">
                <span style="font-size: 3vw; margin-bottom: 0.5vw;"><b>${player.name}</b></span>  <span style="color: #ff0; font-size: 1.4vw">Level: <span style="font-size: 1.8vw"><b>${format(player.level + 1)}</b></span> (${format(player.dispXP)} / ${format(player.nextXP)})</span>
                <span style="color: #f00; font-size: 2vw">HP: <span style="font-size: 2.5vw"><b>${format(player.hp)}<b></span> / ${format(player.maxhp)}</span>
                <div style="width: 15vw; height: 1vw; margin-bottom: 4vw; position: relative">
                    <div style="height: 0.5vw; position: absolute; z-index: 1; width: 100%; background-color: #660; border: 0.3vw solid #440"></div>
                    <div style="height: 0.5vw; position: absolute; z-index: 2; width: ${player.dispXP / player.nextXP * 100}%; background-color: #ff0; border: 0.3vw solid #cc0"></div>
                <div>
                <div style="width: 25vw; height: 2vw; margin-bottom: 4vw; position: relative">
                    <div style="height: 1vw; position: absolute; z-index: 1; width: 100%; background-color: hsl(${player.hp / player.maxhp * 120}, 100%, 35%); border: 0.3vw solid hsl(${player.hp / player.maxhp * 120}, 100%, 20%)"></div>
                    <div style="height: 1vw; position: absolute; z-index: 2; width: ${player.hp / player.maxhp * 100}%; background-color: hsl(${player.hp / player.maxhp * 120}, 100%, 50%); border: 0.3vw solid hsl(${player.hp / player.maxhp * 120}, 100%, 35%)"></div>
                <div>
                <div style="width: 25vw; height: 2vw; margin-bottom: 4vw; position: relative">
                    <div style="height: 1vw; position: absolute; z-index: 1; width: 100%; background-color: #444; border: 0.3vw solid #333"></div>
                    <div style="height: 1vw; position: absolute; z-index: 2; width: ${player.progress * 100}%; background-color: #fff; border: 0.3vw solid #ccc"></div>
                <div>
                <span style="color: #f80; font-size: 1.4vw; margin-bottom: 0.5vw;">ATK: <span style="font-size: 1.8vw"><b>${format(player.atk, 2)}</b></span></span>
                <span style="color: #0f0; font-size: 1.4vw; margin-bottom: 0.5vw;">DEF: <span style="font-size: 1.8vw"><b>${format(player.def, 2)}</b></span></span>
                <span style="color: #fff; font-size: 1.4vw; margin-bottom: 0.5vw;">SPD: <span style="font-size: 1.8vw"><b>${format(1 / player.speed, 3)}</b></span>s</span>
                <span style="color: #ff0; font-size: 1.4vw; margin-bottom: 0.5vw;">Crit: <span style="font-size: 1.8vw"><b>${format(player.crit[0], 1)}</b></span>%, <span style="font-size: 1.8vw"><b>${format(player.crit[1], 2)}</b></span>x</span>
            </div>
        </div>
    </div>
    `
}

const enemyList = [
    { type: 0, name: "Basic Slime" }
]

function update() {
    let tickRate = 0.1
    player.time += tickRate

    player.regen = 0.01
    player.hp = Math.min(player.maxhp, player.hp + (player.maxhp * tickRate * player.regen))

    // (1+ln((x+10)/110)/3.7164365)^3.7164365
    player.level = ((1 + ((Math.log(player.xp + 10) / 110) / 3.7164365)) ** 3.7164365) - 1
    let levelCalc = (x) => {
        return -2.67525 * (3.73796 - Math.exp(3.71644 * (x ** 0.2690749593057759)))
    }
    player.dispXP = player.xp - levelCalc(Math.floor(player.level))
    player.nextXP = levelCalc(Math.floor(player.level) + 1) - levelCalc(Math.floor(player.level))
    player.maxhp = 20
    player.atk += player.rewards[0]
    player.atk = 3
    player.atk += player.rewards[1]
    player.def = 1
    player.def += player.rewards[2]
    player.speed = 0.2
    player.speed += player.rewards[3]
    player.crit[0] = 0.04 // 4 %
    player.crit[1] = 2 // 2x

    if (player.state === 1) {
        player.progress = player.progress + (tickRate * player.speed)
    }

}